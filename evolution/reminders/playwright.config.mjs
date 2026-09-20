import { defineConfig } from '../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
export default defineConfig({
  testDir: '../..',
  testMatch: ['**/evolution/reminders/tests/*.spec.mjs', '**/complete-hotfix/tests/*.spec.mjs', '**/JARVIS-Fitness-Source/tests/timer-regression.spec.js'],
  // These four exact-text tests are superseded by the stage 1 conservation tests:
  // only the dashboard reminder area is intentionally different.
  grepInvert: /All screens\/tabs match supplied APK exactly/,
  timeout: 180000, expect: { timeout: 10000 }, workers: 1,
  reporter: [['list']], outputDir: '../../.cache/reminders-tests',
  use: { baseURL: process.env.COMPLETE_URL || 'http://127.0.0.1:5175',
    viewport: { width: 1440, height: 1000 }, timezoneId: 'Indian/Reunion',
    actionTimeout: 15000, headless: true, screenshot: 'only-on-failure',
    launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH ? {
      executablePath: process.env.CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'],
    } : {},
  },
});
