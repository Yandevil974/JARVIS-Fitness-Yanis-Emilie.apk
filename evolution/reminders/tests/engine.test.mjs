import test from 'node:test';
import assert from 'node:assert/strict';
import { today as localDate, validDate, addDays, addMonth, daysBetween, settings, hasCircumferences,
  lastWeighIn, reminders, postpone, cancelPostponement, setSettings, reconcileNotifications } from '../engine.mjs';
import { validateState, initialState } from '../../../JARVIS-Fitness-Source/src/store/model.js';

const today = '2026-09-20';
const profile = () => ({ id: 'elite', preferences: { forceRevalWeeks: 8 }, notifications: [],
  measurements: [{ id: 'circ', date: '2026-08-10', needsDate: false, values: { taille: 80, brasD: 32 } },
    { id: 'weight', date: '2026-09-04', weight: 81.2, values: {} },
    { id: 'undated', date: '', needsDate: true, values: { cou: 39 } }],
  forceTests: [{ id: 'force', date: '2026-08-10', needsDate: false, estimate: 50, baseKey: 'squat' }],
  teamReviews: [{ id: 'review', date: '2026-09-13' }], photos: [] });
const get = (p, kind, date = today) => reminders(p, date).find(x => x.kind === kind);
const reconcile = (p, date = today) => { const next = reconcileNotifications(p, date), changed = next !== p.notifications; p.notifications = next; return changed; };
const note = (p, task) => p.notifications.find(n => n.key === `follow-up:${task.key}`);

test('calendar months clamp month ends and leap years; date arithmetic is DST-safe', () => {
  assert.equal(addMonth('2026-01-31'), '2026-02-28');
  assert.equal(addMonth('2028-01-31'), '2028-02-29');
  assert.equal(addMonth('2028-02-29'), '2028-03-29');
  assert.equal(addMonth('2026-12-31'), '2027-01-31');
  assert.equal(addDays('2026-03-28', 2), '2026-03-30');
  assert.equal(daysBetween('2026-03-28', '2026-03-30'), 2);
  assert.equal(localDate(new Date(2026, 8, 20, 0, 0, 1)), today);
});
test('invalid or impossible dates cannot create deadlines', () => {
  for (const invalid of ['2026-02-30', '2026-09-31', '', null, '2026-2-02', 10, '2026-09-20T12:00:00Z']) {
    assert.equal(validDate(invalid), false);
    assert.throws(() => addMonth(invalid)); assert.throws(() => addDays(invalid, 1));
  }
  assert.deepEqual(reminders(profile(), 'invalid'), []);
});
test('circumferences are separate from weight, bodyfat and unknown fields', () => {
  assert.equal(hasCircumferences({ values: { taille: 90 } }), true);
  assert.equal(hasCircumferences({ values: { fessiers: 100 } }), true);
  assert.equal(hasCircumferences({ weight: 80, bodyFat: 17, values: { cou: '', taille: 0, unknown: 30 } }), false);
  assert.equal(hasCircumferences({ values: { cou: -2, brasD: Infinity, cuisseD: NaN } }), false);
  assert.equal(hasCircumferences({ values: { cou: '39' } }), true);
  assert.equal(hasCircumferences({ values: { cou: true } }), false);
});
test('Sep 4 weighing does not replace Aug 10 circumferences; Sep 10 stays overdue after rollover', () => {
  const p = profile();
  assert.equal(get(p, 'measurements').last, '2026-08-10');
  assert.equal(lastWeighIn(p, today).date, '2026-09-04');
  assert.equal(get(p, 'measurements').due, '2026-09-10');
  assert.equal(get(p, 'measurements').days, -10);
  for (const date of ['2026-09-30', '2026-10-01', '2027-01-01']) {
    assert.equal(get(p, 'measurements', date).due, '2026-09-10');
    assert.equal(get(p, 'measurements', date).status, 'due');
  }
});
test('weighing, undated, invalid or future measurements cannot complete circumferences', () => {
  const p = profile(), key = get(p, 'measurements').key;
  p.measurements.push({ date: today, weight: 78, values: {} }, { date: today, needsDate: true, values: { taille: 79 } },
    { date: '2026-10-01', values: { taille: 79 } }, { date: '2026-02-30', values: { taille: 79 } });
  assert.equal(get(p, 'measurements').key, key);
  p.measurements.push({ date: today, values: { taille: 79 } });
  assert.equal(get(p, 'measurements').status, 'upcoming');
  assert.equal(get(p, 'measurements').due, '2026-10-20');
  assert.notEqual(get(p, 'measurements').key, key);
});
test('all enabled tasks are returned including distant next dates; default photos are optional', () => {
  const p = profile(), tasks = reminders(p, today);
  assert.deepEqual(tasks.map(x => x.kind).sort(), ['force', 'measurements', 'weekly']);
  assert.equal(get(p, 'measurements').status, 'due');
  assert.equal(get(p, 'force').status, 'upcoming');
  assert.equal(get(p, 'force').due, '2026-10-05');
  assert.equal(get(p, 'weekly').status, 'due');
  assert.equal(get(p, 'weekly').due, today);
});
test('missing baseline is a stable initial task; undated circumference can be corrected', () => {
  const p = { id: 'emilie', measurements: [{ id: 'date-me', date: '', needsDate: true, values: { cou: 33 } }] };
  const task = get(p, 'measurements');
  assert.equal(task.last, null); assert.equal(task.due, null);
  assert.equal(task.action.measurementId, 'date-me');
  assert.equal(task.status, 'due');
  assert.equal(get(p, 'measurements', '2026-10-20').key, task.key);
});
test('force baseline requires positive identified estimate and a confirmed usable date', () => {
  const p = profile();
  p.forceTests.push({ date: today, estimate: 0, baseKey: 'squat' }, { date: today, needsDate: true, estimate: 80, baseKey: 'squat' },
    { date: '2026-10-01', estimate: 100, baseKey: 'squat' }, { date: today, estimate: 100 });
  assert.equal(get(p, 'force').last, '2026-08-10');
  p.forceTests.push({ date: today, estimate: 80, baseKey: 'squat' });
  assert.equal(get(p, 'force').due, '2026-11-15');
});
test('only genuine dated photos reset the opt-in photo reminder', () => {
  const p = profile(); setSettings(p, { photosEnabled: true });
  p.photos = [{ date: today, data: 'example', simulated: true }, { date: today, data: 'example', source: 'legacy-simulation' },
    { date: today, data: '', simulated: false }, { date: '2026-08-15', data: 'real', simulated: false }];
  assert.equal(get(p, 'photos').last, '2026-08-15');
  assert.equal(get(p, 'photos').due, '2026-09-15');
  p.photos.push({ date: today, data: 'new' });
  assert.equal(get(p, 'photos').due, '2026-10-20');
});
test('a weekly report, not reading notifications, advances the weekly date', () => {
  const p = profile(); reconcile(p);
  p.notifications.forEach(n => { n.read = true; }); reconcile(p);
  assert.equal(get(p, 'weekly').status, 'due');
  p.teamReviews.push({ date: today });
  assert.equal(get(p, 'weekly').due, '2026-09-27');
});
test('snoozing keeps original deadline visible, expires on chosen day and is cancellable', () => {
  const p = profile(), task = get(p, 'measurements');
  postpone(p, task.key, '2026-09-25', today);
  assert.equal(get(p, 'measurements').due, '2026-09-10');
  assert.equal(get(p, 'measurements').status, 'postponed');
  assert.equal(get(p, 'measurements', '2026-09-24').status, 'postponed');
  assert.equal(get(p, 'measurements', '2026-09-25').status, 'due');
  cancelPostponement(p, task.key);
  assert.equal(get(p, 'measurements').postponedUntil, null);
});
test('postponement rejects past, original date, invalid dates, >90 days and another profile', () => {
  const p = profile(), task = get(p, 'force');
  for (const date of ['2026-09-19', today, '2026-10-05', '2026-02-30', '2026-12-20']) {
    assert.throws(() => postpone(p, task.key, date, today), date);
  }
  assert.throws(() => postpone(p, 'emilie:force:initial:initial', '2026-10-10', today));
  assert.equal(p.followUp, undefined);
});
test('stale actions cannot postpone a task completed by a newer record', () => {
  const p = profile(), old = get(p, 'measurements');
  p.measurements.push({ date: today, values: { taille: 78 } });
  assert.throws(() => postpone(p, old.key, '2026-09-26', today));
});
test('new valid records close the old cycle and do not inherit postponement', () => {
  const p = profile(), old = get(p, 'measurements');
  postpone(p, old.key, '2026-09-28', today);
  p.measurements.push({ date: today, values: { taille: 79 } });
  const next = get(p, 'measurements');
  assert.notEqual(next.key, old.key);
  assert.equal(next.postponedUntil, null); assert.equal(next.status, 'upcoming');
});
test('settings share existing force cadence and reject invalid values without editing programs', () => {
  const p = profile(); p.plan = { day: ['squat'] }; const saved = JSON.stringify(p.plan);
  setSettings(p, { measurementCadence: 'four-weeks', forceWeeks: 6, weeklyEnabled: false, photosEnabled: true });
  assert.equal(get(p, 'measurements').due, '2026-09-07');
  assert.equal(get(p, 'force').due, '2026-09-21');
  assert.equal(get(p, 'weekly'), undefined);
  assert.equal(p.preferences.forceRevalWeeks, 6);
  assert.equal(JSON.stringify(p.plan), saved);
  assert.throws(() => setSettings(p, { forceWeeks: -1 }));
  assert.throws(() => setSettings(p, { measurementCadence: 'nonsense' }));
  assert.throws(() => setSettings(p, { weeklyEnabled: 0 }));
  assert.equal(settings(p).forceWeeks, 6);
});
test('profiles have independent cadences, dates, reports and notifications', () => {
  const first = profile(), second = structuredClone(first); second.id = 'emilie';
  const originalSecond = JSON.stringify(second);
  setSettings(first, { forceWeeks: 4, photosEnabled: true });
  postpone(first, get(first, 'measurements').key, '2026-09-28', today); reconcile(first);
  assert.equal(JSON.stringify(second), originalSecond);
  assert.equal(get(second, 'measurements').status, 'due');
  assert.notEqual(get(first, 'measurements').key, get(second, 'measurements').key);
});
test('notification reconciliation is idempotent and does not revive read alerts', () => {
  const p = profile(); p.notifications.push({ id: 'session', type: 'reminder', key: 'session-1', read: false, text: 'Séance' });
  assert.equal(reconcile(p), true); assert.equal(p.notifications.length, 3);
  const saved = JSON.stringify(p.notifications);
  assert.equal(reconcile(p), false); assert.equal(JSON.stringify(p.notifications), saved);
  p.notifications.forEach(n => { n.read = true; });
  assert.equal(reconcile(p), false); assert.equal(get(p, 'measurements').status, 'due');
});
test('postponing silences only its alert; expiry reactivates that alert exactly once', () => {
  const p = profile(); reconcile(p); const task = get(p, 'measurements');
  postpone(p, task.key, '2026-09-25', today);
  assert.equal(reconcile(p), true);
  assert.equal(note(p, task).read, true); assert.equal(note(p, task).followUpStatus, 'postponed');
  assert.equal(reconcile(p, '2026-09-24'), false);
  assert.equal(reconcile(p, '2026-09-25'), true);
  assert.equal(note(p, task).read, false); assert.equal(note(p, task).followUpStatus, 'due');
  note(p, task).read = true;
  assert.equal(reconcile(p, '2026-09-25'), false); assert.equal(note(p, task).read, true);
  assert.equal(p.notifications.filter(n => n.key === `follow-up:${task.key}`).length, 1);
});
test('completed and disabled reminders close stale alerts; unrelated alerts are preserved', () => {
  const p = profile(); p.notifications = [{ key: 'force-reval-initial', read: false }, { key: 'daily', read: false }];
  reconcile(p); const task = get(p, 'measurements');
  p.measurements.push({ date: today, values: { taille: 80 } }); setSettings(p, { weeklyEnabled: false }); reconcile(p);
  assert.equal(note(p, task).followUpStatus, 'resolved'); assert.equal(note(p, task).read, true);
  assert.equal(p.notifications.find(n => n.key === 'force-reval-initial').read, true);
  assert.equal(p.notifications.find(n => n.key === 'daily').read, false);
});
test('render calculations and notification reconciliation do not mutate inputs', () => {
  const p = profile(), before = JSON.stringify(p);
  reminders(p, today); settings(p); lastWeighIn(p, today); reconcileNotifications(p, today);
  assert.equal(JSON.stringify(p), before);
});
test('JSON backup validation preserves settings, postponements and notification history', () => {
  const state = initialState(), p = state.profiles.elite;
  setSettings(p, { forceWeeks: 6, photosEnabled: true });
  postpone(p, get(p, 'measurements').key, '2026-09-25', today); reconcile(p);
  const restored = validateState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored.profiles.elite.followUp, p.followUp);
  assert.deepEqual(restored.profiles.elite.notifications, p.notifications);
  assert.equal(restored.profiles.elite.preferences.forceRevalWeeks, 6);
  assert.equal(get(restored.profiles.elite, 'measurements').status, 'postponed');
});

test('malformed imported reports and settings cannot suppress an overdue task indefinitely', () => {
  const p = profile(), task = get(p, 'measurements');
  for (const record of [null, '2028-01-01', { until: '2028-01-01', createdOn: today },
    { until: '2026-09-25', createdOn: 'wrong' }, { until: '2026-09-25', createdOn: '2026-09-24' }]) {
    p.followUp = { settings: { measurementCadence: 'bad', photosEnabled: 'false' }, snoozes: { [task.key]: record } };
    assert.equal(get(p, 'measurements').status, 'due');
    assert.equal(get(p, 'photos'), undefined);
  }
});
