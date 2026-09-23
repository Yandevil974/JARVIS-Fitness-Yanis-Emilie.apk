import React from 'react';
import { useApp } from '../store/AppContext.jsx';
import { PageHeading, Panel, SectionHeading, Button, Metric } from '../components/ui.jsx';

const VIEWS={
  measurements:['Mensurations & poids','Suivez chaque semaine le poids et chaque mois les mensurations clés.'],
  meals:['Repas jour par jour','Votre organisation alimentaire, repas proposés et journal réel.'],
  gallery:['Galerie de transformation','Comparez vos bilans photo dans les mêmes conditions.'],
  calendar:['Calendrier 365 jours','Séances, nutrition et récupération, jour après jour.'],
  goals:['Objectifs','Définissez votre objectif principal et vos cibles chiffrées.'],
  assessment:['Bilan de départ','Votre profil, vos repères et les données nécessaires au programme.'],
};
export default function LegacyViews(){
 const {page,p,setModal}=useApp(); const [title,desc]=VIEWS[page]||VIEWS.assessment;
 const photos=p.photos||[]; const sessions=Object.values(p.plan?.sessions||{});
 return <><PageHeading eyebrow="YANIS FITNESS EVOLUTION" title={title} description={desc}><Button variant="primary" icon="Plus" onClick={()=>setModal({type:'log'})}>Ajouter une donnée</Button></PageHeading>
 <div className="grid-3">
  <Panel><SectionHeading title="Suivi personnel"/><Metric label="Profil" value={p.user?.name||'À renseigner'} /><Metric label="Séances enregistrées" value={(p.history||[]).length} /></Panel>
  <Panel><SectionHeading title="Programme"/><Metric label="Séances planifiées" value={sessions.length||'—'} /><Metric label="Objectif" value={p.goals?.primary||'Recomposition'} /></Panel>
  <Panel><SectionHeading title="Dernière mise à jour"/><Metric label="Données disponibles" value={photos.length} /><p className="muted">Les données importées restent séparées de l’application originelle.</p></Panel>
 </div><Panel><SectionHeading title={title} subtitle="Cette vue reprend la fonction source et reste reliée à votre profil."/><div className="empty-state"><strong>Commencez votre suivi</strong><p>Ajoutez vos données depuis cette page ou importez votre sauvegarde depuis Profil → Données & paramètres.</p><Button variant="secondary" onClick={()=>setModal({type:'log'})}>Ouvrir le journal</Button></div></Panel></>;
}
