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
    # Sont écartées : l'ancienne application web, l'ancienne signature,
    # et les données personnelles que l'enveloppe d'origine contenait.
    # Ces données restent disponibles à part, en fichier de sauvegarde
    # à importer : l'APK est ainsi partageable tel quel.
    if n.startswith("assets/public/") or n.startswith("META-INF/") or n.startswith("assets/restoration/"):
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

// --- Couleur de fond de l'enveloppe Android --------------------------
// L'enveloppe d'origine peint son fond en bleu nuit (#173452) à deux
// endroits que le CSS ne peut pas atteindre : la configuration Capacitor,
// et resources.arsc pour la barre d'état et l'écran de démarrage. Tant
// qu'ils restent bleus, la page web s'affiche par-dessus un fond bleu
// quel que soit le thème choisi.
// Les valeurs de couleur d'un resources.arsc font quatre octets de large
// et sont typées : on peut donc les remplacer sur place, sans décaler
// quoi que ce soit ni recompiler les ressources.
console.log("Fond de l'enveloppe Android…");
const patchShell = `
import zipfile, shutil, sys, json
apk = sys.argv[1]
ancien = bytes.fromhex("523417ff")   # #173452, ARGB little-endian
nouveau = bytes.fromhex("f2f7faff")  # #faf7f2, blanc cassé chaud
tmp = apk + ".bg"
zin = zipfile.ZipFile(apk)
zout = zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED)
n_arsc = 0
for item in zin.infolist():
    data = zin.read(item.filename)
    if item.filename == "resources.arsc":
        n_arsc = data.count(ancien)
        data = data.replace(ancien, nouveau)
    elif item.filename == "assets/capacitor.config.json":
        cfg = json.loads(data.decode("utf8"))
        cfg.setdefault("android", {})["backgroundColor"] = "#faf7f2"
        data = json.dumps(cfg, indent=2).encode("utf8")
    zout.writestr(item, data, compress_type=item.compress_type)
zout.close()
shutil.move(tmp, apk)
print("  %d couleur(s) de fond corrigée(s) dans resources.arsc" % n_arsc)
`;
execFileSync(PY, ["-c", patchShell, tmp], { stdio: "inherit" });

// --- Alignement ------------------------------------------------------
// Indispensable : Android projette resources.arsc en mémoire depuis
// l'APK et refuse l'installation s'il n'est pas aligné. À faire avant
// la signature, qui fige le contenu.
console.log("Alignement…");
const aligned = tmp + ".aligned";
execFileSync(PY, ["tools/zipalign.py", tmp, aligned], { stdio: "inherit" });

// --- Signature -------------------------------------------------------
console.log("Signature…");
execFileSync(PY, ["tools/apksign.py", aligned, OUT, KEY], { stdio: "inherit" });
fs.rmSync(tmp, { force: true });
fs.rmSync(aligned, { force: true });

const mb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(1);
console.log(`\nAPK prêt : ${OUT}  (${mb} Mo)`);
console.log(
  "\nLa clé de signature est nouvelle : Android considère cet APK comme\n" +
    "une application distincte. Désinstallez l'ancienne avant d'installer\n" +
    "celle-ci, après avoir exporté vos données depuis Profil → Sauvegarde.",
);
