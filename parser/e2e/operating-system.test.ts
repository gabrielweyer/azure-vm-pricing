import assert from "./assert-extensions";

describe('End-to-end tests for supported operating systems', () => {
  const culture = 'en-us';
  const currency = 'usd';

  test('Ubuntu Advantage Essential', (done) => {
    const operatingSystem = 'ubuntu-advantage-essential';

    assert(done, culture, currency, operatingSystem);
  });
});
