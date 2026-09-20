import { createVoiceController } from './controller.mjs';
import css from './voice.css';

export function createVoice({ React, useApp, native, isAndroid, Icon }) {
  const controller = createVoiceController({ native, isAndroid, Icon });
  const { useEffect, useState, useRef } = React;
  function useVoice() {
    const [state, setState] = useState(controller.getSnapshot());
    useEffect(() => {
      const unsubscribe = controller.subscribe(setState);
      setState(controller.getSnapshot());
      return unsubscribe;
    }, []);
    return state;
  }
  function Observer() {
    const { p } = useApp();
    const state = useVoice();
    useEffect(() => {
      controller.setContext({ profile: p?.id, enabled: !!p?.preferences.voice,
        timerActive: !!(p?.timer && !p.timer.done && !p.timer.paused) });
    }, [p?.id, p?.preferences.voice, p?.timer?.id, p?.timer?.done, p?.timer?.paused]);
    return <><style>{css}</style>{state.error && <aside className="jv-alert" aria-label="Incident vocal">
      <span role="alert">{state.error}</span><button type="button" onClick={() => controller.cancel('CANCELLED', true)}>Fermer l’alerte vocale</button>
    </aside>}</>;
  }
  function Composer({ value, onChange, onSubmit }) {
    const { p } = useApp();
    const state = useVoice();
    const mounted = useRef(true);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; controller.cancel('CANCELLED', true); }; }, []);
    const busy = ['starting', 'listening', 'processing'].includes(state.phase);
    const timer = !!(p.timer && !p.timer.done && !p.timer.paused);
    async function dictate() {
      if (busy) { controller.cancel(); return; }
      const text = await controller.listen();
      if (mounted.current && text !== null) onChange(text);
    }
    const labels = { idle: 'Prêt', checking: 'Diagnostic', starting: 'Préparation du micro', listening: 'Écoute', processing: 'Transcription', speaking: 'JARVIS parle', error: 'À vérifier' };
    const d = state.diagnostics;
    return <section className="jv-panel" aria-label="Voix et microphone">
      <div className="jv-status" role="status" aria-live="polite"><strong>{labels[state.phase]}</strong><span>{state.detail}</span></div>
      <form className="chat-composer" onSubmit={event => {
        if (busy) { event.preventDefault(); return; }
        controller.cancel('CANCELLED', true); onSubmit(event);
      }}>
        <button type="button" className={`mic-button ${busy ? 'listening' : ''}`} onClick={dictate}
          disabled={timer && !busy} aria-label={busy ? 'Arrêter l’écoute' : 'Dicter un message'} title={busy ? 'Annuler sans envoyer' : 'Dicter un message'}><Icon name={busy ? 'Square' : 'Mic'} size={21} /></button>
        <input aria-label="Votre message à JARVIS" value={value} onChange={e => onChange(e.target.value)} maxLength={1500}
          readOnly={busy} placeholder={busy ? 'Je vous écoute…' : 'Votre message — dicté ou écrit'} />
        <button type="submit" className="send-button" disabled={busy || !value.trim()} aria-label="Envoyer à JARVIS"><Icon name="ArrowUp" size={22} /></button>
      </form>
      <p className="jv-help">La dictée remplit le champ : vous pouvez corriger avant d’envoyer. Aucun envoi automatique.</p>
      {timer && <p className="jv-help">Chrono actif : mettez-le en pause pour utiliser le microphone. Les annonces de séance restent prioritaires.</p>}
      <details className="jv-diagnostics"><summary>Diagnostic voix et microphone</summary>
        <div className="jv-actions">
          <button type="button" disabled={busy || state.phase === 'checking' || state.phase === 'speaking'} onClick={() => controller.diagnose()}>Vérifier les services vocaux</button>
          <button type="button" disabled={busy || timer} onClick={dictate}>Tester le microphone</button>
          <button type="button" disabled={busy || timer} onClick={() => controller.speak('Bonjour. Ceci est le test de la voix française de JARVIS.', { test: true })}>Tester la voix</button>
          <button type="button" onClick={() => controller.cancel()}>Arrêter la voix et l’écoute</button>
        </div>
        {d && <dl>
          <dt>Plateforme</dt><dd>{d.platform === 'android' ? 'Android · module vocal 2' : 'Navigateur'}</dd>
          <dt>Reconnaissance</dt><dd>{d.recognitionAvailable ? 'Service présent — test du micro nécessaire' : 'Service absent'}</dd>
          <dt>Microphone</dt><dd>{({ granted: 'Autorisé', denied: 'Refusé', prompt: 'Autorisation à demander', 'prompt-with-rationale': 'Autorisation à confirmer' })[d.microphone] || d.microphone}</dd>
          <dt>Synthèse</dt><dd>{d.ttsReady ? 'Moteur présent — vérifiez le son avec le test' : 'Moteur non prêt / indisponible'}</dd>
          <dt>Voix française</dt><dd>{d.frenchAvailable ? 'Disponible selon le service' : d.languageStatus === 'unknown' ? 'Liste des voix non chargée — à vérifier' : 'Absente / à installer'}</dd>
        </dl>}
        <p className="jv-help">Le test du micro demande son autorisation et lance une dictée. Android ou votre navigateur peut utiliser Internet selon le service et les langues installées. Le mode hors ligne n’est pas garanti. Aucun service d’IA conversationnelle générale n’est connecté.</p>
      </details>
    </section>;
  }
  return { ...controller, Observer, Composer };
}
