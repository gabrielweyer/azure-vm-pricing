import { describe, test } from 'vitest';
import assert from "./assertExtensions.ts";

describe('End-to-end tests for instances with GPUs', () => {
  const culture = 'en-us';
  const currency = 'usd';
  const operatingSystem = 'windows';

  test('No reserved instances', async () => {
    await assert(culture, currency, operatingSystem, 'H16mr');
  });
});
