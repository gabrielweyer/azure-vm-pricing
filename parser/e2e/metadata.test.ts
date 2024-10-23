import listSelectOptions from "./listSelectOptions";

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
});
