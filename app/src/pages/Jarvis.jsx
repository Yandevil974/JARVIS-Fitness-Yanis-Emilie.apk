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
export default function Jarvis() {
  const {
    p,
    sendCoach,
    applyMessage,
    navigate,
    openExercise,
    updateProfile,
    notify,
    setModal,
  } = useApp();
  const [input, setInput] = useState(""),
    [listening, setListening] = useState(false);
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
          MOTEUR LOCAL ACTIF
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
            {/* Effacer la conversation. Les propositions du coach vivent
                dans cette liste : en effacer une non appliquée l'annule.
                On prévient plutôt que de le faire en silence. */}
            {p.messages.length > 0 && (
              <button
                className="icon-button"
                aria-label="Effacer la conversation"
                title="Effacer la conversation"
                onClick={() => setModal({ type: "clear-chat" })}
              >
                <Icon name="Trash2" />
              </button>
            )}
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
                <div className="message-content">
                  {m.role === "assistant" && (
                    <div className="message-label">
                      JARVIS <span>ANALYSE LOCALE</span>
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
            <Icon name="LockKeyhole" size={12} /> Analyse par règles locales,
            pas de modèle externe connecté. Aucune donnée envoyée par JARVIS.
            <br />
            La dictée, si utilisée, peut utiliser le service vocal Android ou
            celui du navigateur, selon vos réglages.
          </div>
        </Panel>
        <aside className="chat-rail">
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
