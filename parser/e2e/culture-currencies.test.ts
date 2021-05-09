const child_process = require('child_process');
const fs = require('fs');
const readline = require('readline');

describe('End-to-end tests for supported cultures and currencies', () => {
  describe('en-us - English (US)', () => {
    const culture = 'en-us';

    test('USD - US Dollar ($)', (done) => {
      const currency = 'USD';

      assert(done, culture, currency);
    });

    test('SAR - Saudi Riyal (SR)', (done) => {
      const currency = 'SAR';

      assert(done, culture, currency);
    });

    test('IDR - Indonesian Rupiah (Rp)', (done) => {
      const currency = 'IDR';

      assert(done, culture, currency);
    });
  });

  describe('cs-cz - Čeština', () => {
    const culture = 'cs-cz';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });
  });

  describe('da-dk - Dansk', () => {
    const culture = 'da-dk';

    test('DKK - Danish Krone (kr)', (done) => {
      const currency = 'DKK';

      assert(done, culture, currency);
    });
  });

  describe('de-de - Deutsch', () => {
    const culture = 'de-de';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });

    test('CHF - Swiss Franc. (chf)', (done) => {
      const currency = 'CHF';

      assert(done, culture, currency);
    });
  });

  describe('en-au - English (Australia)', () => {
    const culture = 'en-au';

    test('AUD - Australian Dollar ($)', (done) => {
      const currency = 'AUD';

      assert(done, culture, currency);
    });
  });

  describe('en-ca - English (Canada)', () => {
    const culture = 'en-ca';

    test('CAD - Canadian Dollar ($)', (done) => {
      const currency = 'CAD';

      assert(done, culture, currency);
    });
  });

  describe('en-in - English (India)', () => {
    const culture = 'en-in';

    test('INR - Indian Rupee (₹)', (done) => {
      const currency = 'INR';

      assert(done, culture, currency);
    });
  });

  describe('en-gb - English (UK)', () => {
    const culture = 'en-gb';

    test('GBP - British Pound (£)', (done) => {
      const currency = 'GBP';

      assert(done, culture, currency);
    });

    test('MYR - Malaysian Ringgit (RM$)', (done) => {
      const currency = 'MYR';

      assert(done, culture, currency);
    });

    test('ZAR - South African Rand (R)', (done) => {
      const currency = 'ZAR';

      assert(done, culture, currency);
    });

    test('NZD - New Zealand Dollar ($)', (done) => {
      const currency = 'NZD';

      assert(done, culture, currency);
    });

    test('HKD - Hong Kong Dollar (HK$)', (done) => {
      const currency = 'HKD';

      assert(done, culture, currency);
    });
  });

  describe('es-es - Español', () => {
    const culture = 'es-es';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });

    test('ARS - Argentine Peso ($)', (done) => {
      const currency = 'ARS';

      assert(done, culture, currency);
    });
  });

  describe('es-mx - Español (MX)', () => {
    const culture = 'es-mx';

    test('MXN - Mexican Peso (MXN$)', (done) => {
      const currency = 'MXN';

      assert(done, culture, currency);
    });
  });

  describe('fr-fr - Français', () => {
    const culture = 'fr-fr';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });

    test('CHF - Swiss Franc. (chf)', (done) => {
      const currency = 'CHF';

      assert(done, culture, currency);
    });
  });

  describe('fr-ca - Français (Canada)', () => {
    const culture = 'fr-ca';

    test('CAD - Canadian Dollar ($)', (done) => {
      const currency = 'CAD';

      assert(done, culture, currency);
    });
  });

  describe('it-it - Italiano', () => {
    const culture = 'it-it';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });

    test('CHF - Swiss Franc. (chf)', (done) => {
      const currency = 'CHF';

      assert(done, culture, currency);
    });
  });

  describe('hu-hu - Magyar', () => {
    const culture = 'hu-hu';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });
  });

  describe('nb-no - Norsk', () => {
    const culture = 'nb-no';

    test('NOK - Norwegian Krone (kr)', (done) => {
      const currency = 'NOK';

      assert(done, culture, currency);
    });
  });

  describe('nl-nl - Nederlands', () => {
    const culture = 'nl-nl';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });
  });

  describe('pl-pl - Polski', () => {
    const culture = 'pl-pl';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });
  });

  describe('pt-br - Português (Brasil)', () => {
    const culture = 'pt-br';

    test('BRL - Brazilian Real (R$)', (done) => {
      const currency = 'BRL';

      assert(done, culture, currency);
    });
  });

  describe('pt-pt - Português', () => {
    const culture = 'pt-pt';

    test('EUR - Euro (€)', (done) => {
      const currency = 'EUR';

      assert(done, culture, currency);
    });
  });

  describe('sv-se - Svenska', () => {
    const culture = 'sv-se';

    test('SEK - Swedish Krona (kr)', (done) => {
      const currency = 'SEK';

      assert(done, culture, currency);
    });
  });

  describe('tr-tr - Türkçe', () => {
    const culture = 'tr-tr';

    test('TRY - Turkish Lira (TL)', (done) => {
      const currency = 'TRY';

      assert(done, culture, currency);
    });
  });

  describe('ru-ru - Pусский', () => {
    const culture = 'ru-ru';

    test('RUB - Russian Ruble (руб)', (done) => {
      const currency = 'RUB';

      assert(done, culture, currency);
    });
  });

  describe('ja-jp - 日本語', () => {
    const culture = 'ja-jp';

    test('JPY - Japanese Yen (¥)', (done) => {
      const currency = 'JPY';

      assert(done, culture, currency);
    });
  });

  describe('ko-kr - 한국어', () => {
    const culture = 'ko-kr';

    test('KRW - Korean Won (₩)', (done) => {
      const currency = 'KRW';

      assert(done, culture, currency);
    });
  });

  describe('zh-tw - 中文(繁體)', () => {
    const culture = 'zh-tw';

    test('TWD - Taiwanese Dollar (NT$)', (done) => {
      const currency = 'TWD';

      assert(done, culture, currency);
    });

    test('HKD - Hong Kong Dollar (HK$)', (done) => {
      const currency = 'HKD';

      assert(done, culture, currency);
    });
  });
});

function assert(
  done: jest.DoneCallback,
  culture: string,
  currency: string
): void {
  const operatingSystem = 'windows';
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
      region
    ],
    { shell: true }
  );

  let crawlerErrors = [];

  crawler.stderr.on('data', (data) => {
    crawlerErrors.push(data);
  });

  crawler.on('close', (code) => {
    expect(code).toBe(0);

    if (crawlerErrors.length > 0) {
      done.fail(`Errors: ${crawlerErrors}`);
    }

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
        throw 'Did not find "D2 v3" virtual machine.';
      }
    });

    rl.on('line', (line) => {
      if (line.startsWith('D2 v3,')) {
        foundExpectedVirtualMachine = true;
        rl.close();
        expect(line).toMatchSnapshot();
        done();
      }
    });
  });
}
