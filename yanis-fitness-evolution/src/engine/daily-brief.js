import { addDays, today } from "./utils.js";
import { eventsForDay } from "./schedule-events.js";

export const REMINDER_LABELS = {
  checkin: "Bilan de récupération",
  measurement: "Mensurations",
  photo: "Photos de progression",
  review: "Bilan avant éventuelle sèche",
};
const validDate = (d) =>
  typeof d === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(d) &&
  !Number.isNaN(Date.parse(d + "T00:00:00")) &&
  new Date(d + "T00:00:00").getDate() === Number(d.slice(8));
export function defaultReviewDate(p) {
  // 40 weeks after the beginning of the 52-week source programme, roughly 12 weeks before its end.
  if (
    p.id !== "elite" ||
    p.plan?.source !== "legacy" ||
    p.plan?.weeks !== 52 ||
    !validDate(p.user?.startDate)
  )
    return "";
  return addDays(p.user.startDate, 280);
}
export function reminderDate(p, key) {
  const entry = p.preferences?.dailyReminders?.[key];
  if (entry && typeof entry.date === "string")
    return validDate(entry.date) ? entry.date : "";
  return key === "review" ? defaultReviewDate(p) : "";
}
function completed(p, key, due, now, entry) {
  if (key === "review")
    return (
      validDate(entry?.completedOn) &&
      entry.completedOn >= due &&
      entry.completedOn <= now
    );
  if (key === "checkin")
    return Object.keys(p.checkIns || {}).some(
      (d) => validDate(d) && d >= due && d <= now,
    );
  const records = key === "photo" ? p.photos : p.measurements;
  return (records || []).some(
    (r) =>
      !r.needsDate &&
      !r.simulated &&
      validDate(r.date) &&
      r.date >= due &&
      r.date <= now &&
      (key !== "measurement" ||
        Object.values(r.values || {}).some(
          (v) => typeof v === "number" && v > 0,
        )),
  );
}
export function dailyBrief(p, now = today()) {
  const events = eventsForDay(p, now).filter((e) => e.status !== "superseded");
  const statuses = {
    planned: "prévu",
    completed: "réalisé",
    partial: "partiel",
    missed: "non effectué",
  };
  const schedule = events.length
    ? events
        .map(
          (e) =>
            `${e.name || "Activité"} (${statuses[e.status] || "statut à vérifier"})`,
        )
        .join(" ; ")
    : p.plan
      ? "Aucun événement inscrit au calendrier pour aujourd’hui."
      : "Aucun calendrier actif : journée à vérifier.";
  const reminders = Object.keys(REMINDER_LABELS).flatMap((key) => {
    const due = reminderDate(p, key),
      entry = p.preferences?.dailyReminders?.[key] || {};
    if (
      !due ||
      due > now ||
      completed(p, key, due, now, entry) ||
      (entry.snoozeFor === due &&
        validDate(entry.snoozeUntil) &&
        entry.snoozeUntil > now)
    )
      return [];
    return [{ key, due, label: REMINDER_LABELS[key] }];
  });
  const undated =
    (p.measurements || []).some((x) => x.needsDate || !validDate(x.date)) ||
    (p.photos || []).some((x) => x.needsDate || !validDate(x.date)) ||
    (p.teamReviews || []).some((x) => x.needsDate || !validDate(x.date));
  const text = `Aujourd’hui : ${schedule}. ${reminders.length ? "À prévoir : " + reminders.map((r) => r.label).join(", ") + "." : "Aucun rappel arrivé à échéance."}${undated ? " Certaines anciennes données sans date fiable sont à vérifier." : ""}`;
  return { schedule, reminders, undated, text };
}
