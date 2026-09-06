import React, { useState } from "react";
import { useApp } from "../../store/AppContext.jsx";
import { Modal, Field, Input, Select, Button, Badge } from "../ui.jsx";
import { photoMetadata } from "../../engine/photo-metadata.js";
import { today } from "../../engine/utils.js";
export default function PhotoModal({ photoId }) {
  const { p, updateProfile, closeModal, notify } = useApp(),
    photo = p.photos.find((x) => x.id === photoId);
  const [form, setForm] = useState(
    photo
      ? {
          date: photo.date || "",
          view: photo.view || "face",
          label: photo.label || "",
          note: photo.note || "",
          simulated: !!photo.simulated,
        }
      : {},
  );
  if (!photo) return null;
  const locked =
    photo.source === "legacy-simulation" ||
    (!!photo.sourceReference && !!photo.simulated);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  function save(e) {
    e.preventDefault();
    try {
      const checked = photoMetadata(photo, form);
      updateProfile((q) => {
        const x = q.photos.find((p) => p.id === photoId);
        if (!x) throw new Error("Photo introuvable.");
        Object.assign(x, checked);
      });
      notify(
        "Informations de la photo corrigées. L’image d’origine est inchangée.",
      );
      closeModal();
    } catch (error) {
      notify(error.message, "error");
    }
  }
  return (
    <Modal
      title="Informations de la photo"
      subtitle="Ajoutez seulement les informations que vous connaissez. Le fichier image n’est pas modifié."
      onClose={closeModal}
    >
      <form onSubmit={save}>
        {locked && (
          <p className="source-completion-note">
            <Badge color="amber">SIMULATION SOURCE</Badge> Cette image M12 reste
            une simulation et ne peut pas devenir un résultat réel par simple
            changement d’étiquette.
          </p>
        )}
        <div className="form-grid">
          <Field label="Date de la photo (facultative)">
            <Input
              type="date"
              max={today()}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </Field>
          <Field label="Vue">
            <Select
              value={form.view}
              onChange={(e) => set("view", e.target.value)}
            >
              <option value="face">Face</option>
              <option value="profil">Profil</option>
              <option value="dos">Dos</option>
              <option value="compl">Complément</option>
            </Select>
          </Field>
        </div>
        <Field label="Repère / titre">
          <Input
            maxLength="80"
            value={form.label}
            placeholder="Ex. Jour 0, mois 1…"
            onChange={(e) => set("label", e.target.value)}
          />
        </Field>
        <Field label="Note">
          <textarea
            className="input"
            maxLength="1000"
            rows="3"
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
          />
        </Field>
        <label className="checkin-adaptation-option">
          <input
            type="checkbox"
            disabled={locked}
            checked={form.simulated}
            onChange={(e) => set("simulated", e.target.checked)}
          />
          <span>
            Illustration ou simulation, pas une photo de résultat réel
          </span>
        </label>
        <Button type="submit" variant="primary" icon="Check">
          Enregistrer les informations
        </Button>
      </form>
    </Modal>
  );
}
