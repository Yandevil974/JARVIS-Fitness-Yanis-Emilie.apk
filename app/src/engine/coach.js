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
import { nutritionTargets } from "./nutrition.js";
import { archivePlan } from "./plan-memory.js";
import { validDate } from "./validation.js";
import { pauseTimer, advanceTimer } from "./timer.js";
import {
  prepare,
  entities,
  rank,
  converse,
  clarify,
  fallback,
  dialogueContext,
  agreement,
} from "./conversation.js";
import { reevaluationStatus, BASE_MOVEMENTS } from "./strength.js";
const withoutNegatedSymptoms = (q) =>
  q.replace(
    /(?:pas (?:de |du tout de |vraiment de |des )?|aucune? |sans |plus de )(?:douleurs?|mal(?:aise)?|vertiges?|blessure|fatiguee?|fatigue)(?:\s+(?:au|aux|a la|dans le)\s+[a-z]+)?/g,
    " ",
  );

/* Retrouve l'exercice évoqué par un nom partiel (« squat », « couché »).
   Les mots trop courts ou trop communs sont écartés : ils
   ramèneraient n'importe quoi. */
const MOTS_VIDES = new Set([
  "le", "la", "les", "un", "une", "des", "du", "de", "mon", "ma", "mes",
  "ce", "cet", "cette", "au", "aux", "par", "pour", "avec", "sans",
  "exercice", "mouvement", "seance", "series", "serie", "reps",
]);
function namedExercise(q) {
  const mots = q
    .split(/[^a-z0-9]+/)
    .filter((m) => m.length >= 4 && !MOTS_VIDES.has(m));
  for (const mot of mots.sort((a, b) => b.length - a.length)) {
    const trouves = searchExercises(mot);
    if (!trouves.length) continue;
    // « squat » doit donner le squat, pas le « Bulgarian split squat » :
    // à défaut de départage, searchExercises rend l'ordre alphabétique.
    // On préfère le nom le plus court, donc le mouvement le plus
    // générique, et à égalité celui qui commence par le mot cherché.
    // Un mouvement du bilan 1RM l'emporte : « squat » désigne le back
    // squat de son référentiel, pas le « Squat cycliste ».
    const bases = new Set(
      BASE_MOVEMENTS.map((b) => norm(b.exerciseName || b.name)),
    );
    return trouves.sort((a, b) => {
      const na = norm(a.name), nb = norm(b.name);
      const ba = bases.has(na) ? 0 : 1, bb = bases.has(nb) ? 0 : 1;
      const da = na.startsWith(mot) ? 0 : 1, db = nb.startsWith(mot) ? 0 : 1;
      return ba - bb || da - db || na.length - nb.length;
    })[0];
  }
  return null;
}

export function interpretCommand(p, text) {
  // Normalisation tolérante : langage parlé, abréviations, fautes de frappe.
  // `q` reste la forme régularisée utilisée par toutes les règles ci-dessous.
  const q = prepare(text);
  const found = entities(q, text);
  const context = dialogueContext(p);

  // --- Reprise de la conversation en cours ---------------------------
  // « oui », « vas-y », « non » se rapportent à la dernière proposition.
  const answer = agreement(q);
  if (answer && context.pending) {
    if (answer === "yes")
      return {
        text: "C’est noté, j’applique la proposition précédente.",
        action: context.pending.action,
        choices: context.pending.choices,
        confirms: context.pending.id,
      };
    return {
      text: "Très bien, je n’applique rien. Dites-moi ce que vous préférez faire à la place.",
    };
  }
  if (answer === "yes")
    return {
      text: "Je n’ai pas de proposition en attente à confirmer. Reformulez votre demande et je vous répondrai.",
    };

  // --- Rappel du bilan 1RM -------------------------------------------
  // Il prime sur le reste seulement s'il est explicitement demandé.
  if (/bilan 1rm|refaire le test|reevaluation|recalcul(?:e|er) mes charges/.test(q)) {
    const status = reevaluationStatus(p);
    return {
      text: `${status.label}. ${status.detail}`,
      navigate: "force",
    };
  }

  if (/equipe|mes retours|retours.*bilan|conseils.*experts/.test(q))
    return {
      text: `Votre équipe virtuelle et ${(p.teamReviews || []).length} bilan(s) enregistré(s) sont accessibles dans Mon équipe. Les retours du fichier importé restent lisibles tels qu’ils ont été sauvegardés.`,
      navigate: "team",
      tab: "archive",
    };
  const active = p.workout;
  const upcoming = nextSession(p);
  const session = active || upcoming;
  const current = session?.exercises?.[active?.currentIndex || 0];
  const exercise = current ? exerciseById(current.exerciseId) : null;
  // Nom d'exercice cité dans la phrase. On cherche d'abord un nom
  // complet, puis — à défaut — par mots-clés : « remplace le squat »
  // ne contient le nom entier d'aucun exercice, et sans ce repli la
  // demande retombait sur l'exercice en cours, donnant une réponse
  // portant sur un tout autre mouvement.
  const known =
    EXERCISES.filter((e) => q.includes(norm(e.name))).sort(
      (a, b) => b.name.length - a.name.length,
    )[0] || namedExercise(q);
  if (!q) return { text: "Dites-moi ce que vous souhaitez adapter." };

  // --- Classement des intentions --------------------------------------
  // On note toutes les intentions plutôt que de prendre la première
  // expression régulière qui correspond : une phrase composée
  // (« je suis fatigué et je n'ai que 30 minutes ») est ainsi arbitrée
  // correctement, et une demande floue déclenche une question ciblée.
  const scores = rank(q, found);
  const best = scores[0];
  if (best && best.id !== "pain") {
    // La performance chiffrée reste traitée par la règle historique,
    // qui sait construire l'action d'enregistrement.
    const spoken = converse(p, q, found, best.id, context);
    if (spoken) return spoken;
  }
  if (
    /douleur|j ai mal|mal au|mal a la|mal aux|bless|vertige|oppression|malaise|essoufflement inhabituel/.test(
      withoutNegatedSymptoms(q).replace(/mal (?:dormi|recupere)/g, ""),
    )
  )
    return {
      text: /poitrine|oppression|essoufflement inhabituel|malaise|vertige/.test(
        q,
      )
        ? "Arrêtez l’effort. En cas de douleur thoracique, malaise ou difficulté respiratoire inhabituelle, demandez une aide médicale urgente (112 ou 15 en France). Je ne peux pas établir de diagnostic."
        : "Arrêtez l’exercice douloureux. Ne testez pas une autre charge pour « vérifier ». Reposez la zone et consultez un professionnel compétent si la douleur est importante, persiste ou revient. Une alternative ne sera choisie qu’en l’absence de douleur.",
      action: { type: "pain", exerciseId: exercise?.id },
      automatic: true,
    };
  // La charge et les répétitions sont extraites par la couche
  // conversationnelle, qui tolère « 100kg x 5 », « 100 kg 5 reps »,
  // « 100x5 » et les virgules décimales.
  const performance =
    found.weight != null && found.reps != null
      ? [null, String(found.weight), String(found.reps)]
      : null;
  if (performance) {
    const rpeMatch = q.match(/rpe\s*(\d+(?:[.,]\d+)?)/);
    return {
      text:
        known || active
          ? `Je peux enregistrer ${performance[1]} kg × ${performance[2]} répétitions pour ${(known || exercise).name}. Confirmez l’exercice, l’unité et le RPE ; une seule série sera ajoutée.`
          : "Quel exercice avez-vous réalisé ? Sans ce contexte, je ne peux pas attribuer la performance ni calculer un record fiable.",
      action: {
        type: "log",
        exerciseId: known?.id || (active ? exercise?.id : null),
        weight: num(performance[1]),
        reps: num(performance[2]),
        rpe: rpeMatch ? num(rpeMatch[1]) : null,
      },
    };
  }
  const frequency = q.match(/(\d+)\s*seances?/);
  const weeks = q.match(/(\d+)\s*semaines?/);
  const months = q.match(/(\d+)\s*mois/);
  if (
    (/programme|planifie|prepare|cree|organise/.test(q) &&
      /semaine|mois|programme/.test(q)) ||
    (frequency && /par semaine|semaines|mois/.test(q))
  ) {
    const f = Number(frequency?.[1] || p.user.frequency),
      w = Number(
        weeks?.[1] ||
          (months
            ? months[1] * 4
            : /ma semaine|la semaine|cette semaine/.test(q)
              ? 1
              : 12),
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
    const weekdays = [
      "dimanche",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
    ];
    const day = weekdays.findIndex((d) => q.includes(d));
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
      .filter((s) => s.status === "planned" && s.date <= date)
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
    const ex = known || exercise;
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
      ["pector", "pec"],
      ["dos", "dos"],
      ["fess", "fes"],
      ["jambe", "qua"],
      ["epaul", "epL"],
      ["bicep", "bic"],
      ["abdo", "abs"],
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
  // Le classement d'intentions de conversation.js connaît bien plus de
  // formulations que ces expressions écrites à la main : « protéines »,
  // « glucides », « déficit »… Sans le consulter, une demande pourtant
  // bien comprise tombait dans la réponse « je n'ai pas saisi ».
  const intent = rank(q, found)[0];
  if (/calorie|macro|repas|nutrition/.test(q) || intent?.id === "nutrition") {
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
  // --- Derniers recours -----------------------------------------------
  // Intention probable mais incomplète : on demande l'élément manquant.
  const missing = best && best.score >= 4 ? clarify(p, q, found, best) : null;
  if (missing) return missing;
  // Sinon : on le dit franchement, en proposant des pistes réelles.
  return fallback(p, q);
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
    // Remise à plat du programme quand il n'est plus suivi. On ne
    // rattrape pas les séances perdues : on réduit la fréquence d'un cran
    // pour retomber sur un rythme réellement tenu.
    case "replan": {
      const actuelle = q.user.frequency || 4;
      const cible = Math.max(2, actuelle - 1);
      archivePlan(q);
      q.plan = generatePlan(q, {
        frequency: cible,
        weeks: q.plan?.weeks || 12,
        startDate: today(),
        source: q.plan?.source || "legacy",
      });
      q.user.frequency = cible;
      detail =
        cible === actuelle
          ? `Programme régénéré à partir d'aujourd'hui, ${cible} séances par semaine.`
          : `Programme réajusté : ${cible} séances par semaine au lieu de ${actuelle}. Les séances passées restent dans votre historique.`;
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
