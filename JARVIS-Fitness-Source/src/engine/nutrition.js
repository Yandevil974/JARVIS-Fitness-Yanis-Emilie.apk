import { FOOD, legacy } from "../data/library.js";
import { num, round, clamp, today, parseDate, sum } from "./utils.js";
export function nutritionTargets(p) {
  if (p.id === "elite" && p.nutrition.useSourceFormula) {
    const w = num(p.user.weight),
      age = num(p.user.age),
      height = num(p.user.height);
    if (!w || !age || !height || age < 18) return null;
    const base = 10 * w + 6.25 * height - 5 * age + 5,
      f = p.user.frequency >= 5 ? 1.7 : p.user.frequency === 4 ? 1.625 : 1.55,
      tdee = Math.round(base * f),
      phase = p.nutrition.legacyPhase || "maintien";
    const factor =
      phase === "surplus"
        ? p.user.goal === "strength"
          ? 1.08
          : 1.12
        : phase === "deficit"
          ? 0.82
          : phase === "recomp"
            ? 1
            : 1.02;
    const calories =
      p.nutrition.manualCalories ||
      Math.round(tdee * factor + (p.nutrition.legacyAdjustment || 0));
    const protein = round(
        w * (p.user.goal === "cut" || phase === "recomp" ? 2.2 : 2),
        1,
      ),
      fat = round(w, 1),
      carbs = Math.max(60, Math.round((calories - protein * 4 - fat * 9) / 4));
    return {
      bmr: Math.round(base),
      tdee,
      calories,
      protein,
      fat,
      carbs,
      weight: w,
      adjustment: calories - tdee,
      sourceFormula: true,
      formulaLabel:
        "Formule du HTML Élite : Mifflin avec coefficient masculin, poids de départ et activité source.",
    };
  }
  const weight =
    [...p.measurements]
      .filter((m) => m.weight != null)
      .sort((a, b) => a.date.localeCompare(b.date))
      .at(-1)?.weight ?? num(p.user.weight);
  const age = num(p.user.age),
    height = num(p.user.height),
    sex = p.user.sex;
  if (
    !weight ||
    !age ||
    !height ||
    !["female", "male"].includes(sex) ||
    age < 18
  )
    return null;
  const bmr =
    10 * weight + 6.25 * height - 5 * age + (sex === "female" ? -161 : 5);
  const tdee = Math.round(bmr * (p.nutrition.activityFactor || 1.5));
  const adjustment =
    p.user.goal === "cut" ? -250 : p.user.goal === "hypertrophy" ? 200 : 0;
  const auto = Math.round(Math.max(bmr, tdee + adjustment));
  const calories = p.nutrition.manualCalories || auto;
  const protein = round(weight * 1.8),
    fat = round(weight * 0.9),
    carbs = round(Math.max(0, (calories - protein * 4 - fat * 9) / 4));
  return {
    bmr: Math.round(bmr),
    tdee,
    calories,
    protein,
    fat,
    carbs,
    weight,
    adjustment: calories - tdee,
  };
}
export function foodTotal(rows) {
  return rows.reduce(
    (a, r) => {
      const f = FOOD[r.food] || r.macros;
      if (!f) return a;
      const scale = r.grams / 100;
      return {
        cal: a.cal + f.cal * scale,
        p: a.p + f.p * scale,
        g: a.g + f.g * scale,
        f: a.f + f.f * scale,
      };
    },
    { cal: 0, p: 0, g: 0, f: 0 },
  );
}
export function generateMeals(p, date = today(), variant = 0) {
  const targets = nutritionTargets(p);
  if (!targets) return null;
  const pattern = (Math.floor(parseDate(date).getTime() / 864e5) + variant) % 3;
  const meals = legacy[p.id].REPAS_CREUX.map((m, i) => {
    const list = legacy[p.id].REPAS_JOURS[m.nom][pattern];
    const rows = [];
    const target = {
      p: targets.protein * m.pP,
      g: targets.carbs * m.pG,
      f: targets.fat * m.pL,
    };
    for (const [food, category] of list) {
      const f = FOOD[food];
      if (!f) continue;
      const current = foodTotal(rows);
      const macro = category === "prot" ? "p" : category === "lip" ? "f" : "g";
      let grams;
      if (category === "leg") grams = 150;
      else if (category === "fruit") grams = 120;
      else
        grams = clamp(
          Math.round(
            Math.max(0, target[macro] - current[macro]) /
              Math.max(0.01, f[macro] / 100) /
              5,
          ) * 5,
          category === "lip" ? 5 : 30,
          category === "lip" ? 30 : 350,
        );
      rows.push({ food, grams });
    }
    return { name: m.nom.replace(/^\S+\s*/, ""), rows, total: foodTotal(rows) };
  });
  return { meals, total: foodTotal(meals.flatMap((m) => m.rows)), targets };
}
export function heartZones(p) {
  const age = num(p.user.age);
  if (!age || age < 18) return null;
  const max = Math.round(208 - 0.7 * age);
  return {
    max,
    estimated: true,
    zones: [
      ["Récupération", 0.5, 0.6],
      ["Endurance douce", 0.6, 0.7],
      ["Modéré", 0.7, 0.8],
      ["Soutenu", 0.8, 0.9],
      ["Très intense", 0.9, 1],
    ].map(([name, lo, hi], i) => ({
      name,
      zone: i + 1,
      min: Math.round(max * lo),
      max: Math.round(max * hi),
    })),
  };
}
