import { expect } from 'chai';
import child_process = require('child_process');
import fs = require('fs');
import readline = require('readline');

describe('End-to-end tests for supported cultures and currencies', () => {
  describe('en-us - English (US)', () => {
    const culture = 'en-us';

    it('USD - US Dollar ($)', (done) => {
      assert(done, culture, 'USD', 'B1S,1,1,0.017,0.012,0.009,0.005');
    });

    it('SAR - Saudi Riyal (SR)', (done) => {
      assert(done, culture, 'SAR', 'B1S,1,1,0.062,0.042,0.033,0.018');
    });
  });

  describe('cs-cz - Čeština', () => {
    const culture = 'cs-cz';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });
  });

  describe('da-dk - Dansk', () => {
    const culture = 'da-dk';

    it('DKK - Danish Krone (kr)', (done) => {
      assert(done, culture, 'DKK', 'B1S,1,1,"0,104","0,071","0,055","0,03"');
    });
  });

  describe('de-de - Deutsch', () => {
    const culture = 'de-de';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'B1S,1,1,"0,017","0,012","0,009","0,005"');
    });
  });

  describe('en-au - English (Australia)', () => {
    const culture = 'en-au';

    it('AUD - Australian Dollar ($)', (done) => {
      assert(done, culture, 'AUD', 'B1S,1,1,0.023,0.016,0.012,0.007');
    });
  });

  describe('en-ca - English (Canada)', () => {
    const culture = 'en-ca';

    it('CAD - Canadian Dollar ($)', (done) => {
      assert(done, culture, 'CAD', 'B1S,1,1,0.021,0.015,0.012,0.006');
    });
  });

  describe('en-in - English (India)', () => {
    const culture = 'en-in';

    it('INR - Indian Rupee (₹)', (done) => {
      assert(done, culture, 'INR', 'B1S,1,1,1.09,0.74,0.58,0.31');
    });
  });

  describe('en-gb - English (UK)', () => {
    const culture = 'en-gb';

    it('GBP - British Pound (£)', (done) => {
      assert(done, culture, 'GBP', 'B1S,1,1,0.013,0.009,0.007,0.004');
    });

    it('MYR - Malaysian Ringgit (RM$)', (done) => {
      assert(done, culture, 'MYR', 'B1S,1,1,0.069,0.047,0.037,0.02');
    });

    it('ZAR - South African Rand (R)', (done) => {
      assert(done, culture, 'ZAR', 'B1S,1,1,0.263,0.18,0.139,0.075');
    });

    it('NZD - New Zealand Dollar ($)', (done) => {
      assert(done, culture, 'NZD', 'B1S,1,1,0.025,0.017,0.014,0.008');
    });

    it('HKD - Hong Kong Dollar (HK$)', (done) => {
      assert(done, culture, 'HKD', 'B1S,1,1,0.128,0.087,0.068,0.037');
    });
  });

  describe('es-es - Español', () => {
    const culture = 'es-es';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });

    it('ARS - Argentine Peso ($)', (done) => {
      assert(done, culture, 'ARS', 'B1S,1,1,"0,64","0,437","0,339","0,183"');
    });
  });

  describe('es-mx - Español (MX)', () => {
    const culture = 'es-mx';

    it('MXN - Mexican Peso (MXN$)', (done) => {
      assert(done, culture, 'MXN', 'B1S,1,1,0.317,0.216,0.168,0.091');
    });
  });

  describe('fr-fr - Français', () => {
    const culture = 'fr-fr';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'B1S,1,1,"0,017","0,012","0,009","0,005"');
    });
  });

  describe('fr-ca - Français (Canada)', () => {
    const culture = 'fr-ca';

    it('CAD - Canadian Dollar ($)', (done) => {
      assert(done, culture, 'CAD', 'B1S,1,1,"0,021","0,015","0,012","0,006"');
    });
  });

  describe('is-is - Íslensku', () => {
    const culture = 'is-is';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });
  });

  describe('th-th - ประเทศไทย', () => {
    const culture = 'th-th';

    it('USD - US Dollar ($)', (done) => {
      assert(done, culture, 'USD', 'B1S,1,1,0.017,0.012,0.009,0.005');
    });
  });

  describe('id-id - Bahasa Indonesia', () => {
    const culture = 'id-id';

    it('IDR - Indonesian Rupiah (Rp)', (done) => {
      assert(done, culture, 'IDR', 'B1S,1,1,"256,5","175,02","135,76","73,2"');
    });
  });

  describe('it-it - Italiano', () => {
    const culture = 'it-it';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'B1S,1,1,"0,017","0,012","0,009","0,005"');
    });
  });

  describe('hu-hu - Magyar', () => {
    const culture = 'hu-hu';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });
  });

  describe('nb-no - Norsk', () => {
    const culture = 'nb-no';

    it('NOK - Norwegian Krone (kr)', (done) => {
      assert(done, culture, 'NOK', 'B1S,1,1,"0,134","0,091","0,071","0,038"');
    });
  });

  describe('nl-nl - Nederlands', () => {
    const culture = 'nl-nl';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });
  });

  describe('pl-pl - Polski', () => {
    const culture = 'pl-pl';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });
  });

  describe('pt-br - Português (Brasil)', () => {
    const culture = 'pt-br';

    it('BRL - Brazilian Real (R$)', (done) => {
      assert(done, culture, 'BRL', 'B1S,1,1,"0,061","0,042","0,033","0,018"');
    });
  });

  describe('pt-pt - Português', () => {
    const culture = 'pt-pt';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,014","0,01","0,008","0,004"');
    });
  });

  describe('sv-se - Svenska', () => {
    const culture = 'sv-se';

    it('SEK - Swedish Krona (kr)', (done) => {
      assert(done, culture, 'SEK', 'B1S,1,1,"0,144","0,098","0,076","0,041"');
    });
  });

  describe('tr-tr - Türkçe', () => {
    const culture = 'tr-tr';

    it('TRY - Turkish Lira (TL)', (done) => {
      assert(done, culture, 'TRY', 'B1S,1,1,"0,092","0,063","0,049","0,027"');
    });
  });

  describe('ru-ru - Pусский', () => {
    const culture = 'ru-ru';

    it('RUB - Russian Ruble (руб)', (done) => {
      assert(done, culture, 'RUB', 'B1S,1,1,"1,03","0,7","0,55","0,3"');
    });
  });

  describe('ja-jp - 日本語', () => {
    const culture = 'ja-jp';

    it('JPY - Japanese Yen (¥)', (done) => {
      assert(done, culture, 'JPY', 'B1S,1,1,1.84,1.26,0.98,0.53');
    });
  });

  describe('ko-kr - 한국어', () => {
    const culture = 'ko-kr';

    it('KRW - Korean Won (₩)', (done) => {
      assert(done, culture, 'KRW', 'B1S,1,1,18.45,12.59,9.77,5.27');
    });
  });

  describe('ko-kr - 한국어', () => {
    const culture = 'ko-kr';

    it('KRW - Korean Won (₩)', (done) => {
      assert(done, culture, 'KRW', 'B1S,1,1,18.45,12.59,9.77,5.27');
    });
  });

  describe('zh-tw - 中文(繁體)', () => {
    const culture = 'zh-tw';

    it('TWD - Taiwanese Dollar (NT$)', (done) => {
      assert(done, culture, 'TWD', 'B1S,1,1,0.493,0.337,0.261,0.141');
    });

    it('HKD - Hong Kong Dollar (HK$)', (done) => {
      assert(done, culture, 'HKD', 'B1S,1,1,0.128,0.087,0.068,0.037');
    });
  });
});

function assert(done: Mocha.Done, culture: string, currency: string, expectedCsvFirstVm: string): void {
  const operatingSystem = 'windows';
  const region = 'us-west';

  const crawler = child_process.spawn(
    'yarn',
    ['crawl', '-l', culture, '-c', currency, '-o', operatingSystem, '-r', region],
    { shell: true });

  crawler.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  crawler.on('close', (code) => {
    expect(code).to.equal(0);

    const fileStream = fs.createReadStream(`./out/vm-pricing_${region}_${operatingSystem}.csv`);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let lineCount = 0;

    rl.on('line', (line) => {
      lineCount++;

      if (lineCount === 2) {
        rl.close();
        expect(line).to.equal(expectedCsvFirstVm);
        done();
      }
    });
  });
}
