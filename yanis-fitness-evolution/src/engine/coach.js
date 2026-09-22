// Coach conversationnel JARVIS — moteur de la 1.5.0, porté et relisible :
// normalisation avec coquilles courantes, extraction d'entités riches, scoring
// d'intentions pondéré, réponses contextuelles (petit train-train, motivation,
// force), cycle « proposition → confirmation », puis chaîne de règles explicites
// et repli honnête (« je n'ai pas saisi ») — jamais d'invention.
import {
  norm,
  today,
  num,
  uid,
  addDays,
  numberLabel,
  monday,
  parseDate,
} from "./utils.js";
import {
  EXERCISES,
  exerciseById,
  searchExercises,
  alternatives,
  findExercise,
  MUSCLES,
  GOALS,
} from "../data/library.js";
import {
  nextSession,
  shortenSession,
  generatePlan,
  rescheduleMissed,
  adaptRecovery,
  estimateMinutes,
  makeTarget,
  moveSession,
} from "./planner.js";
import {
  recoveryScore,
  weeklyReport,
  personalRecords,
  stats,
} from "./fitness.js";
import {
  loadForExercise,
  hasForceTests,
  forceRevalState,
  forceTestRows,
  FORCE_TESTS,
} from "./force.js";
import { nutritionTargets } from "./nutrition.js";
import { archivePlan } from "./plan-memory.js";
import { validDate } from "./validation.js";
import { pauseTimer, advanceTimer } from "./timer.js";

// ————— Normalisation —————
const TYPO_FIXES = [
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
export function normalizeUtterance(text) {
  let q = norm(text);
  for (const [rx, to] of TYPO_FIXES) q = q.replace(rx, to);
  return q.replace(/\s+/g, " ").trim();
}
// Distance d'édition bornée : tolérance aux fautes de frappe sur les mots
// isolés (les expressions multi-mots restent en correspondance exacte).
export function editDistanceWithin(a, b, max) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++)
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    prev = row;
  }
  return prev[b.length] <= max;
}
export function mentionsWord(sentence, word) {
  return (
    sentence.includes(word) ||
    (word.includes(" ")
      ? false
      : sentence
          .split(" ")
          .some(
            (token) =>
              token.length > 4 &&
              editDistanceWithin(token, word, token.length > 7 ? 2 : 1),
          ))
  );
}
const STOPWORDS = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "mon", "ma", "mes",
  "ce", "cet", "cette", "au", "aux", "par", "pour", "avec", "sans",
  "exercice", "mouvement", "seance", "series", "serie", "reps",
]);
const FORCE_EXERCISE_NAMES = new Set(
  FORCE_TESTS.map((t) => norm(t.exerciseName || t.name)),
);
// Repli « mots-clés » : si aucun nom d'exercice n'apparaît textuellement,
// on interroge le moteur de recherche et on garde le meilleur candidat, en
// privilégiant les exercices du bilan de force puis le nom le plus court.
export function fuzzyExerciseFromWords(q) {
  const words = q
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
  if (!words.length) return null;
  const counts = new Map();
  for (const word of words)
    for (const ex of searchExercises(word)) {
      const entry = counts.get(ex.id) || { ex, mots: 0 };
      entry.mots += 1;
      counts.set(ex.id, entry);
    }
  return counts.size
    ? [...counts.values()].sort((a, b) => {
        if (b.mots !== a.mots) return b.mots - a.mots;
        const an = norm(a.ex.name),
          bn = norm(b.ex.name),
          ar = FORCE_EXERCISE_NAMES.has(an) ? 0 : 1,
          br = FORCE_EXERCISE_NAMES.has(bn) ? 0 : 1;
        return ar !== br ? ar - br : an.length - bn.length;
      })[0].ex
    : null;
}
const WEEKDAYS = [
  "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi",
];
// Extraction d'entités : durée, fréquence, dates, performance, RPE/RIR,
// sommeil, exercice et muscle visés.
export function extractEntities(q, original = "") {
  const out = {};
  const minutes = q.match(/(\d+)\s*(?:minutes|min\b|h\b|heures?)/);
  if (minutes) {
    const n = Number(minutes[1]);
    out.minutes = /h\b|heure/.test(minutes[0]) ? n * 60 : n;
  }
  const freq = q.match(
    /(\d+)\s*(?:seances?|fois|jours?)\s*(?:par semaine|\/semaine|semaine)?/,
  );
  if (freq && /semaine|fois|seance/.test(freq[0])) out.frequency = Number(freq[1]);
  const weeks = q.match(/(\d+)\s*semaines?/);
  if (weeks) out.weeks = Number(weeks[1]);
  const months = q.match(/(\d+)\s*mois/);
  if (months) out.months = Number(months[1]);
  const perf =
    q.match(/(\d+(?:[.,]\d+)?)\s*kg[\s\S]{0,20}?(\d+)\s*repetitions/) ||
    q.match(/(\d+(?:[.,]\d+)?)\s*kg\s*[x×*]?\s*(\d+)\b/) ||
    q.match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+)/);
  if (perf) {
    out.weight = num(perf[1]);
    out.reps = num(perf[2]);
  }
  const rpe = q.match(/rpe\s*(\d+(?:[.,]\d+)?)/);
  if (rpe) out.rpe = num(rpe[1]);
  const rir = q.match(/rir\s*(\d+)/);
  if (rir) out.rir = num(rir[1]);
  const sleep = q.match(/dormi\s*(\d+(?:[.,]\d+)?)/);
  if (sleep) out.sleep = num(sleep[1]);
  if (/apres demain/.test(q)) out.date = addDays(today(), 2);
  else if (/demain/.test(q)) out.date = addDays(today(), 1);
  else if (/hier/.test(q)) out.date = addDays(today(), -1);
  else if (/aujourd hui|ce soir|ce matin|maintenant/.test(q)) out.date = today();
  const iso = q.match(/\d{4}-\d{2}-\d{2}/);
  if (iso) out.date = iso[0];
  if (!out.date) {
    const day = WEEKDAYS.findIndex((d) => q.includes(d));
    if (day >= 0) {
      const delta = (day - new Date().getDay() + 7) % 7;
      out.date = addDays(today(), delta || 7);
    }
  }
  const named =
    EXERCISES.filter((e) => q.includes(norm(e.name))).sort(
      (a, b) => b.name.length - a.name.length,
    )[0] || fuzzyExerciseFromWords(q);
  if (named) out.exercise = named;
  for (const [word, muscle] of [
    ["pectoraux", "pec"], ["dos", "dos"], ["fessiers", "fes"],
    ["moyen fessier", "moy"], ["quadriceps", "qua"], ["ischio", "isc"],
    ["mollets", "mol"], ["epaules", "epL"], ["biceps", "bic"],
    ["triceps", "tri"], ["abdominaux", "abs"], ["gainage", "tra"],
    ["lombaires", "lom"],
  ])
    if (q.includes(word)) {
      out.muscle = muscle;
      break;
    }
  out.original = original;
  return out;
}
const pick = (list, offset = 0) =>
  list.length ? list[Math.abs(Math.trunc(offset)) % list.length] : "";
const TONE_PREFIX = {
  neutral: ["", "Entendu. ", "D’accord. ", "Très bien. "],
  warm: ["Bien vu. ", "Bonne question. ", "Je regarde. "],
  care: ["Je vous entends. ", "Message reçu. ", "On s’adapte. "],
};
export function toneFor(q) {
  return /douleur|mal |bless|peur|inquiet|decourag|demotiv|marre|difficile|dur\b/.test(q)
    ? "care"
    : /merci|super|genial|content|fier|top|parfait|hate/.test(q)
      ? "warm"
      : "neutral";
}
// État de conversation : dernière exercice évoqué et proposition en attente.
export function conversationState(p) {
  const messages = (p.messages || []).slice(-8);
  const state = { exercise: null, pending: null, muscle: null, turns: messages.length };
  for (const m of messages)
    if (m.role === "assistant") {
      if (m.action?.exerciseId) state.exercise = m.action.exerciseId;
      if (m.exerciseIds?.length && !state.exercise) state.exercise = m.exerciseIds[0];
      if (m.action && !m.applied) state.pending = m;
      else if (m.applied) state.pending = null;
    }
  const lastUser = messages.filter((m) => m.role === "user").at(-1);
  state.lastUser = lastUser?.text || "";
  return state;
}
export function confirmationIntent(q) {
  return /^(oui|ouais|ok|okay|d accord|daccord|vas y|allez|go|c est parti|parfait|valide|confirme|fais le|applique|je veux bien|volontiers)\b/.test(q) ||
    /^(oui|ok)$/.test(q)
    ? "yes"
    : /^(non|nan|pas maintenant|laisse|annule|surtout pas|plus tard|je prefere pas)\b/.test(q) ||
        /^non$/.test(q)
      ? "no"
      : null;
}
// Intentes pondérées : chaque indice rapproché ajoute son poids ; le score
// total départage. Aucun seuil magique en deçà duquel on agirait quand même.
export const INTENTS = [
  { id: "pain", weight: 10, cues: [["douleur", 6], ["j ai mal", 6], ["mal au", 5], ["mal a la", 5], ["mal aux", 5], ["bless", 6], ["vertige", 6], ["oppression", 6], ["malaise", 6], ["ca tire", 3], ["ca coince", 3], ["pince", 2]] },
  { id: "smalltalk", cues: [["bonjour", 4], ["salut", 4], ["bonsoir", 4], ["coucou", 4], ["ca va", 3], ["comment vas tu", 4], ["merci", 4], ["qui es tu", 5], ["que sais tu faire", 5], ["tu peux faire quoi", 5], ["aide", 3], ["capacite", 3], ["a plus", 3], ["bonne nuit", 3]] },
  { id: "motivation", cues: [["motiv", 5], ["envie de rien", 5], ["j ai la flemme", 5], ["flemme", 4], ["decourag", 5], ["marre", 4], ["ca sert a rien", 5], ["j abandonne", 5], ["je stagne", 4], ["je progresse pas", 5], ["deprim", 4]] },
  { id: "force", cues: [["1rm", 6], ["force maximale", 5], ["bilan de force", 6], ["ma force", 7], ["ou j en suis en force", 8], ["mes charges", 6], ["charge maximale", 5], ["combien je dois mettre", 6], ["je mets combien", 6], ["mets combien", 5], ["je charge combien", 6], ["combien de kilos", 5], ["combien au", 4], ["combien sur", 4], ["quelle charge", 6], ["quel poids", 5], ["quelle barre", 3], ["record", 4], ["reevaluation", 5], ["refaire le test", 5]] },
  { id: "fatigue", cues: [["fatigue", 5], ["mal dormi", 5], ["mauvaise nuit", 5], ["peu dormi", 5], ["epuise", 5], ["pas en forme", 4], ["pas la peche", 4], ["courbature", 4], ["dormi", 3]] },
  { id: "shorten", cues: [["que 30", 3], ["pas le temps", 5], ["presse", 4], ["rapide", 3], ["ecourter", 5], ["raccourcir", 5], ["plus court", 5], ["minutes", 3]], test: (q, e) => (e.minutes ? 4 : 0) },
  { id: "plan", cues: [["programme", 4], ["planifie", 5], ["prepare", 3], ["organise", 4], ["cree", 3], ["par semaine", 4], ["cycle", 3], ["planning", 3]], test: (q, e) => (e.frequency && (e.weeks || e.months) ? 5 : 0) },
  { id: "log", cues: [["j ai fait", 4], ["j ai soulev", 5], ["enregistre", 4], ["note", 3], ["ajoute", 3], ["serie", 3]], test: (q, e) => (e.weight != null && e.reps != null ? 6 : 0) },
  { id: "replace", cues: [["remplac", 6], ["alternative", 5], ["autre exercice", 5], ["a la place", 5], ["occupee", 4], ["occupe", 3], ["indisponible", 4], ["pas de machine", 4], ["j aime pas", 4], ["je refuse", 5], ["substitu", 5]] },
  { id: "move", cues: [["decale", 5], ["deplace", 5], ["reprogramme", 5], ["repousse", 4], ["changer de jour", 5], ["reporter", 4]] },
  { id: "missed", cues: [["j ai manque", 5], ["j ai rate", 5], ["pas pu", 4], ["pas fait", 4], ["saute", 3], ["loupe", 4]] },
  { id: "focus", cues: [["priorite", 5], ["prioriser", 5], ["davantage", 4], ["plus de", 3], ["accent", 4], ["insister", 4], ["travailler plus", 5], ["developper", 3]] },
  { id: "search", cues: [["exercice pour", 5], ["quel exercice", 5], ["montre moi", 4], ["recherche", 4], ["trouve", 3], ["liste", 3], ["comment faire", 4], ["technique", 3]] },
  { id: "report", cues: [["bilan", 4], ["rapport", 4], ["analyse", 5], ["resume", 4], ["equilibre", 4], ["ma semaine", 5], ["mon mois", 4], ["ou j en suis", 5], ["progression", 4]] },
  { id: "nutrition", cues: [["calorie", 5], ["macro", 5], ["repas", 4], ["nutrition", 5], ["manger", 4], ["proteine", 5], ["glucide", 5], ["lipide", 5], ["regime", 4], ["deficit", 4], ["surplus", 4]] },
  { id: "weight", cues: [["mon poids", 5], ["je pese", 5], ["pesee", 5], ["balance", 4], ["maigrir", 4], ["perdre du poids", 5], ["prendre du poids", 5]] },
  { id: "recovery", cues: [["recuperation", 5], ["sommeil", 5], ["energie", 4], ["repos", 4], ["etirement", 4], ["mobilite", 4], ["souplesse", 4], ["respiration", 4]] },
  { id: "session", cues: [["ma seance", 5], ["seance du jour", 5], ["aujourd hui", 4], ["au programme", 5], ["je fais quoi", 5], ["on fait quoi", 5], ["prochaine seance", 5], ["planning", 3]] },
];
export function scoreIntents(q, entities) {
  const scored = [];
  for (const intent of INTENTS) {
    let score = 0;
    for (const [cue, weight] of intent.cues)
      (cue.includes(" ") ? q.includes(cue) : mentionsWord(q, cue)) &&
        (score += weight);
    if (intent.test) score += intent.test(q, entities);
    if (score > 0) scored.push({ id: intent.id, score });
  }
  return scored.sort((a, b) => b.score - a.score);
}
function contextSnapshot(p) {
  const sessions = (p.sessions || []).filter((s) => s.status !== "missed").length;
  return { sessions, recovery: recoveryScore(p), status: forceRevalState(p) };
}
// Réponses « humaines » : salutations, motivation factuelle (chiffres réels),
// état de la force. Jamais de conseil médical, jamais de chiffre inventé.
export function specialResponses(p, q, entities, intentId, convo) {
  const turns = (p.messages || []).length,
    prefix = pick(TONE_PREFIX[toneFor(q)], turns),
    ctx = contextSnapshot(p);
  if (intentId === "smalltalk") {
    if (/merci/.test(q))
      return {
        text: pick(
          [
            "Avec plaisir. Dites-moi quand vous voulez ajuster quelque chose.",
            "Je vous en prie. Je reste là pour la suite de votre programme.",
            "C’est mon rôle. Bonne séance, et écoutez vos sensations.",
          ],
          turns,
        ),
      };
    if (/qui es tu|que sais tu faire|tu peux faire quoi|capacite/.test(q))
      return {
        text: `Je suis JARVIS, votre coach embarqué. Tout tourne sur votre téléphone : aucune donnée ne part vers un service externe.

Concrètement, je sais :
• construire ou remanier votre programme (fréquence, durée, phases) ;
• calculer la charge de chaque exercice à partir de votre bilan 1RM et de vos séries réelles ;
• adapter une séance à votre fatigue, votre temps disponible ou du matériel manquant ;
• remplacer un mouvement, en respectant vos refus et votre matériel ;
• enregistrer une performance et détecter un record ;
• analyser votre semaine, votre récupération, votre nutrition et votre équilibre musculaire ;
• vous guider à la voix pendant la séance : tempo, séries, repos, changements d’exercice.

Parlez-moi normalement. Si je ne suis pas sûr, je demande une précision plutôt que d’inventer.`,
      };
    if (/ca va|comment vas tu/.test(q))
      return {
        text: `Opérationnel, merci. ${ctx.sessions ? `Vous en êtes à ${ctx.sessions} séance${ctx.sessions > 1 ? "s" : ""} enregistrée${ctx.sessions > 1 ? "s" : ""}.` : "Votre historique est encore vide : la première séance posera les repères."} Et vous, comment vous sentez-vous aujourd’hui ?`,
      };
    if (/a plus|bonne nuit|au revoir|bye/.test(q))
      return {
        text: pick(
          [
            "À bientôt. Pensez à noter votre ressenti après la séance, cela affine mes décisions.",
            "Bonne fin de journée. Le sommeil compte autant que l’entraînement.",
            "À très vite. Je garde votre contexte en mémoire.",
          ],
          turns,
        ),
      };
    const hour = new Date().getHours(),
      hello = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir",
      upcoming = nextSession(p);
    return {
      text:
        `${hello} ${p.user?.name || ""}. `.replace(/\s+/g, " ") +
        (upcoming
          ? `Au programme quand vous voulez : ${upcoming.name}${upcoming.date ? `, prévue le ${upcoming.date}` : ""}. Dites-moi si vous souhaitez la lancer, l’écourter ou l’adapter.`
          : "Aucune séance planifiée pour l’instant. Je peux vous en construire une : dites-moi combien de séances par semaine et sur combien de semaines."),
    };
  }
  if (intentId === "motivation") {
    const week = weeklyReport(p),
      facts = [];
    if (ctx.sessions)
      facts.push(
        `${ctx.sessions} séance${ctx.sessions > 1 ? "s" : ""} déjà enregistrée${ctx.sessions > 1 ? "s" : ""}`,
      );
    if (week?.current?.tonnage)
      facts.push(`${numberLabel(week.current.tonnage)} kg déplacés cette semaine`);
    const records = personalRecords(p).filter((r) => r.best1RM != null);
    if (records.length)
      facts.push(
        `${records.length} référence${records.length > 1 ? "s" : ""} de force suivie${records.length > 1 ? "s" : ""}`,
      );
    return {
      text:
        prefix +
        (facts.length
          ? `Regardons les faits plutôt que la sensation du moment : ${facts.join(", ")}. Ce n’est pas rien, et ce n’est pas de la flatterie — ce sont vos données.\n\n`
          : `Le début est toujours la partie la plus ingrate : il n’y a encore rien à comparer.\n\n`) +
        pick(
          [
            "Une séance allégée vaut infiniment mieux qu’une séance annulée. Voulez-vous que je réduise la prochaine à l’essentiel ? Je garde les mouvements prioritaires et j’enlève les accessoires.",
            "La régularité bat l’intensité sur douze mois. Je peux passer la prochaine séance en version courte, ou décaler d’un jour si le corps demande du repos.",
            "La stagnation apparente vient souvent de la récupération, pas de l’effort. Voulez-vous que j’analyse votre semaine pour voir ce qui bloque réellement ?",
          ],
          turns,
        ),
      navigate: /analyse|stagne|progresse pas/.test(q) ? "progress" : null,
      tab: /analyse|stagne|progresse pas/.test(q) ? "reports" : null,
    };
  }
  if (intentId === "force") {
    const status = ctx.status,
      exercise =
        entities.exercise ||
        (convo.exercise ? exerciseById(convo.exercise) : null);
    if (exercise) {
      const load = loadForExercise(p, exercise, exercise.repScheme);
      return load?.load != null
        ? {
            text:
              `${prefix}Pour ${exercise.name}, je propose ${load.load} kg${load.perHand ? " par haltère" : ""} sur ${exercise.repScheme} répétitions.\n\nLe calcul : ${load.percent} % d’un 1RM effectif de ${load.effective} kg, ` +
              (load.fromJournal
                ? "recalculé à partir de vos séries réellement enregistrées."
                : "issu de votre bilan 1RM déclaré.") +
              (load.lastWeight
                ? ` Votre dernière charge sur ce mouvement était ${load.lastWeight} kg × ${load.lastReps} répétitions.`
                : "") +
              `\n\nAjustez à votre ressenti : visez 1 à 2 répétitions en réserve.`,
            exerciseIds: [exercise.id],
          }
        : {
            text:
              `${prefix}Je ne peux pas encore chiffrer la charge de ${exercise.name}.\n\n` +
              (hasForceTests(p)
                ? "Votre bilan 1RM ne couvre pas le mouvement de base dont dépend cet exercice. Complétez-le dans Bilan 1RM, ou enregistrez une première série : je prendrai le relais dès la suivante."
                : "Votre bilan 1RM n’est pas encore renseigné. Cinq minutes suffisent : ensuite je calcule seul la charge de chaque exercice du programme."),
            navigate: "force",
            exerciseIds: [exercise.id],
          };
    }
    if (!status.done)
      return {
        text: `${prefix}Votre bilan de force n’est pas encore réalisé, donc je ne peux pas personnaliser vos charges.\n\nC’est la porte d’entrée du programme : vous saisissez votre charge maximale sur quelques mouvements de base (ou un 3RM/5RM, j’estime le reste), et j’en déduis automatiquement la charge de tous les autres exercices, phase par phase.\n\nComptez cinq à huit minutes. Voulez-vous l’ouvrir ?`,
        navigate: "force",
      };
    const rows = forceTestRows(p).filter((r) => r.effective != null),
      improved = rows.filter((r) => r.improved);
    return {
      text:
        `${prefix}Voici votre référentiel de force actuel :\n\n` +
        rows
          .slice(0, 6)
          .map(
            (r) =>
              `• ${r.name} : ${r.effective} kg${r.improved ? " (recalculé depuis vos séances, au-dessus du déclaré)" : ""} — séance type ${r.working} kg`,
          )
          .join("\n") +
        `\n\n${improved.length ? `${improved.length} mouvement${improved.length > 1 ? "s ont" : " a"} dépassé votre déclaration : vos charges suivent automatiquement.` : "Dès que vos séances dépasseront ces valeurs, le 1RM automatique prendra le relais."}` +
        `\n\n${status.detail}`,
      navigate: "force",
    };
  }
  return null;
}
// Il manque une information précise : on demande, on ne devine pas.
function missingSlotQuestion(p, q, entities, intent) {
  const questions = {
    shorten: "Combien de minutes avez-vous devant vous ?",
    plan: "Combien de séances par semaine, et sur combien de semaines ?",
    replace: "Quel exercice souhaitez-vous remplacer ?",
    move: "Vers quel jour voulez-vous la déplacer ?",
    focus: "Quel groupe musculaire souhaitez-vous prioriser ?",
    log: "Quel exercice, quelle charge et combien de répétitions ?",
    search: "Quel muscle ou quel matériel visez-vous ?",
  };
  return intent && questions[intent.id]
    ? {
        text: `Je crois comprendre votre demande, mais il me manque un élément. ${questions[intent.id]}`,
      }
    : null;
}
// Dernier recours honnête : propositions concrètes, aucune réponse fabriquée.
export function fallbackAnswer(p, q) {
  const upcoming = nextSession(p),
    status = forceRevalState(p),
    ideas = [];
  if (!status.done)
    ideas.push("« Je veux faire mon bilan 1RM » — pour personnaliser vos charges");
  if (upcoming)
    ideas.push("« Je n’ai que 30 minutes » — pour écourter la prochaine séance");
  ideas.push("« Quelle charge pour le développé couché ? »");
  ideas.push("« Je suis fatigué, allège ma séance »");
  ideas.push("« Analyse ma semaine »");
  ideas.push("« Remplace le hip thrust, la barre est prise »");
  return {
    text:
      `Je n’ai pas saisi votre demande avec assez de certitude, et je préfère le dire plutôt que d’inventer une réponse.\n\nReformulez avec vos mots — je comprends le langage courant — ou essayez :\n` +
      ideas.slice(0, 4).map((i) => `• ${i}`).join("\n"),
  };
}
const withoutNegatedSymptoms = (q) =>
  q.replace(
    /(?:pas (?:de |du tout de |des )?|aucune? |sans |plus de )(?:douleurs?|mal(?:aise)?|vertiges?|blessure|fatiguee?|fatigue)(?:\s+(?:au|aux|a la|dans le)\s+[a-z]+)?/g,
    " ",
  );

export function interpretCommand(p, text) {
  const q = normalizeUtterance(text),
    entities = extractEntities(q, text),
    convo = conversationState(p),
    yesNo = confirmationIntent(q);
  if (yesNo && convo.pending)
    return yesNo === "yes"
      ? {
          text: "C’est noté, j’applique la proposition précédente.",
          action: convo.pending.action,
          choices: convo.pending.choices,
          confirms: convo.pending.id,
        }
      : {
          text: "Très bien, je n’applique rien. Dites-moi ce que vous préférez faire à la place.",
        };
  if (yesNo === "yes")
    return {
      text: "Je n’ai pas de proposition en attente à confirmer. Reformulez votre demande et je vous répondrai.",
    };
  if (/bilan 1rm|refaire le test|reevaluation|recalcul(?:e|er) mes charges/.test(q)) {
    const status = forceRevalState(p);
    return { text: `${status.label}. ${status.detail}`, navigate: "force" };
  }
  if (/equipe|mes retours|retours.*bilan|conseils.*experts/.test(q))
    return {
      text: `Votre équipe virtuelle et ${(p.teamReviews || []).length} bilan(s) enregistré(s) sont accessibles dans Mon équipe. Les retours du fichier importé restent lisibles tels qu’ils ont été sauvegardés.`,
      navigate: "team",
      tab: "archive",
    };
  const active = p.workout,
    upcoming = nextSession(p),
    session = active || upcoming,
    currentRow = session?.exercises?.[active?.currentIndex || 0],
    currentExercise = currentRow ? exerciseById(currentRow.exerciseId) : null,
    known =
      EXERCISES.filter((e) => q.includes(norm(e.name))).sort(
        (a, b) => b.name.length - a.name.length,
      )[0] || fuzzyExerciseFromWords(q);
  if (!q) return { text: "Dites-moi ce que vous souhaitez adapter." };
  const topIntent = scoreIntents(q, entities)[0];
  if (topIntent && topIntent.id !== "pain") {
    const special = specialResponses(p, q, entities, topIntent.id, convo);
    if (special) return special;
  }
  if (
    /douleur|j ai mal|mal au|mal a la|mal aux|bless|vertige|oppression|malaise|essoufflement inhabituel/.test(
      withoutNegatedSymptoms(q).replace(/mal (?:dormi|recupere)/g, ""),
    )
  )
    return {
      text: /poitrine|oppression|essoufflement inhabituel|malaise|vertige/.test(q)
        ? "Arrêtez l’effort. En cas de douleur thoracique, malaise ou difficulté respiratoire inhabituelle, demandez une aide médicale urgente (112 ou 15 en France). Je ne peux pas établir de diagnostic."
        : "Arrêtez l’exercice douloureux. Ne testez pas une autre charge pour « vérifier ». Reposez la zone et consultez un professionnel compétent si la douleur est importante, persiste ou revient. Une alternative ne sera choisie qu’en l’absence de douleur.",
      action: { type: "pain", exerciseId: currentExercise?.id },
      automatic: true,
    };
  const performance =
    entities.weight != null && entities.reps != null
      ? [null, String(entities.weight), String(entities.reps)]
      : null;
  if (performance) {
    const rpeMatch = q.match(/rpe\s*(\d+(?:[.,]\d+)?)/);
    return {
      text:
        known || active
          ? `Je peux enregistrer ${performance[1]} kg × ${performance[2]} répétitions pour ${(known || currentExercise).name}. Confirmez l’exercice, l’unité et le RPE ; une seule série sera ajoutée.`
          : "Quel exercice avez-vous réalisé ? Sans ce contexte, je ne peux pas attribuer la performance ni calculer un record fiable.",
      action: {
        type: "log",
        exerciseId: known?.id || (active ? currentExercise?.id : null),
        weight: num(performance[1]),
        reps: num(performance[2]),
        rpe: rpeMatch ? num(rpeMatch[1]) : null,
      },
    };
  }
  const frequency = q.match(/(\d+)\s*seances?/),
    weeks = q.match(/(\d+)\s*semaines?/),
    months = q.match(/(\d+)\s*mois/);
  if (
    (/programme|planifie|prepare|cree|organise/.test(q) &&
      /semaine|mois|programme/.test(q)) ||
    (frequency && /par semaine|semaines|mois/.test(q))
  ) {
    const f = Number(frequency?.[1] || p.user.frequency),
      w = Number(
        weeks?.[1] ||
          (months ? months[1] * 4 : /ma semaine|la semaine|cette semaine/.test(q) ? 1 : 12),
      );
    if (f < 1 || f > 6 || w < 1 || w > 52)
      return {
        text: "Je peux construire 1 à 6 séances par semaine, sur 1 à 52 semaines. Au moins un jour de repos reste prévu.",
      };
    return {
      text: `Je propose ${f} séances par semaine pendant ${w} semaine${w > 1 ? "s" : ""}, en reprenant la base active ${p.plan?.source === "legacy" ? "du programme source de " + p.user.name : "JARVIS adaptative"}. Les phases et prescriptions de cette base sont conservées. Les charges resteront liées à vos performances réelles. Les séances passées seront conservées.`,
      action: { type: "plan", frequency: f, weeks: w },
    };
  }
  if (
    /fatigue|mal recupere|mal dormi|mauvaise nuit|peu dormi|dormi\s*\d/.test(
      withoutNegatedSymptoms(q),
    )
  ) {
    const sleep = q.match(/dormi\s*(\d+(?:[.,]\d+)?)\s*(?:h|heure)/);
    return {
      text: "Je peux enregistrer votre fatigue et alléger la séance à venir. Je conserverai les mouvements prioritaires et les séries déjà réalisées. Pas de rattrapage de volume aujourd’hui.",
      action: { type: "fatigue", sleep: sleep ? num(sleep[1]) : null },
    };
  }
  const duration = q.match(/(\d+)\s*(?:minutes?|min)\b/);
  if (duration && /temps|que |plus que|rapide|seance|minutes|min/.test(q)) {
    if (!session)
      return {
        text: "Préparez d’abord une séance dans Programme pour que je puisse l’adapter.",
      };
    const minutes = Number(duration[1]);
    if (minutes < 10)
      return {
        text: "Avec moins de 10 minutes, privilégiez une courte mobilité sans douleur plutôt qu’une séance lourde précipitée.",
        navigate: "recovery",
      };
    const result = shortenSession(session, minutes);
    return {
      text: `Je propose une version ${minutes} minutes : ${result.removedSets} série${result.removedSets > 1 ? "s" : ""} accessoire${result.removedSets > 1 ? "s" : ""} en moins. ${result.reason}${result.estimatedRemaining > minutes ? " Le minimum restant dépasse encore votre créneau : terminez partiellement plutôt que de raccourcir dangereusement les repos." : ""}`,
      action: { type: "shorten", minutes, sessionId: session.id },
    };
  }
  if (/decale|deplace|reprogramme|report(?:e|er).*demain/.test(q)) {
    if (!upcoming)
      return {
        text: "Aucune prochaine séance à déplacer. Ouvrez le calendrier pour choisir une séance.",
      };
    let date = q.match(/\d{4}-\d{2}-\d{2}/)?.[0];
    if (/demain/.test(q)) date = addDays(today(), 1);
    if (/apres demain/.test(q)) date = addDays(today(), 2);
    const day = WEEKDAYS.findIndex((d) => q.includes(d));
    if (!date && day >= 0) {
      const delta = (day - parseDate(today()).getDay() + 7) % 7;
      date = addDays(today(), delta || 7);
    }
    if (!validDate(date))
      return {
        text: "Précisez la nouvelle date : « Décale ma séance à jeudi » ou une date au format AAAA-MM-JJ.",
        navigate: "program",
      };
    return {
      text: `Je peux déplacer « ${upcoming.name} » au ${date}. Le changement sera refusé si un entraînement occupe déjà ce jour.`,
      action: { type: "move", sessionId: upcoming.id, date },
    };
  }
  if (
    /manque|rate|pas pu|pas fait|reporte/.test(q) &&
    /seance|hier|entrain/.test(q)
  ) {
    const date = /hier/.test(q) ? addDays(today(), -1) : today();
    const missed = p.plan?.sessions
      ?.filter((s) => s.status === "planned" && s.date <= date)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!missed)
      return {
        text: "Je ne trouve pas de séance passée non réalisée dans votre calendrier. Sélectionnez la séance concernée dans Programme pour la reporter.",
      };
    return {
      text: `Je peux marquer « ${missed.name} » du ${missed.date} comme manquée, puis la placer sur un jour libre avec récupération pour les mêmes muscles. L’historique sera conservé.`,
      action: { type: "missed", sessionId: missed.id },
    };
  }
  if (/remplac|occupee?|indisponible|alternative|refuse|n aime pas/.test(q)) {
    const ex = known || currentExercise;
    if (!ex) return { text: "Précisez le nom de l’exercice à remplacer." };
    const choices = alternatives(ex, p);
    return {
      text: choices.length
        ? `Voici des alternatives pour ${ex.name}, ciblant ${MUSCLES[ex.muscle].toLowerCase()}. Je privilégie le même mouvement et votre matériel disponible. Les charges ne sont pas transférées entre exercices.`
        : "Aucune alternative compatible avec votre matériel déclaré. Modifiez votre matériel dans Profil ou laissez cet exercice de côté.",
      choices: choices.map((e) => e.id),
      action: {
        type: "replace",
        exerciseId: ex.id,
        sessionId: session?.id,
        refuse: /refuse|n aime pas/.test(q),
      },
    };
  }
  if (/davantage|plus de|priorite|accent|prioriser/.test(q)) {
    const group = [
      ["pector", "pec"], ["dos", "dos"], ["fess", "fes"], ["jambe", "qua"],
      ["epaul", "epL"], ["bicep", "bic"], ["abdo", "abs"],
    ].find(([w]) => q.includes(w));
    if (group)
      return {
        text: `Je peux donner la priorité au groupe ${MUSCLES[group[1]].toLowerCase()} : ajout limité à deux séries sur une séance compatible de la prochaine semaine, sans empiler des jours lourds.`,
        action: { type: "focus", muscle: group[1] },
      };
  }
  if (/exercice|recherche|haut des pec|dos maison/.test(q)) {
    const found = searchExercises(text).slice(0, 6);
    return {
      text: found.length
        ? "Voici les mouvements qui correspondent à votre recherche. Ouvrez une fiche pour la technique, les muscles et les alternatives."
        : "Aucun mouvement trouvé avec ces critères. Essayez « dos maison » ou « haut des pectoraux ».",
      exerciseIds: found.map((e) => e.id),
    };
  }
  if (/bilan|rapport|analyse|resume|equilibre/.test(q)) {
    const r = weeklyReport(p);
    return {
      text: `Votre semaine : ${r.current.sessions} séance${r.current.sessions > 1 ? "s" : ""} terminée${r.current.sessions > 1 ? "s" : ""}, ${numberLabel(r.current.tonnage)} kg de tonnage enregistré. Récupération : ${r.current.recovery == null ? "donnée insuffisante" : r.current.recovery + "/100"}.\n\n${r.recommendations.join("\n")}`,
      navigate: "progress",
      tab: "reports",
    };
  }
  const second = scoreIntents(q, entities)[0];
  if (/calorie|macro|repas|nutrition/.test(q) || second?.id === "nutrition") {
    const n = nutritionTargets(p);
    return {
      text: n
        ? `Repères estimés : ${n.calories} kcal, ${n.protein} g de protéines, ${n.carbs} g de glucides et ${n.fat} g de lipides. Calcul Mifflin–St Jeor × activité déclarée ; ce ne sont pas des mesures ni une prescription médicale.`
        : "Donnée insuffisante pour personnaliser la nutrition. Renseignez âge adulte, taille, poids et sexe utilisé pour le calcul dans Profil. Les repas et le journal restent disponibles.",
      navigate: "nutrition",
    };
  }
  if (/poids/.test(q)) {
    const m = [...p.measurements]
      .filter((m) => m.weight != null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .at(-1);
    return {
      text: m
        ? `Dernier poids enregistré : ${m.weight} kg, le ${m.date}.`
        : p.user.weight
          ? `Poids du profil source : ${p.user.weight} kg. Ce n’est pas une nouvelle pesée ; ajoutez une mesure datée pour suivre l’évolution.`
          : "Donnée insuffisante : aucune pesée enregistrée.",
      navigate: "progress",
      tab: "body",
    };
  }
  if (/record|1rm|force/.test(q)) {
    const rs = personalRecords(p).filter((r) => r.best1RM != null);
    return {
      text: rs.length
        ? rs
            .slice(0, 4)
            .map((r) => `${r.name} : 1RM estimé ${r.best1RM} kg (${r.unit}).`)
            .join("\n")
        : "Aucune performance exploitable pour estimer un 1RM. Enregistrez une charge et des répétitions, sur un exercice précis.",
      navigate: "progress",
      tab: "records",
    };
  }
  if (/recuperation|sommeil|energie/.test(q)) {
    const r = recoveryScore(p);
    return {
      text:
        r.score == null
          ? "Récupération : donnée insuffisante. Un bilan sommeil et ressenti permettra d’adapter le prochain entraînement."
          : `Récupération estimée : ${r.score}/100, données renseignées à ${r.coverage} %. ${r.reasons.join(" ")}`,
      navigate: "recovery",
    };
  }
  if (/seance|aujourd hui|planning/.test(q))
    return {
      text: session
        ? `Votre ${active ? "séance en cours" : "prochaine séance"} : ${session.name}, ${session.estimatedMinutes || estimateMinutes(session)} minutes estimées. ${session.exercises.length} mouvements. Je peux l’écourter, remplacer un exercice ou tenir compte de votre fatigue.`
        : "Aucun programme actif. Demandez-moi « 4 séances par semaine pendant 12 semaines ».",
      navigate: "training",
    };
  if (/aide|qui es|bonjour|salut|merci|capacite/.test(q))
    return {
      text: "Je suis JARVIS, votre moteur de coaching adaptatif local. Je peux programmer une semaine ou un cycle, réduire une séance, remplacer un mouvement, enregistrer une performance et analyser vos données. Mes règles sont explicables ; je ne suis pas un modèle conversationnel externe connecté.",
    };
  const missing = topIntent && topIntent.score >= 4 ? missingSlotQuestion(p, q, entities, topIntent) : null;
  return missing || fallbackAnswer(p, q);
}

export function applyCoachAction(p, action, extra = {}) {
  let q = structuredClone(p);
  let detail = "";
  switch (action.type) {
    case "plan":
      archivePlan(q);
      q.plan = generatePlan(q, {
        frequency: action.frequency,
        weeks: action.weeks,
        startDate: today(),
        source: q.plan?.source || "legacy",
      });
      q.user.frequency = action.frequency;
      detail = `Programme créé : ${action.frequency} séances × ${action.weeks} semaines.`;
      break;
    case "replan": {
      const wanted = q.user.frequency || 4,
        next = Math.max(2, wanted - 1);
      archivePlan(q);
      q.plan = generatePlan(q, {
        frequency: next,
        weeks: q.plan?.weeks || 12,
        startDate: today(),
        source: q.plan?.source || "legacy",
      });
      q.user.frequency = next;
      detail =
        next === wanted
          ? `Programme régénéré à partir d'aujourd'hui, ${next} séances par semaine.`
          : `Programme réajusté : ${next} séances par semaine au lieu de ${wanted}. Les séances passées restent dans votre historique.`;
      break;
    }
    case "shorten": {
      const s =
        q.workout?.id === action.sessionId
          ? q.workout
          : q.plan?.sessions.find((s) => s.id === action.sessionId);
      if (!s) throw new Error("La séance a changé. Refaites la demande.");
      const r = shortenSession(s, action.minutes);
      if (q.workout?.id === s.id) q.workout = r.session;
      else
        q.plan.sessions = q.plan.sessions.map((x) =>
          x.id === s.id ? r.session : x,
        );
      detail = `Séance adaptée à ${action.minutes} min : ${r.removedSets} séries en moins.`;
      break;
    }
    case "fatigue":
      q.checkIns[today()] = {
        ...q.checkIns[today()],
        fatigue: 4,
        ...(action.sleep != null
          ? { sleep: Math.max(0, Math.min(24, action.sleep)) }
          : {}),
      };
      {
        const r = adaptRecovery(q);
        q = r.profile;
        const s = q.workout || nextSession(q);
        if (!r.changed && s && s.recoveryAdapted !== today()) {
          s.exercises = s.exercises.map((e) => ({
            ...e,
            targetSets: Math.max(
              e.sets?.filter((s) => s.completed).length || 0,
              Math.ceil(e.targetSets * 0.8),
            ),
          }));
          s.recoveryAdapted = today();
          s.userAdapted = true;
          s.estimatedMinutes = estimateMinutes(s);
        }
      }
      detail =
        "Fatigue enregistrée ; volume adapté au maximum une fois par jour.";
      break;
    case "move":
      q.plan = moveSession(q, action.sessionId, action.date);
      detail = `Séance déplacée au ${action.date}.`;
      break;
    case "missed": {
      const r = rescheduleMissed(q, action.sessionId);
      q.plan = r.plan;
      detail = `Séance manquée conservée et reportée au ${r.date}.`;
      break;
    }
    case "replace": {
      const to = exerciseById(extra.exerciseId);
      const s =
        q.workout?.id === action.sessionId
          ? q.workout
          : q.plan?.sessions.find((s) => s.id === action.sessionId);
      if (!s || !to || to.id === action.exerciseId)
        throw new Error("Sélectionnez une alternative.");
      const index = s.exercises.findIndex(
        (e) => e.exerciseId === action.exerciseId,
      );
      if (index < 0) throw new Error("Cet exercice n’est plus dans la séance.");
      s.userAdapted = true;
      const old = s.exercises[index];
      const done = old.sets.filter((x) => x.completed).length;
      const replacement = {
        ...makeTarget(to, q),
        targetSets: Math.max(1, old.targetSets - done),
        priority: old.priority,
      };
      if (done) {
        old.targetSets = done;
        s.exercises.splice(index + 1, 0, replacement);
        s.currentIndex = index + 1;
      } else s.exercises[index] = replacement;
      if (action.refuse && !q.preferences.refused.includes(action.exerciseId))
        q.preferences.refused.push(action.exerciseId);
      s.estimatedMinutes = estimateMinutes(s);
      detail = `${to.name} remplace l’exercice indisponible. Charge à calibrer séparément.`;
      break;
    }
    case "focus": {
      const key = monday() + "-" + action.muscle;
      q.focusChanges = q.focusChanges || {};
      if (q.focusChanges[key])
        throw new Error(
          "Cette priorité a déjà été renforcée cette semaine. Le volume reste plafonné.",
        );
      q.focusChanges[key] = true;
      if (!q.preferences.priorities.includes(action.muscle))
        q.preferences.priorities.push(action.muscle);
      const upcoming =
        q.plan?.sessions
          .filter((s) => s.status === "planned" && s.date >= today())
          .slice(0, q.user.frequency || 4) || [];
      let found = false;
      for (const s of upcoming) {
        const e = s.exercises.find(
          (e) => exerciseById(e.exerciseId).muscle === action.muscle,
        );
        if (e) {
          const delta = Math.min(2, 6 - e.targetSets);
          e.targetSets += delta;
          s.userAdapted = true;
          e.priority = 4;
          s.estimatedMinutes = estimateMinutes(s);
          found = true;
          break;
        }
      }
      detail = found
        ? `Priorité ${MUSCLES[action.muscle]} : jusqu’à deux séries ajoutées sur la prochaine semaine.`
        : `Priorité ${MUSCLES[action.muscle]} mémorisée. Ajoutez une séance compatible dans le programme.`;
      break;
    }
    case "pain":
      if (q.workout) {
        q.workout.safetyStop = true;
        q.workout.blockedExerciseId = action.exerciseId;
      }
      if (q.timer && !q.timer.done) {
        const t = advanceTimer(q.timer);
        q.timer = { ...(t.paused ? t : pauseTimer(t)), safetyStopped: true };
      }
      q.checkIns[today()] = { ...q.checkIns[today()], painReported: true };
      detail = "Arrêt de sécurité : exercice concerné suspendu.";
      break;
    default:
      throw new Error("Action non prise en charge.");
  }
  q.adaptations.unshift({
    id: uid(),
    date: today(),
    at: Date.now(),
    label: "Adaptation JARVIS",
    detail,
    action: action.type,
  });
  return { profile: q, detail };
}

// ————— Veille du coach (carte « Le coach a noté » du tableau de bord) —————
export const FINDING_GAP_DAYS = 8,
  FINDING_MISSED_STREAK = 3,
  LOW_RECOVERY = 55,
  RECOVERY_WATCH_DAYS = 3,
  FINDING_SOON_DAYS = 7,
  PHOTO_WEEKS = 4;
const daysBetween = (a, b) =>
  Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
// Rythm de suivi (photos/mensurations) : dernière date + intervalle, et
// proximité de l’échéance.
export function followUpSchedule(dates, weeks = PHOTO_WEEKS, on = today()) {
  const list = (dates || []).filter(Boolean).sort();
  if (!list.length) return null;
  const first = list[0],
    last = list[list.length - 1],
    period = weeks * 7;
  let next = first,
    guard = 0;
  while (daysBetween(next, on) >= 0 && guard++ < 500) next = addDays(next, period);
  const left = daysBetween(on, next);
  return {
    origine: first,
    derniere: last,
    prochaine: next,
    jours: left,
    due: daysBetween(last, next) <= 0 || left <= 0,
    bientot: left > 0 && left <= FINDING_SOON_DAYS,
  };
}
export function coachFindings(p, on = today()) {
  if (!p) return [];
  const findings = [];
  const painDates = Object.entries(p.checkIns || {})
    .filter(
      ([date, c]) => c?.painReported && daysBetween(date, on) <= 3,
    )
    .map(([date]) => date)
    .sort();
  if (painDates.length)
    findings.push({
      key: `watch-pain-${painDates[painDates.length - 1]}`,
      severity: "high",
      title: "Une douleur a été signalée",
      detail:
        "Votre prochaine séance n’en tient pas encore compte. Je peux alléger le volume et éviter les mouvements sur la zone concernée, en gardant vos séries déjà réalisées.",
      action: { type: "fatigue" },
    });
  const scores = [];
  for (let i = 0; i < RECOVERY_WATCH_DAYS; i++) {
    const date = addDays(on, -i);
    if (!p.checkIns?.[date]) continue;
    const s = recoveryScore(p, date).score;
    if (s != null) scores.push(s);
  }
  if (scores.length >= RECOVERY_WATCH_DAYS && scores.every((s) => s < LOW_RECOVERY)) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    findings.push({
      key: `watch-recovery-${on}`,
      severity: "high",
      title: "Votre récupération reste basse",
      detail: `Score moyen de ${avg}/100 sur ${scores.length} jours. Ce n’est pas un mauvais jour isolé. Je peux réduire le volume de la prochaine séance sans toucher au programme d’origine.`,
      action: { type: "fatigue" },
    });
  }
  const past = (p.plan?.sessions || [])
    .filter((s) => s.date < on)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  let missedStreak = 0;
  for (const s of past)
    if (s.status === "missed" || s.status === "planned") missedStreak++;
    else break;
  if (missedStreak >= FINDING_MISSED_STREAK)
    findings.push({
      key: `watch-missed-${on}-${missedStreak}`,
      severity: "medium",
      title: `${missedStreak} séances non réalisées`,
      detail:
        "Un programme qu’on ne suit pas n’est pas le bon programme. Plutôt que de rattraper, je peux le réajuster à votre rythme réel — quitte à réduire la fréquence.",
      action: { type: "replan" },
    });
  const lastSessionDate = [...(p.sessions || [])]
    .filter((s) => s.status === "completed" && s.date <= on)
    .map((s) => s.date)
    .sort()
    .pop();
  if (lastSessionDate) {
    const gap = daysBetween(lastSessionDate, on);
    if (gap >= FINDING_GAP_DAYS)
      findings.push({
        key: `watch-gap-${lastSessionDate}`,
        severity: gap >= 21 ? "high" : "medium",
        title: `${gap} jours sans séance`,
        detail:
          gap >= 21
            ? "Après une coupure de cette durée, reprendre aux charges d’avant expose à la blessure. Je peux proposer une reprise progressive."
            : "Une reprise en douceur vaut mieux qu’un rattrapage. Je peux alléger la première séance.",
        action: { type: "fatigue" },
      });
  }
  const force = forceRevalState(p);
  if (!force.due && force.done && force.days != null && force.days <= FINDING_SOON_DAYS)
    findings.push({
      key: `watch-force-avant-${force.next}`,
      severity: "low",
      title: `Réévaluation 1RM dans ${force.days} jour${force.days > 1 ? "s" : ""}`,
      detail: `Votre bilan du ${force.last} arrive à échéance le ${force.next}. Prévoyez le test sur une séance où vous êtes frais : vos charges en dépendent.`,
      action: { type: "navigate", page: "force" },
    });
  const photos = followUpSchedule(
    (p.photos || []).map((x) => x.date),
    PHOTO_WEEKS,
    on,
  );
  if (photos && (photos.due || photos.bientot))
    findings.push({
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
  if (!photos && (p.photos || []).length)
    findings.push({
      key: "watch-photos-sans-date",
      severity: "low",
      title: "Vos photos n’ont pas de date",
      detail:
        "Elles ont été reprises de votre fichier d’origine sans date. Renseignez-la pour que le coach puisse programmer les points de comparaison.",
      action: { type: "navigate", page: "progress" },
    });
  const mesures = followUpSchedule(
    (p.measurements || []).map((x) => x.date),
    PHOTO_WEEKS,
    on,
  );
  if (mesures && (mesures.due || mesures.bientot))
    findings.push({
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
  if (force.due)
    findings.push({
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
  const order = { high: 0, medium: 1, low: 2 };
  return findings.sort((a, b) => order[a.severity] - order[b.severity]);
}
