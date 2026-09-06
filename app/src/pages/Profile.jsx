import {
  makeProfileBackup,
  restoreProfile,
  restorationSummary,
} from "../store/restoration.js";
import { voiceAvailable } from "../platform/native.js";
import {
  notificationsSupported,
  notificationPermission,
  requestNotifications,
  testNotification,
} from "../platform/notifications.js";
import {
  wearableAvailability,
  connectHeartRate,
  heartRateZones,
  currentZone,
} from "../platform/wearable.js";
import { userProfile } from "../engine/validation.js";
import {
  archivePlan,
  findPlanned,
  completePlanned,
} from "../engine/plan-memory.js";
import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  PageHeading,
  SectionHeading,
  Panel,
  Tabs,
  Field,
  Input,
  Select,
  Button,
  Icon,
  Badge,
  Switch,
  Empty,
  ProgressBar,
} from "../components/ui.jsx";
import { EQUIPMENT, GOALS, MUSCLES } from "../data/library.js";
import { generatePlan } from "../engine/planner.js";
import { today, num, uid, download, numberLabel } from "../engine/utils.js";
import {
  parseImport,
  validateState,
  migrateLegacy,
  newProfile,
} from "../store/model.js";
import {
  exportState,
  exportHTMLBackup,
  storageDiagnostic,
  isStorageProtected,
  unlockStorage,
  exportRecoveryData,
} from "../store/storage.js";
import { exportPortable } from "../store/portable.js";
import { estimate1RM } from "../engine/fitness.js";
export default function Profile() {
  const { p, tab, setTab } = useApp();
  const value = tab || "profile";
  return (
    <>
      <PageHeading
        eyebrow="VOTRE COACHING COMMENCE PAR VOUS"
        title="Un profil. Votre singularité."
        description="Deux espaces indépendants. Des préférences qui orientent vos séances."
      >
        <Badge color="mint" dot>
          PROFIL {p.id === "emilie" ? "ÉMILIE" : "YANIS"}
        </Badge>
      </PageHeading>
      <Tabs
        value={value}
        onChange={setTab}
        items={[
          ["profile", "Mon profil"],
          ["equipment", "Matériel & préférences"],
          ["goals", "Mes objectifs"],
          ["data", "Données & sauvegardes"],
        ]}
      />
      {value === "equipment" ? (
        <Equipment />
      ) : value === "goals" ? (
        <Goals />
      ) : value === "data" ? (
        <Data />
      ) : (
        <ProfileForm />
      )}
    </>
  );
}
function ProfileForm() {
  const { p, updateProfile, notify } = useApp();
  const [form, setForm] = useState(p.user);
  useEffect(() => setForm(p.user), [p.id]);
  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    let user;
    try {
      user = { ...userProfile(form), sourceConfirmed: true };
    } catch (e) {
      notify(e.message, "error");
      return;
    }
    if (user.age != null && (user.age < 18 || user.age > 110)) {
      notify(
        "Cette version propose des repères pour les adultes. Renseignez un âge entre 18 et 110 ans.",
        "error",
      );
      return;
    }
    const replan =
      user.goal !== p.user.goal || user.frequency !== p.user.frequency;
    updateProfile((q) => {
      q.user = user;
      if (replan) {
        archivePlan(q);
        q.plan = generatePlan(q, {
          frequency: user.frequency,
          weeks: q.plan?.weeks || 52,
          goal: user.goal,
          startDate: today(),
          source: q.plan?.source || "legacy",
        });
      }
    });
    notify(
      replan
        ? "Profil enregistré. Le futur programme a été adapté ; les séances passées sont conservées."
        : "Votre profil est enregistré.",
    );
  };
  return (
    <div className="profile-layout">
      <Panel className="profile-form">
        <SectionHeading
          title="Vos repères personnels"
          subtitle={
            p.id === "emilie" && !p.user.sourceConfirmed
              ? "Les valeurs préremplies viennent du fichier Émilie. Vérifiez-les avant de confirmer."
              : "Les champs inconnus peuvent rester vides."
          }
        />
        <form onSubmit={submit}>
          <div className="form-grid">
            <Field label="Prénom ou nom d’usage">
              <Input
                value={form.name}
                maxLength={60}
                onChange={(e) => change("name", e.target.value)}
                placeholder="Comment vous appeler ?"
              />
            </Field>
            <Field label="Âge">
              <Input
                type="number"
                min="18"
                max="110"
                value={form.age ?? ""}
                placeholder="ans"
                onChange={(e) => change("age", e.target.value)}
              />
            </Field>
            <Field label="Taille (cm)">
              <Input
                type="number"
                min="120"
                max="240"
                value={form.height ?? ""}
                onChange={(e) => change("height", e.target.value)}
                placeholder="cm"
              />
            </Field>
            <Field label="Poids de référence (kg)">
              <Input
                type="number"
                min="30"
                max="350"
                step=".1"
                value={form.weight ?? ""}
                onChange={(e) => change("weight", e.target.value)}
                placeholder="kg"
              />
            </Field>
            <Field label="Sexe utilisé pour les estimations nutritionnelles">
              <Select
                value={form.sex}
                onChange={(e) => change("sex", e.target.value)}
              >
                <option value="">Non renseigné · pas d’estimation</option>
                <option value="female">Féminin</option>
                <option value="male">Masculin</option>
              </Select>
            </Field>
            <Field label="Expérience d’entraînement">
              <Select
                value={form.level}
                onChange={(e) => change("level", e.target.value)}
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="confirmed">Confirmé</option>
                <option value="advanced">Avancé</option>
                <option value="expert">Expert</option>
              </Select>
            </Field>
            <Field label="Objectif principal">
              <Select
                value={form.goal}
                onChange={(e) => change("goal", e.target.value)}
              >
                {Object.entries(GOALS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Séances par semaine">
              <Select
                value={form.frequency}
                onChange={(e) => change("frequency", e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} séance{n > 1 ? "s" : ""}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Poids cible éventuel (kg)">
              <Input
                type="number"
                min="30"
                max="350"
                step=".1"
                value={form.targetWeight ?? ""}
                onChange={(e) => change("targetWeight", e.target.value)}
              />
            </Field>
            <Field label="Incrément de charge disponible">
              <Select
                value={form.increment}
                onChange={(e) => change("increment", e.target.value)}
              >
                {[0.5, 1, 1.25, 2, 2.5, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} kg
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="info-line">
            <Icon name="Info" size={17} />
            <p>
              Changer l’objectif ou la fréquence recrée les séances futures du
              programme adaptatif. Les séances réalisées et le programme
              précédent sont conservés.
            </p>
          </div>
          <Button variant="primary" type="submit" icon="Check">
            Enregistrer mon profil
          </Button>
        </form>
      </Panel>
      <aside>
        <Panel className="identity-card">
          <div className="profile-avatar-large">
            {(p.user.name || "É").slice(0, 1).toUpperCase()}
          </div>
          <Badge color="mint">
            ESPACE {p.id === "elite" ? "YANIS" : "ÉMILIE"}
          </Badge>
          <h2>{p.user.name || "Votre profil Yanis"}</h2>
          <p>{GOALS[p.user.goal]}</p>
          <div className="identity-stats">
            <span>
              <strong>{p.sessions.length}</strong>séances
            </span>
            <span>
              <strong>{p.activities.length}</strong>activités
            </span>
            <span>
              <strong>{p.measurements.length}</strong>relevés
            </span>
          </div>
          <p className="small-subtitle">
            Ce profil ne partage ni historique, ni photos, ni préférences avec
            l’autre espace.
          </p>
        </Panel>
        <div className="safety-note">
          <Icon name="ShieldCheck" size={21} />
          <span>
            Ne renseignez que les données utiles au coaching. Elles restent sur
            cet appareil tant que vous ne les exportez pas.
          </span>
        </div>
      </aside>
    </div>
  );
}
/* ------------------------------------------------------------------
   MONTRE CONNECTÉE / CEINTURE CARDIO
   Connexion réelle en Bluetooth Low Energy au service standard de
   fréquence cardiaque (0x180D). Aucune donnée n'est simulée : si aucun
   capteur n'est apparié, l'écran le dit clairement.
   ------------------------------------------------------------------ */
function Wearable() {
  const { p, updateProfile, notify } = useApp();
  const availability = wearableAvailability();
  const [device, setDevice] = useState(null);
  const [reading, setReading] = useState(null);
  const [busy, setBusy] = useState(false);
  const sessionRef = useRef(null);
  const age = num(p.user.age);
  const zones = age ? heartRateZones(age) : null;
  const zone = reading && age ? currentZone(reading.bpm, age) : null;

  useEffect(() => () => sessionRef.current?.stop?.(), []);

  async function connect() {
    setBusy(true);
    try {
      const session = await connectHeartRate(
        (r) => setReading({ ...r, at: Date.now() }),
        () => {
          setDevice(null);
          setReading(null);
          notify("Capteur déconnecté.", "info");
        },
      );
      sessionRef.current = session;
      setDevice({ name: session.name, battery: session.battery });
      updateProfile((q) => {
        q.preferences.wearable = { name: session.name, id: session.id };
      });
      notify(`${session.name} connecté. Fréquence cardiaque en direct.`);
    } catch (e) {
      notify(e.message || "Connexion impossible.", "error");
    } finally {
      setBusy(false);
    }
  }

  function disconnect() {
    sessionRef.current?.stop?.();
    sessionRef.current = null;
    setDevice(null);
    setReading(null);
    notify("Capteur déconnecté.");
  }

  return (
    <Panel className="wearable-panel">
      <SectionHeading
        title="Montre & ceinture cardio"
        subtitle="Connexion directe en Bluetooth, sans compte ni serveur."
      />
      {!availability.ok ? (
        <>
          <div className="info-line">
            <Icon name="Info" size={16} />
            <p>{availability.reason}</p>
          </div>
          {/* L'appairage direct est impossible ici, mais l'explication
              Samsung reste utile : c'est justement dans ce cas qu'on la
              cherche. Elle était auparavant cachée dans la branche
              « compatible », donc invisible dans l'application installée. */}
          <details className="wearable-samsung">
            <summary>
              <Icon name="Watch" size={14} /> Vous avez une montre Samsung
              Galaxy Watch ?
            </summary>
            <p>
              Les Galaxy Watch <strong>ne diffusent pas</strong> leur fréquence
              cardiaque en Bluetooth standard : Samsung garde le capteur pour
              Samsung Health. Aucune application ne peut contourner cela
              directement, et je préfère vous le dire plutôt que de vous laisser
              chercher.
            </p>
            <p>
              La solution qui fonctionne : installer sur la montre une
              application relais qui rediffuse le cardio comme une ceinture
              classique. « Heart for Bluetooth » (Play Store, sur la montre) est
              la plus utilisée et gratuite. Lancez-la sur la montre, laissez-la
              ouverte, puis appairez ici.
            </p>
            <p>
              Pensez à autoriser l’activité en arrière-plan pour la montre
              (Galaxy Wearable → Paramètres de la montre → Applications), sans
              quoi la diffusion se coupe au bout d’une minute.
            </p>
          </details>
          <p className="wearable-intro">
            Pour appairer malgré tout : ouvrez cette même application dans
            Chrome sur le téléphone. Le Bluetooth y est disponible, alors que
            la version installée ne l’expose pas.
          </p>
        </>
      ) : !device ? (
        <>
          <p className="wearable-intro">
            JARVIS lit le service Bluetooth standard de fréquence cardiaque
            (0x180D). Sont compatibles directement les ceintures Polar, Garmin,
            Wahoo, Decathlon, et les montres de sport qui diffusent leur cardio
            en direct.
          </p>
          <Button icon="Watch" onClick={connect} disabled={busy}>
            {busy ? "Recherche…" : "Connecter un capteur"}
          </Button>
        </>
      ) : (
        <div className="wearable-live">
          <div className="wearable-head">
            <div>
              <strong>{device.name}</strong>
              <small>
                Connecté
                {device.battery != null ? ` · batterie ${device.battery} %` : ""}
              </small>
            </div>
            <Button variant="ghost" onClick={disconnect}>
              Déconnecter
            </Button>
          </div>
          <div className="wearable-bpm">
            <span className="bpm-value">{reading ? reading.bpm : "—"}</span>
            <span className="bpm-unit">bpm</span>
            {zone && (
              <Badge color={zone.color}>
                Zone {zone.index} · {zone.name}
              </Badge>
            )}
          </div>
          {reading?.rr?.length > 0 && (
            <p className="wearable-rr">
              Intervalles RR reçus : variabilité exploitable pour la
              récupération.
            </p>
          )}
          {!age && (
            <p className="wearable-rr">
              Renseignez votre âge dans l’onglet Profil pour afficher les zones
              cardiaques.
            </p>
          )}
          {zones && (
            <ul className="wearable-zones">
              {zones.map((z) => (
                <li
                  key={z.index}
                  className={zone?.index === z.index ? "active" : ""}
                >
                  <span>
                    Z{z.index} · {z.name}
                  </span>
                  <small>
                    {z.min}–{z.max} bpm
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p className="wearable-note">
        Aucune donnée de capteur n’est inventée : si rien n’est connecté, rien
        n’est affiché. Les mesures restent sur l’appareil.
      </p>
    </Panel>
  );
}

function Equipment() {
  const { p, updateProfile, notify } = useApp();
  const supportsVoice = voiceAvailable();
  const [permission, setPermission] = useState(() => notificationPermission());
  // Les notifications système : on demande l'autorisation, on vérifie le
  // résultat, et on ne laisse jamais l'interrupteur activé si le système
  // ne peut pas réellement afficher de notification.
  async function notifications(v) {
    if (!v) {
      updateProfile((q) => {
        q.preferences.notifications = false;
      });
      notify("Notifications système désactivées.");
      return;
    }
    const result = await requestNotifications();
    setPermission(notificationPermission());
    if (!result.ok) {
      updateProfile((q) => {
        q.preferences.notifications = false;
      });
      notify(result.message, "info");
      return;
    }
    updateProfile((q) => {
      q.preferences.notifications = true;
    });
    notify(
      "Notifications système activées. Vous recevrez vos rappels de séance.",
    );
    testNotification();
  }
  return (
    <div className="preferences-layout">
      <Panel>
        <SectionHeading
          title="Votre terrain d’entraînement"
          subtitle="Sélectionnez uniquement le matériel disponible. Enregistrement immédiat."
        />
        <div className="equipment-grid">
          {Object.entries(EQUIPMENT)
            .filter(([k]) => k !== "bodyweight")
            .map(([k, n]) => (
              <button
                key={k}
                className={p.equipment.includes(k) ? "active" : ""}
                aria-pressed={p.equipment.includes(k)}
                onClick={() =>
                  updateProfile((q) => {
                    q.equipment = q.equipment.includes(k)
                      ? q.equipment.filter((v) => v !== k)
                      : [...q.equipment, k];
                  })
                }
              >
                <Icon
                  name={
                    k === "pool"
                      ? "Waves"
                      : k === "bike"
                        ? "Bike"
                        : k === "band"
                          ? "Spline"
                          : k === "rower"
                            ? "Sailboat"
                            : "Dumbbell"
                  }
                  size={25}
                />
                <span>{n}</span>
                <Icon
                  name={p.equipment.includes(k) ? "CircleCheck" : "Circle"}
                  size={16}
                />
              </button>
            ))}
        </div>
        <div className="info-line">
          <Icon name="Sparkles" size={18} />
          <p>
            Les alternatives et les nouveaux programmes utilisent ce matériel.
            Un exercice indisponible sera remplacé au lancement si une
            alternative compatible existe.
          </p>
        </div>
        <SectionHeading
          title="Groupes prioritaires"
          subtitle="Ces préférences orientent les décisions, sans supprimer l’équilibre global."
        />
        <div className="filter-chips">
          {Object.entries(MUSCLES)
            .filter(([k]) =>
              ["pec", "dos", "qua", "fes", "isc", "epL", "abs", "moy"].includes(
                k,
              ),
            )
            .map(([k, n]) => (
              <button
                className={p.preferences.priorities.includes(k) ? "active" : ""}
                key={k}
                onClick={() =>
                  updateProfile((q) => {
                    q.preferences.priorities =
                      q.preferences.priorities.includes(k)
                        ? q.preferences.priorities.filter((v) => v !== k)
                        : [...q.preferences.priorities, k];
                  })
                }
              >
                {n}
              </button>
            ))}
        </div>
      </Panel>
      <div>
        <Panel>
          <SectionHeading title="Votre expérience JARVIS" />
          <Switch
            checked={p.preferences.voice}
            label="Coach vocal"
            description={
              supportsVoice
                ? "Annonces parlées : décisions du coach, séries validées, fin de repos."
                : "Synthèse vocale non disponible dans cet environnement."
            }
            onChange={(v) => {
              if (!supportsVoice) {
                notify("La voix n’est pas disponible ici.", "info");
                return;
              }
              updateProfile((q) => {
                q.preferences.voice = v;
              });
              notify(v ? "Coach vocal activé." : "Coach vocal désactivé.");
            }}
          />
          <Switch
            checked={p.preferences.voice && p.preferences.sessionVoice !== false}
            label="Guidage vocal pendant la séance"
            description="Annonce l’exercice, la série, la charge suggérée, le tempo, le décompte de récupération et les changements d’exercice. Conçu pour ne pas avoir à regarder l’écran."
            onChange={(v) => {
              if (!supportsVoice) {
                notify("La voix n’est pas disponible ici.", "info");
                return;
              }
              updateProfile((q) => {
                q.preferences.sessionVoice = v;
                if (v) q.preferences.voice = true;
              });
              notify(
                v
                  ? "Guidage vocal de séance activé."
                  : "Guidage vocal de séance coupé.",
              );
            }}
          />
          <Switch
            checked={p.preferences.notifications}
            label="Notifications système"
            description={
              !notificationsSupported()
                ? "Indisponible ici : ce système n’expose pas les notifications à l’application."
                : permission === "denied"
                  ? "Refusées au niveau du système. Réautorisez-les dans les réglages, puis réactivez ici."
                  : "Rappels de séance et de réévaluation, avec l’application ouverte. Un test est envoyé à l’activation."
            }
            onChange={notifications}
          />
          {p.preferences.notifications && (
            <div className="info-line">
              <Icon name="Bell" size={16} />
              <p>
                Notifications autorisées.{" "}
                <button
                  className="text-link"
                  onClick={() =>
                    notify(
                      testNotification()
                        ? "Notification de test envoyée."
                        : "L’envoi a échoué : vérifiez l’autorisation système.",
                      testNotification() ? "success" : "error",
                    )
                  }
                >
                  Envoyer un test
                </button>
                . Les rappels ne sont pas garantis lorsque l’application est
                fermée : cette version n’utilise pas de service permanent en
                arrière-plan.
              </p>
            </div>
          )}
          <Switch
            checked={p.preferences.reducedMotion}
            label="Animations réduites"
            description="Coupe les animations décoratives, met les démonstrations en pause sur leur première image et supprime les défilements animés. Utile en cas de sensibilité au mouvement ou pour économiser la batterie."
            onChange={(v) => {
              updateProfile((q) => {
                q.preferences.reducedMotion = v;
              });
              // Application immédiate, sans attendre un changement de page.
              document.documentElement.classList.toggle("reduce-motion", v);
              document.querySelectorAll(".movement-svg").forEach((svg) => {
                if (v) svg.pauseAnimations?.();
                else svg.unpauseAnimations?.();
              });
              notify(
                v
                  ? "Animations réduites : démonstrations mises en pause."
                  : "Animations rétablies.",
              );
            }}
          />
        </Panel>
        <Wearable />
      </div>
    </div>
  );
}
function Goals() {
  const { p, updateProfile, notify } = useApp();
  const [title, setTitle] = useState(""),
    [month, setMonth] = useState(today().slice(0, 7));
  const done = p.goals.filter((g) => g.done).length;
  return (
    <>
      <div className="goal-banner">
        <Icon name="Target" size={42} />
        <div>
          <span className="eyebrow">LE CAP PRINCIPAL</span>
          <h2>{GOALS[p.user.goal]}</h2>
          <p>Des objectifs concrets. Une progression durable.</p>
        </div>
        <strong>
          {done}
          <span> / {p.goals.length}</span>
          <small>objectifs validés</small>
        </strong>
      </div>
      <Panel>
        <SectionHeading
          title="Définir votre prochain objectif"
          subtitle="Préférez un comportement mesurable : régularité, technique, récupération."
        />
        <form
          className="goal-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            updateProfile((q) => {
              q.goals.push({
                id: uid(),
                title: title.trim(),
                month,
                done: false,
              });
            });
            setTitle("");
            notify("Objectif ajouté.");
          }}
        >
          <Field label="Objectif">
            <Input
              required
              maxLength={180}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Terminer 12 séances ce mois-ci, à mon rythme"
            />
          </Field>
          <Field label="Mois">
            <Input
              type="month"
              value={month}
              required
              onChange={(e) => setMonth(e.target.value)}
            />
          </Field>
          <Button variant="primary" type="submit" icon="Plus">
            Ajouter
          </Button>
        </form>
      </Panel>
      <div className="goals-list">
        {p.goals.map((g) => (
          <Panel className={g.done ? "done" : ""} key={g.id}>
            <label>
              <input
                type="checkbox"
                checked={g.done}
                onChange={(e) => {
                  updateProfile((q) => {
                    q.goals.find((x) => x.id === g.id).done = e.target.checked;
                  });
                  if (e.target.checked)
                    notify(
                      "Objectif atteint. Un nouveau pas en avant.",
                      "record",
                    );
                }}
              />
              <span>
                <strong>{g.title}</strong>
                <small>{g.month}</small>
              </span>
            </label>
            <button
              className="icon-button"
              aria-label="Supprimer l’objectif"
              onClick={() =>
                updateProfile((q) => {
                  q.goals = q.goals.filter((x) => x.id !== g.id);
                })
              }
            >
              <Icon name="Trash2" size={17} />
            </button>
          </Panel>
        ))}
      </div>
      {!p.goals.length && (
        <Empty
          icon="Target"
          title="Quel sera votre prochain pas ?"
          text="Un petit objectif tenu vaut mieux qu’une grande promesse."
        />
      )}
    </>
  );
}
function Data() {
  const {
    state,
    p,
    update,
    updateProfile,
    saving,
    notify,
    setModal,
    setStorageWarning,
    bundledBackup,
  } = useApp();
  const input = useRef();
  const [importing, setImporting] = useState(null),
    [target, setTarget] = useState(p.id),
    [diagnostic, setDiagnostic] = useState(null),
    [busy, setBusy] = useState(false);
  async function readFile(f) {
    if (!f) return;
    try {
      if (f.size > 40e6)
        throw new Error("Fichier trop volumineux (40 Mo maximum).");
      const d = parseImport(await f.text());
      if (d.format === "jarvis-profile") {
        restoreProfile(state, d);
        setImporting(d);
        setTarget(d.profileId);
      } else if (d.schemaVersion) {
        validateState(d);
        setImporting(d);
      } else {
        const owner = Object.values(state.profiles).find(
          (x) =>
            x.user.name?.toLocaleLowerCase("fr") ===
            String(d.profil?.nom || "").toLocaleLowerCase("fr"),
        );
        const destination = owner?.id || target;
        const backup = makeProfileBackup(d, destination);
        restoreProfile(state, backup);
        setTarget(destination);
        setImporting(backup);
      }
    } catch (e) {
      notify(e.message, "error");
    } finally {
      input.current.value = "";
    }
  }
  async function applyImport() {
    try {
      const profileOnly = importing.format === "jarvis-profile";
      const imported = profileOnly
        ? restoreProfile(state, importing).state
        : validateState(importing);
      await exportState(state);
      if (isStorageProtected()) {
        exportRecoveryData();
        unlockStorage();
        setStorageWarning("");
      }
      if (profileOnly) imported.activeProfile = importing.profileId;
      update(() => imported);
      setImporting(null);
      notify(
        "Import terminé. Une sauvegarde de l’état précédent a été téléchargée.",
      );
    } catch (e) {
      notify(e.message, "error");
    }
  }
  return (
    <>
      <div className="storage-banner-card">
        <span className={`status-dot ${saving.ok ? "" : "error"}`} />
        <div>
          <strong>
            {saving.ok
              ? "Votre mémoire sportive est sauvegardée."
              : "Stockage navigateur indisponible."}
          </strong>
          <p>
            {saving.ok
              ? `Persistance locale : ${saving.mode}. Pensez à exporter régulièrement.`
              : "Les changements restent en mémoire pour cette session. Exportez maintenant pour ne rien perdre."}
          </p>
        </div>
        <Icon name="Database" size={27} />
      </div>
      {bundledBackup && (
        <Panel className="bundled-backup-card">
          <Icon name="DatabaseBackup" size={28} />
          <div>
            <h3>Sauvegarde de Yanis jointe à cette version</h3>
            <p>
              Programme démarré le 10 août 2026, journal, photos et bilans
              d’équipe. Restaurer uniquement Yanis sans toucher à Émilie.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() =>
              setModal({ type: "restore-profile", backup: bundledBackup })
            }
          >
            Voir la restauration
          </Button>
        </Panel>
      )}
      {isStorageProtected() && (
        <div className="warning-box">
          <Icon name="ShieldAlert" />
          <div>
            <strong>Originaux protégés · sauvegarde automatique bloquée</strong>
            <p>
              Téléchargez les copies avant de choisir une restauration. Vous
              pouvez importer un JSON valide ci-dessous.
            </p>
            <Button variant="secondary" onClick={exportRecoveryData}>
              Télécharger les copies originales
            </Button>
            <Button
              variant="secondary"
              onClick={() => setModal({ type: "unlock-storage" })}
            >
              Conserver cet état et réactiver la sauvegarde
            </Button>
          </div>
        </div>
      )}
      <div className="data-grid">
        <Panel>
          <span className="data-icon">
            <Icon name="Download" size={25} />
          </span>
          <h2>Gardez une copie de votre parcours.</h2>
          <p>
            Le JSON contient les deux profils, les séances, les photos, les
            programmes et l’historique. Ce fichier contient des données
            personnelles : conservez-le dans un endroit sûr.
          </p>
          <Button
            variant="primary"
            icon="Download"
            onClick={() => exportState(state)}
          >
            Exporter la sauvegarde JSON
          </Button>
          <Button
            variant="secondary"
            icon="FileCode2"
            onClick={() => exportHTMLBackup(state)}
          >
            Sauvegarde HTML lisible
          </Button>
          <Button
            variant="secondary"
            icon={busy ? "LoaderCircle" : "Package"}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await exportPortable(state);
                notify("Application portable avec vos données exportée.");
              } catch (e) {
                notify(e.message, "error");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy
              ? "Assemblage du fichier…"
              : "Application HTML avec mes données"}
          </Button>
          <small>
            La version portable est compilée ; les sources du projet restent
            modulaires.
          </small>
        </Panel>
        <Panel>
          <span className="data-icon">
            <Icon name="Upload" size={25} />
          </span>
          <h2>Reprenez là où vous en étiez.</h2>
          <p>
            Importez un JSON JARVIS, un export Transformation Yanis (Élite) /
            Émilie ou une sauvegarde HTML compatible. Aucun script importé n’est
            exécuté.
          </p>
          <Field label="Destination d’un ancien export">
            <Select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="elite">Profil Yanis uniquement</option>
              <option value="emilie">Profil Émilie uniquement</option>
            </Select>
          </Field>
          <input
            ref={input}
            hidden
            type="file"
            accept=".json,.html,application/json,text/html"
            onChange={(e) => readFile(e.target.files[0])}
          />
          <Button
            variant="secondary"
            icon="FolderOpen"
            onClick={() => input.current.click()}
          >
            Choisir une sauvegarde
          </Button>
          {importing && (
            <div className="import-preview">
              <Badge color="amber">CONFIRMATION REQUISE</Badge>
              <p>
                {importing.format === "jarvis-profile"
                  ? `La sauvegarde sera fusionnée dans le profil ${importing.profile.user.name}. L’autre profil restera intact. Les saisies locales sont prioritaires en cas de conflit.`
                  : importing.schemaVersion
                    ? "La sauvegarde remplacera les deux profils JARVIS."
                    : `L’ancien export sera intégré au profil ${target === "elite" ? "Yanis" : "Émilie"}. L’autre profil restera intact.`}
              </p>
              <p>
                Une copie de l’état actuel sera téléchargée avant le
                remplacement.
              </p>
              <Button variant="primary" icon="Check" onClick={applyImport}>
                Sauvegarder puis importer
              </Button>
              <button className="text-link" onClick={() => setImporting(null)}>
                Annuler
              </button>
            </div>
          )}
          <small>
            Le stockage des anciennes applications dans un autre navigateur ne
            peut pas être récupéré par ce fichier seul. Exportez d’abord leur
            JSON.
          </small>
        </Panel>
      </div>
      <div className="two-columns">
        <Panel>
          <SectionHeading title="Vérifier l’environnement" />
          <p className="small-subtitle">
            Test non destructif : stockage, calcul 1RM et disponibilité des API
            navigateur.
          </p>
          <Button
            variant="secondary"
            icon="ShieldCheck"
            onClick={async () => {
              const d = await storageDiagnostic();
              setDiagnostic({
                ...d,
                "Calcul 1RM (80 × 10)": estimate1RM(80, 10) === 106.7,
              });
            }}
          >
            Lancer le diagnostic
          </Button>
          {diagnostic && (
            <div className="diagnostic-results">
              {Object.entries(diagnostic).map(([k, v]) => (
                <div key={k}>
                  <Icon name={v ? "CircleCheck" : "Info"} size={16} />
                  <span>{k}</span>
                  <Badge color={v ? "mint" : "amber"}>
                    {v ? "Disponible / OK" : "Indisponible"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Panel>
        <Panel>
          <SectionHeading title="Archives préservées" />
          {p.importWarnings?.map((w, i) => (
            <p className="small-subtitle amber-text" key={i}>
              {w}
            </p>
          ))}
          <p className="small-subtitle">
            Les champs de vos anciens exports non normalisés sont conservés dans
            une archive brute, sans altération.
          </p>
          <Button
            variant="secondary"
            icon="Archive"
            disabled={!p.legacyArchive}
            onClick={() =>
              download(
                `Archive-source-${p.id}.json`,
                JSON.stringify(p.legacyArchive, null, 2),
              )
            }
          >
            Exporter l’archive source
          </Button>
          {p.archivedPlans?.length > 0 && (
            <Button
              variant="secondary"
              icon="CalendarRange"
              onClick={() =>
                download(
                  `Programmes-anterieurs-${p.id}.json`,
                  JSON.stringify(p.archivedPlans, null, 2),
                )
              }
            >
              Exporter les anciens programmes
            </Button>
          )}
          <p className="small-subtitle">
            Les deux fichiers HTML originaux restent intacts dans le dossier
            uploads du projet de travail.
          </p>
        </Panel>
      </div>
      <Panel className="data-danger">
        <div>
          <h3>Réinitialiser ce profil</h3>
          <p>
            Efface l’historique de {p.id === "elite" ? "Yanis" : "Émilie"} sur
            cet appareil, pas l’autre profil. Exportez avant de continuer.
          </p>
        </div>
        <Button
          variant="danger"
          icon="RotateCcw"
          onClick={() => setModal({ type: "reset-profile" })}
        >
          Réinitialiser {p.id === "elite" ? "Yanis" : "Émilie"}
        </Button>
      </Panel>
    </>
  );
}
