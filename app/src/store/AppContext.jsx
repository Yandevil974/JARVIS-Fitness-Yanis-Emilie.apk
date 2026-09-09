import { bundledProfileBackup } from "../platform/native.js";
import { restoreProfile, personalDataPresent } from "./restoration.js";
import { nextWorkoutStep } from "../engine/workout-flow.js";
import {
  isAndroid,
  NativeSpeech,
  tactile,
  AndroidApp,
} from "../platform/native.js";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { loadState, saveState, saveOnExit } from "./storage.js";
import { prepareWorkout, nextSession } from "../engine/planner.js";
import { interpretCommand, applyCoachAction } from "../engine/coach.js";
import { createTimer } from "../engine/timer.js";
import { allSets, estimate1RM } from "../engine/fitness.js";
import { exerciseById } from "../data/library.js";
import { today, uid, num } from "../engine/utils.js";
import { actualSet, numeric } from "../engine/validation.js";
import { completePlanned } from "../engine/plan-memory.js";
const Context = createContext(null);
export const useApp = () => useContext(Context);
export function speak(text, enabled = true) {
  if (!enabled) return;
  if (isAndroid()) {
    NativeSpeech.speak({ text }).catch(() => {});
    return;
  }
  if (!globalThis.speechSynthesis) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = 0.98;
    const voice = speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("fr"));
    if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  } catch (e) {}
}
export function AppProvider({ children }) {
  const [state, setState] = useState(null),
    [page, setPage] = useState("dashboard"),
    [tab, setTab] = useState(null),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(null),
    [saving, setSaving] = useState({
      ok: true,
      mode: "initialisation",
      pending: true,
    }),
    [storageWarning, setStorageWarning] = useState(""),
    [bundledBackup, setBundledBackup] = useState(null),
    [restoreDismissed, setRestoreDismissed] = useState(false);
  const toastTimeout = useRef(),
    latest = useRef(),
    lastLog = useRef(0);
  latest.current = state;
  useEffect(() => {
    loadState().then(async ({ data, warning, blocked }) => {
      const backup =
        globalThis.__JARVIS_BUNDLED_BACKUP__ || (await bundledProfileBackup());
      if (backup) {
        setBundledBackup(backup);
        if (!blocked && !personalDataPresent(data.profiles[backup.profileId])) {
          try {
            const result = restoreProfile(data, backup);
            data = result.state;
            if (!result.alreadyApplied)
              data.profiles[backup.profileId].restoredAtStartup = true;
          } catch (e) {
            warning =
              warning ||
              "La sauvegarde jointe nécessite une restauration manuelle dans Profil.";
          }
        }
      }
      setState(data);
      setStorageWarning(warning);
    });
  }, []);
  useEffect(() => {
    if (!state) return;
    setSaving((s) => ({ ...s, pending: true }));
    const id = setTimeout(() => {
      saveState(state).then((result) => {
        if (latest.current === state) setSaving({ ...result, pending: false });
      });
    }, 150);
    return () => clearTimeout(id);
  }, [state]);
  useEffect(() => {
    const save = () => {
      if (latest.current) {
        saveOnExit(latest.current);
      }
    };
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, []);
  useEffect(() => {
    if (!isAndroid()) return;
    let listener,
      disposed = false;
    AndroidApp.addListener("backButton", async () => {
      if (modal) {
        setModal(null);
        return;
      }
      if (page !== "dashboard") {
        setPage("dashboard");
        setTab(null);
        return;
      }
      if (latest.current) {
        const result = await saveState(latest.current);
        if (!result.ok) {
          notify(
            result.error ||
              "Sauvegarde non confirmée. Exportez vos données avant de quitter.",
            "error",
          );
          return;
        }
      }
      AndroidApp.exitApp();
    }).then((h) => {
      if (disposed) h.remove();
      else listener = h;
    });
    return () => {
      disposed = true;
      listener?.remove();
    };
  }, [page, modal]);
  const p = state?.profiles[state.activeProfile];
  const notify = useCallback((message, type = "success") => {
    clearTimeout(toastTimeout.current);
    setToast({ message, type, id: uid() });
    toastTimeout.current = setTimeout(
      () => setToast(null),
      type === "record" ? 6000 : 4200,
    );
  }, []);
  const update = useCallback((fn) => {
    setSaving((s) => ({ ...s, pending: true }));
    setState((s) => {
      const copy = structuredClone(s);
      const next = fn(copy) || copy;
      next.updatedAt = Math.max(Date.now(), s.updatedAt + 1);
      return next;
    });
  }, []);
  const updateProfile = useCallback(
    (fn) =>
      update((s) => {
        const id = s.activeProfile;
        const result = fn(s.profiles[id]);
        if (result) s.profiles[id] = result;
      }),
    [update],
  );
  const navigate = useCallback((next, sub = null) => {
    setPage(next);
    setTab(sub);
    setModal(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const switchProfile = (id) => {
    if (id === state.activeProfile) return;
    update((s) => {
      s.activeProfile = id;
    });
    setModal(null);
    setPage("dashboard");
    setTab(null);
    notify(
      `Profil ${id === "emilie" ? "Émilie" : "Yanis"} activé · données séparées`,
    );
  };
  const startWorkout = (planned) => {
    if (p.checkIns[today()]?.painReported) {
      notify(
        "Douleur importante signalée aujourd’hui : ne lancez pas un nouvel effort. Consultez si nécessaire.",
        "error",
      );
      setModal({ type: "checkin" });
      return;
    }
    if (
      p.timer &&
      p.timer.meta.type !== "rest" &&
      p.timer.meta.type !== "warmup"
    ) {
      notify(
        "Terminez, confirmez ou arrêtez le protocole en cours avant la musculation.",
        "info",
      );
      setModal({ type: "timer" });
      return;
    }
    if (p.workout) {
      setModal(null);
      navigate("training", "session");
      notify("Votre séance en cours a été reprise.");
      return;
    }
    const workout = prepareWorkout(p, planned || nextSession(p));
    if (!workout.exercises.length) {
      notify(
        "Aucun exercice compatible. Vérifiez le matériel dans Profil.",
        "error",
      );
      return;
    }
    updateProfile((q) => {
      q.workout = workout;
    });
    setModal(null);
    navigate("training", "session");
    speak(
      "Séance prête. Prenez le temps de vous échauffer.",
      p.preferences.voice,
    );
  };
  const setTimer = (steps, meta) => {
    if (p.checkIns[today()]?.painReported) {
      notify(
        "Douleur importante signalée : pas de nouvel effort. En cas de malaise, demandez une aide médicale.",
        "error",
      );
      return;
    }
    if (p.workout && !["rest", "warmup"].includes(meta?.type)) {
      notify(
        "Clôturez votre musculation avant de lancer un autre protocole. Les séries seront conservées.",
        "info",
      );
      setModal({ type: "finish-workout" });
      return;
    }
    if (p.timer && (p.timer.meta.type !== "rest" || !p.timer.done)) {
      notify(
        "Un minuteur est déjà en cours. Terminez-le ou arrêtez-le avant d’en lancer un autre.",
        "error",
      );
      setModal({ type: "timer" });
      return;
    }
    updateProfile((q) => {
      q.timer = createTimer(steps, meta);
    });
    setModal({ type: "timer" });
    speak(steps[0]?.name || "Minuteur lancé.", p.preferences.voice);
  };
  const logSet = ({
    exerciseIndex,
    weight,
    reps,
    rpe,
    rir,
    unit,
    note = "",
  }) => {
    if (Date.now() - lastLog.current < 400) return false;
    const w = p.workout;
    if (p.timer && p.timer.meta.type !== "rest") {
      notify(
        "Validez ou arrêtez l’échauffement avant de saisir une série.",
        "info",
      );
      setModal({ type: "timer" });
      return false;
    }
    if (!w || w.safetyStop || p.checkIns[today()]?.painReported) {
      notify("La séance est suspendue ou indisponible.", "error");
      return false;
    }
    const target = w.exercises[exerciseIndex];
    if (!target) {
      notify("Exercice introuvable.", "error");
      return false;
    }
    if (target.unavailable) {
      notify(
        "Matériel indisponible : choisissez une alternative compatible ou terminez partiellement.",
        "error",
      );
      return false;
    }
    const ex = exerciseById(target.exerciseId);
    const count = target.sets.filter((s) => s.completed).length;
    if (count >= target.targetSets) {
      notify("Toutes les séries prévues sont déjà enregistrées.", "error");
      return false;
    }
    const r = num(reps),
      kg = num(weight),
      effort = num(rpe),
      remaining = num(rir);
    if (
      r == null ||
      r < 1 ||
      r > (ex.timed ? 3600 : 100) ||
      !Number.isInteger(r)
    ) {
      notify(
        "Renseignez un nombre entier de répétitions ou de secondes valide.",
        "error",
      );
      return false;
    }
    if (!ex.bodyweight && !ex.timed && (kg == null || kg < 0 || kg > 1000)) {
      notify("Renseignez la charge réellement utilisée.", "error");
      return false;
    }
    if (
      (effort != null && (effort < 1 || effort > 10)) ||
      (remaining != null && (remaining < 0 || remaining > 10))
    ) {
      notify("RPE : 1–10. RIR : 0–10.", "error");
      return false;
    }
    try {
      actualSet(
        {
          weight: ex.timed ? null : kg,
          reps: r,
          rpe: effort,
          rir: remaining,
          unit: unit || target.unit,
        },
        ex,
      );
    } catch (e) {
      notify(e.message, "error");
      return false;
    }
    lastLog.current = Date.now();
    tactile();
    const prior = allSets(p, { exerciseId: ex.id, unit: unit || target.unit });
    const best = Math.max(
      0,
      ...prior.map((s) => estimate1RM(s.weight, s.reps) || 0),
    );
    const est = ex.bodyweight || ex.timed ? null : estimate1RM(kg, r);
    const record = best > 0 && est != null && est > best;
    updateProfile((q) => {
      const t = q.workout.exercises[exerciseIndex];
      t.sets.push({
        id: uid(),
        weight: ex.timed ? null : kg,
        reps: r,
        rpe: effort,
        rir: remaining,
        unit: unit || target.unit,
        note,
        completed: true,
        createdAt: Date.now(),
      });
      t.unit = unit || t.unit;
      if (kg != null) t.targetLoad = kg;
      const flow = nextWorkoutStep(q.workout, exerciseIndex);
      q.workout.currentIndex = flow.index;
      if (record)
        q.notifications.unshift({
          id: uid(),
          date: today(),
          type: "record",
          text: `Nouveau 1RM estimé : ${ex.name}, ${est} kg.`,
          read: false,
        });
      if (flow.rest > 0)
        q.timer = createTimer(
          [
            {
              name: "Récupération prescrite",
              seconds: flow.rest,
              pattern: "breathe",
              kind: "rest",
            },
          ],
          { type: "rest", name: ex.name, workoutId: q.workout.id },
        );
    });
    notify(
      record
        ? `Nouveau record estimé · ${est} kg au 1RM`
        : `Série ${count + 1} enregistrée${est ? " · 1RM estimé " + est + " kg" : ""}`,
      record ? "record" : "success",
    );
    speak("Série enregistrée. Prenez votre récupération.", p.preferences.voice);
    return true;
  };
  const finishWorkout = (rpe, note, discard = false) => {
    if (!p.workout) return;
    try {
      numeric(rpe, 1, 10, "RPE de séance");
    } catch (e) {
      notify(e.message, "error");
      return;
    }
    const completed = p.workout.exercises.reduce(
      (n, e) => n + e.sets.filter((s) => s.completed).length,
      0,
    );
    if (!completed && !discard) {
      notify(
        "Aucune série réalisée. Vous pouvez quitter sans enregistrer.",
        "error",
      );
      return;
    }
    const full =
      p.workout.exercises.every(
        (e) => e.sets.filter((s) => s.completed).length >= e.targetSets,
      ) && !p.workout.safetyStop;
    updateProfile((q) => {
      const w = q.workout;
      if (!discard) {
        w.status = full ? "completed" : "partial";
        w.finishedAt = Date.now();
        /* La séance était datée de son lancement. Commencée un soir et
           validée après minuit, elle se rangeait la veille : le jour
           réel passait pour du repos et deux séances s'empilaient sur
           le précédent. On retient le jour où elle est terminée, qui
           est celui que l'on croit enregistrer. */
        const jourFin = today();
        if (w.date !== jourFin) {
          w.startedDate = w.date;
          w.date = jourFin;
        }
        w.durationSec = Math.max(
          1,
          Math.round((Date.now() - w.startedAt) / 1000),
        );
        w.rpe = num(rpe);
        w.note = note || "";
        q.sessions.push(w);
        if (w.planId) completePlanned(q, w.planId, w.status, w.date);
      }
      if (q.timer?.meta.workoutId === w.id || q.timer?.meta.type === "rest")
        q.timer = null;
      q.workout = null;
    });
    setModal(null);
    navigate("training", "history");
    notify(
      discard
        ? "Séance quittée sans résultat ajouté."
        : full
          ? "Séance terminée. Vos performances guideront la suivante."
          : "Séance partielle sauvegardée. Chaque série compte.",
    );
    speak(
      discard
        ? "Séance quittée sans résultat ajouté."
        : "Séance sauvegardée. Pensez au retour au calme.",
      p.preferences.voice,
    );
  };
  const sendCoach = (text) => {
    if (!String(text).trim()) return;
    text = String(text).slice(0, 1500);
    const answer = interpretCommand(p, text);
    let newProfile = p;
    if (answer.automatic && answer.action)
      newProfile = applyCoachAction(p, answer.action).profile;
    const a = {
      id: uid(),
      role: "assistant",
      text: answer.text,
      action: answer.action,
      choices: answer.choices,
      exerciseIds: answer.exerciseIds,
      navigate: answer.navigate,
      tab: answer.tab,
      applied: !!answer.automatic,
      createdAt: Date.now(),
    };
    updateProfile((q) => ({
      ...newProfile,
      messages: [
        ...q.messages,
        {
          id: uid(),
          role: "user",
          text: String(text).slice(0, 1500),
          createdAt: Date.now(),
        },
        a,
      ].slice(-100),
    }));
    speak(answer.text, p.preferences.voice);
  };
  const applyMessage = (message, extra = {}) => {
    try {
      const saved = p.messages.find((m) => m.id === message.id);
      if (!saved || saved.applied)
        throw new Error(
          "Cette demande est déjà appliquée ou n’est plus disponible.",
        );
      if (message.action?.type === "log") {
        setModal({ type: "log", data: message.action, messageId: message.id });
        return;
      }
      const { profile, detail } = applyCoachAction(p, message.action, extra);
      profile.messages = profile.messages.map((m) =>
        m.id === message.id ? { ...m, applied: true, result: detail } : m,
      );
      updateProfile(() => profile);
      notify(detail);
      speak(detail, p.preferences.voice);
    } catch (e) {
      notify(e.message, "error");
    }
  };
  useEffect(() => {
    const handler = (e) => notify(e.detail || "Export annulé.", "error");
    window.addEventListener("jarvis-export-error", handler);
    return () => window.removeEventListener("jarvis-export-error", handler);
  }, [notify]);
  const openExercise = (id) => setModal({ type: "exercise", exerciseId: id });
  const value = {
    state,
    bundledBackup,
    restoreDismissed,
    setRestoreDismissed,
    p,
    page,
    tab,
    modal,
    toast,
    saving,
    storageWarning,
    setStorageWarning,
    ready: !!state,
    update,
    updateProfile,
    notify,
    navigate,
    setTab,
    setModal,
    closeModal: () => setModal(null),
    switchProfile,
    startWorkout,
    setTimer,
    logSet,
    finishWorkout,
    sendCoach,
    applyMessage,
    openExercise,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
