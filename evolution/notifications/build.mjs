// Extend the complete supplied APK cumulatively; never rebuild the incomplete historical UI.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build } from "../../JARVIS-Fitness-Source/node_modules/esbuild/lib/main.js";
import { parse } from "../../JARVIS-Fitness-Source/node_modules/acorn/dist/acorn.mjs";
import {
  integrate as previous,
  prepare as preparePrevious,
} from "../decisions/build.mjs";
import { replaceOnce } from "../reminders/build.mjs";
import { config, sha256 } from "../../complete-hotfix/patch-web.mjs";
const root = fileURLToPath(new URL("../..", import.meta.url));
const ast = (text) =>
  parse(text, { ecmaVersion: "latest", sourceType: "module" });
function change(source, name, transform) {
  const node = ast(source).body.find(
    (n) => n.type === "FunctionDeclaration" && n.id.name === name,
  );
  if (!node) throw Error("Missing host " + name);
  return (
    source.slice(0, node.start) +
    transform(source.slice(node.start, node.end)) +
    source.slice(node.end)
  );
}
export async function integrate(original) {
  let source = await previous(original);
  source = change(source, "t2", (f) =>
    replaceOnce(
      f,
      "s.jsx(JarvisFollowUp.Board,{})",
      "s.jsx(JarvisFollowUp.Board,{}),s.jsx(JarvisNotifications.Board,{})",
    ),
  );
  source = change(source, "I3", (f) =>
    replaceOnce(
      f,
      "s.jsx(JarvisFollowUp.Observer,{})",
      "s.jsx(JarvisFollowUp.Observer,{}),s.jsx(JarvisNotifications.Observer,{})",
    ),
  );
  source = change(source, "nd", (f) =>
    replaceOnce(f, "if(!l||!vo()", "if(Vs()||!l||!vo()"),
  );
  source = change(source, "T3", (f) => {
    const calls = [];
    function visit(node) {
      if (!node || typeof node !== "object") return;
      if (
        node.type === "CallExpression" &&
        node.arguments?.[1]?.properties?.some(
          (p) =>
            p.key?.name === "label" &&
            p.value?.value === "Notifications système",
        )
      )
        calls.push(node);
      for (const v of Object.values(node))
        if (Array.isArray(v)) v.forEach(visit);
        else if (v && typeof v === "object") visit(v);
    }
    visit(ast(f));
    if (calls.length !== 1)
      throw Error("Missing historical notification switch");
    const n = calls[0];
    return (
      f.slice(0, n.start) +
      "(Vs()?s.jsx(JarvisNotifications.Shortcut,{}):" +
      f.slice(n.start, n.end) +
      ")" +
      f.slice(n.end)
    );
  });
  const oldFooter =
    "Rappels actualisés dans l’application. Les alertes Android lorsque l’application est fermée ne sont pas encore activées.";
  const nextFooter =
    "Rappels actualisés dans l’application. Les alertes application fermée se règlent séparément dans « Rappels Android ».";
  let matches = [];
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "Literal" && node.value === oldFooter) matches.push(node);
    for (const v of Object.values(node))
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") walk(v);
  }
  walk(ast(source));
  if (matches.length !== 1)
    throw Error("Missing legacy Android reminder footer");
  const n = matches[0];
  source =
    source.slice(0, n.start) + JSON.stringify(nextFooter) + source.slice(n.end);
  const extension = await build({
    entryPoints: [path.join(root, "evolution/notifications/Board.jsx")],
    bundle: true,
    format: "iife",
    globalName: "JarvisNotificationsModule",
    minify: true,
    write: false,
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    target: ["chrome100"],
    logLevel: "silent",
  });
  const injection = `\n${extension.outputFiles[0].text}\nconst JarvisNotifications=JarvisNotificationsModule.createNotifications({React:Wn,useApp:fe,Modal:We,native:Ua("JarvisReminders"),isAndroid:Vs,voice:JarvisVoice});\n`;
  source = replaceOnce(
    source,
    'O8.createRoot(document.getElementById("root"))',
    injection + 'O8.createRoot(document.getElementById("root"))',
  );
  ast(source);
  return source;
}
export async function prepare(base, destination) {
  await preparePrevious(base, destination);
  const original = execFileSync(
    "python3",
    [
      "-c",
      "import zipfile,sys;sys.stdout.buffer.write(zipfile.ZipFile(sys.argv[1]).read(sys.argv[2]))",
      base,
      config.bundle.path,
    ],
    { maxBuffer: 8 * 1024 * 1024 },
  ).toString();
  const updated = await integrate(original),
    relative = config.bundle.path.replace("assets/public/", "");
  fs.writeFileSync(path.join(destination, relative), updated);
  fs.writeFileSync(
    path.join(destination, "..", "notifications-build-report.json"),
    JSON.stringify(
      {
        stage: 7,
        bundle: sha256(updated),
        changedWebFiles: [relative],
        signedApkProduced: false,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Stage 7 preview:",
    destination,
    "\nBundle SHA-256:",
    sha256(updated),
  );
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await prepare(
    path.resolve(
      process.argv[2] || path.join(root, ".cache/reference/base.apk"),
    ),
    path.resolve(
      process.argv[3] || path.join(root, ".cache/notifications-web"),
    ),
  );
