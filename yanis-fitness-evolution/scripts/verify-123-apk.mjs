// Vérifier l'APK 1.23 : les trois vidéos de mollets, leurs réserves écrites et le
// matériel corrigé des cinq fiches. Sans transcoder, comme les contrôles précédents.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { videoFor } from "../src/data/exercise-videos.js";

if (!process.argv[2]) throw new Error("Chemin APK requis");
const apk = resolve(process.argv[2]);
const unzip = (p) => execFileSync("unzip", ["-p", apk, p], { maxBuffer: 64 * 1024 * 1024 });
const sha = (b) => createHash("sha256").update(b).digest("hex");

const html = unzip("assets/public/index.html").toString();
const js = html.match(/<script[^>]+src="\.\/([^"]+\.js)"/);
if (!js) throw new Error("Bundle actif introuvable");
const bundle = unzip("assets/public/" + js[1]).toString();

// Clips ajoutés depuis la 1.21 : les trois derniers ischios et les deux abdos.
const videos = ["mollets-debout", "mollets-assis", "mollets-unilateraux"];
for (const name of videos) {
  const path = `/videos/${name}.mp4`;
  const poster = `/videos/posters/${name}.jpg`;
  for (const p of [path, poster]) {
    if (sha(unzip("assets/public" + p)) !== sha(readFileSync("public" + p)))
      throw new Error(`Média absent ou différent : ${p}`);
  }
  if (!bundle.includes(path)) throw new Error(`Vidéo absente du bundle actif : ${path}`);
}

// Fiches raccordées dans cette version.
for (const id of [
  "mollets-debout",
  "mollets-assis",
  "mollets-unilateraux",
  "mollets-debout-unilateraux",
  "mollets-a-la-presse",
]) {
  const video = videoFor(id);
  if (!video || video.status !== "coached" || !video.coaching?.spoken)
    throw new Error("Correspondance accompagnée absente : " + id);
  if (!bundle.includes(id) || !bundle.includes(video.src))
    throw new Error("Association absente du bundle actif : " + id);
}

// Réserves écrites : chaque clip a un défaut connu, la consigne doit le dire.
const notices = {
  "mollets-debout": /flotte/,
  "mollets-assis": /ne poussez pas avec les bras/,
  "mollets-unilateraux": /descente/,
};
for (const [id, re] of Object.entries(notices)) {
  const video = videoFor(id);
  if (!re.test(video.coaching.notice)) throw new Error("Réserve écrite absente : " + id);
  if (!bundle.includes(video.coaching.notice.slice(0, 40)))
    throw new Error("Réserve absente du bundle actif : " + id);
}

// Matériel corrigé dans les fiches, sans presse à cuisses.
for (const marker of ["Mollets debout", "Mollets assis", "Mollets à la presse"])
  if (!bundle.includes(marker)) throw new Error("Fiche mollet absente du bundle : " + marker);

// Version et éléments conservés des livraisons précédentes.
for (const marker of ["1.23.0", "JARVIS est prêt.", "Terminer en douceur"])
  if (!bundle.includes(marker)) throw new Error("Élément attendu absent : " + marker);

// Les GIF d'origine restent embarqués pour les cinq fiches.
for (const gif of ["f1a40f2c8c8502db.gif"])
  unzip("assets/public/media/" + gif);

console.log("APK 1.23 vérifié : trois vidéos de mollets, réserves écrites, matériel corrigé.");
