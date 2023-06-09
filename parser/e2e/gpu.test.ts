import assert from "./assertExtensions";

describe('End-to-end tests for instances with GPUs', () => {
  const culture = 'en-us';
  const currency = 'usd';
  const operatingSystem = 'windows';

  test('No reserved instances', (done) => {
    assert(done, culture, currency, operatingSystem, 'H16mr');
  });
});
