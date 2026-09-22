// Extend the RELEASED complete 1.3.0 app. No historical UI rebuild, no APK signing.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build } from "../../JARVIS-Fitness-Source/node_modules/esbuild/lib/main.js";
import { parse } from "../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs";
import { sha256 } from "../../complete-hotfix/patch-web.mjs";
import { replaceOnce } from "../reminders/build.mjs";
export const baseline = JSON.parse(
  fs.readFileSync(new URL("./baseline.json", import.meta.url)),
);
const root = fileURLToPath(new URL("../..", import.meta.url));
const ast = (text) =>
  parse(text, { ecmaVersion: "latest", sourceType: "module" });
const prop = (node, key) =>
  node?.properties?.find((p) => p.key?.name === key)?.value;
function visit(node, action) {
  if (!node || typeof node !== "object") return;
  action(node);
  for (const value of Object.values(node))
    if (Array.isArray(value)) value.forEach((n) => visit(n, action));
    else if (value && typeof value === "object") visit(value, action);
}
export function transformHome(fn) {
  const tree = ast(fn),
    matches = {};
  visit(tree, (node) => {
    if (node.type !== "CallExpression") return;
    const props = node.arguments[1];
    const cls = prop(props, "className")?.value;
    if (["training-hero", "dashboard-layout"].includes(cls))
      matches[cls] = node;
    if (
      node.callee?.object?.name === "s" &&
      node.arguments[0]?.object?.name === "s" &&
      node.arguments[0]?.property?.name === "Fragment" &&
      !matches.root
    )
      matches.root = node;
  });
  if (
    !matches.root ||
    !matches["training-hero"] ||
    !matches["dashboard-layout"]
  )
    throw Error("Home integration points missing");
  const children = prop(matches.root.arguments[1], "children").elements;
  if (children.length !== 8) throw Error("Unexpected home structure");
  const text = (n) => fn.slice(n.start, n.end);
  const hero = matches["training-hero"],
    dashboard = matches["dashboard-layout"];
  // Move the exact original hero (including handlers) to the first slot; no copy.
  const remainder = text(dashboard).replace(text(hero) + ",", "");
  if (
    remainder === text(dashboard) ||
    remainder.includes('className:"training-hero"')
  )
    throw Error("Hero move failed");
  const component = (n, name) => {
    if (text(n) !== `s.jsx(${name}.Board,{})`)
      throw Error("Unexpected board " + name);
    return text(n);
  };
  const layout = `s.jsx(JarvisHome.Layout,{heading:${text(children[0])},session:${text(hero)},point:${component(children[1], "JarvisSpokesperson")},adaptation:${component(children[2], "JarvisAdaptation")},appointments:${component(children[3], "JarvisAppointments")},followup:${component(children[4], "JarvisFollowUp")},notifications:${component(children[5], "JarvisNotifications")},dashboard:${remainder},footer:${text(children[7])}})`;
  return fn.slice(0, matches.root.start) + layout + fn.slice(matches.root.end);
}
export async function integrate(source) {
  if (sha256(source) !== baseline.bundleSha256)
    throw Error(
      "Requires the exact released 1.3.0 bundle; refuses unknown/already patched input",
    );
  const node = ast(source).body.find((n) => n.id?.name === "t2");
  source =
    source.slice(0, node.start) +
    transformHome(source.slice(node.start, node.end)) +
    source.slice(node.end);
  // The existing Plus button still opens the complete original sidebar.
  source = replaceOnce(
    source,
    "od.slice(0,5).map(",
    '(l==="dashboard"?["dashboard","training","progress","jarvis"].map(k=>od.find(t=>t[0]===k)):od.slice(0,5)).map(',
  );
  const extension = await build({
    entryPoints: [path.join(root, "evolution/home/Home.jsx")],
    bundle: true,
    format: "iife",
    globalName: "JarvisHomeModule",
    minify: true,
    write: false,
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    loader: { ".css": "text" },
    target: ["chrome100"],
    logLevel: "silent",
  });
  source = replaceOnce(
    source,
    'O8.createRoot(document.getElementById("root"))',
    `\n${extension.outputFiles[0].text}\nconst JarvisHome=JarvisHomeModule.createHome({React:Wn,useApp:fe,Icon:z});\nO8.createRoot(document.getElementById("root"))`,
  );
  ast(source);
  return source;
}
export async function prepare(
  base = path.join(root, baseline.apk),
  destination = path.join(root, ".cache/home-web"),
) {
  if (sha256(fs.readFileSync(base)) !== baseline.apkSha256)
    throw Error("Wrong APK baseline");
  const dest = path.resolve(destination);
  if (!dest.startsWith(path.join(root, ".cache") + path.sep))
    throw Error("Candidate assets must stay under .cache");
  execFileSync("python3", [
    "-c",
    `import zipfile,pathlib,sys
z=zipfile.ZipFile(sys.argv[1]); root=pathlib.Path(sys.argv[2]);root.mkdir(parents=True,exist_ok=True)
for name in z.namelist():
 if not name.startswith('assets/public/') or name.endswith('/'):continue
 relative=pathlib.PurePosixPath(name).relative_to('assets/public')
 if '..' in relative.parts:raise ValueError('Unsafe ZIP path')
 p=root.joinpath(*relative.parts);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(name))`,
    base,
    dest,
  ]);
  const bundle = baseline.bundle.replace("assets/public/", "");
  const candidate = await integrate(
    fs.readFileSync(path.join(dest, bundle), "utf8"),
  );
  fs.writeFileSync(path.join(dest, bundle), candidate);
  const report = {
    baseline,
    candidateBundleSha256: sha256(candidate),
    changedWebFiles: [bundle],
    newFiles: [],
    signedApkProduced: false,
    scope:
      "Authorized home integration, all seven stages retained; no Android release configuration changed",
  };
  fs.writeFileSync(
    path.join(dest, "..", "home-build-report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
  return report;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await prepare(process.argv[2], process.argv[3]);
