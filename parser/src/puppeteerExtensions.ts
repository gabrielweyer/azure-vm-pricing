import * as puppeteer from 'puppeteer';

export async function setSelect(page: puppeteer.Page, selector: string, value: string): Promise<void> {
  const fullSelector = getSelectFullSelector(selector);
  let selectedValue = await getSelectedValue(page, selector);

  if (selectedValue !== value) {
    await page.select(fullSelector, value);
    selectedValue = await getSelectedValue(page, selector);
  }

  if (selectedValue !== value) {
    throw `Failed to select '${value}' for selector '${fullSelector}', instead selected '${selectedValue}'`
  }
}

export async function isSelectedSelect(page: puppeteer.Page, selector: string, value: string): Promise<boolean> {
  let selectedValue = await getSelectedValue(page, selector);
  return selectedValue === value;
}

export async function isSelectedCheckbox(page: puppeteer.Page, selector: string): Promise<boolean> {
  const value = await page.$eval(selector, node => (<HTMLButtonElement> node).value);
  return value === 'true';
}

async function getSelectedValue(page: puppeteer.Page, selector: string): Promise<string> {
  const fullSelector = getSelectFullSelector(selector);
  await page.waitForSelector(fullSelector, { visible: true });
  return await page.$eval(fullSelector, node => (<HTMLSelectElement> node).value);
}

function getSelectFullSelector(selector: string): string {
  return `select${selector}`;
}
