import React, { useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import {
  PageHeading,
  Panel,
  SectionHeading,
  Button,
  Icon,
  Badge,
} from "../components/ui.jsx";
import { assetSrc } from "../engine/utils.js";

const VISUAL_STYLE = "photo-face-v1";
const media = {
  man: "/visuals/jarvis-man-avatar.png",
  woman: "/visuals/jarvis-woman-avatar.png",
  gif: "/visuals/jarvis-curl-example.gif",
  video: "/visuals/jarvis-curl-example.mp4",
};
const coverage = [
  ["Dumbbell", "Musculation", "Chaque exercice conserve son mouvement et son matériel."],
  ["Zap", "Tabata & Aqua tabata", "Effort, récupération et cadence restent distincts."],
  ["Waves", "Piscine & metcon piscine", "Le bassin et la nage ont leur propre mise en scène."],
  ["Activity", "Vélo elliptique", "Cadence, posture et retour au calme ne sont pas mélangés."],
  ["Wind", "Échauffement & étirements", "Chaque étape garde sa consigne et son illustration."],
];

export default function Visuals() {
  const { p, updateProfile, notify } = useApp();
  const [selected, setSelected] = useState(p.preferences?.visualStyle || VISUAL_STYLE);
  const active = selected === VISUAL_STYLE;

  function chooseStyle() {
    updateProfile((profile) => {
      profile.preferences.visualStyle = VISUAL_STYLE;
    });
    setSelected(VISUAL_STYLE);
    notify("Style photo 3D sélectionné pour les nouvelles démonstrations.");
  }

  function chooseFormat(format) {
    updateProfile((profile) => {
      profile.preferences.visualFormat = format;
      profile.preferences.visualStyle = VISUAL_STYLE;
    });
    setSelected(VISUAL_STYLE);
    notify(`Préférence ${format === "gif" ? "GIF" : "vidéo"} enregistrée pour la prochaine génération.`);
  }

  return (
    <>
      <PageHeading
        eyebrow="DIRECTION ARTISTIQUE · APERÇU AVANT DÉPLOIEMENT"
        title="Le même corps. Un visage créé."
        description="Aperçu du style construit à partir de la nouvelle référence : rendu anatomique 3D monochrome, muscles actifs en vert et visage humain visible."
      >
        <a className="btn secondary" href={assetSrc("/visuals/jarvis-visual-preview.zip")} download>
          <Icon name="Download" size={17} />
          <span>Télécharger l’aperçu</span>
        </a>
        <Button variant={active ? "primary" : "secondary"} icon={active ? "CircleCheck" : "Sparkles"} onClick={chooseStyle}>
          {active ? "Style sélectionné" : "Choisir ce style"}
        </Button>
      </PageHeading>

      <Panel className="visuals-intro">
        <div className="visuals-intro-icon"><Icon name="Images" size={24} /></div>
        <div>
          <Badge color="mint" dot>RÉFÉRENCE PHOTO · V1</Badge>
          <h2>Une série visuelle cohérente, sans écran vide</h2>
          <p>
            Les visuels d’exercices restent pédagogiques : le geste, le matériel,
            la zone musculaire et la consigne sont conservés. Le rendu commun
            apporte le visage créé de l’homme et de la femme, sans remplacer la
            démonstration par une image générique.
          </p>
        </div>
      </Panel>

      <SectionHeading
        title="Exemples de personnages"
        subtitle="Deux silhouettes proposées dans le même langage visuel que la photo de référence."
      />
      <div className="visual-avatar-grid">
        <figure className="visual-avatar-card">
          <img src={assetSrc(media.man)} alt="Homme créé dans le style anatomique de la référence" />
          <figcaption><strong>Homme · visage créé</strong><span>Rendu 3D monochrome · activation verte</span></figcaption>
        </figure>
        <figure className="visual-avatar-card">
          <img src={assetSrc(media.woman)} alt="Femme créée dans le style anatomique de la référence" />
          <figcaption><strong>Femme · visage créé</strong><span>Même éclairage, même fond, mêmes repères</span></figcaption>
        </figure>
      </div>

      <SectionHeading
        title="Exemple d’exercice · curl haltères assis"
        subtitle="Même exercice, deux formats : GIF et vidéo. Les muscles verts indiquent la zone sollicitée."
      />
      <Panel className="visual-exercise-panel">
        <div className="visual-media-grid">
          <figure>
            <div className="visual-media-frame"><img src={assetSrc(media.gif)} alt="GIF animé du curl haltères assis" /></div>
            <figcaption><strong><Icon name="Images" size={15} /> Format GIF</strong><span>Lecture en boucle · léger · idéal pour les cartes</span><a href={assetSrc(media.gif)} download> Télécharger le GIF</a></figcaption>
          </figure>
          <figure>
            <div className="visual-media-frame"><video src={assetSrc(media.video)} controls loop muted playsInline preload="metadata" aria-label="Vidéo du curl haltères assis" /></div>
            <figcaption><strong><Icon name="Play" size={15} /> Format vidéo</strong><span>MP4 · contrôles · idéal dans la fiche exercice</span><a href={assetSrc(media.video)} download> Télécharger la vidéo</a></figcaption>
          </figure>
        </div>
        <div className="visual-choice-row">
          <div><Icon name="Check" size={18} /><span>Le mouvement reste identifiable du départ à la fin.</span></div>
          <div><Icon name="Check" size={18} /><span>Le visage, les proportions et l’éclairage restent cohérents.</span></div>
          <div><Icon name="Check" size={18} /><span>Le choix GIF/vidéo peut être confirmé avant la série complète.</span></div>
        </div>
      </Panel>

      <SectionHeading
        title="Périmètre prévu pour la série complète"
        subtitle="Le style ne supprime aucune famille ni aucune étape de séance."
      />
      <div className="visual-coverage-grid">
        {coverage.map(([icon, title, text]) => (
          <Panel key={title} className="visual-coverage-card">
            <Icon name={icon} size={21} />
            <div><strong>{title}</strong><p>{text}</p></div>
            <span className="coverage-check"><Icon name="Check" size={13} /></span>
          </Panel>
        ))}
      </div>

      <Panel className="visuals-next-step">
        <div><Badge color="amber" dot>ÉTAPE DE VALIDATION</Badge><h2>Quel format préférez-vous pour toute la bibliothèque ?</h2><p>Le GIF est plus léger et se lit immédiatement. La vidéo est plus nette, contrôlable et adaptée aux fiches détaillées.</p></div>
        <div className="visual-format-actions">
          <Button variant={p.preferences?.visualFormat === "gif" ? "primary" : "secondary"} icon="Images" onClick={() => chooseFormat("gif")}>Je préfère le GIF</Button>
          <Button variant={p.preferences?.visualFormat === "video" ? "primary" : "secondary"} icon="Play" onClick={() => chooseFormat("video")}>Je préfère la vidéo</Button>
        </div>
      </Panel>
    </>
  );
}
