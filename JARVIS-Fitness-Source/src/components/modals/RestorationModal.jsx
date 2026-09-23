import React, { useState } from "react";
import { useApp } from "../../store/AppContext.jsx";
import { Modal, Button, Icon, Badge } from "../ui.jsx";
import { restoreProfile, restorationSummary } from "../../store/restoration.js";
import { exportState, isStorageProtected } from "../../store/storage.js";
export default function RestorationModal({ backup }) {
  const { state, update, closeModal, notify, navigate } = useApp(),
    [busy, setBusy] = useState(false);
  const sum = restorationSummary(backup);
  async function restore() {
    if (busy) return;
    setBusy(true);
    try {
      if (isStorageProtected())
        throw new Error(
          "Sauvegarde protégée : ouvrez Données et sauvegardez les copies originales avant de déverrouiller.",
        );
      const result = restoreProfile(state, backup);
      if (!result.alreadyApplied) {
        await exportState(state);
        result.state.activeProfile = backup.profileId;
        update(() => result.state);
      }
      notify(
        result.alreadyApplied
          ? "Cette sauvegarde a déjà été restaurée."
          : `${sum.sessions} séances et vos bilans sont retrouvés. Le profil Émilie reste intact.`,
      );
      closeModal();
      navigate("dashboard");
    } catch (e) {
      notify(e.message || "Restauration annulée.", "error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={`Restaurer la sauvegarde de ${sum.name}`}
      subtitle="Programme, journal, mesures, photos et retours d’équipe du fichier joint."
      onClose={closeModal}
      wide
    >
      <div className="restore-identity">
        <Icon name="DatabaseBackup" size={28} />
        <div>
          <strong>{sum.name}</strong>
          <p>Départ du programme : {sum.start || "à renseigner"}</p>
        </div>
        <Badge color="blue">PROFIL SEUL</Badge>
      </div>
      <div className="restore-counts">
        {[
          [sum.sessions, "séances de musculation"],
          [sum.enteredSets, "séries renseignées"],
          [sum.dayReports, "journées complémentaires"],
          [sum.checkIns, "bilans récupération"],
          [sum.weights, "pesées"],
          [sum.reviews, "bilans d’équipe"],
          [sum.photos, "photos J0"],
          [sum.force, "références de force"],
        ].map(([n, label]) => (
          <div key={label}>
            <b>{n}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="restore-notes">
        <p>
          <b>Les données locales ont priorité en cas de conflit.</b> Les saisies
          plus récentes sont conservées. Le calendrier sera remis sur la date et
          la logique du HTML ; le calendrier actuel sera archivé si nécessaire.
        </p>
        <p>
          Les {sum.incompleteSets} séries sans répétitions renseignées restent
          incomplètes. Les journées simplement cochées n’acquièrent pas de durée
          inventée. Les {sum.simulations} images M12 sont conservées comme
          simulations, pas comme progrès réels.
        </p>
        <p>
          Le bouton commence par exporter l’état actuel. La restauration ne
          modifie que <b>{sum.name}</b>, pas l’autre profil.
        </p>
      </div>
      <div className="modal-actions">
        <Button variant="secondary" onClick={closeModal}>
          Plus tard
        </Button>
        <Button
          variant="primary"
          icon="Import"
          disabled={busy}
          onClick={restore}
        >
          {busy ? "Restauration…" : "Sauvegarder puis restaurer Yanis"}
        </Button>
      </div>
    </Modal>
  );
}
