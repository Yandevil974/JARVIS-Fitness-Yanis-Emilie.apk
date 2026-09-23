import roles from "../data/team-roles.json" with { type: "json" };
import {
  sourcePosition,
  sourceRecentRecovery,
  sourceDay,
} from "./source-schedule.js";
import { allSets } from "./fitness.js";
import { nutritionTargets } from "./nutrition.js";
import { today, addDays, numberLabel, round, num } from "./utils.js";
import { plannedSessions } from "./plan-memory.js";
export function teamWeek(p, index = sourcePosition(p).weekGlobal) {
  const start = addDays(p.user.startDate || today(), index * 7),
    end = addDays(start, 6);
  const planned = plannedSessions(p).filter(
    (s) => s.type === "strength" && s.date >= start && s.date <= end,
  );
  const sets = allSets(p, { start, end });
  const effort = sets.filter((s) => num(s.rpe) != null),
    reserve = sets.filter((s) => num(s.rir) != null);
  const weights = p.measurements.filter(
    (m) => m.weight != null && m.date >= start && m.date <= end,
  );
  const checkIns = Object.entries(p.checkIns).filter(
    ([d]) => d >= start && d <= end,
  );
  return {
    start,
    end,
    index,
    planned: planned.length,
    completed: planned.filter((s) => s.status === "completed").length,
    partial: planned.filter((s) => s.status === "partial").length,
    missed: planned.filter((s) => s.status === "missed").length,
    sets: sets.reduce((n, s) => n + (s.count || 1), 0),
    incomplete: sets
      .filter((s) => s.reps == null)
      .reduce((n, s) => n + (s.count || 1), 0),
    tonnage: round(
      sets.reduce(
        (n, s) =>
          n +
          (s.unit !== "secondes" && s.weight != null && s.reps != null
            ? s.weight * s.reps * (s.count || 1)
            : 0),
        0,
      ),
    ),
    rpe: effort.length
      ? round(effort.reduce((n, s) => n + s.rpe, 0) / effort.length, 1)
      : null,
    rir: reserve.length
      ? round(reserve.reduce((n, s) => n + s.rir, 0) / reserve.length, 1)
      : null,
    weights: weights.length,
    checkIns: checkIns.length,
    recovery: sourceRecentRecovery(p, end > today() ? today() : end),
  };
}
export function teamAdvice(p, review, week = review.week) {
  const s = teamWeek(p, week),
    messages = [];
  const add = (tag, text) => messages.push({ tag, text });
  if (s.planned && s.completed + s.partial < s.planned)
    add(
      "Coach",
      `${s.completed + s.partial}/${s.planned} séances prévues sont validées ou partielles. ${s.missed ? "Les séances non effectuées restent dans le suivi." : "Les jours sans résultat restent à renseigner, pas à inventer."}`,
    );
  if (s.rpe != null && s.rpe >= 9)
    add(
      "Coach",
      `RPE moyen saisi ${s.rpe}/10 : effort perçu élevé. Évitez d’augmenter automatiquement les charges ; une séance allégée peut être discutée, sans remplacer votre programme.`,
    );
  if (s.rir != null && s.rir <= 0.5)
    add(
      "Coach",
      `RIR moyen ${s.rir} : plusieurs séries sont déclarées proches de l’échec. Gardez une marge de contrôle et interrompez un mouvement douloureux.`,
    );
  if (review.fatigue >= 4)
    add(
      "Coach",
      "Fatigue élevée signalée : privilégiez la récupération et envisagez une adaptation explicite. Votre programme reste inchangé tant que vous ne la choisissez pas.",
    );
  if (review.pain >= 3)
    add(
      "Référent santé",
      "Douleur signalée : arrêtez les mouvements douloureux. Une douleur vive ou persistante justifie un avis professionnel ; ce logiciel ne pose aucun diagnostic.",
    );
  if (review.energy != null && review.energy <= 2)
    add(
      "Nutritionniste",
      "Énergie basse déclarée : vérifiez la régularité des repas, l’hydratation et le sommeil. Les apports affichés sont des estimations, pas une prescription médicale.",
    );
  if (review.motivation != null && review.motivation <= 2)
    add(
      "Préparateur mental",
      "Un objectif simple et un créneau réaliste peuvent aider. Le bilan permet d’exprimer vos difficultés sans sanction ni rattrapage forcé.",
    );
  const text = [review.feelings, review.difficulties].join(" ").toLowerCase();
  if (/mal dorm|peu dorm|mauvaise nuit|insomnie|sommeil perturb/.test(text))
    add(
      "Préparateur mental",
      "Sommeil difficile mentionné : essayez des horaires réguliers et une routine calme. Si cela persiste, demandez un avis adapté.",
    );
  if (s.incomplete)
    add(
      "Analyste",
      `${s.incomplete} séries saisies n’ont pas de répétitions renseignées. Elles sont conservées, mais ne justifient pas un 1RM ou un tonnage inventé.`,
    );
  if (
    /ne rien.?changer|garder.*programm|conserver.*programm/i.test(
      review.questions || "",
    )
  )
    add(
      "Coach",
      "Votre demande de conserver la programmation est enregistrée. Aucun exercice ni jour n’a été changé par ce bilan.",
    );
  if (!messages.length)
    add(
      "Coach",
      "Les informations du bilan sont enregistrées. Continuez à renseigner ce qui est réellement effectué ; aucune hausse de charge n’est déduite de la seule absence d’alerte.",
    );
  return messages;
}
export function teamInsights(p, date = today()) {
  const pos = sourcePosition(p, date),
    week = teamWeek(p, pos.weekGlobal),
    nutrition = nutritionTargets(p),
    latestReview = [...(p.teamReviews || [])].sort((a, b) =>
      b.date.localeCompare(a.date),
    )[0],
    strength = [...p.forceTests].filter((f) => !f.needsDate),
    lastWeight = [...p.measurements]
      .filter((m) => m.weight != null && m.date <= date)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
  return roles[p.id].map((r, i) => {
    let text = "";
    if (i === 0)
      text = `Votre phase : ${pos.phase.titre}. Semaine ${pos.weekGlobal + 1}/52. ${pos.deload ? "Allégement prévu par le HTML : environ 50 % du volume et pas de méthode intensive." : `${week.planned} séances de musculation sont prévues cette semaine par la logique du fichier.`} Le programme d’origine et vos adaptations éventuelles sont distincts.`;
    else if (i === 1)
      text =
        p.id === "elite"
          ? `Les séances de ce mois : ${Object.values(pos.phase.sessions)
              .map((s) => s.nom)
              .join(
                " · ",
              )}. ${week.sets} séries sont déclarées réalisées cette semaine. Les valeurs manquantes restent signalées.`
          : `La priorité fessiers du fichier est conservée : grand fessier, moyen fessier et travail de stabilité. ${week.sets} séries totales sont déclarées réalisées cette semaine ; le détail par muscle est dans Progression.`;
    else if (i === 2)
      text = nutrition
        ? `Repères estimés : ${numberLabel(nutrition.calories, 0)} kcal, ${numberLabel(nutrition.protein)} g de protéines, ${numberLabel(nutrition.carbs)} g de glucides, ${numberLabel(nutrition.fat)} g de lipides. ${nutrition.sourceFormula ? "Calcul du fichier source, avec les réglages importés." : "Calcul basé sur les informations du profil."} Un repas proposé n’est pas automatiquement compté comme consommé.`
        : "Renseignez ou restaurez les informations nécessaires au calcul des apports. Aucune cible chiffrée n’est inventée.";
    else if (i === 3)
      text = `${week.completed}/${week.planned} séances musculaires validées cette semaine. ${latestReview ? `Dernier bilan enregistré le ${latestReview.date}. Vos ressentis et vos questions sont conservés avec les retours reçus.` : "Votre premier bilan permettra de conserver vos ressentis, difficultés et questions."}`;
    else if (i === 4)
      text =
        "Échauffement, progression maîtrisée, repos et hydratation restent importants. Douleur aiguë, malaise ou fatigue inhabituelle : arrêtez l’effort et demandez un avis compétent. Ces messages sont automatiques et ne constituent pas une consultation.";
    else if (i === 5)
      text =
        p.id === "elite"
          ? "La mobilité hanches/épaules et les séries d’approche précèdent l’effort. Les validations d’échauffement et d’étirements importées restent dans votre journal. Utilisez le module Récupération pour les protocoles guidés."
          : "L’activation fessiers et la mobilité de hanche restent présentes avant les séances du fichier. Les validations d’échauffement et de retour au calme sont conservées séparément des performances.";
    else if (i === 6)
      text = `Prescription du mois : ${pos.phase.metcon}. ${pos.deload ? "Cette semaine est allégée : pas de séance intense." : p.id === "elite" ? "Les journées METCON contiennent les deux blocs du coach source : elliptique, transition, puis piscine." : "Le cardio après musculation et les jours piscine sont affichés dans votre semaine."} Les durées réalisées se confirment à part.`;
    else
      text = `${strength.length} références de force conservées. ${lastWeight ? `Dernière pesée saisie : ${numberLabel(lastWeight.weight)} kg le ${lastWeight.date}. ` : ""}${week.incomplete ? `${week.incomplete} séries de cette semaine ont des répétitions manquantes. ` : ""}Les charges de convention incertaine restent consultables mais doivent être vérifiées avant des recommandations de charge.`;
    return { ...r, text };
  });
}
