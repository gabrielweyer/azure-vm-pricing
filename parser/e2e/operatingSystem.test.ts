import assert from "./assertExtensions";

describe('End-to-end tests for supported operating systems', () => {
  const culture = 'en-us';
  const currency = 'usd';

  test('CentOS or Ubuntu linux (instance without savings plan)', (done) => {
    const operatingSystem = 'linux';

    assert(done, culture, currency, operatingSystem, 'S96');
  });

  test('Ubuntu Advantage Essential (no hybrid benefit)', (done) => {
    const operatingSystem = 'ubuntu-advantage-essential';

    assert(done, culture, currency, operatingSystem);
  });
});
