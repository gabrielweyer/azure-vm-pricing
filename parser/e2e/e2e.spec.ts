import { expect } from 'chai';
import child_process = require('child_process');
import fs = require('fs');
import readline = require('readline');
import { fail } from 'assert';

describe('End-to-end tests for supported cultures and currencies', () => {
  describe('en-us - English (US)', () => {
    const culture = 'en-us';

    it('USD - US Dollar ($)', (done) => {
      assert(done, culture, 'USD', 'D2 v3,2,8,0.209,0.117,0.1714,0.0794,0.1428,0.0508,0.0836,0.023');
    });

    it('SAR - Saudi Riyal (SR)', (done) => {
      assert(done, culture, 'SAR', 'D2 v3,2,8,0.7838,0.4388,0.6426,0.2976,0.5354,0.1904,0.3135,0.0863');
    });

    it('IDR - Indonesian Rupiah (Rp)', (done) => {
      assert(done, culture, 'IDR', 'D2 v3,2,8,3268.76,1829.88,2679.7576,1240.8776,2232.7664,793.8864,1307.504,359.72');
    });
  });

  describe('cs-cz - Čeština', () => {
    const culture = 'cs-cz';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });
  });

  describe('da-dk - Dansk', () => {
    const culture = 'da-dk';

    it('DKK - Danish Krone (kr)', (done) => {
      assert(done, culture, 'DKK', 'D2 v3,2,8,"1,3154","0,7364","1,0784","0,4994","0,8985","0,3195","0,5679","0,1563"');
    });
  });

  describe('de-de - Deutsch', () => {
    const culture = 'de-de';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'D2 v3,2,8,"0,2057","0,1152","0,1687","0,0781","0,1405","0,05","0,0836","0,023"');
    });
  });

  describe('en-au - English (Australia)', () => {
    const culture = 'en-au';

    it('AUD - Australian Dollar ($)', (done) => {
      assert(done, culture, 'AUD', 'D2 v3,2,8,0.287,0.1607,0.2353,0.109,0.1961,0.0697,0.1233,0.034');
    });
  });

  describe('en-ca - English (Canada)', () => {
    const culture = 'en-ca';

    it('CAD - Canadian Dollar ($)', (done) => {
      assert(done, culture, 'CAD', 'D2 v3,2,8,0.2676,0.1498,0.2194,0.1016,0.1828,0.065,0.1111,0.0306');
    });
  });

  describe('en-in - English (India)', () => {
    const culture = 'en-in';

    it('INR - Indian Rupee (₹)', (done) => {
      assert(done, culture, 'INR', 'D2 v3,2,8,13.8142,7.7333,11.325,5.2441,9.436,3.3551,5.9654,1.6412');
    });
  });

  describe('en-gb - English (UK)', () => {
    const culture = 'en-gb';

    it('GBP - British Pound (£)', (done) => {
      assert(done, culture, 'GBP', 'D2 v3,2,8,0.1558,0.0873,0.1278,0.0592,0.1065,0.0379,0.065,0.0179');
    });

    it('MYR - Malaysian Ringgit (RM$)', (done) => {
      assert(done, culture, 'MYR', 'D2 v3,2,8,0.8778,0.4914,0.7197,0.3333,0.5996,0.2132,0.3512,0.0966');
    });

    it('ZAR - South African Rand (R)', (done) => {
      assert(done, culture, 'ZAR', 'D2 v3,2,8,3.1768,1.7784,2.6044,1.206,2.17,0.7716,1.2708,0.3496');
    });

    it('NZD - New Zealand Dollar ($)', (done) => {
      assert(done, culture, 'NZD', 'D2 v3,2,8,0.316,0.1769,0.2591,0.12,0.2159,0.0768,0.1302,0.0359');
    });

    it('HKD - Hong Kong Dollar (HK$)', (done) => {
      assert(done, culture, 'HKD', 'D2 v3,2,8,1.6219,0.908,1.3296,0.6157,1.1079,0.3939,0.6488,0.1785');
    });
  });

  describe('es-es - Español', () => {
    const culture = 'es-es';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });

    it('ARS - Argentine Peso ($)', (done) => {
      assert(done, culture, 'ARS', 'D2 v3,2,8,"12,8389","7,1874","10,5255","4,8739","8,7698","3,1182","5,1356","1,4129"');
    });
  });

  describe('es-mx - Español (MX)', () => {
    const culture = 'es-mx';

    it('MXN - Mexican Peso (MXN$)', (done) => {
      assert(done, culture, 'MXN', 'D2 v3,2,8,4.0337,2.2581,3.3069,1.5313,2.7553,0.9797,1.6135,0.4439');
    });
  });

  describe('fr-fr - Français', () => {
    const culture = 'fr-fr';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'D2 v3,2,8,"0,2057","0,1152","0,1687","0,0781","0,1405","0,05","0,0836","0,023"');
    });
  });

  describe('fr-ca - Français (Canada)', () => {
    const culture = 'fr-ca';

    it('CAD - Canadian Dollar ($)', (done) => {
      assert(done, culture, 'CAD', 'D2 v3,2,8,"0,2676","0,1498","0,2194","0,1016","0,1828","0,065","0,1111","0,0306"');
    });
  });

  describe('is-is - Íslensku', () => {
    const culture = 'is-is';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });
  });

  describe('it-it - Italiano', () => {
    const culture = 'it-it';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'D2 v3,2,8,"0,2057","0,1152","0,1687","0,0781","0,1405","0,05","0,0836","0,023"');
    });
  });

  describe('hu-hu - Magyar', () => {
    const culture = 'hu-hu';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });
  });

  describe('nb-no - Norsk', () => {
    const culture = 'nb-no';

    it('NOK - Norwegian Krone (kr)', (done) => {
      assert(done, culture, 'NOK', 'D2 v3,2,8,"1,6959","0,9494","1,3903","0,6438","1,1584","0,4119","0,7672","0,2111"');
    });
  });

  describe('nl-nl - Nederlands', () => {
    const culture = 'nl-nl';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });
  });

  describe('pl-pl - Polski', () => {
    const culture = 'pl-pl';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });
  });

  describe('pt-br - Português (Brasil)', () => {
    const culture = 'pt-br';

    it('BRL - Brazilian Real (R$)', (done) => {
      assert(done, culture, 'BRL', 'D2 v3,2,8,"0,7764","0,4347","0,6365","0,2948","0,5304","0,1886","0,3106","0,0855"');
    });
  });

  describe('pt-pt - Português', () => {
    const culture = 'pt-pt';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,0761","0,021"');
    });
  });

  describe('sv-se - Svenska', () => {
    const culture = 'sv-se';

    it('SEK - Swedish Krona (kr)', (done) => {
      assert(done, culture, 'SEK', 'D2 v3,2,8,"1,8261","1,0223","1,4971","0,6932","1,2473","0,4435","0,8015","0,2205"');
    });
  });

  describe('tr-tr - Türkçe', () => {
    const culture = 'tr-tr';

    it('TRY - Turkish Lira (TL)', (done) => {
      assert(done, culture, 'TRY', 'D2 v3,2,8,"1,1712","0,6557","0,9602","0,4447","0,8","0,2845","0,4685","0,1289"');
    });
  });

  describe('ru-ru - Pусский', () => {
    const culture = 'ru-ru';

    it('RUB - Russian Ruble (руб)', (done) => {
      assert(done, culture, 'RUB', 'D2 v3,2,8,"13,0625","7,3125","10,7088","4,9588","8,9225","3,1725","5,3555","1,4734"');
    });
  });

  describe('ja-jp - 日本語', () => {
    const culture = 'ja-jp';

    it('JPY - Japanese Yen (¥)', (done) => {
      assert(done, culture, 'JPY', 'D2 v3,2,8,23.408,13.104,19.1901,8.8861,15.9892,5.6852,9.1442,2.5158');
    });
  });

  describe('ko-kr - 한국어', () => {
    const culture = 'ko-kr';

    it('KRW - Korean Won (₩)', (done) => {
      assert(done, culture, 'KRW', 'D2 v3,2,8,235.0519,131.5841,192.6976,89.2298,160.5551,57.0873,98.4182,27.0768');
    });
  });

  describe('zh-tw - 中文(繁體)', () => {
    const culture = 'zh-tw';

    it('TWD - Taiwanese Dollar (NT$)', (done) => {
      assert(done, culture, 'TWD', 'D2 v3,2,8,6.2814,3.5164,5.1495,2.3846,4.2906,1.5256,2.5503,0.7017');
    });

    it('HKD - Hong Kong Dollar (HK$)', (done) => {
      assert(done, culture, 'HKD', 'D2 v3,2,8,1.6219,0.908,1.3296,0.6157,1.1079,0.3939,0.6488,0.1785');
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

    let foundExpectedVirtualMachine = false;

    rl.on('close', () => {
      if (!foundExpectedVirtualMachine) {
        fail('Did not find "D2 v3" virtual machine.');
      }
    });

    rl.on('line', (line) => {
      if (line.startsWith('D2 v3,')) {
        foundExpectedVirtualMachine = true;
        rl.close();
        expect(line).to.equal(expectedCsvFirstVm);
        done();
      }
    });
  });
}
