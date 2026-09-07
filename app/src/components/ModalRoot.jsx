import MoveScheduleModal from "./modals/MoveScheduleModal.jsx";
import PhotoModal from "./modals/PhotoModal.jsx";
import {
  removeScheduledFamily,
  scheduledFamily,
} from "../engine/schedule-group.js";
import { advanceTimer, pauseTimer } from "../engine/timer.js";
import {
  DayScheduleModal,
  SourceExtraModal,
  SourceExtraResultsModal,
} from "./modals/SourceExtraModals.jsx";
import RestorationModal from "./modals/RestorationModal.jsx";
import { findPlanned } from "../engine/plan-memory.js";
import React from "react";
import { useApp } from "../store/AppContext.jsx";
import { Modal, Confirm, Button, Icon, Empty, Badge } from "./ui.jsx";
import ExerciseModal from "./modals/ExerciseModal.jsx";
import {
  LogModal,
  ForceModal,
  FinishModal,
  EditSetModal,
  GeneratePlanModal,
  PlannedModal,
  ScheduleModal,
  HistorySessionModal,
} from "./modals/TrainingModals.jsx";
import {
  CheckinModal,
  MeasurementModal,
  ActivityModal,
  FoodModal,
} from "./modals/TrackingModals.jsx";
import {
  TimerModal,
  ProtocolModal,
  WarmupModal,
  CooldownModal,
  ImageModal,
  StretchModal,
} from "./modals/ProtocolModals.jsx";
import { newProfile } from "../store/model.js";
import {
  exportState,
  exportRecoveryData,
  unlockStorage,
} from "../store/storage.js";
export default function ModalRoot() {
  const {
    modal,
    p,
    state,
    updateProfile,
    update,
    setStorageWarning,
    closeModal,
    notify,
    setModal,
  } = useApp();
  if (!modal) return null;
  const m = modal;
  const map = {
    "move-scheduled": <MoveScheduleModal sessionId={m.sessionId} />,
    "edit-photo": <PhotoModal photoId={m.photoId} />,
    "day-schedule": <DayScheduleModal date={m.date} />,
    "source-extra": <SourceExtraModal event={m.event} />,
    "source-extra-results": (
      <SourceExtraResultsModal data={m.data} timerResult={m.timerResult} />
    ),
    "restore-profile": <RestorationModal backup={m.backup} />,
    exercise: <ExerciseModal key={m.exerciseId} id={m.exerciseId} />,
    log: <LogModal data={m.data} messageId={m.messageId} />,
    "force-test": <ForceModal testId={m.testId} />,
    "history-session": <HistorySessionModal sessionId={m.sessionId} />,
    "finish-workout": <FinishModal />,
    "edit-set": (
      <EditSetModal
        sessionId={m.sessionId}
        exerciseIndex={m.exerciseIndex}
        setId={m.setId}
      />
    ),
    "generate-plan": <GeneratePlanModal />,
    planned: <PlannedModal sessionId={m.sessionId} />,
    schedule: <ScheduleModal date={m.date} activityType={m.activityType} />,
    checkin: <CheckinModal date={m.date} />,
    measurement: <MeasurementModal measurementId={m.measurementId} />,
    "log-activity": (
      <ActivityModal
        data={m.data}
        timerResult={m.timerResult}
        activityId={m.activityId}
      />
    ),
    food: <FoodModal date={m.date} />,
    timer: <TimerModal />,
    protocol: <ProtocolModal protocolId={m.protocolId} level={m.level} />,
    warmup: <WarmupModal session={m.session} />,
    cooldown: <CooldownModal session={m.session} />,
    image: <ImageModal src={m.src} title={m.title} />,
    stretch: <StretchModal exercise={m.exercise} />,
  };
  if (map[m.type]) return map[m.type];
  if (m.type === "notifications")
    return (
      <Modal
        title="Votre centre d’attention"
        subtitle="Des informations utiles. Pas de bruit inutile."
        onClose={closeModal}
      >
        {p.notifications.length ? (
          <>
            <div className="notification-list">
              {p.notifications.map((n) => (
                <div key={n.id}>
                  <Icon
                    name={n.type === "record" ? "Trophy" : "Bell"}
                    size={21}
                  />
                  <div>
                    <p>{n.text}</p>
                    <small>{n.date}</small>
                  </div>
                  {!n.read && <i className="status-dot" />}
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                updateProfile((q) => {
                  q.notifications = q.notifications.map((n) => ({
                    ...n,
                    read: true,
                  }));
                })
              }
            >
              Tout marquer comme lu
            </Button>
          </>
        ) : (
          <Empty
            icon="BellRing"
            title="Tout est calme."
            text="Vos records et rappels pertinents apparaîtront ici. Les rappels système nécessitent l’application ouverte."
          />
        )}
      </Modal>
    );
  if (m.type === "unlock-storage")
    return (
      <Confirm
        title="Réactiver la sauvegarde avec l’état visible ?"
        description="Les copies originales détectées et l’état visible seront téléchargés séparément. Les copies incompatibles restent en quarantaine ; l’état visible deviendra la sauvegarde principale. Vérifiez vos fichiers téléchargés."
        label="Exporter les copies et réactiver"
        onClose={closeModal}
        onConfirm={() => {
          exportRecoveryData();
          exportState(state);
          unlockStorage();
          setStorageWarning("");
          update((s) => s);
          closeModal();
          notify(
            "Sauvegarde réactivée pour l’état visible. Conservez les copies téléchargées.",
          );
        }}
      />
    );
  if (m.type === "stop-timer" && p.timer?.meta.type === "source-combo")
    return (
      <Modal
        title="Arrêter la séance combinée ?"
        subtitle="Vous pouvez conserver le temps chronométré sans inventer la partie non effectuée."
        onClose={() => setModal({ type: "timer" })}
      >
        <p className="small-subtitle">
          Les résultats ne seront enregistrés qu’après votre confirmation. Le
          bloc piscine peut rester vide si vous ne l’avez pas fait.
        </p>
        <div className="modal-actions">
          <Button
            variant="secondary"
            onClick={() => {
              const t = advanceTimer(p.timer);
              const paused = t.done || t.paused ? t : pauseTimer(t);
              updateProfile((q) => {
                q.timer = paused;
              });
              setModal({
                type: "source-extra-results",
                data: paused.meta,
                timerResult: paused,
              });
            }}
          >
            Conserver mes résultats partiels
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              updateProfile((q) => {
                q.timer = null;
              });
              closeModal();
              notify("Minuteur arrêté sans résultat ajouté.");
            }}
          >
            Arrêter sans enregistrer
          </Button>
        </div>
      </Modal>
    );
  if (m.type === "stop-timer")
    return (
      <Confirm
        title="Arrêter ce minuteur ?"
        description="Le chrono sera arrêté sans ajouter de résultat à l’historique. Les séries de musculation déjà validées sont conservées."
        label="Arrêter sans enregistrer"
        danger
        onClose={() => setModal({ type: "timer" })}
        onConfirm={() => {
          updateProfile((q) => {
            q.timer = null;
          });
          closeModal();
          notify("Minuteur arrêté. Aucune activité ajoutée.");
        }}
      />
    );
  if (m.type === "reset-profile")
    return (
      <Confirm
        title={`Réinitialiser le profil ${p.id === "elite" ? "Yanis" : "Émilie"} ?`}
        description="Toutes les données de ce profil seront effacées de l’application et remplacées par ses réglages de départ. Une sauvegarde JSON de l’état actuel sera téléchargée avant. L’autre profil restera intact."
        danger
        label="Sauvegarder puis réinitialiser"
        onClose={closeModal}
        onConfirm={async () => {
          try {
            await exportState(state);
          } catch (e) {
            notify(
              "Réinitialisation annulée : sauvegarde non confirmée.",
              "error",
            );
            return;
          }
          updateProfile(() => newProfile(p.id));
          closeModal();
          notify(
            "Profil réinitialisé. Une sauvegarde de l’état précédent a été exportée.",
          );
        }}
      />
    );
  const deletes = {
    "delete-session": ["cette séance", "sessions"],
    "delete-photo": ["cette photo", "photos"],
    "delete-activity": ["cette activité", "activities"],
    "delete-planned": ["cette séance planifiée", null],
  };
  if (deletes[m.type]) {
    const [name, key] = deletes[m.type];
    return (
      <Confirm
        title={`Supprimer ${name} ?`}
        description={
          m.type === "delete-planned"
            ? "La séance et ses blocs planifiés liés seront retirés ensemble. Une séance déjà commencée ou avec un résultat ne sera pas supprimée ici. Les historiques restent conservés."
            : "Cette suppression sera sauvegardée. Les statistiques concernées seront recalculées. Vous pouvez exporter vos données avant de confirmer."
        }
        danger
        label="Confirmer la suppression"
        onClose={closeModal}
        onConfirm={() => {
          let nextPlan;
          if (!key) {
            try {
              nextPlan = removeScheduledFamily(p, m.id);
            } catch (error) {
              notify(error.message, "error");
              return;
            }
          }
          updateProfile((q) => {
            if (key) {
              if (key === "sessions" || key === "activities") {
                const item = q[key].find((s) => s.id === m.id);
                if (item?.planId) {
                  const planned = findPlanned(q, item.planId);
                  if (planned) planned.status = "planned";
                }
              }
              q[key] = q[key].filter((s) => s.id !== m.id);
            } else q.plan = nextPlan;
          });
          closeModal();
          notify("Suppression effectuée.");
        }}
      />
    );
  }
  return null;
}
