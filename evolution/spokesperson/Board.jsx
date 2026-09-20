import { briefing, settings, saveSettings, canGreet, markAttempt, markPlayed, wasPlayed, deferBriefing, deferredUntil, resumeBriefing, RATES } from './engine.mjs';
import { today } from '../reminders/engine.mjs';
import css from './spokesperson.css';

export function createSpokesperson({ React, useApp, Modal, Icon, Orb, voice, getCoaches, isAndroid }) {
  const { useState, useEffect, useLayoutEffect, useRef } = React;
  function useAudio() {
    const [state, setState] = useState(voice.getSnapshot());
    useEffect(() => { const stop = voice.subscribe(setState); setState(voice.getSnapshot()); return stop; }, []);
    return state;
  }
  function AudioStatus({ audio }) {
    return <p className="js-audio-status" role="status" aria-live="polite">{audio.phase === 'speaking' ? 'JARVIS parle…' : audio.phase === 'checking' ? 'Vérification des services vocaux…' : audio.error || audio.detail || 'Prêt pour une lecture sur bouton.'}</p>;
  }
  function Observer() {
    const { p } = useApp();
    useLayoutEffect(() => {
      if (p) voice.setPlaybackPreferences(settings(p), p.id);
    }, [p?.id, p?.spokesperson?.settings]);
    return <><style>{css}</style>{settings(p).silent && <div className="js-silent" role="status">Mode silencieux · réglages vocaux sur l’accueil</div>}</>;
  }
  function Board() { const { p } = useApp(); return p ? <ProfileBoard key={p.id} /> : null; }
  function ProfileBoard() {
    const { p, updateProfile, navigate, setModal, modal, notify } = useApp();
    const audio = useAudio();
    const [now, setNow] = useState(Date.now()), [showSettings, setShowSettings] = useState(false);
    const live = useRef(true), attempt = useRef('');
    const owner = `briefing-${p.id}`;
    useEffect(() => {
      live.current = true;
      const refresh = () => setNow(Date.now());
      const timer = setInterval(refresh, 30000);
      window.addEventListener('focus', refresh); document.addEventListener('visibilitychange', refresh);
      return () => { live.current = false; clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); voice.cancelOwner(owner); };
    }, []);
    const day = today(new Date(now)), prefs = settings(p), point = briefing(p, getCoaches(p), day);
    const until = deferredUntil(p, now), timerActive = !!(p.timer && !p.timer.done && !p.timer.paused);
    const busy = ['starting', 'listening', 'processing', 'speaking', 'checking'].includes(audio.phase);
    const mutate = fn => updateProfile(q => { if (q.id === p.id) fn(q); });
    async function play(automatic = false) {
      if (prefs.silent || timerActive || document.hidden) return;
      const date = today();
      if (automatic && !canGreet(p, { day: date, busy: !['idle', 'error'].includes(voice.getSnapshot().phase), visible: !document.hidden, modal: !!modal || showSettings })) return;
      mutate(q => markAttempt(q, date));
      const success = await voice.speak(point.speech, { owner, onlyIfIdle: automatic });
      if (live.current && success === true) mutate(q => markPlayed(q, date));
    }
    useEffect(() => {
      if (!canGreet(p, { day, now, visible: !document.hidden, busy, modal: !!modal || showSettings }) || attempt.current === day) return;
      const timer = setTimeout(() => { attempt.current = day; void play(true); }, 300);
      return () => clearTimeout(timer);
    }, [p, day, now, busy, modal, showSettings]);
    function open(item) {
      voice.cancelOwner(owner);
      if (item.action.modal) setModal({ type: item.action.modal, measurementId: item.action.measurementId });
      else navigate(item.action.page, item.action.tab);
    }
    return <section className="js-team" aria-labelledby="js-team-title">
      <header className="js-team-header"><div className="js-team-identity"><Orb small />
        <div><span className="js-eyebrow">JARVIS · PORTE-PAROLE</span><h2 id="js-team-title">Le point de ton équipe</h2><p>Bonjour {point.name}. Des priorités expliquées, pas des décisions imposées.</p></div>
      </div><button className="js-button secondary" onClick={() => setShowSettings(true)}><Icon name="Settings2" size={16} />Réglages vocaux</button></header>
      {until ? <div className="js-deferred"><Icon name="Clock" size={20} /><p>Point d’équipe en pause jusqu’à {new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(until))}.<br /><small>Les rappels et leurs échéances restent visibles plus bas.</small></p><button className="js-button secondary" onClick={() => mutate(resumeBriefing)}>Afficher maintenant</button></div> : <>
        <div className="js-priorities">{point.items.map(item => <article className="js-priority" key={item.key}>
          <span className="js-coach">{item.coach.name}<small>{item.coach.role}</small></span>
          <div className="js-priority-body"><h3>{item.title}</h3><details><summary>Pourquoi ?</summary><p>{item.reason}</p></details></div>
          <button className="js-open" onClick={() => open(item)} aria-label={`Ouvrir : ${item.title}`}><Icon name="ArrowUpRight" size={20} /></button>
        </article>)}</div>
        {!point.items.length && <p className="js-note">Aucune priorité à annoncer. Les suivis reportés restent dans le tableau de rappels.</p>}
        {point.additional > 0 && <p className="js-note">Ce point présente trois priorités au maximum. Les autres échéances restent dans « Ton suivi avec l’équipe ».</p>}
        <div className="js-actions">
          <button className="js-button" disabled={prefs.silent || timerActive || busy} onClick={() => play()}><Icon name="Volume2" size={17} />{wasPlayed(p, day) ? 'Répéter le point' : 'Écouter le point'}</button>
          <button className="js-button secondary" onClick={() => { voice.cancelOwner(owner); mutate(q => deferBriefing(q)); setNow(Date.now()); notify('Point d’équipe en pause une heure. Les bilans ne sont ni validés ni reportés.'); }}>Plus tard · 1 h</button>
          {audio.phase === 'speaking' && <button className="js-button secondary" onClick={() => voice.cancel()}>Arrêter la voix</button>}
          <button className="js-link" onClick={() => navigate('jarvis')}>Ouvrir JARVIS · micro sur bouton</button>
        </div>
      </>}
      <p className="js-note" role="status">{prefs.silent ? 'Mode silencieux : aucune lecture, y compris les annonces vocales de chrono.' : timerActive ? 'Chrono actif : le point attend pour ne pas couvrir ses annonces.' : prefs.greetingEnabled && p.preferences.voice ? 'Accueil vocal facultatif activé · au plus une tentative par jour et par profil.' : 'Accueil automatique désactivé. La lecture reste disponible sur bouton.'}</p>
      <AudioStatus audio={audio} />
      <footer className="js-transparency">Équipe virtuelle · règles locales. L’accueil lit deux priorités au maximum. Aucune écoute automatique, aucune modification de programme.</footer>
      {showSettings && <SettingsPanel profile={p} onClose={() => setShowSettings(false)} onSave={(form, enabled) => {
        voice.setPlaybackPreferences(form, p.id);
        mutate(q => { saveSettings(q, form); q.preferences.voice = enabled; });
        setShowSettings(false); notify('Préférences vocales enregistrées pour ce profil.');
      }} />}
    </section>;
  }
  function SettingsPanel({ profile, onSave, onClose }) {
    const [form, setForm] = useState(settings(profile)), [enabled, setEnabled] = useState(!!profile.preferences.voice);
    const [loading, setLoading] = useState(false), [voices, setVoices] = useState([]), [loaded, setLoaded] = useState(false);
    const alive = useRef(true);
    const platform = isAndroid() ? 'android' : 'browser';
    const selected = form.voiceIds[platform];
    const audio = useAudio();
    useEffect(() => { alive.current = true; return () => { alive.current = false; voice.cancelOwner('voice-settings'); }; }, []);
    async function loadVoices() {
      setLoading(true);
      const info = await voice.diagnose();
      if (!alive.current) return;
      if (info) { setVoices((info.voices || []).filter(v => v.id && /^fr(?:-|$)/i.test(v.lang))); setLoaded(true); }
      setLoading(false);
    }
    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
    const blocked = ['starting', 'listening', 'processing', 'speaking', 'checking'].includes(audio.phase);
    return <Modal title="La voix de ton équipe" subtitle={`Préférences de ${profile.user.name || profile.id}. Les deux profils restent indépendants.`} onClose={onClose}>
      <form className="js-settings" onSubmit={e => { e.preventDefault(); onSave(form, enabled); }}>
        <label className="js-check"><input type="checkbox" checked={form.silent} onChange={e => set('silent', e.target.checked)} />Mode silencieux · couper toutes les lectures</label>
        <label className="js-check"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />Voix de JARVIS activée</label>
        <label className="js-check"><input type="checkbox" checked={form.greetingEnabled} onChange={e => set('greetingEnabled', e.target.checked)} />Accueil vocal à l’ouverture · une fois par jour</label>
        <p className="js-note">L’accueil nécessite la voix activée et le mode silencieux désactivé. Il attend si un chrono, une écoute ou une fenêtre est ouvert. Selon le navigateur, une interaction peut être nécessaire. Pas de lecture en arrière-plan.</p>
        <label>Débit de lecture<select className="input" value={form.rate} onChange={e => set('rate', Number(e.target.value))}>{RATES.map(rate => <option key={rate} value={rate}>{rate === 0.98 ? 'Normal' : rate < 0.98 ? `Plus lent · ${rate}×` : `Plus rapide · ${rate}×`}</option>)}</select></label>
        <p className="js-note">Le décompte et les consignes prioritaires gardent leur débit normal.</p>
        <label>Voix française · {platform === 'android' ? 'Android' : 'navigateur'}<select className="input" value={selected} onChange={e => set('voiceIds', { ...form.voiceIds, [platform]: e.target.value })}>
          <option value="">Voix française par défaut</option>
          {selected && !voices.some(v => v.id === selected) && <option value={selected}>Voix enregistrée · à vérifier</option>}
          {voices.map(v => <option key={v.id} value={v.id}>{v.name} · {v.lang}{v.networkRequired ? ' · réseau' : ''}</option>)}
        </select></label>
        <button type="button" className="js-button secondary" disabled={loading || blocked} onClick={loadVoices}>{loading ? 'Vérification…' : 'Actualiser les voix disponibles'}</button>
        {loaded && !voices.length && <p className="js-note">Aucune voix française listée. Installez une voix ou relancez le diagnostic ; sa disponibilité n’est pas présumée.</p>}
        <p className="js-note">Le choix dépend des voix installées sur cet appareil. Certaines utilisent Internet. Le réglage du navigateur est distinct de celui d’Android. Le mode silencieux coupe aussi les tests sonores.</p>
        <AudioStatus audio={audio} />
        <div className="js-actions"><button type="button" className="js-button secondary" disabled={blocked || form.silent || settings(profile).silent} onClick={() => voice.speak('Bonjour. Voici la voix et le débit choisis pour ton équipe.', { test: true, rate: form.rate, voiceId: selected, owner: 'voice-settings' })}>Tester ces réglages</button><button type="button" className="js-button secondary" onClick={onClose}>Annuler</button><button type="submit" className="js-button">Enregistrer la voix</button></div>
      </form>
    </Modal>;
  }
  return { Board, Observer };
}
