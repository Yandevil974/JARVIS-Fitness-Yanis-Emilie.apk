import test from 'node:test';
import assert from 'node:assert/strict';
import { briefing, settings, saveSettings, canGreet, markAttempt, markPlayed, wasPlayed, deferBriefing, deferredUntil, resumeBriefing } from '../engine.mjs';
import { initialState, validateState } from '../../../JARVIS-Fitness-Source/src/store/model.js';
import { postpone, reminders } from '../../reminders/engine.mjs';
const day = '2026-09-20', now = new Date(day + 'T08:00:00+04:00').getTime();
const p = () => ({ id: 'elite', user: { name: 'Yanis' }, preferences: { voice: true },
  measurements: [{ date: '2026-08-10', values: { taille: 90 } }, { date: '2026-09-04', weight: 80 }],
  forceTests: [{ date: '2026-08-10', estimate: 80, baseKey: 'squat' }], teamReviews: [{ date: '2026-09-13' }], checkIns: {} });
const active = profile => saveSettings(profile, { ...settings(profile), greetingEnabled: true });

test('greeting defaults off and imported non-boolean flags cannot opt in', () => {
  const profile=p(); assert.equal(settings(profile).greetingEnabled,false);
  profile.spokesperson={settings:{greetingEnabled:'true',silent:'true',rate:999,voiceIds:{browser:{id:'bad'}}}};
  assert.deepEqual(settings(profile),{greetingEnabled:false,silent:false,rate:0.98,voiceIds:{browser:'',android:''}});
});
test('briefing uses actual circumference deadline and attributes each task to its coach', () => {
  const result=briefing(p(),[{id:7,name:'Analyste de performance',role:'Données'}],day);
  assert.equal(result.items[0].due,'2026-09-10'); assert.equal(result.items[0].coach.name,'Analyste de performance');
  assert.equal(result.items[1].coach.id,3); assert.match(result.speech,/Bonjour Yanis/); assert.match(result.speech,/équipe virtuelle/);
  assert.ok(result.speech.length<550); assert.match(result.items[0].reason,/pesée seule/);
});
test('recent recorded pain is first; no medical diagnosis or programme adaptation is generated', () => {
  const profile=p();profile.checkIns[day]={painReported:true,fatigue:4};const before=JSON.stringify(profile);
  const result=briefing(profile,[],day);
  assert.equal(result.items[0].coach.id,4);assert.match(result.items[0].reason,/pas un diagnostic/);
  assert.equal(result.items[1].coach.id,3);assert.equal(result.items[2].due,'2026-09-10');assert.ok(result.additional>0);
  assert.equal(JSON.stringify(profile),before);
});
test('future, invalid and stale check-ins cannot invent current health priorities', () => {
  const profile=p();for(const date of ['2026-09-21','2026-09-01','invalid'])profile.checkIns[date]={painReported:true,fatigue:5};
  assert.ok(briefing(profile,[],day).items.every(x=>!x.key.startsWith('pain:')&&!x.key.startsWith('fatigue:')));
});
test('only the latest recent fatigue rating is used; false/zero values are not fatigue', () => {
  const profile=p();profile.checkIns['2026-09-19']={fatigue:5};profile.checkIns[day]={fatigue:false};
  assert.ok(!briefing(profile,[],day).items.some(x=>x.key.startsWith('fatigue:')));
});
test('reported follow-ups are omitted from spoken priorities but remain in the reminder engine', () => {
  const profile=p(), task=reminders(profile,day).find(t=>t.kind==='measurements');
  postpone(profile,task.key,'2026-09-25',day);
  assert.ok(!briefing(profile,[],day).items.some(x=>x.key===task.key));assert.equal(reminders(profile,day).find(t=>t.key===task.key).status,'postponed');
});
test('when no task is due, the next known date is described as upcoming, not a missed task', () => {
  const profile=p();profile.measurements=[{date:day,values:{taille:90}}];profile.teamReviews=[{date:day}];
  const result=briefing(profile,[],day);assert.equal(result.items.length,1);assert.equal(result.items[0].rule,'upcoming');
  assert.match(result.items[0].title,/27 septembre/);assert.match(result.speech,/prochain point/);
});
test('all postponed tasks give an honest empty briefing without marking anything complete', () => {
  const profile=p();for(const task of reminders(profile,day))postpone(profile,task.key,'2026-10-10',day);
  const result=briefing(profile,[],day);assert.equal(result.items.length,0);assert.match(result.speech,/rappels reportés restent visibles/);
});
test('greeting requires opt-in, global voice, foreground, no modal, no busy audio, no active timer', () => {
  const profile=p();assert.equal(canGreet(profile,{day,now}),false);active(profile);assert.equal(canGreet(profile,{day,now}),true);
  for(const values of [{visible:false},{busy:true},{modal:true}])assert.equal(canGreet(profile,{day,now,...values}),false);
  profile.preferences.voice=false;assert.equal(canGreet(profile,{day,now}),false);profile.preferences.voice=true;
  profile.timer={paused:false,done:false};assert.equal(canGreet(profile,{day,now}),false);
  profile.timer.paused=true;assert.equal(canGreet(profile,{day,now}),true);
  saveSettings(profile,{...settings(profile),silent:true});assert.equal(canGreet(profile,{day,now}),false);
});
test('one automatic attempt per profile/day survives reload even if audio fails', () => {
  const profile=p();active(profile);markAttempt(profile,day);
  assert.equal(canGreet(JSON.parse(JSON.stringify(profile)),{day,now}),false);assert.equal(wasPlayed(profile,day),false);
  assert.equal(canGreet(profile,{day:'2026-09-21',now:now+86400000}),true);
  markPlayed(profile,day);assert.equal(wasPlayed(profile,day),true);assert.equal(wasPlayed(profile,'2026-09-21'),false);
});
test('Plus tard pauses only the briefing for one hour and survives reload', () => {
  const profile=p();active(profile);const history=JSON.stringify({measurements:profile.measurements,followUp:profile.followUp});
  deferBriefing(profile,now);assert.equal(deferredUntil(profile,now),now+3600000);assert.equal(canGreet(profile,{day,now}),false);
  const loaded=JSON.parse(JSON.stringify(profile));assert.equal(deferredUntil(loaded,now+3599000),now+3600000);
  assert.equal(deferredUntil(loaded,now+3600000),null);assert.equal(canGreet(loaded,{day,now:now+3600000}),true);
  assert.equal(JSON.stringify({measurements:profile.measurements,followUp:profile.followUp}),history);
  resumeBriefing(profile);assert.equal(deferredUntil(profile,now),null);
});
test('malformed deferred imports cannot silence the briefing indefinitely', () => {
  const profile=p();active(profile);
  for(const deferred of [{from:now,until:now+86400000},{from:now+1,until:now+3600001},{from:'bad',until:now+3600000}]) {
    profile.spokesperson.deferred=deferred;assert.equal(deferredUntil(profile,now),null);
  }
});
test('voice rate and IDs remain independent between profiles and between platforms', () => {
  const first=p(),second=p();second.id='emilie';second.user.name='Émilie';
  saveSettings(first,{...settings(first),rate:1.2,greetingEnabled:true,voiceIds:{browser:'fr-browser',android:'fr-android'}});
  markPlayed(first,day);deferBriefing(first,now);
  assert.equal(settings(second).rate,0.98);assert.equal(wasPlayed(second,day),false);assert.equal(deferredUntil(second,now),null);
  assert.equal(settings(first).voiceIds.android,'fr-android');assert.equal(settings(first).voiceIds.browser,'fr-browser');
  assert.match(briefing(second,[],day).speech,/Bonjour Émilie/);
});
test('invalid form values fail before changing the profile', () => {
  const profile=p(),before=JSON.stringify(profile);assert.throws(()=>saveSettings(profile,{...settings(profile),rate:10}));
  assert.throws(()=>saveSettings(profile,{...settings(profile),greetingEnabled:'true'}));assert.equal(JSON.stringify(profile),before);
});
test('JSON backup validation preserves settings/daily state with all original data', () => {
  const state=initialState(),profile=state.profiles.elite;
  const before=JSON.stringify(profile.plan);saveSettings(profile,{...settings(profile),greetingEnabled:true,rate:1.1});markPlayed(profile,day);deferBriefing(profile,now);
  const imported=validateState(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(imported.profiles.elite.spokesperson,profile.spokesperson);assert.equal(JSON.stringify(profile.plan),before);
});
