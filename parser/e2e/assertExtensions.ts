import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { expect } from 'vitest';

export default async function assert(
  culture: string,
  currency: string,
  operatingSystem: string = 'windows',
  instance: string = 'D2 v3'
): Promise<void> {
  const region = 'us-west';

  // Each run writes to its own directory: test files run in parallel and would otherwise overwrite each other's CSV
  const outputPath = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'azure-vm-pricing-e2e-'));
  let csvStream: fs.ReadStream | undefined;

  try {
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
      '-p',
      outputPath,
      '--debug'
    ]);

    const crawlerErrors: Buffer[] = [];

    crawler.stderr.on('data', (data: Buffer) => {
      crawlerErrors.push(data);
    });

    const [code] = await once(crawler, 'close');

    expect(code, Buffer.concat(crawlerErrors).toString()).toBe(0);

    csvStream = fs.createReadStream(path.join(outputPath, `vm-pricing_${region}_${operatingSystem}.csv`));
    const rl = readline.createInterface({
      input: csvStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      if (line.startsWith(`${instance},`)) {
        expect(line).toMatchSnapshot();
        return;
      }
    }

    throw new Error(`Did not find "${instance}" virtual machine.`);
  } finally {
    // Close the file before deleting it, Windows refuses to delete open files
    if (csvStream && !csvStream.closed) {
      csvStream.destroy();
      await once(csvStream, 'close');
    }
    await fs.promises.rm(outputPath, { recursive: true, force: true });
  }
}
