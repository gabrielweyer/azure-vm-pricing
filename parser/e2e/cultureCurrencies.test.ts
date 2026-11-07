import { describe, test } from 'vitest';
import assert from "./assertExtensions.ts";

describe('End-to-end tests for supported cultures and currencies', () => {
  describe('en-us - English (US)', () => {
    const culture = 'en-us';

    test('USD - US Dollar ($)', async () => {
      const currency = 'usd';

      await assert(culture, currency);
    });
  });

  describe('cs-cz - Čeština', () => {
    const culture = 'cs-cz';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });
  });

  describe('da-dk - Dansk', () => {
    const culture = 'da-dk';

    test('DKK - Danish Krone (kr)', async () => {
      const currency = 'dkk';

      await assert(culture, currency);
    });
  });

  describe('de-de - Deutsch', () => {
    const culture = 'de-de';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });

    test('CHF - Swiss Franc. (chf)', async () => {
      const currency = 'chf';

      await assert(culture, currency);
    });
  });

  describe('en-au - English (Australia)', () => {
    const culture = 'en-au';

    test('AUD - Australian Dollar ($)', async () => {
      const currency = 'aud';

      await assert(culture, currency);
    });
  });

  describe('en-ca - English (Canada)', () => {
    const culture = 'en-ca';

    test('CAD - Canadian Dollar ($)', async () => {
      const currency = 'cad';

      await assert(culture, currency);
    });
  });

  describe('en-in - English (India)', () => {
    const culture = 'en-in';

    test('INR - Indian Rupee (₹)', async () => {
      const currency = 'inr';

      await assert(culture, currency);
    });
  });

  describe('en-gb - English (UK)', () => {
    const culture = 'en-gb';

    test('GBP - British Pound (£)', async () => {
      const currency = 'gbp';

      await assert(culture, currency);
    });

    test('NZD - New Zealand Dollar ($)', async () => {
      const currency = 'nzd';

      await assert(culture, currency);
    });
  });

  describe('es-es - Español', () => {
    const culture = 'es-es';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });
  });

  describe('es-mx - Español (MX)', () => {
    const culture = 'es-mx';

    test('USD - US Dollar ($)', async () => {
      const currency = 'usd';

      await assert(culture, currency);
    });
  });

  describe('fr-fr - Français', () => {
    const culture = 'fr-fr';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });

    test('CHF - Swiss Franc. (chf)', async () => {
      const currency = 'chf';

      await assert(culture, currency);
    });
  });

  describe('fr-ca - Français (Canada)', () => {
    const culture = 'fr-ca';

    test('CAD - Canadian Dollar ($)', async () => {
      const currency = 'cad';

      await assert(culture, currency);
    });
  });

  describe('it-it - Italiano', () => {
    const culture = 'it-it';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });

    test('CHF - Swiss Franc. (chf)', async () => {
      const currency = 'chf';

      await assert(culture, currency);
    });
  });

  describe('hu-hu - Magyar', () => {
    const culture = 'hu-hu';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });
  });

  describe('nb-no - Norsk', () => {
    const culture = 'nb-no';

    test('NOK - Norwegian Krone (kr)', async () => {
      const currency = 'nok';

      await assert(culture, currency);
    });
  });

  describe('nl-nl - Nederlands', () => {
    const culture = 'nl-nl';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });
  });

  describe('pl-pl - Polski', () => {
    const culture = 'pl-pl';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });
  });

  describe('pt-br - Português (Brasil)', () => {
    const culture = 'pt-br';

    test('BRL - Brazilian Real (R$)', async () => {
      const currency = 'brl';

      await assert(culture, currency);
    });
  });

  describe('pt-pt - Português', () => {
    const culture = 'pt-pt';

    test('EUR - Euro (€)', async () => {
      const currency = 'eur';

      await assert(culture, currency);
    });
  });

  describe('sv-se - Svenska', () => {
    const culture = 'sv-se';

    test('SEK - Swedish Krona (kr)', async () => {
      const currency = 'sek';

      await assert(culture, currency);
    });
  });

  describe('tr-tr - Türkçe', () => {
    const culture = 'tr-tr';

    test('USD - US Dollar ($)', async () => {
      const currency = 'usd';

      await assert(culture, currency);
    });
  });

  describe('ru-ru - Pусский', () => {
    const culture = 'ru-ru';

    test('RUB - Russian Ruble (руб)', async () => {
      const currency = 'rub';

      await assert(culture, currency);
    });
  });

  describe('ja-jp - 日本語', () => {
    const culture = 'ja-jp';

    test('JPY - Japanese Yen (¥)', async () => {
      const currency = 'jpy';

      await assert(culture, currency);
    });
  });

  describe('ko-kr - 한국어', () => {
    const culture = 'ko-kr';

    test('KRW - Korean Won (₩)', async () => {
      const currency = 'krw';

      await assert(culture, currency);
    });
  });

  describe('zh-tw - 中文(繁體)', () => {
    const culture = 'zh-tw';

    test('TWD - Taiwanese Dollar (NT$)', async () => {
      const currency = 'twd';

      await assert(culture, currency);
    });
  });
});
