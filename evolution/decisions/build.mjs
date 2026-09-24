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
} from "../adaptation/build.mjs";
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
  source = replaceOnce(
    source,
    "createAdaptation({React:Wn,useApp:fe,getExercise:ze,voice:JarvisVoice})",
    "createAdaptation({React:Wn,useApp:fe,getExercise:ze,voice:JarvisVoice,DecisionControls:props=>Wn.createElement(JarvisDecisions.Controls,props)})",
  );
  source = change(source, "Q5", (f) =>
    replaceOnce(
      f,
      "appointment:s.jsx(JarvisAppointments.Dialog,{})",
      "decision:s.jsx(JarvisDecisions.Dialog,{}),appointment:s.jsx(JarvisAppointments.Dialog,{})",
    ),
  );
  source = change(source, "ho", (f) => {
    const prefix = "function ho(i,o,n=P()){",
      body = f.slice(prefix.length, -1);
    if (!f.startsWith(prefix))
      throw new Error("Unexpected load recommendation signature");
    return (
      prefix +
      "const original=(()=>{" +
      body +
      "})();return JarvisDecisions.recommendation(i,o,original)}"
    );
  });
  const extension = await build({
    entryPoints: [path.join(root, "evolution/decisions/Board.jsx")],
    bundle: true,
    format: "iife",
    globalName: "JarvisDecisionsModule",
    minify: true,
    write: false,
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    loader: { ".css": "text" },
    target: ["chrome100"],
    logLevel: "silent",
  });
  const injection = `\n${extension.outputFiles[0].text}\nconst JarvisDecisions=JarvisDecisionsModule.createDecisions({React:Wn,useApp:fe,Modal:We,makeWorkout:Yg,getExercise:ze,voice:JarvisVoice});\n`;
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
    path.join(destination, "..", "decisions-build-report.json"),
    JSON.stringify(
      {
        stage: 6,
        bundle: sha256(updated),
        changedWebFiles: [relative],
        signedApkProduced: false,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "Stage 6 preview:",
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
    path.resolve(process.argv[3] || path.join(root, ".cache/decisions-web")),
  );
