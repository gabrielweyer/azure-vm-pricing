import * as puppeteer from 'puppeteer';
import { addUnavailableVms, discardDuplicateVms, PartialVmPricing, VmPricing } from "./vmPricing";
import { isSelectedSelect, setSelect, isSelectedCheckbox } from './puppeteerExtensions';

export class AzurePortal {
  private p: puppeteer.Page;
  private azureHybridBenefitButtonSelector = 'button#isAhb';

  constructor(page: puppeteer.Page) {
    this.p = page;
  }

  async waitForApplicableVirtualMachinesAnnouncement(): Promise<void> {
    await this.p.waitForFunction(
      () => {
        const applicableVmsAnnouncemnt = <HTMLSpanElement> document.querySelector('#pricing-announcement');
        return applicableVmsAnnouncemnt !== null;
      }
    );
  }

  async selectCurrency(currency: string): Promise<void> {
    console.log('Selecting currency:', currency);
    const selector = '[name="currency"]';
    await setSelect(this.p, selector, currency);
  }

  async selectRegion(region: string): Promise<void> {
    console.log('Selecting region:', region);
    const selector = '[name="region"]';
    const isRegionAlreadySelected = await isSelectedSelect(this.p, selector, region);

    if (isRegionAlreadySelected) {
      return;
    }

    const loadingPromise = this.waitForLoadingRegionalPrices();
    const busyMainAppPromise = this.waitForBusyMainApp();
    const setSelectPromise = setSelect(this.p, selector, region);
    await Promise.all([loadingPromise, busyMainAppPromise, setSelectPromise]);
    const loadedPromise = this.waitForLoadedRegionalPrices();
    const idleMainAppPromise = this.waitForIdleMainApp();
    await Promise.all([loadedPromise, idleMainAppPromise]);
    await this.dismissAzureSuggestsRegionPopupIfPresent();
  }

  private async dismissAzureSuggestsRegionPopupIfPresent(): Promise<void> {
    await this.dismissPopupIfPresent('.tooltip-popup-close-btn');
  }

  async selectHourlyPricing(): Promise<void> {
    console.log('Selecting hourly pricing');
    const selector = '[name="unitPricing"]';
    await setSelect(this.p, selector, 'hour');
  }

  async dismissNudgePopupIfPresent(): Promise<void> {
    await this.dismissPopupIfPresent('[data-testid="nudge-popup-close-btn"]');
  }

  private async dismissPopupIfPresent(cssSelector: string): Promise<void> {
    const closeButton = await this.p.$(cssSelector);

    if (closeButton !== null) {
      closeButton.click();
    }
  }

  async selectReservedInstances(): Promise<void> {
    console.log('Selecting reserved instances');
    const selector = '[name="pricingModel"]';
    await setSelect(this.p, selector, 'payg-ri');
  }

  async parsePricing(operatingSystem: string): Promise<VmPricing[]> {
    const operatingSystemWithHybridBenefit = ['windows', 'ml-server-windows', 'sharepoint', 'sql-server-enterprise', 'sql-server-standard', 'sql-server-web']
    const hasHybridBenefit = operatingSystemWithHybridBenefit.includes(operatingSystem);

    const savingsPlanPricing = await this.getUniquePricing();
    let savingsPlanWithHybridBenefits: PartialVmPricing[];
    let savingsPlansWithoutHybridBenefits: PartialVmPricing[];

    if (hasHybridBenefit) {
      savingsPlanWithHybridBenefits = savingsPlanPricing;
      await this.hideAzureHybridBenefit();
      savingsPlansWithoutHybridBenefits = await this.getUniquePricing();
      addUnavailableVms(savingsPlanWithHybridBenefits, savingsPlansWithoutHybridBenefits);
    } else {
      savingsPlansWithoutHybridBenefits = savingsPlanPricing;
    }

    await this.selectReservedInstances();

    const reservedPricing = await this.getUniquePricing();
    let reservedWithHybridBenefits: PartialVmPricing[];
    let reservedWithoutHybridBenefits: PartialVmPricing[];

    if (hasHybridBenefit) {
      reservedWithoutHybridBenefits = reservedPricing;
      await this.showAzureHybridBenefit();
      reservedWithHybridBenefits = await this.getUniquePricing();
      addUnavailableVms(reservedWithHybridBenefits, reservedWithoutHybridBenefits);
    } else {
      reservedWithoutHybridBenefits = reservedPricing;
    }

    // Sometimes instances are available as reserved and not as savings plan, hoping that reserved is always a superset of savings plan
    return reservedWithoutHybridBenefits.map((reservedInstanceWithoutHybridBenefit, o) => {
      let savingsPlanInstanceWithHybridBenefit: PartialVmPricing = undefined;
      let reservedInstanceWithHybridBenefit: PartialVmPricing = undefined;
      let savingsPlansInstanceWithoutHybridBenefit = savingsPlansWithoutHybridBenefits.find(i => i.instance === reservedInstanceWithoutHybridBenefit.instance &&
        i.vCpu === reservedInstanceWithoutHybridBenefit.vCpu &&
        i.ram === reservedInstanceWithoutHybridBenefit.ram);

      if (hasHybridBenefit) {
        savingsPlanInstanceWithHybridBenefit = savingsPlanWithHybridBenefits.find(i => i.instance === reservedInstanceWithoutHybridBenefit.instance &&
          i.vCpu === reservedInstanceWithoutHybridBenefit.vCpu &&
          i.ram === reservedInstanceWithoutHybridBenefit.ram);

        reservedInstanceWithHybridBenefit = reservedWithHybridBenefits[o];

        if (reservedInstanceWithoutHybridBenefit.instance !== reservedInstanceWithHybridBenefit.instance ||
          reservedInstanceWithoutHybridBenefit.vCpu !== reservedInstanceWithHybridBenefit.vCpu ||
          reservedInstanceWithoutHybridBenefit.ram !== reservedInstanceWithHybridBenefit.ram) {
          throw `At offset ${o}, reserved instance "${JSON.stringify(reservedInstanceWithHybridBenefit)}" with hybrid benefits does not match instance "${JSON.stringify(reservedInstanceWithoutHybridBenefit)}" without`
        }
      }

      return <VmPricing>{
        instance: reservedInstanceWithoutHybridBenefit.instance,
        vCpu: reservedInstanceWithoutHybridBenefit.vCpu,
        ram: reservedInstanceWithoutHybridBenefit.ram,
        payAsYouGo: reservedInstanceWithoutHybridBenefit.payAsYouGo,
        payAsYouGoWithAzureHybridBenefit: reservedInstanceWithHybridBenefit?.payAsYouGo,
        oneYearSavingsPlan: savingsPlansInstanceWithoutHybridBenefit?.oneYear,
        oneYearSavingsPlanWithAzureHybridBenefit: savingsPlanInstanceWithHybridBenefit?.oneYear,
        threeYearSavingsPlan: savingsPlansInstanceWithoutHybridBenefit?.threeYear,
        threeYearSavingsPlanWithAzureHybridBenefit: savingsPlanInstanceWithHybridBenefit?.threeYear,
        oneYearReserved: reservedInstanceWithoutHybridBenefit.oneYear,
        oneYearReservedWithAzureHybridBenefit: reservedInstanceWithHybridBenefit?.oneYear,
        threeYearReserved: reservedInstanceWithoutHybridBenefit.threeYear,
        threeYearReservedWithAzureHybridBenefit: reservedInstanceWithHybridBenefit?.threeYear,
        spot: reservedInstanceWithoutHybridBenefit.spot,
        spotWithAzureHybridBenefit: reservedInstanceWithHybridBenefit?.spot
      }
    });
  }

  private async waitForBusyMainApp(): Promise<void> {
    await this.p.waitForFunction(
      () => {
        const busyMainAppElement = <HTMLElement> document.querySelector('.app-main[aria-busy="true"]');
        return busyMainAppElement !== null;
      },
      {
        timeout: 5000
      }
    );
  }

  private async waitForIdleMainApp(): Promise<void> {
    await this.p.waitForFunction(
      () => {
        const busyMainAppElement = <HTMLElement> document.querySelector('.app-main[aria-busy="true"]');
        return busyMainAppElement === null;
      },
      {
        timeout: 5000
      }
    );
  }

  private async waitForLoadingRegionalPrices(): Promise<void> {
    await this.p.waitForFunction(
      () => {
        const loadingRegionalPriceDiv = <HTMLDivElement> document.querySelector('.loading-animation');
        return loadingRegionalPriceDiv !== null;
      },
      {
        timeout: 5000
      }
    );
  }

  private async waitForLoadedRegionalPrices(): Promise<void> {
    await this.p.waitForFunction(
      () => {
        const loadingRegionalPriceDiv = <HTMLDivElement> document.querySelector('.loading-animation');
        return loadingRegionalPriceDiv === null;
      },
      {
        timeout: 5000
      }
    );
  }

  private async hideAzureHybridBenefit(): Promise<void> {
    if (!await isSelectedCheckbox(this.p, this.azureHybridBenefitButtonSelector)) {
      return;
    }

    await this.p.click(this.azureHybridBenefitButtonSelector);
    await this.waitForPriceWithoutHybridBenefits();
  }

  private async showAzureHybridBenefit(): Promise<void> {
    if (await isSelectedCheckbox(this.p, this.azureHybridBenefitButtonSelector)) {
      return;
    }

    await this.p.click(this.azureHybridBenefitButtonSelector);
    await this.waitForPriceWithHybridBenefits();
  }

  private async waitForPriceWithoutHybridBenefits(): Promise<void> {
    await this.p.waitForFunction(
      () => {
        const headerCells = <HTMLTableCellElement[]> Array.from(document.querySelectorAll('.data-table__table:not([style="visibility: hidden;"]) thead th:nth-child(n+5):nth-child(-n+8)'));
        const ahbOffset = headerCells.findIndex(c => c.innerText.indexOf('AHB') !== -1);
        return ahbOffset === -1;
      },
      { timeout: 3000 }
    );
  }

  private async waitForPriceWithHybridBenefits(): Promise<void> {
    await this.p.waitForFunction(
      () => {
        const headerCells = <HTMLTableCellElement[]> Array.from(document.querySelectorAll('.data-table__table:not([style="visibility: hidden;"]) thead th:nth-child(n+5):nth-child(-n+8)'));
        const ahbOffset = headerCells.findIndex(c => c.innerText.indexOf('AHB') === -1);
        return ahbOffset !== -1;
      },
      { timeout: 3000 }
    );
  }

  private async getUniquePricing(): Promise<PartialVmPricing[]> {
    let pricing = await this.p.evaluate(() => getPricing());
    discardDuplicateVms(pricing);
    return pricing;
  }
}

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

export function getPricing(): PartialVmPricing[] {
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

    const cellCount = tr.querySelectorAll('td').length;
    const hasGpu = cellCount === 10;
    const payAsYouGoOffset = 5 + (hasGpu ? 1 : 0);
    const oneYearOffset = payAsYouGoOffset + 1;
    const threeYearOffset = oneYearOffset + 1;
    const spotOffset = threeYearOffset + 1;

    const payAsYouGo = getPrice(tr, `td:nth-child(${payAsYouGoOffset})`);
    const oneYear = getPrice(tr, `td:nth-child(${oneYearOffset})`);
    const threeYear = getPrice(tr, `td:nth-child(${threeYearOffset})`);
    const spot = getPrice(tr, `td:nth-child(${spotOffset})`);

    if (payAsYouGo === undefined &&
        oneYear === undefined &&
        threeYear === undefined &&
        spot === undefined) {
      console.log(`Instance '${instance}' has no valid prices`);
      return undefined;
    }

    return <PartialVmPricing> {
      instance: instance,
      vCpu: vCpu,
      ram: ram,
      payAsYouGo: payAsYouGo,
      oneYear: oneYear,
      threeYear: threeYear,
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
