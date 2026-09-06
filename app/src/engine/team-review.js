import { actualDate, numeric } from "./validation.js";
import { sourcePosition } from "./source-schedule.js";
import { teamAdvice } from "./team.js";
import { today, uid } from "./utils.js";
import { dataFingerprint } from "./content-fingerprint.js";
export function makeTeamReview(p, input) {
  actualDate(input.date);
  const position = sourcePosition(p, input.date);
  if (position.beforeStart || position.afterEnd)
    throw new Error(
      "Choisissez une date comprise dans les 52 semaines de votre programme.",
    );
  const fields = {
    date: input.date,
    week: position.weekGlobal,
    cycleStart: p.user.startDate || today(),
    source: "jarvis",
    importedVerbatim: false,
  };
  for (const k of ["energy", "fatigue", "pain", "motivation"])
    fields[k] = numeric(input[k], 1, 5, k, { integer: true });
  for (const k of ["feelings", "difficulties", "questions"]) {
    fields[k] = String(input[k] || "").trim();
    if (fields[k].length > 5000)
      throw new Error("Le texte du bilan dépasse 5 000 caractères.");
  }
  if (
    ![
      "energy",
      "fatigue",
      "pain",
      "motivation",
      "feelings",
      "difficulties",
      "questions",
    ].some((k) => fields[k] !== "" && fields[k] != null)
  )
    throw new Error("Renseignez au moins un ressenti ou une question.");
  const existing = (p.teamReviews || []).find(
    (r) =>
      r.source === "jarvis" &&
      r.week === fields.week &&
      (!r.cycleStart || r.cycleStart === fields.cycleStart),
  );
  if (existing) {
    const same = Object.keys(fields).every(
      (k) =>
        (k === "cycleStart" && !existing.cycleStart) ||
        existing[k] === fields[k],
    );
    if (same) return { ...existing };
  }
  const review = {
    ...fields,
    id: existing?.id || uid(),
    updatedAt: Date.now(),
    advice: teamAdvice(p, fields),
  };
  if (existing) {
    const previous = { ...existing };
    delete previous.previousVersions;
    review.previousVersions = [...(existing.previousVersions || []), previous];
  }
  return review;
}
