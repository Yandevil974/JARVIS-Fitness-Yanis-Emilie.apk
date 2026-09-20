import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
// A separate compiled bundle supports the original one-file-with-data export.
// The maintainable application remains split into React, engine, data, and native modules.
await build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["chrome100"],
  outfile: "public/runtime.js",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".woff2": "dataurl", ".ttf": "dataurl" },
  external: ["/fonts/manrope.woff2"],
  logLevel: "warning",
});
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (!/runtime\.(js|css)$|media-index\.json$/.test(p))
      files.push("/" + p.replace(/^public\//, ""));
  }
}
walk("public");
fs.writeFileSync("public/media-index.json", JSON.stringify(files));
console.log(
  `Portable export runtime ready; ${files.length} local media assets.`,
);
