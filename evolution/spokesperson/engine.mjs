import { reminders, today, validDate, daysBetween } from '../reminders/engine.mjs';
import { playbackSettings, RATES } from '../voice/playback.mjs';
export { RATES };
const object = v => !!v && typeof v === 'object' && !Array.isArray(v);
const shortName = p => String(p?.user?.name || (p?.id === 'emilie' ? 'Émilie' : 'Yanis')).trim().slice(0, 40);
const dateLabel = d => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d + 'T12:00:00'));
export function settings(p) {
  const raw = p?.spokesperson?.settings;
  return { ...playbackSettings(raw), greetingEnabled: raw?.greetingEnabled === true };
}
export function saveSettings(p, form) {
  if (typeof form.greetingEnabled !== 'boolean' || typeof form.silent !== 'boolean' || !RATES.includes(Number(form.rate))) throw new Error('Réglage vocal invalide.');
  const previous = object(p.spokesperson) ? p.spokesperson : {};
  p.spokesperson = { ...previous, version: 1, settings: { ...playbackSettings(form), greetingEnabled: form.greetingEnabled } };
}
function daily(p, day) {
  const value = p?.spokesperson?.daily;
  return object(value) && value.day === day ? value : { day };
}
function updateDaily(p, day, values) {
  p.spokesperson = { ...(object(p.spokesperson) ? p.spokesperson : {}), version: 1, daily: { ...daily(p, day), ...values } };
}
export function markAttempt(p, day) { if (validDate(day)) updateDaily(p, day, { attempted: true }); }
export function markPlayed(p, day) { if (validDate(day)) updateDaily(p, day, { attempted: true, played: true }); }
export function wasPlayed(p, day) { return daily(p, day).played === true; }
export function deferBriefing(p, now = Date.now()) {
  if (!Number.isFinite(now) || now < 0) throw new Error('Date invalide.');
  const previous = object(p.spokesperson) ? p.spokesperson : {};
  p.spokesperson = { ...previous, version: 1, deferred: { from: now, until: now + 3600000 } };
}
export function deferredUntil(p, now = Date.now()) {
  const d = p?.spokesperson?.deferred;
  return object(d) && Number.isFinite(d.from) && d.from <= now && Number.isFinite(d.until) &&
    d.until === d.from + 3600000 && d.until > now ? d.until : null;
}
export function resumeBriefing(p) {
  if (!object(p.spokesperson)) return;
  p.spokesperson = { ...p.spokesperson, deferred: null };
}
export function canGreet(p, { day = today(), now = Date.now(), visible = true, busy = false, modal = false } = {}) {
  return settings(p).greetingEnabled && !settings(p).silent && !!p?.preferences?.voice &&
    !daily(p, day).attempted && !deferredUntil(p, now) && visible && !busy && !modal &&
    !(p?.timer && !p.timer.done && !p.timer.paused);
}

// Explainable priorities only: recorded check-ins and the step 1 deadline engine.
// No programme changes, photo analysis, invented performance trends or consultations.
export function briefing(p, coaches = [], day = today()) {
  if (!p || !validDate(day)) return { items: [], speech: '', name: '' };
  const fallback = { 0: p.id === 'emilie' ? 'Coach principale' : 'Coach principal', 3: 'Préparateur mental', 4: 'Référent santé', 7: 'Analyste de performance' };
  const coach = id => {
    const source = coaches.find(c => c.id === id);
    return { id, name: source?.name || fallback[id], role: source?.role || 'Conseiller virtuel · règles locales', avatar: source?.avatar || null };
  };
  const items = [];
  const recent = Object.entries(p.checkIns || {}).filter(([d, row]) => validDate(d) && d <= day && daysBetween(d, day) <= 3 && object(row)).sort(([a], [b]) => b.localeCompare(a));
  const pain = recent.find(([, row]) => row.painReported === true);
  if (pain) items.push({ key: `pain:${pain[0]}`, coach: coach(4), title: 'Faire le point sur la douleur signalée',
    speech: `${coach(4).name} rappelle de vérifier la douleur signalée avant l’effort.`,
    reason: `Une douleur a été signalée dans le bilan du ${dateLabel(pain[0])}. Priorité de prudence, pas un diagnostic. Évite les mouvements douloureux ; une douleur vive ou persistante justifie un avis professionnel.`,
    action: { page: 'recovery' } });
  const latest = recent[0];
  if (latest && typeof latest[1].fatigue !== 'boolean' && Number(latest[1].fatigue) >= 4 && Number(latest[1].fatigue) <= 5) items.push({
    key: `fatigue:${latest[0]}`, coach: coach(3), title: 'Prendre en compte la fatigue déclarée',
    speech: `${coach(3).name} invite à faire le point sur la fatigue déclarée.`,
    reason: `Fatigue saisie : ${Number(latest[1].fatigue)}/5 le ${dateLabel(latest[0])}. Ce signal invite à vérifier ton ressenti, pas à déduire une baisse de performance ou à changer automatiquement tes séances.`, action: { page: 'recovery' } });
  const tasks = reminders(p, day);
  const due = tasks.filter(t => t.status === 'due').sort((a, b) => Number(!a.due) - Number(!b.due) || String(a.due || '').localeCompare(b.due || '') || a.kind.localeCompare(b.kind));
  const selected = due.length ? due : tasks.filter(t => t.status === 'upcoming').sort((a,b) => a.due.localeCompare(b.due)).slice(0, 1);
  for (const task of selected) {
    const id = ({ force: 0, weekly: 3, measurements: 7, photos: 7 })[task.kind];
    const owner = coach(id), upcoming = task.status === 'upcoming';
    const title = upcoming ? `Prochain point : ${task.title.toLowerCase()}, le ${dateLabel(task.due)}` : `${task.title} : ${task.due ? 'échéance à traiter' : 'premier repère à renseigner'}`;
    const speech = upcoming ? `${owner.name} : prochain point ${task.title.toLowerCase()} le ${dateLabel(task.due)}.` : `${owner.name} : ${task.title.toLowerCase()} à prévoir.`;
    items.push({ key: task.key, coach: owner, title, speech, reason: `${task.due ? `Échéance : ${dateLabel(task.due)}. ` : ''}${task.reason}`,
      action: task.action, due: task.due, rule: task.status });
  }
  const visibleItems = items.slice(0, 3);
  const name = shortName(p);
  const speech = `Bonjour ${name}. Voici le point de ton équipe virtuelle. ${visibleItems.slice(0, 2).map(x => x.speech).join(' ') || 'Aucune priorité à annoncer ; les rappels reportés restent visibles.'} Les détails sont affichés. Ton programme reste inchangé.`;
  return { name, items: visibleItems, additional: Math.max(0, items.length - visibleItems.length), speech };
}
