import * as puppeteer from 'puppeteer';
import fs = require('fs');

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
  oneYearReserved: number;
  threeYearReserved: number;
  threeYearReservedWithAzureHybridBenefit: number;
}

(async function() {
  console.log();

  let culture = 'en-au';
  let currency = 'AUD';
  let operatingSystem = 'windows';
  let region = 'australia-southeast'

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
    await page.goto(`https://azure.microsoft.com/en-au/pricing/details/virtual-machines/windows/`);

    await selectCulture(page, config.culture);
    await selectCurrency(page, config.currency);
    await selectOperatingSystem(page, config.operatingSystem, config.culture);
    await selectRegion(page, config.region);

    console.log();

    const vmPricing = await parsePricing(page, config.region);

    console.log();

    writeJson(vmPricing, config.region, config.operatingSystem);
    writeCsv(vmPricing, config.region, config.operatingSystem);
  }
  finally
  {
    if (browser) {
      await browser.close();
    }
  }
}());

function writeJson(vmPricing: VmPricing[], region: string, operatingSystem: string): void {
  const outFilename = `./out/vm-pricing_${region}_${operatingSystem}.json`;

  fs.writeFile(outFilename, JSON.stringify(vmPricing, null, 2), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log('Saved:', outFilename);
  });
}

function writeCsv(vmPricing: VmPricing[], region: string, operatingSystem: string): void {
  const outFilename = `./out/vm-pricing_${region}_${operatingSystem}.csv`;

  var writer = fs.createWriteStream(outFilename);
  writer.write('INSTANCE,VCPU,RAM,PAY AS YOU GO,ONE YEAR RESERVED,THREE YEAR RESERVED, THREE YEAR RESERVED WITH AZURE HYBRID BENEFIT\n');

  const writePrice = function writePrice(price: number): string {
    if (price === undefined) {
      return 'N/A';
    }

    return price.toString();
  }

  vmPricing.forEach(vm => writer.write(`${vm.instance},${vm.vCpu},${vm.ram},${writePrice(vm.payAsYouGo)},${writePrice(vm.oneYearReserved)},${writePrice(vm.threeYearReserved)},${writePrice(vm.threeYearReservedWithAzureHybridBenefit)}\n`));

  writer.end();
  console.log('Saved:', outFilename);
}

async function selectCulture(page: puppeteer.Page, culture: string): Promise<void> {
  console.log('Selecting culture:', culture);

  const selector = '#dropdown-cultures select';

  await setSelectWithNavigation(page, selector, culture);
}

async function selectCurrency(page: puppeteer.Page, currency: string): Promise<void> {
  console.log('Selecting currency:', currency);

  const selector = '#dropdown-currency select';

  await setSelectWithoutNavigation(page, selector, currency)  ;
}

async function selectOperatingSystem(page: puppeteer.Page, operatingSystem: string, culture: string): Promise<void> {
  console.log('Selecting operating system:', operatingSystem);

  const selector = '#vm-type';
  const value = `/${culture}/pricing/details/virtual-machines/${operatingSystem}/`;

  await setSelectWithNavigation(page, selector, value);
}

async function selectRegion(page: puppeteer.Page, region: string): Promise<void> {
  console.log('Selecting region:', region);

  const selector = '#region-selector';

  await setSelectWithoutNavigation(page, selector, region);
}

async function parsePricing(page: puppeteer.Page, region: string): Promise<VmPricing[]> {
  return <VmPricing[]> await page
    .evaluate((selectedRegion: string) => {
      const pricing =
        Array.from(document.querySelectorAll('.sd-table:not(.pricing-unavailable) tbody tr'))
        .map(tr => {
          let isActive = tr.querySelector('.column-1 > span.active') !== null;

          const getInstance = function getInstance(tr: Element): string {
            const instanceIndex = tr.querySelector('.column-1').hasAttribute('style') ? 1 : 2;

            let instance = (<HTMLTableDataCellElement> tr.querySelector(`.column-${instanceIndex}`)).innerHTML;
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
            let vCpu = (<HTMLTableDataCellElement> tr.querySelector('.column-3')).innerHTML;

            const indexOfSlash = vCpu.indexOf('/');

            if (indexOfSlash > -1) {
              vCpu = vCpu.substr(indexOfSlash + 1);
            }

            return Number.parseInt(vCpu.trim());
          }

          const vCpu = getCpu(tr);

          const getRam = function getRam(tr: Element): number {
            let ram = (<HTMLTableDataCellElement> tr.querySelector('.column-4')).innerHTML;

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

          const getPrice = function getPrice(tr: Element, columnSelector: string, region: string): number {
            const span = <HTMLSpanElement> tr.querySelector(columnSelector + ' > span');

            if (span == null) {
              return undefined;
            }

            const priceText = span.innerText;

            let firstDigitOffset = -1;
            const firstSlashOffset = priceText.indexOf('/');

            for (let priceTextOffset = 0; priceTextOffset < priceText.length; priceTextOffset++)
            {
              if (priceText[priceTextOffset] >= '0' && priceText[priceTextOffset] <= '9')
              {
                firstDigitOffset = priceTextOffset;
                break;
              }
            }

            if (firstDigitOffset > -1 && firstSlashOffset > firstDigitOffset) {
              return Number.parseFloat(priceText.substring(firstDigitOffset, firstSlashOffset));
            }
            else {
              return undefined;
            }
          };

          const payAsYouGo = getPrice(tr, '.column-6', selectedRegion);
          const oneYearReserved = getPrice(tr, '.column-7', selectedRegion);
          const threeYearReserved = getPrice(tr, '.column-8', selectedRegion);
          const threeYearReservedWithAzureHybridBenefit = getPrice(tr, '.column-9', selectedRegion);

          return <VmPricing> {
            instance: instance,
            vCpu: vCpu,
            ram: ram,
            payAsYouGo: payAsYouGo,
            oneYearReserved: oneYearReserved,
            threeYearReserved: threeYearReserved,
            threeYearReservedWithAzureHybridBenefit: threeYearReservedWithAzureHybridBenefit
          };
        })
        .filter(p => p != null);

      return pricing;
    }, region);
}

async function setSelectWithNavigation(page: puppeteer.Page, selector: string, value: string): Promise<void> {
  await page.waitForSelector(selector, { visible: true });

  const selectedValue = await page
    .evaluate((s: string) => {
      var selectElement = <HTMLSelectElement> document.querySelector(s);

      if (selectElement != null) {
        return selectElement.selectedOptions[0].value;
      }

      return undefined;
    }, selector);

  console.log('- Currently selected value is:', selectedValue);

  if (selectedValue === value)
  {
    console.log('- The value is selected already');
    return;
  }

  await Promise.all([
    page.waitForNavigation({
      timeout: 5000
    }),
    page.select(selector, value)
  ]);
}

async function setSelectWithoutNavigation(page: puppeteer.Page, selector: string, value: string): Promise<void> {
  await page.waitForSelector(selector, { visible: true });
  await page.select(selector, value);
}
