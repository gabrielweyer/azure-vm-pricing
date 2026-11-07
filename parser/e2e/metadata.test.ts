import { describe, expect, test } from 'vitest';
import listCultures from "./listCultures.ts";
import listSelectOptions from "./listSelectOptions.ts";

describe('List metadata:', () => {
  test('Currency', async () => {
    const currencies = await listSelectOptions('currency');
    expect(currencies).toMatchSnapshot();
  });

  test('OS/Software', async () => {
    const currencies = await listSelectOptions('softwareOSType');
    expect(currencies).toMatchSnapshot();
  });

  test('Region', async () => {
    const currencies = await listSelectOptions('region');
    expect(currencies).toMatchSnapshot();
  });

  test('Culture', async () => {
    const cultures = await listCultures();
    expect(cultures).toMatchSnapshot();
  });
});
