/* Récap sportif LECTURE SEULE envoyé à la plate-forme ARENA//X pour qu'elle
   puisse donner des conseils adaptés. Jamais de droit d'écriture : le local
   reste le seul moteur qui modifie les données (sessions, plan, mémoire). */
import { nextSession } from "./planner.js";
import { dateLabel } from "./utils.js";
import { exerciseById } from "../data/library.js";

function exerciseName(e) {
  if (!e) return null;
  if (typeof e === "string") return e;
  if (e.name) return e.name;
  const lib = e.id ? exerciseById(e.id) : null;
  return lib?.name || null;
}

export function arenaSportContext(p) {
  if (!p) return null;
  const parts = [];
  const next = nextSession(p);
  if (next) {
    const names = (next.exercises || [])
      .map(exerciseName)
      .filter(Boolean)
      .slice(0, 4);
    const focus = (next.focus || []).filter(Boolean).slice(0, 3).join(", ");
    let line = "Prochaine séance : " + dateLabel(next.date);
    if (focus) line += ", " + focus;
    if (names.length)
      line += " (" + names.join(", ") + (names.length < (next.exercises || []).length ? "…" : "") + ")";
    parts.push(line);
  }
  if (p.plan && Array.isArray(p.plan.sessions) && p.plan.sessions.length) {
    const done = p.plan.sessions.filter(
      (s) => s.status === "completed" || s.status === "partial",
    ).length;
    parts.push(
      "Programme « " +
        (p.plan.name || "JARVIS") +
        " » : " +
        (p.plan.frequency || "?") +
        " séances/semaine sur " +
        (p.plan.weeks || "?") +
        " semaines, " +
        done +
        "/" +
        p.plan.sessions.length +
        " déjà faites",
    );
  }
  const last = [...(p.sessions || [])]
    .filter((s) => s && s.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  if (last) {
    parts.push(
      "Dernière séance : " +
        dateLabel(last.date) +
        (last.status === "completed" ? ", terminée" : ", partielle"),
    );
  }
  if (!parts.length) return null;
  return (
    "Contexte sportif de l'utilisateur (LECTURE SEULE — tu ne modifies rien, " +
    "l'application écrit seule les données ; tu t'en inspires pour tes conseils) : " +
    parts.join(" · ")
  );
}
