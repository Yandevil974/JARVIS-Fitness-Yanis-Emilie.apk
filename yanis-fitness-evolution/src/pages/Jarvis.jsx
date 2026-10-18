import { isAndroid, NativeSpeech } from "../platform/native.js";
import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  Button,
  Icon,
  PageHeading,
  Panel,
  Badge,
  Orb,
  Empty,
} from "../components/ui.jsx";
import { exerciseById } from "../data/library.js";
import { dateLabel } from "../engine/utils.js";
import { brainEnabled } from "../brain/policy.js";
import { memoryStats } from "../brain/memory.js";
import {
  brainConfig,
  brainReady,
  brainModels,
  testArenaKey,
} from "../engine/remote-brain.js";
import { assistantLabel } from "./jarvis-label.js";
export default function Jarvis() {
  const {
    p,
    sendCoach,
    applyMessage,
    navigate,
    openExercise,
    updateProfile,
    notify,
  } = useApp();
  const brain = memoryStats(p),
    brainOn = brainEnabled(p);
  const arena = brainConfig(p);
  const setArena = (patch) =>
    updateProfile((q) => {
      q.preferences.brain = { ...(q.preferences.brain || {}), ...patch };
    });
  const [input, setInput] = useState(""),
    [listening, setListening] = useState(false),
    [testing, setTesting] = useState(false),
    [testState, setTestState] = useState(null);
  const runTest = () => {
    if (testing || !brainReady(arena)) return;
    setTesting(true);
    setTestState(null);
    testArenaKey(arena)
      .then((r) => setTestState({ ok: true, model: r.model }))
      .catch((e) =>
        setTestState({
          ok: false,
          error: e && e.message ? e.message : "erreur inconnue",
        }),
      )
      .finally(() => setTesting(false));
  };
  const bottom = useRef(),
    recognition = useRef();
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [p.messages.length]);
  useEffect(() => () => recognition.current?.abort(), []);
  async function mic() {
    if (isAndroid()) {
      setListening(true);
      try {
        const result = await NativeSpeech.listen();
        setInput(result.text || "");
      } catch (e) {
        notify(
          e.message || "Dictée indisponible. Utilisez le clavier.",
          "info",
        );
      } finally {
        setListening(false);
      }
      return;
    }
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) {
      notify(
        "Reconnaissance vocale non disponible ici. Le mode texte reste pleinement fonctionnel.",
        "info",
      );
      return;
    }
    if (listening) {
      recognition.current?.stop();
      return;
    }
    try {
      const r = new Speech();
      recognition.current = r;
      r.lang = "fr-FR";
      r.interimResults = false;
      r.onresult = (e) => {
        setInput(e.results[0][0].transcript);
        setListening(false);
      };
      r.onend = () => setListening(false);
      r.onerror = (e) => {
        setListening(false);
        notify(
          e.error === "not-allowed"
            ? "Autorisez le microphone dans votre navigateur ou utilisez le texte."
            : "Écoute interrompue. Vous pouvez écrire votre demande.",
          "info",
        );
      };
      r.start();
      setListening(true);
    } catch (e) {
      notify(
        "Le microphone ne peut pas démarrer dans cet environnement.",
        "info",
      );
    }
  }
  const submit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendCoach(input.trim());
    setInput("");
  };
  const chips = [
    "Je n’ai que 30 minutes",
    "Je suis fatigué",
    "Prépare 4 séances par semaine pendant 12 semaines",
    "Retiens que je préfère m’entraîner le matin",
    "Qu’est-ce que tu sais sur moi ?",
    "Remplace cet exercice",
    "Analyse ma semaine",
    "Exercice haut des pectoraux",
  ];
  return (
    <>
      <PageHeading
        eyebrow="L’INTELLIGENCE AU SERVICE DU MOUVEMENT"
        title="Votre coach. Toujours à vos côtés."
        description="Un dialogue, des décisions expliquées, un programme qui évolue."
      >
        <Badge color="mint" dot>
          {brainReady(arena) ? "PLATE-FORME ARENA//X ACTIVE" : "MOTEUR LOCAL ACTIF"}
        </Badge>
      </PageHeading>
      <div className="coach-layout">
        <Panel className="chat-panel">
          <div className="chat-top">
            <div className="chat-identity">
              <Orb small />
              <div>
                <strong>
                  JARVIS <span className="ai-tag">AI</span>
                </strong>
                <small>Votre contexte sportif, en mémoire.</small>
              </div>
            </div>
            <button
              className={`icon-button ${p.preferences.voice ? "selected" : ""}`}
              aria-label={
                p.preferences.voice ? "Désactiver la voix" : "Activer la voix"
              }
              onClick={() => {
                updateProfile((q) => {
                  q.preferences.voice = !q.preferences.voice;
                });
                notify(
                  p.preferences.voice
                    ? "Voix désactivée."
                    : "Voix activée si disponible sur ce navigateur.",
                );
              }}
            >
              <Icon name={p.preferences.voice ? "Volume2" : "VolumeX"} />
            </button>
          </div>
          <div className="chat-messages">
            {!p.messages.length && (
              <div className="chat-welcome">
                <Orb />
                <h2>
                  Qu’allons-nous améliorer
                  <br />
                  aujourd’hui ?
                </h2>
                <p>
                  Votre temps, votre forme, vos objectifs.
                  <br />
                  Dites-moi ce qui change, je m’adapte.
                </p>
                <div className="suggestion-grid">
                  {chips.slice(0, 4).map((c, i) => (
                    <button key={c} onClick={() => sendCoach(c)}>
                      <Icon
                        name={
                          [
                            "Clock3",
                            "BatteryMedium",
                            "CalendarRange",
                            "Repeat2",
                          ][i]
                        }
                        size={18}
                      />
                      <span>{c}</span>
                      <Icon name="ArrowUpRight" size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {p.messages.map((m) => (
              <div className={`message ${m.role}`} key={m.id}>
                {m.role === "assistant" && (
                  <div className="message-avatar">
                    <Icon name="Sparkles" size={16} />
                  </div>
                )}
                <div
                  className={`message-content${m.streaming ? " streaming" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="message-label">
                      JARVIS{" "}
                      <span>{assistantLabel(m)}</span>
                    </div>
                  )}
                  <p>{m.text}</p>
                  {m.exerciseIds && (
                    <div className="message-exercises">
                      {m.exerciseIds.map((id) => (
                        <button key={id} onClick={() => openExercise(id)}>
                          <Icon name="Dumbbell" size={15} />
                          {exerciseById(id).name}
                          <Icon name="ArrowUpRight" size={13} />
                        </button>
                      ))}
                    </div>
                  )}
                  {m.choices?.length > 0 && (
                    <div className="message-exercises">
                      {m.choices.map((id) => (
                        <button
                          key={id}
                          disabled={m.applied}
                          onClick={() => applyMessage(m, { exerciseId: id })}
                        >
                          <Icon name="Repeat2" size={15} />
                          {exerciseById(id).name}
                          {!m.applied && <span>Choisir</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.action && !m.choices?.length && !m.applied && (
                    <Button
                      variant="primary small"
                      icon={m.action.type === "log" ? "Plus" : "Check"}
                      onClick={() => applyMessage(m)}
                    >
                      {m.action.type === "log"
                        ? "Renseigner la série"
                        : "Appliquer l’adaptation"}
                    </Button>
                  )}
                  {m.brain?.kind === "memory_confirmation_guard" && (
                    <div className="brain-guard-note">
                      <Icon name="LockKeyhole" size={14} />
                      Confirmation volontairement manuelle : le chat ne
                      confirme, ne refuse et n’enregistre aucune mémoire.
                    </div>
                  )}
                  {m.brain?.memoryId && (
                    <button
                      className="brain-memory-chip"
                      onClick={() => navigate("profile", "brain")}
                    >
                      <Icon name="Brain" size={15} />
                      {m.brain.memoryState === "hypothesis"
                        ? "Hypothèse — à confirmer dans la mémoire contrôlée"
                        : "Proposition mémoire en attente de confirmation"}
                      <span>
                        Ouvrir <Icon name="ArrowUpRight" size={13} />
                      </span>
                    </button>
                  )}
                  {m.applied && (
                    <div className="applied-state">
                      <Icon name="CircleCheck" size={15} />
                      {m.result || "Modification appliquée et enregistrée"}
                    </div>
                  )}
                  {m.navigate && (
                    <button
                      className="text-link"
                      onClick={() => navigate(m.navigate, m.tab)}
                    >
                      Ouvrir le module <Icon name="ArrowUpRight" size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottom} />
          </div>
          {p.messages.length > 0 && (
            <div className="chat-chips">
              {chips.slice(0, 3).map((c) => (
                <button onClick={() => sendCoach(c)} key={c}>
                  {c}
                </button>
              ))}
            </div>
          )}
          <form className="chat-composer" onSubmit={submit}>
            <button
              type="button"
              className={`mic-button ${listening ? "listening" : ""}`}
              onClick={mic}
              aria-label={listening ? "Arrêter l’écoute" : "Dicter un message"}
            >
              <Icon name={listening ? "Square" : "Mic"} size={21} />
            </button>
            <input
              aria-label="Votre message à JARVIS"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1500}
              placeholder={
                listening
                  ? "Je vous écoute…"
                  : "Dites à JARVIS ce dont vous avez besoin…"
              }
            />
            <button
              type="submit"
              className="send-button"
              disabled={!input.trim()}
              aria-label="Envoyer à JARVIS"
            >
              <Icon name="ArrowUp" size={22} />
            </button>
          </form>
          <div className="chat-disclaimer">
            <Icon name="LockKeyhole" size={12} />{" "}
            {arena.enabled && arena.key
              ? "Conversation déléguée à votre plate-forme ARENA//X (clé conservée sur l’appareil). Commandes de l’appli et secours hors ligne : cerveau local."
              : "Analyse par règles locales, pas de modèle externe connecté. Aucune donnée envoyée par JARVIS."}
            <br />
            Fitness Brain local : mémoire proposée uniquement sur commande
            explicite, confirmée à la main dans Profil → Mémoire JARVIS, jamais
            par un « oui » du chat.
            <br />
            La dictée, si utilisée, peut utiliser le service vocal Android ou
            celui du navigateur, selon vos réglages.
          </div>
        </Panel>
        <aside className="chat-rail">
          <Panel className="brain-panel">
            <div className="eyebrow">PLATE-FORME IA PERSONNELLE</div>
            <h3>ARENA//X conversationnel</h3>
            <label className="brain-row">
              <input
                type="checkbox"
                checked={arena.enabled}
                onChange={(e) => setArena({ enabled: e.target.checked })}
              />
              <span>Conversation via ma plate-forme IA</span>
            </label>
            <label className="brain-row">
              <span>Fournisseur</span>
              <select
                value={arena.provider}
                onChange={(e) => setArena({ provider: e.target.value })}
              >
                <option value="groq">Groq (clé gsk-…)</option>
                <option value="openrouter">OpenRouter (clé sk-or-…)</option>
              </select>
            </label>
            <label className="brain-row">
              <span>Clé API</span>
              <input
                type="password"
                autoComplete="off"
                placeholder="Collez votre clé ici"
                value={arena.key}
                onChange={(e) => setArena({ key: e.target.value })}
              />
            </label>
            <label className="brain-row">
              <span>Mode</span>
              <select
                value={arena.style}
                onChange={(e) => setArena({ style: e.target.value })}
              >
                <option value="solo">Solo — un modèle répond</option>
                <option value="collab">Collaboration — brouillons + synthèse</option>
              </select>
            </label>
            <div className="brain-row">
              <button
                type="button"
                className="brain-test-btn"
                disabled={testing || !arena.enabled || !arena.key}
                onClick={runTest}
              >
                {testing
                  ? "Test en cours…"
                  : testState && testState.ok
                    ? "Retester la clé"
                    : "Tester la clé"}
              </button>
            </div>
            {testing && (
              <small className="brain-test-info">
                Appel de validation envoyé à votre plate-forme…
              </small>
            )}
            {testState && testState.ok && (
              <small className="brain-test-ok">
                ✓ Clé valide — « {testState.model} » répond. La conversation est
                active : parlez à JARVIS.
              </small>
            )}
            {testState && !testState.ok && (
              <small className="brain-test-err">✗ {testState.error}</small>
            )}
            <small>
              Moteur identique à votre arène : appels directs Groq / OpenRouter,
              streaming, et en collaboration deux brouillons fusionnés par le
              synthétiseur. La clé reste sur cet appareil. Sans clé, sans
              réseau ou en cas d’erreur, le cerveau local reprend la main.
            </small>
            {brainReady(arena) && (
              <small className="brain-ready">
                ● PRÊT — modèle : {brainModels(arena)[0]}
              </small>
            )}
          </Panel>
          <Panel className={`brain-rail ${brainOn ? "" : "off"}`}>
            <div className="eyebrow">FITNESS BRAIN · LOCAL</div>
            <h3>Mémoire contrôlée</h3>
            <p className="small-subtitle">
              Le Brain propose, vous confirmez. Aucun apprentissage automatique,
              aucune donnée envoyée : le coach déterministe reste aux commandes
              du programme.
            </p>
            <div className="brain-counts">
              <div>
                <strong>{brain.pending + brain.hypotheses}</strong>
                <span>à confirmer</span>
              </div>
              <div>
                <strong>{brain.confirmed}</strong>
                <span>confirmées</span>
              </div>
              <div>
                <strong>{brain.expired}</strong>
                <span>expirées</span>
              </div>
            </div>
            <Button
              variant="secondary small"
              icon="Brain"
              onClick={() => navigate("profile", "brain")}
            >
              Ouvrir la mémoire contrôlée
            </Button>
            <p className="brain-status">
              <Icon name={brainOn ? "CircleCheck" : "Ban"} size={13} />
              {brainOn
                ? "Brain actif · rappel en lecture seule des seules mémoires confirmées."
                : "Brain désactivé · le coach déterministe historique reste utilisable."}
            </p>
          </Panel>
          <Panel>
            <div className="eyebrow">MÉMOIRE SPORTIVE</div>
            <h3>Un contexte. Pas des suppositions.</h3>
            <div className="memory-stats">
              <div>
                <Icon name="Dumbbell" />
                <strong>{p.sessions.length}</strong>
                <span>séances enregistrées</span>
              </div>
              <div>
                <Icon name="Activity" />
                <strong>{p.activities.length}</strong>
                <span>activités complémentaires</span>
              </div>
              <div>
                <Icon name="HeartPulse" />
                <strong>{Object.keys(p.checkIns).length}</strong>
                <span>bilans de récupération</span>
              </div>
            </div>
            <p className="small-subtitle">
              JARVIS ne propose une charge qu’à partir d’une performance ou d’un
              test du même exercice.
            </p>
          </Panel>
          <Panel>
            <SectionTitle />
            <div className="adaptation-list">
              {p.adaptations.length ? (
                p.adaptations.slice(0, 8).map((a) => (
                  <div key={a.id}>
                    <i />
                    <div>
                      <strong>{a.label}</strong>
                      <p>{a.detail}</p>
                      <small>{dateLabel(a.date)}</small>
                    </div>
                  </div>
                ))
              ) : (
                <Empty
                  compact
                  icon="GitBranch"
                  title="Une évolution traçable"
                  text="Vos adaptations apparaîtront ici avec leur raison."
                />
              )}
            </div>
          </Panel>
          <div className="safety-note">
            <Icon name="ShieldPlus" size={18} />
            <span>
              Un coach sportif, pas un diagnostic médical. En cas de douleur,
              interrompez l’exercice.
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}
function SectionTitle() {
  return (
    <div className="section-heading">
      <h2>Journal des décisions</h2>
      <Icon name="GitBranch" size={17} />
    </div>
  );
}
