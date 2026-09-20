// One audio owner for dictation, replies and priority timer cues. No automatic send.
export const MESSAGES = {
  PERMISSION_DENIED: 'Microphone refusé. Autorisez-le dans les paramètres Android ou du navigateur ; le clavier reste disponible.',
  SERVICE_UNAVAILABLE: 'Aucun service de reconnaissance vocale disponible. Vérifiez les services vocaux du téléphone.',
  NO_SPEECH: 'Aucune parole détectée. Réessayez dans un endroit calme.',
  NO_MATCH: 'Paroles non reconnues. Réessayez ou utilisez le clavier.',
  NETWORK: 'Le service vocal demande une connexion. Le fonctionnement hors ligne dépend des langues installées.',
  BUSY: 'Le service vocal est occupé. Arrêtez l’écoute puis réessayez.',
  AUDIO: 'Le microphone est indisponible ou utilisé par une autre application.',
  CANCELLED: 'Écoute annulée. Aucun message envoyé.',
  BACKGROUND: 'Voix arrêtée au passage en arrière-plan.',
  LANGUAGE_UNAVAILABLE: 'La voix française n’est pas installée ou prise en charge. Vérifiez les paramètres de synthèse vocale.',
  TTS_NOT_READY: 'La synthèse vocale n’est pas encore prête. Réessayez le diagnostic.',
  TEXT_TOO_LONG: 'Ce texte est trop long pour une lecture unique. Il reste disponible à l’écran.',
  TTS_ERROR: 'La synthèse vocale a échoué. Le texte reste disponible.',
  TIMEOUT: 'Le service vocal ne répond pas. Réessayez ; le clavier reste disponible.',
  UPDATE_REQUIRED: 'Cette version Android ne possède pas encore le nouveau module vocal. Une mise à jour APK sera nécessaire.',
  TIMER_ACTIVE: 'Un chrono est actif : mettez-le en pause avant de dicter ou de tester la voix.',
  UNSUPPORTED: 'La dictée n’est pas disponible dans ce navigateur. Utilisez le clavier ou l’application Android.',
};
const browserCodes = { 'not-allowed': 'PERMISSION_DENIED', 'service-not-allowed': 'PERMISSION_DENIED',
  'no-speech': 'NO_SPEECH', 'audio-capture': 'AUDIO', network: 'NETWORK', aborted: 'CANCELLED',
  'language-not-supported': 'LANGUAGE_UNAVAILABLE' };
export function errorCode(error) {
  const names = { NotAllowedError: 'PERMISSION_DENIED', SecurityError: 'PERMISSION_DENIED', InvalidStateError: 'BUSY' };
  const code = names[error?.name] || error?.code || error?.error;
  if (MESSAGES[code]) return code;
  if (browserCodes[code]) return browserCodes[code];
  if (code === 'UNIMPLEMENTED' || /not implemented|not available on android/i.test(error?.message || '')) return 'UPDATE_REQUIRED';
  return 'SERVICE_UNAVAILABLE';
}
export function createVoiceController({ native, isAndroid = () => false, env = globalThis,
  setTimer = setTimeout, clearTimer = clearTimeout, listenTimeout = 20000, speakTimeout = 60000 } = {}) {
  let state = { phase: 'idle', error: '', code: null, detail: '', diagnostics: null };
  let context = { profile: null, timerActive: false, enabled: true };
  let epoch = 0, active = null, disposed = false;
  const subscribers = new Set();
  const publish = patch => { if (disposed) return; state = { ...state, ...patch }; subscribers.forEach(f => f(state)); };
  const fail = code => publish({ phase: 'error', code, error: MESSAGES[code] || MESSAGES.SERVICE_UNAVAILABLE, detail: '' });
  const settle = value => {
    const old = active; active = null;
    if (!old) return;
    clearTimer(old.timeout); old.resolve(value);
  };
  const stopDevices = () => {
    try { env.speechSynthesis?.cancel(); } catch {}
    try { active?.recognizer?.abort(); } catch {}
    if (isAndroid()) {
      // Both stop methods are idempotent, including during pending permission.
      Promise.resolve().then(() => native.cancelListen()).catch(() => {});
      Promise.resolve().then(() => native.stopSpeech()).catch(() => {});
    }
  };
  function cancel(code = 'CANCELLED', quiet = false) {
    epoch++; stopDevices(); settle(null);
    publish({ phase: 'idle', error: '', code: null, detail: quiet ? '' : MESSAGES[code] || MESSAGES.CANCELLED });
  }
  function begin(kind, timeout) {
    const id = ++epoch;
    let resolve;
    const promise = new Promise(r => { resolve = r; });
    active = { id, kind, resolve, timeout: setTimer(() => {
      if (id !== epoch) return;
      cancel('TIMEOUT', true); fail('TIMEOUT');
    }, timeout) };
    return { id, promise, current: () => !disposed && id === epoch && active?.id === id };
  }
  // Finite timeout for calls which do not own a microphone (diagnostic/stop).
  async function bounded(promise, ms = 5000) {
    let timer;
    try { return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimer(() => reject({ code: 'TIMEOUT' }), ms);
    })]); } finally { clearTimer(timer); }
  }
  async function capabilities() {
    if (isAndroid()) {
      let result;
      try { result = await bounded(native.diagnostics()); }
      catch (error) { throw { code: errorCode(error) }; }
      if (result?.protocolVersion !== 2) throw { code: 'UPDATE_REQUIRED' };
      return result;
    }
    const supported = !!(env.SpeechRecognition || env.webkitSpeechRecognition);
    const voices = env.speechSynthesis?.getVoices?.() || [];
    return { protocolVersion: 2, platform: 'browser', recognitionAvailable: supported,
      microphone: 'à vérifier au lancement', ttsReady: !!env.speechSynthesis,
      frenchAvailable: voices.some(v => /^fr(?:-|$)/i.test(v.lang)),
      languageStatus: voices.length ? 'known' : 'unknown', offlineGuaranteed: false };
  }
  async function diagnose() {
    if (active) return null;
    const id = ++epoch;
    publish({ phase: 'checking', error: '', code: null, detail: 'Vérification des services vocaux…' });
    try {
      const result = await capabilities();
      if (id !== epoch || disposed) return null;
      publish({ phase: 'idle', diagnostics: result, detail: 'Diagnostic terminé. Aucun enregistrement lancé.' });
      return result;
    } catch (error) { if (id === epoch) fail(errorCode(error)); return null; }
  }
  function listen() {
    if (disposed) return Promise.resolve(null);
    if (active?.kind === 'listen') { cancel(); return Promise.resolve(null); }
    if (context.timerActive) { fail('TIMER_ACTIVE'); return Promise.resolve(null); }
    cancel('CANCELLED', true);
    const operation = begin('listen', listenTimeout);
    publish({ phase: 'starting', error: '', code: null, detail: 'Préparation du microphone…' });
    (async () => {
      try {
        if (isAndroid()) {
          const info = await capabilities();
          if (!operation.current()) return;
          publish({ diagnostics: info });
          if (!info.recognitionAvailable) throw { code: 'SERVICE_UNAVAILABLE' };
          await bounded(native.stopSpeech());
          if (!operation.current()) return;
          const result = await native.listen({ requestId: String(operation.id) });
          if (!operation.current()) return;
          finishText(result?.text);
        } else {
          const Recognition = env.SpeechRecognition || env.webkitSpeechRecognition;
          if (!Recognition) throw { code: 'UNSUPPORTED' };
          const recognition = new Recognition(); active.recognizer = recognition;
          recognition.lang = 'fr-FR'; recognition.continuous = false; recognition.interimResults = false;
          recognition.onstart = () => operation.current() && publish({ phase: 'listening', detail: 'Je vous écoute…' });
          recognition.onspeechend = () => {
            if (operation.current()) { publish({ phase: 'processing', detail: 'Transcription en cours…' }); try { recognition.stop(); } catch {} }
          };
          recognition.onresult = event => { if (operation.current()) finishText(event.results?.[0]?.[0]?.transcript); };
          recognition.onerror = error => { if (operation.current()) { const code = errorCode(error); cancel(code, true); fail(code); } };
          recognition.onend = () => { if (operation.current()) { settle(null); fail('NO_SPEECH'); } };
          recognition.start();
        }
      } catch (error) {
        if (!operation.current()) return;
        const code = errorCode(error); cancel(code, true); fail(code);
      }
    })();
    function finishText(text) {
      const result = String(text || '').trim().slice(0, 1500);
      if (!result) { settle(null); fail('NO_MATCH'); return; }
      const recognition = active?.recognizer;
      settle(result);
      try { recognition?.abort(); } catch {}
      publish({ phase: 'idle', error: '', code: null, detail: 'Texte reconnu : corrigez-le puis appuyez sur Envoyer. Rien n’a été envoyé.' });
    }
    return operation.promise;
  }
  function speak(text, { enabled = true, priority = false, test = false } = {}) {
    if (disposed || !enabled || !String(text || '').trim()) return Promise.resolve(false);
    if (env.document?.hidden) return Promise.resolve(false);
    if (!priority && (active?.kind === 'listen' || context.timerActive)) {
      if (test) fail(context.timerActive ? 'TIMER_ACTIVE' : 'BUSY');
      return Promise.resolve(false);
    }
    // A timer cue interrupts any reply/listening; replies never interrupt a cue.
    if (!priority && active?.kind === 'cue') return Promise.resolve(false);
    cancel('CANCELLED', true);
    const operation = begin(priority ? 'cue' : 'speech', speakTimeout);
    publish({ phase: 'speaking', error: '', code: null, detail: priority ? 'Annonce du chrono / de séance' : 'Lecture de JARVIS…' });
    (async () => {
      try {
        if (isAndroid()) {
          const info = await capabilities();
          if (!operation.current()) return;
          publish({ diagnostics: info });
          if (!info.ttsReady) throw { code: 'TTS_NOT_READY' };
          if (!info.frenchAvailable) throw { code: 'LANGUAGE_UNAVAILABLE' };
          await native.speak({ text: String(text), requestId: String(operation.id) });
          if (operation.current()) complete();
        } else {
          if (!env.speechSynthesis || !env.SpeechSynthesisUtterance) throw { code: 'TTS_ERROR' };
          const voices = env.speechSynthesis.getVoices?.() || [];
          const french = voices.find(v => /^fr(?:-|$)/i.test(v.lang));
          // Empty list can mean browser voices not yet loaded; never claim language verified.
          if (voices.length && !french) throw { code: 'LANGUAGE_UNAVAILABLE' };
          const utterance = new env.SpeechSynthesisUtterance(String(text));
          utterance.lang = 'fr-FR'; utterance.rate = 0.98;
          if (french) utterance.voice = french;
          utterance.onend = () => operation.current() && complete();
          utterance.onerror = () => { if (operation.current()) { settle(false); fail('TTS_ERROR'); } };
          env.speechSynthesis.speak(utterance);
        }
      } catch (error) { if (operation.current()) { settle(false); fail(errorCode(error)); } }
    })();
    function complete() { settle(true); publish({ phase: 'idle', detail: 'Lecture terminée.' }); }
    return operation.promise;
  }
  function setContext(next) {
    const profileChanged = context.profile !== null && next.profile !== context.profile;
    const timerStarted = !context.timerActive && next.timerActive;
    const muted = context.enabled && next.enabled === false;
    context = { ...context, ...next };
    if (profileChanged || (timerStarted && active?.kind !== 'cue') || (muted && active?.kind !== 'listen')) cancel('CANCELLED', true);
  }
  let nativeListener;
  const onVisibility = () => { if (env.document?.hidden) cancel('BACKGROUND'); };
  const onHide = () => cancel('BACKGROUND');
  env.document?.addEventListener('visibilitychange', onVisibility);
  env.addEventListener?.('pagehide', onHide);
  if (isAndroid()) {
    Promise.resolve().then(() => native.addListener('speechState', event => {
      if (active?.kind !== 'listen' || String(active.id) !== event.requestId) return;
      if (['listening', 'processing'].includes(event.state)) publish({ phase: event.state,
        detail: event.state === 'listening' ? 'Je vous écoute…' : 'Transcription en cours…' });
    })).then(handle => { if (disposed) handle?.remove(); else nativeListener = handle; }).catch(() => {});
  }
  return { getSnapshot: () => state, subscribe: fn => { subscribers.add(fn); return () => subscribers.delete(fn); },
    diagnose, listen, cancel, speak, cue: (text, enabled = true) => speak(text, { enabled, priority: true }), setContext,
    dispose() { cancel('CANCELLED', true); disposed = true; nativeListener?.remove(); subscribers.clear();
      env.document?.removeEventListener('visibilitychange', onVisibility); env.removeEventListener?.('pagehide', onHide); },
  };
}
