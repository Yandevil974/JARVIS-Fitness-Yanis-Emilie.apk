import React, { useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  PageHeading,
  Panel,
  SectionHeading,
  Icon,
  IconButton,
  Button,
  Badge,
  Field,
  Input,
  Select,
  Empty,
  ProgressBar,
} from "../components/ui.jsx";
import {
  nutritionTargets,
  generateMeals,
  foodTotal,
} from "../engine/nutrition.js";
import {
  today,
  dateLabel,
  addDays,
  numberLabel,
  uid,
} from "../engine/utils.js";
export default function Nutrition() {
  const { p, updateProfile, setModal, navigate, notify } = useApp();
  const [date, setDate] = useState(today()),
    [calorieDraft, setCalorieDraft] = useState(
      p.nutrition.manualCalories ?? "",
    );
  const targets = nutritionTargets(p);
  const plan = generateMeals(p, date, p.nutrition.variant || 0);
  const logs = p.nutrition.logs.filter((l) => l.date === date),
    total = foodTotal(logs);
  function mark(meal, index) {
    if (date > today()) {
      notify(
        "Une proposition future ne peut pas être enregistrée comme un repas consommé.",
        "error",
      );
      return;
    }
    const key = `${date}|${p.nutrition.variant}|${index}`;
    if (p.nutrition.acceptedMeals?.includes(key)) return;
    updateProfile((q) => {
      for (const row of meal.rows)
        q.nutrition.logs.push({
          ...row,
          id: uid(),
          date,
          meal: meal.name,
          source: "confirmed-plan",
        });
      q.nutrition.acceptedMeals = [...(q.nutrition.acceptedMeals || []), key];
    });
    notify("Repas confirmé et ajouté au journal réel.");
  }
  return (
    <>
      <PageHeading
        eyebrow="NOURRIR L’EFFORT. SOUTENIR LA RÉCUPÉRATION."
        title="Votre énergie se prépare aussi ici."
        description="Nutrition, repas et journal : les fonctions de vos deux sources, réunies."
      >
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setModal({ type: "food", date })}
        >
          Noter un aliment
        </Button>
      </PageHeading>
      <div className="nutrition-day">
        <IconButton
          icon="ChevronLeft"
          label="Jour précédent"
          onClick={() => setDate((d) => addDays(d, -1))}
        />
        <h2>
          {dateLabel(date, { weekday: "long", day: "numeric", month: "long" })}
        </h2>
        <IconButton
          icon="ChevronRight"
          label="Jour suivant"
          onClick={() => setDate((d) => addDays(d, 1))}
        />
        <Button variant="secondary small" onClick={() => setDate(today())}>
          Aujourd’hui
        </Button>
      </div>
      {targets?.sourceFormula && (
        <div className="source-formula-note">
          <Icon name="FileCheck" size={17} />
          <span>
            {targets.formulaLabel} Les paramètres de votre sauvegarde sont
            conservés ; les nombres affichés restent des estimations.
          </span>
        </div>
      )}
      <div className="nutrition-layout">
        <div>
          <div className="nutrition-macros">
            {[
              ["Énergie", total.cal, targets?.calories, "kcal", "Flame"],
              ["Protéines", total.p, targets?.protein, "g", "Beef"],
              ["Glucides", total.g, targets?.carbs, "g", "Wheat"],
              ["Lipides", total.f, targets?.fat, "g", "Droplets"],
            ].map(([n, v, t, u, ic]) => (
              <Panel key={n}>
                <div>
                  <Icon name={ic} size={20} />
                  <span>{n}</span>
                </div>
                <strong>
                  {numberLabel(v, 0)}
                  <small>
                    {" "}
                    / {t ?? "—"} {u}
                  </small>
                </strong>
                <ProgressBar value={t ? (v / t) * 100 : 0} />
                <p>
                  {t
                    ? "Journal réel / repère estimé"
                    : "Repère à personnaliser"}
                </p>
              </Panel>
            ))}
          </div>
          <SectionHeading
            title="Votre inspiration repas"
            subtitle="Les propositions ne sont jamais enregistrées comme des repas consommés."
          >
            <Button
              variant="secondary small"
              icon="Shuffle"
              onClick={() =>
                updateProfile((q) => {
                  q.nutrition.variant = (q.nutrition.variant || 0) + 1;
                })
              }
            >
              Varier les repas
            </Button>
          </SectionHeading>
          {!plan ? (
            <Panel>
              <Empty
                icon="Utensils"
                title="Des repères adaptés demandent du contexte."
                text="Renseignez âge, taille, poids et sexe pour le calcul. En attendant, vous pouvez noter librement vos repas réels."
              >
                <Button variant="primary" onClick={() => navigate("profile")}>
                  Compléter mon profil
                </Button>
              </Empty>
            </Panel>
          ) : (
            <div className="meal-list">
              {plan.meals.map((meal, i) => {
                const accepted = p.nutrition.acceptedMeals?.includes(
                  `${date}|${p.nutrition.variant}|${i}`,
                );
                return (
                  <Panel className="meal-card" key={i}>
                    <div className="meal-number">0{i + 1}</div>
                    <div className="meal-content">
                      <SectionHeading title={meal.name}>
                        <Badge>
                          {numberLabel(meal.total.cal, 0)} kcal estimées
                        </Badge>
                      </SectionHeading>
                      <div className="meal-foods">
                        {meal.rows.map((r) => (
                          <div key={r.food}>
                            <span>{r.food}</span>
                            <strong>{r.grams} g</strong>
                          </div>
                        ))}
                      </div>
                      <div className="meal-footer">
                        <span>
                          P {numberLabel(meal.total.p)} · G{" "}
                          {numberLabel(meal.total.g)} · L{" "}
                          {numberLabel(meal.total.f)}
                        </span>
                        <Button
                          variant={
                            accepted ? "secondary small" : "primary small"
                          }
                          icon={accepted ? "Check" : "Plus"}
                          disabled={accepted}
                          onClick={() => mark(meal, i)}
                        >
                          {accepted
                            ? "Consommation notée"
                            : "J’ai mangé ce repas"}
                        </Button>
                      </div>
                    </div>
                  </Panel>
                );
              })}
              <p className="small-subtitle">
                Total du menu proposé : {numberLabel(plan.total.cal, 0)} kcal.
                Il peut différer du repère cible. Portions et totaux sont
                recalculés ensemble à partir de la base alimentaire source.
              </p>
            </div>
          )}
          <Panel className="food-journal">
            <SectionHeading
              title="Ce que vous avez réellement mangé"
              subtitle="Les valeurs nutritionnelles restent des estimations de la base source."
            />
            {logs.length ? (
              <div className="food-logs">
                {logs.map((l) => (
                  <div key={l.id}>
                    <Icon name="Utensils" size={15} />
                    <span>
                      {l.food}
                      <small>{l.meal || "Aliment"}</small>
                    </span>
                    <strong>{l.grams} g</strong>
                    <IconButton
                      icon="Trash2"
                      label={`Supprimer ${l.food}`}
                      onClick={() =>
                        updateProfile((q) => {
                          q.nutrition.logs = q.nutrition.logs.filter(
                            (x) => x.id !== l.id,
                          );
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                compact
                icon="NotebookPen"
                title="Le journal du jour est encore libre."
                text="Ajoutez un aliment ou confirmez un repas réellement consommé."
              />
            )}
          </Panel>
          {p.nutrition.legacyJournal &&
            Object.keys(p.nutrition.legacyJournal).length > 0 && (
              <Panel>
                <details>
                  <summary>Journal nutritionnel source conservé</summary>
                  <pre className="legacy-data">
                    {JSON.stringify(p.nutrition.legacyJournal, null, 2)}
                  </pre>
                </details>
              </Panel>
            )}
        </div>
        <aside>
          <Panel className="nutrition-settings">
            <SectionHeading title="Votre stratégie" />
            <Field label="Niveau d’activité estimé">
              <Select
                value={p.nutrition.activityFactor}
                onChange={(e) =>
                  updateProfile((q) => {
                    q.nutrition.activityFactor = Number(e.target.value);
                  })
                }
              >
                <option value="1.2">Faible · × 1,2</option>
                <option value="1.4">Léger · × 1,4</option>
                <option value="1.5">Modéré · × 1,5</option>
                <option value="1.6">Actif · × 1,6</option>
                <option value="1.75">Très actif · × 1,75</option>
              </Select>
            </Field>
            <Field
              label="Repère calorique manuel"
              hint="Facultatif. À définir avec un professionnel si besoin."
            >
              <Input
                type="number"
                min="1000"
                max="6000"
                step="50"
                placeholder="Automatique"
                value={calorieDraft}
                onChange={(e) => setCalorieDraft(e.target.value)}
                onBlur={() => {
                  const value =
                    calorieDraft === "" ? null : Number(calorieDraft);
                  if (
                    value != null &&
                    (!Number.isFinite(value) || value < 1000 || value > 6000)
                  ) {
                    notify(
                      "Repère manuel : 1 000 à 6 000 kcal, ou champ vide pour le calcul automatique.",
                      "error",
                    );
                    setCalorieDraft(p.nutrition.manualCalories ?? "");
                    return;
                  }
                  updateProfile((q) => {
                    q.nutrition.manualCalories = value;
                  });
                }}
              />
            </Field>
            <Button
              variant="secondary small"
              onClick={() => {
                setCalorieDraft("");
                updateProfile((q) => {
                  q.nutrition.manualCalories = null;
                });
              }}
            >
              Revenir au calcul automatique
            </Button>
            <div className="nutrition-calculations">
              <p>
                <span>Métabolisme estimé</span>
                <strong>{targets?.bmr ?? "—"} kcal</strong>
              </p>
              <p>
                <span>Dépense estimée</span>
                <strong>{targets?.tdee ?? "—"} kcal</strong>
              </p>
              <p>
                <span>Repère de la phase</span>
                <strong>{targets?.calories ?? "—"} kcal</strong>
              </p>
            </div>
            <p className="small-subtitle">
              Mifflin–St Jeor. Repères adultes généraux, non adaptés
              automatiquement à une grossesse, une maladie ou une situation
              clinique. Ni diagnostic ni prescription.
            </p>
          </Panel>
          <Panel className="nutrition-tip">
            <Icon name="Leaf" size={24} />
            <h3>La régularité avant la perfection.</h3>
            <p>
              Une alimentation variée, une hydratation adaptée et un apport
              suffisant soutiennent mieux votre progression qu’une restriction
              extrême.
            </p>
            <small>
              Les calories cardio estimées ne sont pas automatiquement «
              compensées » dans les repas.
            </small>
          </Panel>
        </aside>
      </div>
    </>
  );
}
