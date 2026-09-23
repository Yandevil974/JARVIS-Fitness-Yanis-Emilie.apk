import { defineConfig } from '../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
export default defineConfig({
  testDir: '..',
  testMatch: ['**/complete-hotfix/tests/*.spec.mjs', '**/JARVIS-Fitness-Source/tests/timer-regression.spec.js'],
  timeout: 180000,
  expect: { timeout: 10000 },
  workers: 1,
  reporter: [['list']],
  outputDir: '../.cache/complete-tests',
  use: {
    baseURL: process.env.COMPLETE_URL || 'http://127.0.0.1:5175',
    viewport: { width: 1440, height: 1000 },
    headless: true,
    screenshot: 'only-on-failure',
    launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH ? {
      executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    } : {},
  },
});
