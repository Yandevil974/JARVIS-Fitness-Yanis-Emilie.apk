// Vérifier l'APK 1.22 : nouvelles vidéos, page de retour au calme, accueil vocal,
// menu sans « Aperçu visuels » et comparaison photo optionnelle. Sans transcoder.
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
const videos = [
  "roumain-unilateral-sans-charge",
  "souleve-de-terre-partiel",
  "souleve-de-terre-partiel-prise-snatch",
  "crunch-poulie-corde",
  "releves-jambes-suspendu",
];
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
  "souleve-de-terre-roumain-unilateral",
  "souleve-de-terre-partiel",
  "souleve-de-terre-partiel-prise-snatch",
  "crunch-a-la-poulie",
  "crunch-a-la-poulie-ou-au-sol",
  "releves-de-jambes-suspendu",
]) {
  const video = videoFor(id);
  if (!video || video.status !== "coached" || !video.coaching?.spoken)
    throw new Error("Correspondance accompagnée absente : " + id);
  if (!bundle.includes(id) || !bundle.includes(video.src))
    throw new Error("Association absente du bundle actif : " + id);
}

// Retour au calme : la page doit résoudre les vidéos d'étirements.
for (const marker of ['stretch-cobra.mp4', 'Terminer en douceur', 'Étirements de fin de séance'])
  if (!bundle.includes(marker)) throw new Error("Retour au calme incomplet : " + marker);

// Accueil vocal, menu et comparaison photo optionnelle.
for (const marker of ["1.22.0", "JARVIS est prêt.", "Accueil vocal à l’ouverture"])
  if (!bundle.includes(marker)) throw new Error("Élément attendu absent : " + marker);
// Le libellé peut subsister pour nommer la page ouverte directement, mais le
// menu ne doit plus le proposer : l'entrée de navigation « apercu » a disparu.
if (bundle.includes('["apercu","'))
  throw new Error("« Aperçu visuels » ne doit plus figurer dans la navigation.");
for (const marker of ["Comparer avec l’IA Groq", "J’accepte l’envoi de mes deux photos à Groq"])
  if (!bundle.includes(marker)) throw new Error("Comparaison photo incomplète : " + marker);

// Aucune sauvegarde personnelle embarquée (lecture de la liste des entrées,
// sans décompresser : un fichier absent ne doit pas faire échouer le script).
const listing = execFileSync("unzip", ["-Z1", apk], { maxBuffer: 64 * 1024 * 1024 })
  .toString()
  .split("\n");
if (listing.some((line) => line.trim() === "assets/restoration/yanis-profile.json"))
  throw new Error("Une sauvegarde personnelle ne doit pas être intégrée à la publication.");

console.log(
  `${videos.length} clips et posters identiques, 6 associations accompagnées, retour au calme vidéo, menu, accueil vocal et comparaison photo vérifiés dans l'APK.`,
);
