import * as puppeteer from 'puppeteer';
const fs = require('fs');
const { performance } = require('perf_hooks');
const util = require('util');
import { AzureVmPricingConfig } from './azureVmPricingConfig';
import { LogMessage } from './logMessage';
import { isUrlBlocked } from './isUrlBlocked';
import { writeCsv, writeJson } from './writeFile';
import { AzurePortal, getPrice, getPricing } from './azurePortalExtensions';

let recordTiming = false;
let previousPerformanceNow = 0;
let wasSuccessful = false;
const logMessages: LogMessage[] = [];

const consoleLog = console.log

console.log = function(...args) {
  consoleLog.apply(console, args);
  logMessage('log', args);
}

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

function logMessage(level: 'log' | 'warn' | 'error', args: any[]): void {
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

(async function() {
  recordTiming = false;
  const runHeadless = true;
  timeEvent('crawlerStartedAt');

  let culture = 'en-au';
  let currency = 'aud';
  let operatingSystem = 'windows';
  let region = 'australia-southeast';
  let debugMode = false;

  if (!process.argv[1].endsWith('app.ts')) {
    return;
  }

  console.log();

  const args = process.argv.slice(2);

  for (let offset = 0; offset < args.length;) {
    let parsedBinaryArg = false;

    if (offset < args.length - 1) {
      parsedBinaryArg = true;
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
          parsedBinaryArg = false;
          break;
      }
    }

    if (!parsedBinaryArg) {
      switch (args[offset]) {
        case '-d':
        case '--debug':
          debugMode = true;
          break;
        default:
          console.log(`'${args[offset]}' is not a known switch, supported values are: '-l', '--culture', '-c', '--currency', '-o', '--operating-system', '-r', '--region'. None of these switches should be provided as the last arg as they require a value.`);
          break;
      }
    }

    offset += parsedBinaryArg ? 2 : 1;
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

      if (isUrlBlocked(url)) {
        req.abort();
        return;
      }

      req.continue();
    });

    page.on('response', async res => {
      if (res.status() !== 403) {
        return;
      }

      let responseBody = '';
      const resourceType = res.request().resourceType();
      const responseHeaders = res.headers();

      try {
        if (resourceType !== 'preflight' && responseHeaders['content-length'] !== "0") {
          responseBody = await res.text();
        }
      } catch (error) {
        console.warn(`Failed to read response body for "${res.url()}"`);
      }

      console.warn(`Request "${res.url()}" returned 403 with headers`, responseHeaders, 'and body', responseBody);
    });

    page.on('console', (log) => {
      const type = log.type();
      const text = log.text();
      const location = log.location();
      const stackTrace = log.stackTrace();

      if (text === 'Failed to load resource: net::ERR_FAILED' && isUrlBlocked(location.url)) {
        return;
      }

      if (stackTrace.length > 0 && stackTrace[stackTrace.length - 1].url === 'pptr://__puppeteer_evaluation_script__') {
        return console[type](text);
      }

      const serialisableLog = {
        text: text,
        location: location,
        stackTrace: stackTrace,
        args: util.inspect(log.args())
      };

      console[type](serialisableLog);
    });

    if (debugMode) {
      console.log('Running in debug mode');
    }

    console.log('Culture:', config.culture);
    console.log('Operating System:', config.operatingSystem);

    timeEvent('pageLoadStartedAt');
    await page.goto(`https://azure.microsoft.com/${config.culture}/pricing/details/virtual-machines/${config.operatingSystem}/`);
    timeEvent('pageLoadCompletedAt');

    const actualCulture = page.url().substring(28, 33);

    if (actualCulture !== config.culture) {
      throw `The culture "${config.culture}" is not supported.`;
    }

    var portal = new AzurePortal(page);
    await portal.waitForApplicableVirtualMachinesAnnouncement();

    timeEvent('currencySelectionStartedAt');
    await portal.selectCurrency(config.currency);
    timeEvent('currencySelectionCompletedAt');

    timeEvent('regionSelectionStartedAt');
    await portal.selectRegion(config.region);
    timeEvent('regionSelectionCompletedAt');

    timeEvent('hourlyPricingSelectionStartedAt');
    await portal.selectHourlyPricing();
    timeEvent('hourlyPricingSelectionCompletedAt');

    timeEvent('reservedInstancesSelectionStartedAt');
    await portal.selectReservedInstances();
    timeEvent('reservedInstancesSelectionCompletedAt');

    console.log();

    timeEvent('parsePricingStartedAt');
    await page.addScriptTag({ content: `${getPrice} ${getPricing}`});
    const vmPricing = await portal.parsePricing(config.operatingSystem);
    timeEvent('parsePricingCompletedAt');

    console.log();

    writeJson(vmPricing, config.region, config.operatingSystem);
    writeCsv(vmPricing, config.culture, config.region, config.operatingSystem);
    wasSuccessful = true;
  }
  catch (e)
  {
    if (debugMode) {
      console.error('Terminating error:', util.inspect(e));
    }
    throw e;
  }
  finally
  {
    const fileName = `${culture}_${currency}_${region}_${operatingSystem}`;

    if (!wasSuccessful && debugMode) {
      const logFilename = `./out/log/${fileName}.json`;

      fs.writeFile(logFilename, JSON.stringify(logMessages.length > 0 ? logMessages : 'No log messages recorded'), function(err) {
        if (err) {
          return console.error(err);
        }
      });
    }

    if (browser) {
      if (!wasSuccessful && debugMode && page) {
        await page.screenshot({ path: `./out/log/${fileName}.png`, fullPage: true });
      }
      await browser.close();
    }

    timeEvent('crawlerCompletedAt');
  }
}());
