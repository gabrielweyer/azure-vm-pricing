import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import readline from 'node:readline';
import { expect } from 'vitest';

export default async function assert(
  culture: string,
  currency: string,
  operatingSystem: string = 'windows',
  instance: string = 'D2 v3'
): Promise<void> {
  const region = 'us-west';

  // Run the crawler with the current Node.js binary (same as "yarn crawl") to avoid spawning a shell
  const crawler = spawn(process.execPath, [
    'src/app.ts',
    '-l',
    culture,
    '-c',
    currency,
    '-o',
    operatingSystem,
    '-r',
    region,
    '--debug'
  ]);

  const crawlerErrors: Buffer[] = [];

  crawler.stderr.on('data', (data: Buffer) => {
    crawlerErrors.push(data);
  });

  const [code] = await once(crawler, 'close');

  expect(code, Buffer.concat(crawlerErrors).toString()).toBe(0);

  const rl = readline.createInterface({
    input: fs.createReadStream(`./out/vm-pricing_${region}_${operatingSystem}.csv`),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.startsWith(`${instance},`)) {
      expect(line).toMatchSnapshot();
      return;
    }
  }

  throw new Error(`Did not find "${instance}" virtual machine.`);
}
