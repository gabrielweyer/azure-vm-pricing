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

let recordTiming = false;
let previousPerformanceNow = 0;

function timeEvent(eventName: string): void {
  if (!recordTiming) return;

  const happenedAt = Math.round(performance.now());
  console.log(eventName, happenedAt, 'Elapsed', happenedAt - previousPerformanceNow);
  previousPerformanceNow = happenedAt;
}

(async function() {
  recordTiming = false;
  const runHeadless = true;
  timeEvent('crawlerStartedAt');

  let culture = 'en-au';
  let currency = 'AUD';
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
    currency: currency,
    operatingSystem: operatingSystem,
    region: region
  }

  timeEvent('chromeStartedAt');
  const browser = await puppeteer.launch({headless: runHeadless});
  timeEvent('chromeLaunchedAt');

  try
  {
    timeEvent('pageStartedAt');
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    timeEvent('pageStartedAt');

    page.on('console', (log) => {
      if (log.type() === 'warning' || log.type() === 'error') {
        return;
      }
      console[log.type()](log.text())
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

    timeEvent('currencySelectionStartedAt');
    await selectCurrency(page, config.currency);
    timeEvent('currencySelectionCompletedAt');

    timeEvent('regionSelectionStartedAt');
    await selectRegion(page, config.region);
    timeEvent('regionSelectionCompletedAt');

    console.log();

    timeEvent('parsePricingStartedAt');
    await page.addScriptTag({ content: `${getPrice} ${getPricing}`});
    const vmPricing = await parsePricing(page, config.region);
    timeEvent('parsePricingCompletedAt');

    console.log();

    writeJson(vmPricing, config.region, config.operatingSystem);
    writeCsv(vmPricing, config.culture, config.region, config.operatingSystem);
  }
  finally
  {
    if (browser) {
      await browser.close();
    }

    timeEvent('crawlerCompletedAt');
  }
}());

export function getPrice(tr: HTMLTableRowElement, columnSelector: string): number {
  const span = <HTMLSpanElement> tr.querySelector(columnSelector + ' > span');

  if (span == null) {
    return undefined;
  }
  const priceText = span.textContent;

  let firstDigitOffset = -1;
  let separatorOffset = priceText.indexOf('/');

  if (separatorOffset === -1) {
    separatorOffset = priceText.indexOf(' per ');
  }

  if (separatorOffset === -1) {
    separatorOffset = priceText.indexOf(' (~');
  }

  if (separatorOffset === - 1) {
    separatorOffset = priceText.length;
  }

  for (let priceTextOffset = 0; priceTextOffset < priceText.length; priceTextOffset++)
  {
    if (priceText[priceTextOffset] >= '0' && priceText[priceTextOffset] <= '9')
    {
      firstDigitOffset = priceTextOffset;
      break;
    }
  }

  if (firstDigitOffset > -1 && separatorOffset > firstDigitOffset) {
    let priceWithoutCurrencyAndDuration = priceText.substring(firstDigitOffset, separatorOffset);

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

  const selector = '#currency-selector';

  await setSelect(page, selector, currency);
}

async function selectRegion(page: puppeteer.Page, region: string): Promise<void> {
  console.log('Selecting region:', region);

  const selector = '#region-selector';

  await setSelect(page, selector, region);
}

function getPricing(): VmPricing[] {
  const pricingRowSelector = '.data-table__table:not([style="visibility: hidden;"]) tbody tr';

  const pricing =
  Array.from(document.querySelectorAll(pricingRowSelector))
  .map((tr: HTMLTableRowElement) => {
    let isInstanceRow = tr.querySelector('td:nth-last-child(1) > span.wa-conditionalDisplay') !== null;

    if (!isInstanceRow) {
      return undefined;
    }

    const getInstance = function getInstance(tr: Element): string {
      let instance = (<HTMLTableDataCellElement> tr.querySelector('td:nth-child(1)')).innerHTML;
      const indexOfSup = instance.indexOf('<sup>');

      if (indexOfSup > -1) {
        instance = instance.substring(0, indexOfSup);
      }

      return instance.trim();
    }

    const instance = getInstance(tr);
    let isActive = tr.querySelector('td:nth-last-child(1) > span.active') !== null;

    if (!isActive) {
      console.log(`Instance '${instance}' is inactive`);
      return undefined;
    }

    const getCpu = function getCpu(tr: Element): number {
      let vCpu = (<HTMLTableDataCellElement> tr.querySelector('td:nth-child(2)')).innerHTML;

      const indexOfSlash = vCpu.indexOf('/');

      if (indexOfSlash > -1) {
        vCpu = vCpu.substr(indexOfSlash + 1);
      }

      return Number.parseInt(vCpu.trim());
    }

    const vCpu = getCpu(tr);

    const getRam = function getRam(tr: Element): number {
      let ram = (<HTMLTableDataCellElement> tr.querySelector('td:nth-child(3)')).innerHTML;

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

    const payAsYouGo = getPrice(tr, 'td:nth-child(5) span:nth-child(1)');
    const payAsYouGoWithAzureHybridBenefit = getPrice(tr, 'td:nth-child(5) span:nth-child(2)');
    const oneYearReserved = getPrice(tr, 'td:nth-child(6) span:nth-child(1)');
    const oneYearReservedWithAzureHybridBenefit = getPrice(tr, 'td:nth-child(6) span:nth-child(2)');
    const threeYearReserved = getPrice(tr, 'td:nth-child(7) span:nth-child(1)');
    const threeYearReservedWithAzureHybridBenefit = getPrice(tr, 'td:nth-child(7) span:nth-child(2)');
    const spot = getPrice(tr, 'td:nth-child(8) span:nth-child(1)');
    const spotWithAzureHybridBenefit = getPrice(tr, 'td:nth-child(8) span:nth-child(2)');

    return <VmPricing> {
      instance: instance,
      vCpu: vCpu,
      ram: ram,
      payAsYouGo: payAsYouGo,
      payAsYouGoWithAzureHybridBenefit: payAsYouGoWithAzureHybridBenefit,
      oneYearReserved: oneYearReserved,
      oneYearReservedWithAzureHybridBenefit: oneYearReservedWithAzureHybridBenefit,
      threeYearReserved: threeYearReserved,
      threeYearReservedWithAzureHybridBenefit: threeYearReservedWithAzureHybridBenefit,
      spot: spot,
      spotWithAzureHybridBenefit: spotWithAzureHybridBenefit
    };
  })
  .filter(p => p != null);

  if (pricing.length === 0) {
    throw `Did not find any pricing rows, is the selector "${pricingRowSelector}" still valid?`;
  }

  return pricing;
}

async function parsePricing(page: puppeteer.Page, region: string): Promise<VmPricing[]> {
  return <VmPricing[]> await page.evaluate(() => getPricing());
}

async function setSelect(page: puppeteer.Page, selector: string, value: string): Promise<void> {
  await page.waitForSelector(selector, { visible: true });
  const selectedValue = await page.select(`select${selector}`, value);

  if (selectedValue.length != 1 || selectedValue[0] !== value) {
    throw `Failed to select '${value}' for selector '${selector}', instead selected '${selectedValue}'`
  }
}
