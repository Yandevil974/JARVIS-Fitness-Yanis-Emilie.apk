/* ==========================================================================
   COACHING VOCAL PENDANT LA SÉANCE
   --------------------------------------------------------------------------
   Décide *quoi* annoncer et *quand*, à partir de l'état du minuteur. Ce
   module ne parle pas lui-même : il retourne une phrase, que l'appelant
   confie à speak(). Cela le rend testable sans navigateur ni synthèse
   vocale.

   Trois familles d'annonces :
     - le décompte de fin d'étape (5, 3, 2, 1) ;
     - la fin d'une récupération, pour repartir sans regarder l'écran ;
     - le changement d'étape, en nommant la suivante.

   Règle de conception : une annonce ne doit jamais être répétée. L'appelant
   conserve un « souvenir » (l'objet retourné dans `memo`) qu'il redonne au
   prochain appel ; c'est lui qui empêche la répétition, pas une minuterie.
   ========================================================================== */

/** Secondes restantes qui déclenchent un décompte parlé. */
export const COUNTDOWN_AT = [5, 3, 2, 1];

/** Mémoire initiale, à conserver entre deux appels. */
export function initialMemo() {
  return { spoken: {}, index: null, done: false };
}

function stepName(timer, index) {
  const s = timer?.steps?.[index];
  return s?.name || "";
}

/**
 * Décide de la prochaine annonce.
 *
 * @param timer  minuteur déjà avancé par advanceTimer()
 * @param memo   souvenir retourné par l'appel précédent
 * @returns {{text: string|null, memo: object}}
 */
export function nextAnnouncement(timer, memo = initialMemo()) {
  const next = {
    spoken: { ...memo.spoken },
    index: memo.index,
    done: memo.done,
  };
  if (!timer) return { text: null, memo: initialMemo() };

  // Fin complète du minuteur : une seule annonce, définitive.
  if (timer.done) {
    if (next.done) return { text: null, memo: next };
    next.done = true;
    const type = timer.meta?.type;
    // L'annonce finale doit correspondre au protocole : dire « séance
    // terminée » à la fin d'un échauffement laissait croire que tout
    // était fini.
    const nom = timer.meta?.name || "";
    return {
      text:
        type === "rest"
          ? "Récupération terminée. On reprend."
          : /tirements/i.test(nom)
            ? "Étirements terminés. Bonne récupération."
            : type === "warmup"
              ? "Échauffement terminé. Vous pouvez commencer."
              : "Séance terminée. Bravo.",
      memo: next,
    };
  }

  if (timer.paused) return { text: null, memo: next };

  const index = timer.index ?? 0;

  // Changement d'étape : on nomme la nouvelle.
  if (next.index !== index) {
    const first = next.index === null;
    next.index = index;
    next.spoken = {};
    if (!first) {
      const name = stepName(timer, index);
      const rest = timer.steps?.[index]?.type === "rest";
      return {
        text: rest
          ? "Récupération."
          : name
            ? `Au suivant : ${name}.`
            : "Étape suivante.",
        memo: next,
      };
    }
    // À la toute première observation, on n'annonce rien : le lancement du
    // minuteur est déjà annoncé ailleurs, et doubler serait bavard.
    return { text: null, memo: next };
  }

  // Décompte de fin d'étape.
  const remaining = Math.ceil(timer.remaining ?? 0);
  if (COUNTDOWN_AT.includes(remaining) && !next.spoken[remaining]) {
    next.spoken[remaining] = true;
    return { text: String(remaining), memo: next };
  }

  return { text: null, memo: next };
}

/**
 * Annonce de tempo pour une série guidée, du style « 3 secondes en
 * descente, 1 seconde en montée ». Retourne null si l'exercice n'a pas de
 * tempo déclaré, pour ne rien inventer.
 */
export function tempoAnnouncement(exercise) {
  const tempo = exercise?.tempo;
  if (!tempo || typeof tempo !== "string") return null;
  const parts = tempo.split(/[-–:]/).map((n) => parseInt(n, 10));
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null;
  const [down, pause, up] = parts;
  const bits = [`${down} seconde${down > 1 ? "s" : ""} en descente`];
  if (pause > 0) bits.push(`${pause} de pause`);
  if (up > 0) bits.push(`${up} en montée`);
  return `Tempo : ${bits.join(", ")}.`;
}
