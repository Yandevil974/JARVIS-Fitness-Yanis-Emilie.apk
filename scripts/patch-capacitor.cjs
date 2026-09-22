// Capacitor CLI 6 uses a tar default import. tar 7 removes it; use its safe named namespace.
// This compatibility shim permits the patched tar dependency instead of vulnerable tar 6.
const fs = require("node:fs");
const path = "node_modules/@capacitor/cli/dist/util/template.js";
if (fs.existsSync(path)) {
  let source = fs.readFileSync(path, "utf8");
  source = source.replace(
    'const tar_1 = tslib_1.__importDefault(require("tar"));',
    'const tar_1 = {default: require("tar")};',
  );
  fs.writeFileSync(path, source);
}

try {
  if (fs.existsSync("android/gradlew")) fs.chmodSync("android/gradlew", 0o755);
} catch (_) {}
