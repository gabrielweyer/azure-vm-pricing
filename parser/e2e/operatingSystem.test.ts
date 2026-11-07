import { describe, test } from 'vitest';
import assert from "./assertExtensions.ts";

describe('End-to-end tests for supported operating systems', () => {
  const culture = 'en-us';
  const currency = 'usd';

  test('CentOS or Ubuntu linux (instance without savings plan)', async () => {
    const operatingSystem = 'linux';

    await assert(culture, currency, operatingSystem, 'S96');
  });

  test('Ubuntu Advantage Essential (no hybrid benefit)', async () => {
    const operatingSystem = 'ubuntu-advantage-essential';

    await assert(culture, currency, operatingSystem);
  });
});
