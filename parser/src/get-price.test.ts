import * as jsdom from 'jsdom';
import { getPrice } from './app';

function getMarkup(priceValue: string, timePeriod: string): HTMLTableRowElement {
  return jsdom.JSDOM
    .fragment(`<tr><td><p><span class="price-value">${priceValue}</span>${timePeriod}</p></td></tr>`)
    .querySelector('tr');
}

describe('Get Price', () => {
  describe('Given culture using "," as the decimal point (e.g. "€0,014/hodina")', () => {
    test('Then parse price', () => {
      const tr = getMarkup('€0,014', '/hodina');

      const actualPrice = getPrice(tr, 'td:nth-child(1)');

      expect(actualPrice).toBe(0.014);
    });

    describe('And given price is over a thousand (e.g. uses both "." and "," such as "3.346,96")', () => {
      test('Then parse price', () => {
        const tr = getMarkup('Rp3.346,96', '/hour');

        const actualPrice = getPrice(tr, 'td:nth-child(1)');

        expect(actualPrice).toBe(3346.96);
      });
    });
  });

  describe('Given culture using "." as the decimal point (e.g. "$0.017/hour")', () => {
    test('Then parse price', () => {
      const tr = getMarkup('$0.017', '/hour');

      const actualPrice = getPrice(tr, 'td:nth-child(1)');

      expect(actualPrice).toBe(0.017);
    });

    describe('And given price is over a thousand (e.g. uses both "," and "." such as "3,346.96")', () => {
      test('Then parse price', () => {
        const tr = getMarkup('$3,346.96', '/hour');

        const actualPrice = getPrice(tr, 'td:nth-child(1)');

        expect(actualPrice).toBe(3346.96);
      });
    });
  });
});
