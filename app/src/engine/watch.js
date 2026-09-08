/* ==========================================================================
   VEILLE DU COACH — RÉ-ACTUALISATION EN CAS DE PROBLÈME
   --------------------------------------------------------------------------
   Jusqu'ici le coach ne se remettait en question que si on lui parlait :
   il fallait dire « je suis fatigué » pour qu'il allège la séance. Ce
   module surveille le journal et signale de lui-même ce qui cloche.

   Principe tenu du reste de l'application : rien n'est modifié sans
   accord. Chaque constat retourne une PROPOSITION, avec l'action que le
   coach exécuterait si on l'accepte. C'est l'interface qui décide de la
   présenter, et l'utilisateur qui tranche.

   Chaque constat porte une `key` stable : elle sert à ne pas répéter le
   même signalement jour après jour.
   ========================================================================== */
import { today, addDays, monday } from "./utils.js";
import { recoveryScore, allSessions } from "./fitness.js";
import { reevaluationStatus } from "./strength.js";

/** Nombre de jours sans séance à partir duquel on s'inquiète. */
export const INACTIVITY_DAYS = 8;
/** Nombre de séances manquées consécutives qui déclenche une remise à plat. */
export const MISSED_STREAK = 3;
/** Sous ce score de récupération, plusieurs jours de suite, on allège. */
export const LOW_RECOVERY = 55;
/** Nombre de jours de récupération basse à observer. */
export const LOW_RECOVERY_DAYS = 3;
/** Le coach prévient une semaine avant chaque échéance de suivi. */
export const PREAVIS_JOURS = 7;
/** Cadence des points photo et mensurations, en semaines. */
export const SUIVI_SEMAINES = 4;

/**
 * Échéance d'un suivi périodique, calée sur la PREMIÈRE date enregistrée.
 * Ancrer sur la dernière ferait dériver le calendrier à chaque retard :
 * une pesée faite avec trois jours de retard décalerait toutes les
 * suivantes. En repartant de l'origine, les points restent alignés.
 *
 * @returns {{origine, derniere, prochaine, jours, due, bientot}|null}
 */
export function echeanceSuivi(dates, semaines = SUIVI_SEMAINES, date = today()) {
  const propres = (dates || []).filter(Boolean).sort();
  if (!propres.length) return null;
  const origine = propres[0];
  const derniere = propres[propres.length - 1];
  const pas = semaines * 7;
  // Première échéance strictement postérieure à aujourd'hui, en partant
  // de l'origine et en avançant d'un pas constant.
  let prochaine = origine;
  let garde = 0;
  while (daysBetween(prochaine, date) >= 0 && garde++ < 500)
    prochaine = addDays(prochaine, pas);
  const jours = daysBetween(date, prochaine);
  return {
    origine,
    derniere,
    prochaine,
    jours,
    due: daysBetween(derniere, prochaine) <= 0 || jours <= 0,
    bientot: jours > 0 && jours <= PREAVIS_JOURS,
  };
}

function daysBetween(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
}

/**
 * Examine le profil et retourne les constats du jour, du plus urgent au
 * moins urgent. Fonction pure : aucun effet de bord, ce qui la rend
 * vérifiable directement.
 *
 * @returns {Array<{key,severity,title,detail,action}>}
 */
export function reviewProfile(p, date = today()) {
  if (!p) return [];
  const out = [];

  // --- Douleur signalée récemment ------------------------------------
  // Le signalement de douleur suspend l'effort sur le moment ; encore
  // faut-il que la séance suivante en tienne compte.
  const painDays = Object.entries(p.checkIns || {})
    .filter(([d, e]) => e?.painReported && daysBetween(d, date) <= 3)
    .map(([d]) => d)
    .sort();
  if (painDays.length) {
    out.push({
      key: `watch-pain-${painDays[painDays.length - 1]}`,
      severity: "high",
      title: "Une douleur a été signalée",
      detail:
        "Votre prochaine séance n’en tient pas encore compte. Je peux alléger le volume et éviter les mouvements sur la zone concernée, en gardant vos séries déjà réalisées.",
      action: { type: "fatigue" },
    });
  }

  // --- Récupération basse plusieurs jours de suite --------------------
  const scores = [];
  for (let i = 0; i < LOW_RECOVERY_DAYS; i++) {
    const d = addDays(date, -i);
    if (!p.checkIns?.[d]) continue;
    const s = recoveryScore(p, d).score;
    if (s != null) scores.push(s);
  }
  if (
    scores.length >= LOW_RECOVERY_DAYS &&
    scores.every((s) => s < LOW_RECOVERY)
  ) {
    const moyenne = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    out.push({
      key: `watch-recovery-${date}`,
      severity: "high",
      title: "Votre récupération reste basse",
      detail: `Score moyen de ${moyenne}/100 sur ${scores.length} jours. Ce n’est pas un mauvais jour isolé. Je peux réduire le volume de la prochaine séance sans toucher au programme d’origine.`,
      action: { type: "fatigue" },
    });
  }

  // --- Séances manquées en série --------------------------------------
  const planned = (p.plan?.sessions || [])
    .filter((s) => s.date < date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  let streak = 0;
  for (const s of planned) {
    if (s.status === "missed" || s.status === "planned") streak++;
    else break;
  }
  if (streak >= MISSED_STREAK) {
    out.push({
      key: `watch-missed-${date}-${streak}`,
      severity: "medium",
      title: `${streak} séances non réalisées`,
      detail:
        "Un programme qu’on ne suit pas n’est pas le bon programme. Plutôt que de rattraper, je peux le réajuster à votre rythme réel — quitte à réduire la fréquence.",
      action: { type: "replan" },
    });
  }

  // --- Inactivité prolongée -------------------------------------------
  const last = allSessions(p)
    .filter((s) => s.status === "completed" && s.date <= date)
    .map((s) => s.date)
    .sort()
    .pop();
  if (last) {
    const gap = daysBetween(last, date);
    if (gap >= INACTIVITY_DAYS) {
      out.push({
        key: `watch-gap-${last}`,
        severity: gap >= 21 ? "high" : "medium",
        title: `${gap} jours sans séance`,
        detail:
          gap >= 21
            ? "Après une coupure de cette durée, reprendre aux charges d’avant expose à la blessure. Je peux proposer une reprise progressive."
            : "Une reprise en douceur vaut mieux qu’un rattrapage. Je peux alléger la première séance.",
        action: { type: "fatigue" },
      });
    }
  }

  // --- Bilan 1RM : prévenir une semaine avant --------------------------
  // Le rappel n'arrivait qu'une fois l'échéance passée. Prévenu en
  // avance, on peut caler le test sur une séance légère plutôt que de
  // l'improviser.
  const force = reevaluationStatus(p);
  if (!force.due && force.done && force.days != null && force.days <= PREAVIS_JOURS) {
    out.push({
      key: `watch-force-avant-${force.next}`,
      severity: "low",
      title: `Réévaluation 1RM dans ${force.days} jour${force.days > 1 ? "s" : ""}`,
      detail: `Votre bilan du ${force.last} arrive à échéance le ${force.next}. Prévoyez le test sur une séance où vous êtes frais : vos charges en dépendent.`,
      action: { type: "navigate", page: "force" },
    });
  }

  // --- Photos de suivi -------------------------------------------------
  const photos = echeanceSuivi(
    (p.photos || []).map((x) => x.date),
    SUIVI_SEMAINES,
    date,
  );
  if (photos && (photos.due || photos.bientot)) {
    out.push({
      key: `watch-photos-${photos.prochaine}`,
      severity: "low",
      title: photos.due
        ? "Photos de suivi à refaire"
        : `Photos de suivi dans ${photos.jours} jour${photos.jours > 1 ? "s" : ""}`,
      detail: photos.due
        ? `Vos dernières photos datent du ${photos.derniere}. Reprenez-les dans les mêmes conditions — même lumière, même pose, même moment de la journée — pour que la comparaison ait un sens. L'équipe les analysera.`
        : `Prochain point photo le ${photos.prochaine}. Pensez aux mêmes conditions que la dernière fois : même lumière, même pose.`,
      action: { type: "navigate", page: "progress" },
    });
  }
  // Aucune photo datée : le suivi ne peut pas démarrer.
  if (!photos && (p.photos || []).length) {
    out.push({
      key: "watch-photos-sans-date",
      severity: "low",
      title: "Vos photos n’ont pas de date",
      detail:
        "Elles ont été reprises de votre fichier d’origine sans date. Renseignez-la pour que le coach puisse programmer les points de comparaison.",
      action: { type: "navigate", page: "progress" },
    });
  }

  // --- Mensurations ----------------------------------------------------
  const mesures = echeanceSuivi(
    (p.measurements || []).map((x) => x.date),
    SUIVI_SEMAINES,
    date,
  );
  if (mesures && (mesures.due || mesures.bientot)) {
    out.push({
      key: `watch-mesures-${mesures.prochaine}`,
      severity: "low",
      title: mesures.due
        ? "Mensurations à reprendre"
        : `Mensurations dans ${mesures.jours} jour${mesures.jours > 1 ? "s" : ""}`,
      detail: mesures.due
        ? `Vos dernières mensurations datent du ${mesures.derniere}. À jeun et au réveil, comme les précédentes : c'est la régularité des conditions qui rend la mesure exploitable.`
        : `Prochain relevé le ${mesures.prochaine}. À jeun et au réveil, dans les mêmes conditions que la dernière fois.`,
      action: { type: "navigate", page: "progress" },
    });
  }

  // --- Référentiel de force périmé -------------------------------------
  if (force.due) {
    out.push({
      key: `watch-force-${force.next || "initial"}`,
      severity: "low",
      title: force.done
        ? "Votre bilan de force date"
        : "Aucun bilan de force enregistré",
      detail: force.done
        ? `Vos charges sont calculées sur un bilan du ${force.last}. Refaites le test pour qu’elles restent justes.`
        : "Vos charges sont estimées d’après votre journal seulement. Un bilan 1RM les rendrait fiables.",
      action: { type: "navigate", page: "force" },
    });
  }

  const rang = { high: 0, medium: 1, low: 2 };
  return out.sort((a, b) => rang[a.severity] - rang[b.severity]);
}

/**
 * Ne conserve que les constats jamais signalés, d'après les notifications
 * déjà présentes. Évite de répéter la même alerte chaque minute.
 */
export function newFindings(p, date = today()) {
  const vues = new Set((p?.notifications || []).map((n) => n.key));
  return reviewProfile(p, date).filter((f) => !vues.has(f.key));
}
