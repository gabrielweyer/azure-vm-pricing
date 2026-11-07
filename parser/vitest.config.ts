import { defineConfig } from 'vitest/config';

// Set in CI to publish a self-contained HTML report (see .github/workflows/parser.yml)
const htmlReportDir = process.env.VITEST_HTML_REPORT_DIR;

export default defineConfig({
  test: {
    testTimeout: 60_000,
    slowTestThreshold: 30_000,
    reporters: htmlReportDir
      ? ['default', ['html', { outputDir: htmlReportDir, singleFile: true }]]
      : ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
      reportsDirectory: 'coverage'
    }
  }
});
