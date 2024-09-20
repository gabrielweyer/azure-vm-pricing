const fs = require('fs');
import { VmPricing } from './vmPricing';

export function writeJson(vmPricing: VmPricing[], region: string, operatingSystem: string, outputPath: string): void {
  const outFilename = `${outputPath}/vm-pricing_${region}_${operatingSystem}.json`;

  fs.writeFile(outFilename, JSON.stringify(vmPricing, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }

    console.log('Saved:', outFilename);
  });
}

export function writeCsv(vmPricing: VmPricing[], culture: string, region: string, operatingSystem: string, outputPath: string): void {
  const outFilename = `${outputPath}/vm-pricing_${region}_${operatingSystem}.csv`;

  const writer = fs.createWriteStream(outFilename);
  writer.write('INSTANCE,VCPU,RAM,PAY AS YOU GO,PAY AS YOU GO WITH AZURE HYBRID BENEFIT,ONE YEAR RESERVED,ONE YEAR RESERVED WITH AZURE HYBRID BENEFIT,THREE YEAR RESERVED,THREE YEAR RESERVED WITH AZURE HYBRID BENEFIT,SPOT,SPOT WITH AZURE HYBRID BENEFIT,ONE YEAR SAVINGS PLAN,ONE YEAR SAVINGS PLAN WITH AZURE HYBRID BENEFIT,THREE YEAR SAVINGS PLAN,THREE YEAR SAVINGS PLAN WITH AZURE HYBRID BENEFIT\n');

  const writePrice = function writePrice(price: number): string {
    if (price === undefined) {
      return 'N/A';
    }

    if (commaDecimalPointCountries.indexOf(culture) > -1) {
      return `"${price.toString().replace('.', ',')}"`;
    }

    return price.toString();
  };

  vmPricing.forEach(vm => writer.write(`${vm.instance},${vm.vCpu},${vm.ram},${writePrice(vm.payAsYouGo)},${writePrice(vm.payAsYouGoWithAzureHybridBenefit)},${writePrice(vm.oneYearReserved)},${writePrice(vm.oneYearReservedWithAzureHybridBenefit)},${writePrice(vm.threeYearReserved)},${writePrice(vm.threeYearReservedWithAzureHybridBenefit)},${writePrice(vm.spot)},${writePrice(vm.spotWithAzureHybridBenefit)},${writePrice(vm.oneYearSavingsPlan)},${writePrice(vm.oneYearSavingsPlanWithAzureHybridBenefit)},${writePrice(vm.threeYearSavingsPlan)},${writePrice(vm.threeYearSavingsPlanWithAzureHybridBenefit)}\n`));

  writer.end();
  console.log('Saved:', outFilename);
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
