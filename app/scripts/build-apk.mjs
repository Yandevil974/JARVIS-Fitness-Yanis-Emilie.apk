/* ============================================================
   FABRICATION DE L'APK
   ------------------------------------------------------------
   Reconstruit un APK installable en réinjectant l'application
   web compilée dans l'enveloppe Android existante, puis en le
   resignant.

   Pourquoi cette approche plutôt que Gradle : la compilation
   native demande un JDK et le SDK Android, absents de cet
   environnement. Or l'enveloppe Android (code Capacitor,
   permissions, icônes) n'a pas changé — seule l'application web
   évolue. La réinjection produit donc exactement le même
   résultat, sans chaîne de compilation.

   Prérequis : un environnement Python avec `cryptography`.
   Le script le crée au besoin dans app/.private/venv.

   Usage :
     npm run build          # compile l'application web
     node scripts/build-apk.mjs
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve("..");
const SHELL = path.join(ROOT, "ANCIENNE-VERSION-obsolete.apk");
const WEB = "release";
const OUT = path.join(ROOT, "JARVIS-Fitness.apk");
const KEY = ".private/jarvis-signing-key.pem";
const VENV = ".private/venv";
const PY = path.join(VENV, "bin", "python");

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!fs.existsSync(SHELL))
  fail(
    `Enveloppe Android introuvable : ${SHELL}\n` +
      "Un APK Capacitor existant est nécessaire comme base.",
  );
if (!fs.existsSync(path.join(WEB, "index.html")))
  fail("release/ est absent : lancez d'abord `npm run build`.");

// --- Environnement Python -------------------------------------------
if (!fs.existsSync(PY)) {
  console.log("Création de l'environnement Python…");
  execFileSync("python3", ["-m", "venv", VENV], { stdio: "inherit" });
  execFileSync(PY.replace("python", "pip"), ["install", "--quiet", "cryptography"], {
    stdio: "inherit",
  });
}

// --- Réinjection de l'application web -------------------------------
console.log("Réinjection de l'application web…");
const script = `
import zipfile, os, sys
src, web, out = sys.argv[1], sys.argv[2], sys.argv[3]
repl = {}
for root, _, files in os.walk(web):
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, web).replace(os.sep, "/")
        repl["assets/public/" + rel] = full
zin = zipfile.ZipFile(src)
stored = {n for n in zin.namelist() if zin.getinfo(n).compress_type == 0}
zout = zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    n = item.filename
    # L'ancienne application web et l'ancienne signature sont écartées.
    if n.startswith("assets/public/") or n.startswith("META-INF/"):
        continue
    zout.writestr(item, zin.read(n), compress_type=item.compress_type)
KEEP = ("webp","jpg","jpeg","png","gif","mp4","woff2")
for apkpath, local in sorted(repl.items()):
    # Les médias déjà compressés restent STORED, comme dans l'original.
    ct = zipfile.ZIP_STORED if apkpath in stored or apkpath.rsplit(".",1)[-1].lower() in KEEP else zipfile.ZIP_DEFLATED
    zout.write(local, apkpath, compress_type=ct)
zout.close()
print("  %d fichiers web injectés" % len(repl))
`;
const tmp = path.join(ROOT, ".apk-unsigned.tmp");
execFileSync(PY, ["-c", script, SHELL, WEB, tmp], { stdio: "inherit" });

// --- Signature -------------------------------------------------------
console.log("Signature…");
execFileSync(PY, ["tools/apksign.py", tmp, OUT, KEY], { stdio: "inherit" });
fs.rmSync(tmp, { force: true });

const mb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(1);
console.log(`\nAPK prêt : ${OUT}  (${mb} Mo)`);
console.log(
  "\nLa clé de signature est nouvelle : Android considère cet APK comme\n" +
    "une application distincte. Désinstallez l'ancienne avant d'installer\n" +
    "celle-ci, après avoir exporté vos données depuis Profil → Sauvegarde.",
);
