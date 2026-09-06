/* ============================================================
   COUCHE CONVERSATIONNELLE DE JARVIS
   ------------------------------------------------------------
   Le moteur d'origine reconnaissait une phrase par expression
   régulière et renvoyait un texte figé. Résultat : hors des formules
   attendues, il répondait « je n'ai pas reconnu cette demande ».

   Cette couche ajoute ce qui manquait pour tenir une vraie
   conversation, sans jamais inventer de données :

   1. NORMALISATION et tolérance : fautes de frappe, langage parlé,
      abréviations, tutoiement/vouvoiement.
   2. SCORE D'INTENTION plutôt que première correspondance : chaque
      intention est notée, la meilleure gagne, et un score faible
      déclenche une demande de précision ciblée plutôt qu'un refus.
   3. MÉMOIRE DE DIALOGUE : le dernier exercice, la dernière séance et
      la dernière question évoqués permettent de comprendre « et pour
      celui-là ? » ou « oui, vas-y ».
   4. RÉPONSES VARIÉES : plusieurs formulations par intention, choisies
      de façon stable mais non répétitive, et enrichies des chiffres
      réels du profil.
   5. RÉPONSES COMPOSÉES : une phrase peut contenir plusieurs demandes
      (« je suis fatigué et je n'ai que 30 minutes »).

   Ce qui ne change pas : aucune donnée n'est inventée, aucune charge
   n'est déduite sans historique, et rien n'est envoyé à un service
   externe. Le raisonnement reste local et explicable.
   ============================================================ */
import { norm, num, today, addDays, numberLabel } from "./utils.js";
import { MUSCLES, EXERCISES, exerciseById } from "../data/library.js";
import { recoveryScore, weeklyReport, personalRecords } from "./fitness.js";
import { nutritionTargets } from "./nutrition.js";
import { nextSession, estimateMinutes } from "./planner.js";
import {
  reevaluationStatus,
  forceOverview,
  suggestedLoad,
  forceTestDone,
} from "./strength.js";

/* ---------------------------------------------------------------
   1. Normalisation tolérante
   --------------------------------------------------------------- */

/* Formes parlées et abréviations courantes ramenées à un vocabulaire
   canonique, pour que les règles n'aient pas à toutes les prévoir. */
const REWRITES = [
  [/\bj ?ai pas\b/g, "je n ai pas"],
  [/\bch(?:u|ui)\b/g, "je suis"],
  [/\bjsuis\b/g, "je suis"],
  [/\bjpeux\b/g, "je peux"],
  [/\bjveux\b/g, "je veux"],
  [/\bstp\b|\bs il te plait\b|\bs il vous plait\b/g, ""],
  [/\bhs\b|\bcreve[e]?\b|\bmort[e]?\b|\bnaze\b|\blessive[e]?\b/g, "fatigue"],
  [/\bkg?s\b/g, "kg"],
  [/\breps?\b|\brepet\b|\brepetition\b/g, "repetitions"],
  [/\bmn\b|\bmins\b/g, "minutes"],
  [/\bmuscu\b/g, "musculation"],
  [/\bcardio training\b/g, "cardio"],
  [/\bpecs?\b/g, "pectoraux"],
  [/\babdos?\b/g, "abdominaux"],
  [/\bfessiers?\b|\bfesses\b/g, "fessiers"],
  [/\bquadris?\b/g, "quadriceps"],
  [/\bischios?\b/g, "ischio"],
  [/\bdeltos?\b/g, "epaules"],
  [/\bsdt\b/g, "souleve de terre"],
  [/\bdc\b/g, "developpe couche"],
  [/\bohp\b|\bdm\b/g, "developpe militaire"],
  [/\bht\b/g, "hip thrust"],
  [/\brm\b|\bone rm\b/g, "1rm"],
  [/\bprog\b/g, "programme"],
  [/\bseanc\b/g, "seance"],
  [/\bdemain matin\b|\bdemain soir\b/g, "demain"],
];

/** Normalise et régularise une phrase utilisateur. */
export function prepare(text) {
  let q = norm(text);
  for (const [pattern, replacement] of REWRITES)
    q = q.replace(pattern, replacement);
  return q.replace(/\s+/g, " ").trim();
}

/* Distance de Levenshtein bornée, pour tolérer les fautes de frappe. */
function close(a, b, tolerance = 1) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > tolerance) return false;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++)
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    previous = current;
  }
  return previous[b.length] <= tolerance;
}

/** Le texte contient-il ce mot, à une faute de frappe près ? */
export function hasWord(q, word) {
  if (q.includes(word)) return true;
  if (word.includes(" ")) return false;
  return q
    .split(" ")
    .some((w) => w.length > 4 && close(w, word, w.length > 7 ? 2 : 1));
}

/* ---------------------------------------------------------------
   2. Extraction d'entités
   --------------------------------------------------------------- */

const WEEKDAYS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

/** Extrait les valeurs chiffrées et repères présents dans la phrase. */
export function entities(q, original = "") {
  const found = {};
  const minutes = q.match(/(\d+)\s*(?:minutes|min\b|h\b|heures?)/);
  if (minutes) {
    const value = Number(minutes[1]);
    found.minutes = /h\b|heure/.test(minutes[0]) ? value * 60 : value;
  }
  const sessions = q.match(/(\d+)\s*(?:seances?|fois|jours?)\s*(?:par semaine|\/semaine|semaine)?/);
  if (sessions && /semaine|fois|seance/.test(sessions[0]))
    found.frequency = Number(sessions[1]);
  const weeks = q.match(/(\d+)\s*semaines?/);
  if (weeks) found.weeks = Number(weeks[1]);
  const months = q.match(/(\d+)\s*mois/);
  if (months) found.months = Number(months[1]);
  const performance =
    q.match(/(\d+(?:[.,]\d+)?)\s*kg[\s\S]{0,20}?(\d+)\s*repetitions/) ||
    q.match(/(\d+(?:[.,]\d+)?)\s*kg\s*[x×*]?\s*(\d+)\b/) ||
    q.match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+)/);
  if (performance) {
    found.weight = num(performance[1]);
    found.reps = num(performance[2]);
  }
  const rpe = q.match(/rpe\s*(\d+(?:[.,]\d+)?)/);
  if (rpe) found.rpe = num(rpe[1]);
  const rir = q.match(/rir\s*(\d+)/);
  if (rir) found.rir = num(rir[1]);
  const sleep = q.match(/dormi\s*(\d+(?:[.,]\d+)?)/);
  if (sleep) found.sleep = num(sleep[1]);
  // Dates relatives et jours de la semaine.
  if (/apres demain/.test(q)) found.date = addDays(today(), 2);
  else if (/demain/.test(q)) found.date = addDays(today(), 1);
  else if (/hier/.test(q)) found.date = addDays(today(), -1);
  else if (/aujourd hui|ce soir|ce matin|maintenant/.test(q))
    found.date = today();
  const iso = q.match(/\d{4}-\d{2}-\d{2}/);
  if (iso) found.date = iso[0];
  if (!found.date) {
    const day = WEEKDAYS.findIndex((d) => q.includes(d));
    if (day >= 0) {
      const delta = (day - new Date().getDay() + 7) % 7;
      found.date = addDays(today(), delta || 7);
    }
  }
  // Exercice mentionné : la correspondance la plus longue gagne.
  const exercise = EXERCISES.filter((e) => q.includes(norm(e.name))).sort(
    (a, b) => b.name.length - a.name.length,
  )[0];
  if (exercise) found.exercise = exercise;
  // Groupe musculaire mentionné.
  for (const [word, key] of [
    ["pectoraux", "pec"],
    ["dos", "dos"],
    ["fessiers", "fes"],
    ["moyen fessier", "moy"],
    ["quadriceps", "qua"],
    ["ischio", "isc"],
    ["mollets", "mol"],
    ["epaules", "epL"],
    ["biceps", "bic"],
    ["triceps", "tri"],
    ["abdominaux", "abs"],
    ["gainage", "tra"],
    ["lombaires", "lom"],
  ])
    if (q.includes(word)) {
      found.muscle = key;
      break;
    }
  found.original = original;
  return found;
}

/* ---------------------------------------------------------------
   3. Tonalité et variation des réponses
   --------------------------------------------------------------- */

/* Sélecteur stable : la même question posée deux fois de suite ne
   renvoie pas exactement la même phrase, mais la variation reste
   déterministe (pas d'aléatoire non reproductible dans les tests). */
export function pick(options, seed = 0) {
  if (!options.length) return "";
  return options[Math.abs(Math.trunc(seed)) % options.length];
}

const OPENERS = {
  neutral: ["", "Entendu. ", "D’accord. ", "Très bien. "],
  warm: ["Bien vu. ", "Bonne question. ", "Je regarde. "],
  care: ["Je vous entends. ", "Message reçu. ", "On s’adapte. "],
};

/** Détecte le registre émotionnel, pour ajuster le ton sans en faire trop. */
export function tone(q) {
  if (/douleur|mal |bless|peur|inquiet|decourag|demotiv|marre|difficile|dur\b/.test(q))
    return "care";
  if (/merci|super|genial|content|fier|top|parfait|hate/.test(q)) return "warm";
  return "neutral";
}

/* ---------------------------------------------------------------
   4. Mémoire de dialogue
   --------------------------------------------------------------- */

/** Reconstitue le contexte à partir des derniers messages échangés. */
export function dialogueContext(p) {
  const messages = (p.messages || []).slice(-8);
  const context = { exercise: null, pending: null, muscle: null, turns: messages.length };
  for (const m of messages) {
    if (m.role !== "assistant") continue;
    if (m.action?.exerciseId) context.exercise = m.action.exerciseId;
    if (m.exerciseIds?.length && !context.exercise)
      context.exercise = m.exerciseIds[0];
    if (m.action && !m.applied) context.pending = m;
    else if (m.applied) context.pending = null;
  }
  const last = messages.filter((m) => m.role === "user").at(-1);
  context.lastUser = last?.text || "";
  return context;
}

/** Reconnaît une confirmation ou un refus portant sur la question précédente. */
export function agreement(q) {
  if (
    /^(oui|ouais|ok|okay|d accord|daccord|vas y|allez|go|c est parti|parfait|valide|confirme|fais le|applique|je veux bien|volontiers)\b/.test(
      q,
    ) ||
    /^(oui|ok)$/.test(q)
  )
    return "yes";
  if (
    /^(non|nan|pas maintenant|laisse|annule|surtout pas|plus tard|je prefere pas)\b/.test(
      q,
    ) ||
    /^non$/.test(q)
  )
    return "no";
  return null;
}

/* ---------------------------------------------------------------
   5. Intentions : score et réponse
   --------------------------------------------------------------- */

/* Chaque intention déclare :
   - des indices pondérés (mot ou expression -> points)
   - un test optionnel supplémentaire
   Le score total détermine l'intention retenue. */
const INTENTS = [
  {
    id: "pain",
    weight: 10,
    cues: [
      ["douleur", 6],
      ["j ai mal", 6],
      ["mal au", 5],
      ["mal a la", 5],
      ["mal aux", 5],
      ["bless", 6],
      ["vertige", 6],
      ["oppression", 6],
      ["malaise", 6],
      ["ca tire", 3],
      ["ca coince", 3],
      ["pince", 2],
    ],
  },
  {
    id: "smalltalk",
    cues: [
      ["bonjour", 4],
      ["salut", 4],
      ["bonsoir", 4],
      ["coucou", 4],
      ["ca va", 3],
      ["comment vas tu", 4],
      ["merci", 4],
      ["qui es tu", 5],
      ["que sais tu faire", 5],
      ["tu peux faire quoi", 5],
      ["aide", 3],
      ["capacite", 3],
      ["a plus", 3],
      ["bonne nuit", 3],
    ],
  },
  {
    id: "motivation",
    cues: [
      ["motiv", 5],
      ["envie de rien", 5],
      ["j ai la flemme", 5],
      ["flemme", 4],
      ["decourag", 5],
      ["marre", 4],
      ["ca sert a rien", 5],
      ["j abandonne", 5],
      ["je stagne", 4],
      ["je progresse pas", 5],
      ["deprim", 4],
    ],
  },
  {
    id: "force",
    cues: [
      ["1rm", 6],
      ["force maximale", 5],
      ["bilan de force", 6],
      ["ma force", 7],
      ["ou j en suis en force", 8],
      ["mes charges", 6],
      ["charge maximale", 5],
      ["combien je dois mettre", 6],
      ["quelle charge", 6],
      ["quel poids", 5],
      ["quelle barre", 3],
      ["record", 4],
      ["reevaluation", 5],
      ["refaire le test", 5],
    ],
  },
  {
    id: "fatigue",
    cues: [
      ["fatigue", 5],
      ["mal dormi", 5],
      ["mauvaise nuit", 5],
      ["peu dormi", 5],
      ["epuise", 5],
      ["pas en forme", 4],
      ["pas la peche", 4],
      ["courbature", 4],
      ["dormi", 3],
    ],
  },
  {
    id: "shorten",
    cues: [
      ["que 30", 3],
      ["pas le temps", 5],
      ["presse", 4],
      ["rapide", 3],
      ["ecourter", 5],
      ["raccourcir", 5],
      ["plus court", 5],
      ["minutes", 3],
    ],
    test: (q, e) => (e.minutes ? 4 : 0),
  },
  {
    id: "plan",
    cues: [
      ["programme", 4],
      ["planifie", 5],
      ["prepare", 3],
      ["organise", 4],
      ["cree", 3],
      ["par semaine", 4],
      ["cycle", 3],
      ["planning", 3],
    ],
    test: (q, e) => (e.frequency && (e.weeks || e.months) ? 5 : 0),
  },
  {
    id: "log",
    cues: [
      ["j ai fait", 4],
      ["j ai soulev", 5],
      ["enregistre", 4],
      ["note", 3],
      ["ajoute", 3],
      ["serie", 3],
    ],
    test: (q, e) => (e.weight != null && e.reps != null ? 6 : 0),
  },
  {
    id: "replace",
    cues: [
      ["remplac", 6],
      ["alternative", 5],
      ["autre exercice", 5],
      ["a la place", 5],
      ["occupee", 4],
      ["occupe", 3],
      ["indisponible", 4],
      ["pas de machine", 4],
      ["j aime pas", 4],
      ["je refuse", 5],
      ["substitu", 5],
    ],
  },
  {
    id: "move",
    cues: [
      ["decale", 5],
      ["deplace", 5],
      ["reprogramme", 5],
      ["repousse", 4],
      ["changer de jour", 5],
      ["reporter", 4],
    ],
  },
  {
    id: "missed",
    cues: [
      ["j ai manque", 5],
      ["j ai rate", 5],
      ["pas pu", 4],
      ["pas fait", 4],
      ["saute", 3],
      ["loupe", 4],
    ],
  },
  {
    id: "focus",
    cues: [
      ["priorite", 5],
      ["prioriser", 5],
      ["davantage", 4],
      ["plus de", 3],
      ["accent", 4],
      ["insister", 4],
      ["travailler plus", 5],
      ["developper", 3],
    ],
  },
  {
    id: "search",
    cues: [
      ["exercice pour", 5],
      ["quel exercice", 5],
      ["montre moi", 4],
      ["recherche", 4],
      ["trouve", 3],
      ["liste", 3],
      ["comment faire", 4],
      ["technique", 3],
    ],
  },
  {
    id: "report",
    cues: [
      ["bilan", 4],
      ["rapport", 4],
      ["analyse", 5],
      ["resume", 4],
      ["equilibre", 4],
      ["ma semaine", 5],
      ["mon mois", 4],
      ["ou j en suis", 5],
      ["progression", 4],
    ],
  },
  {
    id: "nutrition",
    cues: [
      ["calorie", 5],
      ["macro", 5],
      ["repas", 4],
      ["nutrition", 5],
      ["manger", 4],
      ["proteine", 5],
      ["glucide", 5],
      ["lipide", 5],
      ["regime", 4],
      ["deficit", 4],
      ["surplus", 4],
    ],
  },
  {
    id: "weight",
    cues: [
      ["mon poids", 5],
      ["je pese", 5],
      ["pesee", 5],
      ["balance", 4],
      ["maigrir", 4],
      ["perdre du poids", 5],
      ["prendre du poids", 5],
    ],
  },
  {
    id: "recovery",
    cues: [
      ["recuperation", 5],
      ["sommeil", 5],
      ["energie", 4],
      ["repos", 4],
      ["etirement", 4],
      ["mobilite", 4],
      ["souplesse", 4],
      ["respiration", 4],
    ],
  },
  {
    id: "session",
    cues: [
      ["ma seance", 5],
      ["seance du jour", 5],
      ["aujourd hui", 4],
      ["au programme", 5],
      ["je fais quoi", 5],
      ["on fait quoi", 5],
      ["prochaine seance", 5],
      ["planning", 3],
    ],
  },
];

/** Note toutes les intentions et retourne le classement. */
export function rank(q, e) {
  const scores = [];
  for (const intent of INTENTS) {
    let score = 0;
    for (const [cue, points] of intent.cues)
      if (cue.includes(" ") ? q.includes(cue) : hasWord(q, cue)) score += points;
    if (intent.test) score += intent.test(q, e);
    if (score > 0) scores.push({ id: intent.id, score });
  }
  return scores.sort((a, b) => b.score - a.score);
}

/* ---------------------------------------------------------------
   6. Réponses conversationnelles
   --------------------------------------------------------------- */

/** Petites phrases de contexte réel, ajoutées pour ancrer la réponse. */
function grounding(p) {
  const sessions = (p.sessions || []).filter((s) => s.status !== "missed").length;
  const recovery = recoveryScore(p);
  const status = reevaluationStatus(p);
  return { sessions, recovery, status };
}

/**
 * Réponses conversationnelles pour les intentions que le moteur de règles
 * d'origine ne traitait pas (bavardage, motivation, force, questions
 * ouvertes). Retourne null si l'intention doit rester gérée par le
 * moteur de règles historique.
 */
export function converse(p, q, e, intent, context) {
  const seed = (p.messages || []).length;
  const opener = pick(OPENERS[tone(q)], seed);
  const g = grounding(p);

  if (intent === "smalltalk") {
    if (/merci/.test(q))
      return {
        text: pick(
          [
            "Avec plaisir. Dites-moi quand vous voulez ajuster quelque chose.",
            "Je vous en prie. Je reste là pour la suite de votre programme.",
            "C’est mon rôle. Bonne séance, et écoutez vos sensations.",
          ],
          seed,
        ),
      };
    if (/qui es tu|que sais tu faire|tu peux faire quoi|capacite/.test(q))
      return {
        text:
          "Je suis JARVIS, votre coach embarqué. Tout tourne sur votre téléphone : aucune donnée ne part vers un service externe.\n\n" +
          "Concrètement, je sais :\n" +
          "• construire ou remanier votre programme (fréquence, durée, phases) ;\n" +
          "• calculer la charge de chaque exercice à partir de votre bilan 1RM et de vos séries réelles ;\n" +
          "• adapter une séance à votre fatigue, votre temps disponible ou du matériel manquant ;\n" +
          "• remplacer un mouvement, en respectant vos refus et votre matériel ;\n" +
          "• enregistrer une performance et détecter un record ;\n" +
          "• analyser votre semaine, votre récupération, votre nutrition et votre équilibre musculaire ;\n" +
          "• vous guider à la voix pendant la séance : tempo, séries, repos, changements d’exercice.\n\n" +
          "Parlez-moi normalement. Si je ne suis pas sûr, je demande une précision plutôt que d’inventer.",
      };
    if (/ca va|comment vas tu/.test(q))
      return {
        text: `Opérationnel, merci. ${
          g.sessions
            ? `Vous en êtes à ${g.sessions} séance${g.sessions > 1 ? "s" : ""} enregistrée${g.sessions > 1 ? "s" : ""}.`
            : "Votre historique est encore vide : la première séance posera les repères."
        } Et vous, comment vous sentez-vous aujourd’hui ?`,
      };
    if (/a plus|bonne nuit|au revoir|bye/.test(q))
      return {
        text: pick(
          [
            "À bientôt. Pensez à noter votre ressenti après la séance, cela affine mes décisions.",
            "Bonne fin de journée. Le sommeil compte autant que l’entraînement.",
            "À très vite. Je garde votre contexte en mémoire.",
          ],
          seed,
        ),
      };
    const hour = new Date().getHours();
    const moment =
      hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
    const next = nextSession(p);
    return {
      text:
        `${moment} ${p.user?.name || ""}. `.replace(/\s+/g, " ") +
        (next
          ? `Au programme quand vous voulez : ${next.name}${next.date ? `, prévue le ${next.date}` : ""}. Dites-moi si vous souhaitez la lancer, l’écourter ou l’adapter.`
          : "Aucune séance planifiée pour l’instant. Je peux vous en construire une : dites-moi combien de séances par semaine et sur combien de semaines."),
    };
  }

  if (intent === "motivation") {
    const report = weeklyReport(p);
    const facts = [];
    if (g.sessions)
      facts.push(
        `${g.sessions} séance${g.sessions > 1 ? "s" : ""} déjà enregistrée${g.sessions > 1 ? "s" : ""}`,
      );
    if (report?.current?.tonnage)
      facts.push(`${numberLabel(report.current.tonnage)} kg déplacés cette semaine`);
    const records = personalRecords(p).filter((r) => r.best1RM != null);
    if (records.length)
      facts.push(`${records.length} référence${records.length > 1 ? "s" : ""} de force suivie${records.length > 1 ? "s" : ""}`);
    return {
      text:
        opener +
        (facts.length
          ? `Regardons les faits plutôt que la sensation du moment : ${facts.join(", ")}. Ce n’est pas rien, et ce n’est pas de la flatterie — ce sont vos données.\n\n`
          : "Le début est toujours la partie la plus ingrate : il n’y a encore rien à comparer.\n\n") +
        pick(
          [
            "Une séance allégée vaut infiniment mieux qu’une séance annulée. Voulez-vous que je réduise la prochaine à l’essentiel ? Je garde les mouvements prioritaires et j’enlève les accessoires.",
            "La régularité bat l’intensité sur douze mois. Je peux passer la prochaine séance en version courte, ou décaler d’un jour si le corps demande du repos.",
            "La stagnation apparente vient souvent de la récupération, pas de l’effort. Voulez-vous que j’analyse votre semaine pour voir ce qui bloque réellement ?",
          ],
          seed,
        ),
      navigate: /analyse|stagne|progresse pas/.test(q) ? "progress" : null,
      tab: /analyse|stagne|progresse pas/.test(q) ? "reports" : null,
    };
  }

  if (intent === "force") {
    const status = g.status;
    const target = e.exercise || (context.exercise ? exerciseById(context.exercise) : null);
    // Question ciblée : « quelle charge pour le développé couché ? »
    if (target) {
      const suggestion = suggestedLoad(p, target, target.repScheme);
      if (suggestion?.load != null)
        return {
          text:
            `${opener}Pour ${target.name}, je propose ${suggestion.load} kg${suggestion.perHand ? " par haltère" : ""} sur ${target.repScheme} répétitions.\n\n` +
            `Le calcul : ${suggestion.percent} % d’un 1RM effectif de ${suggestion.effective} kg, ` +
            (suggestion.fromJournal
              ? "recalculé à partir de vos séries réellement enregistrées."
              : "issu de votre bilan 1RM déclaré.") +
            (suggestion.lastWeight
              ? ` Votre dernière charge sur ce mouvement était ${suggestion.lastWeight} kg × ${suggestion.lastReps} répétitions.`
              : "") +
            "\n\nAjustez à votre ressenti : visez 1 à 2 répétitions en réserve.",
          exerciseIds: [target.id],
        };
      return {
        text:
          `${opener}Je ne peux pas encore chiffrer la charge de ${target.name}.\n\n` +
          (forceTestDone(p)
            ? "Votre bilan 1RM ne couvre pas le mouvement de base dont dépend cet exercice. Complétez-le dans Bilan 1RM, ou enregistrez une première série : je prendrai le relais dès la suivante."
            : "Votre bilan 1RM n’est pas encore renseigné. Cinq minutes suffisent : ensuite je calcule seul la charge de chaque exercice du programme."),
        navigate: "force",
        exerciseIds: [target.id],
      };
    }
    // Question générale sur la force.
    if (!status.done)
      return {
        text:
          `${opener}Votre bilan de force n’est pas encore réalisé, donc je ne peux pas personnaliser vos charges.\n\n` +
          "C’est la porte d’entrée du programme : vous saisissez votre charge maximale sur quelques mouvements de base (ou un 3RM/5RM, j’estime le reste), et j’en déduis automatiquement la charge de tous les autres exercices, phase par phase.\n\n" +
          "Comptez cinq à huit minutes. Voulez-vous l’ouvrir ?",
        navigate: "force",
      };
    const overview = forceOverview(p).filter((o) => o.effective != null);
    const improved = overview.filter((o) => o.improved);
    return {
      text:
        `${opener}Voici votre référentiel de force actuel :\n\n` +
        overview
          .slice(0, 6)
          .map(
            (o) =>
              `• ${o.name} : ${o.effective} kg${o.improved ? " (recalculé depuis vos séances, au-dessus du déclaré)" : ""} — séance type ${o.working} kg`,
          )
          .join("\n") +
        `\n\n${
          improved.length
            ? `${improved.length} mouvement${improved.length > 1 ? "s ont" : " a"} dépassé votre déclaration : vos charges suivent automatiquement.`
            : "Dès que vos séances dépasseront ces valeurs, le 1RM automatique prendra le relais."
        }` +
        (status.due
          ? `\n\n${status.detail}`
          : `\n\n${status.detail}`),
      navigate: "force",
    };
  }

  return null;
}

/** Demande de précision ciblée, quand l'intention est probable mais floue. */
export function clarify(p, q, e, best) {
  const suggestions = {
    shorten: "Combien de minutes avez-vous devant vous ?",
    plan: "Combien de séances par semaine, et sur combien de semaines ?",
    replace: "Quel exercice souhaitez-vous remplacer ?",
    move: "Vers quel jour voulez-vous la déplacer ?",
    focus: "Quel groupe musculaire souhaitez-vous prioriser ?",
    log: "Quel exercice, quelle charge et combien de répétitions ?",
    search: "Quel muscle ou quel matériel visez-vous ?",
  };
  if (best && suggestions[best.id])
    return {
      text: `Je crois comprendre votre demande, mais il me manque un élément. ${suggestions[best.id]}`,
    };
  return null;
}

/** Réponse de repli : elle propose des pistes réelles plutôt qu'un refus sec. */
export function fallback(p, q) {
  const next = nextSession(p);
  const status = reevaluationStatus(p);
  const ideas = [];
  if (!status.done)
    ideas.push("« Je veux faire mon bilan 1RM » — pour personnaliser vos charges");
  if (next) ideas.push("« Je n’ai que 30 minutes » — pour écourter la prochaine séance");
  ideas.push("« Quelle charge pour le développé couché ? »");
  ideas.push("« Je suis fatigué, allège ma séance »");
  ideas.push("« Analyse ma semaine »");
  ideas.push("« Remplace le hip thrust, la barre est prise »");
  return {
    text:
      "Je n’ai pas saisi votre demande avec assez de certitude, et je préfère le dire plutôt que d’inventer une réponse.\n\n" +
      "Reformulez avec vos mots — je comprends le langage courant — ou essayez :\n" +
      ideas
        .slice(0, 4)
        .map((i) => `• ${i}`)
        .join("\n"),
  };
}
