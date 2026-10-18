// Bibliothèque des démonstrations vidéo 3D validées.
//
// Principe : une vidéo n'est proposée que si elle est déclarée ici ET marquée
// `validated: true` après contrôle visuel. Tant qu'aucune vidéo validée
// n'existe pour un exercice, `Movement` conserve exactement le comportement
// d'origine (GIF source → association explicite → animation créée → anatomie).
//
// Le manifeste est un simple JSON livré avec l'application
// (`public/media/video/manifest.json`). Les fichiers vidéo ne sont pas inclus
// dans l'export HTML autonome (voir scripts/build-portable.mjs) : l'export
// portable retombe alors sur l'animation d'origine, sans écran vide.
import manifest from "../../public/media/video/manifest.json" with { type: "json" };

export const VIDEO_MANIFEST = manifest;
export const VIDEO_BASE = "/media/video/";

const byId = new Map();
for (const entry of manifest.videos || []) {
  if (!entry?.exerciseId || !entry?.file) continue;
  byId.set(entry.exerciseId, entry);
}

/** Vidéo validée pour un exercice, ou null. */
export function demoVideoFor(exercise) {
  if (!exercise?.id) return null;
  const entry = byId.get(exercise.id);
  if (!entry || entry.validated !== true) return null;
  return {
    ...entry,
    path: VIDEO_BASE + entry.file,
    posterPath: entry.poster ? VIDEO_BASE + entry.poster : null,
    source: "video3d",
  };
}

/** Nombre de démonstrations vidéo prêtes (indicateur de couverture). */
export function validatedVideoCount() {
  return [...byId.values()].filter((v) => v.validated === true).length;
}
