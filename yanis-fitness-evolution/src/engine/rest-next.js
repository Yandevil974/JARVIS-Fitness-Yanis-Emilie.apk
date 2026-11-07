import { exerciseById } from "../data/library.js";
import { videoFor } from "../data/exercise-videos.js";
import { demonstrationFor } from "./demo-match.js";

// Même exercice que celui sélectionné pour la prochaine série. Les vidéos
// partagées entre fiches sont résolues par videoFor, comme le grand lecteur.
export function nextRestExercise(workout) {
  if (!workout?.exercises?.length) return null;
  const pending = (x) =>
    x && (x.sets || []).filter((s) => s.completed).length < x.targetSets;
  const selected = workout.exercises[workout.currentIndex];
  const target = pending(selected) ? selected : workout.exercises.find(pending);
  if (!target) return null;
  const ex = exerciseById(target.exerciseId);
  if (!ex) return null;
  const done = (target.sets || []).filter((s) => s.completed).length;
  const video = videoFor(ex);
  const demo = !video
    ? ex.gif
      ? { path: ex.gif }
      : demonstrationFor(ex)
    : null;
  return {
    nom: target.sourceName || ex.name,
    serie: done + 1,
    total: target.targetSets,
    charge: target.targetLoad,
    unite: target.unit,
    reps: target.repScheme || `${target.repsLow}–${target.repsHigh}`,
    video,
    img: demo?.path || (!video ? ex.img : null) || null,
  };
}

// Ouvrir la vidéo accompagnée de sa notice et de son descriptif, jamais le
// GIF historique à la place d'une vidéo jouable. Le GIF reste disponible quand
// aucune vidéo n'est raccordée ; il n'est ni supprimé ni modifié.
export function nextRestModal(next) {
  if (next.video) {
    const { video } = next;
    return {
      type: "image",
      src: video.src,
      poster: video.poster || null,
      title: next.nom,
      notice: video.status === "coached" ? video.coaching?.notice : null,
      noticeTitle: video.status === "coached" ? video.coaching?.title : null,
      spoken: video.status === "coached" ? video.coaching?.spoken : null,
    };
  }
  return { type: "image", src: next.img, title: next.nom };
}
