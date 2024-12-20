import puppeteer from "puppeteer";

export default async function listSelectOptions(selectName: string): Promise<string[]> {
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  try
  {
    const page = await browser.newPage();
    await page.goto(`https://azure.microsoft.com/en-us/pricing/details/virtual-machines/windows/`);

    await page.waitForFunction(
      async () => {
        const applicableVmsAnnouncemnt = <HTMLSpanElement> document.querySelector('#pricing-announcement');
        return applicableVmsAnnouncemnt !== null;
      }
    );

    const selector = `select[name=${selectName}]`;
    return await page.$eval(selector, select => Array.from((<HTMLSelectElement> select).options).map(c => `${c.value} (${c.text})`));
  }
  finally
  {
    if (browser) {
      await browser.close();
    }
  }
}
