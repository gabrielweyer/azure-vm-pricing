import { expect } from 'chai';
import child_process = require('child_process');
import fs = require('fs');
import readline = require('readline');

describe('End-to-end tests for supported cultures and currencies', () => {
  describe('en-us - English (US)', () => {
    const culture = 'en-us';

    it('USD - US Dollar ($)', (done) => {
      assert(done, culture, 'USD', 'B1S,1,1,0.0164,0.0112,0.0087,0.0047');
    });

    it('SAR - Saudi Riyal (SR)', (done) => {
      assert(done, culture, 'SAR', 'B1S,1,1,0.0615,0.042,0.0326,0.0176');
    });
  });

  describe('cs-cz - Čeština', () => {
    const culture = 'cs-cz';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });
  });

  describe('da-dk - Dansk', () => {
    const culture = 'da-dk';

    it('DKK - Danish Krone (kr)', (done) => {
      assert(done, culture, 'DKK', 'B1S,1,1,"0,1033","0,0705","0,0547","0,0295"');
    });
  });

  describe('de-de - Deutsch', () => {
    const culture = 'de-de';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'B1S,1,1,"0,0162","0,0111","0,0086","0,0047"');
    });
  });

  describe('en-au - English (Australia)', () => {
    const culture = 'en-au';

    it('AUD - Australian Dollar ($)', (done) => {
      assert(done, culture, 'AUD', 'B1S,1,1,0.0226,0.0154,0.012,0.0065');
    });
  });

  describe('en-ca - English (Canada)', () => {
    const culture = 'en-ca';

    it('CAD - Canadian Dollar ($)', (done) => {
      assert(done, culture, 'CAD', 'B1S,1,1,0.021,0.0144,0.0112,0.006');
    });
  });

  describe('en-in - English (India)', () => {
    const culture = 'en-in';

    it('INR - Indian Rupee (₹)', (done) => {
      assert(done, culture, 'INR', 'B1S,1,1,1.084,0.7397,0.5738,0.3094');
    });
  });

  describe('en-gb - English (UK)', () => {
    const culture = 'en-gb';

    it('GBP - British Pound (£)', (done) => {
      assert(done, culture, 'GBP', 'B1S,1,1,0.0123,0.0084,0.0065,0.0035');
    });

    it('MYR - Malaysian Ringgit (RM$)', (done) => {
      assert(done, culture, 'MYR', 'B1S,1,1,0.0689,0.047,0.0365,0.0197');
    });

    it('ZAR - South African Rand (R)', (done) => {
      assert(done, culture, 'ZAR', 'B1S,1,1,0.2493,0.1701,0.132,0.0712');
    });

    it('NZD - New Zealand Dollar ($)', (done) => {
      assert(done, culture, 'NZD', 'B1S,1,1,0.0248,0.017,0.0132,0.0071');
    });

    it('HKD - Hong Kong Dollar (HK$)', (done) => {
      assert(done, culture, 'HKD', 'B1S,1,1,0.1273,0.0869,0.0674,0.0364');
    });
  });

  describe('es-es - Español', () => {
    const culture = 'es-es';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });

    it('ARS - Argentine Peso ($)', (done) => {
      assert(done, culture, 'ARS', 'B1S,1,1,"0,7741","0,5282","0,4097","0,2209"');
    });
  });

  describe('es-mx - Español (MX)', () => {
    const culture = 'es-mx';

    it('MXN - Mexican Peso (MXN$)', (done) => {
      assert(done, culture, 'MXN', 'B1S,1,1,0.3166,0.216,0.1676,0.0904');
    });
  });

  describe('fr-fr - Français', () => {
    const culture = 'fr-fr';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'B1S,1,1,"0,0162","0,0111","0,0086","0,0047"');
    });
  });

  describe('fr-ca - Français (Canada)', () => {
    const culture = 'fr-ca';

    it('CAD - Canadian Dollar ($)', (done) => {
      assert(done, culture, 'CAD', 'B1S,1,1,"0,021","0,0144","0,0112","0,006"');
    });
  });

  describe('is-is - Íslensku', () => {
    const culture = 'is-is';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });
  });

  describe('th-th - ประเทศไทย', () => {
    const culture = 'th-th';

    it('USD - US Dollar ($)', (done) => {
      assert(done, culture, 'USD', 'B1S,1,1,0.0164,0.0112,0.0087,0.0047');
    });
  });

  describe('id-id - Bahasa Indonesia', () => {
    const culture = 'id-id';

    it('IDR - Indonesian Rupiah (Rp)', (done) => {
      assert(done, culture, 'IDR', 'B1S,1,1,"256,496","175,0116","135,7552","73,1952"');
    });
  });

  describe('it-it - Italiano', () => {
    const culture = 'it-it';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'B1S,1,1,"0,0162","0,0111","0,0086","0,0047"');
    });
  });

  describe('hu-hu - Magyar', () => {
    const culture = 'hu-hu';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });
  });

  describe('nb-no - Norsk', () => {
    const culture = 'nb-no';

    it('NOK - Norwegian Krone (kr)', (done) => {
      assert(done, culture, 'NOK', 'B1S,1,1,"0,1331","0,0908","0,0705","0,038"');
    });
  });

  describe('nl-nl - Nederlands', () => {
    const culture = 'nl-nl';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });
  });

  describe('pl-pl - Polski', () => {
    const culture = 'pl-pl';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });
  });

  describe('pt-br - Português (Brasil)', () => {
    const culture = 'pt-br';

    it('BRL - Brazilian Real (R$)', (done) => {
      assert(done, culture, 'BRL', 'B1S,1,1,"0,061","0,0416","0,0323","0,0174"');
    });
  });

  describe('pt-pt - Português', () => {
    const culture = 'pt-pt';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'B1S,1,1,"0,0139","0,0095","0,0074","0,004"');
    });
  });

  describe('sv-se - Svenska', () => {
    const culture = 'sv-se';

    it('SEK - Swedish Krona (kr)', (done) => {
      assert(done, culture, 'SEK', 'B1S,1,1,"0,1433","0,0978","0,0759","0,0409"');
    });
  });

  describe('tr-tr - Türkçe', () => {
    const culture = 'tr-tr';

    it('TRY - Turkish Lira (TL)', (done) => {
      assert(done, culture, 'TRY', 'B1S,1,1,"0,092","0,0628","0,0487","0,0263"');
    });
  });

  describe('ru-ru - Pусский', () => {
    const culture = 'ru-ru';

    it('RUB - Russian Ruble (руб)', (done) => {
      assert(done, culture, 'RUB', 'B1S,1,1,"1,025","0,6994","0,5425","0,2925"');
    });
  });

  describe('ja-jp - 日本語', () => {
    const culture = 'ja-jp';

    it('JPY - Japanese Yen (¥)', (done) => {
      assert(done, culture, 'JPY', 'B1S,1,1,1.8368,1.2533,0.9722,0.5242');
    });
  });

  describe('ko-kr - 한국어', () => {
    const culture = 'ko-kr';

    it('KRW - Korean Won (₩)', (done) => {
      assert(done, culture, 'KRW', 'B1S,1,1,18.4443,12.5849,9.762,5.2634');
    });
  });

  describe('zh-tw - 中文(繁體)', () => {
    const culture = 'zh-tw';

    it('TWD - Taiwanese Dollar (NT$)', (done) => {
      assert(done, culture, 'TWD', 'B1S,1,1,0.4929,0.3364,0.2609,0.1407');
    });

    it('HKD - Hong Kong Dollar (HK$)', (done) => {
      assert(done, culture, 'HKD', 'B1S,1,1,0.1273,0.0869,0.0674,0.0364');
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
