import previous from "../notifications/playwright.config.mjs";
export default {
  ...previous,
  testMatch: [...previous.testMatch, "**/evolution/home/tests/*.spec.mjs"],
  grepInvert:
    /All screens\/tabs match supplied APK exactly|Complete modules preserved with new dashboard|Step [2-7] retains complete screens/,
  outputDir: "../../.cache/home-tests",
  use: {
    ...previous.use,
    baseURL: process.env.COMPLETE_URL || "http://127.0.0.1:5183",
  },
};
