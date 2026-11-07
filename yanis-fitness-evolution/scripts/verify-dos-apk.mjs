// Vérifie le contenu réel de l'APK contre les fichiers source de la branche.
// Usage : node scripts/verify-dos-apk.mjs android/app/build/outputs/apk/release/app-release.apk
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { EXERCISES } from "../src/data/library.js";
import { videoFor } from "../src/data/exercise-videos.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const apk = process.argv[2] && resolve(process.argv[2]);
if (!apk) throw new Error("Indiquez le chemin de l'APK à contrôler");
const unzip = (...args) => execFileSync("unzip", args, { maxBuffer: 32 * 1024 * 1024 });
const entries = new Set(unzip("-Z1", apk).toString("utf8").trim().split("\n"));
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const jsPaths = [...entries].filter((name) => /^assets\/public\/assets\/.*\.js$/.test(name));
if (!jsPaths.length) throw new Error("Aucun JavaScript applicatif trouvé dans l'APK");
const bundle = jsPaths.map((name) => unzip("-p", apk, name).toString("utf8")).join("\n");
const dos = EXERCISES.filter((exercise) => exercise.muscle === "dos");
if (dos.length !== 25) throw new Error(`Attendu 25 exercices dos, reçu ${dos.length}`);
for (const [index, exercise] of dos.entries()) {
  const video = videoFor(exercise);
  if (!video || video.status !== "coached" || !video.coaching?.spoken)
    throw new Error(`Vidéo ou voix coached absente pour #${index + 1} ${exercise.id}`);
  // La visionneuse du bundle compilé doit contenir l'association utilisable.
  if (!bundle.includes(exercise.id) || !bundle.includes(video.src))
    throw new Error(`Association vidéo absente du code APK : ${exercise.id}`);
  for (const url of [video.src, video.poster, exercise.gif]) {
    if (typeof url !== "string" || !url.startsWith("/")) throw new Error(`Chemin invalide pour ${exercise.id}`);
    const entry = `assets/public${url}`;
    if (!entries.has(entry)) throw new Error(`Fichier absent de l'APK : ${entry}`);
    const expected = sha(readFileSync(join(root, "public", url.slice(1))));
    const actual = sha(unzip("-p", apk, entry));
    if (actual !== expected) throw new Error(`Hash différent dans l'APK : ${entry}`);
  }
  console.log(`Dos #${String(index + 1).padStart(2, "0")} ${exercise.id} : MP4, poster, GIF, association et hashes OK`);
}
console.log("25/25 vidéos dos et leurs posters et GIF correspondent à la branche.");
