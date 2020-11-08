import * as jsdom from 'jsdom';
import { expect } from "chai";
import { getPrice } from './app';

function getMarkup(label: string): HTMLTableRowElement {
  return jsdom.JSDOM
    .fragment(`<tr><td class="column-6"><span>${label}</span></td></tr>`)
    .querySelector('tr');
}

describe('Get Price', () => {
  describe('Given culture using "," as the decimal point (e.g. "€0,014/hodina")', () => {
    it('Then parse price', () => {
      const tr = getMarkup('€0,014/hodina');

      const actualPrice = getPrice(tr, '.column-6');

      expect(actualPrice).to.equal(0.014);
    });

    describe('And given price is over a thousand (e.g. uses both "." and "," such as "3.346,96")', () => {
      it('Then parse price', () => {
        const tr = getMarkup('Rp3.346,96/hour');

        const actualPrice = getPrice(tr, '.column-6');

        expect(actualPrice).to.equal(3346.96);
      });
    });
  });

  describe('Given culture using "." as the decimal point (e.g. "$0.017/hour")', () => {
    it('Then parse price', () => {
      const tr = getMarkup('$0.017/hour');

      const actualPrice = getPrice(tr, '.column-6');

      expect(actualPrice).to.equal(0.017);
    });

    describe('And given price is over a thousand (e.g. uses both "," and "." such as "3,346.96")', () => {
      it('Then parse price', () => {
        const tr = getMarkup('$3,346.96/hour');

        const actualPrice = getPrice(tr, '.column-6');

        expect(actualPrice).to.equal(3346.96);
      });
    });
  });

  describe('Given culture ("nb-no") does not use "/" as separation before duration (eg "kr0,134 per time")', () => {
    it('Then parse price', () => {
      const tr = getMarkup('kr0,134 per time');

      const actualPrice = getPrice(tr, '.column-6');

      expect(actualPrice).to.equal(0.134);
    });
  });

  describe('Given culture ("zh-tw") puts duration before the price', () => {
    describe('And given no discount (eg "每小時 NT$0.493")', () => {
      it('Then parse price', () => {
        const tr = getMarkup('每小時 NT$0.493');

        const actualPrice = getPrice(tr, '.column-6');

        expect(actualPrice).to.equal(0.493);
      });
    });

    describe('And given discount (eg "每小時 NT$0.337 (~32%)")', () => {
      it('Then parse price', () => {
        const tr = getMarkup('每小時 NT$0.337 (~32%)');

        const actualPrice = getPrice(tr, '.column-6');

        expect(actualPrice).to.equal(0.337);
      });
    });
  });
});
