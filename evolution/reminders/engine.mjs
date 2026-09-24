// Stage 1: deterministic, offline follow-up reminders. No programme mutation.
const DAY = 86400000;
const OWN = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
const obj = v => !!v && typeof v === 'object' && !Array.isArray(v);
const rows = v => Array.isArray(v) ? v.filter(obj) : [];
const CM = new Set(['cou', 'epaules', 'poitrine', 'brasD', 'brasG', 'avBrasD', 'avBrasG', 'taille', 'ventre', 'hanches', 'cuisseD', 'cuisseG', 'molletD', 'molletG', 'fessiers']);
const finite = (v, min, max) => v !== '' && v != null && typeof v !== 'boolean' && Number.isFinite(Number(v)) && Number(v) >= min && Number(v) <= max;

export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T12:00:00Z');
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
export function today(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export function addDays(date, days) {
  if (!validDate(date) || !Number.isInteger(days)) throw new Error('Date ou délai invalide.');
  return new Date(Date.parse(date + 'T12:00:00Z') + days * DAY).toISOString().slice(0, 10);
}
export function daysBetween(a, b) {
  return Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / DAY);
}
export function addMonth(date) {
  if (!validDate(date)) throw new Error('Date invalide.');
  const [y, m, d] = date.split('-').map(Number);
  const year = m === 12 ? y + 1 : y, month = m === 12 ? 1 : m + 1;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}
export function settings(p) {
  const raw = obj(p?.followUp?.settings) ? p.followUp.settings : {};
  return {
    measurementCadence: raw.measurementCadence === 'four-weeks' ? 'four-weeks' : 'month',
    photosEnabled: typeof raw.photosEnabled === 'boolean' ? raw.photosEnabled : false,
    photoCadence: raw.photoCadence === 'four-weeks' ? 'four-weeks' : 'month',
    weeklyEnabled: typeof raw.weeklyEnabled === 'boolean' ? raw.weeklyEnabled : true,
    forceWeeks: [4, 6, 8, 10, 12].includes(Number(p?.preferences?.forceRevalWeeks)) ? Number(p.preferences.forceRevalWeeks) : 8,
  };
}
export function hasCircumferences(m) {
  return obj(m?.values) && Object.entries(m.values).some(([key, value]) => CM.has(key) && finite(value, 1, 300));
}
const known = (r, date) => validDate(r.date) && r.date <= date && !r.needsDate;
function latest(data, date, predicate = () => true) {
  return rows(data).filter(r => known(r, date) && predicate(r)).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
}
function nextDate(last, cadence) { return cadence === 'month' ? addMonth(last) : addDays(last, 28); }
function snoozes(p) { return obj(p?.followUp?.snoozes) ? p.followUp.snoozes : {}; }
function decorate(p, task, date) {
  const key = `${p.id}:${task.kind}:${task.last || 'initial'}:${task.due || 'initial'}`;
  const record = OWN(snoozes(p), key) && snoozes(p)[key];
  // Invalid/legacy imports cannot suppress reminders indefinitely.
  const until = obj(record) && validDate(record.until) && validDate(record.createdOn) &&
    record.until > record.createdOn && record.until <= addDays(record.createdOn, 90) &&
    record.createdOn <= date && record.until > date && record.until > (task.due || date) ? record.until : null;
  const days = task.due ? daysBetween(date, task.due) : 0;
  return { ...task, key, days, postponedUntil: until, status: until ? 'postponed' : (!task.due || days <= 0) ? 'due' : 'upcoming' };
}

export function reminders(p, date = today()) {
  if (!p || !validDate(date)) return [];
  const prefs = settings(p), result = [];
  const cm = latest(p.measurements, date, hasCircumferences);
  const undatedCM = rows(p.measurements).find(r => hasCircumferences(r) && !known(r, date));
  result.push({
    kind: 'measurements', title: 'Mensurations', last: cm?.date || null,
    due: cm ? nextDate(cm.date, prefs.measurementCadence) : null,
    reason: cm
      ? `Dernier relevé de tours corporels : ${cm.date}. Rythme : ${prefs.measurementCadence === 'month' ? 'un mois calendaire' : '28 jours'}. Une pesée seule ne décale jamais ce bilan.`
      : undatedCM ? 'Un relevé de mensurations existe, mais sa date est manquante, incertaine ou future. Confirmez la date réelle ; elle n’a pas été inventée.' : 'Aucun relevé daté de tours corporels. Une pesée ou un taux de masse grasse ne remplace pas les mensurations.',
    action: { modal: 'measurement', ...(cm || !undatedCM ? {} : { measurementId: undatedCM.id }) },
    actionLabel: !cm && undatedCM ? 'Vérifier la date' : 'Faire maintenant',
  });
  const force = latest(p.forceTests, date, r => finite(r.estimate, 0.1, 2000) && !!(r.baseKey || r.exerciseId || r.originalLabel));
  const undatedForce = rows(p.forceTests).some(r => finite(r.estimate, 0.1, 2000) && !known(r, date));
  result.push({
    kind: 'force', title: 'Bilan de force', last: force?.date || null,
    due: force ? addDays(force.date, prefs.forceWeeks * 7) : null,
    reason: `${force ? `Dernier bilan daté : ${force.date}. Réévaluation toutes les ${prefs.forceWeeks} semaines.` : undatedForce ? 'Des références existent sans date fiable : vérifiez-les dans votre historique avant de planifier la réévaluation.' : 'Aucun bilan de force daté enregistré.'} Un rappel de bilan n’impose pas un test maximal. Ne testez pas en cas de douleur ou de fatigue inhabituelle.`,
    action: { page: 'force' }, actionLabel: 'Voir mon bilan',
  });
  if (prefs.weeklyEnabled) {
    const review = latest(p.teamReviews, date);
    result.push({ kind: 'weekly', title: 'Bilan avec l’équipe', last: review?.date || null,
      due: review ? addDays(review.date, 7) : null,
      reason: review ? `Dernier échange enregistré : ${review.date}. Un bilan tous les 7 jours ; lire un conseil ne valide pas un bilan.` : 'Votre premier bilan permet de noter vos ressentis, difficultés et questions. Les anciennes données restent conservées.',
      action: { page: 'team', tab: 'review' }, actionLabel: 'Faire maintenant' });
  }
  if (prefs.photosEnabled) {
    const realPhoto = r => !r.simulated && r.source !== 'legacy-simulation' && typeof r.data === 'string' && !!r.data;
    const photo = latest(p.photos, date, realPhoto);
    result.push({ kind: 'photos', title: 'Photos de suivi', last: photo?.date || null,
      due: photo ? nextDate(photo.date, prefs.photoCadence) : null,
      reason: photo ? `Dernière photo réelle datée : ${photo.date}. Comparez dans des conditions similaires. Les simulations ne valident pas ce suivi.` : 'Suivi facultatif activé. Ajoutez ou datez une photo réelle ; une simulation n’est pas une photo de résultat.',
      action: { page: 'progress', tab: 'photos' }, actionLabel: 'Voir mes photos' });
  }
  return result.map(r => decorate(p, r, date)).sort((a, b) => {
    const rank = { due: 0, postponed: 1, upcoming: 2 };
    return rank[a.status] - rank[b.status] || String(a.due || '').localeCompare(b.due || '') || a.kind.localeCompare(b.kind);
  });
}

export function lastWeighIn(p, date = today()) {
  return latest(p?.measurements, date, r => finite(r.weight, 25, 350));
}
export function setSettings(p, values) {
  const current = settings(p);
  const next = { ...current, ...values };
  if (!['month', 'four-weeks'].includes(next.measurementCadence) || !['month', 'four-weeks'].includes(next.photoCadence) ||
    typeof next.photosEnabled !== 'boolean' || typeof next.weeklyEnabled !== 'boolean' || ![4, 6, 8, 10, 12].includes(Number(next.forceWeeks)))
    throw new Error('Réglage de suivi invalide.');
  const followUp = obj(p.followUp) ? p.followUp : {};
  const { forceWeeks, ...saved } = next;
  p.followUp = { ...followUp, version: 1, settings: saved };
  p.preferences = { ...(p.preferences || {}), forceRevalWeeks: Number(forceWeeks) };
}
export function postpone(p, key, until, date = today()) {
  const task = reminders(p, date).find(t => t.key === key);
  if (!task) throw new Error('Ce rappel a changé. Actualisez le suivi.');
  const min = task.due && task.due > date ? task.due : date;
  if (!validDate(until) || until <= min || until > addDays(date, 90))
    throw new Error('Choisissez une date après l’échéance et aujourd’hui, dans les 90 prochains jours.');
  p.followUp = { ...(obj(p.followUp) ? p.followUp : {}), version: 1,
    snoozes: { ...snoozes(p), [key]: { until, createdOn: date } } };
  // Keep only current cycle keys; expired historical postponements cannot grow forever.
  const active = new Set(reminders(p, date).map(t => t.key));
  p.followUp.snoozes = Object.fromEntries(Object.entries(p.followUp.snoozes).filter(([k]) => active.has(k)));
}
export function cancelPostponement(p, key) {
  if (!OWN(snoozes(p), key)) return;
  const next = { ...snoozes(p) };
  delete next[key];
  p.followUp = { ...p.followUp, snoozes: next };
}

// Notifications are a history; the board remains the source of truth even after "read all".
export function reconcileNotifications(p, date = today()) {
  const tasks = reminders(p, date), byKey = new Map(tasks.map(t => [`follow-up:${t.key}`, t]));
  let changed = false;
  const current = rows(p.notifications), seen = new Set();
  const next = current.map(n => {
    if (typeof n.key === 'string' && n.key.startsWith('force-reval-') && !n.read) {
      changed = true; return { ...n, read: true }; // replaced by the unified, reportable force reminder
    }
    if (!n.followUpReminder) return n;
    const task = byKey.get(n.key);
    seen.add(n.key);
    const status = task?.status || 'resolved';
    const title = task?.title || n.followUpTitle || 'Suivi';
    const text = status === 'resolved' ? `${title} : ancienne échéance clôturée (nouvelle saisie ou réglage modifié).`
      : status === 'postponed' ? `${title} : rappel reporté au ${task.postponedUntil}. Échéance initiale : ${task.due || 'premier bilan'}.`
      : status === 'upcoming' ? `${title} : prochaine échéance le ${task.due}.`
      : `${title} à faire${task.due ? ` · échéance ${task.due}` : ' · premier bilan ou date à vérifier'}. Consultez « Ton suivi avec l’équipe ».`;
    const read = status !== 'due' ? true : n.followUpStatus !== 'due' ? false : !!n.read;
    if (status === n.followUpStatus && text === n.text && read === n.read) return n;
    changed = true; return { ...n, text, read, followUpStatus: status };
  });
  for (const [key, task] of byKey) {
    if (task.status !== 'due' || seen.has(key)) continue;
    changed = true;
    next.unshift({ id: key, key, date, type: 'reminder', read: false, followUpReminder: true,
      followUpTitle: task.title, followUpStatus: 'due',
      text: `${task.title} à faire${task.due ? ` · échéance ${task.due}` : ' · premier bilan ou date à vérifier'}. Consultez « Ton suivi avec l’équipe ».` });
  }
  return changed ? next : p.notifications;
}
