const child_process = require('child_process');
const fs = require('fs');
const readline = require('readline');

export default function assert(
  done: jest.DoneCallback,
  culture: string,
  currency: string,
  operatingSystem: string = 'windows'
): void {
  const region = 'us-west';

  const crawler = child_process.spawn(
    'yarn',
    [
      'crawl',
      '-l',
      culture,
      '-c',
      currency,
      '-o',
      operatingSystem,
      '-r',
      region,
      '--debug'
    ],
    { shell: true }
  );

  let crawlerErrors = [];

  crawler.stderr.on('data', (data) => {
    crawlerErrors.push(data);
  });

  crawler.on('close', (code) => {
    try
    {
      expect(code).toBe(0);

      const fileStream = fs.createReadStream(
        `./out/vm-pricing_${region}_${operatingSystem}.csv`
      );
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      let foundExpectedVirtualMachine = false;

      rl.on('close', () => {
        if (!foundExpectedVirtualMachine) {
          done(new Error('Did not find "D2 v3" virtual machine.'));
        }
      });

      rl.on('line', (line) => {
        try {
          if (line.startsWith('D2 v3,')) {
            foundExpectedVirtualMachine = true;
            rl.close();
            expect(line).toMatchSnapshot();
            done();
          }
        } catch (error) {
          done(error);
        }
      });
    }
    catch (error)
    {
      done(error);
    }
  });
}
