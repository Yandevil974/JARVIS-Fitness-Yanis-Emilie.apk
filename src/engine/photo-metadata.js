import { actualDate } from "./validation.js";
export function photoMetadata(photo, values) {
  const date = String(values.date || "");
  if (date) actualDate(date);
  if (!["face", "profil", "dos", "compl"].includes(values.view))
    throw new Error("Choisissez une vue valide.");
  const label = String(values.label || "").trim(),
    note = String(values.note || "").trim();
  if (label.length > 80 || note.length > 1000)
    throw new Error("Le titre ou la note est trop long.");
  const knownSimulation =
    photo.source === "legacy-simulation" ||
    (!!photo.sourceReference && !!photo.simulated);
  return {
    date,
    needsDate: !date,
    view: values.view,
    label,
    note,
    simulated: knownSimulation || !!values.simulated,
    metadataEditedAt: Date.now(),
  };
}
