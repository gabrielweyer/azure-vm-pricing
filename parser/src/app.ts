import * as puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import util from 'node:util';
import type { AzureVmPricingConfig } from './azureVmPricingConfig.ts';
import type { LogMessage } from './logMessage.ts';
import { isUrlBlocked } from './isUrlBlocked.ts';
import { writeCsv, writeJson } from './writeFile.ts';
import { AzurePortal, getPrice, getPricing } from './azurePortalExtensions.ts';

// If outputPath is not provided, the default value is './out'
let outputPath: string | undefined = './out';

// Where the debug log and screenshot are written when a crawl fails in debug mode
const defaultLogPath = './out/log';
let logPath = defaultLogPath;

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
  logMessages.push({
    loggedAt: new Date(),
    level: level,
    args: args
  } as LogMessage);
}

function timeEvent(eventName: string): void {
  if (!recordTiming) return;

  const happenedAt = Math.round(performance.now());
  console.log(eventName, happenedAt, 'Elapsed', happenedAt - previousPerformanceNow);
  previousPerformanceNow = happenedAt;
}

(async function() {
  recordTiming = false;
  const headlessMode = true;
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
        case '-p':
        case '--output-path':
          outputPath = args[offset + 1];
          // Assign default if undefined or empty
          if (outputPath === undefined || outputPath === '') {
            outputPath = './out';
          }
          // Ensure the path exists
          fs.mkdirSync(outputPath, { recursive: true });
          break;
        case '-g':
        case '--log-path':
          // Assign default if empty, the directory is only created when there is something to log
          logPath = args[offset + 1] || defaultLogPath;
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
          console.log(`'${args[offset]}' is not a known switch, supported values are: '-l', '--culture', '-c', '--currency', '-o', '--operating-system', '-r', '--region', '-p', '--output-path', '-g', '--log-path'. None of these switches should be provided as the last arg as they require a value.`);
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
  // --no-sandbox and --disable-setuid-sandbox are required for running in a Docker container
  // More info: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-gitlabci
  const browser = await puppeteer.launch({headless: headlessMode, args: ['--no-sandbox', '--disable-setuid-sandbox']});
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

    await portal.dismissNudgePopupIfPresent();

    console.log();

    timeEvent('parsePricingStartedAt');
    await page.addScriptTag({ content: `${getPrice} ${getPricing}`});
    const vmPricing = await portal.parsePricing(config.operatingSystem);
    timeEvent('parsePricingCompletedAt');

    console.log();

    writeJson(vmPricing, config.region, config.operatingSystem, outputPath);
    writeCsv(vmPricing, config.culture, config.region, config.operatingSystem, outputPath);
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

    const writeDebugArtifacts = !wasSuccessful && debugMode;

    // Failing to write debug artifacts must not hide the error that caused the crawl to fail
    if (writeDebugArtifacts) {
      try {
        fs.mkdirSync(logPath, { recursive: true });
        fs.writeFileSync(
          path.join(logPath, `${fileName}.json`),
          JSON.stringify(logMessages.length > 0 ? logMessages : 'No log messages recorded'));
      } catch (error) {
        console.warn(`Failed to write the debug log to "${logPath}":`, util.inspect(error));
      }
    }

    if (browser) {
      if (writeDebugArtifacts && page) {
        try {
          await page.screenshot({ path: path.join(logPath, `${fileName}.png`) });
        } catch (error) {
          console.warn(`Failed to write the debug screenshot to "${logPath}":`, util.inspect(error));
        }
      }
      await browser.close();
    }

    timeEvent('crawlerCompletedAt');
  }
}());
