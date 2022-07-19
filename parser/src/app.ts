import * as puppeteer from 'puppeteer';
const fs = require('fs');
const { performance } = require('perf_hooks');

interface AzureVmPricingConfig {
  culture: string;
  currency: string;
  operatingSystem: string;
  region: string;
}

interface VmPricing {
  instance: string;
  vCpu: number;
  ram: number;
  payAsYouGo: number;
  payAsYouGoWithAzureHybridBenefit: number;
  oneYearReserved: number;
  oneYearReservedWithAzureHybridBenefit: number;
  threeYearReserved: number;
  threeYearReservedWithAzureHybridBenefit: number;
  spot: number;
  spotWithAzureHybridBenefit: number;
}

interface PartialVmPricing {
  azureHybridBenefit: boolean;
  instance: string;
  vCpu: number;
  ram: number;
  payAsYouGo: number;
  oneYearReserved: number;
  threeYearReserved: number;
  spot: number;
}

interface LogMessage {
  loggedAt: Date,
  level: 'warn' | 'error',
  args: any[]
}

let recordTiming = false;
let previousPerformanceNow = 0;
let wasSuccessful = false;
const logMessages: LogMessage[] = [];

const consoleWarn = console.warn

console.warn = function(...args) {
  consoleWarn.apply(console, args);
  logMessage('warn', args);
}

const consoleError = console.error

console.error = function(...args) {
  consoleError.apply(console, args);
  logMessage('error', args);
}

function logMessage(level: 'warn' | 'error', args: any[]): void {
  logMessages.push(<LogMessage> {
    loggedAt: new Date(),
    level: level,
    args: args
  });
}

function timeEvent(eventName: string): void {
  if (!recordTiming) return;

  const happenedAt = Math.round(performance.now());
  console.log(eventName, happenedAt, 'Elapsed', happenedAt - previousPerformanceNow);
  previousPerformanceNow = happenedAt;
}

const blockedUrls = [
  'https://www.microsoft.com/library/svy/azure/broker.js',
];

const blockedDomains = [
  'https://munchkin.marketo.net/',
  'https://cdnssl.clicktale.net/',
  'https://publisher.liveperson.net/',
  'https://www.facebook.com/',
  'https://googleads.g.doubleclick.net/',
  'https://dc.ads.linkedin.com/',
  'https://dpm.demdex.net/',
  'https://mscom.demdex.net/',
  'https://msftenterprise.sc.omtrdc.net/',
  'https://cm.everesttech.net/',
  'https://sync.mathtag.com/',
  'https://ib.adnxs.com/',
  'https://idsync.rlcdn.com/',
  'https://cm.g.doubleclick.net/',
  'https://rtd.tubemogul.com/',
  'https://idpix.media6degrees.com/',
  'https://ad.doubleclick.net/'
];

const blockedFiles = [
  '/LivePersonChat-iframe.js'
];

function isBlocked(url: string): boolean {
  if (blockedUrls.includes(url)) {
    return true;
  }

  for (let offset = 0; offset < blockedDomains.length; offset++) {
    if (url.startsWith(blockedDomains[offset])) {
      return true;
    }
  }

  for (let offset = 0; offset < blockedFiles.length; offset++) {
    if (url.endsWith(blockedFiles[offset])) {
      return true;
    }
  }

  return false;
}

(async function() {
  recordTiming = false;
  const runHeadless = true;
  timeEvent('crawlerStartedAt');

  let culture = 'en-au';
  let currency = 'aud';
  let operatingSystem = 'windows';
  let region = 'australia-southeast'

  if (!process.argv[1].endsWith('app.ts')) {
    return;
  }

  console.log();

  const args = process.argv.slice(2);

  for (let offset = 0; offset < args.length - 1; offset += 2) {
    switch (args[offset]) {
      case '-l':
      case '--culture':
        culture = args[offset + 1];
        break;
      case '-c':
      case '--currency':
        currency = args[offset + 1];
        break;
      case '-o':
      case '--operating-system':
        operatingSystem = args[offset + 1];
        break;
      case '-r':
      case '--region':
        region = args[offset + 1];
        break;
      default:
        console.log(`'${args[offset]}' is not a known switch, supported values are: '-l', '--culture', '-c', '--currency', '-o', '--operating-system', '-r', '--region'`)
        break;
    }
  }

  const config: AzureVmPricingConfig = {
    culture: culture,
    currency: currency.toLowerCase(),
    operatingSystem: operatingSystem,
    region: region
  }

  timeEvent('chromeStartedAt');
  const browser = await puppeteer.launch({headless: runHeadless});
  const page = await browser.newPage();
  timeEvent('chromeLaunchedAt');

  try
  {
    timeEvent('pageCreateStartedAt');
    page.setDefaultNavigationTimeout(60000);
    page.setRequestInterception(true);
    timeEvent('pageCreateCompletedAt');

    page.on('request', req => {
      const url = req.url();

      if (isBlocked(url)) {
        req.abort();
        return;
      }

      req.continue();
    });

    page.on('console', (log) => {
      const text = log.text();
      const location = log.location();

      if (text === 'Failed to load resource: net::ERR_FAILED' && isBlocked(location.url)) {
        return;
      }

      console[log.type()](text);
    });

    console.log('Culture:', config.culture);
    console.log('Operating System:', config.operatingSystem);

    timeEvent('pageLoadStartedAt');
    await page.goto(`https://azure.microsoft.com/${config.culture}/pricing/details/virtual-machines/${config.operatingSystem}/`);
    timeEvent('pageLoadCompletedAt');

    const actualCulture = page.url().substring(28, 33);

    if (actualCulture !== config.culture) {
      throw `The culture "${config.culture}" is not supported.`;
    }

    await waitForApplicableVirtualMachinesAnnouncement(page);

    timeEvent('currencySelectionStartedAt');
    await selectCurrency(page, config.currency);
    timeEvent('currencySelectionCompletedAt');

    timeEvent('regionSelectionStartedAt');
    await selectRegion(page, config.region);
    timeEvent('regionSelectionCompletedAt');

    timeEvent('hourlyPricingSelectionStartedAt');
    await selectHourlyPricing(page);
    timeEvent('hourlyPricingSelectionCompletedAt');

    console.log();

    timeEvent('parsePricingStartedAt');
    await page.addScriptTag({ content: `${getPrice} ${getPricing}`});
    const vmPricing = await parsePricing(page);
    timeEvent('parsePricingCompletedAt');

    console.log();

    writeJson(vmPricing, config.region, config.operatingSystem);
    writeCsv(vmPricing, config.culture, config.region, config.operatingSystem);
    wasSuccessful = true;
  }
  finally
  {
    if (!wasSuccessful) {
      const logFilename = `./out/log/${culture}_${currency}.json`;

      fs.writeFile(logFilename, JSON.stringify(logMessages.length > 0 ? logMessages : 'No log messages recorded'), function(err) {
        if (err) {
            return console.error(err);
        }
      });
    }

    if (browser) {
      if (!wasSuccessful && page) {
        await page.screenshot({ path: `./out/log/${culture}_${currency}.png`, fullPage: true });
      }
      await browser.close();
    }

    timeEvent('crawlerCompletedAt');
  }
}());

export function getPrice(tr: HTMLTableRowElement, columnSelector: string): number {
  const span = <HTMLSpanElement> tr.querySelector(columnSelector + ' span.price-value');

  if (span == null) {
    return undefined;
  }
  const priceText = span.textContent;

  let firstDigitOffset = -1;

  for (let priceTextOffset = 0; priceTextOffset < priceText.length; priceTextOffset++)
  {
    if (priceText[priceTextOffset] >= '0' && priceText[priceTextOffset] <= '9')
    {
      firstDigitOffset = priceTextOffset;
      break;
    }
  }

  if (firstDigitOffset > -1) {
    let priceWithoutCurrencyAndDuration = priceText.substring(firstDigitOffset);

    const lastIndexOfDot = priceWithoutCurrencyAndDuration.lastIndexOf('.');
    const lastIndexOfComma = priceWithoutCurrencyAndDuration.lastIndexOf(',');

    if (lastIndexOfComma > -1 && lastIndexOfComma > lastIndexOfDot) {
      priceWithoutCurrencyAndDuration = priceWithoutCurrencyAndDuration.replace('.', '').replace(',', '.');
    } else if (lastIndexOfComma > -1) {
      priceWithoutCurrencyAndDuration = priceWithoutCurrencyAndDuration.replace(',', '');
    }

    return Number.parseFloat(priceWithoutCurrencyAndDuration);
  }
  else {
    return undefined;
  }
}

function writeJson(vmPricing: VmPricing[], region: string, operatingSystem: string): void {
  const outFilename = `./out/vm-pricing_${region}_${operatingSystem}.json`;

  fs.writeFile(outFilename, JSON.stringify(vmPricing, null, 2), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log('Saved:', outFilename);
  });
}

const commaDecimalPointCountries = [
  'cs-cz',
  'da-dk',
  'de-de',
  'es-es',
  'fr-fr',
  'fr-ca',
  'id-id',
  'it-it',
  'hu-hu',
  'nb-no',
  'nl-nl',
  'pl-pl',
  'pt-br',
  'pt-pt',
  'sv-se',
  'tr-tr',
  'ru-ru'
];

function writeCsv(vmPricing: VmPricing[], culture: string, region: string, operatingSystem: string): void {
  const outFilename = `./out/vm-pricing_${region}_${operatingSystem}.csv`;

  var writer = fs.createWriteStream(outFilename);
  writer.write('INSTANCE,VCPU,RAM,PAY AS YOU GO,PAY AS YOU GO WITH AZURE HYBRID BENEFIT,ONE YEAR RESERVED,ONE YEAR RESERVED WITH AZURE HYBRID BENEFIT,THREE YEAR RESERVED,THREE YEAR RESERVED WITH AZURE HYBRID BENEFIT,SPOT,SPOT WITH AZURE HYBRID BENEFIT\n');

  const writePrice = function writePrice(price: number): string {
    if (price === undefined) {
      return 'N/A';
    }

    if (commaDecimalPointCountries.indexOf(culture) > -1) {
      return `"${price.toString().replace('.', ',')}"`;
    }

    return price.toString();
  }

  vmPricing.forEach(vm => writer.write(`${vm.instance},${vm.vCpu},${vm.ram},${writePrice(vm.payAsYouGo)},${writePrice(vm.payAsYouGoWithAzureHybridBenefit)},${writePrice(vm.oneYearReserved)},${writePrice(vm.oneYearReservedWithAzureHybridBenefit)},${writePrice(vm.threeYearReserved)},${writePrice(vm.threeYearReservedWithAzureHybridBenefit)},${writePrice(vm.spot)},${writePrice(vm.spotWithAzureHybridBenefit)}\n`));

  writer.end();
  console.log('Saved:', outFilename);
}

async function selectCurrency(page: puppeteer.Page, currency: string): Promise<void> {
  console.log('Selecting currency:', currency);
  const selector = '[name="currency"]';
  await setSelect(page, selector, currency);
}

async function selectRegion(page: puppeteer.Page, region: string): Promise<void> {
  console.log('Selecting region:', region);
  const selector = '[name="region"]';
  const loadingPromise = waitForLoadingRegionalPrices(page);
  const busyMainAppPromise = waitForBusyMainApp(page);
  const setSelectPromise = setSelect(page, selector, region);
  await Promise.all([loadingPromise, busyMainAppPromise, setSelectPromise]);
  const loadedPromise = waitForLoadedRegionalPrices(page);
  const idleMainAppPromise = waitForIdleMainApp(page);
  await Promise.all([loadedPromise, idleMainAppPromise]);
}

async function selectHourlyPricing(page: puppeteer.Page): Promise<void> {
  console.log('Selecting hourly pricing');
  const selector = '[name="unitPricing"]';
  await setSelect(page, selector, 'hour');
}

function getPricing(): PartialVmPricing[] {
  const pricingRowSelector = '.data-table__table:not([style="visibility: hidden;"]) tbody tr';
  const activeInstanceRowSelector = 'td:nth-last-child(1) > span.active';
  let rowCount = 0;
  let activeInstanceRowCount = 0;

  const pricing =
  Array.from(document.querySelectorAll(pricingRowSelector))
  .map((tr: HTMLTableRowElement) => {
    rowCount++;

    const getInstance = function getInstance(tr: Element): string {
      let instance = (<HTMLTableCellElement> tr.querySelector('td:nth-child(1)')).innerHTML;
      const indexOfSup = instance.indexOf('<sup>');

      if (indexOfSup > -1) {
        instance = instance.substring(0, indexOfSup);
      }

      return instance.trim();
    }

    const instance = getInstance(tr);
    let isActive = tr.querySelector(activeInstanceRowSelector) !== null;

    if (!isActive) {
      console.log(`Instance '${instance}' is inactive`);
      return undefined;
    }

    activeInstanceRowCount++;

    const getCpu = function getCpu(tr: Element): number {
      let vCpu = (<HTMLTableCellElement> tr.querySelector('td:nth-child(2)')).innerHTML;

      const indexOfSlash = vCpu.indexOf('/');

      if (indexOfSlash > -1) {
        vCpu = vCpu.substring(indexOfSlash + 1);
      }

      return Number.parseInt(vCpu.trim());
    }

    const vCpu = getCpu(tr);

    const getRam = function getRam(tr: Element): number {
      let ram = (<HTMLTableCellElement> tr.querySelector('td:nth-child(3)')).innerHTML;

      const indexOfGib = ram.indexOf('GiB');

      if (indexOfGib > -1) {
        ram = ram.substring(0, indexOfGib);
      }
      else {
        console.log('Missing unit for RAM')
      }

      return Number.parseFloat(ram.trim());
    }

    const ram = getRam(tr);

    const payAsYouGo = getPrice(tr, 'td:nth-child(5)');
    const oneYearReserved = getPrice(tr, 'td:nth-child(6)');
    const threeYearReserved = getPrice(tr, 'td:nth-child(7)');
    const spot = getPrice(tr, 'td:nth-child(8)');

    if (payAsYouGo === undefined &&
        oneYearReserved === undefined &&
        threeYearReserved === undefined &&
        spot === undefined) {
      console.log(`Instance '${instance}' has no valid prices`);
      return undefined;
    }

    return <PartialVmPricing> {
      instance: instance,
      vCpu: vCpu,
      ram: ram,
      payAsYouGo: payAsYouGo,
      oneYearReserved: oneYearReserved,
      threeYearReserved: threeYearReserved,
      spot: spot
    };
  })
  .filter(p => p != null);

  if (rowCount === 0) {
    throw `Did not find any pricing rows, is the selector "${pricingRowSelector}" still valid?`;
  }

  if (activeInstanceRowCount === 0) {
    throw `Did not find any active instance rows, is the selector "${activeInstanceRowSelector}" still valid?`;
  }

  if (pricing.length === 0) {
    throw `Did not find any prices`;
  }

  return pricing;
}

async function waitForBusyMainApp(page: puppeteer.Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const busyMainAppElement = <HTMLElement> document.querySelector('.app-main[aria-busy="true"]');
      return busyMainAppElement !== null;
    },
    {
      timeout: 5000
    }
  );
}

async function waitForIdleMainApp(page: puppeteer.Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const busyMainAppElement = <HTMLElement> document.querySelector('.app-main[aria-busy="true"]');
      return busyMainAppElement === null;
    },
    {
      timeout: 5000
    }
  );
}

async function waitForLoadingRegionalPrices(page: puppeteer.Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const loadingRegionalPriceDiv = <HTMLDivElement> document.querySelector('.loading-animation');
      return loadingRegionalPriceDiv !== null;
    },
    {
      timeout: 5000
    }
  );
}

async function waitForLoadedRegionalPrices(page: puppeteer.Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const loadingRegionalPriceDiv = <HTMLDivElement> document.querySelector('.loading-animation');
      return loadingRegionalPriceDiv === null;
    },
    {
      timeout: 5000
    }
  );
}

async function waitForApplicableVirtualMachinesAnnouncement(page: puppeteer.Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const applicableVmsAnnouncemnt = <HTMLSpanElement> document.querySelector('#pricing-announcement');
      return applicableVmsAnnouncemnt !== null;
    }
  );
}

async function waitForPriceWithoutHybridBenefits(page: puppeteer.Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const headerCells = <HTMLTableCellElement[]> Array.from(document.querySelectorAll('.data-table__table:not([style="visibility: hidden;"]) thead th:nth-child(n+5):nth-child(-n+8)'));
      const ahbOffset = headerCells.findIndex(c => c.innerText.indexOf('AHB') !== -1);
      return ahbOffset === -1;
    },
    { timeout: 3000 }
  );
}

async function parsePricing(page: puppeteer.Page): Promise<VmPricing[]> {
  const pricingWithHybridBenefits = await page.evaluate(() => getPricing());
  await page.click('button#isAhb');
  await waitForPriceWithoutHybridBenefits(page);
  const pricingWithoutHybridBenefits = await page.evaluate(() => getPricing());

  if (pricingWithHybridBenefits.length !== pricingWithoutHybridBenefits.length) {
    throw `Expected same count of instances with hybrid benefits ${pricingWithHybridBenefits.length} and without ${pricingWithoutHybridBenefits.length}, good luck!`;
  }

  return pricingWithHybridBenefits.map((instanceWithHybridBenefits, o) => {
    const instanceWithoutHybridBenefits = pricingWithoutHybridBenefits[o];

    if (instanceWithHybridBenefits.instance !== instanceWithoutHybridBenefits.instance ||
      instanceWithHybridBenefits.vCpu !== instanceWithoutHybridBenefits.vCpu ||
      instanceWithHybridBenefits.ram !== instanceWithoutHybridBenefits.ram) {
      throw `At offset ${o}, instance "${instanceWithHybridBenefits}" with hybrid benefits does not match instance "${instanceWithoutHybridBenefits}" without`
    }

    return <VmPricing> {
      instance: instanceWithHybridBenefits.instance,
      vCpu: instanceWithHybridBenefits.vCpu,
      ram: instanceWithHybridBenefits.ram,
      payAsYouGo: instanceWithoutHybridBenefits.payAsYouGo,
      payAsYouGoWithAzureHybridBenefit: instanceWithHybridBenefits.payAsYouGo,
      oneYearReserved: instanceWithoutHybridBenefits.oneYearReserved,
      oneYearReservedWithAzureHybridBenefit: instanceWithHybridBenefits.oneYearReserved,
      threeYearReserved: instanceWithoutHybridBenefits.threeYearReserved,
      threeYearReservedWithAzureHybridBenefit: instanceWithHybridBenefits.threeYearReserved,
      spot: instanceWithoutHybridBenefits.spot,
      spotWithAzureHybridBenefit: instanceWithHybridBenefits.spot
    }
  });
}

async function setSelect(page: puppeteer.Page, selector: string, value: string): Promise<void> {
  const fullSelector = `select${selector}`;
  await page.waitForSelector(fullSelector, { visible: true });
  let selectedValue = await page.$eval(fullSelector, node => (<HTMLSelectElement> node).value);

  if (selectedValue !== value) {
    await page.select(fullSelector, value);
    selectedValue = await page.$eval(fullSelector, node => (<HTMLSelectElement> node).value);
  }

  if (selectedValue !== value) {
    throw `Failed to select '${value}' for selector '${fullSelector}', instead selected '${selectedValue}'`
  }
}
