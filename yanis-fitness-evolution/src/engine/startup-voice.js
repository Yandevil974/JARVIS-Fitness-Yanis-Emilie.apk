import { dailyBrief } from "./daily-brief.js";

/** Le coach vocal reste l'interrupteur général ; chaque profil garde son choix. */
export function startupVoiceEnabled(p) {
  if (!p?.preferences?.voice) return false;
  const setting = p.preferences.startupVoice;
  return typeof setting === "boolean" ? setting : p.id === "elite";
}

export function startupVoiceMessage(p, date) {
  const name = (p?.user?.name || "").trim();
  return `Bonjour${name ? ` ${name}` : ""}, JARVIS est prêt. ${dailyBrief(p, date).text}`;
}

// Évite de parler avant le chargement ou en arrière-plan, et de répéter à
// chaque rendu React. Un vrai retour au premier plan relance l'accueil.
export function startupVoiceLifecycle(announce, initiallyActive = true) {
  let started = false;
  let active = initiallyActive;
  return {
    start() {
      if (started) return;
      started = true;
      if (active) announce();
    },
    setActive(next) {
      const wasActive = active;
      active = !!next;
      if (started && active && !wasActive) announce();
    },
  };
}
