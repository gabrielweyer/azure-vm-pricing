import * as puppeteer from 'puppeteer';
import fs = require('fs');

interface AzureVmPricingConfig {
  culture: string;
  currency: string;
  operatingSystem: string;
  region: string;
  outputFilename: string;
  outputCsv: boolean;
  outputJson: boolean;
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

(async function() {
  let culture = 'en-au';
  let currency = 'AUD';
  let operatingSystem = 'windows';
  let region = 'australia-southeast'
  let outputCsv = true
  let outputJson = true

  if (!process.argv[1].endsWith('app.ts')) {
    return;
  }

  console.log();

  const args = process.argv.slice(2);
  let filename = '';

  for (let offset = 0; offset < args.length; offset += 2) {
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
      case '-O':
      case '--output-filename':
        filename = args[offset + 1];
        break;
      case '-C':
      case '--output-csv-only':
        outputJson = false;
        offset--;
        break;
      case '-J':
      case '--output-json-only':
        outputCsv = false;
        offset--;
        break;
      default:
        console.log(`'${args[offset]}' is not a known switch, supported values are: '-l', '--culture', '-c', '--currency', '-o', '--operating-system', '-r', '--region', '-C', '--output-csv-only', '-J', '--output-json-only', '-O', '--output-filename'`)
        break;
    }
  }

  if (!outputCsv && !outputJson) {
    console.log('Wrong arguments: Both JSON and CSV output are disabled.');
    return;
  }

  const config: AzureVmPricingConfig = {
    culture: culture,
    currency: currency,
    operatingSystem: operatingSystem,
    region: region,
    outputCsv: outputCsv,
    outputJson: outputJson,
    outputFilename: filename !== '' ? filename: `./out/vm-pricing_${region}_${operatingSystem}`
  }

  const browser = await puppeteer.launch({headless: true});

  try
  {
    const page = await browser.newPage();
    page.on('console', (log) => {
      if (log.type() === 'warning' || log.type() === 'error') {
        return;
      }
      console[log.type()](log.text())
    });

    console.log('Culture:', config.culture);
    console.log('Operating System:', config.operatingSystem);
    await page.goto(`https://azure.microsoft.com/${config.culture}/pricing/details/virtual-machines/${config.operatingSystem}/`);

    const actualCulture = page.url().substring(28, 33);

    if (actualCulture !== config.culture) {
      throw `The culture "${config.culture}" is not supported.`;
    }

    await selectCurrency(page, config.currency);
    await selectRegion(page, config.region);

    console.log();

    await page.addScriptTag({ content: `${getPrice} ${getPricing}`});
    const vmPricing = await parsePricing(page, config.region);

    console.log();

    if (config.outputJson) writeJson(vmPricing, config.outputFilename);
    if (config.outputCsv) writeCsv(vmPricing, config.culture, config.outputFilename);
  }
  finally
  {
    if (browser) {
      await browser.close();
    }
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

function writeJson(vmPricing: VmPricing[], outputFilename: string): void {
  const outFilename = `${outputFilename}.json`;

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

function writeCsv(vmPricing: VmPricing[], culture: string, outputFilename: string): void {
  const outFilename = `${outputFilename}.csv`;

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

  const selector = '#currency-dropdown-footer';

  await setSelect(page, selector, currency)  ;
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
    let isActive = tr.querySelector('td:nth-child(1) > span.active') !== null;

    const getInstance = function getInstance(tr: Element): string {
      let instance = (<HTMLTableDataCellElement> tr.querySelector('td:nth-child(2)')).innerHTML;
      const indexOfSup = instance.indexOf('<sup>');

      if (indexOfSup > -1) {
        instance = instance.substring(0, indexOfSup);
      }

      return instance.trim();
    }

    const instance = getInstance(tr);

    if (!isActive) {
      console.log(`Instance '${instance}' is inactive`);
      return undefined;
    }

    const getCpu = function getCpu(tr: Element): number {
      let vCpu = (<HTMLTableDataCellElement> tr.querySelector('td:nth-child(3)')).innerHTML;

      const indexOfSlash = vCpu.indexOf('/');

      if (indexOfSlash > -1) {
        vCpu = vCpu.substr(indexOfSlash + 1);
      }

      return Number.parseInt(vCpu.trim());
    }

    const vCpu = getCpu(tr);

    const getRam = function getRam(tr: Element): number {
      let ram = (<HTMLTableDataCellElement> tr.querySelector('td:nth-child(4)')).innerHTML;

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

    const payAsYouGo = getPrice(tr, 'td:nth-child(6)');
    const payAsYouGoWithAzureHybridBenefit = getPrice(tr, 'td:nth-child(7)');
    const oneYearReserved = getPrice(tr, 'td:nth-child(8)');
    const oneYearReservedWithAzureHybridBenefit = getPrice(tr, 'td:nth-child(9)');
    const threeYearReserved = getPrice(tr, 'td:nth-child(10)');
    const threeYearReservedWithAzureHybridBenefit = getPrice(tr, 'td:nth-child(11)');
    const spot = getPrice(tr, 'td:nth-child(12)');
    const spotWithAzureHybridBenefit = getPrice(tr, 'td:nth-child(13)');

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
  await page.select(`select${selector}`, value);
}
