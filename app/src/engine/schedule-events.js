import { plannedSessions } from "./plan-memory.js";
import { sourceDay, eventTags, eventCategory } from "./source-schedule.js";
import { today } from "./utils.js";
export { eventTags, eventCategory };
export function eventsForDay(p, date) {
  const planned = plannedSessions(p).filter((s) => s.date === date),
    ids = new Set(planned.map((s) => s.id));
  const strength = p.sessions
    .filter((s) => s.date === date && (!s.planId || !ids.has(s.planId)))
    .map((s) => ({ ...s, actualId: s.id, type: "strength" }));
  const activities = p.activities
    .filter((s) => s.date === date && (!s.planId || !ids.has(s.planId)))
    .map((s) => ({
      ...s,
      actualId: s.id,
      isActivity: true,
      status: "completed",
      estimatedMinutes: Math.round(s.durationSec / 60),
    }));
  return [...planned, ...strength, ...activities].sort((a, b) =>
    (a.time || "18:00").localeCompare(b.time || "18:00"),
  );
}
export function nextTrainingEvent(p, date = today()) {
  return (
    plannedSessions(p).find(
      (s) => s.date >= date && s.status === "planned" && s.type !== "rest",
    ) || null
  );
}
export function modalForEvent(s) {
  return s.actualId
    ? s.isActivity
      ? { type: "log-activity", activityId: s.actualId }
      : { type: "history-session", sessionId: s.actualId }
    : s.type === "strength"
      ? { type: "planned", sessionId: s.id }
      : s.source === "legacy"
        ? { type: "source-extra", event: s }
        : { type: "planned", sessionId: s.id };
}
export function emptyDay(p, date) {
  return sourceDay(p, date);
}
