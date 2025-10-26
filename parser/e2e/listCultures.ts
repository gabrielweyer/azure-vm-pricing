import puppeteer from "puppeteer";

export default async function listCultures(): Promise<string[]> {
  const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});

  try
  {
    const page = await browser.newPage();
    await page.goto('https://azure.microsoft.com/en-us/locale');
    return await page.evaluate(() => (<HTMLAnchorElement[]> Array.from(document.querySelectorAll('[data-automation-test-id="mainContainer-layout-container-uid0be8"] a'))).map(a => `${a.href.slice(28, 33)} (${a.textContent.trim()})`));
  }
  finally
  {
    if (browser) {
      await browser.close();
    }
  }
}
