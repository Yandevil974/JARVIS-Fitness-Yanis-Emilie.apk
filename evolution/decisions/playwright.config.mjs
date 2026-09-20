import { defineConfig } from "../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs";
export default defineConfig({
  testDir: "../..",
  testMatch: [
    "**/evolution/decisions/tests/*.spec.mjs",
    "**/evolution/adaptation/tests/*.spec.mjs",
    "**/evolution/appointments/tests/*.spec.mjs",
    "**/evolution/spokesperson/tests/*.spec.mjs",
    "**/evolution/voice/tests/*.spec.mjs",
    "**/evolution/reminders/tests/*.spec.mjs",
    "**/complete-hotfix/tests/*.spec.mjs",
    "**/JARVIS-Fitness-Source/tests/timer-regression.spec.js",
  ],
  // Compare against cumulative stage 5; mask only decision controls and deliberate wording changes.
  grepInvert:
    /All screens\/tabs match supplied APK exactly|Complete modules preserved with new dashboard|Step 2 retains complete screens|Step 3 retains complete screens|Step 4 retains complete screens|Step 5 retains complete screens/,
  timeout: 180000,
  expect: { timeout: 10000 },
  workers: 1,
  reporter: [["list"]],
  outputDir: "../../.cache/decisions-tests",
  use: {
    baseURL: process.env.COMPLETE_URL || "http://127.0.0.1:5179",
    viewport: { width: 1440, height: 1000 },
    timezoneId: "Indian/Reunion",
    actionTimeout: 15000,
    headless: true,
    screenshot: "only-on-failure",
    launchOptions: process.env.CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        }
      : {},
  },
});
