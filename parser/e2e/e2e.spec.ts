import { expect } from 'chai';
import child_process = require('child_process');
import fs = require('fs');
import readline = require('readline');
import { fail } from 'assert';

describe('End-to-end tests for supported cultures and currencies', () => {
  describe('en-us - English (US)', () => {
    const culture = 'en-us';

    it('USD - US Dollar ($)', (done) => {
      assert(done, culture, 'USD', 'D2 v3,2,8,0.209,0.117,0.1714,0.0794,0.1428,0.0508,0.0712,0.0285');
    });

    it('SAR - Saudi Riyal (SR)', (done) => {
      assert(done, culture, 'SAR', 'D2 v3,2,8,0.7838,0.4388,0.6426,0.2976,0.5354,0.1904,0.2668,0.1068');
    });

    it('IDR - Indonesian Rupiah (Rp)', (done) => {
      assert(done, culture, 'IDR', 'D2 v3,2,8,3268.76,1829.88,2679.7576,1240.8776,2232.7664,793.8864,1112.3638,445.0206');
    });
  });

  describe('cs-cz - Čeština', () => {
    const culture = 'cs-cz';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });
  });

  describe('da-dk - Dansk', () => {
    const culture = 'da-dk';

    it('DKK - Danish Krone (kr)', (done) => {
      assert(done, culture, 'DKK', 'D2 v3,2,8,"1,3154","0,7364","1,0784","0,4994","0,8985","0,3195","0,4477","0,1791"');
    });
  });

  describe('de-de - Deutsch', () => {
    const culture = 'de-de';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'D2 v3,2,8,"0,2057","0,1152","0,1687","0,0781","0,1405","0,05","0,07","0,0281"');
    });
  });

  describe('en-au - English (Australia)', () => {
    const culture = 'en-au';

    it('AUD - Australian Dollar ($)', (done) => {
      assert(done, culture, 'AUD', 'D2 v3,2,8,0.287,0.1607,0.2353,0.109,0.1961,0.0697,0.0977,0.0391');
    });
  });

  describe('en-ca - English (Canada)', () => {
    const culture = 'en-ca';

    it('CAD - Canadian Dollar ($)', (done) => {
      assert(done, culture, 'CAD', 'D2 v3,2,8,0.2676,0.1498,0.2194,0.1016,0.1828,0.065,0.0911,0.0365');
    });
  });

  describe('en-in - English (India)', () => {
    const culture = 'en-in';

    it('INR - Indian Rupee (₹)', (done) => {
      assert(done, culture, 'INR', 'D2 v3,2,8,13.8142,7.7333,11.325,5.2441,9.436,3.3551,4.701,1.8808');
    });
  });

  describe('en-gb - English (UK)', () => {
    const culture = 'en-gb';

    it('GBP - British Pound (£)', (done) => {
      assert(done, culture, 'GBP', 'D2 v3,2,8,0.1558,0.0873,0.1278,0.0592,0.1065,0.0379,0.0531,0.0213');
    });

    it('MYR - Malaysian Ringgit (RM$)', (done) => {
      assert(done, culture, 'MYR', 'D2 v3,2,8,0.8778,0.4914,0.7197,0.3333,0.5996,0.2132,0.2988,0.1196');
    });

    it('ZAR - South African Rand (R)', (done) => {
      assert(done, culture, 'ZAR', 'D2 v3,2,8,3.831,2.1447,3.1407,1.4544,2.6168,0.9305,1.3037,0.5216');
    });

    it('NZD - New Zealand Dollar ($)', (done) => {
      assert(done, culture, 'NZD', 'D2 v3,2,8,0.316,0.1769,0.2591,0.12,0.2159,0.0768,0.1076,0.0431');
    });

    it('HKD - Hong Kong Dollar (HK$)', (done) => {
      assert(done, culture, 'HKD', 'D2 v3,2,8,1.6219,0.908,1.3296,0.6157,1.1079,0.3939,0.552,0.2209');
    });
  });

  describe('es-es - Español', () => {
    const culture = 'es-es';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });

    it('ARS - Argentine Peso ($)', (done) => {
      assert(done, culture, 'ARS', 'D2 v3,2,8,"12,8389","7,1874","10,5255","4,8739","8,7698","3,1182","4,3691","1,748"');
    });
  });

  describe('es-mx - Español (MX)', () => {
    const culture = 'es-mx';

    it('MXN - Mexican Peso (MXN$)', (done) => {
      assert(done, culture, 'MXN', 'D2 v3,2,8,4.0337,2.2581,3.3069,1.5313,2.7553,0.9797,1.3727,0.5492');
    });
  });

  describe('fr-fr - Français', () => {
    const culture = 'fr-fr';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'D2 v3,2,8,"0,2057","0,1152","0,1687","0,0781","0,1405","0,05","0,07","0,0281"');
    });
  });

  describe('fr-ca - Français (Canada)', () => {
    const culture = 'fr-ca';

    it('CAD - Canadian Dollar ($)', (done) => {
      assert(done, culture, 'CAD', 'D2 v3,2,8,"0,2676","0,1498","0,2194","0,1016","0,1828","0,065","0,0911","0,0365"');
    });
  });

  describe('is-is - Íslensku', () => {
    const culture = 'is-is';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });
  });

  describe('it-it - Italiano', () => {
    const culture = 'it-it';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });

    it('CHF - Swiss Franc. (chf)', (done) => {
      assert(done, culture, 'CHF', 'D2 v3,2,8,"0,2057","0,1152","0,1687","0,0781","0,1405","0,05","0,07","0,0281"');
    });
  });

  describe('hu-hu - Magyar', () => {
    const culture = 'hu-hu';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });
  });

  describe('nb-no - Norsk', () => {
    const culture = 'nb-no';

    it('NOK - Norwegian Krone (kr)', (done) => {
      assert(done, culture, 'NOK', 'D2 v3,2,8,"1,6959","0,9494","1,3903","0,6438","1,1584","0,4119","0,5771","0,2309"');
    });
  });

  describe('nl-nl - Nederlands', () => {
    const culture = 'nl-nl';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });
  });

  describe('pl-pl - Polski', () => {
    const culture = 'pl-pl';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });
  });

  describe('pt-br - Português (Brasil)', () => {
    const culture = 'pt-br';

    it('BRL - Brazilian Real (R$)', (done) => {
      assert(done, culture, 'BRL', 'D2 v3,2,8,"0,8463","0,4738","0,6938","0,3213","0,5781","0,2056","0,288","0,1153"');
    });
  });

  describe('pt-pt - Português', () => {
    const culture = 'pt-pt';

    it('EUR - Euro (€)', (done) => {
      assert(done, culture, 'EUR', 'D2 v3,2,8,"0,1763","0,0987","0,1445","0,067","0,1204","0,0429","0,06","0,024"');
    });
  });

  describe('sv-se - Svenska', () => {
    const culture = 'sv-se';

    it('SEK - Swedish Krona (kr)', (done) => {
      assert(done, culture, 'SEK', 'D2 v3,2,8,"1,8261","1,0223","1,4971","0,6932","1,2473","0,4435","0,6215","0,2487"');
    });
  });

  describe('tr-tr - Türkçe', () => {
    const culture = 'tr-tr';

    it('TRY - Turkish Lira (TL)', (done) => {
      assert(done, culture, 'TRY', 'D2 v3,2,8,"1,5048","0,8424","1,2337","0,5713","1,0279","0,3655","0,5121","0,2049"');
    });
  });

  describe('ru-ru - Pусский', () => {
    const culture = 'ru-ru';

    it('RUB - Russian Ruble (руб)', (done) => {
      assert(done, culture, 'RUB', 'D2 v3,2,8,"13,0625","7,3125","10,7088","4,9588","8,9225","3,1725","4,4452","1,7784"');
    });
  });

  describe('ja-jp - 日本語', () => {
    const culture = 'ja-jp';

    it('JPY - Japanese Yen (¥)', (done) => {
      assert(done, culture, 'JPY', 'D2 v3,2,8,23.408,13.104,19.1901,8.8861,15.9892,5.6852,7.9658,3.1869');
    });
  });

  describe('ko-kr - 한국어', () => {
    const culture = 'ko-kr';

    it('KRW - Korean Won (₩)', (done) => {
      assert(done, culture, 'KRW', 'D2 v3,2,8,235.0519,131.5841,192.6976,89.2298,160.5551,57.0873,79.9885,32.0008');
    });
  });

  describe('zh-tw - 中文(繁體)', () => {
    const culture = 'zh-tw';

    it('TWD - Taiwanese Dollar (NT$)', (done) => {
      assert(done, culture, 'TWD', 'D2 v3,2,8,6.2814,3.5164,5.1495,2.3846,4.2906,1.5256,2.1376,0.8552');
    });

    it('HKD - Hong Kong Dollar (HK$)', (done) => {
      assert(done, culture, 'HKD', 'D2 v3,2,8,1.6219,0.908,1.3296,0.6157,1.1079,0.3939,0.552,0.2209');
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
