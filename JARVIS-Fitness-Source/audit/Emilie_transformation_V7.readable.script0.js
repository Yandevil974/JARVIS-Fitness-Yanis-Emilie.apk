/* ============================================================
   DONNÉES PROGRAMME — GB Performance amélioré (12 mois / 52 sem.)
   Codage exercices : [nom, muscle, séries, reps, tempo, repos(s), note]
   Muscles : pec,dos,epA,epL,epP,bic,tri,avb,abs,lom,fes,qua,isc,add,mol
   ============================================================ */
'use strict';

/* ============================================================
   ÉMILIE TRANSFORMATION — Programme féminin 12 mois / 52 semaines
   Profil cible : femme · 41 ans · 1,60 m · 66 kg · 4 séances/sem.
   Priorité : 🍑 FESSIERS → 🔥 VENTRE → 🦵 JAMBES → 💪 HAUT DU CORPS → ❤️ CONDITION
   Codage exercices : [nom, muscle, séries, reps, tempo, repos(s), note]
   Muscles : fes,moy,isc,qua,add,mol,abs,tra,lom,dos,epL,epP,epA,bic,tri,pec,avb
   ============================================================ */
'use strict';

/* Zones de volume hebdomadaire (séries utiles/semaine) calibrées pour un
   objectif esthétique féminin : fessiers en tête, quadriceps volontairement
   contenus pour éviter un développement disproportionné. */
const MUSCLES = {
  /* zone = fourchette de séries hebdomadaires visée par CE programme.
     Bornes calées sur le volume réellement programmé sur les 13 mois (audit),
     avec la marge de sécurité qui fait sens pour un objectif féminin :
     fessiers et moyen fessier en haut, quadriceps volontairement plafonnés,
     bras et épaules secondaires en simple volume d'entretien. */
  fes:{n:'Fessiers (grand fessier)', zone:[10,24], ic:'🍑', prio:1},
  moy:{n:'Moyen fessier (galbe latéral)', zone:[6,17], ic:'🍑', prio:1},
  isc:{n:'Ischio-jambiers', zone:[7,15], ic:'🦵', prio:2},
  abs:{n:'Abdominaux (grand droit)', zone:[8,18], ic:'🔥', prio:2},
  tra:{n:'Transverse / gainage profond', zone:[6,15], ic:'🧱', prio:2},
  dos:{n:'Dorsaux (posture)', zone:[8,15], ic:'🦍', prio:3},
  epL:{n:'Épaules latérales', zone:[2,8], ic:'🔷', prio:3},
  epP:{n:'Épaules postérieures', zone:[2,8], ic:'🔷', prio:3},
  qua:{n:'Quadriceps (volume contrôlé)', zone:[4,14], ic:'🦵', prio:4},
  mol:{n:'Mollets', zone:[2,6], ic:'🦶', prio:4},
  epA:{n:'Épaules antérieures', zone:[2,7], ic:'🟡', prio:4},
  bic:{n:'Biceps', zone:[2,6], ic:'💪', prio:4},
  tri:{n:'Triceps', zone:[2,6], ic:'💪', prio:4},
  lom:{n:'Lombaires', zone:[0,6], ic:'🔙', prio:4},
  pec:{n:'Pectoraux', zone:[3,8], ic:'🏋️', prio:5},
  add:{n:'Adducteurs', zone:[0,4], ic:'🦵', prio:5},
  avb:{n:'Avant-bras', zone:[0,4], ic:'🤜', prio:5}
};

const E = (n,m,s,r,t,rest,note)=>[n,m,s,r,t,rest,note||''];

/* ============================================================
   LES 5 GRANDS CYCLES FÉMININS (durée ajustable automatiquement)
   Chaque cycle contient les 4 séances hebdomadaires (+ 1 optionnelle).
   J1 🍑 Fessiers + ischios + abdominaux
   J2 💪 Haut du corps + ventre + cardio
   J3 🍑 Fessiers + jambes
   J4 🔥 Full body + fessiers + cardio
   J5 🍑 Rappel fessiers + abdos (uniquement si 5 séances/semaine)
   ============================================================ */

const CYCLES_F = [
  {id:'P1', nom:'PHASE 1 — ADAPTATION & ACTIVATION FESSIERS', mois:[1,2], type:'adaptation',
   desc:'Technique, amplitude, connexion neuro-musculaire fessière, gainage de base. On apprend à contracter le grand fessier avant de charger.',
   objectifF:'Réveiller le grand fessier et le moyen fessier, poser une technique propre, installer la sangle abdominale profonde.',
   progression:'Technique → amplitude → contrôle. Aucune augmentation de charge tant que la contraction n\'est pas ressentie.'},
  {id:'P2', nom:'PHASE 2 — RAFFERMISSEMENT & PROGRESSION DES CHARGES', mois:[3,5], type:'raffermissement',
   desc:'Double progression : on gagne d\'abord des répétitions, ensuite de la charge. Fessiers plus fermes, ventre plus tonique.',
   objectifF:'Densifier le muscle fessier, épaissir légèrement la sangle abdominale, tonifier le dos et les épaules.',
   progression:'Répétitions → charge. +2,5 % uniquement quand le haut de fourchette est atteint avec RIR ≤ 2.'},
  {id:'P3', nom:'PHASE 3 — DÉVELOPPEMENT PRIORITAIRE DES FESSIERS', mois:[6,8], type:'developpement',
   desc:'Volume fessier maximal (jusqu\'à 24 séries/semaine), hip thrust lourd 6-8 reps, techniques d\'intensification ciblées.',
   objectifF:'Construire le galbe : grand fessier plus épais, moyen fessier plus rond, hanches plus dessinées.',
   progression:'Charge → volume → techniques (myo-reps, 1,5 reps, drop set) uniquement sur les fessiers.'},
  {id:'P4', nom:'PHASE 4 — OPTIMISATION DE LA COMPOSITION CORPORELLE', mois:[9,11], type:'composition',
   desc:'On garde la force (hip thrust lourd) et on augmente la densité : bi-sets, repos courts, cardio fractionné. Révéler le muscle.',
   objectifF:'Réduire la masse grasse sans perdre le galbe : abdominaux visibles, taille affinée, fessiers conservés.',
   progression:'Densité + cardio. La charge ne baisse pas, le repos diminue.'},
  {id:'P5', nom:'PHASE 5 — STABILISATION & MAINTIEN', mois:[12,12], type:'maintien',
   desc:'Volume -20 %, intensité conservée, auto-régulation. On ancre les habitudes et on prépare l\'après-programme.',
   objectifF:'Stabiliser la silhouette obtenue, automatiser les bonnes habitudes, préparer un cycle de maintien durable.',
   progression:'Maintien + auto-régulation selon la fatigue et le ressenti.'}
];

/* ---------------------------------------------------------------------------
   SÉANCES DU CYCLE 1 (mois 1-2) — k = numéro du mois dans le cycle (1 ou 2)
   ------------------------------------------------------------------------- */
function sessP1(k){
  return {
    J1:{nom:'🍑 Fessiers + ischios + abdominaux', muscles:['fes','isc','moy','tra','abs','lom'],
      cardio:{apres:'elliptique', duree:12, detail:'Allure très facile (55-60 % FCM) pour relancer la circulation, sans entamer la récupération des fessiers.'},
      exos:[
        E('Pont fessier au sol — activation','fes',2,'15','2012',45,'Activation obligatoire : 2 s de contraction en haut, bassin neutre, ne cambrez pas les lombaires. Vous devez sentir le fessier, pas les ischios.'),
        E('Hip thrust barre','fes',2+k,'12-15','3112',90,'Pieds largeur de hanches, tibias verticaux en haut, menton rentré, côtes basses. 1 s de contraction en haut. La charge vient APRÈS la sensation.'),
        E('Soulevé de terre roumain haltères','isc',3,'12','3011',90,'Hinge : poussez les hanches loin derrière, genoux souples, dos neutre. Étirement maximal des ischios en bas.'),
        E('Bulgarian split squat','qua',3,'10/jambe','3010',75,'Buste légèrement penché en avant et talon bien ancré = recrutement fessier maximal plutôt que quadriceps.'),
        E('Leg curl machine (ou swiss-ball leg curl)','isc',3,'12-15','3011',60,'Pointes de pieds vers vous, bassin plaqué, pas de décollage des hanches.'),
        E('Abduction hanche debout à la poulie','moy',3,'15/côté','2011',45,'Moyen fessier = arrondi latéral. Buste droit, aucune rotation du bassin, montée lente.'),
        E('Kickback à la poulie','fes',3,'15/côté','2011',45,'Grand fessier isolé : jambe légèrement fléchie, montée contrôlée sans cambrer le bas du dos.'),
        E('Dead bug','tra',2,'10/côté','3010',45,'Transverse : lombaires plaquées au sol en permanence. Si le bas du dos décolle, réduisez l\'amplitude.'),
        E('Gainage planche','abs',2,'30-40 s','—',45,'Fessiers et abdominaux serrés, bassin neutre. Respirez normalement.'),
        E('Pallof press à l\'élastique','tra',1+k,'12/côté','2010',45,'Anti-rotation : stabilise la taille et affine visuellement le tour de taille.')
      ]},
    J2:{nom:'💪 Haut du corps + ventre + cardio', muscles:['dos','epL','epA','epP','pec','bic','tri','abs','tra'],
      cardio:{apres:'elliptique', duree:18, detail:'Cardio modéré 60-68 % FCM : vous pouvez parler par phrases courtes. Brûle des graisses sans gêner les fessiers (travaillés la veille et le surlendemain).'},
      exos:[
        E('Tirage vertical prise neutre','dos',2+k,'12-15','2011',75,'Tirez avec les coudes vers le bas, omoplates basses et serrées. Posture : poitrine ouverte.'),
        E('Rowing haltère un bras','dos',3,'12/côté','2011',60,'Coude le long du corps, pas de rotation du bassin. Épaisseur du dos.'),
        E('Développé militaire haltères assis','epA',3,'10-12','2011',75,'Épaules dessinées : montez sans cambrer, abdominaux gainés.'),
        E('Élévations latérales haltères','epL',3,'15','2011',45,'Charge légère, montée jusqu\'à l\'horizontale, petit doigt légèrement plus haut. Épaule ronde sans volume.'),
        E('Face pull à l\'élastique','epP',3,'15','2011',45,'Posture et santé d\'épaule : coudes hauts, omoplates serrées en fin de mouvement.'),
        E('Pompes inclinées (mains surélevées)','pec',3,'8-12','2010',60,'Corps gainé, coudes à 45°. Descendez jusqu\'à sentir l\'étirement.'),
        E('Curl haltères','bic',1+k,'12','2011',45,'Coudes fixes le long du corps, pas d\'élan.'),
        E('Extension triceps à la poulie','tri',1+k,'12','2011',45,'Coudes collés au corps, extension complète.'),
        E('Bird dog','tra',3,'10/côté','3010',30,'Gainage profond et posture : bassin immobile, bras et jambe alignés.'),
        E('Crunch à la poulie (ou au sol)','abs',3,'15','2011',45,'Enroulement de la colonne, pas de traction sur la nuque.')
      ]},
    J3:{nom:'🍑 Fessiers + jambes', muscles:['fes','moy','qua','isc','mol','abs','tra'],
      cardio:{apres:'piscine', duree:20, detail:'Option idéale : 20 min de nage souple ou d\'aquagym. Zéro impact, drainage des jambes, récupération active.'},
      exos:[
        E('Goblet squat','qua',2+k,'12','3011',90,'Quadriceps volontairement contrôlés : amplitude complète, genoux dans l\'axe des orteils, talons au sol.'),
        E('Hip thrust unilatéral (1 jambe)','fes',3,'12/côté','2112',75,'Symétrie : travaillez d\'abord le côté le plus faible, puis le même nombre de reps de l\'autre.'),
        E('Soulevé de terre roumain unilatéral haltère','isc',3,'10/côté','3011',60,'Ischios + moyen fessier + équilibre. Jambe d\'appui légèrement fléchie.'),
        E('Fentes arrière alternées','fes',3,'10/jambe','3010',75,'Pas long et buste penché en avant = fessiers. Pas court et buste droit = quadriceps.'),
        E('Step-up sur banc (hauteur du genou)','qua',3,'10/jambe','2011',60,'Poussez avec le talon du pied sur le banc, ne vous aidez pas de la jambe au sol.'),
        E('Abduction assise (machine ou élastique)','moy',3,'20','2011',40,'Séries longues : le moyen fessier répond très bien aux reps élevées et à la brûlure.'),
        E('Clamshell à l\'élastique','moy',3,'15/côté','2011',40,'Bassin stable, montée du genou seule. Activation pure du moyen fessier.'),
        E('Mollets debout unilatéraux','mol',3,'15','2112',45,'Amplitude complète : talon qui descend bas, 1 s de contraction en haut.'),
        E('Reverse crunch','abs',3,'12','2011',45,'Bas du ventre : enroulez le bassin vers la poitrine, sans élan.'),
        E('Gainage latéral','tra',2,'30 s/côté','—',30,'Taille visuellement plus fine : obliques toniques sans épaississement.')
      ]},
    J4:{nom:'🔥 Full body + fessiers + cardio', muscles:['fes','isc','pec','dos','qua','abs','tra'],
      cardio:{apres:'elliptique', duree:20, detail:'Format fractionné court : 6 × 30 s rapide (RPE 7-8) + 90 s très facile. 5 min d\'échauffement et 3 min de retour au calme.'},
      exos:[
        E('Hip thrust barre','fes',3,'10-12','3112',90,'Rappel fessier : même technique que J1, charge confortable, focus sur la contraction.'),
        E('Soulevé de terre roumain haltères','isc',3,'10','3011',90,'Chaîne postérieure complète.'),
        E('Développé couché haltères','pec',3,'10-12','2011',75,'Coudes à 45°, descente contrôlée.'),
        E('Tirage horizontal à la poulie','dos',3,'12','2011',75,'Buste fixe, tirez vers le nombril.'),
        E('Bulgarian split squat','qua',2,'8/jambe','3010',60,'Rappel unilatéral, charge légère, technique parfaite.'),
        E('Relevés de jambes allongée','abs',3,'12','2011',45,'Lombaires plaquées : si le bas du dos décolle, pliez davantage les genoux.'),
        E('Mountain climbers','tra',3,'30 s','—',45,'Gainage dynamique + dépense énergétique. Bassin bas, épaules au-dessus des poignets.')
      ]},
    J5:{nom:'🍑 Rappel fessiers + abdominaux (séance légère)', muscles:['fes','moy','tra','abs'],
      cardio:{apres:'piscine', duree:30, detail:'30 min de piscine à allure libre : nage, aquagym ou marche dans l\'eau. Récupération active idéale.'},
      exos:[
        E('Glute bridge pieds sur banc','fes',3,'15','2012',60,'Contraction 2 s en haut, sans hyperextension lombaire.'),
        E('Abduction hanche à l\'élastique','moy',3,'20/côté','2011',45,'Séries longues, brûlure ciblée sur le moyen fessier.'),
        E('Kickback à l\'élastique','fes',3,'15/côté','2011',45,'Volume fessier sans fatigue nerveuse.'),
        E('Dead bug','tra',3,'10/côté','3010',45),
        E('Gainage planche','abs',3,'40 s','—',45)
      ]}
  };
}

/* ---------------------------------------------------------------------------
   SÉANCES DU CYCLE 2 (mois 3-5) — Raffermissement & progression des charges
   ------------------------------------------------------------------------- */
function sessP2(k){
  const s2 = k>1?1:0, s3 = k>2?1:0;
  return {
    J1:{nom:'🍑 Fessiers + ischios + abdominaux', muscles:['fes','isc','moy','tra','abs','lom'],
      cardio:{apres:'elliptique', duree:15, detail:'Allure modérée 60-68 % FCM. Court, pour ne pas retarder la récupération des fessiers.'},
      exos:[
        E('Hip thrust barre','fes',3+s2,'10-12','2112',120,'Pause de 1 à 2 s en haut sur chaque rep, contraction maximale. C\'est l\'exercice n°1 du galbe : progressez ici en priorité.'),
        E('Soulevé de terre roumain barre','isc',3+s3,'10-12','3011',105,'Descendez jusqu\'à l\'étirement complet des ischios, dos neutre, barre au contact des cuisses.'),
        E('Bulgarian split squat','qua',3,'10/jambe','3010',90,'Buste penché en avant, talon ancré : priorité fessiers.'),
        E('Leg curl machine','isc',3+s3,'12-15','3011',60),
        E('Abduction hanche à la poulie','moy',4,'15/côté','2011',45,'Moyen fessier : arrondi latéral et stabilité de hanche.'),
        E('Kickback à la poulie','fes',3+s2,'15/côté','2011',45),
        E('Fire hydrant à l\'élastique','moy',3,'15/côté','2011',40,'Petit et moyen fessiers : galbe du haut de la fesse.'),
        /* Tronc : stimulations COURTES — jamais de longue séance d'abdominaux.
           Le crunch à la poulie de ce créneau est reporté sur J3/J4. */
        E('Dead bug avec rotation','tra',3,'12/côté','3010',45,'Transverse + obliques profonds : ventre plat et taille tenue.'),
        E('Gainage planche','abs',2,'45 s','—',45),
        E('Pallof press à la poulie','tra',2,'12/côté','2010',45)
      ]},
    J2:{nom:'💪 Haut du corps + ventre + cardio', muscles:['dos','epL','epA','epP','pec','bic','tri','abs','tra'],
      cardio:{apres:'elliptique', duree:22, detail:'Cardio modéré 62-70 % FCM, 20-25 min. Zone lipolyse : on puise dans les graisses sans stress pour les fessiers.'},
      exos:[
        E('Tirage vertical prise large','dos',4,'10-12','2011',90,'Dos large et posture : coudes vers le bas et l\'arrière.'),
        E('Rowing barre buste penché','dos',3+s2,'10-12','2011',90,'Buste à 45°, pas d\'élan avec les reins.'),
        E('Développé militaire haltères assis','epA',3,'10-12','2011',75),
        E('Élévations latérales haltères','epL',4,'12-15','2011',45,'Épaules légèrement dessinées : reps élevées, charge modérée.'),
        E('Face pull à la poulie','epP',3,'15','2011',45),
        E('Développé incliné haltères','pec',3,'10-12','2011',75),
        E('Curl haltères','bic',3,'12','2011',45),
        E('Extension triceps à la poulie','tri',3,'12','2011',45),
        E('Bird dog','tra',2,'12/côté','3010',30),
        E('Reverse crunch','abs',3,'12','2011',45),
        E('Pallof press à la poulie','tra',2,'12/côté','2010',45)
      ]},
    J3:{nom:'🍑 Fessiers + jambes', muscles:['fes','moy','qua','isc','mol','abs','tra'],
      cardio:{apres:'piscine', duree:25, detail:'25 min de nage ou d\'aquagym : cardio sans impact, drainage et récupération des jambes.'},
      exos:[
        E('Back squat (charge modérée)','qua',3,'10-12','3011',120,'Quadriceps contrôlés : ne cherchez pas la charge maximale, descendez sous la parallèle en gardant le buste droit.'),
        E('Hip thrust unilatéral','fes',3,'10/côté','2112',90,'Symétrie des fessiers : commencez par le côté faible.'),
        E('Soulevé de terre roumain unilatéral','isc',3,'10/côté','3011',75),
        E('Fentes avant alternées','fes',3,'10/jambe','3010',75),
        E('Presse à cuisses pieds hauts','qua',3,'12','3011',75,'Pieds hauts et écartés sur le plateau : transfert du travail vers les fessiers et les ischios.'),
        E('Abduction assise machine','moy',4,'20','2011',40),
        E('Clamshell à l\'élastique','moy',3,'15/côté','2011',40),
        E('Mollets assis','mol',3,'15-20','2112',45,'Soléaire : amplitude complète, 2 s en position étirée.'),
        E('Relevés de jambes','abs',3,'12','2011',45),
        E('Gainage latéral','tra',3,'30 s/côté','—',30)
      ]},
    J4:{nom:'🔥 Full body + fessiers + cardio', muscles:['fes','isc','pec','dos','qua','moy','abs','tra'],
      cardio:{apres:'elliptique', duree:22, detail:'Fractionné : 8 × 30 s rapide (RPE 7-8) + 90 s très facile, encadré de 5 min d\'échauffement et 3 min de retour au calme.'},
      exos:[
        E('Hip thrust barre','fes',3,'8-10','3012',120,'Séance « charge » : c\'est ici que le hip thrust progresse le plus.'),
        E('Soulevé de terre roumain haltères','isc',3,'10','3011',90),
        E('Développé couché haltères','pec',3,'10-12','2011',75),
        E('Rowing haltère un bras','dos',3,'12/côté','2011',60),
        E('Bulgarian split squat','qua',3,'8/jambe','3010',75),
        E('Abduction hanche à la poulie','moy',3,'20/côté','2011',45),
        E('Circuit gainage (planche + latéral + bird dog)','abs',3,'45 s','—',45)
      ]},
    J5:{nom:'🍑 Rappel fessiers + abdominaux (séance légère)', muscles:['fes','moy','tra','abs'],
      cardio:{apres:'piscine', duree:30, detail:'30 min de piscine libre ou de repos actif (marche 30-40 min).'},
      exos:[
        E('Glute bridge pieds sur banc','fes',4,'15','2012',60),
        E('Abduction hanche à l\'élastique','moy',3,'20/côté','2011',45),
        E('Kickback à l\'élastique','fes',3,'15/côté','2011',45),
        E('Dead bug','tra',2,'12/côté','3010',45),
        E('Pallof press à l\'élastique','tra',2,'12/côté','2010',45),
        E('Gainage planche','abs',3,'45 s','—',45)
      ]}
  };
}

/* ---------------------------------------------------------------------------
   SÉANCES DU CYCLE 3 (mois 6-8) — Développement prioritaire des fessiers
   ------------------------------------------------------------------------- */
function sessP3(k){
  const s2 = k>1?1:0, s3 = k>2?1:0;
  return {
    J1:{nom:'🍑 Fessiers lourds + ischios + abdominaux', muscles:['fes','isc','moy','tra','abs','lom'],
      cardio:{apres:'elliptique', duree:12, detail:'Très court et très facile (55-60 % FCM). En phase de développement fessier, le cardio est volontairement réduit pour préserver la récupération.'},
      exos:[
        E('Hip thrust barre','fes',4+s2,'6-8','3012',150,'Charge principale de la semaine (78-85 %). Contraction 1 s en haut, menton rentré, côtes basses. Jamais de charge au détriment de la technique.'),
        E('Soulevé de terre roumain barre','isc',4,'8-10','3011',120,'Ischios et grand fessier en étirement : c\'est ce qui donne la fermeté sous la fesse.'),
        E('Bulgarian split squat haltères','qua',4,'8-10/jambe','3010',90,'Unilatéral lourd : corrige les asymétries et galbe la fesse.'),
        E('Glute bridge en 1,5 reps','fes',3+s3,'10-12','2112',75,'1 rep = montée complète + redescente à mi-course + remontée. Temps sous tension maximal sur le grand fessier.'),
        E('Leg curl machine','isc',4,'10-12','3011',60),
        E('Abduction hanche à la poulie — myo-reps','moy',3,'12-15 + myo','2011',45,'Myo-reps : 1 série de 12-15 reps proche de l\'échec, puis 4 mini-séries de 3-5 reps avec 15 s de repos. Moyen fessier = arrondi latéral.'),
        E('Kickback à la poulie — drop set final','fes',3+s2,'12-15/côté','2011',45,'Sur la dernière série : retirez 30 % de la charge et enchaînez jusqu\'à l\'échec technique.'),
        E('Pallof press à la poulie','tra',2,'12/côté','2010',45),
        E('Crunch à la poulie','abs',3,'15','2011',45,'Résistance progressive : abdominaux légèrement visibles.'),
        E('Gainage planche','abs',2,'45-60 s','—',45)
      ]},
    J2:{nom:'💪 Haut du corps + ventre + cardio', muscles:['dos','epL','epA','epP','pec','bic','tri','abs','tra'],
      cardio:{apres:'elliptique', duree:18, detail:'Cardio modéré 60-68 % FCM, 15-20 min. Réduit cette semaine pour laisser toute la récupération aux fessiers.'},
      exos:[
        E('Tirage vertical prise large','dos',4,'8-10','2011',105,'Dos : progression de charge normale (double progression).'),
        E('Rowing barre buste penché','dos',4,'8-10','2011',105),
        E('Développé militaire haltères assis','epA',3,'10-12','2011',90),
        E('Élévations latérales haltères — myo-reps','epL',3,'12-15 + myo','2011',45,'Épaules légèrement dessinées : myo-reps légers, sensation de brûlure, jamais lourd.'),
        E('Face pull à la poulie','epP',3,'15','2011',45),
        E('Développé incliné haltères','pec',3,'10-12','2011',75),
        E('Rowing haltère un bras','dos',3,'10/côté','2011',60),
        E('Curl haltères','bic',3,'10-12','2011',45),
        E('Extension triceps à la poulie','tri',3,'10-12','2011',45),
        E('Dead bug','tra',3,'12/côté','3010',45),
        E('Pallof press à la poulie','tra',3,'12/côté','2010',45)
      ]},
    J3:{nom:'🍑 Fessiers + jambes — galbe & unilatéral', muscles:['fes','moy','qua','isc','mol','abs','tra'],
      cardio:{apres:'piscine', duree:25, detail:'25 min de piscine : nage souple ou aquagym. Récupération active sans impact après une séance jambes chargée.'},
      exos:[
        E('Back squat','qua',4,'8-10','3011',135,'Charge modérée à lourde mais maîtrisée : l\'objectif reste le galbe, pas la performance en squat.'),
        E('Hip thrust unilatéral lesté','fes',4,'8/côté','2112',105,'Grand fessier en unilatéral lourd : symétrie et galbe.'),
        E('Soulevé de terre roumain unilatéral','isc',3,'10/côté','3011',75),
        E('Fentes bulgares (pied arrière surélevé)','fes',4,'8-10/jambe','3010',90,'Buste penché en avant, grand pas : fessiers et ischios en priorité.'),
        E('Presse à cuisses pieds hauts','qua',3,'12','3011',75),
        E('Abduction assise en 1,5 reps','moy',4,'15','2011',40,'1,5 reps : ouverture complète + demi-fermeture + réouverture. Volume ciblé moyen fessier.'),
        E('Clamshell à l\'élastique','moy',3,'20/côté','2011',40),
        E('Mollets debout unilatéraux','mol',4,'12-15','2112',45,'Mollets harmonieux : amplitude complète, 2 s de contraction.'),
        E('Reverse crunch','abs',3,'15','2011',45),
        E('Gainage latéral dynamique','tra',3,'30 s/côté','—',30)
      ]},
    J4:{nom:'🔥 Full body + fessiers + cardio', muscles:['fes','isc','pec','dos','qua','moy','abs','tra'],
      cardio:{apres:'elliptique', duree:24, detail:'Fractionné : 8-10 × 30 s rapide + 90 s très facile. Dépense énergétique élevée sans détruire la récupération.'},
      exos:[
        E('Hip thrust barre','fes',3,'10-12','3012',120,'Troisième stimulation fessière de la semaine : charge modérée, reps hautes, congestion.'),
        E('Soulevé de terre roumain haltères','isc',3,'10','3011',90),
        E('Développé couché haltères','pec',3,'10-12','2011',75),
        E('Tirage vertical prise neutre','dos',3,'12','2011',75),
        E('Bulgarian split squat','qua',3,'10/jambe','3010',75),
        E('Abduction hanche à l\'élastique','moy',3,'20/côté','2011',45),
        E('Circuit abdominaux (crunch + relevés + gainage)','abs',3,'45 s','—',45)
      ]},
    J5:{nom:'🍑 Rappel fessiers + abdominaux (séance légère)', muscles:['fes','moy','tra','abs'],
      cardio:{apres:'piscine', duree:30, detail:'30 min de piscine ou marche active 40 min. Optionnel si la fatigue est élevée.'},
      exos:[
        E('Glute bridge pieds sur banc','fes',4,'15','2012',60),
        E('Abduction hanche à la poulie','moy',4,'15/côté','2011',45),
        E('Kickback à la poulie','fes',3,'15/côté','2011',45),
        E('Dead bug avec rotation','tra',2,'12/côté','3010',45),
        E('Pallof press à la poulie','tra',2,'12/côté','2010',45),
        E('Gainage planche','abs',3,'60 s','—',45)
      ]}
  };
}

/* ---------------------------------------------------------------------------
   SÉANCES DU CYCLE 4 (mois 9-11) — Optimisation de la composition corporelle
   ------------------------------------------------------------------------- */
function sessP4(k){
  const s2 = k>1?1:0;
  return {
    J1:{nom:'🍑 Fessiers + ischios + abdominaux (bi-sets)', muscles:['fes','isc','moy','tra','abs','lom'],
      cardio:{apres:'elliptique', duree:15, detail:'15 min modéré à 65-70 % FCM en fin de séance, ou 20 min de marche rapide inclinée.'},
      exos:[
        E('Hip thrust barre','fes',4,'6-8','3012',150,'On GARDE la force : le hip thrust lourd est ce qui préserve le galbe pendant le déficit calorique.'),
        E('Soulevé de terre roumain barre','isc',3+s2,'8-10','3011',105,'Bi-set A1 : enchaînez directement avec l\'abduction hanche, puis repos 90 s.'),
        E('Abduction hanche à la poulie','moy',3+s2,'15/côté','2011',90,'Bi-set A2 : densité fessière sans ajouter de fatigue nerveuse.'),
        E('Bulgarian split squat','qua',3,'10/jambe','3010',75),
        E('Leg curl machine','isc',3,'12-15','3011',60,'Bi-set B1 : enchaînez avec le kickback.'),
        E('Kickback à la poulie','fes',3,'15/côté','2011',60,'Bi-set B2.'),
        E('Glute bridge en 1,5 reps','fes',3,'12-15','2012',60),
        E('Pallof press à la poulie','tra',2,'12/côté','2010',45),
        E('Crunch à la poulie','abs',3,'15-20','2011',45,'Résistance progressive : abdominaux légèrement visibles pendant le déficit.'),
        E('Gainage planche','abs',2,'45-60 s','—',45)
      ]},
    J2:{nom:'💪 Haut du corps + ventre + cardio (bi-sets)', muscles:['dos','epL','epA','epP','pec','bic','tri','abs','tra'],
      cardio:{apres:'elliptique', duree:28, detail:'Cardio modéré 65-72 % FCM, 25-30 min. C\'est la séance cardio la plus longue de la semaine : pas de fessiers lourds la veille.'},
      exos:[
        E('Tirage vertical prise large','dos',4,'10-12','2011',60,'Bi-set A1 : enchaînez avec le développé militaire.'),
        E('Développé militaire haltères assis','epA',4,'10-12','2011',75,'Bi-set A2.'),
        E('Rowing barre buste penché','dos',3+s2,'10-12','2011',60,'Bi-set B1.'),
        E('Élévations latérales haltères','epL',3+s2,'12-15','2011',60,'Bi-set B2.'),
        E('Face pull à la poulie','epP',3,'15','2011',45),
        E('Développé incliné haltères','pec',3,'10-12','2011',60),
        E('Curl haltères','bic',3,'12','2011',45),
        E('Extension triceps à la poulie','tri',3,'12','2011',45),
        E('Dead bug avec rotation','tra',2,'12/côté','3010',45),
        E('Reverse crunch','abs',3,'15','2011',45),
        E('Pallof press à la poulie','tra',2,'12/côté','2010',45)
      ]},
    J3:{nom:'🍑 Fessiers + jambes (densité)', muscles:['fes','moy','qua','isc','mol','abs','tra'],
      cardio:{apres:'piscine', duree:25, detail:'25 min de piscine à allure soutenue : le cardio sans impact par excellence en phase de composition.'},
      exos:[
        E('Back squat','qua',3,'10-12','3011',90,'Repos réduit : on garde le stimulus quadriceps sans excès.'),
        E('Hip thrust unilatéral','fes',3+s2,'10/côté','2112',75),
        E('Soulevé de terre roumain unilatéral','isc',3,'10/côté','3011',60),
        E('Fentes arrière alternées','fes',3,'12/jambe','3010',60),
        E('Presse à cuisses pieds hauts','qua',3,'12-15','3011',60),
        E('Abduction assise machine','moy',4,'20','2011',35),
        E('Clamshell à l\'élastique','moy',3,'20/côté','2011',35),
        E('Mollets assis','mol',3,'15-20','2112',40),
        E('Relevés de jambes','abs',3,'15','2011',40),
        E('Gainage latéral','tra',3,'30 s/côté','—',30)
      ]},
    J4:{nom:'🔥 Full body + fessiers + cardio (circuit)', muscles:['fes','isc','pec','dos','qua','moy','abs','tra'],
      cardio:{apres:'elliptique', duree:26, detail:'Fractionné soutenu : 10 × 30 s rapide (RPE 8) + 60 s très facile. Meilleure séance de dépense énergétique de la semaine.'},
      exos:[
        E('Hip thrust barre','fes',3,'10-12','3012',90,'Rappel fessier en circuit : repos courts, charge stable.'),
        E('Soulevé de terre roumain haltères','isc',3,'10','3011',75),
        E('Développé couché haltères','pec',3,'12','2011',60),
        E('Tirage horizontal à la poulie','dos',3,'12','2011',60),
        E('Bulgarian split squat','qua',3,'10/jambe','3010',60),
        E('Abduction hanche à la poulie','moy',3,'20/côté','2011',45),
        E('Circuit abdominaux (crunch + relevés + gainage)','abs',4,'45 s','—',45)
      ]},
    J5:{nom:'🍑 Rappel fessiers + abdominaux (séance légère)', muscles:['fes','moy','tra','abs'],
      cardio:{apres:'piscine', duree:30, detail:'30 min de piscine ou repos actif (marche 40 min).'},
      exos:[
        E('Glute bridge pieds sur banc','fes',3,'20','2012',45),
        E('Abduction hanche à l\'élastique','moy',3,'25/côté','2011',35),
        E('Kickback à l\'élastique','fes',3,'20/côté','2011',35),
        E('Dead bug','tra',3,'12/côté','3010',45),
        E('Gainage planche','abs',3,'45 s','—',45)
      ]}
  };
}

/* ---------------------------------------------------------------------------
   SÉANCES DU CYCLE 5 (mois 12) — Stabilisation & maintien
   ------------------------------------------------------------------------- */
function sessP5(){
  return {
    J1:{nom:'🍑 Fessiers + ischios + abdominaux (maintien)', muscles:['fes','isc','moy','tra','abs','lom'],
      cardio:{apres:'elliptique', duree:15, detail:'15 min modéré 60-68 % FCM. Entretien de la condition sans fatigue.'},
      exos:[
        E('Hip thrust barre','fes',3,'8-10','3012',120,'Maintien de la force : gardez la charge atteinte, RPE 7. C\'est elle qui verrouille le galbe.'),
        E('Soulevé de terre roumain barre','isc',3,'10','3011',105),
        E('Bulgarian split squat','qua',3,'10/jambe','3010',75),
        E('Leg curl machine','isc',3,'12-15','3011',60),
        E('Abduction hanche à la poulie','moy',3,'15/côté','2011',45),
        E('Kickback à la poulie','fes',3,'15/côté','2011',45),
        E('Pallof press à la poulie','tra',3,'12/côté','2010',45),
        E('Gainage planche','abs',3,'60 s','—',45)
      ]},
    J2:{nom:'💪 Haut du corps + ventre + cardio', muscles:['dos','epL','epA','epP','pec','bic','tri','abs','tra'],
      cardio:{apres:'elliptique', duree:25, detail:'25 min modéré 60-70 % FCM. Condition physique durable.'},
      exos:[
        E('Tirage vertical prise large','dos',3,'10-12','2011',90),
        E('Rowing barre buste penché','dos',3,'10-12','2011',90),
        E('Développé militaire haltères assis','epA',3,'10-12','2011',75),
        E('Élévations latérales haltères','epL',3,'12-15','2011',45),
        E('Face pull à la poulie','epP',3,'15','2011',45),
        E('Curl haltères','bic',2,'12','2011',45),
        E('Extension triceps à la poulie','tri',2,'12','2011',45),
        E('Dead bug','tra',3,'12/côté','3010',45),
        E('Crunch à la poulie','abs',3,'15','2011',45)
      ]},
    J3:{nom:'🍑 Fessiers + jambes (maintien)', muscles:['fes','moy','qua','isc','mol','abs','tra'],
      cardio:{apres:'piscine', duree:25, detail:'25 min de piscine plaisir : l\'habitude à conserver après le programme.'},
      exos:[
        E('Back squat','qua',3,'10-12','3011',105),
        E('Hip thrust unilatéral','fes',3,'10/côté','2112',90),
        E('Soulevé de terre roumain unilatéral','isc',3,'10/côté','3011',75),
        E('Fentes arrière alternées','fes',3,'10/jambe','3010',75),
        E('Abduction assise machine','moy',3,'20','2011',40),
        E('Mollets debout unilatéraux','mol',3,'15','2112',45),
        E('Reverse crunch','abs',3,'15','2011',45),
        E('Gainage latéral','tra',3,'30 s/côté','—',30)
      ]},
    J4:{nom:'🔥 Full body + fessiers + cardio', muscles:['fes','isc','pec','dos','qua','abs','tra'],
      cardio:{apres:'elliptique', duree:20, detail:'20 min au choix : 6 × 30 s fractionné ou continu modéré.'},
      exos:[
        E('Hip thrust barre','fes',3,'10-12','3012',105),
        E('Soulevé de terre roumain haltères','isc',3,'10','3011',90),
        E('Développé couché haltères','pec',3,'10-12','2011',75),
        E('Tirage vertical prise neutre','dos',3,'12','2011',75),
        E('Bulgarian split squat','qua',2,'10/jambe','3010',60),
        E('Circuit abdominaux (crunch + relevés + gainage)','abs',3,'45 s','—',45)
      ]},
    J5:{nom:'🍑 Rappel fessiers + abdominaux (séance légère)', muscles:['fes','moy','tra','abs'],
      cardio:{apres:'piscine', duree:30, detail:'30 min de piscine libre.'},
      exos:[
        E('Glute bridge pieds sur banc','fes',3,'15','2012',60),
        E('Abduction hanche à l\'élastique','moy',3,'20/côté','2011',45),
        E('Kickback à l\'élastique','fes',3,'15/côté','2011',45),
        E('Dead bug','tra',3,'12/côté','3010',45),
        E('Gainage planche','abs',3,'45 s','—',45)
      ]}
  };
}

/* ---------------------------------------------------------------------------
   Assemblage : 12 mois + phase finale, dans le même format que le programme
   d'origine (titre / type / macro / mois / schema / intensite / methode /
   metcon / deload / split / sessions) pour que tout le reste de l'application
   continue de fonctionner à l'identique.
   ------------------------------------------------------------------------- */
const SPLIT_F = '4 jours — 🍑 Fessiers+ischios · 💪 Haut+ventre · 🍑 Fessiers+jambes · 🔥 Full body';
const SPLIT_F5 = '5 jours — 🍑 Fessiers+ischios · 💪 Haut+ventre · 🍑 Fessiers+jambes · 🔥 Full body · 🍑 Rappel fessiers';

const MOIS_F = [
  {m:1,  cy:'P1', t:'Adaptation 1 — Technique & connexion fessière',
   obj:'Apprendre à contracter le grand fessier et le moyen fessier, poser la technique de hip thrust et de soulevé de terre roumain, installer le gainage profond. Aucune recherche de charge.',
   schema:'12-15', int:'60-68 %', meth:'Activation fessiers + tempo lent + amplitude complète'},
  {m:2,  cy:'P1', t:'Adaptation 2 — Amplitude & contrôle',
   obj:'Améliorer l\'amplitude de hanche et la qualité de contraction, ajouter une série sur les exercices principaux, consolider la sangle abdominale.',
   schema:'10-15', int:'65-72 %', meth:'Contrôle excentrique + pause de contraction'},
  {m:3,  cy:'P2', t:'Raffermissement 1 — Double progression',
   obj:'Commencer à gagner des répétitions à charge égale. Fessiers plus fermes, ischios toniques, dos et épaules dessinés.',
   schema:'10-12', int:'70-75 %', meth:'Double progression (reps puis charge)'},
  {m:4,  cy:'P2', t:'Raffermissement 2 — Progression de charge',
   obj:'Premières augmentations de charge sur le hip thrust et le soulevé de terre roumain. Le galbe commence à se densifier.',
   schema:'10-12', int:'72-78 %', meth:'Double progression + pause isométrique 1-2 s'},
  {m:5,  cy:'P2', t:'Raffermissement 3 — Consolidation',
   obj:'Consolider les gains, augmenter légèrement le volume fessier, préparer la phase de développement.',
   schema:'8-12', int:'75-80 %', meth:'Volume modéré + intensité croissante'},
  {m:6,  cy:'P3', t:'Développement fessier 1 — Charge',
   obj:'Entrer dans la construction du galbe : hip thrust lourd 6-8 reps, soulevé de terre roumain 8-10, unilatéral renforcé.',
   schema:'6-10', int:'78-83 %', meth:'Charges lourdes + unilatéral + myo-reps fessiers'},
  {m:7,  cy:'P3', t:'Développement fessier 2 — Volume',
   obj:'Volume fessier maximal (jusqu\'à 24 séries/semaine), techniques d\'intensification ciblées sur le grand et le moyen fessier.',
   schema:'6-12', int:'78-85 %', meth:'Volume fessier élevé + 1,5 reps + drop set'},
  {m:8,  cy:'P3', t:'Développement fessier 3 — Spécialisation',
   obj:'Pic de spécialisation fessière : les trois séances ciblent les fessiers avec des angles différents (extension de hanche, hinge, unilatéral, abduction).',
   schema:'6-12', int:'80-85 %', meth:'Spécialisation + techniques combinées'},
  {m:9,  cy:'P4', t:'Composition 1 — Densité',
   obj:'Conserver la force (hip thrust lourd) et augmenter la densité : bi-sets, repos courts. Début de la réduction progressive de la masse grasse.',
   schema:'8-12', int:'75-82 %', meth:'Bi-sets + repos courts + cardio fractionné'},
  {m:10, cy:'P4', t:'Composition 2 — Révélation',
   obj:'Réduire la masse grasse sans perdre le galbe : densité maintenue, cardio allongé, abdominaux 4 fois par semaine.',
   schema:'10-15', int:'72-80 %', meth:'Densité élevée + cardio 3×/sem.'},
  {m:11, cy:'P4', t:'Composition 3 — Finition',
   obj:'Finition : abdominaux visibles, taille affinée, fessiers conservés. On ne descend jamais sous un déficit raisonnable.',
   schema:'12-20', int:'70-78 %', meth:'Circuits + reps élevées + fractionné soutenu'},
  {m:12, cy:'P5', t:'Stabilisation — Maintien & ancrage',
   obj:'Stabiliser la silhouette, conserver la force et les habitudes. Volume réduit de 20 %, intensité conservée, auto-régulation selon la fatigue.',
   schema:'8-12', int:'72-80 %', meth:'Maintien + auto-régulation'}
];

const PROGRAM = (function(){
  const P = {};
  MOIS_F.forEach(spec=>{
    const cy = CYCLES_F.find(c=>c.id===spec.cy);
    const k = spec.m - cy.mois[0] + 1;
    const sessions = spec.cy==='P1' ? sessP1(k)
                   : spec.cy==='P2' ? sessP2(k)
                   : spec.cy==='P3' ? sessP3(k)
                   : spec.cy==='P4' ? sessP4(k)
                   : sessP5();
    P[spec.m] = {
      titre: spec.t, type: cy.type, macro: cy.nom, mois: 'Mois '+spec.m+' (S. '+((spec.m-1)*4+1)+'–'+(spec.m*4)+')',
      cycle: cy.id, cycleNom: cy.nom, cycleMois: cy.mois,
      objectif: spec.obj,
      schema: spec.schema, intensite: spec.int, methode: spec.meth,
      progression: cy.progression,
      metcon: '2×/sem. — '+ (spec.cy==='P3' ? 'cardio volontairement réduit (12-18 min) pour protéger la récupération des fessiers'
              : spec.cy==='P4' ? '25-30 min dont 1 fractionné de 10 × 30 s'
              : spec.cy==='P5' ? '20-25 min modéré ou 30 min de piscine'
              : '15-22 min elliptique modéré (60-70 % FCM) ou 20-25 min de piscine'),
      cardioSemaine: spec.cy==='P3' ? 2 : 3,
      deload: false,
      split: Object.keys(sessions).length>4 ? SPLIT_F5 : SPLIT_F,
      sessions: sessions
    };
  });
  P.finale = {
    titre:'Phase finale — Tests, bilan & passage au maintien', type:'finale', macro:'PHASE FINALE',
    mois:'S. 49–52', semaine:[49,52], cycle:'F', cycleNom:'Phase finale', cycleMois:[13,13],
    objectif:'Tester vos progrès réels, comparer les photos et les mensurations au Jour 0, puis basculer progressivement vers un programme de maintien durable.',
    schema:'6-15', intensite:'70-85 %', methode:'Tests de force + entretien + bilan complet',
    progression:'Bilan → maintien',
    metcon:'2×/sem. — 25-30 min modéré (65-72 % FCM) ou 30 min de piscine.',
    cardioSemaine:2, deload:true, split:SPLIT_F,
    sessions:{
      J1:{nom:'🍑 Fessiers — test & entretien', muscles:['fes','isc','moy','abs','tra'],
        cardio:{apres:'elliptique', duree:15, detail:'15 min modéré pour relâcher la tension.'},
        exos:[
          E('Hip thrust barre — test de charge max (3-5 reps)','fes',5,'3-5','3012',180,'Testez votre meilleure charge sur 3 à 5 reps propres. Le 1RM est estimé automatiquement. Jamais à l\'échec total, et jamais seule si la charge est lourde.'),
          E('Soulevé de terre roumain barre — test (3-5 reps)','isc',4,'3-5','3011',180),
          E('Bulgarian split squat','qua',3,'10/jambe','3010',90),
          E('Abduction hanche à la poulie','moy',3,'15/côté','2011',45),
          E('Pallof press à la poulie','tra',3,'12/côté','2010',45)
        ]},
      J2:{nom:'💪 Haut du corps — test & entretien', muscles:['dos','epA','epL','bic','tri','abs'],
        cardio:{apres:'elliptique', duree:20, detail:'20 min modéré 60-68 % FCM.'},
        exos:[
          E('Rowing barre buste penché — test (3-5 reps)','dos',5,'3-5','3011',180),
          E('Développé militaire haltères assis — test (3-5 reps)','epA',4,'3-5','2011',150),
          E('Tirage vertical prise large','dos',3,'10-12','2011',90),
          E('Élévations latérales haltères','epL',3,'12-15','2011',45),
          E('Curl haltères','bic',2,'12','2011',45),
          E('Extension triceps à la poulie','tri',2,'12','2011',45),
          E('Gainage planche','abs',3,'60 s','—',45)
        ]},
      J3:{nom:'🍑 Fessiers + jambes — entretien du galbe', muscles:['fes','moy','qua','isc','mol','abs'],
        cardio:{apres:'piscine', duree:25, detail:'25 min de piscine : récupération active avant le bilan final.'},
        exos:[
          E('Back squat','qua',3,'10-12','3011',105),
          E('Hip thrust unilatéral','fes',3,'10/côté','2112',90),
          E('Soulevé de terre roumain unilatéral','isc',3,'10/côté','3011',75),
          E('Abduction assise machine','moy',3,'20','2011',40),
          E('Mollets debout unilatéraux','mol',3,'15','2112',45),
          E('Reverse crunch','abs',3,'15','2011',45)
        ]},
      J4:{nom:'📸 Bilan final + full body léger', muscles:['fes','pec','dos','abs','tra'],
        cardio:{apres:'piscine', duree:30, detail:'30 min de piscine plaisir. Prenez vos photos de bilan et vos mensurations avant la séance.'},
        exos:[
          E('Hip thrust barre','fes',3,'12-15','3012',90),
          E('Développé couché haltères','pec',3,'12','2011',60),
          E('Tirage horizontal à la poulie','dos',3,'12','2011',60),
          E('Dead bug','tra',3,'12/côté','3010',45),
          E('Gainage planche','abs',3,'60 s','—',45)
        ]}
    }
  };
  return P;
})();

/* Récapitulatif périodisation pour l'affichage — 5 cycles féminins */
const PERIODISATION = CYCLES_F.map(c=>({
  mois:c.mois, nom:c.nom, desc:c.desc,
  phases:Array.from({length:c.mois[1]-c.mois[0]+1},(_,i)=>c.mois[0]+i)
})).concat([{mois:[13,13], nom:'PHASE FINALE — TESTS & MAINTIEN', desc:'Semaines 49-52 : tests de force, bilan photo et mensurations, passage au maintien.', phases:['F']}]);

/* Aliments simplifiés (par 100 g) pour le plan de repas */
const ALIMENTS = {
  'Blanc de poulet':{cal:120,p:24,g:0,f:2.5,cat:'prot'},
  'Blanc de dinde':{cal:110,p:23,g:0,f:1.5,cat:'prot'},
  'Bœuf haché 5 %':{cal:137,p:21,g:0,f:5.5,cat:'prot'},
  'Œufs entiers':{cal:143,p:12.5,g:0.7,f:10,cat:'prot'},
  'Blancs d\'œufs':{cal:52,p:11,g:0.7,f:0.2,cat:'prot'},
  'Saumon':{cal:208,p:20,g:0,f:13,cat:'prot'},
  'Thon au naturel':{cal:116,p:26,g:0,f:0.9,cat:'prot'},
  'Crevettes':{cal:99,p:24,g:0.2,f:0.3,cat:'prot'},
  'Fromage blanc 0 %':{cal:70,p:12,g:4,f:0.3,cat:'prot'},
  'Fromage blanc 3 %':{cal:97,p:8,g:4,f:3.4,cat:'prot'},
  'Yaourt grec nature':{cal:97,p:9,g:3.9,f:5,cat:'prot'},
  'Skyr nature':{cal:63,p:11,g:4,f:0.2,cat:'prot'},
  'Tofu ferme':{cal:144,p:15,g:2.8,f:8.7,cat:'prot'},
  'Whey protéine':{cal:400,p:80,g:8,f:6,cat:'prot'},
  'Riz blanc cuit':{cal:130,p:2.7,g:28,f:0.3,cat:'glu'},
  'Riz complet cuit':{cal:111,p:2.6,g:23,f:0.9,cat:'glu'},
  'Pâtes cuites':{cal:158,p:5.8,g:31,f:0.9,cat:'glu'},
  'Pommes de terre':{cal:77,p:2,g:17,f:0.1,cat:'glu'},
  'Patate douce':{cal:86,p:1.6,g:20,f:0.1,cat:'glu'},
  'Flocons d\'avoine':{cal:379,p:13,g:67,f:7,cat:'glu'},
  'Pain complet':{cal:247,p:13,g:41,f:3.4,cat:'glu'},
  'Quinoa cuit':{cal:120,p:4.4,g:21,f:1.9,cat:'glu'},
  'Lentilles cuites':{cal:116,p:9,g:20,f:0.4,cat:'glu'},
  'Banane':{cal:89,p:1.1,g:23,f:0.3,cat:'fruit'},
  'Pomme':{cal:52,p:0.3,g:14,f:0.2,cat:'fruit'},
  'Fruits rouges':{cal:57,p:0.7,g:14,f:0.3,cat:'fruit'},
  'Kiwi':{cal:61,p:1.1,g:15,f:0.5,cat:'fruit'},
  'Brocoli':{cal:34,p:2.8,g:7,f:0.4,cat:'leg'},
  'Épinards':{cal:23,p:2.9,g:3.6,f:0.4,cat:'leg'},
  'Courgettes':{cal:17,p:1.2,g:3.1,f:0.3,cat:'leg'},
  'Haricots verts':{cal:31,p:1.8,g:7,f:0.2,cat:'leg'},
  'Salade verte':{cal:15,p:1.4,g:2.9,f:0.2,cat:'leg'},
  'Huile d\'olive':{cal:884,p:0,g:0,f:100,cat:'lip'},
  'Amandes':{cal:579,p:21,g:22,f:50,cat:'lip'},
  'Beurre de cacahuète':{cal:588,p:25,g:20,f:50,cat:'lip'},
  'Avocat':{cal:160,p:2,g:9,f:15,cat:'lip'},
  'Noix':{cal:654,p:15,g:14,f:65,cat:'lip'}
};

/* Mensurations suivies — les 6 indicateurs clés de la transformation féminine
   sont placés en tête (ils alimentent le tableau de bord « Transformation »). */
const MENS_FIELDS = [
  ['taille','Tour de taille (au nombril)'],['ventre','Tour de ventre (sous le nombril)'],
  ['hanches','Tour de hanches (crêtes iliaques)'],['fessiers','Tour de fessiers (point le plus fort)'],
  ['cuisseD','Cuisse droite'],['cuisseG','Cuisse gauche'],
  ['cou','Tour de cou'],['epaules','Tour d\'épaules'],['poitrine','Tour de poitrine'],
  ['brasD','Bras droit'],['brasG','Bras gauche'],['avBrasD','Avant-bras droit'],['avBrasG','Avant-bras gauche'],
  ['molletD','Mollet droit'],['molletG','Mollet gauche']
];

/* ============================================================
   CARDIO — vélo elliptique · piscine · repos actif
   ============================================================ */
const CARDIO_TYPES = {
  elliptique:{ic:'🚴', n:'Vélo elliptique', desc:'Cardio sans impact à la maison, idéal pour la dépense énergétique sans abîmer les articulations ni retarder la récupération des fessiers.'},
  piscine:{ic:'🏊', n:'Piscine', desc:'Nage, aquagym ou marche dans l\'eau : zéro impact, drainage des jambes, mobilité et récupération active. Parfait les semaines de fatigue.'},
  repos:{ic:'🧘', n:'Repos actif', desc:'Marche 30-45 min, mobilité, étirements, respiration. Préserve la récupération des fessiers tout en maintenant la dépense quotidienne.'}
};
/* Zones cardiaques calculées avec la formule de Tanaka : FCM = 208 − 0,7 × âge */
const ZONES_CARDIO = [
  {n:'Récupération', pct:[0.50,0.60], ic:'🟢', usage:'Jours de fatigue, lendemain de séance fessiers lourde, semaine de deload.'},
  {n:'Modéré / lipolyse', pct:[0.60,0.70], ic:'🔵', usage:'Cardio principal du programme : on parle par phrases courtes. Zone de référence pour perdre du gras en préservant le muscle.'},
  {n:'Endurance', pct:[0.70,0.80], ic:'🟠', usage:'Fractions longues, amélioration de la condition physique. Maximum 1 fois par semaine.'},
  {n:'Seuil / fractionné', pct:[0.80,0.88], ic:'🔴', usage:'Uniquement dans les intervalles courts (30 s). Jamais la veille d\'une séance fessiers.'}
];

/* ============================================================
   ABDOMINAUX — rotation hebdomadaire (2 à 4 stimulations/semaine)
   Objectif : ventre plat + sangle tonique + abdos légèrement visibles.
   ============================================================ */
const ABS_ROTATION = [
  {n:'Transverse & ventre plat', ic:'🧱', focus:['Dead bug','Gainage planche','Pallof press à l\'élastique','Gainage latéral'],
   desc:'Priorité au transverse et aux obliques profonds : c\'est ce qui « rentre » le ventre et affine visuellement la taille, sans épaissir la sangle.'},
  {n:'Anti-rotation & stabilité', ic:'🔄', focus:['Pallof press à la poulie','Bird dog','Gainage latéral dynamique','Dead bug avec rotation'],
   desc:'Stabilité du tronc et protection du bassin : utile pour le hip thrust et le soulevé de terre roumain, et pour la posture.'},
  {n:'Grand droit & visibilité', ic:'🔥', focus:['Crunch à la poulie','Reverse crunch','Relevés de jambes','Gainage planche'],
   desc:'Travail du grand droit en résistance progressive : c\'est ce qui rend les abdominaux légèrement visibles quand le taux de masse grasse baisse.'},
  {n:'Gainage complet', ic:'🛡️', focus:['Gainage planche','Gainage latéral','Bird dog','Mountain climbers'],
   desc:'Semaine légère : maintien du gainage sans fatigue supplémentaire, idéal en deload ou en période de fatigue élevée.'}
];
function absFocusSemaine(wk){ return ABS_ROTATION[((wk||0)%ABS_ROTATION.length+ABS_ROTATION.length)%ABS_ROTATION.length]; }
/* Nombre de stimulations abdominales recommandées selon la récupération */
function nbStimAbs(){
  const rm = (typeof moyenneRecup==='function') ? moyenneRecup() : null;
  if(rm!=null && rm<50) return 2;
  if(rm!=null && rm<65) return 3;
  return 4;
}

/* ============================================================
   BILAN DE FORCE MAXIMALE (1RM) — version féminine
   Les 5 mouvements suivis sont ceux qui pilotent les charges du programme.
   ============================================================ */
const FORCE_REVAL_WEEKS = 8; // fréquence de réévaluation fixée par le coach

const TEST_1RM = {
  titre:"Bilan de force maximale (1RM) — profil féminin",
  exercices:[
    {key:'hipthrust', nom:"Hip thrust barre", ic:"🍑", essentiel:true},
    {key:'rdl', nom:"Soulevé de terre roumain", ic:"🍑", essentiel:true},
    {key:'bulgarian', nom:"Bulgarian split squat (par jambe)", ic:"🦵", essentiel:true},
    {key:'squat', nom:"Squat (goblet ou barre)", ic:"🦵", essentiel:true},
    {key:'row', nom:"Rowing barre buste penché", ic:"🦍", essentiel:true},
    {key:'tirage', nom:"Tirage vertical", ic:"🦍", essentiel:false},
    {key:'bridge', nom:"Glute bridge (charge sur les hanches)", ic:"🍑", essentiel:false},
    {key:'ohp', nom:"Développé militaire haltères (par bras)", ic:"💪", essentiel:false},
    {key:'curl', nom:"Curl haltères (par bras)", ic:"💪", essentiel:false},
    {key:'triext', nom:"Extension triceps à la poulie", ic:"💪", essentiel:false},
    {key:'latraise', nom:"Élévations latérales (par bras)", ic:"🔷", essentiel:false}
  ]
};

/* Exercices au poids du corps / au temps : aucune suggestion de charge */
/* Exercices au poids du corps, chronométrés ou à l'élastique : la tension d'un
   élastique n'est pas une charge en kg mesurable → aucune suggestion chiffrée. */
const EXO_SANS_CHARGE = ['pompes','gainage','planche','dead bug','bird dog','mountain climbers','circuit','clamshell','fire hydrant','elastique','superman'];

/* Charge suggérée = 1RM de l'exercice × % de la phase (selon fourchette de reps).
   [base, motif (normalisé), ratio, perHand?] — le 1er motif qui correspond gagne,
   donc les motifs spécifiques précèdent les génériques.
   Les règles féminines (hip thrust, unilatéral, roumain) sont placées en tête. */
const CHARGE_RULES = [
  /* ---- Règles de priorité absolue : exercices haltères / unilatéraux ----
     Elles passent AVANT les motifs génériques, sinon « Développé couché haltères »
     hériterait du 1RM barre (25 kg par main au lieu de ~5 kg) et « Soulevé de terre
     roumain unilatéral » serait rattaché au hip thrust. */
  /* Unilatéral : une seule jambe / un seul bras travaille → ratio nettement réduit.
     NB : « Soulevé de terre roumain haltères » et « Bulgarian split squat haltères »
     restent volontairement en charge TOTALE (les deux haltères additionnés) : c'est
     le chiffre que l'on note naturellement dans le journal. */
  ['rdl','roumain unilateral',0.35,true], ['rdl','roumain unilat',0.35,true],
  ['rdl','unilateral haltere',0.35,true],
  ['row','rowing haltere',0.50,true], ['row','rowing un bras',0.50,true],
  ['bench','developpe couche halteres',0.45,true], ['bench','developpe couche halt',0.45,true],
  ['bench','developpe incline halteres',0.45,true], ['bench','developpe incline halt',0.45,true],
  ['tirage','pallof',0.30], ['tirage','face pull',0.30], ['tirage','crunch a la poulie',0.20],
  ['squat','goblet',0.35,true],
  ['squat','mollets debout unilat',0.20,true], ['squat','mollet unilat',0.20,true],
  // --- Unilatéral fessier/jambes (AVANT les motifs génériques « squat »/« fente ») ---
  ['bulgarian','bulgare',1.0], ['bulgarian','bulgarian',1.0], ['bulgarian','split squat',1.0],
  ['bulgarian','fente',1.25], ['bulgarian','lunge',1.25], ['bulgarian','step up',1.35], ['bulgarian','step-up',1.35],
  // --- Hip thrust & famille fessiers (le hip thrust est plus lourd que le squat) ---
  ['hipthrust','kickback',0.10], ['hipthrust','abduction',0.10], ['hipthrust','hip abduction',0.10],
  ['hipthrust','glute bridge',0.70], ['hipthrust','bridge',0.70], ['hipthrust','pont fessier',0.10],
  ['hipthrust','unilateral',0.30,true], ['hipthrust','1 jambe',0.30,true],
  ['hipthrust','hip thrust',1.0], ['hipthrust','thrust',1.0],
  // --- Soulevé de terre roumain & ischios ---
  ['rdl','leg curl',0.30], ['rdl','swiss-ball leg curl',0.25], ['rdl','ischio',0.30],
  ['rdl','roumain',1.0], ['rdl','romanian',1.0],
  ['rdl','jambes tendues',0.90], ['rdl','good morning',0.60],
  ['rdl','souleve de terre',0.90], ['rdl','deadlift',0.90],
  // --- Tirages ---
  ['tirage','tirage vertical',1.0], ['tirage','lat pulldown',1.0],
  ['tirage','tirage horizontal',0.90], ['tirage','tirage',0.95], ['tirage','rowing assis',0.90],
  // --- Curls haltères (par bras) ---
  ['curl','curl halteres',0.50,true], ['curl','halteres curl',0.50,true],
  // --- Squat et dérivés (règles d'origine conservées) ---
  ['triext','french',1.0], ['triext','triceps',1.0], ['triext','pushdown',1.0],
  ['triext','extension triceps',1.0], ['triext','barre au front',0.95],
  ['squat','leg extension',0.35],
  ['squat','mollet',0.45], ['squat','calf',0.45],
  ['squat','presse a cuisses',1.35], ['squat','leg press',1.20], ['squat','presse',1.20],
  ['latraise','elevations lat',1.0,true], ['latraise','lateral raise',1.0,true], ['latraise','lateral',1.0,true],
  ['ohp','lean away',0.25,true], ['ohp','telle raise',0.25,true],
  ['ohp','prone',0.20,true], ['ohp','rear delt',0.20,true], ['ohp','face pull',0.18], ['ohp','wood chop',0.25],
  ['ohp','militaire',0.80,true], ['ohp','halteres assis',0.45,true], ['ohp','haltere un bras',0.45,true],
  ['ohp','overhead',0.80,true],
  ['squat','front squat',0.85], ['squat','back squat',1.0],
  ['squat','hack',0.90],
  ['squat','squat cycliste',0.80], ['squat','cycliste',0.80],
  ['squat','goblet',0.80],
  ['squat','safety bar',1.0],
  ['squat','squat',1.0],
  ['bench','developpe couche',1.0],
  ['bench','developpe halt',0.45,true],
  ['bench','flat dumbell press',0.45,true], ['bench','incline dumbell press',0.45,true], ['bench','decline dumbell press',0.45,true],
  ['bench','dumbell press',0.45,true],
  ['bench','incline',0.85], ['bench','developpe inclin',0.85],
  ['bench','decline',0.90], ['bench','developpe declin',0.90],
  ['bench','close grip',0.85], ['bench','prise serree',0.85],
  ['bench','ecart',0.30,true], ['bench','fly',0.30,true],
  ['bench','cable croise',0.30,true], ['bench','crossover',0.30,true], ['bench','croise',0.30,true],
  ['bench','bench',1.0],
  ['rdl','back extension',0.30], ['rdl','hyperextension',0.30], ['rdl','glute ham',0.35],
  ['ohp','derriere la nuque',1.0], ['ohp','behind the neck',1.0],
  ['ohp','california',0.80],
  ['ohp','press',0.90,true],
  ['pullup','traction',1.0], ['pullup','pull up',1.0], ['pullup','chin up',1.0],
  ['pullup','pull-up',1.0], ['pullup','chin-up',1.0], ['pullup','lean away pull',1.0],
  ['dips','dips',1.0], ['dips','dip',1.0],
  ['curl','curl marteau',0.80], ['curl','marteau',0.80], ['curl','hammer',0.80],
  ['curl','dumbell curl',0.50,true], ['curl','zottman',0.50,true], ['curl','concentration',0.45,true],
  ['curl','scott',0.85],
  ['curl','poulie basse',0.75], ['curl','low pulley',0.75],
  ['curl','curl',1.0],
  ['row','rowing halt',0.70,true], ['row','rowing barre',1.0], ['row','rowing assis',0.85],
  ['row','seated row',0.85],
  ['row','rowing',1.0], ['row','row',1.0],
  ['row','pullover',0.45]
];

/* Repli par groupe musculaire si aucun motif ne correspond */
const CHARGE_FALLBACK = {
  fes:['hipthrust',0.60], moy:['hipthrust',0.10], isc:['rdl',0.45], qua:['squat',0.70],
  add:['squat',0.40], mol:['squat',0.40], abs:null, tra:null, lom:['rdl',0.35],
  dos:['row',1.0], epA:['ohp',0.80], epL:['latraise',0.90], epP:['ohp',0.35],
  bic:['curl',0.90], tri:['triext',0.90], avb:['curl',0.40], pec:['bench',0.80]
};


/* ============================================================
   REPAS JOUR PAR JOUR — menus variés (3 rotations par repas)
   ============================================================ */
const REPAS_CREUX = [
  {nom:'🥣 Petit-déjeuner', pP:.24,pG:.24,pL:.20},
  {nom:'🥛 Collation matin', pP:.14,pG:.08,pL:.20},
  {nom:'🍗 Déjeuner', pP:.28,pG:.32,pL:.25},
  {nom:'🍌 Pré-entraînement', pP:.06,pG:.16,pL:.03},
  {nom:'🐟 Dîner', pP:.28,pG:.20,pL:.32}
];
const REPAS_JOURS = {
  '🥣 Petit-déjeuner':[
    [['Œufs entiers','prot'],['Flocons d\'avoine','glu'],['Banane','fruit']],
    [['Yaourt grec nature','prot'],['Flocons d\'avoine','glu'],['Pomme','fruit'],['Amandes','lip']],
    [['Fromage blanc 0 %','prot'],['Pain complet','glu'],['Banane','fruit'],['Beurre de cacahuète','lip']]
  ],
  '🥛 Collation matin':[
    [['Fromage blanc 0 %','prot'],['Amandes','lip']],
    [['Yaourt grec nature','prot'],['Amandes','lip']],
    [['Whey protéine','prot'],['Pomme','fruit']]
  ],
  '🍗 Déjeuner':[
    [['Blanc de poulet','prot'],['Riz complet cuit','glu'],['Brocoli','leg'],['Huile d\'olive','lip']],
    [['Bœuf haché 5 %','prot'],['Patate douce','glu'],['Épinards','leg'],['Huile d\'olive','lip']],
    [['Blanc de dinde','prot'],['Pâtes cuites','glu'],['Brocoli','leg'],['Huile d\'olive','lip']]
  ],
  '🍌 Pré-entraînement':[
    [['Banane','fruit'],['Flocons d\'avoine','glu'],['Yaourt grec nature','prot']],
    [['Pomme','fruit'],['Pain complet','glu'],['Whey protéine','prot']],
    [['Banane','fruit'],['Pain complet','glu']]
  ],
  '🐟 Dîner':[
    [['Saumon','prot'],['Patate douce','glu'],['Épinards','leg'],['Huile d\'olive','lip']],
    [['Thon au naturel','prot'],['Riz blanc cuit','glu'],['Brocoli','leg'],['Huile d\'olive','lip']],
    [['Blanc de poulet','prot'],['Pommes de terre','glu'],['Épinards','leg'],['Huile d\'olive','lip']]
  ]
};

/* ============================================================
   ÉCHAUFFEMENT & ÉTIREMENTS — instructions détaillées
   ============================================================ */
const ECHAUFFEMENT = {
  ic:'🔥', titre:'Échauffement — à faire AVANT la séance', duree:'8 à 12 min',
  etapes:[
    {ic:'🚴', nom:'Cardio léger sur l\'elliptique', temps:'5 min',
     quoi:'Vélo elliptique (ou marche rapide) à intensité FACILE : vous devez pouvoir parler sans difficulté. Objectif : augmenter la température du corps et lubrifier les hanches, genoux et chevilles. Restez à 50-60 % de votre fréquence cardiaque maximale.'},
    {ic:'🔄', nom:'Mobilité articulaire complète', temps:'2-3 min',
     quoi:'10 rotations LENTES dans chaque sens, dans l\'ordre : cou → épaules (grands cercles avant puis arrière) → coudes & poignets → hanches → genoux → chevilles. Terminez par des rotations du tronc, bras pliés devant la poitrine. Insistez sur les hanches : c\'est l\'articulation clé du galbe.'},
    {ic:'🏋️', nom:'Séries d\'approche sur le 1er exercice', temps:'3-5 min',
     quoi:'Préparez le système nerveux et validez votre charge sur le premier exercice de la séance :\n• Série 1 : ~50 % de la charge de travail (barre légère ou haltères), 8-10 reps faciles\n• Série 2 : ~70 %, 5-8 reps contrôlées\n• Série 3 : ~85 %, 3-5 reps propres (si besoin)\nPuis repos 1-2 min avant la 1ère série de travail. Ne JAMAIS attaquer une série lourde sans cette approche.'}
  ]
};
const ACTIVATION_FESSIERS = 'Étape OBLIGATOIRE avant toute séance fessiers (2-3 min) :\n• 2×12 ponts fessiers au sol avec 2 s de contraction en haut\n• 2×15 clamshells à l\'élastique (ou au sol) par côté\n• 2×12 abductions de hanche debout par côté\n• 2×10 kickbacks au poids du corps par côté\nBut : réveiller le grand fessier et le moyen fessier AVANT de charger. Sans activation, le corps compense avec les ischios, les lombaires et les quadriceps — et le galbe ne progresse pas.';
const ACTIVATION_JAMBES = '2×10 squats au poids du corps (lents) + 2×12 ponts fessiers avec contraction + 2×10 élévations mollets + 2×12 abductions de hanche. But : réveiller quadriceps, fessiers et mollets avant de charger.';
const ACTIVATION_HAUT = '2×15 rotations externes des épaules avec élastique léger (ou 2×10 pompes faciles). But : stabiliser les épaules avant les poussées et tractions.';
const ACTIVATION_BRAS = '2×15 rotations de poignets + 2×12 curls très légers et 2×12 extensions triceps très légères. But : chauffer les bras et les coudes sans fatigue.';

const ETIREMENTS = {
  ic:'🧘', titre:'Retour au calme — étirements à faire APRÈS la séance', duree:'5 à 8 min',
  consigne:'Étirements STATIQUES (tenir la position sans rebondir), 20-30 s par exercice, respiration profonde et lente. Étirez uniquement les muscles travaillés aujourd\'hui, sans douleur vive.'
};
const ETIREMENTS_PAR_MUSCLE = {
  pec:{nom:'Pectoraux', exos:[
    ['🚪','Étirement dans l\'encadrement de porte','20-30 s','Avant-bras à 90° contre le montant, fente légère vers l\'avant jusqu\'à sentir l\'étirement dans la poitrine. Changez de côté.'],
    ['🧱','Bras tendu contre le mur','20-30 s','Bras tendu le long du mur, paume posée, faites pivoter le buste à l\'opposé. Changez de côté.']
  ]},
  dos:{nom:'Dos / dorsaux', exos:[
    ['🐈','Position de l\'enfant (Balasana)','30-45 s','Assis sur les talons, bras tendus au sol devant vous, front au sol. Respirez profondément dans le dos.'],
    ['🕸️','Suspension à la barre','20-30 s','Suspendu à une barre de traction, épaules relâchées, laissez le poids du corps étirer le dos.'],
    ['🔄','Torsion allongée','20-30 s/côté','Sur le dos, genoux pliés, basculez les jambes d\'un côté, regardez de l\'autre.']
  ]},
  epA:{nom:'Épaules antérieures', exos:[
    ['🤝','Mains croisées derrière le dos','20-30 s','Mains croisées dans le dos, bras tendus, montez doucement les mains tout en poussant la poitrine vers l\'avant.']
  ]},
  epL:{nom:'Épaules latérales', exos:[
    ['➡️','Bras tendu contre la poitrine','20-30 s/côté','Bras tendu horizontalement, tirez-le doucement vers la poitrine avec l\'autre main. Épaule basse.']
  ]},
  epP:{nom:'Épaules postérieures', exos:[
    ['🔃','Bras tendu devant, main tirée','20-30 s/côté','Bras tendu devant vous, paume vers le bas, tirez la main vers vous avec l\'autre main.']
  ]},
  bic:{nom:'Biceps', exos:[
    ['🙌','Bras tendu derrière','20-30 s/côté','Bras tendu dans le dos, paume vers le haut, tirez doucement la main vers le bas avec l\'autre main.']
  ]},
  tri:{nom:'Triceps', exos:[
    ['💪','Coude au-dessus de la tête','20-30 s/côté','Bras plié derrière la tête, poussez le coude vers le bas avec l\'autre main.'],
    ['🤲','Main dans le dos','20-30 s/côté','Une main glissée dans le dos entre les omoplates, poussez le coude vers le bas.']
  ]},
  avb:{nom:'Avant-bras', exos:[
    ['✊','Étirement des fléchisseurs','20-30 s/côté','Bras tendu, paume vers le haut, tirez les doigts vers le bas avec l\'autre main.'],
    ['🖐️','Étirement des extenseurs','20-30 s/côté','Bras tendu, paume vers le bas, tirez le dos de la main vers vous.']
  ]},
  abs:{nom:'Abdominaux', exos:[
    ['🐍','Étirement du cobra','20-30 s','Sur le ventre, poussez sur les mains pour cambrer légèrement le dos, regardez devant, sans forcer sur les lombaires.']
  ]},
  lom:{nom:'Lombaires', exos:[
    ['🐈','Position de l\'enfant','30-45 s','Assis sur les talons, bras tendus, front au sol.'],
    ['🔄','Torsion allongée genoux','20-30 s/côté','Sur le dos, genoux pliés, basculez les jambes à gauche puis à droite.']
  ]},
  fes:{nom:'Fessiers', exos:[
    ['🕊️','Pigeon assis','30-45 s/côté','Assis, une cheville posée sur l\'autre genou, penchez-vous doucement vers l\'avant, dos droit. C\'est l\'étirement clé après une séance fessiers.'],
    ['🪑','Étirement du piriforme assis','30 s/côté','Assise sur une chaise, croisez la cheville sur le genou opposé et penchez le buste droit vers l\'avant.']
  ]},
  moy:{nom:'Moyen fessier / hanches', exos:[
    ['🦩','Adduction de la hanche debout','20-30 s/côté','Debout, croisez une jambe derrière l\'autre et penchez le buste du côté de la jambe croisée. Étire le moyen fessier et le tenseur du fascia lata.'],
    ['🧎','Étirement du fléchisseur de hanche (chevalier)','30 s/côté','Un genou au sol, bassin basculé vers l\'arrière, poussez les hanches vers l\'avant. Indispensable pour un hip thrust complet.']
  ]},
  tra:{nom:'Transverse / sangle abdominale', exos:[
    ['🐍','Cobra doux','20-30 s','Sur le ventre, poussez sur les mains pour décoller légèrement la poitrine, sans cambrer les lombaires. Relâche la sangle abdominale après le gainage.'],
    ['🌬️','Respiration diaphragmatique allongée','1 min','Allongée, genoux pliés, inspirez en gonflant le ventre, expirez longuement en rentrant le nombril vers la colonne. 6 à 8 respirations.']
  ]},
  qua:{nom:'Quadriceps', exos:[
    ['🦵','Talon vers la fesse (debout)','20-30 s/côté','Tenez-vous à un support, ramenez le talon vers la fesse, attrapez la cheville, genoux serrés.'],
    ['➡️','Allongé sur le côté','20-30 s/côté','Sur le côté, ramenez le talon vers la fesse, poussez la hanche vers l\'avant.']
  ]},
  isc:{nom:'Ischio-jambiers', exos:[
    ['📐','Flexion avant jambes tendues','30-45 s','Assis, jambes tendues, penchez-vous vers les pieds en gardant le dos long et droit.'],
    ['1️⃣','Une jambe tendue, une pliée','20-30 s/côté','Assis, une jambe tendue, l\'autre pliée plante contre la cuisse, penchez-vous vers le pied tendu.']
  ]},
  add:{nom:'Adducteurs', exos:[
    ['🐸','Grenouille (plantes jointes)','30-45 s','Assis, plantes des pieds jointes, genoux écartés, poussez doucement les genoux vers le sol.']
  ]},
  mol:{nom:'Mollets', exos:[
    ['🧱','Étirement contre le mur','20-30 s/côté','En appui contre le mur, une jambe tendue derrière (talon au sol), l\'autre pliée, poussez le talon au sol.'],
    ['🪜','Mollet en escalier','20-30 s/côté','Avant-pied sur une marche, talon qui descend sous le niveau de la marche.']
  ]}
};

/* ============================================================
   CORE — état, utilitaires, nutrition, graphiques, moteur IA
   ============================================================ */
'use strict';
const LS_KEY = 'emilie_transformation_v1';
const EXO_GIFS={
'Abduction assise (machine ou élastique)':'<svg data-audit-asset="2"></svg>',
'Abduction assise en 1,5 reps':'<svg data-audit-asset="3"></svg>',
'Abduction assise machine':'<svg data-audit-asset="4"></svg>',
'Abduction hanche debout à la poulie':'<svg data-audit-asset="5"></svg>',
'Abduction hanche à l\'élastique':'<svg data-audit-asset="6"></svg>',
'Abduction hanche à la poulie':'<svg data-audit-asset="7"></svg>',
'Abduction hanche à la poulie — myo-reps':'<svg data-audit-asset="8"></svg>',
'Back squat':'<svg data-audit-asset="9"></svg>',
'Back squat (charge modérée)':'<svg data-audit-asset="10"></svg>',
'Bird dog':'<svg data-audit-asset="11"></svg>',
'Bulgarian split squat':'<svg data-audit-asset="12"></svg>',
'Bulgarian split squat haltères':'<svg data-audit-asset="13"></svg>',
'Circuit abdominaux (crunch + relevés + gainage)':'<svg data-audit-asset="14"></svg>',
'Circuit gainage (planche + latéral + bird dog)':'<svg data-audit-asset="15"></svg>',
'Clamshell à l\'élastique':'<svg data-audit-asset="16"></svg>',
'Crunch à la poulie':'<svg data-audit-asset="17"></svg>',
'Crunch à la poulie (ou au sol)':'<svg data-audit-asset="18"></svg>',
'Curl haltères':'<svg data-audit-asset="19"></svg>',
'Dead bug':'<svg data-audit-asset="20"></svg>',
'Dead bug avec rotation':'<svg data-audit-asset="21"></svg>',
'Développé couché haltères':'<svg data-audit-asset="22"></svg>',
'Développé incliné haltères':'<svg data-audit-asset="23"></svg>',
'Développé militaire haltères assis':'<svg data-audit-asset="24"></svg>',
'Développé militaire haltères assis — test (3-5 reps)':'<svg data-audit-asset="25"></svg>',
'Extension triceps à la poulie':'<svg data-audit-asset="26"></svg>',
'Face pull à l\'élastique':'<svg data-audit-asset="27"></svg>',
'Face pull à la poulie':'<svg data-audit-asset="28"></svg>',
'Fentes arrière alternées':'<svg data-audit-asset="29"></svg>',
'Fentes avant alternées':'<svg data-audit-asset="30"></svg>',
'Fentes bulgares (pied arrière surélevé)':'<svg data-audit-asset="31"></svg>',
'Fire hydrant à l\'élastique':'<svg data-audit-asset="32"></svg>',
'Gainage latéral':'<svg data-audit-asset="33"></svg>',
'Gainage latéral dynamique':'<svg data-audit-asset="34"></svg>',
'Gainage planche':'<svg data-audit-asset="35"></svg>',
'Glute bridge en 1,5 reps':'<svg data-audit-asset="36"></svg>',
'Glute bridge pieds sur banc':'<svg data-audit-asset="37"></svg>',
'Goblet squat':'<svg data-audit-asset="38"></svg>',
'Hip thrust barre':'<svg data-audit-asset="39"></svg>',
'Hip thrust barre — test de charge max (3-5 reps)':'<svg data-audit-asset="40"></svg>',
'Hip thrust unilatéral':'<svg data-audit-asset="41"></svg>',
'Hip thrust unilatéral (1 jambe)':'<svg data-audit-asset="42"></svg>',
'Hip thrust unilatéral lesté':'<svg data-audit-asset="43"></svg>',
'Kickback à l\'élastique':'<svg data-audit-asset="44"></svg>',
'Kickback à la poulie':'<svg data-audit-asset="45"></svg>',
'Kickback à la poulie — drop set final':'<svg data-audit-asset="46"></svg>',
'Leg curl machine':'<svg data-audit-asset="47"></svg>',
'Leg curl machine (ou swiss-ball leg curl)':'<svg data-audit-asset="48"></svg>',
'Mollets assis':'<svg data-audit-asset="49"></svg>',
'Mollets debout unilatéraux':'<svg data-audit-asset="50"></svg>',
'Mountain climbers':'<svg data-audit-asset="51"></svg>',
'Pallof press à l\'élastique':'<svg data-audit-asset="52"></svg>',
'Pallof press à la poulie':'<svg data-audit-asset="53"></svg>',
'Pompes inclinées (mains surélevées)':'<svg data-audit-asset="54"></svg>',
'Pont fessier au sol — activation':'<svg data-audit-asset="55"></svg>',
'Presse à cuisses pieds hauts':'<svg data-audit-asset="56"></svg>',
'Relevés de jambes':'<svg data-audit-asset="57"></svg>',
'Relevés de jambes allongée':'<svg data-audit-asset="58"></svg>',
'Reverse crunch':'<svg data-audit-asset="59"></svg>',
'Rowing barre buste penché':'<svg data-audit-asset="60"></svg>',
'Rowing barre buste penché — test (3-5 reps)':'<svg data-audit-asset="61"></svg>',
'Rowing haltère un bras':'<svg data-audit-asset="62"></svg>',
'Soulevé de terre roumain barre':'<svg data-audit-asset="63"></svg>',
'Soulevé de terre roumain barre — test (3-5 reps)':'<svg data-audit-asset="64"></svg>',
'Soulevé de terre roumain haltères':'<svg data-audit-asset="65"></svg>',
'Soulevé de terre roumain unilatéral':'<svg data-audit-asset="66"></svg>',
'Soulevé de terre roumain unilatéral haltère':'<svg data-audit-asset="67"></svg>',
'Step-up sur banc (hauteur du genou)':'<svg data-audit-asset="68"></svg>',
'Tirage horizontal à la poulie':'<svg data-audit-asset="69"></svg>',
'Tirage vertical prise large':'<svg data-audit-asset="70"></svg>',
'Tirage vertical prise neutre':'<svg data-audit-asset="71"></svg>',
'Élévations latérales haltères':'<svg data-audit-asset="72"></svg>',
'Élévations latérales haltères — myo-reps':'<svg data-audit-asset="73"></svg>'
};

const MUSCU_GUIDES = {
'back squat barre haute':{img:'data:image/gif;base64,[BINARY_ASSET_a1b63bbf4c58: 223452 characters]',tip:'💡 Poitrine haute, genoux dans l\'axe des pieds.'},
'abduction assise (machine ou elastique)':{img:'data:image/gif;base64,[BINARY_ASSET_8b0fc43a61ef: 479068 characters]',tip:'💡 Amplitude large, sans pencher le bassin.'},
'abduction assise en 1,5 reps':{img:'data:image/gif;base64,[BINARY_ASSET_8b0fc43a61ef: 479068 characters]',tip:'💡 Amplitude large, sans pencher le bassin.'},
'abduction assise machine':{img:'data:image/gif;base64,[BINARY_ASSET_8b0fc43a61ef: 479068 characters]',tip:'💡 Amplitude large, sans pencher le bassin.'},
'abduction hanche debout a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_7303eed1147f: 230324 characters]',tip:'💡 Contrôle la jambe, 1 s de tension en fin de course.'},
'abduction hanche a l\'elastique':{img:'data:image/gif;base64,[BINARY_ASSET_223e285b7ab7: 308868 characters]',tip:'💡 Pousse contre la bande, sans rotation du bassin.'},
'abduction hanche a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_7303eed1147f: 230324 characters]',tip:'💡 Contrôle la jambe, 1 s de tension en fin de course.'},
'abduction hanche a la poulie — myo-reps':{img:'data:image/gif;base64,[BINARY_ASSET_7303eed1147f: 230324 characters]',tip:'💡 Contrôle la jambe, 1 s de tension en fin de course.'},
'back squat':{ref:'back squat barre haute',tip:'💡 Poitrine haute, genoux dans l\'axe des pieds.'},
'back squat (charge moderee)':{img:'data:image/gif;base64,[BINARY_ASSET_eb463aa9a210: 314544 characters]',tip:'💡 Barre sur le haut du dos, descend profond, genoux dans l’axe.'},
'bird dog':{img:'data:image/gif;base64,[BINARY_ASSET_7f65876ee7ad: 220880 characters]',tip:'💡 Montée lente du genou, bassin stable, sans balancer.'},
'bulgarian split squat':{img:'data:image/gif;base64,[BINARY_ASSET_b12ec551bdae: 299088 characters]',tip:'💡 Talon ancré, genou à 90°, buste léger penché.'},
'bulgarian split squat halteres':{img:'data:image/gif;base64,[BINARY_ASSET_b12ec551bdae: 299088 characters]',tip:'💡 Talon ancré, genou à 90°, buste léger penché.'},
'circuit abdominaux (crunch + releves + gainage)':{img:'data:image/gif;base64,[BINARY_ASSET_59aac870c903: 326840 characters]',tip:'💡 Enroule les lombaires, expire en haut.'},
'circuit gainage (planche + lateral + bird dog)':{img:'data:image/gif;base64,[BINARY_ASSET_1083d84f8c07: 258160 characters]',tip:'💡 Corps aligné, hanches à l’horizontale, respire normalement.'},
'clamshell a l\'elastique':{img:'data:image/gif;base64,[BINARY_ASSET_7f65876ee7ad: 220880 characters]',tip:'💡 Montée lente du genou, bassin stable, sans balancer.'},
'crunch a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_881aff1a404b: 130760 characters]',tip:'💡 Enroule le buste, menton vers la poitrine.'},
'crunch a la poulie (ou au sol)':{ref:'crunch a la poulie'},
'curl halteres':{img:'data:image/gif;base64,[BINARY_ASSET_36675fe1d5dd: 219100 characters]',tip:'💡 Coudes fixes, monte sans à-coups.'},
'dead bug':{img:'data:image/gif;base64,[BINARY_ASSET_400ee43914f2: 231156 characters]',tip:'💡 Lombaires plaquées au sol, mouvement lent et contrôlé.'},
'dead bug avec rotation':{img:'data:image/gif;base64,[BINARY_ASSET_400ee43914f2: 231156 characters]',tip:'💡 Lombaires plaquées au sol, mouvement lent et contrôlé.'},
'developpe couche halteres':{img:'data:image/gif;base64,[BINARY_ASSET_f1e6556bb7a1: 357428 characters]',tip:'💡 Haltères à la poitrine, pousse sans élan.'},
'developpe incline halteres':{img:'data:image/gif;base64,[BINARY_ASSET_8c5444d4fd98: 237012 characters]',tip:'💡 Buste plaqué, pousse vers le haut, étire en bas.'},
'developpe militaire halteres assis':{img:'data:image/gif;base64,[BINARY_ASSET_5ff4a08fa663: 272840 characters]',tip:'💡 Pousse vers le ciel, buste droit, sans cambrer.'},
'developpe militaire halteres assis — test (3-5 reps)':{img:'data:image/gif;base64,[BINARY_ASSET_5ff4a08fa663: 272840 characters]',tip:'💡 Pousse vers le ciel, buste droit, sans cambrer.'},
'extension triceps a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_b88e64c926b7: 252520 characters]',tip:'💡 Coudes fixes, verrouille les bras en bas.'},
'face pull a l\'elastique':{img:'data:image/gif;base64,[BINARY_ASSET_162225983931: 267240 characters]',tip:'💡 Poitrine ouverte, tire vers le cou, buste droit.'},
'face pull a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_162225983931: 267240 characters]',tip:'💡 Poitrine ouverte, tire vers le cou, buste droit.'},
'fentes arriere alternees':{img:'data:image/gif;base64,[BINARY_ASSET_2d50e0678d59: 357356 characters]',tip:'💡 Recule la jambe, genou avant à 90°, pousse sur le talon.'},
'fentes avant alternees':{img:'data:image/gif;base64,[BINARY_ASSET_4c39f3cb0a16: 320028 characters]',tip:'💡 Avance, genou arrière vers le sol, buste vertical.'},
'fentes bulgares (pied arriere sureleve)':{img:'data:image/gif;base64,[BINARY_ASSET_b12ec551bdae: 299088 characters]',tip:'💡 Talon ancré, genou à 90°, buste léger penché.'},
'fire hydrant a l\'elastique':{img:'data:image/gif;base64,[BINARY_ASSET_e42aaeaaabc3: 261080 characters]',tip:'💡 Corps aligné, monte le genou vers le plafond.'},
'gainage lateral':{img:'data:image/gif;base64,[BINARY_ASSET_8003e6670228: 226388 characters]',tip:'💡 Hanches hautes, genou vers le sol sans le toucher.'},
'gainage lateral dynamique':{img:'data:image/gif;base64,[BINARY_ASSET_8003e6670228: 226388 characters]',tip:'💡 Hanches hautes, genou vers le sol sans le toucher.'},
'gainage planche':{img:'data:image/gif;base64,[BINARY_ASSET_1083d84f8c07: 258160 characters]',tip:'💡 Corps aligné, hanches à l’horizontale, respire normalement.'},
'glute bridge en 1,5 reps':{img:'data:image/gif;base64,[BINARY_ASSET_a1f8ca5081f8: 606780 characters]',tip:'💡 Hanches en haut, monte chaque jambe sans laisser tomber le bassin.'},
'glute bridge pieds sur banc':{img:'data:image/gif;base64,[BINARY_ASSET_44654f5c368e: 255320 characters]',tip:'💡 Pieds sur le banc, monte les hanches, contracte les fessiers.'},
'goblet squat':{img:'data:image/gif;base64,[BINARY_ASSET_c4d191dfc243: 250400 characters]',tip:'💡 Haltère à la poitrine, genoux dans l’axe, descend profond.'},
'hip thrust barre':{img:'data:image/gif;base64,[BINARY_ASSET_c4d795d1724a: 314176 characters]',tip:'💡 Tibias verticaux, monte les hanches, menton rentré.'},
'hip thrust barre — test de charge max (3-5 reps)':{img:'data:image/gif;base64,[BINARY_ASSET_c4d795d1724a: 314176 characters]',tip:'💡 Tibias verticaux, monte les hanches, menton rentré.'},
'hip thrust unilateral':{img:'data:image/gif;base64,[BINARY_ASSET_b12ec551bdae: 299088 characters]',tip:'💡 Talon ancré, genou à 90°, buste léger penché.'},
'hip thrust unilateral (1 jambe)':{img:'data:image/gif;base64,[BINARY_ASSET_b12ec551bdae: 299088 characters]',tip:'💡 Talon ancré, genou à 90°, buste léger penché.'},
'hip thrust unilateral leste':{img:'data:image/gif;base64,[BINARY_ASSET_c4d795d1724a: 314176 characters]',tip:'💡 Tibias verticaux, monte les hanches, menton rentré.'},
'kickback a l\'elastique':{img:'data:image/gif;base64,[BINARY_ASSET_d1240e29e543: 287984 characters]',tip:'💡 À quatre pattes, extension de jambe, fessier serré en haut.'},
'kickback a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_e9ca672b1e34: 282600 characters]',tip:'💡 Extension pure, jambe tendue vers l’arrière, sans cambrer.'},
'kickback a la poulie — drop set final':{img:'data:image/gif;base64,[BINARY_ASSET_e9ca672b1e34: 282600 characters]',tip:'💡 Extension pure, jambe tendue vers l’arrière, sans cambrer.'},
'leg curl machine':{img:'data:image/gif;base64,[BINARY_ASSET_351a4c36c6dc: 348412 characters]',tip:'💡 Hanches plaquées, monte jusqu’à 90°.'},
'leg curl machine (ou swiss-ball leg curl)':{img:'data:image/gif;base64,[BINARY_ASSET_351a4c36c6dc: 348412 characters]',tip:'💡 Hanches plaquées, monte jusqu’à 90°.'},
'mollets assis':{img:'data:image/gif;base64,[BINARY_ASSET_2fbc534522fc: 163312 characters]',tip:'💡 Monte haut, pause 1 s en haut.'},
'mollets debout unilateraux':{img:'data:image/gif;base64,[BINARY_ASSET_7286d1c9e74f: 275488 characters]',tip:'💡 Une jambe, pointe haute, pause 1 s en haut.'},
'mountain climbers':{img:'data:image/gif;base64,[BINARY_ASSET_a0d5c7696514: 499104 characters]',tip:'💡 Gainage stable, genou vers la poitrine, rythme régulier.'},
'pallof press a l\'elastique':{img:'data:image/gif;base64,[BINARY_ASSET_b834ca203841: 191924 characters]',tip:'💡 Tire la bande, pousse devant, zéro rotation.'},
'pallof press a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_b834ca203841: 191924 characters]',tip:'💡 Tire la bande, pousse devant, zéro rotation.'},
'pompes inclinees (mains surelevees)':{img:'data:image/gif;base64,[BINARY_ASSET_e8f3bc95a374: 341544 characters]',tip:'💡 Corps aligné, coudes à 45°, poitrine vers le support.'},
'pont fessier au sol — activation':{img:'data:image/gif;base64,[BINARY_ASSET_7a3fae3c34ad: 239568 characters]',tip:'💡 Monte les hanches, 2 s de contraction en haut.'},
'presse a cuisses pieds hauts':{img:'data:image/gif;base64,[BINARY_ASSET_ce6d28ba0bd2: 718888 characters]',tip:'💡 Pieds sur le bord de la plateforme, jambes presque tendues, pause en haut.'},
'releves de jambes':{img:'data:image/gif;base64,[BINARY_ASSET_e2d95d0934f7: 259568 characters]',tip:'💡 Jambes tendues vers le ciel, descente lente.'},
'releves de jambes allongee':{img:'data:image/gif;base64,[BINARY_ASSET_e2d95d0934f7: 259568 characters]',tip:'💡 Jambes tendues vers le ciel, descente lente.'},
'reverse crunch':{img:'data:image/gif;base64,[BINARY_ASSET_7ecad23df8ca: 240704 characters]',tip:'💡 Amène les genoux vers la poitrine, lombaires enroulées.'},
'rowing barre buste penche':{img:'data:image/gif;base64,[BINARY_ASSET_f30918d14a82: 351764 characters]',tip:'💡 Dos plat, barre vers le nombril, sans balancer.'},
'rowing barre buste penche — test (3-5 reps)':{img:'data:image/gif;base64,[BINARY_ASSET_f30918d14a82: 351764 characters]',tip:'💡 Dos plat, barre vers le nombril, sans balancer.'},
'rowing haltere un bras':{img:'data:image/gif;base64,[BINARY_ASSET_22b7b3f8a6d2: 153384 characters]',tip:'💡 Dos plat, coude vers le ciel.'},
'souleve de terre roumain barre':{img:'data:image/gif;base64,[BINARY_ASSET_23dc351049d5: 143008 characters]',tip:'💡 Dos plat, pousse les hanches en arrière.'},
'souleve de terre roumain barre — test (3-5 reps)':{ref:'souleve de terre roumain barre'},
'souleve de terre roumain halteres':{img:'data:image/gif;base64,[BINARY_ASSET_7e261f1226cb: 129356 characters]',tip:'💡 Dos plat, haltères contre les cuisses.'},
'souleve de terre roumain unilateral':{img:'data:image/gif;base64,[BINARY_ASSET_ac69d8a2a4f8: 307784 characters]',tip:'💡 Hanche en arrière, jambe tendue devant, dos plat.'},
'souleve de terre roumain unilateral haltere':{img:'data:image/gif;base64,[BINARY_ASSET_001f5670ebf9: 244208 characters]',tip:'💡 Hanches en arrière, haltères contre les cuisses, dos neutre.'},
'step-up sur banc (hauteur du genou)':{img:'data:image/gif;base64,[BINARY_ASSET_a2257a828458: 180248 characters]',tip:'💡 Pousse sur le talon, monte sans élan, genou dans l’axe.'},
'tirage horizontal a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_24a62e0496d5: 384104 characters]',tip:'💡 Buste léger penché, tire vers le ventre, dos plat.'},
'tirage vertical prise large':{img:'data:image/gif;base64,[BINARY_ASSET_239f3a0368de: 289508 characters]',tip:'💡 Tire à la poitrine, omoplates basses, sans balancer.'},
'tirage vertical prise neutre':{img:'data:image/gif;base64,[BINARY_ASSET_239f3a0368de: 289508 characters]',tip:'💡 Tire à la poitrine, omoplates basses, sans balancer.'},
'elevations laterales halteres':{img:'data:image/gif;base64,[BINARY_ASSET_8184491d5f3f: 251368 characters]',tip:'💡 Monte à l’horizontale, sans élan, poignet bas.'},
'elevations laterales halteres — myo-reps':{img:'data:image/gif;base64,[BINARY_ASSET_8184491d5f3f: 251368 characters]',tip:'💡 Monte à l’horizontale, sans élan, poignet bas.'}
};

function getExoGif(name){if(typeof EXO_GIFS==='undefined'||!EXO_GIFS)return'';return EXO_GIFS[name]||'';}
function exoGifHtml(name){var s=getExoGif(name);if(!s)return'';var d=document.createElement('div');d.className='exo-gif-wrap';d.setAttribute('data-exo',name);d.innerHTML=s;d.addEventListener('click',function(){expandExoGif(this.getAttribute('data-exo'))});return d.outerHTML;}
function expandExoGif(name){var s=getExoGif(name);if(!s)return;var o=document.createElement('div');o.className='exo-gif-big';o.innerHTML='<div class="inner">'+s+'</div>';o.onclick=function(){o.remove()};document.body.appendChild(o);}
function closeExoGif(){var o=document.querySelector('.exo-gif-big');if(o)o.remove();}

/* ─── Demo overlay ─── */
function openDemo(title, inner){
  var ov=document.createElement('div'); ov.className='demo-ov'; ov.id='demo-ov';
  ov.innerHTML='<div class="demo-box"><div style="display:flex;justify-content:space-between;align-items:center"><b>'+title+'</b><button class="iconbtn" onclick="closeDemo()">✕</button></div><div class="demo-body">'+inner+'</div></div>';
  ov.addEventListener('click',function(e){if(e.target===ov)closeDemo()});
  document.body.appendChild(ov);
}
function closeDemo(){var ov=document.getElementById('demo-ov');if(ov)ov.remove();}

/* Demo button delegation */
document.addEventListener('click', function(e){
  var btn = e.target.closest('.demo-btn');
  if(btn){ openExoDemo(btn.getAttribute('data-exo')); }
});

function _findExoByName(name){
  var found=null;
  Object.keys(PROGRAM||{}).forEach(function(k){
    var m=PROGRAM[k]; if(!m||!m.sessions) return;
    Object.keys(m.sessions).forEach(function(sk){
      (m.sessions[sk].exos||[]).forEach(function(e){ if(e[0]===name) found=e; });
    });
  });
  return found;
}
function openExoDemo(name){
  try{
    var exo=_findExoByName(name);
    var mg=(typeof MUSCU_GUIDES!=='undefined')?MUSCU_GUIDES[norm(name)]:null;
    if(mg&&mg.ref) mg=MUSCU_GUIDES[mg.ref]||mg;
    if(mg&&mg.img){
      var chips='';
      if(exo){
        var mn=(MUSCLES[exo[1]]||{}).n||'';
        if(mn) chips+='<span class="chip chip-gold">'+esc(mn)+'</span> ';
        chips+='<span class="chip chip-blue">'+esc(String(exo[2]))+' \u00d7 '+esc(String(exo[3]))+'</span>';
        if(exo[5]) chips+=' <span class="chip chip-mut">repos '+exo[5]+' s</span>';
      }
      openModal('<h3>\u25b6 '+esc(name)+'</h3><img src="'+mg.img+'" style="width:100%;border-radius:12px;margin-bottom:8px" alt="d\u00e9mo">'+(chips?'<div class="flex mb" style="flex-wrap:wrap">'+chips+'</div>':'')+'<ul style="padding-left:18px;line-height:1.9;font-size:13.5px"><li>'+mg.tip+'</li></ul><div class="flex mt"><button class="btn btn-grad btn-sm" onclick="closeModal()">Compris !</button></div>');
      return;
    }
  }catch(_){}
  var svg=getExoGif(name);
  if(!svg){var nl=name.toLowerCase();var keys=Object.keys(EXO_GIFS||{});var best=keys.find(function(k){return k.toLowerCase()===nl})||keys.find(function(k){return k.toLowerCase().indexOf(nl)>=0||nl.indexOf(k.toLowerCase())>=0});if(best)svg=EXO_GIFS[best];}
  if(!svg){toast('Pas de démo pour cet exercice');return;}
  openDemo(name, '<div class="demo-stage"><div style="max-width:400px;margin:0 auto">'+svg+'</div></div>');
}


const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const round1 = v=>Math.round(v*10)/10;
const esc = s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* Analyse un nombre en acceptant la virgule décimale (clavier AZERTY / fr-FR) */
function numOr(v){
  const s=String(v==null?'':v).trim().replace(/\s+/g,'').replace(/,/g,'.');
  if(s===''||s==='-'||s==='.') return null;
  const f=parseFloat(s);
  return isNaN(f)? null : f;
}
const fmtKg = v=> (v==null||isNaN(v))?'—':(Number(v).toFixed(1)+' kg');
const fmtNum = v=> (v==null||isNaN(v))?'—':Math.round(v*10)/10;

/* ---------- Dates ---------- */
function parseDate(s){ const p=String(s).split('-'); return new Date(+p[0],+p[1]-1,+p[2]); }
function dateKey(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function todayKey(){ return dateKey(new Date()); }
function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }
function monthKeyOf(s){ return String(s).slice(0,7); }
function fmtDateFr(s){ if(!s) return '—'; const p=String(s).split('-'); const mois=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']; return (+p[2])+' '+mois[+p[1]-1]+' '+p[0]; }
function fmtDateShort(s){ if(!s) return '—'; const p=String(s).split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }
function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

/* ---------- État ---------- */
function defaultState(){
  const slot = ()=>({face:'',profil:'',dos:'',compl:''});
  return {
    /* Profil pré-rempli : femme · 41 ans · 1,60 m · 66 kg · 4 séances/semaine.
       Modifiable à tout moment dans l'onglet Profil. */
    profil:{nom:'Émilie',date:'',age:41,taille:160,poidsDepart:66,objectifPoids:63,sexe:'femme',
            niveau:'intermediaire',annees:'',seancesSemaine:4,mg:'',mm:''},
    /* Équipement disponible — pilote les variantes d'exercices et le cardio */
    equip:{salle:true, elliptique:true, piscine:true, barre:true, poulie:false,
           legcurl:false, machine_abd:false},
    mensurations:{jour0:{},mensuel:{}},
    poids:{}, mg:{},
    objectifs:{principal:'recomposition',cibles:{}},
    objectifsMensuels:{},
    photos:{j0:slot(),m3:slot(),m6:slot(),m9:slot(),m12:slot()},
    photoRappel:{semaine:0, date:''},
    journal:{}, seances:{}, recup:{},
    /* Cardio : suivi par date {format, duree, rpe, kcal, note} + choix par date */
    cardio:{}, cardioChoix:{},
    /* Piscine — Pool Lab : protocoles effectués + jours piscine choisis */
    natation:{seances:[],planDim:false,jours:[5]},
    nutri:{phase:'recomp',auto:true,ajustement:0,manuel:null,plan:null,journal:{}},
    force:{date:'',valeurs:{},historique:[],freqWeeks:FORCE_REVAL_WEEKS,repsMax:{}},
    hebdo:{},
    ui:{entHistWeek:null, entProgExo:''},
    badges:[], badgesNouveaux:[],
    bilanVu:{}, calOffset:0,
    stats:{demarrage:todayKey(), derniereVisite:todayKey()}
  };
}
let state = defaultState();
let charts = [];

/* ---------- Stockage résilient (localStorage + secours mémoire) ---------- */
let memoryStore = {};
let _storageAvail = null;
function storageAvailable(){
  if(_storageAvail!=null) return _storageAvail;
  try{
    const k='__tmx_probe__';
    window.localStorage.setItem(k,'1');
    window.localStorage.removeItem(k);
    _storageAvail=true;
  }catch(e){ _storageAvail=false; }
  return _storageAvail;
}
function save(){
  const data = JSON.stringify(state);
  let ok=false;
  if(storageAvailable()){
    try{ localStorage.setItem(LS_KEY, data); ok=true; }
    catch(e){
      // quota plein : on garde quand même en mémoire pour la session
      memoryStore[LS_KEY]=data;
      toast('⚠️ Stockage local plein : exportez vos données (⚙️) et réduisez les photos.');
    }
  } else {
    memoryStore[LS_KEY]=data;
    showStorageBanner();
  }
  markSaved(ok);
}
function markSaved(ok){
  const el = $('#save-ind'); if(!el) return;
  if(ok){
    const t=new Date();
    el.textContent='✓ '+t.getHours()+':'+String(t.getMinutes()).padStart(2,'0');
    el.classList.add('ok'); el.classList.remove('err');
    el.title='Enregistrement automatique — dernière sauvegarde à '+el.textContent.slice(2);
  } else {
    el.textContent='⚠️ non enregistré';
    el.classList.add('err'); el.classList.remove('ok');
    el.title='L\'enregistrement automatique a échoué (stockage bloqué ou plein)';
  }
}
let __hasStored=null; // vraie sauvegarde trouvée au démarrage ?
function load(){
  let raw=null, fromLocal=false;
  try{ raw = localStorage.getItem(LS_KEY); fromLocal = !!raw; }catch(e){ raw = memoryStore[LS_KEY]||null; fromLocal = !!raw; }
  // Secours : fichier HTML « avec mes données » (exportFileWithState) —
  // utile quand le localStorage est vide (nouveau fichier, autre téléphone,
  // navigateur qui ne garde pas le stockage).
  if(!raw){
    try{
      const p = window.__EMILIE_PRELOAD__;
      if(p) raw = (typeof p==='string') ? p : JSON.stringify(p);
    }catch(e){}
  }
  __hasStored = !!raw;
  if(raw){
    try{
      const d=JSON.parse(raw);
      /* Fusion profonde pour les objets structurés : une sauvegarde créée par une
         version antérieure (sans sexe / equip / cardio…) ne doit rien casser. */
      const base=defaultState();
      /* base doit rester intacte : on fusionne dans un objet neuf, sinon le
         Object.assign ci-dessous écraserait les valeurs par défaut avant la
         fusion profonde (une vieille sauvegarde sans `sexe` le ferait disparaître). */
      const merged=Object.assign({}, base, d);
      ['profil','equip','nutri','force','ui','stats','mensurations','objectifs','photos','photoRappel','natation'].forEach(k=>{
        if(base[k] && typeof base[k]==='object' && d && d[k] && typeof d[k]==='object' && !Array.isArray(d[k])){
          merged[k]=Object.assign({}, base[k], d[k]);
        }
      });
      ['journal','seances','recup','cardio','cardioChoix','hebdo','objectifsMensuels','bilanVu','poids','mg'].forEach(k=>{
        if(merged[k]==null || typeof merged[k]!=='object') merged[k]={};
      });
      if(!merged.natation || typeof merged.natation!=='object') merged.natation={seances:[],planDim:false,jours:[5],checks:{}};
      if(!Array.isArray(merged.natation.seances)) merged.natation.seances=[];
      if(!Array.isArray(merged.natation.jours)) merged.natation.jours=[];
      if(!merged.natation.checks || typeof merged.natation.checks!=='object') merged.natation.checks={};
      state=merged;
    }catch(e){}
  }
  // État récupéré depuis un fichier « avec mes données » (pas du localStorage) :
  // migration immédiate pour que la prochaine ouverture le retrouve ici.
  if(__hasStored && !fromLocal){ try{ save(); }catch(e){} }
}

function resetAll(){
  try{ localStorage.removeItem(LS_KEY); }catch(e){}
  memoryStore={}; state=defaultState(); location.reload();
}
function showStorageBanner(){ const b=$('#storage-banner'); if(b) b.style.display='block'; }
function hideStorageBanner(){ const b=$('#storage-banner'); if(b) b.style.display='none'; }

/* ---------- Focus & clavier mobiles ----------
   Sur Android, l'ouverture du clavier réduit la hauteur de la fenêtre → événement
   'resize'. Si la vue se re-rendait alors, le champ perdait le focus et le clavier
   se refermait instantanément. On détecte la saisie en cours (textFocused) et on
   bloque tout re-rendu pendant ce temps. */
let textFocused=false;
function isTextInput(el){
  if(!el||!el.tagName) return false;
  const t=el.tagName;
  if(t==='TEXTAREA'||t==='SELECT') return true;
  if(t==='INPUT'){
    const ty=String(el.type||'text').toLowerCase();
    return !['checkbox','radio','button','submit','reset','range','color','file','hidden','date','time','datetime-local','month','week'].includes(ty);
  }
  return false;
}
document.addEventListener('focusin', e=>{ textFocused=isTextInput(e.target); }, true);
document.addEventListener('focusout', ()=>{ textFocused=false; }, true);

/* Boutons +/− (saisie sans clavier, utile si le clavier natif est bloqué) */
function stepField(id, delta, step, min){
  const el=document.getElementById(id); if(!el) return;
  const cur=numOr(el.value)||0;
  const s=step||0.5;
  let nv=Math.round((cur+delta)/s)*s;
  if(min!=null&&!isNaN(min)) nv=Math.max(min,nv);
  nv=Math.round(nv*100)/100;
  el.value=String(nv).replace('.', ',');
  el.dispatchEvent(new Event('input',{bubbles:true}));
  try{ el.focus({preventScroll:true}); }catch(_){ try{ el.focus(); }catch(_2){} }
}
document.addEventListener('click', e=>{
  const b = e.target && e.target.closest ? e.target.closest('.ns-btn') : null;
  if(!b) return;
  if(b.getAttribute('data-long')==='1'){ b.removeAttribute('data-long'); return; }
  e.preventDefault();
  stepField(b.getAttribute('data-id'), parseFloat(b.getAttribute('data-step')||'0.5'), parseFloat(b.getAttribute('data-stepsize')||'0.5'), parseFloat(b.getAttribute('data-min')||'0'));
}, true);
/* Maintien appuyé → répétition du + ou − */
document.addEventListener('pointerdown', e=>{
  const b = e.target && e.target.closest ? e.target.closest('.ns-btn') : null;
  if(!b) return;
  const id=b.getAttribute('data-id'), delta=parseFloat(b.getAttribute('data-step')||'0.5');
  const step=parseFloat(b.getAttribute('data-stepsize')||'0.5'), min=parseFloat(b.getAttribute('data-min')||'0');
  const t0=Date.now();
  const iv=setInterval(()=>{ if(Date.now()-t0>450){ b.setAttribute('data-long','1'); stepField(id,delta,step,min); } }, 100);
  const stop=()=>{ clearInterval(iv); window.removeEventListener('pointerup',stop); window.removeEventListener('pointercancel',stop); };
  window.addEventListener('pointerup',stop); window.addEventListener('pointercancel',stop);
});

/* ---------- Auto-sauvegarde pendant la saisie ---------- */
let saveTimer=null;
function debounceSave(){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{ try{ save(); }catch(e){} }, 350);
}
function flashSaved(el){
  if(!el) return;
  el.classList.remove('saved-flash');
  void el.offsetWidth; // relance l'animation
  el.classList.add('saved-flash');
  clearTimeout(el._flashT);
  el._flashT=setTimeout(()=>el.classList.remove('saved-flash'), 900);
}
/* Correspondance id champ profil → clé de l'état */
const PROFILE_MAP = {
  'p-nom':'nom','p-date':'date','p-age':'age','p-taille':'taille','p-poids':'poidsDepart',
  'p-objectif-poids':'objectifPoids','p-annees':'annees','p-mg':'mg','p-mm':'mm',
  'p-niveau':'niveau','p-seances':'seancesSemaine','p-sexe':'sexe'
};
function autoActivateIfComplete(){
  const p=state.profil;
  const complet = String(p.nom||'').trim() && p.age && p.taille && p.poidsDepart;
  if(!complet) return;
  const d = p.date || todayKey();
  const etaitActive = !!p.date;
  p.date = d;
  if(!state.poids[d]) state.poids[d]=parseFloat(p.poidsDepart);
  if(p.mg && !state.mg[d]) state.mg[d]=parseFloat(p.mg);
  if(!state.nutri.phase) state.nutri.phase=phaseNutritionRecommandee();
  if(!etaitActive) toast('✅ Programme activé automatiquement à partir de vos données !');
}
function bindAutoSave(){
  document.addEventListener('input', ev=>{
    const t=ev.target;
    if(!t) return;
    if(t.id && (t.id in PROFILE_MAP)){
      const key=PROFILE_MAP[t.id];
      const raw=String(t.value);
      // normalise la virgule décimale pour les champs numériques ; garde tel quel pour nom/date
      state.profil[key] = (key==='nom'||key==='date') ? raw : raw.replace(',', '.');
      if(t.id==='p-taille'||t.id==='p-poids') calcIMC();
      autoActivateIfComplete();
      debounceSave();
      flashSaved(t);
    } else if(t.id && t.id.indexOf('mj-')===0){
      const key=t.id.slice(3);
      const v=numOr(t.value);
      if(!state.mensurations.jour0) state.mensurations.jour0={};
      state.mensurations.jour0[key]=v==null?'':v;
      debounceSave();
      flashSaved(t);
    } else if(t.closest && t.closest('#modal-root') && t.hasAttribute && t.hasAttribute('data-f') && curSession){
      // Saisie dans le journal de séance : enregistre le brouillon en direct
      try{
        const d=curSession.date;
        const exos=readSessionInputs().filter(e=>e.ch!==''||e.reps!==''||e.se!==''||e.rir!==''||e.rpe!==''||e.com);
        const j=Object.assign({}, state.journal[d]||{}, {exos});
        state.journal[d]=j;
        debounceSave();
        flashSaved(t);
      }catch(err){ try{ console.error('[autosave séance]', err); }catch(_){} }
    }
  });
}

/* ---------- Toast / Modal ---------- */
let toastTimer=null;
function toast(msg){
  let t=$('#toast-root .toast');
  if(!t){ t=document.createElement('div'); t.className='toast'; $('#toast-root').appendChild(t); }
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2600);
}
function openModal(html, cls){
  const ov=document.createElement('div'); ov.className='modal-ov';
  ov.innerHTML='<div class="modal '+(cls||'')+'"><button class="m-close" onclick="closeModal()">✕</button>'+html+'</div>';
  ov.addEventListener('mousedown',e=>{ if(e.target===ov) closeModal(); });
  $('#modal-root').appendChild(ov); document.body.style.overflow='hidden';
}
function closeModal(){
  // Avec des modales empilées (ex. liste de séance + démo GIF), il faut fermer
  // celle du DESSUS (le dernier overlay), pas la première : sinon la démo
  // refermait la liste et on atterrissait sur la vue Entraînement derrière.
  const ovs = document.querySelectorAll('#modal-root .modal-ov');
  const ov = ovs[ovs.length-1];
  if(ov){ ov.remove(); if(!document.querySelector('#modal-root .modal-ov')) document.body.style.overflow=''; }
}

/* ---------- Navigation ---------- */
const NAV=[['v-dashboard','🏠','Dashboard'],['v-profil','👤','Profil'],['v-force','🔢','Bilan 1RM'],['v-entrainement','🏋️','Entraînement'],['v-cardio','🚴','Cardio'],['v-piscine','🏊','Piscine'],['v-transfo','📊','Transformation'],['v-mensurations','📏','Mensurations'],['v-nutrition','🍽️','Nutrition'],['v-repas','🥗','Repas'],['v-recuperation','😴','Récupération'],['v-progression','📈','Progression'],['v-photos','📸','Photos'],['v-calendrier','📅','Calendrier'],['v-objectifs','🏆','Objectifs'],['v-equipe','🧠','Équipe']];
function buildNav(){
  $('#topnav').innerHTML = NAV.map(n=>'<button data-v="'+n[0]+'" onclick="go(\''+n[0]+'\')"><span class="ic">'+n[1]+'</span>'+n[2]+'</button>').join('');
  const primary = ['v-dashboard','v-entrainement','v-cardio','v-transfo','v-nutrition'].map(id=>NAV.find(n=>n[0]===id)).filter(Boolean);
  $('#bottomnav').innerHTML = '<div class="bn-row">'+primary.map(n=>'<button data-v="'+n[0]+'" onclick="go(\''+n[0]+'\')"><span class="ic">'+n[1]+'</span>'+n[2]+'</button>').join('')+
    '<button onclick="openMoreNav()"><span class="ic">📋</span>Plus</button></div>';
}
function openMoreNav(){
  const items = NAV.slice(5).map(n=>'<div class="checkrow" style="cursor:pointer" onclick="go(\''+n[0]+'\');closeModal()"><span style="font-size:20px">'+n[1]+'</span> '+n[2]+'</div>').join('');
  openModal('<h3>📋 Toutes les sections</h3>'+items);
}
function go(vid){
  $$('.view').forEach(v=>v.classList.remove('active'));
  const el=$('#'+vid); if(el) el.classList.add('active');
  $$('.topnav button,[data-v]').forEach(b=>b.classList.toggle('active', b.dataset.v===vid));
  window.scrollTo({top:0});
  renderView(vid);
}
function renderView(vid){
  if(vid==='v-dashboard') renderDashboard();
  else if(vid==='v-profil') renderProfil();
  else if(vid==='v-force') renderForce();
  else if(vid==='v-mensurations') renderMensurations();
  else if(vid==='v-entrainement') renderEntrainement();
  else if(vid==='v-cardio') renderCardio();
  else if(vid==='v-piscine') renderPiscine();
  else if(vid==='v-transfo') renderTransfo();
  else if(vid==='v-nutrition') renderNutrition();
  else if(vid==='v-repas') renderRepas();
  else if(vid==='v-recuperation') renderRecuperation();
  else if(vid==='v-progression') renderProgression();
  else if(vid==='v-photos') renderPhotos();
  else if(vid==='v-calendrier') renderCalendrier();
  else if(vid==='v-objectifs') renderObjectifs();
  else if(vid==='v-equipe') renderEquipe();
  else if(vid==='v-bilan') renderBilan();
}

/* ---------- Position dans le programme ---------- */
function startDate(){ return state.profil.date || todayKey(); }
function programPos(dateStr){
  const start = parseDate(startDate());
  const d = parseDate(dateStr||todayKey());
  const diff = Math.max(0, Math.floor((d-start)/86400000));
  const weekGlobal = Math.min(51, Math.floor(diff/7));
  if(weekGlobal>=48){ return {idx:'F',mois:13,week:weekGlobal-47,weekGlobal,phase:PROGRAM.finale,deload:true,label:'Finale'}; }
  const idx = Math.min(12, Math.floor(weekGlobal/4)+1);
  const week = weekGlobal%4+1;
  return {idx,mois:idx,week,weekGlobal,phase:PROGRAM[idx],deload:week===4,label:'Mois '+idx};
}
function nbSemainesEcoulees(){
  if(!state.profil.date) return 0;
  const diff = Math.floor((parseDate(todayKey())-parseDate(state.profil.date))/86400000);
  return Math.min(52, Math.max(0, Math.floor(diff/7)));
}
function nbJoursEcoules(){
  if(!state.profil.date) return 0;
  return Math.min(365, Math.max(0, Math.floor((parseDate(todayKey())-parseDate(state.profil.date))/86400000)));
}

/* ---------- Plan de la semaine ----------
   Séquence fixe (pas de rotation) pour garantir un espacement optimal entre
   les deux grosses séances fessiers :
   4 séances → Lun 🍑 · Mar 💪 · Mer 🚴 · Jeu 🍑 · Ven 🏊/🚴 · Sam 🔥 · Dim repos
   3 séances → Lun 🍑 · Mar 🚴 · Mer 🍑 · Jeu repos · Ven 🍑🔥 · Sam 🚴 · Dim repos
   5 séances → Lun 🍑 · Mar 💪 · Mer 🚴 · Jeu 🍑 · Ven 🔥 · Sam 🍑 · Dim repos
   Le cardio est toujours placé loin des séances fessiers lourdes. */
const SEQUENCE_SEANCES = {3:['J1','J3','J4'], 4:['J1','J2','J3','J4'], 5:['J1','J2','J3','J4','J5']};
const JOURS_SEANCES = {3:[1,3,5], 4:[1,2,4,6], 5:[1,2,4,5,6]};
const JOURS_CARDIO = {3:[2,6], 4:[3,5], 5:[3]};

/* Format cardio d'un jour donné : elliptique / piscine / repos actif.
   Le choix de l'utilisatrice (state.cardioChoix) prime sur la suggestion. */
function cardioDuJour(dateStr, wkDay){
  const pos = programPos(dateStr);
  const phase = pos.phase;
  const dispo = state.equip || {};
  const choix = state.cardioChoix && state.cardioChoix[dateStr];
  let format;
  if(choix && CARDIO_TYPES[choix]) format = choix;
  else if(pos.deload) format = dispo.piscine!==false ? 'piscine' : 'repos';
  else format = (wkDay===5 && dispo.piscine!==false) ? 'piscine' : (dispo.elliptique!==false ? 'elliptique' : 'repos');
  const base = CARDIO_TYPES[format];
  let duree, zone, detail;
  if(pos.deload){ duree = format==='piscine'?30:25; zone=0; detail='Semaine de deload : récupération active uniquement (zone 1, 50-60 % FCM). Aucune intensité.'; }
  else if(phase.type==='developpement'){ duree = format==='piscine'?25:20; zone=1; detail='Phase de développement fessier : cardio volontairement réduit et modéré pour préserver la récupération des fessiers.'; }
  else if(phase.type==='composition'){ duree = format==='piscine'?30:28; zone= wkDay===3?2:1; detail='Phase de composition : on augmente la dépense énergétique. Zone 2-3, jamais la veille d\'une séance fessiers.'; }
  else if(phase.type==='maintien'||phase.type==='finale'){ duree = format==='piscine'?30:25; zone=1; detail='Entretien de la condition physique à allure modérée.'; }
  else { duree = format==='piscine'?25:20; zone=1; detail='Cardio modéré : on parle par phrases courtes. Brûle des graisses sans retarder la récupération.'; }
  if(format==='repos'){ duree = 35; zone=0; detail='Marche active 35-45 min, mobilité et étirements. Idéal si la fatigue est élevée ou si les fessiers sont encore courbaturés.'; }
  const z = ZONES_CARDIO[zone];
  return {format, ic:base.ic, nom:base.n, duree, zone, zoneNom:z.n, zonePct:z.pct, detail,
          label: base.ic+' Cardio — '+base.n+' ('+duree+' min)'};
}

function weekPlan(dateStr){
  const pos = programPos(dateStr);
  const phase = pos.phase;
  const a = clamp(parseInt(state.profil.seancesSemaine||4)||4, 3, 5);
  const seq = SEQUENCE_SEANCES[a];
  const start = parseDate(startDate());
  const d = parseDate(dateStr);
  const weekGlobal = Math.max(0, Math.floor((d-start)/86400000/7));
  const monday = addDays(start, weekGlobal*7);
  const trainDays = JOURS_SEANCES[a];
  const cardioDays = pos.deload ? JOURS_CARDIO[a].slice(0,1) : JOURS_CARDIO[a];
  let plan=[];
  for(let i=0;i<7;i++){
    const day = addDays(monday,i);
    const wk = day.getDay(); // 0 dim..6 sam
    const dk = dateKey(day);
    let key=null, type=null, cardio=null, label='Repos', session=null;
    if(trainDays.includes(wk)){
      const idx = trainDays.indexOf(wk);
      if(idx < seq.length){
        key = seq[idx];
        const s = phase.sessions && phase.sessions[key];
        if(s){ type='seance'; session=s; label=s.nom; }
      }
    }
    if(!key && cardioDays.includes(wk)){
      cardio = cardioDuJour(dk, wk);
      key='CARDIO'; type='metcon';
      label = pos.deload ? '🧘 Récupération active' : cardio.label;
      if(cardio.format==='piscine' && !pos.deload){
        try{
          const _sp2=poolProtocolFor(dk); const _pr2=POOL_PROTOS.find(p=>p.id===_sp2.id);
          if(_pr2) label='🏊 Piscine — '+_pr2.nom+' ('+_fmtDur(_protoDur((_pr2.niveaux[_sp2.lvl||0]||_pr2.niveaux[0]).steps))+')';
        }catch(_){}
      }
    }
    if(!key && !type && poolDays().indexOf(wk)>=0){
      type='piscine';
      try{
        const _sp=poolProtocolFor(dk); const _pr=POOL_PROTOS.find(p=>p.id===_sp.id);
        label=_pr ? '🏊 '+_pr.nom+' ('+_fmtDur(_protoDur((_pr.niveaux[_sp.lvl||0]||_pr.niveaux[0]).steps))+')' : '🏊 Piscine — Pool Lab';
      }catch(_){ label='🏊 Piscine — Pool Lab'; }
    }
    plan.push({date:dk, wk, key, type, label, session, cardio});
  }
  return plan;
}

/* ---------- Fréquence cardiaque & cardio ---------- */
function fcm(){ const age = parseFloat(state.profil.age); return age? Math.round(208 - 0.7*age) : 179; }
function zoneFC(zone){ const f=fcm(); return [Math.round(f*zone.pct[0]), Math.round(f*zone.pct[1])]; }
function planifieMois(mois){
  const phase = PROGRAM[mois]||PROGRAM.finale;
  return {mois, phase};
}

/* ---------- Nutrition — profil féminin : recomposition & raffermissement ----------
   Mifflin-St Jeor avec le terme −161 pour les femmes (et +5 pour les hommes),
   facteur d'activité réaliste pour 4 séances/semaine, protéines 1,6-2,0 g/kg
   et lipides ≥ 0,9 g/kg (santé hormonale). Aucun régime extrême. */
function bmr(p){
  if(!p.age||!p.taille||!p.poidsDepart) return null;
  const base = 10*(+p.poidsDepart) + 6.25*(+p.taille) - 5*(+p.age);
  return (String(p.sexe||'femme').toLowerCase()==='homme') ? base + 5 : base - 161;
}
function tdee(p){
  const b = bmr(p); if(!b) return null;
  const se = clamp(parseInt(p.seancesSemaine||4)||4,3,5);
  /* Facteur d'activité prudent : 4 séances + cardio léger + activité quotidienne.
     Mieux vaut sous-estimer légèrement que surestimer et stagner. */
  const facteur = se>=5 ? 1.6 : se===4 ? 1.5 : 1.4;
  return Math.round(b*facteur);
}
function objectifPrincipalTexte(){
  const map = {
    masse:'Prise de masse musculaire — surplus calorique contrôlé (rarement utile à 41 ans : on privilégie la recomposition).',
    esthetique:'Esthétique féminine — léger surplus ciblé sur les fessiers, puis réduction progressive de la masse grasse.',
    recomposition:'Recomposition corporelle — calories proches de la dépense, protéines élevées : on construit les fessiers et on perd du gras en même temps. C\'est la stratégie recommandée pour votre objectif.',
    seche:'Perte de graisse — déficit modéré (jamais plus de 15 %) en préservant le galbe des fessiers et la masse musculaire.',
    force:'Force — priorité aux charges lourdes sur le hip thrust et le soulevé de terre roumain, surplus léger.'
  };
  return map[state.objectifs.principal]||'';
}
function phaseNutritionRecommandee(){
  const mg = parseFloat(state.profil.mg);
  const obj = state.objectifs.principal;
  if(obj==='masse'||obj==='force') return 'surplus';
  if(obj==='seche') return 'deficit';
  if(obj==='esthetique') return mg>=30?'recomp':'surplus';
  /* Recomposition par défaut : seuils de masse grasse féminins (≈ 28 %) */
  return mg>=28 ? 'deficit' : 'recomp';
}
function caloriesCibles(){
  const t = tdee(state.profil);
  if(!t) return null;
  const p = state.nutri.phase||'maintien';
  const obj = state.objectifs.principal;
  let cal = t;
  /* Écarts volontairement modérés : chez la femme, un déficit trop agressif
     fait chuter la performance, le sommeil et l'équilibre hormonal. */
  if(p==='surplus') cal = t*1.07;              // +7 % : construction fessière propre
  else if(p==='deficit') cal = t*0.87;         // −13 % : max recommandé
  else if(p==='recomp') cal = t*0.97;          // −3 % : recomposition
  else cal = t*1.00;                           // maintien strict
  cal += (state.nutri.ajustement||0);
  const prot = (p==='deficit'||p==='recomp') ? 1.9 : 1.7;   // g/kg
  const lip  = 1.0;                                          // g/kg — jamais sous 0,9
  const pG = round1(prot*(+state.profil.poidsDepart));
  const lG = round1(lip*(+state.profil.poidsDepart));
  const cG = Math.max(90, Math.round((cal - pG*4 - lG*9)/4));
  return {cal:Math.round(cal), prot:pG, glu:cG, lip:lG, tdee:t};
}
function nutriPhaseInfo(){
  const map = {
    maintien:{n:'Maintien',ic:'⚖️',desc:'Calories = dépense : stabilisation du poids, base du passage en entretien durable.',coul:'chip-blue'},
    surplus:{n:'Surplus ciblé fessiers',ic:'📈',desc:'+7 % seulement : on construit le galbe des fessiers en limitant au maximum la prise de gras.',coul:'chip-green'},
    deficit:{n:'Déficit modéré',ic:'📉',desc:'−13 % maximum : on révèle les abdominaux et on affine la taille sans sacrifier le galbe ni la force.',coul:'chip-orange'},
    recomp:{n:'Recomposition',ic:'♻️',desc:'Calories ≈ dépense + protéines 1,9 g/kg : perte de gras et construction fessière simultanées. Stratégie recommandée.',coul:'chip-gold'}
  };
  return map[state.nutri.phase]||map.maintien;
}
/* Stratégie annuelle alignée sur les 5 cycles féminins */
function strategieAnnuelle(){
  return [
    {mois:1,  nom:'Recomposition douce', detail:'Calories ≈ dépense, protéines 1,9 g/kg. On apprend à manger pour construire, sans restriction.', phase:'recomp'},
    {mois:2,  nom:'Recomposition douce', detail:'Mêmes apports. Si le tour de taille baisse et que le tour de fessiers monte, tout va bien.', phase:'recomp'},
    {mois:3,  nom:'Recomposition — ajustement', detail:'On ajuste selon la tendance de poids : ±100 kcal si besoin. Priorité aux protéines autour de l\'entraînement.', phase:'recomp'},
    {mois:4,  nom:'Léger surplus ciblé fessiers', detail:'+5 à 7 % : la progression des charges démarre, on donne au muscle de quoi se construire.', phase:'surplus'},
    {mois:5,  nom:'Léger surplus (fin de cycle, deload)', detail:'Semaine 4 en deload : maintien strict pour stabiliser.', phase:'maintien'},
    {mois:6,  nom:'Surplus ciblé fessiers', detail:'+7 % : phase de développement prioritaire des fessiers. Glucides augmentés autour des séances.', phase:'surplus'},
    {mois:7,  nom:'Surplus ciblé fessiers', detail:'Volume fessier maximal : ne pas réduire les calories, même si le poids monte légèrement.', phase:'surplus'},
    {mois:8,  nom:'Surplus → maintien', detail:'Fin du cycle : on revient progressivement au maintien. Le galbe est construit.', phase:'maintien'},
    {mois:9,  nom:'Recomposition', detail:'Calories ≈ dépense, protéines 1,9 g/kg : on commence à révéler le muscle construit.', phase:'recomp'},
    {mois:10, nom:'Déficit modéré (−10 %)', detail:'Réduction progressive de la masse grasse. Le hip thrust lourd reste : c\'est lui qui protège le galbe.', phase:'deficit'},
    {mois:11, nom:'Déficit modéré (−13 %)', detail:'Finition : abdominaux visibles, taille affinée. Jamais en dessous de −13 %.', phase:'deficit'},
    {mois:12, nom:'Maintien — stabilisation', detail:'Retour au maintien pour ancrer la nouvelle composition corporelle.', phase:'maintien'},
    {mois:13, nom:'Maintien — bilan final', detail:'Semaines 49-52 : maintien et préparation du programme d\'entretien à long terme.', phase:'maintien'}
  ];
}
/* Tendance de poids attendue — adaptée à un objectif féminin (pas de prise rapide) */
function ajustementAuto(){
  const poids = Object.entries(state.poids).sort();
  if(poids.length<3) return {msg:'Ajoutez au moins 3 pesées pour activer les ajustements.', delta:0};
  const recent = poids.slice(-4).map(x=>+x[1]);
  const moy = recent.reduce((a,b)=>a+b,0)/recent.length;
  const debut = +poids[0][1];
  const duree = Math.max(1, Math.floor((parseDate(poids[poids.length-1][0])-parseDate(poids[0][0]))/86400000/7));
  const taux = (moy - debut)/duree; // kg/semaine
  const phase = state.nutri.phase||'maintien';
  let attendu=0;
  if(phase==='surplus') attendu = 0.12;      // +0,12 kg/sem. max en surplus ciblé
  if(phase==='deficit') attendu = -0.40;     // −0,4 kg/sem. : lent et durable
  if(phase==='recomp'||phase==='maintien') attendu = 0.0;
  const ecart = taux - attendu;
  let delta=0, msg='';
  if(Math.abs(ecart)>0.20){
    delta = ecart>0 ? -100 : 100;
    msg = ecart>0
      ? '⚠️ Votre poids évolue plus vite que prévu ('+round1(taux)+' kg/sem. pour un objectif de '+round1(attendu)+'). '+Math.abs(delta)+' kcal/jour suggérées en moins.'
      : '⚠️ Votre poids n\'évolue pas assez ('+round1(taux)+' kg/sem.). +'+Math.abs(delta)+' kcal/jour suggérées — vérifiez aussi la qualité du sommeil et les protéines.';
  } else if(taux < -0.60){
    delta = 150;
    msg = '🛑 Perte trop rapide ('+round1(taux)+' kg/sem.). Au-delà de 0,5 kg/semaine, vous risquez de perdre du muscle et du galbe. +150 kcal/jour suggérées.';
  } else if(duree>=1){
    msg = '✅ Tendance de poids conforme à l\'objectif ('+round1(taux)+' kg/sem.). Aucun ajustement nécessaire. Rappel : le poids seul ne dit rien — regardez le tour de taille, le tour de fessiers et vos charges.';
  } else msg='';
  return {msg, delta};
}
/* Répartition selon le type de journée (entraînement fessiers / haut / full body /
   cardio-piscine / repos). La moyenne hebdomadaire reste égale à la cible :
   on déplace les calories et surtout les glucides vers les jours utiles. */
const FACTEURS_JOUR = {
  fessiers:{cal:1.08, glu:1.22, prot:1.05, lip:0.95, ic:'🍑', n:'Jour fessiers / jambes',
    desc:'Le jour le plus riche de la semaine : les glucides sont placés avant et après la séance pour soutenir la performance et la construction du galbe.'},
  haut:{cal:1.02, glu:1.05, prot:1.00, lip:1.00, ic:'💪', n:'Jour haut du corps',
    desc:'Séance moins coûteuse : apports proches de la moyenne, protéines bien réparties.'},
  full:{cal:1.04, glu:1.10, prot:1.02, lip:0.98, ic:'🔥', n:'Jour full body',
    desc:'Légèrement au-dessus de la moyenne : séance globale + cardio en fin de séance.'},
  cardio:{cal:0.96, glu:0.90, prot:1.02, lip:1.05, ic:'🚴', n:'Jour cardio / piscine',
    desc:'Un peu moins de glucides, un peu plus de lipides : la séance est aérobie, les graisses sont le carburant principal.'},
  repos:{cal:0.90, glu:0.82, prot:1.05, lip:1.10, ic:'😴', n:'Jour de repos',
    desc:'Apports réduits et protéines maintenues hautes : on protège le muscle pendant la récupération.'}
};
/* Type de journée à partir d'une date (plan de la semaine) */
function jourTypeDe(dateStr){
  if(!dateStr || !state.profil.date) return 'repos';
  const p = weekPlan(dateStr).find(x=>x.date===dateStr);
  if(!p) return 'repos';
  if(p.type==='metcon') return 'cardio';
  if(p.type==='seance' && p.session){
    const ms = p.session.muscles||[];
    const fes = ms.includes('fes')||ms.includes('moy');
    const bas = ms.includes('qua')||ms.includes('isc')||ms.includes('mol');
    if(fes && (bas||ms.length>=5)) return (ms.includes('pec')||ms.includes('dos')) && !bas ? 'full' : (bas? 'fessiers' : 'full');
    if(fes) return 'fessiers';
    if(ms.includes('dos')||ms.includes('epL')||ms.includes('epA')) return 'haut';
    return 'full';
  }
  return 'repos';
}
function macroJour(mois, jourType){
  const c = caloriesCibles(); if(!c) return null;
  const plan=strategieAnnuelle(); const st=plan[clamp(mois,1,13)-1]||plan[0];
  let prot=c.prot, lip=c.lip;
  if(st.phase==='deficit'||st.phase==='recomp'){ prot = round1(1.9*(+state.profil.poidsDepart)); }
  let cal;
  if(st.phase==='surplus') cal = c.tdee*(mois>=6&&mois<=8?1.07:1.05);
  else if(st.phase==='deficit') cal = c.tdee*(mois===11?0.87:0.90);
  else cal = c.tdee*((state.nutri.ajustement||0)>0?1.01:0.99);
  cal += (state.nutri.ajustement||0);
  /* Application du facteur du type de journée */
  const f = FACTEURS_JOUR[jourType||'repos'];
  if(f){
    cal = cal*f.cal;
    prot = prot*f.prot;
    lip = lip*f.lip;
  }
  const glu = Math.max(80, Math.round((cal - prot*4 - lip*9)/4));
  return {cal:Math.round(cal), prot:round1(prot), glu, lip:round1(lip), phase:st.phase, nom:st.nom,
          jourType:jourType||'repos', jourInfo:f};
}

/* ---------- Plan de repas jour par jour ---------- */
function genererPlanJour(mois, jourIdx, jourType){
  const m = macroJour(mois, jourType); if(!m) return null;
  const T = {cal:m.cal, p:m.prot, g:m.glu, l:m.lip};
  const ck = cat => cat==='prot' ? 'p' : (cat==='lip' ? 'l' : 'g');
  const plan=[];
  REPAS_CREUX.forEach((mt, i)=>{
    const cible = {cal:T.cal*mt.pP, p:T.p*mt.pP, g:T.g*mt.pG, l:T.l*mt.pL};
    const options = REPAS_JOURS[mt.nom]||[[]];
    const template = options[(jourIdx||0) % options.length]||[];
    let rows=[];
    let total={cal:0,p:0,g:0,l:0};
    for(const [nom,cat] of template){
      const A = ALIMENTS[nom]; if(!A) continue;
      const key = ck(cat);
      let reste = Math.max(0, cible[key] - total[key]);
      let portion=0;
      if(cat==='leg') portion = reste>0?100:60;
      else if(cat==='fruit') portion = reste>0? Math.min(150, reste/A.g*100) : 0;
      else if(cat==='prot') portion = Math.max(0, Math.round((reste/(A.p/100))/5)*5);
      else if(cat==='glu') portion = Math.max(0, Math.round((reste/(A.g/100))/5)*5);
      else if(cat==='lip') portion = Math.max(0, Math.round((reste/(A.f/100))/5)*5);
      if(portion>0){
        rows.push({nom, qte:portion, unit:'g', cal:A.cal*portion/100, p:A.p*portion/100, g:A.g*portion/100, l:A.l*portion/100});
        total.cal+=A.cal*portion/100; total.p+=A.p*portion/100; total.g+=A.g*portion/100; total.l+=A.l*portion/100;
      }
    }
    plan.push({nom:mt.nom, rows, total:{cal:Math.round(total.cal),p:round1(total.p),g:Math.round(total.g),l:round1(total.l)}});
  });
  const totP = plan.reduce((a,b)=>a+b.total.p,0);
  const facteur = T.p/totP || 1;
  if(facteur>0.75 && facteur<1.35){
    for(const meal of plan){
      meal.rows = meal.rows.map(r=>({...r, qte:Math.round(r.qte*facteur/5)*5}));
      meal.total = {cal:Math.round(meal.total.cal*facteur), p:round1(meal.total.p*facteur), g:Math.round(meal.total.g*facteur), l:round1(meal.total.l*facteur)};
    }
  }
  const final = {cal:Math.round(plan.reduce((a,b)=>a+b.total.cal,0)), p:round1(plan.reduce((a,b)=>a+b.total.p,0)), g:Math.round(plan.reduce((a,b)=>a+b.total.g,0)), l:round1(plan.reduce((a,b)=>a+b.total.l,0))};
  return {plan, final, cible:T, jourType:m.jourType, jourInfo:m.jourInfo};
}
function genererPlanRepas(mois){ return genererPlanJour(mois, 0, 'fessiers'); }

/* Signaux d'entraînement dérivés du journal (pour le réajustement de l'équipe) */
function signauxEntrainement(wk){
  if(!state.profil.date) return null;
  const start=parseDate(state.profil.date);
  const wkStart=dateKey(addDays(start, wk*7));
  const wkEnd=dateKey(addDays(start, wk*7+6));
  // séances prévues / faites
  let prevues=0, faites=0, partiellement=0, manquees=0;
  for(let i=0;i<7;i++){
    const d=dateKey(addDays(parseDate(wkStart),i));
    const p=weekPlan(d).find(x=>x.date===d);
    if(p&&p.type==='seance'){
      prevues++;
      const st=state.seances[d];
      if(st==='ok') faites++;
      else if(st==='partiel') partiellement++;
      else if(st==='non') manquees++;
    }
  }
  // volume (tonnage) semaine courante et précédente
  const volSem = (a,b)=>{
    let v=0;
    Object.keys(state.journal).forEach(d=>{
      if(d>=a&&d<=b){
        (state.journal[d].exos||[]).forEach(e=>{ if(e.ch&&e.reps&&e.se) v+=e.ch*e.reps*e.se; });
      }
    });
    return v;
  };
  const vol = volSem(wkStart, wkEnd);
  const prevStart=dateKey(addDays(start,(wk-1)*7));
  const prevEnd=dateKey(addDays(start,(wk-1)*7+6));
  const volPrev = volSem(prevStart, prevEnd);
  const volTrend = (volPrev>0 && vol>0)? (vol/volPrev-1)*100 : null;
  // RIR / RPE moyens de la semaine
  let rpeSum=0,rpeN=0,rirSum=0,rirN=0;
  Object.keys(state.journal).forEach(d=>{
    if(d>=wkStart&&d<=wkEnd){
      (state.journal[d].exos||[]).forEach(e=>{
        if(e.rpe!==''&&e.rpe!=null){ rpeSum+=+e.rpe; rpeN++; }
        if(e.rir!==''&&e.rir!=null){ rirSum+=+e.rir; rirN++; }
      });
    }
  });
  const rpeMoy = rpeN? round1(rpeSum/rpeN) : null;
  const rirMoy = rirN? round1(rirSum/rirN) : null;
  // meilleur 1RM estimé de la semaine
  let prMax=null, prNom='';
  Object.keys(MAIN_LIFTS).forEach(k=>{
    const h=perfHistorique(k).filter(x=>x.date>=wkStart&&x.date<=wkEnd);
    if(h.length){ const m=Math.max(...h.map(x=>x.v)); if(prMax==null||m>prMax){ prMax=m; prNom=MAIN_LIFTS[k].n; } }
  });
  return {prevues, faites, partiellement, manquees, vol, volPrev, volTrend, rpeMoy, rirMoy, prMax, prNom, nJourns:Object.keys(state.journal).filter(d=>d>=wkStart&&d<=wkEnd).length};
}

/* ---------- Signaux spécifiques FESSIERS (priorité absolue du programme) ---------- */
function signauxFessiers(wk){
  if(!state.profil.date) return null;
  const start=parseDate(state.profil.date);
  const wkStart=dateKey(addDays(start, wk*7));
  const wkEnd=dateKey(addDays(start, wk*7+6));
  let setsFes=0, setsMoy=0, tonnage=0, nSeancesFes=0, rpeSum=0, rpeN=0, rirSum=0, rirN=0;
  Object.keys(state.journal).forEach(d=>{
    if(d<wkStart||d>wkEnd) return;
    let aFes=false;
    (state.journal[d].exos||[]).forEach(e=>{
      const n=norm(e.n);
      const isFes = /thrust|bridge|pont fessier|kickback|hip thrust|fessier/.test(n);
      const isMoy = /abduction|clamshell|fire hydrant|fessier/.test(n);
      const se=+e.se||0, ch=+e.ch||0, reps=+e.reps||0;
      if(isFes){ setsFes+=se; aFes=true; }
      if(isMoy) setsMoy+=se;
      if(isFes||isMoy){ tonnage+=ch*reps*se;
        if(e.rpe!=null&&e.rpe!==''){ rpeSum+=+e.rpe; rpeN++; }
        if(e.rir!=null&&e.rir!==''){ rirSum+=+e.rir; rirN++; }
      }
    });
    if(aFes) nSeancesFes++;
  });
  /* Fréquence fessière réellement travaillée */
  const prevStart=dateKey(addDays(start,(wk-1)*7));
  const prevEnd=dateKey(addDays(start,(wk-1)*7+6));
  let tonnagePrev=0;
  Object.keys(state.journal).forEach(d=>{
    if(d<prevStart||d>prevEnd) return;
    (state.journal[d].exos||[]).forEach(e=>{
      if(/thrust|bridge|pont fessier|kickback|fessier|abduction|clamshell|fire hydrant/.test(norm(e.n)))
        tonnagePrev += (+e.ch||0)*(+e.reps||0)*(+e.se||0);
    });
  });
  const ht = perfHistorique('hipthrust');
  const rdl = perfHistorique('rdl');
  const evoHip = ht.length>=2 ? round1((ht[ht.length-1].v-ht[0].v)/ht[0].v*100) : null;
  const evoRdl = rdl.length>=2 ? round1((rdl[rdl.length-1].v-rdl[0].v)/rdl[0].v*100) : null;
  return {setsFes, setsMoy, setsTotal:setsFes+setsMoy, tonnage, tonnagePrev, nSeancesFes,
          rpeMoy:rpeN?round1(rpeSum/rpeN):null, rirMoy:rirN?round1(rirSum/rirN):null,
          evoHip, evoRdl};
}

/* ---------- Bilan hebdomadaire de l'équipe ---------- */
function sundayDeSemaine(wk){
  return dateKey(addDays(parseDate(startDate()), wk*7+6));
}
function bilanHebdoEtat(){
  if(!state.profil.date) return null;
  const wk = programPos(todayKey()).weekGlobal;
  const sunday = sundayDeSemaine(wk);
  const today = todayKey();
  const soumis = !!(state.hebdo && state.hebdo[wk]);
  const joursAvant = Math.max(0, Math.ceil((parseDate(sunday)-parseDate(today))/86400000));
  return {wk, sunday, today, soumis, due: !soumis && today>=sunday, joursAvant};
}
function donneesManquantesHebdo(wk){
  if(!state.profil.date) return [];
  const items=[];
  const start=parseDate(startDate());
  const wkStart=dateKey(addDays(start, wk*7));
  const wkEnd=dateKey(addDays(start, wk*7+6));
  const today=todayKey();
  const pesee = Object.keys(state.poids).some(d=>d>=wkStart && d<=wkEnd);
  if(!pesee && today>=wkStart) items.push('⚖️ Pesée de la semaine (au moins 1)');
  const joursEcoules = clamp(Math.min(7, Math.floor((parseDate(today)-parseDate(wkStart))/86400000)+1), 1, 7);
  const nRec = Object.keys(state.recup).filter(d=>d>=wkStart && d<=wkEnd).length;
  if(nRec<joursEcoules) items.push('😴 Check-in récupération ('+nRec+'/'+joursEcoules+' jours)');
  let nSeance=0;
  for(let i=0;i<7;i++){ const d=dateKey(addDays(parseDate(wkStart),i)); const p=weekPlan(d).find(x=>x.date===d); if(p&&p.type==='seance'&&!state.seances[d]) nSeance++; }
  if(nSeance) items.push('🏋️ '+nSeance+' séance(s) à cocher/résultat à renseigner');
  if(wk%4===3){
    const mois=programPos(today).idx;
    const mk='M'+(mois==='F'?13:mois);
    if(!state.mensurations.mensuel[mk]) items.push('📏 Relevé de mensurations du mois');
  }
  return items;
}
function genererConseilsHebdo(b, wk){
  const conseils=[];
  // 1) Signaux d'entraînement dérivés du journal (séances, volume, RIR/RPE, records)
  const sg = (wk!=null)? signauxEntrainement(wk) : null;
  if(sg){
    if(sg.prevues>0 && sg.faites===0 && sg.manquees>0){
      conseils.push({ic:'📉',tag:'Coach',txt:'Aucune séance validée cette semaine ('+sg.manquees+'/'+sg.prevues+' non effectuées). Le coach repart plus léger : 3 séances simples cette semaine pour relancer la dynamique.'});
    } else if(sg.prevues>0 && sg.faites===0 && sg.partiellement>0){
      conseils.push({ic:'📋',tag:'Coach',txt:'Séances partiellement renseignées ('+sg.partiellement+'/'+sg.prevues+'). Validez chaque séance pour affiner le suivi et les ajustements.'});
    } else if(sg.prevues>0 && (sg.faites+sg.partiellement) < sg.prevues){
      const reste=sg.prevues-(sg.faites+sg.partiellement);
      conseils.push({ic:'📋',tag:'Coach',txt:'Adhérence : '+(sg.faites+sg.partiellement)+'/'+sg.prevues+' séances. '+(reste>0?'Il reste '+reste+' séance(s) à renseigner (calendrier) pour un suivi précis.':'')});
    }
    if(sg.volTrend!=null && sg.volTrend<-25){
      conseils.push({ic:'📊',tag:'Analyste',txt:'Volume d\'entraînement en baisse ('+Math.round(sg.volTrend)+' % vs semaine précédente) : si c\'est volontaire (deload/récupération), parfait ; sinon, un créneau saute — verrouillez vos horaires.'});
    }
    if(sg.volTrend!=null && sg.volTrend>25 && sg.manquees===0){
      conseils.push({ic:'📈',tag:'Analyste',txt:'Volume en hausse ('+Math.round(sg.volTrend)+' % vs semaine précédente) : bonne progression, surveillez simplement la récupération.'});
    }
    if(sg.rpeMoy!=null && sg.rpeMoy>=9 && sg.faites>0){
      conseils.push({ic:'🛌',tag:'Coach',txt:'Intensité perçue élevée (RPE moyen '+sg.rpeMoy+'/10) : les charges sont à la limite. Prévoyez une semaine plus légère (charges ~85 %) ou un deload anticipé.'});
    }
    if(sg.rirMoy!=null && sg.rirMoy<=0.5 && sg.faites>0){
      conseils.push({ic:'🎯',tag:'Coach',txt:'Séries souvent à l\'échec (RIR moyen '+sg.rirMoy+') : gardez 1-2 répétitions en réserve. Les séries à RIR 1-2 progressent mieux sur 12 mois.'});
    }
    if(sg.rpeMoy!=null && sg.rpeMoy<=6 && sg.faites>=sg.prevues-1 && sg.prevues>0){
      conseils.push({ic:'💪',tag:'Coach',txt:'Intensité perçue faible (RPE moyen '+sg.rpeMoy+'/10) sur toutes les séances : vous pouvez augmenter les charges de +2,5 % la semaine prochaine.'});
    }
    if(sg.prMax!=null){
      conseils.push({ic:'🏆',tag:'Analyste',txt:'Record estimé cette semaine : '+sg.prNom+' '+Math.round(sg.prMax)+' kg (1RM estimé). Bilan 1RM à mettre à jour si supérieur à votre valeur déclarée.'});
    }
  }
  // 2) Signaux déclarés (ressentis hebdomadaires)
  if(b.fatigue>=4) conseils.push({ic:'🛌',tag:'Coach',txt:'Fatigue élevée signalée ('+b.fatigue+'/5) : semaine prochaine, volume réduit d\'environ 20 % et charges à ~80 %. Priorité au sommeil (7 h 30-9 h).'});
  if(b.douleurs>=3) conseils.push({ic:'🩺',tag:'Référent santé',txt:'Douleurs signalées ('+b.douleurs+'/5) : ne forcez pas sur les mouvements douloureux — remplacez-les par des variantes plus sûres. Douleur vive ou persistante → consultez un professionnel de santé.'});
  if(b.energie<=2) conseils.push({ic:'🥗',tag:'Nutritionniste',txt:'Énergie faible ('+b.energie+'/5) : ajoutez 30-50 g de glucides autour des entraînements et hydratez-vous (35 ml/kg/jour).'});
  if(b.motivation<=2) conseils.push({ic:'🧠',tag:'Préparateur mental',txt:'Motivation basse ('+b.motivation+'/5) : réduisez l\'objectif à 3 séances simples cette semaine. Rappelez-vous votre photo Jour 0 — c\'est pour ça que vous avez commencé.'});
  const texte=(b.difficultes||'')+' '+(b.ressentis||'');
  if(/(sommeil|nuit|dors|insomnie)/i.test(texte)) conseils.push({ic:'🌙',tag:'Préparateur mental',txt:'Sommeil perturbé détecté : coucher fixe, pas d\'écran 1 h avant, caféine arrêtée après 14 h.'});
  if(/(stress|boulot|travail|charge|deborde|fatigue mentale)/i.test(texte)) conseils.push({ic:'🧘',tag:'Expert mobilité',txt:'Semaine chargée/stressante : déplacez une séance sur le week-end si nécessaire et ajoutez 10 min de respiration ou de marche le soir.'});
  const rm=moyenneRecup();
  if(rm!=null && rm<60) conseils.push({ic:'📊',tag:'Analyste',txt:'Récupération moyenne de la semaine : '+rm+'/100. Envisagez 1 séance en moins ou remplacez le cardio par une marche active ou 20 min de piscine.'});

  /* 3) Analyse spécifique FESSIERS — priorité absolue du programme */
  const sf = (wk!=null)? signauxFessiers(wk) : null;
  if(sf){
    const pos = programPos(sundayDeSemaine(wk));
    const cible = pos.phase.type==='developpement' ? 18 : pos.phase.type==='adaptation' ? 10 : 14;
    if(sf.nSeancesFes>0 && sf.setsTotal < cible){
      conseils.push({ic:'🍑',tag:'Coach',txt:'Volume fessier insuffisant : '+sf.setsTotal+' séries utiles cette semaine pour une cible de '+cible+' en phase « '+esc(pos.phase.titre.split('—')[0].trim())+' ». Ajoutez 2 à 3 séries sur l\'abduction de hanche et le kickback : ce sont les exercices qui construisent le galbe avec le moins de fatigue.'});
    }
    if(sf.nSeancesFes>0 && sf.setsTotal > 26){
      conseils.push({ic:'🍑',tag:'Coach',txt:'Volume fessier très élevé ('+sf.setsTotal+' séries) : au-delà de 24-26 séries par semaine, la récupération ne suit plus et le galbe stagne. Réduisez d\'une séance de rappel.'});
    }
    if(sf.nSeancesFes<2 && sg && sg.faites>=2){
      conseils.push({ic:'🍑',tag:'Coach',txt:'Vous n\'avez stimulé les fessiers qu\'une fois cette semaine. Le galbe progresse avec 2 à 3 stimulations hebdomadaires : ne sautez pas la séance J3.'});
    }
    if(sf.setsMoy<6 && sf.setsTotal>=cible){
      conseils.push({ic:'🍑',tag:'Coach',txt:'Peu de travail du moyen fessier ('+sf.setsMoy+' séries) : c\'est lui qui donne l\'arrondi latéral et comble le creux de la hanche. Ajoutez 3 séries d\'abduction + 2 de clamshell.'});
    }
    if(sf.tonnagePrev>0 && sf.tonnage>0 && sf.tonnage < sf.tonnagePrev*0.9 && sf.rpeMoy==null){
      conseils.push({ic:'🍑',tag:'Analyste',txt:'Tonnage fessier en baisse ('+Math.round(sf.tonnagePrev/1000)+' t → '+Math.round(sf.tonnage/1000)+' t). Si ce n\'est pas un deload, vérifiez le sommeil et les apports : le galbe se construit aussi à table.'});
    }
    if(sf.evoHip!=null && sf.evoHip<=0){
      conseils.push({ic:'🍑',tag:'Coach',txt:'Votre hip thrust ne progresse plus (1RM estimé stable). Trois leviers dans l\'ordre : (1) qualité de contraction — 2 s de pause en haut, (2) amplitude — tibias verticaux, (3) charge. Ne montez la charge qu\'après les deux premiers.'});
    } else if(sf.evoHip!=null && sf.evoHip>6){
      conseils.push({ic:'🍑',tag:'Coach',txt:'Hip thrust en progression de +'+sf.evoHip+' % : le galbe est en train de se construire. Maintenez la cadence, ne changez rien.'});
    }
  }
  if(!conseils.length) conseils.push({ic:'👍',tag:'Coach',txt:'Semaine conforme au plan : on maintient le cap. Progression en double : d\'abord les répétitions, ensuite la charge (+2,5 %).'});
  return conseils;
}

/* ---------- Graphiques (canvas natif) ---------- */
function setupCanvas(cv){
  const dpr = window.devicePixelRatio||1;
  const w = cv.clientWidth||400;
  const h = cv.clientHeight||240;
  cv.width = w*dpr; cv.height = h*dpr;
  const ctx = cv.getContext('2d');
  if(!ctx) return {ctx:null,w,h};
  ctx.scale(dpr,dpr);
  return {ctx,w,h};
}
function drawEmpty(cv,msg){
  const {ctx,w,h}=setupCanvas(cv);
  if(!ctx) return;
  ctx.fillStyle='rgba(255,255,255,0)';
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#5f6c88'; ctx.font='13px sans-serif'; ctx.textAlign='center';
  ctx.fillText(msg||'Pas encore de données', w/2, h/2);
}
function lineChart(cv, labels, series, opts){
  opts=opts||{};
  if(!labels||!labels.length||!series.some(s=>s.data.some(v=>v!=null))){ drawEmpty(cv, opts.empty||'Pas encore de données'); return; }
  const {ctx,w,h}=setupCanvas(cv);
  if(!ctx) return;
  const padL=46,padR=14,padT=14,padB=28;
  const iw=w-padL-padR, ih=h-padT-padB;
  const all = series.flatMap(s=>s.data.filter(v=>v!=null).map(Number));
  let min=Math.min(...all), max=Math.max(...all);
  if(min===max){ min-=1; max+=1; }
  const range=max-min; min-=range*.08; max+=range*.08;
  const x = i=>padL + (labels.length===1?iw/2: i/(labels.length-1)*iw);
  const y = v=>padT + ih - (v-min)/(max-min)*ih;
  let tipIdx = null;
  function draw(){
    ctx.clearRect(0,0,w,h);
    // grille
    ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.fillStyle='#5f6c88'; ctx.font='10px sans-serif'; ctx.textAlign='right';
    const steps=4;
    for(let i=0;i<=steps;i++){
      const val = min+(max-min)*i/steps;
      const yy=y(val);
      ctx.beginPath(); ctx.moveTo(padL,yy); ctx.lineTo(w-padR,yy); ctx.stroke();
      ctx.fillText(round1(val)+(opts.unit||''), padL-6, yy+3);
    }
    // axes labels
    ctx.textAlign='center';
    labels.forEach((l,i)=>{
      if(labels.length>14 && i%Math.ceil(labels.length/10)!==0) return;
      ctx.fillText(String(l).slice(0,7), x(i), h-8);
    });
    // séries
    series.forEach(s=>{
      const data=s.data;
      ctx.strokeStyle=s.color; ctx.lineWidth=2.2; ctx.lineJoin='round';
      ctx.beginPath();
      let started=false;
      data.forEach((v,i)=>{ if(v==null)return; if(!started){ctx.moveTo(x(i),y(v));started=true;} else ctx.lineTo(x(i),y(v)); });
      ctx.stroke();
      data.forEach((v,i)=>{
        if(v==null)return;
        ctx.fillStyle=s.color;
        ctx.beginPath(); ctx.arc(x(i),y(v),2.6,0,Math.PI*2); ctx.fill();
      });
    });
    // infobulle
    if(tipIdx!=null && labels.length>1){
      ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x(tipIdx),padT); ctx.lineTo(x(tipIdx),h-padB); ctx.stroke();
      let ty=padT+10;
      series.forEach(s=>{
        const v=s.data[tipIdx]; if(v==null)return;
        ctx.fillStyle=s.color;
        ctx.beginPath(); ctx.arc(x(tipIdx),y(v),4.5,0,Math.PI*2); ctx.fill();
        ctx.font='bold 11px sans-serif'; ctx.textAlign='left';
        ctx.fillText(s.name+': '+round1(v)+(opts.unit||''), x(tipIdx)+8, ty);
        ty+=16;
      });
    }
  }
  draw();
  cv.onmousemove=null; cv.onmouseleave=null;
  if(labels.length>1){
    cv.onmousemove=e=>{
      const r=cv.getBoundingClientRect();
      const mx=(e.clientX-r.left)/r.width*(cv.width/r.width);
      tipIdx = clamp(Math.round((mx-padL)/iw*(labels.length-1)),0,labels.length-1);
      draw();
    };
    cv.onmouseleave=()=>{ tipIdx=null; draw(); };
  }
}
function barChart(cv, labels, data, opts){
  opts=opts||{};
  if(!labels||!labels.length||!data.some(v=>v!=null)){ drawEmpty(cv, opts.empty||'Pas encore de données'); return; }
  const {ctx,w,h}=setupCanvas(cv);
  if(!ctx) return;
  const padL=52,padR=10,padT=14,padB=28;
  const iw=w-padL-padR, ih=h-padT-padB;
  ctx.clearRect(0,0,w,h);
  const max=Math.max(...data.filter(v=>v!=null))*1.1||1;
  const bw=Math.min(34, iw/data.length*.62);
  ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.fillStyle='#5f6c88'; ctx.font='10px sans-serif'; ctx.textAlign='right';
  for(let i=0;i<=4;i++){
    const val=max*i/4, yy=padT+ih-val/max*ih;
    ctx.beginPath(); ctx.moveTo(padL,yy); ctx.lineTo(w-padR,yy); ctx.stroke();
    ctx.fillText(Math.round(val)+'k', padL-6, yy+3);
  }
  ctx.textAlign='center';
  data.forEach((v,i)=>{
    if(v==null)return;
    const x=padL+iw*i/data.length;
    const bh=Math.max(2, v/max*ih);
    const g=ctx.createLinearGradient(0,padT+ih,0,padT+ih-bh);
    g.addColorStop(0, opts.color||'#ff6fae'); g.addColorStop(1, opts.color2||'#c084fc');
    ctx.fillStyle=g;
    /* roundRect avec repli sur rect : si l'API manque (vieux webview), la barre
       s'affiche quand même au lieu de faire planter tout l'onglet Progression. */
    ctx.beginPath();
    if(typeof ctx.roundRect==='function') ctx.roundRect(x-bw/2, padT+ih-bh, bw, bh, 4);
    else ctx.rect(x-bw/2, padT+ih-bh, bw, bh);
    ctx.fill();
    const lbl=String(labels[i]).slice(0,6);
    if(labels.length<=16) ctx.fillText(lbl, x, h-8);
  });
}
if(typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){ r=Math.min(r,w/2,h/2); this.moveTo(x+r,y); this.arcTo(x+w,y,x+w,y+h,r); this.arcTo(x+w,y+h,x,y+h,r); this.arcTo(x,y+h,x,y,r); this.arcTo(x,y,x+w,y,r); this.closePath(); };
}
function gaugeSVG(val, color, label){
  val=clamp(val,0,100);
  const r=58, c=2*Math.PI*r, off=c*(1-val/100);
  const col = color||(val>=75?'#2dd4a7':val>=50?'#ff6fae':'#ff5252');
  return '<svg data-audit-asset="74"><text x="70" y="66" text-anchor="middle" fill="#fff" font-size="30" font-weight="900" font-family="inherit">'+Math.round(val)+'</text><text x="70" y="86" text-anchor="middle" fill="#8b98b3" font-size="9" font-weight="700" letter-spacing="1">'+label+'</text></svg>';
}

/* ---------- Récupération ---------- */
function recupScore(entry){
  if(!entry) return null;
  const h=clamp(+entry.h||0,0,14);
  const sleep = h>=8.5?10: h>=7.5?8.6: h>=6.5?7:h>=5.5?5:h>=4?3:1;
  const q = +entry.qual||3, fa=+entry.fa||3, st=+entry.str||3, co=+entry.cour||3, mo=+entry.mot||3, en=+entry.en||3;
  const val = sleep*.25 + q*2*.15 + en*2*.20 + (6-fa)*2*.15 + (6-st)*2*.10 + (6-co)*2*.10 + mo*2*.05;
  return clamp(Math.round(val*10),0,100);
}
function recupStatus(score){
  if(score==null) return {txt:'—', cls:'chip-mut'};
  if(score>=80) return {txt:'Excellent — prêt à en découdre 💪', cls:'chip-green'};
  if(score>=65) return {txt:'Bon — progression normale', cls:'chip-blue'};
  if(score>=50) return {txt:'Moyen — surveillez la fatigue', cls:'chip-orange'};
  return {txt:'Faible — récupération prioritaire, volume réduit conseillé', cls:'chip-red'};
}
function moyenneRecup(jours){
  let s=0,n=0;
  Object.entries(state.recup).forEach(([d,e])=>{ const sc=recupScore(e); if(sc!=null){s+=sc;n++;} });
  return n? Math.round(s/n):null;
}

/* ---------- Journal / performances ---------- */
/* Mouvements suivis comme records personnels — les 5 qui pilotent le programme
   féminin. Le hip thrust est l'indicateur n°1 du galbe des fessiers. */
const MAIN_LIFTS = {
  hipthrust:{n:'Hip thrust', ic:'🍑', match:['hip thrust','thrust']},
  rdl:{n:'Soulevé de terre roumain', ic:'🍑', match:['roumain','romanian']},
  squat:{n:'Squat', ic:'🦵', match:['back squat','goblet squat','squat cycliste','squat'], not:['bulgare','bulgarian','split squat']},
  bulgarian:{n:'Bulgarian split squat', ic:'🦵', match:['bulgare','bulgarian','split squat']},
  row:{n:'Rowing / tirage', ic:'🦍', match:['rowing','tirage']}
};
function est1RM(charge,reps){ return charge && reps ? charge*(1+(+reps)/30) : null; }
function perfSerie(key){
  const match = MAIN_LIFTS[key].match;
  const not = MAIN_LIFTS[key].not||[];
  let best=null;
  Object.entries(state.journal).sort().forEach(([d,j])=>{
    (j.exos||[]).forEach(e=>{
      if(!e.ch||!e.reps) return;
      if(not.some(m=>norm(e.n).includes(m))) return;
      if(match.some(m=>norm(e.n).includes(m))){
        const v=est1RM(+e.ch,+e.reps);
        if(v && (!best || v>best.max)) best={max:v, date:d, nom:e.n};
      }
    });
  });
  return best;
}
function perfHistorique(key){
  const match=MAIN_LIFTS[key].match;
  const not=MAIN_LIFTS[key].not||[];
  const out=[];
  Object.entries(state.journal).sort().forEach(([d,j])=>{
    (j.exos||[]).forEach(e=>{
      if(!e.ch||!e.reps) return;
      if(not.some(m=>norm(e.n).includes(m))) return;
      if(match.some(m=>norm(e.n).includes(m))){
        const v=est1RM(+e.ch,+e.reps);
        if(v) out.push({date:d, v, nom:e.n, ch:+e.ch, reps:+e.reps});
      }
    });
  });
  const bestByDate={};
  out.forEach(o=>{ const k=o.date; if(!bestByDate[k]||o.v>bestByDate[k].v) bestByDate[k]=o; });
  return Object.entries(bestByDate).sort().map(([date,o])=>({date,v:o.v}));
}
function volumeHebdo(){
  const out={};
  Object.entries(state.journal).forEach(([d,j])=>{
    const pos=programPos(d); const wk=pos.weekGlobal+1;
    let v=0;
    (j.exos||[]).forEach(e=>{ if(e.ch&&e.reps&&e.se) v += +e.ch*(+e.reps)*(+e.se); });
    out[wk]=(out[wk]||0)+v;
  });
  return out;
}
function volumeMuscles(){
  const plan=weekPlan(todayKey());
  const out={};
  plan.forEach(p=>{
    if(p.type!=='seance'||!p.session) return;
    (p.session.exos||[]).forEach(e=>{
      const m=e[1];
      const sets = parseInt(String(e[2]));
      out[m]=(out[m]||0)+sets;
    });
  });
  return out;
}
function statutMuscle(sets, zone, prio){
  /* prio >= 4 = groupes volontairement en volume d'entretien (bras, épaules
     secondaires, mollets, adducteurs…) : un volume bas est le but, pas un défaut.
     Seuls les groupes prioritaires (fessiers, moyen fessier, ischios, tronc)
     peuvent légitimement être signalés « sous-entraînés ». */
  const p = prio==null? 2 : prio;
  if(sets<zone[0]) return p>=4
    ? {s:'⚪', cls:'chip-mut', txt:'volume d\'entretien (priorité secondaire)'}
    : {s:'🔴', cls:'chip-red', txt:'sous-entraîné'};
  if(sets>zone[1]) return {s:'🟠', cls:'chip-orange', txt:'à surveiller (surplus de volume)'};
  return {s:'🟢', cls:'chip-green', txt:'correctement stimulé'};
}

/* ---------- Échauffement & étirements (préparation de séance) ---------- */
function echauffementPour(session){
  const muscles = session.muscles || [];
  const hasGlutes = muscles.some(m=>['fes','moy'].includes(m));
  const hasLegs = muscles.some(m=>['qua','isc','mol','fes','moy','add'].includes(m));
  const hasPush = muscles.some(m=>['pec','epA','tri'].includes(m));
  const hasArms = muscles.some(m=>['bic','tri','avb'].includes(m));
  let activation, duree;
  if(hasGlutes){ activation = ACTIVATION_FESSIERS; duree='2-3 min'; }
  else if(hasLegs){ activation = ACTIVATION_JAMBES; duree='1-2 min'; }
  else if(hasPush){ activation = ACTIVATION_HAUT; duree='1-2 min'; }
  else if(hasArms){ activation = ACTIVATION_BRAS; duree='1-2 min'; }
  else { activation = ACTIVATION_HAUT; duree='1-2 min'; }
  return {
    etapes: ECHAUFFEMENT.etapes,
    activation: {ic:'⚡', nom: hasGlutes? 'Activation fessiers — indispensable' : 'Activation spécifique', temps:duree, quoi:activation}
  };
}
function etirementsPour(muscles){
  const vus = {};
  const out = [];
  (muscles||[]).forEach(m=>{
    const g = ETIREMENTS_PAR_MUSCLE[m];
    if(!g || vus[g.nom]) return;
    vus[g.nom] = 1;
    out.push({nom:g.nom, exos:g.exos});
  });
  return out;
}
function prepEtat(date){
  const j = state.journal[date];
  return j && j.prep ? j.prep : {};
}
function togglePrep(date, champ, fait){
  const j = state.journal[date] = Object.assign({exos:[]}, state.journal[date]||{});
  if(!j.prep) j.prep = {};
  j.prep[champ] = !!fait;
  save();
  // met à jour le chip dans le modal ouvert, sans refermer le clavier
  const modal = $('#modal-root .modal');
  if(modal){
    modal.querySelectorAll('.acc-item').forEach(item=>{
      const t = item.querySelector('.ph-t');
      if(!t) return;
      const isEch = /Échauffement/.test(t.textContent);
      const isEtir = /étirements APRÈS/.test(t.textContent);
      if((isEch && champ==='ech') || (isEtir && champ==='etir')){
        const chip = item.querySelector('.chip');
        if(chip){ chip.className='chip '+(fait?'chip-green':'chip-mut'); chip.textContent = fait?'✓ fait':'à faire'; }
      }
    });
  }
  renderCurrent();
}

function forceTestDone(){
  const f=state.force;
  return !!(f && f.date && Object.keys(f.valeurs||{}).length);
}
function nextReevalDate(){
  const f=state.force;
  if(!f||!f.date) return null;
  return dateKey(addDays(parseDate(f.date), (f.freqWeeks||FORCE_REVAL_WEEKS)*7));
}
function forceReevalDue(){
  const n=nextReevalDate();
  return n? todayKey()>=n : false;
}
function forceJoursRestants(){
  const n=nextReevalDate();
  return n? Math.max(0, Math.ceil((parseDate(n)-parseDate(todayKey()))/86400000)) : null;
}
/* % de charge dérivé de la fourchette de répétitions (formule inverse d'Epley) */
function pctPourReps(reps){
  const m=String(reps||'').match(/\d+/g);
  if(!m) return 0.75;
  let r=parseInt(m[0]);
  if(String(reps).indexOf('-')>=0){
    const a=parseInt(m[0]), b=parseInt(m[1]||m[0]);
    r=(a+b)/2;
  }
  r=clamp(r,1,20);
  return 30/(30+r);
}
function roundCharge(v){
  const step = v>=20? 2.5 : v>=10? 1.25 : 0.5;
  return Math.max(step, Math.round(v/step)*step);
}
/* Trouve la base 1RM correspondant à un exercice */
function matchBase(nom, muscle){
  const n=norm(nom);
  for(const [base,pat,ratio,perHand] of CHARGE_RULES){
    if(n.indexOf(pat)>=0) return {base, ratio, perHand:!!perHand};
  }
  const fb=CHARGE_FALLBACK[muscle];
  if(fb && state.force && state.force.valeurs && state.force.valeurs[fb[0]]){
    return {base:fb[0], ratio:fb[1], perHand:false};
  }
  return null;
}
/* ---------- 1RM automatique basé sur les charges ENREGISTRÉES ----------
   Le 1RM de référence d'un exercice devient automatiquement le meilleur
   estimé dérivé de VOS séances réelles (formule d'Epley), comparé au 1RM
   déclaré au test. Les charges suggérées suivent ensuite ce 1RM effectif,
   pour que les répétitions cibles (8, 10, 12…) restent réalisables. */
function exo1RMEstimeJournal(nom){
  const key=norm(nom);
  let best=null;
  Object.keys(state.journal).forEach(d=>{
    (state.journal[d].exos||[]).forEach(e=>{
      if(e.ch==null||e.ch===''||!e.reps) return;
      if(norm(e.n)===key){
        const est=est1RM(+e.ch,+e.reps);
        if(best==null||est>best) best=est;
      }
    });
  });
  return best;
}
/* 1RM d'un mouvement de base dérivé des séances enregistrées (exercices à ratio ≈1) */
function base1RMJournal(base){
  let best=null;
  Object.keys(state.journal).forEach(d=>{
    (state.journal[d].exos||[]).forEach(e=>{
      if(e.ch==null||e.ch===''||!e.reps) return;
      const m=matchBase(e.n);
      if(m && m.base===base && Math.abs(m.ratio-1)<0.01){
        const est=est1RM(+e.ch,+e.reps);
        if(best==null||est>best) best=est;
      }
    });
  });
  return best;
}
/* 1RM effectif = max(1RM déclaré au test, 1RM estimé de l'exercice exact, 1RM base dérivé du journal) */
function exo1RMEffectif(nom, muscle){
  const m=matchBase(nom,muscle);
  const base=m? m.base:null;
  const ratio=m? m.ratio:1;
  const perHand=m? !!m.perHand:false;
  const estExo=exo1RMEstimeJournal(nom);
  let decl=null;
  if(base && state.force && state.force.valeurs && state.force.valeurs[base]) decl=parseFloat(state.force.valeurs[base])*ratio;
  let baseEst=null;
  if(base){ const b=base1RMJournal(base); if(b!=null) baseEst=b*ratio; }
  // VOS SÉANCES PRIMENT SUR LE TEST DÉCLARÉ :
  // le 1RM déclaré peut être optimiste ; la réalité de vos séances est
  // la source fiable. Le déclaré ne sert que si aucun historique n'existe.
  let journalV=null;
  [estExo, baseEst].forEach(v=>{ if(v!=null&&(journalV==null||v>journalV)) journalV=v; });
  let eff = journalV!=null ? journalV : decl;
  return {eff, base, ratio, perHand, estExo, declBase: decl, baseEst, usedJournal: journalV!=null};
}
/* Dernière charge enregistrée pour un exercice exact (par date) */
function derniereEntreeExercice(nom){
  const key=norm(nom);
  let last=null;
  Object.keys(state.journal).sort().forEach(d=>{
    (state.journal[d].exos||[]).forEach(e=>{
      if(norm(e.n)===key && e.ch!==''&&e.ch!=null){ last={date:d, ch:+e.ch, reps:+(e.reps||0), rir:e.rir, rpe:e.rpe}; }
    });
  });
  return last;
}
/* Haut de la fourchette de répétitions cible (8-10 → 10 ; 10/8/6 → 10 ; 6,6,6,8,8 → 6) */
function hautDeFourchette(reps){
  const str=String(reps||'');
  const m=str.match(/(\d+)\s*-\s*(\d+)/);
  if(m) return parseInt(m[2]);
  const seq=(str.match(/\d+/g)||[]).map(Number);
  return seq.length? seq[0] : null;
}
/* Charge suggérée (kg) — basée sur vos séances + règle de double progression :
   jamais plus lourd tant que le haut de fourchette n'est pas atteint. */
function chargeSuggestion(nom, muscle, reps, pos){
  /* Exercices au poids du corps / chronométrés : aucune charge à suggérer */
  if(EXO_SANS_CHARGE.some(p=>norm(nom).indexOf(p)>=0)) return null;
  const r=exo1RMEffectif(nom,muscle);
  if(!r.eff) return null;
  let pct = pctPourReps(reps);
  if(pos && pos.deload) pct = Math.min(pct, 0.68);
  const cap = roundCharge(r.eff*pct); // plafond : 1RM effectif × %
  const last = derniereEntreeExercice(nom);
  let charge = null;
  if(last && last.ch>0){
    const top = hautDeFourchette(reps);
    if(top && last.reps>0){
      if(last.reps >= top) charge = roundCharge(last.ch*1.025);   // cible atteinte → +2,5 %
      else if(last.reps >= top*0.75) charge = roundCharge(last.ch); // proche → même charge
      else charge = roundCharge(last.ch*0.95);                      // loin → −5 %
    } else {
      charge = roundCharge(last.ch);
    }
    // Plafond 1RM : jamais au-delà du 1RM effectif × %, MAIS jamais non plus
    // en dessous de la dernière charge réussie (on ne recule jamais l'utilisateur).
    if(cap!=null){ const capMin=Math.max(cap, roundCharge(last.ch)); if(charge>capMin) charge=capMin; }
  } else {
    charge = cap;
  }
  return {
    charge,
    base: r.base, ratio: r.ratio, perHand: r.perHand,
    pct: Math.round(pct*100),
    exo1RM: r.eff!=null? round1(r.eff):null,
    auto1RM: !!r.usedJournal,
    decl1RM: r.declBase!=null? round1(r.declBase):null,
    fromLast: !!last, lastCharge: last? round1(last.ch):null, lastReps: last? last.reps:null
  };
}
/* ---------- Historique complet d'un exercice & proposition de séance suivante ----------
   §7 Suivi intelligent : on mémorise charge / reps / séries / date, on compare avec
   les séances précédentes et on propose la charge OU les reps de la séance suivante.
   Règle : on n'augmente JAMAIS la charge si la technique se dégrade (RPE ≥ 9,5 ou
   RIR 0 sur plusieurs séries) ou si les reps cibles n'ont pas été atteintes. */
function historiqueExercice(nom){
  const key=norm(nom); const out=[];
  Object.keys(state.journal).sort().forEach(d=>{
    (state.journal[d].exos||[]).forEach(e=>{
      if(norm(e.n)===key) out.push({date:d, ch:numOr(e.ch), reps:numOr(e.reps), se:numOr(e.se),
                                    rir:numOr(e.rir), rpe:numOr(e.rpe), com:e.com||''});
    });
  });
  return out;
}
/* Séries « propres » : technique non dégradée */
function seriePropre(e){ return !(e && e.rpe!=null && +e.rpe>=9.5) && !(e && e.rir!=null && +e.rir<=0); }

function prochaineSeance(nom, reps){
  const h=historiqueExercice(nom);
  if(!h.length) return {etat:'nouveau', msg:'Première séance sur cet exercice : notez votre charge, vos répétitions et votre RIR. Je calculerai la progression à partir de là.', sugg:null};
  const last=h[h.length-1];
  const prev=h.length>1? h[h.length-2] : null;
  const top=hautDeFourchette(reps)||last.reps||10;
  const propre = seriePropre(last);
  const sugg={ch:last.ch, reps:last.reps, se:last.se};
  let etat, msg;
  if(last.rpe!=null && +last.rpe>=10 || (last.rir!=null && +last.rir===0)){
    etat='echec';
    sugg.ch = roundCharge((last.ch||0)*0.95);
    msg='⚠️ Vous êtes allée à l\'échec sur la dernière séance (RPE 10 / RIR 0). La technique prime : je réduis la charge de 5 % pour retrouver de la marge. Visez RIR 1-2.';
  } else if(!propre){
    etat='technique';
    msg='🎯 Technique dégradée détectée (RPE ≥ 9,5). Je conserve la même charge : on ne monte pas tant que le mouvement n\'est pas propre. Travaillez le tempo et l\'amplitude.';
  } else if(last.reps>=top){
    etat='progression';
    sugg.ch = roundCharge((last.ch||0)*1.025);
    sugg.reps = Math.max(6, top-2);
    msg='✅ Objectif de répétitions atteint ('+last.reps+' reps). Progression raisonnable : +2,5 % soit ≈ '+fmtNum(sugg.ch)+' kg, en retombant à '+sugg.reps+' reps.';
  } else if(last.reps >= Math.round(top*0.75)){
    etat='reps';
    sugg.reps = Math.min(top, last.reps+1);
    msg='📈 Presque : '+last.reps+' reps sur '+top+' visées. Gardez '+fmtNum(last.ch)+' kg et cherchez '+(last.reps+1)+' reps à la prochaine séance.';
  } else {
    etat='stabiliser';
    const red = roundCharge((last.ch||0)*0.97);
    sugg.ch = red;
    msg = (last.ch && red < last.ch)
      ? '🔁 Répétitions loin de la cible ('+last.reps+' / '+top+'). Charge réduite à '+fmtNum(red)+' kg pour retrouver les reps visées, puis on remontera.'
      : '🔁 Répétitions loin de la cible ('+last.reps+' / '+top+'). On conserve '+fmtNum(last.ch||0)+' kg et on travaille d\'abord la qualité d\'exécution et l\'amplitude avant d\'aller chercher les reps.';
  }
  if(prev && prev.ch!=null && last.ch!=null && last.ch<prev.ch && etat!=='echec' && etat!=='stabiliser'){
    msg += ' Note : la charge a baissé par rapport à la séance précédente ('+fmtNum(prev.ch)+' → '+fmtNum(last.ch)+' kg) — surveillez le sommeil et les apports.';
  }
  return {etat, msg, sugg, hist:h};
}

/* Récapitulatif pour l'onglet Bilan 1RM : 1RM déclaré vs 1RM auto (journal) */
function auto1RMParMouvement(){
  const out={};
  TEST_1RM.exercices.forEach(ex=>{
    const decl= (state.force&&state.force.valeurs)? parseFloat(state.force.valeurs[ex.key]):null;
    const b=base1RMJournal(ex.key);
    out[ex.key]={decl: decl!=null? round1(decl):null, auto: b!=null? round1(b):null};
  });
  return out;
}
function forceDelta(key){
  const f=state.force;
  if(!f || !f.historique || !f.historique.length) return null;
  const prec=f.historique[0].valeurs ? f.historique[0].valeurs[key] : null;
  const act=f.valeurs ? f.valeurs[key] : null;
  return (prec!=null && act!=null)? round1(act-prec) : null;
}

/* ---------- Badges ---------- */
const BADGES = [
  {id:'premiere-seance', ic:'🚀', n:'Première séance', d:'Compléter votre 1re séance'},
  {id:'seances-10', ic:'💥', n:'10 séances', d:'Compléter 10 séances'},
  {id:'seances-50', ic:'🔥', n:'50 séances', d:'Compléter 50 séances'},
  {id:'seances-100', ic:'⚡', n:'100 séances', d:'Compléter 100 séances'},
  {id:'seances-200', ic:'👑', n:'200 séances', d:'Compléter 200 séances'},
  {id:'discipline-7', ic:'📅', n:'7 jours de suite', d:'Entraînement 7 jours consécutifs'},
  {id:'discipline-30', ic:'🗓️', n:'30 jours de suite', d:'Entraînement 30 jours consécutifs'},
  {id:'discipline-100', ic:'🏅', n:'100 jours de suite', d:'Entraînement 100 jours consécutifs'},
  {id:'pr-1', ic:'🎯', n:'1er record', d:'Battre un record personnel'},
  {id:'pr-5', ic:'🎖️', n:'5 records', d:'Battre 5 records personnels'},
  {id:'recup-7', ic:'😴', n:'Suivi récup', d:'7 check-ins de récupération'},
  {id:'recup-score-80', ic:'🌿', n:'Récupération d\'élite', d:'Score de récup ≥ 80'},
  {id:'mensuration-1', ic:'📏', n:'1er relevé', d:'Enregistrer un relevé mensuel'},
  {id:'mensuration-6', ic:'📐', n:'6 relevés', d:'Enregistrer 6 relevés mensuels'},
  {id:'photo-1', ic:'📸', n:'Bilan photo', d:'Ajouter une photo de bilan'},
  {id:'poids-objectif', ic:'⚖️', n:'Poids cible', d:'Atteindre votre poids objectif'},
  {id:'objectif-mensuel', ic:'🏆', n:'Objectif mensuel', d:'Valider un objectif mensuel'},
  {id:'bilan-1', ic:'📋', n:'1er bilan', d:'Générer un bilan mensuel'},
  {id:'bilan-6', ic:'📊', n:'Mi-parcours', d:'6 mois de programme'},
  {id:'transformation-12', ic:'🏆', n:'Transformation accomplie', d:'Finaliser les 12 mois'}
];
function checkBadges(){
  const has = s=>state.badges.includes(s);
  const jDates=Object.keys(state.journal);
  const seancesFaites = jDates.length;
  let streak=0,best=0;
  if(seancesFaites){
    const set = new Set(jDates);
    let d=new Date();
    for(let i=0;i<400;i++){
      const k=dateKey(d);
      if(set.has(k)){streak++;best=Math.max(best,streak);} else {best=Math.max(best,streak);streak=0;}
      d=addDays(d,-1);
    }
  }
  const prs = Object.keys(MAIN_LIFTS).filter(k=>perfSerie(k)).length;
  const recupCount = Object.keys(state.recup).length;
  const recupMoy = moyenneRecup();
  const mensCount = Object.keys(state.mensurations.mensuel||{}).length;
  const photoCount = Object.values(state.photos).filter(p=>p.face||p.profil||p.dos).length;
  const poidsOk = state.profil.objectifPoids && Object.values(state.poids).some(v=>state.objectifs.principal==='seche'? +v<=+state.profil.objectifPoids : +v>=+state.profil.objectifPoids);
  const objMensuelOk = Object.values(state.objectifsMensuels||{}).some(m=>m.fait);
  const bilanCount = Object.keys(state.bilanVu||{}).length;
  const moisEcoules = programPos(todayKey()).mois;
  const unlocked = [];
  const cond = {
    'premiere-seance': seancesFaites>=1, 'seances-10':seancesFaites>=10, 'seances-50':seancesFaites>=50,
    'seances-100':seancesFaites>=100, 'seances-200':seancesFaites>=200,
    'discipline-7':best>=7, 'discipline-30':best>=30, 'discipline-100':best>=100,
    'pr-1':prs>=1, 'pr-5':prs>=5,
    'recup-7':recupCount>=7, 'recup-score-80':recupMoy!=null&&recupMoy>=80,
    'mensuration-1':mensCount>=1, 'mensuration-6':mensCount>=6,
    'photo-1':photoCount>=1, 'poids-objectif':poidsOk,
    'objectif-mensuel':objMensuelOk, 'bilan-1':bilanCount>=1, 'bilan-6':moisEcoules>=6,
    'transformation-12':moisEcoules>=12 || moisEcoules==='F'
  };
  BADGES.forEach(b=>{ if(cond[b.id] && !has(b.id)){ unlocked.push(b); state.badges.push(b.id); state.badgesNouveaux.push(b.id); } });
  if(unlocked.length){ save(); setTimeout(()=>unlocked.forEach(b=>toast('🏆 Badge débloqué : '+b.n)), 400); }
  return unlocked.length;
}

/* ---------- Scores ---------- */
function scoreDiscipline(){
  const plan=weekPlan(todayKey());
  const pre=plan.filter(p=>p.type==='seance').length;
  const rea=plan.filter(p=>p.type==='seance' && state.seances[p.date] && state.seances[p.date]!=='non').length;
  return {pre, rea, pct: pre? Math.round(rea/pre*100):0};
}
function scoreAdherenceGlobal(){
  if(!state.profil.date) return null;
  let pre=0, rea=0;
  for(let i=0;i<nbJoursEcoules();i++){
    const d=dateKey(addDays(parseDate(state.profil.date),i));
    const plan=weekPlan(d);
    const s=plan.find(p=>p.date===d);
    if(s&&s.type==='seance'){ pre++; const st=state.seances[d]; if(st&&st!=='non') rea++; }
  }
  return pre? Math.round(rea/pre*100):null;
}
function scoreTransformation(){
  const comp=[];
  // 1. Entraînement (20)
  const adh = scoreAdherenceGlobal();
  comp.push({p:20, v: adh==null?0:adh});
  // 2. Nutrition (15) — adhérence au journal ou simple note par défaut
  const nj = Object.keys(state.nutri.journal||{}).length;
  const nutV = nj>=7?90: nj>=3?70: nj>=1?50: 30;
  comp.push({p:15, v:nutV});
  // 3. Sommeil (10)
  const recups = Object.values(state.recup);
  let hMoy=null; if(recups.length){ hMoy = recups.reduce((a,b)=>a+(+b.h||0),0)/recups.length; }
  comp.push({p:10, v: hMoy==null?0: clamp(Math.round((hMoy/8)*100),0,100)});
  // 4. Récupération (15)
  const rm=moyenneRecup(); comp.push({p:15, v:rm==null?0:rm});
  // 5. Progression musculaire (15)
  comp.push({p:15, v:scoreProgressionMesures()});
  // 6. Performance (15)
  comp.push({p:15, v:scorePerformance()});
  // 7. Régularité (10)
  const pctWeeks = nbSemainesEcoulees()>0 ? Math.round((nbSemainesEcoulees()/52)*100) : 0;
  comp.push({p:10, v: nbSemainesEcoulees()>0? Math.min(100, Math.round(adh==null?pctWeeks:(adh*0.6+pctWeeks*0.4))) : 0});
  const total = comp.reduce((a,c)=>a+c.p*c.v/100,0);
  return {total:Math.round(total), comp};
}
/* Score de progression corporelle — logique FÉMININE :
   on veut ↓ taille / ventre, ↑ fessiers / cuisses, ~ hanches.
   Une simple moyenne des deltas serait trompeuse (une taille qui baisse
   « annulerait » un fessier qui monte). */
const MENS_SENS = {
  taille:-1, ventre:-1, hanches:0, fessiers:+1, cuisseD:+1, cuisseG:+1,
  brasD:+1, brasG:+1, poitrine:0, epaules:0, cou:-1,
  avBrasD:0, avBrasG:0, molletD:+1, molletG:+1
};
function deltasMensurations(){
  const j0=state.mensurations.jour0||{};
  const dernier=dernierMensuration();
  if(!dernier) return null;
  const out={};
  MENS_FIELDS.forEach(([k,lbl])=>{
    const a=parseFloat(j0[k]), b=parseFloat(dernier[k]);
    if(a&&b) out[k]={lbl, a, b, d:round1(b-a)};
  });
  return Object.keys(out).length? out : null;
}
function scoreProgressionMesures(){
  const d=deltasMensurations();
  if(!d) return 20;
  /* Chaque indicateur compte selon son sens souhaité, avec un barème réaliste :
     taille −4 cm = excellent, fessiers +4 cm = excellent. */
  const bareme = {taille:4, ventre:4, fessiers:4, cuisseD:2, cuisseG:2, hanches:1.5,
                  brasD:1.5, brasG:1.5, poitrine:1, epaules:1, cou:1.5,
                  avBrasD:1, avBrasG:1, molletD:1, molletG:1};
  let score=0, n=0;
  Object.keys(d).forEach(k=>{
    const sens=MENS_SENS[k]||0; if(!sens) return;
    const ref=bareme[k]||2;
    const v = clamp(50 + (d[k].d*sens)/ref*50, 0, 100);
    score+=v; n++;
  });
  return n? Math.round(score/n) : 20;
}
function scorePerformance(){
  let gains=[];
  Object.keys(MAIN_LIFTS).forEach(k=>{
    const h=perfHistorique(k);
    if(h.length>=2){
      const init=h[0].v, last=h[h.length-1].v;
      if(init>0) gains.push((last-init)/init*100);
    }
  });
  if(!gains.length) return 20;
  const moy = gains.reduce((a,b)=>a+b,0)/gains.length;
  return clamp(Math.round(20 + moy*3), 0, 100);
}
function progressionObjectifAnnuel(){
  const p=state.profil;
  if(!p.poidsDepart||!p.objectifPoids) return {pct:0, label:'Définissez votre poids objectif dans le profil.'};
  const actuel = poidsActuel()||parseFloat(p.poidsDepart);
  const dep=+p.poidsDepart, obj=+p.objectifPoids, act=+actuel;
  const total=Math.abs(obj-dep), fait=Math.abs(act-dep);
  const pct= total>0? clamp(Math.round(fait/total*100),0,100):100;
  return {pct, label: dep<obj? (act+' kg / '+obj+' kg'):(act+' kg / '+obj+' kg'), dep, obj, act};
}
function poidsActuel(){
  const entries=Object.entries(state.poids).sort();
  return entries.length? parseFloat(entries[entries.length-1][1]) : (state.profil.poidsDepart? parseFloat(state.profil.poidsDepart):null);
}
function dernierMensuration(){
  const m=state.mensurations.mensuel||{};
  const keys=Object.keys(m).sort();
  return keys.length? m[keys[keys.length-1]]:null;
}

/* ---------- Photos ---------- */
/* Prépare une URL d'image : ajoute le préfixe data URI si absent */
function photoSrc(url){
  if(!url) return '';
  if(String(url).indexOf('data:')===0) return url;
  return 'data:image/jpeg;base64,'+url;
}
function compressImage(file, cb){
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      const MAX=760; // dimension max réduite pour tenir dans le quota localStorage
      let w=img.width,h=img.height;
      if(w>MAX||h>MAX){ const r=Math.min(MAX/w,MAX/h); w=Math.round(w*r); h=Math.round(h*r); }
      const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
      cv.getContext('2d').drawImage(img,0,0,w,h);
      cb(cv.toDataURL('image/jpeg',0.62));
    };
    img.onerror=()=>toast('⚠️ Impossible de lire cette image');
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

/* ---------- Export / import / print ---------- */
function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='emilie_transformation_sauvegarde.json'; a.click();
  URL.revokeObjectURL(a.href);
  toast('📦 Données exportées');
}
function importData(file){
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const d=JSON.parse(e.target.result);
      if(!d || typeof d!=='object' || Array.isArray(d)) throw new Error('format');
      // On écrit la sauvegarde telle quelle : load() (au rechargement) fait la
      // fusion profonde avec les valeurs par défaut de cette version.
      try{ localStorage.setItem(LS_KEY, JSON.stringify(d)); }catch(err){ throw err; }
      toast('📥 Sauvegarde importée — rechargement…');
      location.reload();
    }catch(err){ toast('❌ Fichier invalide — choisissez un JSON de sauvegarde de cette appli'); }
  };
  reader.readAsText(file);
}
function showNoDataBanner(){ const b=$('#no-data-banner'); if(b) b.style.display='block'; }
function openSettings(){
  openModal(
    '<h3>⚙️ Données & sauvegarde</h3>'+
    '<div class="field"><label>Exporter mes données</label><button class="btn btn-grad btn-block" onclick="exportData()">📦 Télécharger le fichier de sauvegarde</button></div>'+
    '<div class="field mt"><label>Importer des données</label><input type="file" class="inp" accept=".json" onchange="importData(this.files[0])"></div>'+
    '<div class="field mt"><label>Sauvegarde DANS le fichier</label><p class="small mut" style="margin:0 0 8px">Crée un fichier HTML qui <b>contient vos données à l\'intérieur</b> : parfait pour changer de téléphone, de navigateur ou de fichier sans rien perdre.</p><button class="btn btn-line btn-block" onclick="exportFileWithState()">💾 Télécharger l\'appli AVEC mes données</button></div>'+
    '<div class="danger-box mt">Réinitialiser supprime définitivement toutes les données enregistrées dans ce navigateur (profil, journal, photos, mesures). Exportez d\'abord une sauvegarde si nécessaire.</div>'+
    '<button class="btn btn-red btn-block mt" onclick="if(confirm(\'Toutes vos données seront définitivement supprimées. Continuer ?\')){resetAll()}">🗑️ Réinitialiser complètement</button>'
  );
}
function printReport(){
  window.print();
}
/* Génère une copie de l'application avec l'état actuel INTÉGRÉ dans le HTML
   (window.__EMILIE_PRELOAD__). Résout la perte de données quand on ouvre un
   nouveau fichier (nouveau téléchargement = nouveau stockage navigateur). */
function exportFileWithState(){
  let payload;
  try{ payload = JSON.stringify(state); }catch(e){ toast('❌ Impossible de sérialiser l\'état'); return; }
  // éviter toute séquence de fermeture de balise script dans le JSON embarqué
  payload = payload.replace(/<\/(script)/gi, '<\\/$1');
  const inject = '\n<script>window.__EMILIE_PRELOAD__=' + payload + ';<\/script>\n';
  const finish = (html, mode) => {
    let out = html || '';
    // injection juste après le vrai <head> (au début du document) —
    // une simple recherche de </head> serait piège : cette source n'a pas
    // de </head> réel et la trouve dans une chaîne JS
    const hi = out.indexOf('<head>');
    if(hi > -1 && hi < 1000){ out = out.slice(0, hi+6) + inject + out.slice(hi+6); }
    else { out = inject + out; }
    try{
      const blob = new Blob([out], {type:'text/html;charset=utf-8'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Emilie_transformation_AVEC_MES_DONNEES.html';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
      toast('✅ Fichier téléchargé : ouvrez-le, vos données sont dedans');
    }catch(e){ toast('❌ Échec du téléchargement'); }
  };
  const fromDom = () => {
    // snapshot du DOM propre : on vide les modales/bandeaux le temps de la copie
    const root=$('#modal-root'); const savedRoot = root ? root.innerHTML : '';
    const sb=$('#storage-banner'), nb=$('#no-data-banner');
    const sbD = sb ? sb.style.display : '', nbD = nb ? nb.style.display : '';
    if(root) root.innerHTML='';
    if(sb) sb.style.display='none';
    if(nb) nb.style.display='none';
    try{ finish('<!DOCTYPE html>\n' + document.documentElement.outerHTML, 'dom'); }
    finally{
      if(root) root.innerHTML=savedRoot;
      if(sb) sb.style.display=sbD;
      if(nb) nb.style.display=nbD;
    }
  };
  toast('⏳ Génération du fichier avec vos données…');
  let handled=false;
  try{
    fetch(location.href).then(r=>{ if(!r.ok) throw new Error('http '+r.status); return r.text(); })
      .then(t=>{ handled=true; finish(t,'src'); })
      .catch(()=>{ if(!handled) fromDom(); });
  }catch(e){ if(!handled) fromDom(); }
}


/* ============================================================
   VUES — rendu de l'interface, interactions, rapports
   ============================================================ */
'use strict';

let curSession = null;   // {date, key}
let curMensMois = null;  // mois du relevé en cours
let curBilan = null;     // mois du bilan affiché

function renderCurrent(){ const act=$$('.view.active')[0]; if(act) renderView(act.id); }

/* ================== RECOMMANDATIONS ================== */
function buildRecommendations(){
  const rec=[];
  const p=state.profil;
  if(!p.date){ rec.push({ic:'👤',tag:'Profil',cls:'warn',txt:'Complétez votre bilan de départ (profil) pour activer tous les calculs personnalisés du programme.'}); return rec; }
  const pos=programPos(todayKey());
  const wk=pos.weekGlobal;

  /* ---------- 1. DÉTECTION D'ÉTAT GLOBAL (coach intelligent) ---------- */
  const etat=detecterEtat(wk);
  rec.push({ic:etat.ic, tag:'Coach', cls:etat.cls, txt:etat.txt});

  /* ---------- 2. FESSIERS — priorité absolue ---------- */
  const sf=signauxFessiers(wk);
  if(sf){
    const cible = pos.phase.type==='developpement' ? 18 : pos.phase.type==='adaptation' ? 10 : 14;
    if(sf.setsTotal>0 && sf.setsTotal<cible)
      rec.push({ic:'🍑',tag:'Coach fessiers',cls:'warn',txt:'Volume fessier de '+sf.setsTotal+' séries cette semaine (cible : '+cible+'). La fréquence et le volume sont les deux premiers leviers du galbe : ajoutez des séries d\'abduction et de kickback, qui stimulent fortement sans générer beaucoup de fatigue.'});
    if(sf.setsMoy>0 && sf.setsMoy<6)
      rec.push({ic:'🍑',tag:'Coach fessiers',cls:'info',txt:'Le moyen fessier est peu travaillé ('+sf.setsMoy+' séries). C\'est lui qui arrondit la hanche sur le côté et corrige l\'aspect « carré ». Visez 6 à 10 séries par semaine d\'abduction et de clamshell.'});
    if(sf.evoHip!=null && sf.evoHip<0)
      rec.push({ic:'📉',tag:'Coach fessiers',cls:'warn',txt:'Votre hip thrust recule ('+sf.evoHip+' %). Causes les plus fréquentes : récupération insuffisante, apport calorique trop bas, ou séances fessiers trop rapprochées. Vérifiez ces trois points avant de changer le programme.'});
    if(sf.rpeMoy!=null && sf.rpeMoy>=9.3)
      rec.push({ic:'🎯',tag:'Coach fessiers',cls:'warn',txt:'Les séries fessiers sont trop proches de l\'échec (RPE moyen '+sf.rpeMoy+'). Pour les fessiers, la qualité de contraction compte plus que l\'échec : visez RIR 2 et une pause de 1 à 2 s en haut de chaque hip thrust.'});
  }

  /* ---------- 3. VENTRE / SANGLE ABDOMINALE ---------- */
  const d=deltasMensurations();
  if(d && d.taille && d.ventre){
    const dv=Math.min(d.taille.d, d.ventre.d);
    if(dv<=-1) rec.push({ic:'🔥',tag:'Analyste',cls:'success',txt:'Tour de taille '+d.taille.d+' cm, tour de ventre '+d.ventre.d+' cm depuis le Jour 0 : la sangle abdominale se resserre et la masse grasse diminue. Continuez le gainage 3 à 4 fois par semaine.'});
    else if(dv>1.5) rec.push({ic:'🔥',tag:'Analyste',cls:'warn',txt:'Le tour de taille augmente (+'+d.taille.d+' cm) : c\'est le signal le plus fiable d\'une prise de masse grasse, plus que la balance. Réduisez d\'environ 100-150 kcal, surtout les glucides du soir, pendant 2 semaines.'});
  }

  /* ---------- 4. POIDS & COMPOSITION (le poids n'est pas le juge) ---------- */
  const poids=Object.entries(state.poids).sort();
  if(poids.length>=3){
    const dep=+poids[0][1], act=+poids[poids.length-1][1];
    const sem=Math.max(0.1,(parseDate(poids[poids.length-1][0])-parseDate(poids[0][0]))/86400000/7);
    const taux=(act-dep)/sem;
    if(taux<-0.60)
      rec.push({ic:'🛑',tag:'Référent santé',cls:'danger',txt:'Perte de poids trop rapide ('+round1(taux)+' kg/sem.). Au-delà de 0,5 kg/semaine, vous perdez du muscle, du galbe et de l\'énergie — et les règles peuvent se perturber. Remontez de 150-200 kcal et privilégiez les protéines (1,9 g/kg).'});
    else if(taux>0.30 && (state.nutri.phase==='deficit'||state.nutri.phase==='recomp'))
      rec.push({ic:'🥗',tag:'Nutritionniste',cls:'warn',txt:'Le poids monte de '+round1(taux)+' kg/sem. alors que la stratégie vise la stabilité ou la baisse. Réduisez d\'environ 100-150 kcal pendant 2 semaines — mais vérifiez d\'abord vos mensurations : si le tour de fessiers monte et la taille baisse, cette prise de poids est une BONNE nouvelle.'});
    else if(taux>0.15 && state.nutri.phase!=='surplus')
      rec.push({ic:'⚖️',tag:'Nutritionniste',cls:'info',txt:'Prise de '+round1(taux)+' kg/sem. Vérifiez la composition : si le tour de taille est stable ou en baisse et que vos charges progressent, c\'est du muscle. Sinon, réduisez légèrement les apports.'});
  }

  /* ---------- 5. PERFORMANCE ---------- */
  let prGain=0, prN=0;
  Object.keys(MAIN_LIFTS).forEach(k=>{
    const h=perfHistorique(k);
    if(h.length>=2){ const g=(h[h.length-1].v-h[0].v)/h[0].v*100; prGain+=g; prN++; }
  });
  const moy = prN? prGain/prN : 0;
  if(prN>=2 && moy>=8)
    rec.push({ic:'💪',tag:'Coach',cls:'success',txt:'Vos charges progressent en moyenne de +'+round1(moy)+' % : le muscle se construit. Continuez la double progression (+2,5 % quand le haut de fourchette est atteint avec RIR ≤ 2).'});

  /* ---------- 6. RÉCUPÉRATION & SOMMEIL ---------- */
  const rm=moyenneRecup();
  if(rm!=null && rm<60)
    rec.push({ic:'😴',tag:'Préparateur mental',cls:'danger',txt:'Récupération moyenne de '+rm+'/100. Passez en deload anticipé : volume -30 %, cardio remplacé par 25 min de piscine, et priorité absolue au sommeil (7 h 30-9 h). À 41 ans, la récupération conditionne directement le galbe et la sangle abdominale.'});
  const recups=Object.values(state.recup);
  if(recups.length){
    const hm=recups.reduce((a,b)=>a+(+b.h||0),0)/recups.length;
    if(hm<7) rec.push({ic:'🌙',tag:'Préparateur mental',cls:'warn',txt:'Sommeil moyen de '+round1(hm)+' h. Sous 7 h, la sensibilité à l\'insuline baisse, l\'appétit augmente et la construction musculaire ralentit. Cible : 7 h 30-9 h, coucher à heure fixe, pas d\'écran 1 h avant.'});
  }

  /* ---------- 7. ADHÉRENCE ---------- */
  const adh=scoreAdherenceGlobal();
  if(adh!=null && adh<60)
    rec.push({ic:'🧠',tag:'Préparateur mental',cls:'warn',txt:'Adhérence de '+adh+' % aux séances. Réduisez à 3 séances solides plutôt que d\'en programmer 4 et d\'en sauter une : la régularité sur 12 mois fait toute la différence.'});
  else if(adh!=null && adh>=85)
    rec.push({ic:'🔥',tag:'Préparateur mental',cls:'success',txt:'Adhérence de '+adh+' % : une régularité exemplaire. C\'est exactement ce qui produira la transformation visée.'});

  /* ---------- 8. CARDIO ---------- */
  const cardio=cardioSemaineInfos(wk);
  if(cardio.faites===0 && cardio.prevues>0 && !pos.deload)
    rec.push({ic:'🚴',tag:'Coach',cls:'info',txt:'Aucun cardio enregistré cette semaine sur '+cardio.prevues+' prévu(s). 15-25 min d\'elliptique modéré suffisent à augmenter la dépense sans gêner les fessiers. Option piscine si les jambes sont fatiguées.'});
  if(cardio.faites>0 && cardio.dureeMoy>40)
    rec.push({ic:'🚴',tag:'Coach',cls:'warn',txt:'Cardio moyen de '+Math.round(cardio.dureeMoy)+' min par séance : au-delà de 35-40 min, la récupération des fessiers en pâtit. Préférez la qualité (fractionné court) à la durée.'});

  /* ---------- 9. SUIVI & BILANS ---------- */
  if(p.date && !forceTestDone())
    rec.push({ic:'🔢',tag:'Coach',cls:'info',txt:'Réalisez votre bilan 1RM (5-8 min, onglet « Bilan 1RM ») : les charges de chaque exercice seront pré-remplies automatiquement selon votre force réelle.'});
  if(forceReevalDue())
    rec.push({ic:'🔁',tag:'Coach',cls:'warn',txt:'Votre bilan 1RM date de plus de 8 semaines : refaites le test, toutes vos charges suggérées seront recalculées automatiquement.'});
  const pr=photoRappelEtat();
  if(pr && pr.due)
    rec.push({ic:'📸',tag:'Analyste',cls:'info',txt:'Bilan photo des 4 semaines : '+pr.joursRestants+' jour(s) de retard. Prenez face, profil et dos dans les mêmes conditions (même lumière, même heure, même pose) — c\'est le seul moyen de voir un changement que la balance ne montre pas.'});

  if(pos.deload)
    rec.push({ic:'🛌',tag:'Coach',cls:'info',txt:'Semaine de deload : volume réduit, charges à ~65 %, cardio léger ou piscine. C\'est pendant cette semaine que le corps « encaisse » le travail des trois précédentes.'});
  if(pos.idx==='F')
    rec.push({ic:'🏆',tag:'Coach',cls:'success',txt:'Vous êtes en phase finale : testez vos records, reprenez vos mensurations et vos photos, puis passez au programme de maintien pour conserver la silhouette obtenue.'});

  rec.push({ic:'🩺',tag:'Référent santé',cls:'info',txt:'Rappel : en cas de douleur articulaire persistante, de blessure, de fatigue inhabituelle, de troubles du cycle ou de signe médical, stoppez et consultez un professionnel de santé. Ces recommandations sont indicatives et ne remplacent pas un avis médical.'});
  return rec.slice(0,8);
}

/* ---------- Détection d'état global : progression / stagnation / fatigue /
   fessiers / perte trop rapide / objectif atteint → ajustement proposé ---------- */
function detecterEtat(wk){
  const sg=signauxEntrainement(wk);
  const sf=signauxFessiers(wk);
  const rm=moyenneRecup();
  const pos=programPos(todayKey());
  const poids=Object.entries(state.poids).sort();
  let taux=null;
  if(poids.length>=3){
    const dep=+poids[0][1], act=+poids[poids.length-1][1];
    const sem=Math.max(0.1,(parseDate(poids[poids.length-1][0])-parseDate(poids[0][0]))/86400000/7);
    taux=(act-dep)/sem;
  }
  const obj=progressionObjectifAnnuel();

  /* Objectif atteint → passage en maintien */
  if(obj.pct>=100 && poids.length>=3 && Math.abs(taux)<=0.15){
    return {etat:'objectif', ic:'🏆', cls:'success', txt:'🎯 Objectif de poids atteint et charges stables : le programme bascule progressivement en MAINTIEN. On garde les mêmes séances fessiers, on réduit le volume de 20 % et on stabilise les calories à la dépense. Le but est maintenant de conserver, pas de continuer à pousser.'};
  }
  /* Fatigue élevée */
  if((rm!=null && rm<55) || (sg && sg.rpeMoy!=null && sg.rpeMoy>=9.2)){
    return {etat:'fatigue', ic:'🛌', cls:'danger', txt:'⚠️ État de FATIGUE détecté'+(rm!=null?' (récupération '+rm+'/100)':' (RPE moyen '+sg.rpeMoy+'/10)')+'. Ajustement : cette semaine, volume -30 %, charges à ~80 %, cardio remplacé par 25 min de piscine ou une marche. Si l\'état dure 2 semaines, avancez la semaine de deload. Le galbe se construit au repos, pas à l\'épuisement.'};
  }
  /* Perte de poids trop rapide */
  if(taux!=null && taux<-0.60){
    return {etat:'perte-rapide', ic:'🛑', cls:'danger', txt:'🛑 PERTE DE POIDS TROP RAPIDE ('+round1(taux)+' kg/sem.). Risque : perte de masse musculaire, de galbe fessier, baisse d\'énergie et perturbation du cycle. Ajustement : +150 à 200 kcal/jour, protéines à 1,9-2,0 g/kg, et on ne descend jamais sous −13 % de la dépense.'};
  }
  /* Stagnation */
  if(sf && sf.tonnagePrev>0 && Math.abs(sf.tonnage-sf.tonnagePrev)/sf.tonnagePrev<0.03 && sg && sg.faites>=3){
    return {etat:'stagnation', ic:'📉', cls:'warn', txt:'📊 STAGNATION détectée : le volume fessier n\'évolue plus. Analyse dans l\'ordre — (1) technique : la contraction est-elle réellement ressentie ? (2) amplitude : les tibias sont-ils verticaux en haut du hip thrust ? (3) récupération : sommeil ≥ 7 h 30 ? (4) nutrition : assez de calories et de protéines ? (5) charge : seulement ensuite, +2,5 %.'};
  }
  /* Progression insuffisante des fessiers */
  if(sf && sf.evoHip!=null && sf.evoHip<=0 && sf.nSeancesFes>=2){
    return {etat:'fessiers', ic:'🍑', cls:'warn', txt:'🍑 PROGRESSION FESSIÈRE INSUFFISANTE : vous travaillez régulièrement mais le hip thrust ne monte pas. Ajustement : passez de 2 à 3 stimulations fessiers par semaine (ajoutez J5), montez l\'abduction de hanche à 8-10 séries hebdomadaires, et vérifiez que les calories ne sont pas trop basses.'};
  }
  /* Progression normale */
  if(sg && sg.faites>=2 && (sg.rpeMoy==null || sg.rpeMoy<=8.5)){
    return {etat:'progression', ic:'📈', cls:'success', txt:'✅ Progression conforme : '+(sg.faites)+'/'+sg.prevues+' séances validées cette semaine'+(sg.rpeMoy!=null?', intensité bien dosée (RPE '+sg.rpeMoy+')':'')+'. Ajustement : continuez la double progression — +1 à 2 répétitions à charge égale, puis +2,5 % de charge quand le haut de fourchette est atteint avec RIR ≤ 2.'};
  }
  return {etat:'neutre', ic:'👍', cls:'info', txt:'Pas encore assez de données pour analyser votre tendance. Renseignez vos séances (charges, répétitions, RIR, RPE), votre poids 3 fois par semaine et vos mensurations une fois par mois : le coaching s\'affinera automatiquement.'};
}

/* Suivi cardio de la semaine */
function cardioSemaineInfos(wk){
  if(!state.profil.date) return {prevues:0, faites:0, dureeMoy:0};
  const start=parseDate(state.profil.date);
  const wkStart=dateKey(addDays(start, wk*7));
  let prevues=0, faites=0, duree=0;
  for(let i=0;i<7;i++){
    const d=dateKey(addDays(start, wk*7+i));
    const p=weekPlan(d).find(x=>x.date===d);
    if(p&&p.type==='metcon') prevues++;
    const c=state.cardio[d];
    if(c && c.duree){ faites++; duree+=+c.duree; }
  }
  return {prevues, faites, dureeMoy: faites? duree/faites : 0};
}

/* ================== DASHBOARD ================== */
/* Bandeau bilan hebdomadaire de l'équipe (jour J = dimanche) */
function renderDashHebdo(){
  const el=$('#dash-hebdo'); if(!el) return;
  const etat=bilanHebdoEtat();
  if(!etat || !state.profil.date){ el.innerHTML=''; return; }
  const manquantes=donneesManquantesHebdo(etat.wk);
  const b=state.hebdo? state.hebdo[etat.wk]:null;
  let html='';
  if(b && b.conseils){
    // ✓ soumis
    html='<div class="card" style="border-color:rgba(45,212,167,.4)">'+
      '<div class="spread"><div><span class="chip chip-green">📋 Bilan hebdo transmis ('+fmtDateFr(b.date)+')</span>'+
      '<h3 class="mt" style="font-size:15px">Ajustements de l\'équipe pour la semaine prochaine</h3>'+
      '<div class="flex mt">'+b.conseils.slice(0,2).map(c=>'<span class="chip chip-mut">'+c.ic+' '+esc(c.tag)+'</span>').join('')+'</div></div>'+
      '<button class="btn btn-line btn-sm" onclick="openBilanHebdoModal()">📝 Consulter / modifier</button></div>'+
      (b.conseils.length? '<div class="mt small" style="color:var(--mut)">'+b.conseils.slice(0,2).map(c=>'• <b>'+esc(c.tag)+'</b> — '+esc(c.txt)).join('<br>')+'</div>':'')+
      '</div>';
  } else if(etat.due){
    // 🔔 JOUR J — notification
    html='<div class="card hebdo-due"><div class="spread">'+
      '<div><span class="chip chip-orange">🔔 Jour J — bilan hebdomadaire attendu</span>'+
      '<h3 class="mt" style="font-size:16px">L\'équipe a besoin de vos ressentis de la semaine</h3>'+
      '<p class="small mut mt">2-3 minutes suffisent. Vos réponses permettent au coach d\'adapter les séances de la semaine prochaine (volume, charges, exercices).</p>'+
      (manquantes.length? '<div class="mt small" style="color:var(--mut)"><b>📊 Données à transmettre pour le suivi :</b><ul style="padding-left:18px;margin-top:4px">'+manquantes.map(m=>'<li>'+m+'</li>').join('')+'</ul></div>':'')+
      '</div>'+
      '<button class="btn btn-grad" onclick="openBilanHebdoModal()">📋 Remplir le bilan</button></div></div>';
  } else if(etat.joursAvant<=1){
    // veille du jour J
    html='<div class="card" style="border-color:rgba(58,160,255,.35)"><div class="spread">'+
      '<div><span class="chip chip-blue">📋 Bilan hebdomadaire</span><b class="mt" style="display:block;font-size:14px">'+ (etat.joursAvant===1? 'Demain, c\'est le jour J !':'Aujourd\'hui, c\'est le jour J (dimanche).') +'</b>'+
      '<div class="small mut mt">Préparez vos ressentis, difficultés et la pesée de la semaine.</div></div>'+
      '<button class="btn btn-line btn-sm" onclick="openBilanHebdoModal()">Remplir maintenant</button></div></div>';
  } else {
    // compte à rebours
    const manqShort=manquantes.slice(0,2);
    html='<div class="card" style="padding:12px 16px"><div class="spread">'+
      '<div class="small mut">📋 <b>Bilan hebdomadaire de l\'équipe</b> : le jour J est '+(etat.joursAvant===0?'aujourd\'hui':('dans '+etat.joursAvant+' jour'+(etat.joursAvant>1?'s':'')))+' (dimanche).'+
      (manqShort.length? ' <span class="warn">Rappel suivi :</span> '+manqShort.map(m=>m.replace(/^[^ ]+ /,'')).join(' · '):'')+'</div>'+
      '<button class="btn btn-line btn-sm" onclick="openBilanHebdoModal()">Pré-remplir</button></div></div>';
  }
  el.innerHTML=html;
}
/* Carte Repas du jour dans le dashboard */
function renderDashRepas(){
  const el=$('#dash-repas'); if(!el) return;
  const p=state.profil;
  if(!p.date){ el.innerHTML=''; return; }
  const pos=programPos(todayKey());
  const mois=(pos.idx==='F'?13:+pos.idx)||1;
  const jourIdx=parseInt(todayKey().slice(-2),10)||1;
  const gp=genererPlanJour(mois, jourIdx);
  if(!gp){ el.innerHTML=''; return; }
  const principaux=gp.plan.filter(m=>/Déjeuner|Petit-déjeuner|Dîner/.test(m.nom));
  el.innerHTML='<div class="card"><div class="spread">'+
    '<div><span class="chip chip-green">🥗 Repas du jour</span><h3 class="mt" style="font-size:15px">'+gp.cible.cal+' kcal · '+gp.cible.p+' g de protéines</h3></div>'+
    '<button class="btn btn-line btn-sm" onclick="go(\'v-repas\')">Voir ma journée →</button></div>'+
    '<div class="grid g3 mt">'+principaux.map(m=>'<div class="tile" style="padding:10px 12px"><div class="t-lbl">'+esc(m.nom)+'</div><div class="t-val" style="font-size:17px">'+m.total.cal+'</div><div class="t-delta mut" style="font-size:11px">'+m.total.p+' g P</div></div>').join('')+
    '</div></div>';
}

function renderDashboard(){
  const p=state.profil;
  const nom = p.nom? p.nom.split(' ')[0] : 'Athlète';
  const pos=programPos(todayKey());
  const jours=nbJoursEcoules();
  const phase=pos.phase;
  $('#dash-date').textContent = fmtDateFr(todayKey());
  renderDashHebdo();
  renderDashRepas();
  $('#dash-hero').innerHTML =
    '<div class="hero"><div class="h-in">'+
    '<span class="tagline">🌸 Émilie Transformation — coach féminin · 12 mois / 52 semaines · priorité 🍑 fessiers</span>'+
    '<h1>Bienvenue, '+esc(nom)+'</h1>'+
    '<p>'+ (p.date? 'Jour '+(jours+1)+' de votre transformation · '+phase.titre+' · Semaine '+(pos.weekGlobal+1)+'/52' : 'Votre transformation commence ici. Complétez votre bilan de départ pour activer le coaching personnalisé.') +'</p>'+
    '<div class="h-stats">'+
      '<div class="hstat"><b class="gold">'+(pos.weekGlobal+1)+'/52</b><span>Semaine</span></div>'+
      '<div class="hstat"><b class="gold">'+(jours+1)+'/365</b><span>Jour</span></div>'+
      '<div class="hstat"><b>'+(p.seancesSemaine||4)+'</b><span>Séances/sem.</span></div>'+
    '</div></div></div>';
  // Tuiles
  const pa=poidsActuel();
  const pd=p.poidsDepart? +p.poidsDepart : null;
  const dPoids = (pa!=null&&pd!=null)? round1(pa-pd) : null;
  const obj=progressionObjectifAnnuel();
  const prN=Object.keys(MAIN_LIFTS).filter(k=>perfSerie(k)).length;
  const vol=Object.values(volumeHebdo()).reduce((a,b)=>a+b,0);
  const rm=moyenneRecup();
  const recups=Object.values(state.recup);
  const hm=recups.length? round1(recups.reduce((a,b)=>a+(+b.h||0),0)/recups.length) : null;
  const mm=p.mm? p.mm : (prN? '—':'—');
  const j0=state.mensurations.jour0||{}, dm=dernierMensuration();
  const delt=(k)=>{ const a=j0[k],b=dm&&dm[k]; return (a&&b)? round1(b-a):null; };
  $('#dash-tiles').innerHTML = [
    tile('⚖️','Poids actuel', pa!=null? pa.toFixed(1)+' kg':'—', dPoids!=null? ((dPoids>0?'+':'')+dPoids+' kg vs J0'):'', dPoids!=null? (obj.dep<obj.obj? (dPoids>0?'up':'down'):(dPoids>0?'down':'up')):''),
    tile('🍑','Hip thrust', perfActuelle('hipthrust')? fmtKg(perfActuelle('hipthrust').v):'—', perfActuelle('hipthrust')&&perfActuelle('hipthrust').gain!=null? ((perfActuelle('hipthrust').gain>0?'+':'')+perfActuelle('hipthrust').gain+' % depuis le départ'):'indicateur n°1 du galbe', 'up'),
    tile('🔥','Tour de taille', delt('taille')!=null? ((delt('taille')>0?'+':'')+delt('taille')+' cm'):'—', delt('ventre')!=null? ('ventre '+(delt('ventre')>0?'+':'')+delt('ventre')+' cm'):(dm?'—':'relevé J0 requis'), delt('taille')!=null? (delt('taille')<=0?'up':'down'):''),
    tile('🍑','Tour de fessiers', delt('fessiers')!=null? ((delt('fessiers')>0?'+':'')+delt('fessiers')+' cm'):'—', 'objectif : galbe + fermeté', delt('fessiers')!=null&&delt('fessiers')>0?'up':''),
    tile('🏋️','Volume total', vol>0? (Math.round(vol/1000)+' t'):'—', prN? prN+' records suivis' : 'Renseignez vos charges', 'up'),
    tile('😴','Récupération', rm!=null? rm+'/100':'—', hm!=null? hm+' h sommeil moy.':'—', rm!=null? (rm>=65?'up':rm>=50?'warn':'down'):''),
    tile('🎯','Objectif annuel', obj.pct+' %', obj.label, 'gold')
  ].join('');
  // Aujourd'hui
  const today=weekPlan(todayKey()).find(p2=>p2.date===todayKey())||{type:null,label:'—'};
  const statut = state.seances[todayKey()];
  const stChip = statut==='ok'?'<span class="chip chip-green">✅ Terminée</span>':statut==='partiel'?'<span class="chip chip-orange">🟡 Partielle</span>':statut==='non'?'<span class="chip chip-red">❌ Non effectuée</span>':'<span class="chip chip-mut">à faire</span>';
  let todayHtml='<div class="card">';
  if(today.type==='seance'){
    todayHtml+='<div class="spread"><div><span class="chip chip-gold">Séance du jour</span><h3 class="mt" style="font-size:17px">'+esc(today.label)+'</h3></div>'+stChip+'</div>'+
      '<div class="flex mt"><button class="btn btn-grad" onclick="openSession(\''+todayKey()+'\')">🏋️ Ouvrir la séance</button>'+
      '<button class="btn btn-line" onclick="go(\'v-calendrier\')">📅 Calendrier</button></div>';
  } else if(today.type==='metcon' && today.cardio){
    const cd=today.cardio, rec=state.cardio[todayKey()];
    const isPool = cd.format==='piscine';
    todayHtml+='<div class="spread"><div><span class="chip '+(isPool?'chip-gold':'chip-blue')+'">'+(isPool?'🏊 Piscine du jour':'🚴 Cardio du jour')+'</span><h3 class="mt" style="font-size:17px">'+esc(cd.label)+'</h3>'+
      '<p class="mt small mut">'+esc(cd.detail)+'</p>'+
      (isPool?'':'<div class="flex mt"><span class="chip chip-mut">Zone : '+esc(cd.zoneNom)+' ('+Math.round(fcm()*cd.zonePct[0])+'-'+Math.round(fcm()*cd.zonePct[1])+' bpm)</span></div>')+'</div>'+
      (rec?'<span class="chip chip-green">✅ '+rec.duree+' min</span>':'<span class="chip chip-mut">à faire</span>')+'</div>'+
      '<div class="flex mt">'+(isPool
        ?'<button class="btn btn-grad" onclick="go(\'v-piscine\')">🏊 Pool Lab — protocoles</button>'
        :'<button class="btn btn-grad" onclick="openCardioLog(\''+todayKey()+'\')">📝 '+(rec?'Modifier':'Enregistrer')+'</button><button class="btn btn-line" onclick="go(\'v-cardio\')">🚴 Changer de support</button>')+'</div>';
  } else if(today.type==='piscine'){
    todayHtml+='<div class="spread"><div><span class="chip chip-gold">🏊 Piscine (coach)</span><h3 class="mt" style="font-size:17px">'+esc(today.label)+'</h3>'+
      '<p class="mt small mut">Jour piscine imposé : choisissez un protocole dans le Pool Lab, le minuteur vous guide et valide le jour à la fin.</p></div></div>'+
      '<div class="flex mt"><button class="btn btn-grad" onclick="go(\'v-piscine\')">🏊 Ouvrir le Pool Lab</button>'+
      '<button class="btn btn-line" onclick="startProtocol(\'pool\',\'recovery\',1)">🧊 Protocole détente</button></div>';
  } else if(today.type==='metcon'){
    todayHtml+='<span class="chip chip-blue">🚴 Cardio</span><p class="mt small mut">'+esc((PROGRAM[programPos(todayKey()).mois]||PROGRAM.finale).metcon)+'</p><div class="flex mt"><button class="btn btn-line btn-sm" onclick="go(\'v-cardio\')">🚴 Ouvrir le cardio</button></div>';
  } else {
    const next=weekPlan(todayKey()).find(p2=>p2.type==='seance'&&p2.date>todayKey());
    todayHtml+='<span class="chip chip-mut">Jour de repos</span>'+
      (next? '<p class="mt small mut">Prochaine séance : <b class="gold">'+esc(next.label)+'</b> — '+fmtDateFr(next.date)+'</p>':'<p class="mt small mut">Jour de récupération : marche, mobilité, sommeil.</p>')+
      '<div class="flex mt"><button class="btn btn-line btn-sm" onclick="go(\'v-recuperation\')">😴 Check-in récupération</button><button class="btn btn-line btn-sm" onclick="openDetente(\''+todayKey()+'\')">🧊 Détente</button></div>';
  }
  todayHtml+='</div>';
  $('#dash-today').innerHTML=todayHtml;
  // Recs
  const recs=buildRecommendations();
  $('#dash-rec').innerHTML = recs.map(r=>recItem(r)).join('') || '<div class="note-box">Aucune recommandation pour l\'instant.</div>';
  // Gauge
  $('#gauge-global').innerHTML = gaugeSVG(scoreTransformation().total, null, 'SUR 100');
  // Bandeau transformation + rappel photo
  (function(){
    const idxT=indiceTransformation();
    const prR=photoRappelEtat();
    const dT=deltasMensurations();
    const cT=cardioSemaineInfos(pos.weekGlobal);
    let h='<div class="card mt" style="border-color:rgba(255,111,174,.35)">'+
      '<div class="spread"><div><b>📊 Transformation</b>'+
      '<div class="small mut mt">Corps '+idxT.corporel+' · Perf '+idxT.perf+' · Régularité '+idxT.adherence+' · Récup '+idxT.recup+'</div></div>'+
      '<button class="btn btn-line btn-sm" onclick="go(\'v-transfo\')">Voir →</button></div>'+
      '<div class="pbar mt"><div class="fill" style="width:'+idxT.total+'%"></div></div>'+
      '<div class="spread small mut mt"><span>Indice global</span><b class="gold">'+idxT.total+'/100</b></div></div>';
    h+='<div class="card mt"><div class="spread"><div><b>🚴 Cardio de la semaine</b><div class="small mut mt">'+cT.faites+' / '+cT.prevues+' séance(s) enregistrée(s)</div></div>'+
      '<button class="btn btn-line btn-sm" onclick="go(\'v-cardio\')">Ouvrir →</button></div></div>';
    if(prR && prR.due){
      h+='<div class="card mt" style="border-color:rgba(255,159,67,.5)"><div class="spread"><div><span class="chip chip-orange">🔔 Bilan photo</span>'+
        '<div class="small mut mt">Semaine '+prR.jalon+' : prenez face, profil et dos'+(prR.joursRestants>0?' (retard de '+prR.joursRestants+' j)':'')+'</div></div>'+
        '<button class="btn btn-line btn-sm" onclick="go(\'v-photos\')">📸 Photos</button></div></div>';
    }
    const dashHero=document.getElementById('dash-hero');
    let holder=document.getElementById('dash-transfo');
    if(!holder && dashHero){ holder=document.createElement('div'); holder.id='dash-transfo'; holder.className='mt'; dashHero.parentNode.insertBefore(holder, dashHero.nextSibling); }
    if(holder) holder.innerHTML=h;
  })();
  // Phase
  $('#dash-phase-chip').textContent = (pos.idx==='F'?'Finale':'Mois '+pos.idx);
  $('#dash-phase-chip').title = (phase.macro||'');
  $('#dash-phase-info').innerHTML =
    '<div class="small mut">'+esc(phase.titre)+'</div>'+
    '<div class="flex mt"><span class="chip chip-blue">'+esc(phase.schema)+'</span><span class="chip chip-gold">'+esc(phase.intensite)+'</span><span class="chip chip-mut">'+esc(phase.methode.split(' (')[0])+'</span></div>';
  const wk=(pos.deload?'Semaine de deload — volume réduit':'Semaine '+(pos.weekGlobal%4+1)+'/4 du mois')+' · '+(pos.weekGlobal+1)+'/52';
  $('#dash-phase-week').innerHTML='<span>'+wk+'</span>';
  $('#dash-phase-progress').innerHTML='<div class="fill" style="width:'+((pos.weekGlobal%4+1)/4*100)+'%"></div>';
  // Badges
  const bd=state.badges;
  $('#dash-badges').innerHTML = bd.length? BADGES.filter(b=>bd.includes(b.id)).slice(-6).map(b=>'<span class="chip chip-gold" title="'+esc(b.d)+'">'+b.ic+' '+esc(b.n)+'</span>').join('') : '<span class="small mut">Aucun badge pour l\'instant — lancez-vous !</span>';
  // Objectif
  $('#dash-goal-chip').textContent = ({masse:'Prise de masse',esthetique:'Esthétique féminine',recomposition:'Recomposition',seche:'Perte de gras',force:'Force'})[state.objectifs.principal]||'—';
  $('#dash-goal-bar').style.width=obj.pct+'%';
  $('#dash-goal-label').textContent = obj.label;
  $('#dash-goal-pct').textContent = obj.pct+' %';
}
function tile(ic,lbl,val,delta,dir){
  const cls = dir==='up'?'up':dir==='down'?'down':dir==='warn'?'warn':dir==='gold'?'gold':'mut';
  return '<div class="tile"><div class="t-ic">'+ic+'</div><div class="t-lbl">'+lbl+'</div><div class="t-val">'+val+'</div><div class="t-delta '+cls+'">'+delta+'</div></div>';
}
function recItem(r){
  return '<div class="rec-item '+r.cls+'"><div class="r-ic">'+r.ic+'</div><div><span class="r-tag">'+r.tag+'</span>'+esc(r.txt)+'</div></div>';
}

/* ================== PROFIL ================== */
function renderProfil(){
  const p=state.profil;
  Object.keys(PROFILE_MAP).forEach(id=>{
    const el=$('#'+id); if(!el) return;
    const key=PROFILE_MAP[id];
    if(el.tagName==='SELECT') el.value = p[key]!=null? p[key]:'';
    else el.value = p[key]!=null? p[key]:'';
  });
  calcIMC();
  renderEquip();
  renderMensJ0();
  renderPhotosJ0();
  $('#force-banner').innerHTML = forceTestDone()
    ? '<div class="ok-box mb">🔢 Bilan 1RM réalisé le '+fmtDateFr(state.force.date)+' — charges personnalisées actives dans vos séances. <button class="btn btn-line btn-sm" onclick="go(\'v-force\')">Gérer</button></div>'
    : '<div class="warn-box mb">🔢 <b>Avant votre bilan</b>, réalisez votre test de force maximale (5-8 min) : il pré-remplira automatiquement les charges de chaque exercice. <button class="btn btn-grad btn-sm" onclick="go(\'v-force\')">Faire le test 1RM</button></div>';
}
function calcIMC(){
  const t=numOr($('#p-taille').value), w=numOr($('#p-poids').value);
  $('#p-imc').value = (t&&w)? (w/((t/100)**2)).toFixed(1) : '';
}
/* Matériel disponible — pilote les variantes et le cardio */
const EQUIP_ITEMS = [
  ['salle','🏠','Salle de musculation à domicile','Barre, haltères, banc'],
  ['barre','🏋️','Barre olympique + supports','Indispensable pour le hip thrust lourd'],
  ['poulie','🪢','Poulie / élastiques','Abduction, kickback, face pull, Pallof press'],
  ['legcurl','🦵','Machine leg curl','Sinon : swiss-ball leg curl ou soulevé de terre roumain'],
  ['machine_abd','🍑','Machine à abduction','Sinon : abduction à la poulie ou à l\'élastique'],
  ['elliptique','🚴','Vélo elliptique','Cardio principal à domicile'],
  ['piscine','🏊','Accès à une piscine','Récupération active et cardio sans impact']
];
function renderEquip(){
  const el=$('#equip-grid'); if(!el) return;
  if(!state.equip) state.equip={};
  el.innerHTML=EQUIP_ITEMS.map(([k,ic,nom,desc])=>
    '<label class="checkrow" style="cursor:pointer;padding:9px 11px;border:1px solid var(--line);border-radius:12px;background:var(--panel)">'+
    '<input type="checkbox" '+(state.equip[k]!==false?'checked':'')+' onchange="setEquip(\''+k+'\',this.checked)"> '+
    '<span style="font-size:19px">'+ic+'</span><span><b>'+esc(nom)+'</b><div class="tiny mut">'+esc(desc)+'</div></span></label>').join('');
}
function setEquip(k,v){
  if(!state.equip) state.equip={};
  state.equip[k]=v; save(); renderCurrent();
  toast((v?'✅ ':'')+(EQUIP_ITEMS.find(e=>e[0]===k)||[])[2]+' '+(v?'activé':'désactivé'));
}
function renderMensJ0(){
  const j0=state.mensurations.jour0||{};
  $('#mens-jour0').innerHTML = MENS_FIELDS.map(([k,l])=>{
    const val=(j0[k]==null||j0[k]==='')?'':String(j0[k]).replace('.', ',');
    return '<div class="field"><label for="mj-'+k+'">'+esc(l)+' (cm)</label>'+
      '<div class="num-stepper">'+
      '<button type="button" class="ns-btn" aria-label="Diminuer" data-id="mj-'+k+'" data-step="-0.5" data-stepsize="0.5" data-min="0">−</button>'+
      '<input class="inp inp-num" type="tel" inputmode="decimal" autocomplete="off" id="mj-'+k+'" value="'+val+'" placeholder="—">'+
      '<button type="button" class="ns-btn" aria-label="Augmenter" data-id="mj-'+k+'" data-step="0.5" data-stepsize="0.5" data-min="0">+</button>'+
      '</div></div>';
  }).join('');
}
function renderPhotosJ0(){
  $('#photos-j0').innerHTML = [
    ['face','Face'],['profil','Profil'],['dos','Dos'],['compl','Complémentaire']
  ].map(([k,l])=>photoCard('j0', k, l)).join('');
}
function photoCard(ms, vue, label){
  ensurePhotoSlot(ms);
  const url=state.photos[ms]?state.photos[ms][vue]:'';
  return '<div class="photo-card">'+
    (url? '<img class="ph-img" src="'+photoSrc(url)+'" alt="'+label+'">':'<div class="ph-img" style="display:flex;align-items:center;justify-content:center;color:var(--mut2);font-size:26px">📷</div>')+
    '<div class="ph-meta"><div><div class="ph-t">'+label+'</div><div class="ph-a">'+(ms==='j0'?'Jour 0':('Mois '+ms.slice(1)))+'</div></div>'+
    '<button class="btn btn-line btn-sm" onclick="document.getElementById(\'up-'+ms+'-'+vue+'\').click()">'+(url?'🔄':'＋')+'</button></div>'+
    '<input type="file" accept="image/*" id="up-'+ms+'-'+vue+'" style="display:none" onchange="photoUpload(this.files[0],\''+ms+'\',\''+vue+'\')">'+
    '</div>';
}
function photoUpload(file, ms, vue){
  if(!file) return;
  compressImage(file, data=>{
    ensurePhotoSlot(ms)[vue]=data;
    save(); checkBadges(); renderCurrent(); toast('📸 Photo enregistrée');
  });
}
function saveProfil(){
  const val = id => $('#p-'+id).value.trim();
  const vnum = id => { const v=numOr(val(id)); return v==null? '': v; };
  if(!val('nom')){ toast('⚠️ Indiquez votre nom'); return; }
  if(!val('age')||!val('taille')||!val('poids')){ toast('⚠️ Âge, taille et poids sont obligatoires'); return; }
  const nouveauDebut = !state.profil.date;
  state.profil = {
    nom:val('nom'), date:val('date')||todayKey(), age:+vnum('age'), taille:+vnum('taille'),
    poidsDepart:+vnum('poids'), objectifPoids:+vnum('objectif-poids')||'',
    niveau:val('niveau'), annees:+vnum('annees')||0, seancesSemaine:+val('seances'),
    mg:+vnum('mg')||'', mm:+vnum('mm')||''
  };
  // Poids de départ → première pesée automatique
  if(!state.poids[state.profil.date]) state.poids[state.profil.date]=+state.profil.poidsDepart;
  // Mensurations jour 0
  const j0={};
  MENS_FIELDS.forEach(([k])=>{ const v=numOr($('#mj-'+k).value); if(v) j0[k]=v; });
  state.mensurations.jour0 = Object.keys(j0).length? j0 : state.mensurations.jour0;
  // MG départ
  if(state.profil.mg && !state.mg[state.profil.date]) state.mg[state.profil.date]=+state.profil.mg;
  // Recommandation de phase nutritionnelle initiale
  if(nouveauDebut || !state.nutri.phase) state.nutri.phase = phaseNutritionRecommandee();
  save(); checkBadges();
  toast('✅ Bilan de départ enregistré — bienvenue dans votre transformation !');
  renderCurrent(); go('v-dashboard');
}
function saveProfilLight(){ save(); }

/* ================== BILAN 1RM ================== */
function renderForce(){
  const teste = forceTestDone();
  const f=state.force||{};
  // Héro
  $('#force-hero').innerHTML = teste
    ? '<div class="card glow"><div class="spread"><div><span class="chip chip-green">✅ Bilan 1RM réalisé</span>'+
      '<h2 class="mt" style="font-size:20px;font-weight:900">Vos charges sont personnalisées</h2>'+
      '<div class="small mut mt">Test du '+fmtDateFr(f.date)+' · '+Object.keys(f.valeurs||{}).length+' mouvements · <b>'+(forceReevalDue()?'<span class="warn">réévaluation recommandée</span>':'prochaine réévaluation : '+fmtDateFr(nextReevalDate())+'</b>')+'</div></div>'+
      '<div class="flex"><button class="btn btn-grad btn-sm" onclick="importerPR()">📈 Importer mes records</button><button class="btn btn-line btn-sm" onclick="go(\'v-profil\')">👤 Profil</button></div></div>'+
      '<div class="divider"></div>'+
      '<div class="tbl-wrap"><table class="tbl"><tr><th>Mouvement</th><th class="num">1RM</th><th class="num">Précédent</th><th class="num">Écart</th><th class="num">1RM auto (vos séances)</th><th class="num">Ex. séance type (75 %)</th></tr>'+
      TEST_1RM.exercices.map(ex=>{
        const v=f.valeurs? f.valeurs[ex.key]:null;
        if(!v) return '';
        const d=forceDelta(ex.key);
        const auto=auto1RMParMouvement()[ex.key];
        const autoV=auto&&auto.auto!=null? auto.auto:null;
        const autoUp=autoV!=null&&(v==null||autoV>v);
        return '<tr><td><div class="exo-gif-row" style="gap:6px"><button class="btn btn-line btn-sm demo-btn" style="padding:2px 8px;font-size:11px" data-exo="'+esc(ex.nom)+'">▶</button><b>'+ex.ic+' '+esc(ex.nom)+'</b></div></td><td class="num gold">'+fmtKg(v)+'</td><td class="num">'+(d!=null?'—':'—')+'</td><td class="num '+(d>0?'up':d<0?'down':'mut')+'">'+(d!=null?((d>0?'+':'')+d+' kg'):'—')+'</td><td class="num">'+(autoV!=null?'<b class="'+(autoUp?'up':'mut')+'">'+fmtKg(autoV)+'</b>':'—')+'</td><td class="num mut">'+fmtKg(roundCharge((autoV||v)*0.75))+'</td></tr>';
      }).join('')+'</table></div>'+
      '<div class="ok-box mt">🤖 <b>1RM automatique :</b> vos charges enregistrées en séance recalculent votre 1RM (formule d\'Epley, meilleure performance). <b>Vos séances priment sur le test déclaré</b> : si vous n\'aviez pas pu suivre les charges, elles s\'adaptent à votre niveau réel — et montent quand vous progressez. '+
      (Object.keys(auto1RMParMouvement()).some(k=>{const a=auto1RMParMouvement()[k];return a.auto!=null&&(a.decl==null||a.auto>a.decl);})
        ? 'Les mouvements en <b class="up">vert</b> ont dépassé votre 1RM déclaré : votre force progresse, les charges suivent.'
        : 'Dès que vos séances dépasseront ces valeurs, le 1RM auto prendra le relais automatiquement.')+'</div>'+
      '<div class="note-box mt">💡 Ces 1RM (déclaré ou auto) alimentent automatiquement la <b>case charge</b> de chaque exercice de vos séances, avec un % adapté à la phase (70-85 %) et à la fourchette de répétitions. Ajustez toujours à votre ressenti (RIR 1-2).</div></div>'
    : '<div class="card"><div class="spread"><div><b style="font-size:16px">Test non réalisé</b>'+
      '<div class="small mut mt">5-8 minutes suffisent. Ce test pré-remplira automatiquement la case charge de chaque exercice du programme. <b>Astuce :</b> même sans test, vos séances enregistrées calculent déjà automatiquement votre 1RM et vos charges suggérées.</div></div>'+
      '<button class="btn btn-grad" onclick="document.getElementById(\'force-test\').scrollIntoView({behavior:\'smooth\'})">⬇ Commencer le test</button></div></div>';
  // Protocole
  $('#force-protocol').innerHTML =
    '<div class="grid g3">'+
    '<div class="tile"><div class="t-ic">🔥</div><div class="t-lbl">Échauffement</div><div class="small mut" style="margin-top:6px">5-10 min : séries progressives (~50 %, 70 %, 85 %) sur chaque mouvement avant les essais maximaux.</div></div>'+
    '<div class="tile"><div class="t-ic">🎯</div><div class="t-lbl">Essais</div><div class="small mut" style="margin-top:6px">3 à 5 essais espacés de 3-4 min. Un 1RM valide = technique parfaite, sans élan ni compensation.</div></div>'+
    '<div class="tile"><div class="t-ic">🩺</div><div class="t-lbl">Prudence</div><div class="small mut" style="margin-top:6px">Ne testez jamais seul·e à l\'échec total : demandez une assistance. En cas de doute, un 3-5RM estimé suffit.</div></div>'+
    '</div>'+
    '<div class="danger-box mt">⚠️ Le test de force maximale est réservé aux personnes en bonne santé et entraînées. En cas de douleur, blessure ou problème médical, consultez un professionnel de santé avant de tester. Les valeurs saisies restent sous votre responsabilité.</div>';
  // Formulaire
  $('#force-test').innerHTML =
    '<div class="small mut mb">Pour chaque mouvement : saisissez votre <b>charge maximale (1RM)</b>. Si vous préférez un 3RM ou 5RM, saisissez la charge <b>et</b> le nombre de répétitions max : le 1RM est estimé automatiquement (formule d\'Epley).</div>'+
    '<div class="tbl-wrap"><table class="tbl"><tr><th>Mouvement</th><th class="num" style="min-width:120px">Charge (kg)</th><th class="num" style="min-width:90px">Rép. max</th><th class="num" style="min-width:110px">1RM estimé</th></tr>'+
    TEST_1RM.exercices.map(ex=>{
      const v=f.valeurs? f.valeurs[ex.key]:null;
      return '<tr><td><div class="exo-gif-row" style="gap:6px"><button class="btn btn-line btn-sm demo-btn" style="padding:2px 8px;font-size:11px" data-exo="'+esc(ex.nom)+'">▶</button><b>'+ex.ic+' '+esc(ex.nom)+'</b></div>'+(ex.essentiel?' <span class="chip chip-gold" style="margin-left:6px">essentiel</span>':' <span class="chip chip-mut" style="margin-left:6px">complémentaire</span>')+'</td>'+
        '<td class="num"><input class="inp" type="tel" inputmode="decimal" step="0.5" min="0" id="f1rm-'+ex.key+'" value="'+(v||'')+'" placeholder="kg" style="width:100px;text-align:center" oninput="calcEst1RM(\''+ex.key+'\')"></td>'+
        '<td class="num"><select class="inp" id="f1rmr-'+ex.key+'" style="width:78px" onchange="calcEst1RM(\''+ex.key+'\')">'+
          [1,2,3,5].map(r=>'<option value="'+r+'" '+( (f.repsMax&&f.repsMax[ex.key]==r)?'selected':'')+'>'+r+'</option>').join('')+'</select></td>'+
        '<td class="num"><b id="f1rme-'+ex.key+'" class="gold">'+(v? fmtKg(v):'—')+'</b></td></tr>';
    }).join('')+'</table></div>'+
    '<div class="flex mt"><button class="btn btn-grad" onclick="saveForceTest()">💾 Enregistrer mon bilan 1RM</button>'+
    (teste?'<button class="btn btn-line" onclick="renderForce()">↩ Annuler les modifications</button>':'')+
    '<span class="small mut">Les 5 mouvements essentiels sont recommandés : <b>hip thrust</b>, soulevé de terre roumain, squat, bulgarian split squat et rowing. Ce sont eux qui pilotent le calcul automatique de vos charges.</span></div>'+
    '<div class="note-box mt">💡 Tractions et dips : saisissez le <b>poids additionnel</b> que vous pouvez soulever à 1RM (0 si vous ne pouvez pas encore en ajouter). Les charges suggérées de ces exercices seront calculées sur cette base.</div>';
  // Réévaluation
  $('#force-reeval').innerHTML = teste
    ? '<div class="spread"><div><b>Réévaluation programmée par le coach</b>'+
      '<div class="small mut mt">Le coach fixe la réévaluation 1RM <b>toutes les 8 semaines</b> — à la fin de chaque phase d\'intensification, moment où votre force atteint son pic (mois 2, 4, 6, 8, 10, 12). Vos charges suggérées sont alors <b>recalculées automatiquement</b>.</div>'+
      '<div class="flex mt"><span class="chip '+(forceReevalDue()?'chip-orange':'chip-green')+'">'+(forceReevalDue()?'🔁 Réévaluation recommandée':'✅ À jour — prochaine réévaluation : '+fmtDateFr(nextReevalDate()))+'</span>'+
      (forceReevalDue()? '<span class="chip chip-mut">il y a '+forceJoursRestants()+' j de retard</span>':'')+'</div></div>'+
      '<button class="btn btn-grad" onclick="renderForce();document.getElementById(\'force-test\').scrollIntoView({behavior:\'smooth\'})">🔁 Refaire le test</button></div>'
    : '<div class="small mut">Après votre premier test, le coach programmera automatiquement une réévaluation toutes les 8 semaines pour recalculer vos charges.</div>';
}
function calcEst1RM(k){
  const ch=numOr($('#f1rm-'+k).value);
  const rp=parseInt($('#f1rmr-'+k).value||1);
  // reps = 1 → c'est déjà un 1RM ; sinon formule d'Epley
  const est = (ch&&rp)? (rp===1? ch : ch*(1+rp/30)) : null;
  $('#f1rme-'+k).textContent = est? fmtKg(round1(est)) : '—';
}
function saveForceTest(){
  const valeurs={}, repsMax={};
  TEST_1RM.exercices.forEach(ex=>{
    const ch=numOr($('#f1rm-'+ex.key).value);
    const rp=parseInt($('#f1rmr-'+ex.key).value||1);
    if(ch>0){ valeurs[ex.key]=round1(rp===1? ch : ch*(1+rp/30)); repsMax[ex.key]=rp; }
  });
  if(!Object.keys(valeurs).length){ toast('⚠️ Saisissez au moins un mouvement (les 4 essentiels sont recommandés)'); return; }
  const hist=[];
  if(state.force && state.force.date && state.force.valeurs && Object.keys(state.force.valeurs).length){
    hist.push({date:state.force.date, valeurs:state.force.valeurs});
    if(state.force.historique) hist.push(...state.force.historique);
  }
  state.force={date:todayKey(), valeurs, historique:hist.slice(0,12), freqWeeks:FORCE_REVAL_WEEKS, repsMax};
  save(); checkBadges();
  toast('✅ Bilan 1RM enregistré — vos charges sont recalculées automatiquement !');
  renderCurrent(); renderForce();
}
function importerPR(){
  // Pré-remplit le formulaire depuis les records du journal (hip thrust, SDT roumain, squat, bulgarian, rowing)
  TEST_1RM.exercices.forEach(ex=>{
    if(!MAIN_LIFTS[ex.key]) return;
    const pr=perfSerie(ex.key);
    const el=$('#f1rm-'+ex.key);
    if(pr && el){ el.value=Math.round(pr.max); calcEst1RM(ex.key); }
  });
  toast('📈 Records du journal chargés dans le test — vérifiez puis enregistrez');
}

/* ================== REPAS JOUR PAR JOUR ================== */
let repasCur = null;
function renderRepas(){
  const p=state.profil;
  if(!p.date){ $('#repas-jour').innerHTML='<div class="card"><div class="spread"><div><b>Complétez d\'abord le bilan de départ</b><div class="small mut">Les repas sont calculés à partir de vos besoins (âge, taille, poids, stratégie).</div></div><button class="btn btn-grad" onclick="go(\'v-profil\')">👤 Profil</button></div></div>'; return; }
  const debut=parseDate(p.date);
  const fin=addDays(debut,364);
  if(!repasCur) repasCur = todayKey();
  // borne dans la fenêtre programme
  let d=parseDate(repasCur);
  if(d<debut) d=debut; if(d>fin) d=fin;
  repasCur=dateKey(d);
  const pos=programPos(repasCur);
  const mois=(pos.idx==='F'?13:+pos.idx)||1;
  const jourIdx=parseInt(String(repasCur).slice(-2),10)||1;
  const gp=genererPlanJour(mois, jourIdx);
  // Navigation
  $('#repas-date-nav').innerHTML =
    '<div class="card"><div class="spread">'+
    '<div class="stepper"><button class="btn btn-line" onclick="repasNav(-1)">◀</button>'+
    '<span class="b" style="min-width:150px;text-align:center">'+fmtDateFr(repasCur)+'</span>'+
    '<button class="btn btn-line" onclick="repasNav(1)">▶</button></div>'+
    '<div class="flex"><span class="chip chip-gold">Mois '+(mois===13?'13 (finale)':mois)+'</span>'+
    '<span class="chip chip-blue">'+esc((gp&&gp.cible) ? gp.cible.nom : '—')+'</span>'+
    '<button class="btn btn-line btn-sm" onclick="repasNav(0)">Aujourd\'hui</button>'+
    '<button class="btn btn-line btn-sm" onclick="openRepasDate()">📅 Date</button></div>'+
    '</div></div>';
  if(!gp){ $('#repas-jour').innerHTML='<div class="chart-empty">Impossible de générer le plan pour cette date.</div>'; return; }
  // Jour détaillé
  $('#repas-jour').innerHTML =
    '<div class="card glow"><div class="spread mb"><div><span class="chip chip-green">🍽️ Repas du '+fmtDateFr(repasCur)+'</span>'+
    '<h3 class="mt" style="font-size:17px">Menu n°'+((jourIdx%3)+1)+' de la rotation</h3></div>'+
    '<span class="chip chip-gold">'+gp.cible.cal+' kcal cibles</span></div>'+
    '<div class="tbl-wrap"><table class="tbl"><tr><th>Repas</th><th>Contenu</th><th class="num">kcal</th><th class="num">Prot</th><th class="num">Gluc</th><th class="num">Lip</th></tr>'+
    gp.plan.map(m=>'<tr><td class="b">'+esc(m.nom)+'</td><td class="small">'+(m.rows.length? m.rows.map(r=>esc(r.nom)+' <b>'+r.qte+' g</b>').join(' · '):'<span class="mut">—</span>')+'</td><td class="num">'+m.total.cal+'</td><td class="num">'+m.total.p+'</td><td class="num">'+m.total.g+'</td><td class="num">'+m.total.l+'</td></tr>').join('')+
    '<tr style="background:rgba(255,111,174,.06)"><td class="b gold">TOTAL</td><td class="small mut">vs cible : '+gp.cible.cal+' kcal · '+gp.cible.p+' g P · '+gp.cible.g+' g G · '+gp.cible.l+' g L</td><td class="num gold"><b>'+gp.final.cal+'</b></td><td class="num gold"><b>'+gp.final.p+'</b></td><td class="num gold"><b>'+gp.final.g+'</b></td><td class="num gold"><b>'+gp.final.l+'</b></td></tr>'+
    '</table></div>'+
    '<div class="flex mt"><span class="chip chip-blue">💧 Hydratation : '+Math.round((+state.profil.poidsDepart||70)*35)+' ml/jour</span>'+
    '<button class="btn btn-line btn-sm" onclick="openFoodModal()">📝 Journal alimentaire</button></div>'+
    '<div class="note-box mt">🍽️ Plan indicatif généré selon vos besoins. Adaptez les quantités à vos préférences — l\'essentiel est de respecter les macro-nutriments. Le menu varie chaque jour (3 rotations) pour éviter la monotonie.</div>'+
    '</div>';
  // Semaine
  const lundi=addDays(parseDate(p.date), pos.weekGlobal*7);
  const rowsWeek=[];
  for(let i=0;i<7;i++){
    const dd=dateKey(addDays(lundi,i));
    const jIdx=parseInt(dd.slice(-2),10)||1;
    const g2=genererPlanJour(mois, jIdx);
    const isToday = dd===todayKey();
    rowsWeek.push('<tr '+(isToday?'style="background:rgba(255,111,174,.07)"':'')+' onclick="repasAller(\''+dd+'\')" style="cursor:pointer"><td class="b">'+['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][new Date(dd).getDay()]+' '+fmtDateShort(dd)+(isToday?' <span class="chip chip-gold">auj.</span>':'')+'</td>'+
      '<td class="small mut">Menu n°'+((jIdx%3)+1)+'</td>'+
      '<td class="num">'+(g2? g2.final.cal:'—')+'</td><td class="num">'+(g2? g2.final.p:'—')+'</td><td class="num">'+(g2? g2.final.g:'—')+'</td><td class="num">'+(g2? g2.final.l:'—')+'</td></tr>');
  }
  $('#repas-semaine').innerHTML =
    '<div class="card"><div class="tbl-wrap"><table class="tbl"><tr><th>Jour</th><th>Menu</th><th class="num">kcal</th><th class="num">Prot</th><th class="num">Gluc</th><th class="num">Lip</th></tr>'+rowsWeek.join('')+'</table></div>'+
    '<div class="small mut mt">Cliquez sur un jour pour voir son menu détaillé. La stratégie ('+esc(gp.cible.nom)+') s\'ajuste automatiquement chaque mois.</div></div>';
}
function repasNav(dir){
  if(dir===0){ repasCur=todayKey(); }
  else { const d=addDays(parseDate(repasCur||todayKey()), dir); repasCur=dateKey(d); }
  renderRepas();
}
function repasAller(d){ repasCur=d; renderRepas(); }
function openRepasDate(){
  openModal('<h3>📅 Aller à un jour</h3>'+
    '<div class="field"><label>Date</label><input class="inp" type="date" id="repas-date-picker" value="'+(repasCur||todayKey())+'"></div>'+
    '<button class="btn btn-grad btn-block" onclick="repasAller(document.getElementById(\'repas-date-picker\').value);closeModal()">Afficher ce jour</button>');
}

/* ================== MENSURATIONS ================== */
function renderMensurations(){
  const pa=poidsActuel();
  const pd=state.profil.poidsDepart;
  $('#ms-poids').textContent = pa!=null? pa.toFixed(1)+' kg':'—';
  $('#ms-poids-d').innerHTML = (pa&&pd)? ((pa-pd>0?'+':'')+round1(pa-pd)+' kg depuis J0') : 'Pesez-vous dès maintenant';
  const mgDern=Object.entries(state.mg).sort().pop();
  $('#ms-mg').textContent = mgDern? mgDern[1]+' %':'—';
  const j0mg=state.profil.mg;
  $('#ms-mg-d').innerHTML = (mgDern&&j0mg)? ((mgDern[1]-j0mg>0?'+':'')+round1(mgDern[1]-j0mg)+' pts vs J0') : 'Saisissez une mesure fiable';
  const dm=dernierMensuration();
  const n=Object.keys(state.mensurations.mensuel||{}).length;
  $('#ms-count').textContent = n+' relevé'+(n>1?'s':'');
  $('#ms-last').textContent = dm? 'Dernier : '+fmtDateFr(dernierMensurationDate()) : (n? '':'Aucun relevé');
  // graph poids
  const pe=Object.entries(state.poids).sort();
  lineChart($('#chart-poids'), pe.map(x=>fmtDateShort(x[0])), [{name:'Poids', color:'#ff6fae', data:pe.map(x=>+x[1])}], {unit:' kg', empty:'Saisissez vos pesées hebdomadaires'});
  // tableau mensurations
  const moisOpts = ['',...Array.from({length:12},(_,i)=>'M'+(i+1))];
  const sel=$('#m-mois-select'); const ancien=sel.value;
  sel.innerHTML = moisOpts.map((m,i)=>'<option value="'+m+'">'+(m?('Mois '+i):'Choisir un mois…')+'</option>').join('');
  if(ancien) sel.value=ancien;
  const mm=state.mensurations.mensuel||{};
  const keys=Object.keys(mm).sort();
  let rows='<tr><th>Mesure</th><th class="num">Jour 0</th>'+keys.map(k=>'<th class="num">'+k+'</th>').join('')+'<th class="num">Écart total</th></tr>';
  MENS_FIELDS.forEach(([k,l])=>{
    const j0=state.mensurations.jour0? state.mensurations.jour0[k]:null;
    const vals=keys.map(k2=>mm[k2]&&mm[k2][k]!==undefined? mm[k2][k]:null);
    const last=vals.map(v=>v).reverse().find(v=>v!=null);
    const ecart=(j0&&last)? round1(last-j0):null;
    rows+='<tr><td>'+esc(l)+'</td><td class="num">'+(j0||'—')+'</td>'+vals.map(v=>'<td class="num">'+(v??'—')+'</td>').join('')+'<td class="num '+(ecart&&ecart>0?'up':ecart&&ecart<0?'down':'mut')+'">'+(ecart!=null?((ecart>0?'+':'')+ecart+' cm'):'—')+'</td></tr>';
  });
  // + MG si dispo
  $('#mens-table').innerHTML='<table class="tbl">'+rows+'</table>';
  // graphique mensurations
  const labels=['J0',...keys];
  const pickF=(k)=>labels.map(l=> l==='J0'? (state.mensurations.jour0[k]!=null?parseFloat(state.mensurations.jour0[k]):null) : (mm[l]&&mm[l][k]!=null? parseFloat(mm[l][k]):null));
  /* Les 4 courbes qui comptent vraiment pour l'objectif féminin */
  const ser=[
    {name:'Taille', color:'#ff5252', data:pickF('taille')},
    {name:'Ventre', color:'#ff9f43', data:pickF('ventre')},
    {name:'Fessiers', color:'#ff6fae', data:pickF('fessiers')},
    {name:'Hanches', color:'#a78bfa', data:pickF('hanches')}
  ];
  lineChart($('#chart-mens'), labels, ser, {unit:' cm', empty:'Renseignez au moins le Jour 0 pour voir la courbe'});
  $('#legend-mens').innerHTML = ser.map(s=>'<span><i style="background:'+s.color+'"></i>'+s.name+'</span>').join('')+
    '<span class="mut" style="margin-left:8px">— 👉 on cherche : taille ↓, ventre ↓, fessiers ↑, hanches ≈ stables</span>';
  // graph MG
  const me=Object.entries(state.mg).sort();
  lineChart($('#chart-mg'), me.map(x=>fmtDateShort(x[0])), [{name:'MG', color:'#ff9f43', data:me.map(x=>+x[1])}], {unit:' %', empty:'Saisissez des mesures de masse grasse'});
}
function dernierMensurationDate(){
  const keys=Object.keys(state.mensurations.mensuel||{}).sort();
  return keys.length? keys[keys.length-1]:null;
}
function addWeight(){
  const d=$('#w-date').value, v=numOr($('#w-val').value);
  if(!d||!v){ toast('⚠️ Date et poids requis'); return; }
  state.poids[d]=v; save(); toast('⚖️ Poids enregistré'); renderCurrent();
}
function addMG(){
  const d=$('#mg-date').value, v=numOr($('#mg-val').value);
  if(!d||!v){ toast('⚠️ Date et valeur requises'); return; }
  state.mg[d]=v; save(); toast('📉 Masse grasse enregistrée'); renderCurrent();
}
function openMensModal(){
  const mois=$('#m-mois-select').value;
  if(!mois){ toast('⚠️ Choisissez d\'abord le mois du relevé'); return; }
  curMensMois=mois;
  const prev=state.mensurations.mensuel[mois]||{};
  openModal('<h3>📏 Relevé mensuel — '+mois+'</h3>'+
    '<div class="form-grid">'+MENS_FIELDS.map(([k,l])=>
      '<div class="field"><label for="mm-'+k+'">'+esc(l)+' (cm)</label>'+
      '<div class="num-stepper">'+
      '<button type="button" class="ns-btn" data-id="mm-'+k+'" data-step="-0.5" data-stepsize="0.5" data-min="0">−</button>'+
      '<input class="inp inp-num" type="tel" inputmode="decimal" autocomplete="off" id="mm-'+k+'" value="'+(prev[k]||'')+'" placeholder="—">'+
      '<button type="button" class="ns-btn" data-id="mm-'+k+'" data-step="0.5" data-stepsize="0.5" data-min="0">+</button>'+
      '</div></div>'
    ).join('')+'</div>'+
    '<button class="btn btn-grad btn-block" onclick="saveMensModal()">💾 Enregistrer le relevé</button>');
}
function saveMensModal(){
  const rec={};
  MENS_FIELDS.forEach(([k])=>{ const v=numOr($('#mm-'+k).value); if(v) rec[k]=v; });
  if(!Object.keys(rec).length){ toast('⚠️ Saisissez au moins une mesure'); return; }
  state.mensurations.mensuel[curMensMois]=rec;
  save(); checkBadges(); closeModal(); toast('✅ Relevé '+curMensMois+' enregistré'); renderCurrent();
}

/* ================== ENTRAÎNEMENT ================== */
function renderEntrainement(){
  const p=state.profil;
  if(!p.date){ $('#ent-current').innerHTML='<div class="card"><div class="spread"><div><b>Commencez par le bilan de départ</b><div class="small mut">Le programme se calcule à partir de votre date de début et de vos séances disponibles.</div></div><button class="btn btn-grad" onclick="go(\'v-profil\')">👤 Compléter le profil</button></div></div>'; return; }
  const pos=programPos(todayKey());
  const phase=pos.phase;
  const plan=weekPlan(todayKey());
  $('#ent-current').innerHTML =
    '<div class="card glow"><div class="spread"><div>'+
    '<span class="chip chip-gold">'+(pos.idx==='F'?'Phase finale':'Mois '+pos.idx+' — '+(pos.weekGlobal%4+1<=3?'semaine '+(pos.weekGlobal%4+1):'deload'))+'</span>'+
    '<h2 class="mt" style="font-size:21px;font-weight:900">'+esc(phase.titre)+'</h2>'+
    '<div class="small mut mt">'+esc(phase.objectif)+'</div></div>'+
    '<div class="flex"><span class="chip chip-blue">'+esc(phase.schema)+'</span><span class="chip chip-green">'+esc(phase.intensite)+'</span>'+
    '<span class="chip '+(forceReevalDue()?'chip-orange':forceTestDone()?'chip-mut':'chip-mut')+'" onclick="go(\'v-force\')" style="cursor:pointer">🔢 1RM : '+(forceTestDone()?(forceReevalDue()?'rééval. due':'à jour'):'non testé')+'</span></div></div>'+
    '<div class="divider"></div>'+
    '<div class="grid g4">'+
      stat('Méthode', phase.methode.split(' (')[0])+
      stat('Split', phase.split)+
      stat('Cardio', phase.metcon.split('— ')[1]||phase.metcon.split('—')[1]||phase.metcon)+
      stat('Progression', 'D\'abord +1 à 2 répétitions à charge égale, puis +2,5 % de charge quand le haut de fourchette est atteint avec RIR ≤ 2')
    +'</div>'+
    (pos.deload? '<div class="ok-box mt">🛌 <b>Semaine de deload :</b> séries réduites de ~50 %, charges à ~65 %, cardio léger ou piscine uniquement, aucune méthode intensive. Priorité à la technique et à la récupération.</div>':'')+
    '</div>';
  // semaine
  $('#ent-week').innerHTML = '<div class="tbl-wrap"><table class="tbl"><tr><th>Jour</th><th>Date</th><th>Contenu</th><th>Statut</th><th></th></tr>'+
    plan.map(d2=>{
      const st=state.seances[d2.date];
      const chip = st==='ok'?'<span class="chip chip-green">✅</span>':st==='partiel'?'<span class="chip chip-orange">🟡</span>':st==='non'?'<span class="chip chip-red">❌</span>':(d2.date===todayKey()?'<span class="chip chip-gold">Aujourd\'hui</span>':'<span class="chip chip-mut">—</span>');
      const btns = d2.type==='seance'
        ? '<button class="btn btn-line btn-sm" onclick="openSession(\''+d2.date+'\')">'+(st?'📝':'️')+' Ouvrir</button>'
        : d2.type==='piscine'
        ? '<button class="btn btn-line btn-sm" onclick="openPoolSession(\''+d2.date+'\')">'+(st?'📝':'')+' Ouvrir</button>'
        : d2.type==='metcon'
        ? ((d2.cardio && d2.cardio.format==='piscine')
            ? '<div class="flex"><button class="btn btn-line btn-sm" onclick="openPoolSession(\''+d2.date+'\')">🏊 Ouvrir</button><button class="btn btn-line btn-sm" onclick="setSeanceStatus(\''+d2.date+'\',\'ok\');renderCurrent()">✅</button></div>'
            : '<div class="flex"><button class="btn btn-line btn-sm" onclick="openCardioSession(\''+d2.date+'\')">🚴 Ouvrir</button><button class="btn btn-line btn-sm" onclick="setSeanceStatus(\''+d2.date+'\',\'ok\');renderCurrent()">✅</button><button class="btn btn-line btn-sm" onclick="setSeanceStatus(\''+d2.date+'\',\'non\');renderCurrent()">❌</button></div>')
        : ''
      return '<tr><td class="b">'+['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][d2.wk]+'</td><td>'+fmtDateShort(d2.date)+'</td><td class="b">'+esc(d2.label)+'</td><td>'+chip+'</td><td class="center">'+btns+'</td></tr>';
    }).join('')+'</table></div>';
  // Historique des semaines & progression des charges
  renderEntHist();
  renderEntProgress();
  renderEntFessiers();
  renderEntAbs();
  // Périodisation
  $('#ent-program').innerHTML = PERIODISATION.map(mc=>{
    return '<div class="acc-item"><button class="acc-head" onclick="this.parentElement.classList.toggle(\'open\')"><span class="phase-num" style="background:linear-gradient(135deg,#ff6fae,#c084fc);color:#2b0a1c">■</span><div class="ph-mid"><div class="ph-t">'+mc.nom+'</div><div class="ph-s">'+mc.desc+'</div></div><span class="acc-arrow">▼</span></button><div class="acc-body">'+
      mc.phases.map(ph=>{
        const m = ph==='F'? PROGRAM.finale : PROGRAM[ph];
        const active = ph===pos.idx;
        return '<div class="phase-row '+(active?'active':'')+'" onclick="ouvrirPhase(\''+ph+'\')"><div class="phase-num">'+(ph==='F'?'F':ph)+'</div><div class="ph-mid"><div class="ph-t">'+esc(m.titre)+'</div><div class="ph-s">'+esc(m.mois)+' · '+esc(m.split||'')+'</div></div><div class="ph-right"><b class="gold">'+esc(m.schema)+'</b><span>'+esc(m.intensite)+'</span></div></div>';
      }).join('')+'</div></div>';
  }).join('');
  // règles
  $('#ent-rules').innerHTML =
    '<div class="grid g2">'+
    '<div><h3 class="mb">📈 Comment progresser (double progression)</h3><ul style="padding-left:18px;color:var(--mut);font-size:13.5px;line-height:1.9">'+
    '<li><b class="gold">1. Technique :</b> tant que le mouvement n\'est pas propre, on ne change rien. Sur les fessiers, « propre » = contraction ressentie dans le fessier, pas dans les ischios ni les lombaires.</li>'+
    '<li><b class="gold">2. Amplitude :</b> cherchez l\'amplitude complète avant la charge (tibias verticaux en haut du hip thrust, hanches poussées loin derrière au soulevé de terre roumain).</li>'+
    '<li><b class="gold">3. Contrôle :</b> respectez le tempo (3 s de descente) et ajoutez 1 à 2 s de pause en contraction.</li>'+
    '<li><b class="gold">4. Répétitions :</b> gagnez +1 à 2 répétitions à charge égale.</li>'+
    '<li><b class="gold">5. Charge :</b> seulement une fois le haut de fourchette atteint avec RIR ≤ 2 → +2,5 % (2,5 kg sur le hip thrust et le squat, 1,25 kg sur les isolations).</li>'+
    '<li><b class="gold">6. Deload :</b> semaine 4 de chaque mois = récupération (volume -50 %, charges ~65 %).</li>'+
    '<li><b class="gold">RIR / RPE :</b> RIR 2-3 = 2-3 reps en réserve. RIR 0-1 uniquement sur la dernière série des exercices d\'isolation.</li></ul></div>'+
    '<div><h3 class="mb">🔥 Échauffement (8-12 min)</h3><ul style="padding-left:18px;color:var(--mut);font-size:13.5px;line-height:1.9">'+
    '<li>5 min d\'elliptique très facile, puis mobilité complète avec un focus sur les hanches.</li>'+
    '<li><b class="gold">Activation fessiers obligatoire</b> avant J1, J3, J4 et J5 : ponts, clamshells, abductions, kickbacks.</li>'+
    '<li>Séries d\'approche sur le 1er exercice : 50 % × 8-10, 70 % × 5-8, 85 % × 3-5 si nécessaire.</li>'+
    '<li>Respectez le <b class="gold">tempo</b> : 3010 = 3 s descente, 0 pause, 1 s montée, 0 pause.</li>'+
    '<li>Espacez les séances fessiers d\'au moins 48 h (lundi / jeudi / samedi sur un rythme de 4 séances).</li></ul></div>'+
    '</div><div class="note-box mt">Les mentions « myo-reps », « 1,5 reps », « drop set final » et « bi-set » appliquent la méthode du cycle en cours — le détail figure dans la note de chaque exercice et dans la description du cycle.</div>';
}

/* ---------- Bloc « progression spécifique fessiers » ---------- */
function renderEntFessiers(){
  const el=$('#ent-fessiers'); if(!el) return;
  const pos=programPos(todayKey());
  const sf=signauxFessiers(pos.weekGlobal);
  const cible = pos.phase.type==='developpement'?18 : pos.phase.type==='adaptation'?10 : 14;
  const plan=weekPlan(todayKey());
  const joursFes = plan.filter(p=>p.session && (p.session.muscles||[]).some(m=>m==='fes'||m==='moy'));
  const noms=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  let html='<div class="spread mb"><div><b>🍑 Fessiers — priorité absolue du programme</b>'+
    '<div class="small mut mt">Fréquence : <b>'+joursFes.length+' stimulations</b> cette semaine ('+joursFes.map(p=>noms[p.wk].slice(0,3)).join(', ')+
    '). Volume cible : <b>'+cible+' à '+(cible+6)+' séries</b> de fessiers par semaine en phase « '+esc((pos.phase.titre.split('—')[0]||'').trim())+' ».</div></div></div>';
  html+='<div class="grid g4">'+
    stat('Séries grand fessier', sf? sf.setsFes+' séries':'—')+
    stat('Séries moyen fessier', sf? sf.setsMoy+' séries':'—')+
    stat('Tonnage fessiers', sf&&sf.tonnage? Math.round(sf.tonnage/1000)+' t':'—')+
    stat('Hip thrust (1RM est.)', perfActuelle('hipthrust')? fmtKg(perfActuelle('hipthrust').v):'—')+'</div>';
  html+='<div class="ok-box mt">📈 <b>Progression appliquée aux fessiers ce cycle :</b> '+esc(pos.phase.progression||'')+'</div>';
  html+='<div class="note-box mt">⚠️ <b>Les charges n\'augmentent jamais automatiquement.</b> Le programme suit aussi la <b>sensation musculaire</b> et la <b>qualité d\'exécution</b> : si le RPE dépasse 9,5 ou si la contraction n\'est plus ressentie dans le fessier, la charge reste identique (ou baisse) jusqu\'à ce que le mouvement redevienne propre. C\'est ce qui évite de « tirer sur les ischios et les lombaires » au détriment du galbe.</div>';
  if(sf && sf.nSeancesFes===0){
    html+='<div class="warn-box mt">Aucune séance fessiers enregistrée cette semaine. Le galbe progresse avec 2 à 3 stimulations hebdomadaires : ne sautez pas J1 et J3.</div>';
  }
  if(sf && sf.setsTotal>0 && sf.setsTotal<cible){
    html+='<div class="warn-box mt">Volume fessier de '+sf.setsTotal+' séries pour une cible de '+cible+' : ajoutez 2 à 3 séries d\'abduction de hanche et de kickback — forte stimulation, faible fatigue.</div>';
  }
  el.innerHTML=html;
}

/* ---------- Bloc « plan abdominaux de la semaine » ---------- */
function renderEntAbs(){
  const el=$('#ent-abs'); if(!el) return;
  const pos=programPos(todayKey());
  const focus=absFocusSemaine(pos.weekGlobal);
  const nStim=nbStimAbs();
  const rm=moyenneRecup();
  const plan=weekPlan(todayKey());
  const noms=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  let html='<div class="spread mb"><div><span class="chip chip-gold">'+focus.ic+' Focus de la semaine : '+esc(focus.n)+'</span>'+
    '<div class="small mut mt">'+esc(focus.desc)+'</div></div>'+
    '<span class="chip '+(nStim>=4?'chip-green':nStim===3?'chip-blue':'chip-orange')+'">'+nStim+' stimulations recommandées</span></div>';
  html+='<div class="tbl-wrap"><table class="tbl"><tr><th>Jour</th><th>Séance</th><th>Travail abdominal prévu</th></tr>'+
    plan.map(p=>{
      if(!p.session) return '<tr><td class="b">'+noms[p.wk]+'</td><td class="mut">'+esc(p.label)+'</td><td class="mut">—</td></tr>';
      const absExos=(p.session.exos||[]).filter(e=>e[1]==='abs'||e[1]==='tra').map(e=>e[0]+' ('+e[2]+'×'+e[3]+')');
      return '<tr><td class="b">'+noms[p.wk]+'</td><td>'+esc(p.session.nom)+'</td><td>'+(absExos.length? '<span class="small">'+esc(absExos.join(' · '))+'</span>':'<span class="mut">—</span>')+'</td></tr>';
    }).join('')+'</table></div>';
  html+='<div class="grid g2 mt"><div><b class="small">🎯 Rotation hebdomadaire</b><ul style="padding-left:18px;color:var(--mut);font-size:13px;line-height:1.8">'+
    ABS_ROTATION.map(r=>'<li'+(r.n===focus.n?' style="color:var(--txt);font-weight:700"':'')+'>'+r.ic+' '+esc(r.n)+(r.n===focus.n?' ← cette semaine':'')+'</li>').join('')+'</ul></div>'+
    '<div><b class="small">🔥 Objectif ventre</b><ul style="padding-left:18px;color:var(--mut);font-size:13px;line-height:1.8">'+
    '<li>Ventre plat = <b>transverse entraîné</b> + <b>déficit calorique modéré</b>. Les abdominaux seuls ne font pas disparaître le gras.</li>'+
    '<li>Abdos légèrement visibles = grand droit entraîné en résistance + taux de masse grasse autour de 22-25 %.</li>'+
    '<li>Taille visuellement plus fine = obliques toniques <b>sans</b> épaississement : privilégiez gainage, Pallof press et dead bug aux flexions latérales chargées.</li>'+
    '<li>Pas de longues séances d\'abdominaux : 5 à 10 min en fin de séance suffisent, 3 à 4 fois par semaine.</li></ul></div></div>';
  if(rm!=null && rm<65) html+='<div class="warn-box mt">😴 Récupération à '+rm+'/100 : la recommandation descend à <b>'+nStim+' stimulations</b> cette semaine, avec un focus gainage léger plutôt qu\'un travail intense.</div>';
  el.innerHTML=html;
}

/* ================== HISTORIQUE DES SEMAINES & PROGRESSION DES CHARGES ================== */
function semaineLabel(wk){
  const mois = wk<48 ? (Math.floor(wk/4)+1) : 'F';
  return 'Semaine '+(wk+1)+'/52 · '+(mois==='F'?'Phase finale':('Mois '+mois));
}
function chargerJournalDate(d){
  const j=state.journal[d]||{exos:[]};
  return j.exos.filter(e=>e.ch!==''&&e.ch!=null);
}
function renderEntHist(){
  const el=$('#ent-hist'); if(!el) return;
  const p=state.profil;
  if(!p.date){ el.innerHTML=''; return; }
  const pos=programPos(todayKey());
  const cur=pos.weekGlobal;
  const wk = (state.ui&&state.ui.entHistWeek!=null)? state.ui.entHistWeek : cur;
  const lundi=addDays(parseDate(p.date), wk*7);
  let prevues=0, faites=0;
  let volume=0;
  const rows=[];
  for(let i=0;i<7;i++){
    const dd=dateKey(addDays(lundi,i));
    const plan=weekPlan(dd).find(x=>x.date===dd);
    const st=state.seances[dd];
    const jx=chargerJournalDate(dd);
    if(plan&&plan.type==='seance'){
      prevues++;
      if(st==='ok'||st==='partiel') faites++;
      jx.forEach(e=>{ if(e.reps&&e.se) volume+=e.ch*e.reps*e.se; });
    }
    let cellule='';
    if(plan&&plan.type==='seance'){
      const chip = st==='ok'?'<span class="chip chip-green">✅</span>':st==='partiel'?'<span class="chip chip-orange">🟡</span>':st==='non'?'<span class="chip chip-red">❌</span>':(dd===todayKey()?'<span class="chip chip-gold">auj.</span>':'<span class="chip chip-mut">—</span>');
      const exos=jx.length? '<div class="small" style="color:var(--mut)">'+jx.map(e=>'<b style="color:var(--txt)">'+esc(e.n)+'</b> : '+fmtNum(e.ch)+' kg × '+esc(e.reps||'—')+' séries '+(e.se||'—')+(e.rir!==''&&e.rir!=null?' · RIR '+e.rir:'')+(e.rpe!==''&&e.rpe!=null?' · RPE '+e.rpe:'')+(e.com?' · <i>'+esc(e.com)+'</i>':'')).join('<br>')+'</div>'
        : '<span class="small mut">Aucune charge enregistrée</span>';
      cellule='<td><div class="b">'+esc(plan.label)+'</div>'+exos+'</td><td class="center">'+chip+'</td>'+
        '<td class="center"><button class="btn btn-line btn-sm" onclick="openSession(\''+dd+'\')">'+(jx.length?'📝':'🏋️')+' '+(jx.length?'Rouvrir':'Faire')+'</button></td>';
    } else if(plan&&plan.type==='metcon'){
      const chipC = st==='ok'?'<span class="chip chip-green">✅</span>':st==='non'?'<span class="chip chip-red">❌</span>':'<span class="chip chip-mut">—</span>';
      if(plan.cardio && plan.cardio.format==='piscine'){
        cellule='<td><div class="b">'+esc(plan.label)+'</div><div class="small mut">Cardio piscine du programme — protocole précis dans la fiche</div></td><td class="center">'+chipC+'</td>'+
          '<td class="center"><button class="btn btn-line btn-sm" onclick="openPoolSession(\''+dd+'\')">🏊 Ouvrir</button></td>';
      } else if(plan.cardio && plan.cardio.format==='elliptique'){
        cellule='<td><div class="b">'+esc(plan.label)+'</div><div class="small mut">Zone '+esc(plan.cardio.zoneNom||'')+' — étapes précises dans la fiche</div></td><td class="center">'+chipC+'</td>'+
          '<td class="center"><button class="btn btn-line btn-sm" onclick="openCardioSession(\''+dd+'\')">🚴 Ouvrir</button></td>';
      } else {
        cellule='<td class="small mut">'+esc(plan.label||'Repos / récupération')+'</td><td class="center">'+chipC+'</td><td></td>';
      }
    } else if(plan&&plan.type==='piscine'){
      cellule='<td><div class="b">'+esc(plan.label)+'</div><div class="small mut">Jours piscine choisis — exercices et durée dans la fiche</div></td><td class="center">'+(st==='ok'?'<span class="chip chip-green">✅</span>':st==='non'?'<span class="chip chip-red">❌</span>':'<span class="chip chip-mut">—</span>')+'</td>'+
        '<td class="center"><button class="btn btn-line btn-sm" onclick="openPoolSession(\''+dd+'\')">🏊 Ouvrir</button></td>';
    } else {
      cellule='<td class="small mut">Repos / récupération</td><td></td><td></td>';
    }
    rows.push('<tr'+(dd===todayKey()?' style="background:rgba(255,111,174,.06)"':'')+'><td class="b">'+['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][new Date(dd).getDay()]+' '+fmtDateShort(dd)+'</td>'+cellule+'</tr>');
  }
  const chipStatut = wk<cur?'<span class="chip chip-mut">semaine passée</span>':wk===cur?'<span class="chip chip-gold">semaine en cours</span>':'<span class="chip chip-blue">à venir</span>';
  el.innerHTML =
    '<div class="card">'+
    '<div class="spread mb">'+
      '<div class="stepper">'+
        '<button class="btn btn-line" onclick="entHistNav(-1)">◀</button>'+
        '<b style="min-width:170px;text-align:center">'+semaineLabel(wk)+'</b>'+
        '<button class="btn btn-line" onclick="entHistNav(1)">▶</button>'+
      '</div>'+
      '<div class="flex">'+chipStatut+
        '<span class="chip chip-blue">'+faites+'/'+prevues+' séances</span>'+
        '<span class="chip chip-green">'+(volume?Math.round(volume/1000)+' t de volume':'—')+'</span>'+
        (wk!==cur?'<button class="btn btn-line btn-sm" onclick="entHistToday()">Aujourd\'hui</button>':'')+
      '</div>'+
    '</div>'+
    '<div class="tbl-wrap"><table class="tbl"><tr><th>Jour</th><th>Séance & charges enregistrées</th><th>Statut</th><th></th></tr>'+rows.join('')+'</table></div>'+
    '<div class="small mut mt">💡 Cliquez sur « Rouvrir » pour voir ou modifier les charges de cette séance — vos valeurs enregistrées s\'affichent exactement comme vous les aviez saisies.</div>'+
    '</div>';
}
function entHistNav(dir){
  if(!state.ui) state.ui={};
  const pos=programPos(todayKey());
  const cur=pos.weekGlobal;
  let wk=(state.ui.entHistWeek!=null)? state.ui.entHistWeek : cur;
  wk=clamp(wk+dir,0,51);
  state.ui.entHistWeek=wk;
  save(); renderEntrainement();
}
function entHistToday(){
  if(!state.ui) state.ui={};
  state.ui.entHistWeek=null;
  save(); renderEntrainement();
}
function renderEntProgress(){
  const el=$('#ent-progress'); if(!el) return;
  const p=state.profil;
  if(!p.date){ el.innerHTML='<div class="chart-empty">Complétez d\'abord le bilan de départ.</div>'; return; }
  // Regrouper les exercices journalisés par nom normalisé
  const map={};
  Object.keys(state.journal).forEach(d=>{
    (state.journal[d].exos||[]).forEach(e=>{
      if(e.ch===''||e.ch==null) return;
      const key=norm(e.n);
      if(!map[key]) map[key]={label:e.n, entries:[]};
      map[key].entries.push({
        date:d,
        ch:numOr(e.ch)??'', reps:numOr(e.reps)??'', se:numOr(e.se)??'',
        rir:numOr(e.rir)??'', rpe:numOr(e.rpe)??''
      });
    });
  });
  const keys=Object.keys(map).sort();
  if(!keys.length){
    el.innerHTML='<div class="chart-empty">Aucune charge enregistrée pour l\'instant. Renseignez vos séances (charges, reps, RIR, RPE) — la progression de chaque exercice apparaîtra ici automatiquement.</div>';
    return;
  }
  const cur=(state.ui&&state.ui.entProgExo)? state.ui.entProgExo : keys[0];
  const selKey = keys.includes(cur)? cur : keys[0];
  const exo=map[selKey];
  exo.entries.sort((a,b)=> a.date<b.date?-1:1);
  // Stats
  const chs=exo.entries.map(e=>e.ch).filter(v=>v>0);
  const chMax=chs.length?Math.max(...chs):null;
  const chFirst=chs.length?chs[0]:null;
  const chLast=chs.length?chs[chs.length-1]:null;
  const delta=(chFirst&&chLast&&chFirst>0)? Math.round((chLast/chFirst-1)*100) : null;
  // Récents (10 dernières entrées)
  const recentes=exo.entries.slice(-12).reverse();
  // Graphique : charge et 1RM estimé par date
  const labels=exo.entries.map(e=>fmtDateShort(e.date));
  const dataCh=exo.entries.map(e=>e.ch||null);
  const dataEst=exo.entries.map(e=>(e.ch&&e.reps&&e.reps>=1)? Math.round(e.ch*(1+e.reps/30)*10)/10 : null);
  el.innerHTML =
    '<div class="flex mb">'+
      '<label class="small mut" style="white-space:nowrap">Exercice :</label>'+
      '<select class="inp" style="flex:1;min-width:0" onchange="entProgSelect(this.value)">'+
        keys.map(k=>'<option value="'+esc(k)+'" '+(k===selKey?'selected':'')+'>'+esc(map[k].label)+' ('+map[k].entries.length+' séances)</option>').join('')+
      '</select>'+
    '</div>'+
    '<div class="grid g4 mb">'+
      '<div class="tile"><div class="t-lbl">Dernière charge</div><div class="t-val">'+(chLast?fmtNum(chLast)+' kg':'—')+'</div></div>'+
      '<div class="tile"><div class="t-lbl">Charge max</div><div class="t-val">'+(chMax?fmtNum(chMax)+' kg':'—')+'</div></div>'+
      '<div class="tile"><div class="t-lbl">Progression</div><div class="t-val '+(delta!=null?(delta>=0?'up':'down'):'mut')+'">'+(delta!=null?(delta>=0?'+':'')+delta+' %':'—')+'</div></div>'+
      '<div class="tile"><div class="t-lbl">Séances notées</div><div class="t-val">'+exo.entries.length+'</div></div>'+
    '</div>'+
    '<div class="chart-box"><canvas id="ent-prog-chart" class="chart"></canvas></div>'+
    '<div class="legend mt"><span><i style="background:#ff6fae"></i>Charge (kg)</span><span><i style="background:#2dd4a7"></i>1RM estimé (Epley)</span></div>'+
    '<div class="tbl-wrap mt"><table class="tbl"><tr><th>Date</th><th class="num">Charge</th><th class="num">Reps</th><th class="num">Séries</th><th class="num">RIR</th><th class="num">RPE</th></tr>'+
    recentes.map(e=>'<tr><td>'+fmtDateShort(e.date)+'</td><td class="num">'+(e.ch?fmtNum(e.ch)+' kg':'—')+'</td><td class="num">'+(e.reps||'—')+'</td><td class="num">'+(e.se||'—')+'</td><td class="num">'+(e.rir!==''&&e.rir!=null?e.rir:'—')+'</td><td class="num">'+(e.rpe!==''&&e.rpe!=null?e.rpe:'—')+'</td></tr>').join('')+
    '</table></div>'+
    (exo.entries.length>12?'<div class="small mut mt">Les 12 dernières séances sont affichées — le graphique couvre toutes les séances.</div>':'')+
    '<div class="note-box mt">📈 <b>Lecture de progression :</b> charge en hausse + RIR stable ou en baisse = progression solide. Charge identique + reps en hausse = double progression (valide aussi). Charge identique + RPE en hausse = limite atteinte, prêt à augmenter de +2,5 %.</div>';
  lineChart($('#ent-prog-chart'), labels, [
    {name:'Charge', color:'#ff6fae', data:dataCh},
    {name:'1RM est.', color:'#2dd4a7', data:dataEst}
  ], {unit:' kg', empty:'Pas encore de données pour cet exercice'});
}
function entProgSelect(k){
  if(!state.ui) state.ui={};
  state.ui.entProgExo=k;
  save(); renderEntProgress();
}
function stat(l,v){ return '<div class="tile"><div class="t-lbl">'+l+'</div><div class="small mut" style="margin-top:6px">'+esc(v)+'</div></div>'; }
function ouvrirPhase(ph){
  const m = ph==='F'? PROGRAM.finale : PROGRAM[ph];
  const keys=Object.keys(m.sessions||{});
  openModal('<h3>'+(ph==='F'?'🏆 Phase finale':('🗓️ Mois '+ph+' — '+esc(m.titre)))+'</h3>'+
    '<div class="flex"><span class="chip chip-blue">'+esc(m.schema)+'</span><span class="chip chip-gold">'+esc(m.intensite)+'</span><span class="chip chip-mut">'+esc(m.methode)+'</span></div>'+
    '<p class="small mut mt">'+esc(m.objectif)+'</p>'+
    '<p class="small mut">🎯 <b>Split :</b> '+esc(m.split||'—')+'</p>'+
    '<p class="small mut">🚴 <b>Cardio :</b> '+esc(m.metcon)+'</p>'+
    '<div class="mt">'+keys.map(k=>{
      const s=m.sessions[k];
      return '<div class="acc-item"><button class="acc-head" onclick="this.parentElement.classList.toggle(\'open\')"><span class="phase-num" style="font-size:13px">'+k+'</span><div class="ph-mid"><div class="ph-t">'+esc(s.nom)+'</div><div class="ph-s">'+s.exos.length+' exercices</div></div><span class="acc-arrow">▼</span></button><div class="acc-body"><div class="tbl-wrap"><table class="tbl"><tr><th>Exercice</th><th>Séries</th><th>Reps</th><th>Tempo</th><th>Repos</th></tr>'+
      s.exos.map((e,ei)=>'<tr><td><b>'+esc(e[0])+'</b> <button class="btn btn-line btn-sm demo-btn" style="padding:2px 8px;font-size:11px" data-exo="'+esc(e[0])+'">▶</button>'+(e[6]?'<div class="small mut">'+esc(e[6])+'</div>':'')+'</td><td>'+e[2]+'</td><td>'+esc(e[3])+'</td><td>'+e[4]+'</td><td>'+(e[5]? e[5]+' s':'—')+'</td></tr>').join('')+
      '</table></div></div></div>';
    }).join('')+'</div>'+
    (m.deload? '<div class="ok-box mt">🛌 Fin de phase : semaine 4 en deload.</div>':''));
}
/* Mot de l'entraîneur en début de séance : précise si les charges ont été
   recalculées et si le 1RM a été modifié d'après vos séances enregistrées. */
function coachMotSession(session, suggs){
  const nbSugg = suggs.filter(Boolean).length;
  if(!nbSugg){
    return {ic:'🏋️', txt:"Aucune charge suggérée pour le moment. Réalisez votre bilan 1RM (onglet Bilan 1RM) ou enregistrez vos premières séances : je calculerai alors automatiquement vos charges pour que les répétitions cibles restent faisables."};
  }
  const modifs=[]; let nbAuto=0, nbAdaptees=0, nbAllegees=0;
  session.exos.forEach((e,i)=>{
    const g=suggs[i];
    if(!g) return;
    if(g.auto1RM) nbAuto++;
    if(g.fromLast){ nbAdaptees++; if(g.lastCharge!=null && g.charge<g.lastCharge) nbAllegees++; }
    if(g.decl1RM!=null && g.exo1RM > g.decl1RM+0.01){
      modifs.push({nom:e[0], decl:g.decl1RM, auto:g.exo1RM, charge:g.charge, perHand:g.perHand});
    }
  });
  let txt;
  if(nbAdaptees){
    // Cas principal : les charges s'adaptent à votre dernière séance (jamais plus lourd
    // tant que les répétitions cibles ne sont pas atteintes).
    txt='J\'ai adapté vos charges à votre dernière séance : ';
    if(nbAllegees) txt+=nbAllegees+' exercice(s) allégé(s) car vous n\'aviez pas atteint les répétitions cibles. ';
    else txt+='aucune augmentation tant que vous n\'aurez pas atteint le haut de la fourchette de répétitions. ';
    if(modifs.length) txt+='1RM mis à jour d\'après vos séances : '+modifs.map(m=>'« '+m.nom+' » '+fmtNum(m.decl)+' → '+fmtNum(m.auto)+' kg').join(' ')+'. ';
    txt+='Progression en double : d\'abord gagner des répétitions à charge égale, ensuite augmenter la charge (+2,5 %).';
  } else if(modifs.length){
    txt='J\'ai recalculé vos charges d\'après vos dernières séances. 1RM modifiés : '+modifs.map(m=>'« '+m.nom+' » '+fmtNum(m.decl)+' kg → '+fmtNum(m.auto)+' kg (auto), charge proposée ≈ '+fmtNum(m.charge)+(m.perHand?' kg/côté':' kg')+'.').join(' ')+' Les répétitions cibles restent faisables avec un RIR 1-2.';
  } else if(nbAuto>0){
    txt='Vos charges ont été calculées à partir de vos séances enregistrées ('+nbAuto+' exercices) : 1RM automatique, charges ajustées pour atteindre les répétitions cibles avec un RIR 1-2.';
  } else {
    txt='Charges basées sur votre bilan 1RM : rien à modifier aujourd\'hui. Visez les répétitions cibles avec un RIR 1-2 — dès que vos performances dépasseront le 1RM déclaré, je recalculerai tout automatiquement.';
  }
  return {ic:'🏋️', txt};
}
function openSession(date, key){
  const pos=programPos(date);
  const phase=pos.phase;
  if(pos.deload && !key) key = Object.keys(phase.sessions||{})[0];
  const plan=weekPlan(date).find(p=>p.date===date);
  key = key || (plan&&plan.key) || Object.keys(phase.sessions||{})[0];
  if(!key||!phase.sessions||!phase.sessions[key]){ toast('⚠️ Séance introuvable'); return; }
  const s=phase.sessions[key];
  curSession={date,key};
  const j=state.journal[date]||{exos:[]};
  const byNom={}; (j.exos||[]).forEach(e=>byNom[e.n]=e);
  const deload=pos.deload;
  const mult = deload? 0.5 : 1;
  // Suggestions de charge selon le bilan 1RM
  const suggs = s.exos.map(e=>chargeSuggestion(e[0], e[1], e[3], pos));
  const nSugg = suggs.filter(Boolean).length;
  // Échauffement & étirements
  const ech = echauffementPour(s);
  const etirs = etirementsPour(s.muscles);
  const prep = prepEtat(date);
  function prepBlock(){
    const fait = prep.ech;
    return '<div class="acc-item '+(fait?'':'open')+'" style="border-color:rgba(255,159,67,.45)">'+
      '<button class="acc-head" onclick="this.parentElement.classList.toggle(\'open\')">'+
      '<span class="phase-num" style="font-size:15px;background:linear-gradient(135deg,#ff9f43,#c084fc);color:#2b0a1c">🔥</span>'+
      '<div class="ph-mid"><div class="ph-t">Échauffement — à faire AVANT</div><div class="ph-s">'+ECHAUFFEMENT.duree+' · '+(ech.etapes.length+1)+' étapes</div></div>'+
      (fait? '<span class="chip chip-green">✓ fait</span>':'<span class="chip chip-orange">à faire</span>')+
      '<span class="acc-arrow">▼</span></button>'+
      '<div class="acc-body">'+
      ech.etapes.map((e,i)=>prepStep(i+1, e)).join('')+
      prepStep(ech.etapes.length+1, ech.activation)+
      '<label class="checkrow mt"><input type="checkbox" '+(fait?'checked':'')+' onchange="togglePrep(\''+date+'\',\'ech\',this.checked)"> <b>✅ J\'ai fait mon échauffement complet</b></label>'+
      '</div></div>';
  }
  function cardioBlock(){
    const c = s.cardio; if(!c) return '';
    const t = CARDIO_TYPES[c.apres]||CARDIO_TYPES.elliptique;
    const rec = state.cardio[date];
    const choix = state.cardioChoix[date] || c.apres;
    const z = rec&&rec.rpe>=8 ? ZONES_CARDIO[2] : ZONES_CARDIO[1];
    return '<div class="acc-item" style="border-color:rgba(58,160,255,.4)">'+
      '<button class="acc-head" onclick="this.parentElement.classList.toggle(\'open\')">'+
      '<span class="phase-num" style="font-size:15px;background:linear-gradient(135deg,#3aa0ff,#a78bfa);color:#04121f">'+t.ic+'</span>'+
      '<div class="ph-mid"><div class="ph-t">🚴 Cardio de fin de séance — '+c.duree+' min</div>'+
      '<div class="ph-s">'+esc(t.n)+' · zone '+esc(z.n)+' ('+Math.round(fcm()*z.pct[0])+'-'+Math.round(fcm()*z.pct[1])+' bpm)</div></div>'+
      (rec? '<span class="chip chip-green">✓ '+rec.duree+' min</span>':'<span class="chip chip-mut">optionnel</span>')+
      '<span class="acc-arrow">▼</span></button>'+
      '<div class="acc-body">'+
      '<p class="prep-p">'+esc(c.detail)+'</p>'+
      '<div class="small mut mb">Choisissez votre support selon votre récupération :</div>'+
      '<div class="flex mb">'+Object.keys(CARDIO_TYPES).map(k=>
        '<button class="btn btn-line btn-sm" style="'+(choix===k?'border-color:var(--acc);color:var(--acc)':'')+'" onclick="setCardioChoix(\''+date+'\',\''+k+'\')">'+CARDIO_TYPES[k].ic+' '+CARDIO_TYPES[k].n+'</button>').join('')+'</div>'+
      '<button class="btn btn-line btn-block" onclick="closeModal();openCardioLog(\''+date+'\')">📝 '+(rec?'Modifier mon cardio':'Enregistrer mon cardio')+'</button>'+
      (choix==='piscine' ? '<button class="btn btn-grad btn-block mt" onclick="closeModal();go(\'v-piscine\')">🏊 Lancer un protocole piscine (minuteur)</button>'
      : choix==='elliptique' ? '<button class="btn btn-line btn-block mt" onclick="openCardioSession(\''+date+'\')">🚴 Fiche cardio elliptique (étapes + minuteur)</button>' : '')+
      '</div></div>';
  }
  function etirBlock(){
    const fait = prep.etir;
    return '<div class="acc-item '+(fait?'':'open')+'" style="border-color:rgba(45,212,167,.4)">'+
      '<button class="acc-head" onclick="this.parentElement.classList.toggle(\'open\')">'+
      '<span class="phase-num" style="font-size:15px;background:linear-gradient(135deg,#2dd4a7,#16a34a);color:#fff">🧘</span>'+
      '<div class="ph-mid"><div class="ph-t">Retour au calme — étirements APRÈS</div><div class="ph-s">'+ETIREMENTS.duree+' · '+etirs.reduce((a,g)=>a+g.exos.length,0)+' exercices sur '+(etirs.length||'—')+' groupes</div></div>'+
      (fait? '<span class="chip chip-green">✓ fait</span>':'<span class="chip chip-mut">à faire</span>')+
      '<span class="acc-arrow">▼</span></button>'+
      '<div class="acc-body">'+
      '<div class="note-box mb">'+esc(ETIREMENTS.consigne)+'</div>'+
      (etirs.length? etirs.map(g=>'<div class="prep-grp"><span class="grp-t">'+esc(g.nom)+'</span>'+g.exos.map(ex=>prepStep(-1,{nom:ex[1],temps:ex[2],quoi:ex[3],ic:ex[0]})).join('')+'</div>').join(''):'<div class="small mut">—</div>')+
      '<label class="checkrow mt"><input type="checkbox" '+(fait?'checked':'')+' onchange="togglePrep(\''+date+'\',\'etir\',this.checked)"> <b>✅ J\'ai fait mes étirements</b></label>'+
      '</div></div>';
  }
  function prepStep(i, e){
    return '<div class="prep-step"><div class="prep-h">'+(i>0?'<span class="prep-n">'+i+'</span>':'')+'<span class="prep-ic">'+e.ic+'</span><b>'+esc(e.nom)+'</b><span class="chip chip-mut" style="margin-left:auto">'+esc(e.temps)+'</span></div>'+
      '<p class="prep-p">'+esc(e.quoi).replace(/\n/g,'<br>')+'</p></div>';
  }
  openModal('<h3>🏋️ '+(deload?'[DELOAD] ':'')+esc(s.nom)+' <span class="small mut">— '+fmtDateFr(date)+'</span></h3>'+
    '<div class="small mut mb">Mois '+(pos.idx==='F'?'finale':pos.idx)+' · '+esc(phase.titre)+' · Tempo 3010 = 3 s descente / 0 s / 1 s montée / 0 s</div>'+
    ((s.muscles||[]).some(m=>m==='fes'||m==='moy') ? '<div class="ok-box mb" style="padding:8px 12px">🍑 <b>Séance fessiers :</b> commencez toujours par l\'activation (ponts + clamshells + abductions). Cherchez la <b>contraction</b> avant la charge : 1 à 2 s de pause en haut de chaque hip thrust, tibias verticaux, menton rentré, côtes basses. Ne montez la charge que si la technique et la sensation restent parfaites.</div>':'')+
    ((s.muscles||[]).includes('qua') && !(s.muscles||[]).includes('pec') ? '<div class="note-box mb" style="padding:8px 12px">🦵 <b>Quadriceps volontairement contrôlés :</b> gardez les charges de squat modérées. L\'objectif est le galbe des fessiers, pas un développement disproportionné des cuisses. Privilégiez la profondeur et le buste droit.</div>':'')+
    '<div class="coach-mot">'+
      '<div class="cm-ic">🏋️</div>'+
      '<div class="cm-txt"><b>Mot de l\'entraîneur</b><p>'+esc(coachMotSession(s, suggs).txt)+'</p></div>'+
    '</div>'+
    (nSugg? '<div class="ok-box mb" style="padding:8px 12px">⚡ <b>'+nSugg+' charges pré-remplies</b> — recalculées automatiquement à partir de votre bilan 1RM et de <b>vos séances enregistrées</b> (1RM auto). Elles visent à rendre les reps cibles réalisables avec un RIR 1-2 : ajustez à votre ressenti.</div>':'')+
    prepBlock()+
    '<div class="flex mb"><label class="chip chip-mut" style="cursor:pointer"><input type="radio" name="st-'+date+'" value="ok"'+(j.statut==='ok'?' checked':'')+' onchange="saveSessionStatut(this.value)"> ✅ Terminée</label>'+
    '<label class="chip chip-mut" style="cursor:pointer"><input type="radio" name="st-'+date+'" value="partiel"'+(j.statut==='partiel'?' checked':'')+' onchange="saveSessionStatut(this.value)"> 🟡 Partielle</label>'+
    '<label class="chip chip-mut" style="cursor:pointer"><input type="radio" name="st-'+date+'" value="non"'+(j.statut==='non'?' checked':'')+' onchange="saveSessionStatut(this.value)"> ❌ Non effectuée</label></div>'+
    '<div class="small mut mb" style="margin-top:-6px">💡 Modifiez charges, RIR et RPE : <b>tout est enregistré automatiquement</b> (à la frappe et à chaque validation). La fiche <b>reste ouverte</b> : complétez les autres exercices, puis « 💾 Enregistrer la séance » en bas pour fermer.</div>'+
    '<div class="journal-row" style="font-size:10.5px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--mut)"><span>Exercice</span><span>Charge kg</span><span>Reps</span><span>Séries</span><span>RIR</span><span>RPE</span><span class="hide-m">Note</span></div>'+
    s.exos.map((e,i)=>{
      const prev=byNom[e[0]];
      const sugg=suggs[i];
      const setsU = e[2]===1? 1 : Math.round(parseFloat(String(e[2]).split('/')[0]||e[2])*mult);
      const valCh = (prev&&prev.ch!==''&&prev.ch!=null) ? prev.ch : (sugg? sugg.charge : '');
      const valOf = k => (prev&&prev[k]!==''&&prev[k]!=null)? prev[k] : '';
      const hint = (sugg && !(prev&&prev.ch))
        ? ' · ≈ '+fmtNum(sugg.charge)+' kg'+(sugg.perHand?' / haltère':'')+' · '+sugg.pct+' % 1RM'+
          (sugg.auto1RM?' (auto — vos séances)':'')+
          (sugg.fromLast? ' · adaptée de votre dernière séance ('+fmtNum(sugg.lastCharge)+' kg)':'')
        : '';
      return '<div class="journal-row exo-row">'+
        '<span><b class="small">'+esc(e[0])+'</b> <button class="btn btn-line btn-sm demo-btn" style="padding:2px 8px;font-size:11px" data-exo="'+esc(e[0])+'">▶</button><div class="tiny mut">'+(e[2]+' × '+esc(e[3])+(e[5]?' · '+e[5]+'s':'')+(deload?' · 50% vol':'')+hint)+'</div></span>'+
        '<input class="inp" type="tel" inputmode="decimal" step="0.5" placeholder="kg" data-f="ch" value="'+valCh+'">'+
        '<input class="inp" type="tel" inputmode="decimal" placeholder="rep" data-f="reps" value="'+valOf('reps')+'">'+
        '<input class="inp" type="tel" inputmode="decimal" placeholder="séries" data-f="se" value="'+(prev&&prev.se!==''&&prev.se!=null?prev.se:setsU)+'">'+
        '<input class="inp" type="tel" inputmode="decimal" min="0" max="5" placeholder="RIR" data-f="rir" value="'+valOf('rir')+'">'+
        '<input class="inp" type="tel" inputmode="decimal" min="1" max="10" placeholder="RPE" data-f="rpe" value="'+valOf('rpe')+'">'+
        '<input class="inp hide-m" placeholder="commentaire" data-f="com" value="'+valOf('com')+'">'+
        '</div>';
    }).join('')+
    cardioBlock()+
    etirBlock()+
    '<button class="btn btn-grad btn-block mt" onclick="saveSession()">💾 Enregistrer la séance</button>');
}
function saveSessionStatut(v){
  const d=curSession && curSession.date;
  if(!d){ toast('⚠️ Aucune séance en cours'); return; }
  // Capte TOUTES les valeurs saisies (charges modifiées, RIR, RPE, notes) avant d'enregistrer le statut
  const exos=readSessionInputs().filter(e=>e.ch!==''||e.reps!==''||e.se!==''||e.rir!==''||e.rpe!==''||e.com);
  const j=Object.assign({}, state.journal[d]||{}, {exos, statut:v});
  state.journal[d]=j;
  state.seances[d]=v;
  save(); checkBadges();
  renderCurrent();
  const lib={ok:'terminée ✅',partiel:'partielle 🟡',non:'non effectuée ❌'};
  // La fiche reste ouverte : on peut continuer à compléter les autres exercices,
  // puis fermer avec « 💾 Enregistrer la séance » en bas de fiche.
  toast('✅ Séance '+(lib[v]||v)+' enregistrée — continuez ou fermez la fiche');
}
function readSessionInputs(){
  const rows=$$('#modal-root .journal-row.exo-row');
  return rows.map(r=>{
    const get=k=>{ const el=r.querySelector('[data-f="'+k+'"]'); return el? el.value:''; };
    const n=r.querySelector('b')? r.querySelector('b').textContent:'';
    const nv=val=>{ const x=numOr(val); return x==null?'':x; };
    return {n, ch:nv(get('ch')), reps:nv(get('reps')), se:nv(get('se')), rir:nv(get('rir')), rpe:nv(get('rpe')), com:get('com')};
  });
}
function saveSession(){
  const rows=$$('#modal-root .journal-row.exo-row');
  const exos=readSessionInputs().filter(e=>e.ch!==''||e.reps!==''||e.se!==''||e.rir!==''||e.rpe!==''||e.com);
  const fait = exos.filter(e=>e.ch!=='').length;
  const prep = prepEtat(curSession.date);
  // si l'échauffement ou les étirements sont faits mais aucune charge notée → séance partielle
  let statut;
  if(fait===0) statut = (prep.ech||prep.etir)? 'partiel' : 'non';
  else statut = fait===rows.length? 'ok':'partiel';
  const j=Object.assign({}, state.journal[curSession.date]||{}, {exos});
  if(!j.statut) j.statut=statut;
  state.journal[curSession.date]=j;
  state.seances[curSession.date]=j.statut;
  // METCON éventuel
  save(); checkBadges();
  const prs=Object.keys(MAIN_LIFTS).filter(k=>perfSerie(k));
  closeModal(); renderCurrent();
  toast('✅ Séance enregistrée'+(prs.length?' — '+prs.length+' records suivis':''));
}
function setSeanceStatus(date, v){ state.seances[date]=v; const j=state.journal[date]||{exos:[]}; j.statut=v; state.journal[date]=j; save(); checkBadges(); renderCurrent(); }

/* ================== NUTRITION ================== */
function renderNutrition(){
  const p=state.profil;
  if(!p.date||!p.poidsDepart){ $('#nut-summary').innerHTML='<div class="card"><div class="spread"><div><b>Complétez d\'abord le bilan de départ</b><div class="small mut">Les besoins caloriques sont calculés à partir de votre âge, taille, poids et activité.</div></div><button class="btn btn-grad" onclick="go(\'v-profil\')">👤 Profil</button></div></div>'; return; }
  const c=caloriesCibles();
  if(!c){ $('#nut-summary').innerHTML=''; return; }
  $('#nut-summary').innerHTML =
    '<div class="macro-grid">'+
    '<div class="macro-tile kcal"><b>'+c.cal+'</b><span>kcal / jour</span></div>'+
    '<div class="macro-tile"><b style="color:var(--grn)">'+c.prot+' g</b><span>Protéines</span></div>'+
    '<div class="macro-tile"><b style="color:var(--blu)">'+c.glu+' g</b><span>Glucides</span></div>'+
    '<div class="macro-tile"><b style="color:var(--org)">'+c.lip+' g</b><span>Lipides</span></div>'+
    '</div>'+
    '<div class="grid g4 mt">'+
      '<div class="tile"><div class="t-lbl">Dépense estimée (TDEE)</div><div class="t-val">'+c.tdee+'</div><div class="t-delta mut">kcal / jour</div></div>'+
      '<div class="tile"><div class="t-lbl">Protéines</div><div class="t-val">'+(c.prot/(+p.poidsDepart)).toFixed(1)+' g</div><div class="t-delta mut">par kg de poids</div></div>'+
      '<div class="tile"><div class="t-lbl">Répartition</div><div class="t-val small" style="font-size:15px">'+(c.prot*4/c.cal*100).toFixed(0)+' / '+(c.glu*4/c.cal*100).toFixed(0)+' / '+(c.lip*9/c.cal*100).toFixed(0)+'</div><div class="t-delta mut">P / G / L en %</div></div>'+
      '<div class="tile"><div class="t-lbl">Stratégie conseillée</div><div class="t-val" style="font-size:17px">'+nutriPhaseInfo().ic+' '+nutriPhaseInfo().n+'</div><div class="t-delta mut">selon vos objectifs</div></div>'+
    '</div>';
  // phases
  $('#nut-phases').innerHTML = Object.entries({maintien:['⚖️','Maintien'],surplus:['📈','Surplus'],deficit:['📉','Déficit'],recomp:['♻️','Recomposition']}).map(([k,[ic,n]])=>
    '<label><input type="radio" name="nut-phase" value="'+k+'" '+(state.nutri.phase===k?'checked':'')+' onchange="changePhase(\''+k+'\')"><span>'+ic+' '+n+'</span></label>').join('');
  $('#nut-strategy-info').innerHTML = '<div class="note-box">'+nutriPhaseInfo().desc+'</div>';
  // ajustement
  const aj=ajustementAuto();
  $('#nut-adjust').innerHTML = '<span class="chip '+(aj.delta?'chip-orange':'chip-green')+'">'+(aj.msg?aj.msg:'—')+'</span>';
  // Repas jour par jour (aperçu du jour + renvoi vers l'onglet Repas)
  const pos=programPos(todayKey());
  const moisActuel = (pos.idx==='F'?13:+pos.idx)||1;
  const mois = moisActuel;
  $('#nut-plan-label').textContent = 'Mois '+(mois===13?'13 (finale)':mois)+' — le nutritionniste varie vos menus chaque jour';
  const jourIdx=parseInt(todayKey().slice(-2),10)||1;
  const gp=genererPlanJour(mois, jourIdx);
  if(gp){
    $('#nut-plan').innerHTML =
      '<div class="card">'+
      '<div class="spread mb"><div><b>🍽️ Votre repas d\'aujourd\'hui</b><div class="small mut">'+fmtDateFr(todayKey())+' · menu n°'+((jourIdx%3)+1)+' de la rotation</div></div>'+
      '<span class="chip chip-gold">'+gp.cible.cal+' kcal cibles</span></div>'+
      '<div class="tbl-wrap"><table class="tbl"><tr><th>Repas</th><th>Contenu</th><th class="num">kcal</th><th class="num">Prot</th><th class="num">Gluc</th><th class="num">Lip</th></tr>'+
      gp.plan.map(m=>'<tr><td class="b">'+esc(m.nom)+'</td><td class="small">'+(m.rows.length? m.rows.map(r=>esc(r.nom)+' <b>'+r.qte+' g</b>').join(' · '):'<span class="mut">—</span>')+'</td><td class="num">'+m.total.cal+'</td><td class="num">'+m.total.p+'</td><td class="num">'+m.total.g+'</td><td class="num">'+m.total.l+'</td></tr>').join('')+
      '<tr style="background:rgba(255,111,174,.06)"><td class="b gold">TOTAL</td><td class="small mut">vs cible : '+gp.cible.cal+' kcal · '+gp.cible.p+' g P · '+gp.cible.g+' g G · '+gp.cible.l+' g L</td><td class="num gold"><b>'+gp.final.cal+'</b></td><td class="num gold"><b>'+gp.final.p+'</b></td><td class="num gold"><b>'+gp.final.g+'</b></td><td class="num gold"><b>'+gp.final.l+'</b></td></tr>'+
      '</table></div>'+
      '<div class="flex mt"><button class="btn btn-grad" onclick="go(\'v-repas\')">📅 Voir le repas jour par jour</button>'+
      '<span class="small mut">Le nutritionniste propose un menu différent chaque jour (3 rotations), consultable dans l\'onglet « Repas ».</span></div>'+
      '</div>';
  }
  // journal alimentaire
  const jour=$('#nut-jour')?$('#nut-jour').value:todayKey();
  const entries=state.nutri.journal[jour]||[];
  $('#nut-journal').innerHTML =
    '<div class="flex mb"><label class="small mut">Date :</label><input class="inp" type="date" id="nut-jour" value="'+jour+'" style="width:170px" onchange="renderNutrition()">'+
    '<span class="chip chip-blue">'+entries.length+' aliment'+(entries.length>1?'s':'')+'</span></div>'+
    (entries.length? '<div class="tbl-wrap"><table class="tbl"><tr><th>Repas</th><th>Aliment</th><th class="num">Qté</th><th class="num">kcal</th><th class="num">P</th><th class="num">G</th><th class="num">L</th><th></th></tr>'+
      entries.map((e,i)=>'<tr><td>'+esc(e.repas)+'</td><td>'+esc(e.aliment)+'</td><td class="num">'+e.qte+' g</td><td class="num">'+Math.round(e.cal)+'</td><td class="num">'+round1(e.p)+'</td><td class="num">'+Math.round(e.g)+'</td><td class="num">'+round1(e.l)+'</td><td><button class="btn btn-red btn-sm" onclick="delFood('+i+')">✕</button></td></tr>').join('')+
    '</table></div>':'<div class="chart-empty">Journal vide aujourd\'hui — ajoutez vos aliments pour suivre votre adhérence.</div>');
  const tot=entries.reduce((a,b)=>({cal:a.cal+b.cal,p:a.p+b.p,g:a.g+b.g,l:a.l+b.l}),{cal:0,p:0,g:0,l:0});
  $('#nut-journal-totals').innerHTML = [
    ['Kcal',tot.cal,c.cal,'kcal'],['Protéines',round1(tot.p),c.prot,'g'],['Glucides',Math.round(tot.g),c.glu,'g'],['Lipides',round1(tot.l),c.lip,'g']
  ].map(([n,v,cb,u])=>'<div class="macro-tile"><b style="color:'+(v>=cb?'var(--grn)':'var(--txt)')+'">'+v+' '+u+'</b><span>'+n+' / cible '+cb+' '+u+'</span></div>').join('');
}
window._planMois=1;
function selectMoisPlan(dir){
  let m = (window._planMois||1)+dir;
  m = clamp(m,1,13);
  window._planMois=m;
  renderNutrition();
}
function changePhase(ph){
  state.nutri.phase=ph; save();
  // recommandation d'ajustement
  if(ph==='deficit') state.nutri.ajustement = state.objectifs.principal==='seche'? -Math.round((caloriesCibles().tdee)*0.15):0;
  renderCurrent(); toast('🥗 Phase nutritionnelle : '+nutriPhaseInfo().n);
}
function saveNutri(){
  state.nutri.auto=$('#nut-auto').checked; save();
}
function openFoodModal(){
  openModal('<h3>🍽️ Ajouter un aliment</h3>'+
    '<div class="field"><label>Repas</label><select class="inp" id="f-repas"><option>Petit-déjeuner</option><option>Collation</option><option>Déjeuner</option><option>Goûter</option><option>Dîner</option><option>Post-entraînement</option></select></div>'+
    '<div class="field"><label>Aliment</label><select class="inp" id="f-aliment">'+Object.keys(ALIMENTS).map(a=>'<option>'+esc(a)+'</option>').join('')+'</select></div>'+
    '<div class="field"><label>Quantité (g)</label><input class="inp" type="tel" inputmode="decimal" id="f-qte" value="100"></div>'+
    '<button class="btn btn-grad btn-block" onclick="addFood()">➕ Ajouter</button>');
}
function addFood(){
  const jour=$('#nut-jour')?$('#nut-jour').value:todayKey();
  const repas=$('#f-repas').value, aliment=$('#f-aliment').value, qte=numOr($('#f-qte').value);
  if(!aliment||!qte){ toast('⚠️ Renseignez aliment et quantité'); return; }
  const A=ALIMENTS[aliment];
  state.nutri.journal[jour] = state.nutri.journal[jour]||[];
  state.nutri.journal[jour].push({repas,aliment,qte,cal:A.cal*qte/100,p:A.p*qte/100,g:A.g*qte/100,l:A.l*qte/100});
  save(); closeModal(); renderCurrent(); toast('✅ Aliment ajouté');
}
function delFood(i){
  const jour=$('#nut-jour')?$('#nut-jour').value:todayKey();
  state.nutri.journal[jour].splice(i,1);
  if(!state.nutri.journal[jour].length) delete state.nutri.journal[jour];
  save(); renderCurrent();
}

/* ================== RÉCUPÉRATION ================== */
function renderRecuperation(){
  const today=state.recup[todayKey()];
  const sc=recupScore(today);
  $('#gauge-recovery').innerHTML = gaugeSVG(sc==null?0:sc, null, 'SUR 100');
  const st=recupStatus(sc);
  $('#rec-score-status').innerHTML = sc==null? '<span class="chip chip-mut">Faites le check-in ci-contre</span>' : '<span class="chip '+st.cls+'">'+st.txt+'</span>';
  $('#rec-date-chip').textContent = fmtDateFr(todayKey());
  if(today){
    $('#r-h').value=today.h||''; ['qual','fa','str','cour','mot','en'].forEach(k=>{ const el=$('#r-'+k); if(el){ el.value=today[k]||3; $('#r-'+k+'-v').textContent=today[k]||3; } });
  }
  // historique 7 jours
  const days=[];
  for(let i=6;i>=0;i--){ days.push(dateKey(addDays(new Date(),-i))); }
  $('#rec-history').innerHTML='<div class="tbl-wrap"><table class="tbl"><tr><th>Jour</th><th>Sommeil</th><th>Qualité</th><th>Fatigue</th><th>Stress</th><th>Courb.</th><th>Score</th></tr>'+
    days.map(d=>{
      const e=state.recup[d]; const s=recupScore(e);
      return '<tr><td class="b">'+(d===todayKey()?'Aujourd\'hui':fmtDateShort(d))+'</td><td>'+(e? e.h+' h':'—')+'</td><td>'+(e?e.qual:'—')+'</td><td>'+(e?e.fa:'—')+'</td><td>'+(e?e.str:'—')+'</td><td>'+(e?e.cour:'—')+'</td><td class="num">'+(s!=null?'<b style="color:'+(s>=65?'var(--grn)':s>=50?'var(--org)':'var(--red)')+'">'+s+'</b>':'—')+'</td></tr>';
    }).join('')+'</table></div>';
  // charts 30 jours
  const days30=[];
  for(let i=29;i>=0;i--){ days30.push(dateKey(addDays(new Date(),-i))); }
  const som=days30.map(d=>state.recup[d]? +state.recup[d].h:null);
  lineChart($('#chart-sommeil'), days30.map(fmtDateShort), [{name:'Sommeil',color:'#3aa0ff',data:som}], {unit:' h', empty:'Renseignez vos heures de sommeil chaque jour'});
  const sco=days30.map(d=>recupScore(state.recup[d]));
  lineChart($('#chart-recovery'), days30.map(fmtDateShort), [{name:'Récupération',color:'#2dd4a7',data:sco}], {unit:'', empty:'Aucun score pour l\'instant'});
  // conseils santé
  const rm=moyenneRecup();
  const recups=Object.values(state.recup);
  const hm=recups.length? recups.reduce((a,b)=>a+(+b.h||0),0)/recups.length:null;
  let adv='';
  if(hm==null) adv='<div class="small mut">Complétez vos check-ins quotidiens : le programme analysera votre sommeil et votre fatigue pour adapter le volume d\'entraînement.</div>';
  else{
    adv='<div class="small mut">Votre sommeil moyen : <b class="gold">'+round1(hm)+' h</b> — objectif 7 h 30 à 9 h. '+(hm<7?'<span class="warn">Sous 7 h, la synthèse protéique est réduite : priorisez le coucher.</span>':'Excellent niveau.')+'</div>';
    if(rm!=null&&rm<50) adv+='<div class="danger-box mt">⚠️ Récupération moyenne faible ('+rm+'/100) : le préparateur mental recommande une semaine de deload ou 1 séance en moins cette semaine. N\'hésitez pas à passer la séance d\'aujourd\'hui en « non effectuée » et à marcher 30 min.</div>';
  }
  $('#rec-health-advice').innerHTML=adv;
}
function saveRecup(){
  const val=n=>numOr($('#r-'+n).value);
  state.recup[todayKey()]={h:val('h')||0,qual:+$('#r-qual').value,fa:+$('#r-fa').value,str:+$('#r-str').value,cour:+$('#r-cour').value,mot:+$('#r-mot').value,en:+$('#r-en').value};
  save(); checkBadges(); renderCurrent();
  const sc=recupScore(state.recup[todayKey()]);
  const st=recupStatus(sc);
  toast('😴 Score du jour : '+sc+'/100 — '+st.txt.split(' —')[0]);
}
function bindRanges(){
  ['qual','fa','str','cour','mot','en'].forEach(k=>{
    const el=$('#r-'+k); if(el) el.addEventListener('input',()=>{ $('#r-'+k+'-v').textContent=el.value; });
  });
}

/* ================== PROGRESSION ================== */
function renderProgression(){
  const prs=Object.keys(MAIN_LIFTS).map(k=>perfSerie(k));
  const prCount=prs.filter(Boolean).length;
  const vol=Object.values(volumeHebdo());
  const volTot=vol.reduce((a,b)=>a+b,0);
  const sp=scorePerformance();
  const d=deltasMensurations();
  const tailDelta = d&&d.taille? ((d.taille.d>0?'+':'')+d.taille.d+' cm') : '—';
  const fesDelta  = d&&d.fessiers? ((d.fessiers.d>0?'+':'')+d.fessiers.d+' cm') : '—';
  const idx=indiceTransformation();
  $('#prog-tiles').innerHTML = [
    tile('🎯','Records personnels', prCount>0? prCount+' / '+Object.keys(MAIN_LIFTS).length+' suivis':'—', 'hip thrust · squat · SDT roumain · bulgarian · rowing','gold'),
    tile('🏋️','Volume total', volTot>0? Math.round(volTot/1000)+' t':'—', vol.length+' semaines suivies','up'),
    tile('🍑','Tour de fessiers', fesDelta, 'depuis le Jour 0','up'),
    tile('🔥','Tour de taille', tailDelta, 'depuis le Jour 0','up')
  ].join('');
  // graphiques lift
  const COULEURS={hipthrust:'#ff6fae', rdl:'#c084fc', squat:'#2dd4a7', bulgarian:'#3aa0ff', row:'#ff9f43'};
  Object.keys(MAIN_LIFTS).forEach(k=>{
    const h=perfHistorique(k);
    lineChart($('#chart-'+k), h.map(x=>fmtDateShort(x.date)), [{name:MAIN_LIFTS[k].n, color:COULEURS[k]||'#ff6fae', data:h.map(x=>x.v)}], {unit:' kg (1RM est.)', empty:'Journalisez des séances de '+MAIN_LIFTS[k].n+' pour suivre votre record.'});
  });
  // évolution comparée, base 100
  (function(){
    const cv=$('#chart-norm'); if(!cv) return;
    const keys=Object.keys(MAIN_LIFTS);
    const dates=unionDates(keys);
    if(!dates.length){ drawEmpty(cv,'Journalisez vos séances pour comparer l\'évolution de vos 5 mouvements.'); return; }
    const ser=keys.map(k=>{
      const base=(perfHistorique(k)[0]||{}).v;
      return {name:MAIN_LIFTS[k].n, color:COULEURS[k]||'#ff6fae',
              data:dates.map(dd=>{ const v=pointAt(k,dd); return (v&&base)? Math.round(v/base*100) : null; })};
    });
    lineChart(cv, dates.map(fmtDateShort), ser, {unit:'', empty:'Journalisez vos séances'});
  })();
  // volume bar
  const vh=volumeHebdo();
  const keysW=Object.keys(vh).map(Number).sort((a,b)=>a-b);
  const labs=[]; const vals=[];
  for(let i=0;i<=Math.min(51,Math.max(nbSemainesEcoulees(),...keysW));i++){
    labs.push('S'+(i+1)); vals.push(Math.round((vh[i+1]||0)/1000));
  }
  barChart($('#chart-volume'), labs, vals, {color:'#ff6fae',color2:'#c084fc', empty:'Aucun volume enregistré — notez vos charges dans le journal d\'entraînement.'});
  // volume muscles
  const vm=volumeMuscles();
  $('#muscle-volume').innerHTML=Object.keys(MUSCLES).map(m=>{
    const s=vm[m]||0, st=statutMuscle(s, MUSCLES[m].zone, MUSCLES[m].prio);
    return '<div class="muscle-item"><div class="m-name"><span class="dot" style="background:'+(st.cls==='chip-green'?'var(--grn)':st.cls==='chip-orange'?'var(--org)':'var(--red)')+'"></span>'+MUSCLES[m].n+'</div><div class="m-sets">'+s+' séries / sem. · <span class="'+st.cls.replace('chip-','')+'">'+st.txt+'</span></div></div>';
  }).join('');
  // bilans
  const pos=programPos(todayKey());
  const dernierMois = pos.idx==='F'?12:(+pos.idx);
  $('#bilan-list').innerHTML = Array.from({length:Math.min(12,Math.max(1,dernierMois))},(_,i)=>i+1).map(m=>
    '<div class="tile center" style="cursor:pointer" onclick="goBilan('+m+')"><div class="t-ic">📋</div><div class="t-lbl">Bilan mensuel</div><div class="t-val">Mois '+m+'</div><div class="t-delta gold">Voir le rapport →</div></div>'
  ).join('');
}
function goBilan(m){ curBilan=m; go('v-bilan'); }

/* ================== PHOTOS ================== */
function renderPhotos(){
  const ms=['j0','m3','m6','m9','m12'];
  const labels={j0:'Jour 0',m3:'Mois 3',m6:'Mois 6',m9:'Mois 9',m12:'Mois 12'};
  ms.forEach(ensurePhotoSlot);
  const m12Sim = state.photos.m12 && (state.photos.m12.face||state.photos.m12.profil||state.photos.m12.dos);

  /* ---------- Rappel toutes les 4 semaines ---------- */
  const pr=photoRappelEtat();
  let bandeau='';
  if(pr){
    if(pr.dejaFait){
      bandeau='<div class="ok-box mb">📸 <b>Dernier bilan photo (semaine '+pr.jalon+') enregistré.</b> Prochain bilan : <b>semaine '+pr.prochain+'</b> ('+
        (pr.joursAvant>0? 'dans '+pr.joursAvant+' jour'+(pr.joursAvant>1?'s':'') : 'maintenant')+'). '+
        '<button class="btn btn-line btn-sm" onclick="ensurePhotoSlot(\'s'+pr.prochain+'\');renderPhotos()">Préparer le prochain</button></div>';
    } else if(pr.due){
      bandeau='<div class="card hebdo-due mb"><div class="spread"><div>'+
        '<span class="chip chip-orange">🔔 Bilan photo des 4 semaines attendu</span>'+
        '<h3 class="mt" style="font-size:16px">Semaine '+pr.jalon+' — prenez vos 3 photos maintenant</h3>'+
        '<p class="small mut mt">Face, profil et dos, dans les <b>mêmes conditions</b> que le Jour 0 : même heure de la journée, même éclairage, même distance, même pose, mêmes sous-vêtements. C\'est la seule façon de comparer honnêtement.</p>'+
        (pr.joursRestants>0? '<div class="small mut mt">⏰ Retard de '+pr.joursRestants+' jour(s).</div>':'')+
        '</div><button class="btn btn-grad" onclick="document.getElementById(\'cp-s'+pr.jalon+'\').scrollIntoView({behavior:\'smooth\'})">📸 Prendre mes photos</button></div></div>';
    } else {
      bandeau='<div class="card mb" style="padding:12px 16px"><div class="spread"><div class="small mut">📸 <b>Prochain bilan photo :</b> semaine '+pr.prochain+' — dans '+pr.joursAvant+' jour'+(pr.joursAvant>1?'s':'')+'. Préparez face, profil et dos dans les mêmes conditions que le Jour 0.</div></div></div>';
    }
  }
  const bEl=document.getElementById('photos-banner');
  if(bEl) bEl.innerHTML=bandeau;

  /* ---------- Checklist de comparaison ---------- */
  let checklist='<div class="card mt2"><div class="sectitle" style="margin-top:0"><div class="bar"></div><h2>✅ Conditions de comparaison</h2><span class="sub">à respecter à chaque bilan</span></div>'+
    '<div class="grid g2">'+
    '<ul style="padding-left:18px;color:var(--mut);font-size:13.5px;line-height:1.9">'+
    '<li>Même <b>moment de la journée</b> (idéalement le matin, à jeun, avant l\'entraînement).</li>'+
    '<li>Même <b>éclairage</b> et même pièce ; évitez le contre-jour et le flash.</li>'+
    '<li>Même <b>distance</b> et même hauteur d\'appareil (hauteur de hanche).</li></ul>'+
    '<ul style="padding-left:18px;color:var(--mut);font-size:13.5px;line-height:1.9">'+
    '<li>Même <b>tenue</b> et même posture (épaules relâchées, pieds écartés de la largeur des hanches).</li>'+
    '<li>Face, <b>profil droit</b> et dos — les 3 à chaque fois.</li>'+
    '<li>Ne comparez <b>jamais</b> une photo prise après l\'entraînement (congestion) avec une photo au repos.</li></ul>'+
    '</div><div class="note-box mt">💡 Les photos révèlent des changements que la balance ne montre pas : un poids stable avec une taille plus fine et des fessiers plus ronds est une transformation réelle.</div></div>';

  /* ---------- Grands jalons ---------- */
  let jalons='<div class="sectitle mt2"><div class="bar"></div><h2>Grands jalons</h2><span class="sub">Jour 0 · Mois 3 · 6 · 9 · 12</span></div>'+
    ms.map(m=>
    '<div class="card"><div class="spread mb"><b class="gold" style="text-transform:uppercase;letter-spacing:.08em">'+labels[m]+'</b>'+
    (m!=='j0'?'<span class="chip chip-mut">bientôt</span>':'<span class="chip chip-gold">Départ</span>')+'</div>'+
    '<div class="photo-grid" style="grid-template-columns:1fr 1fr">'+
    photoCard(m,'face','Face')+photoCard(m,'profil','Profil')+photoCard(m,'dos','Dos')+photoCard(m,'compl','Complémentaire')+
    '</div></div>').join('');

  /* ---------- Bilans toutes les 4 semaines ---------- */
  const cps=photoCheckpoints();
  let cpHtml='<div class="sectitle mt2"><div class="bar"></div><h2>Bilans toutes les 4 semaines</h2><span class="sub">'+cps.length+' jalons · face, profil, dos</span></div>';
  if(!cps.length){
    cpHtml+='<div class="card"><div class="small mut">Le premier bilan photo intermédiaire arrive à la <b>semaine 4</b>.</div></div>';
  } else {
    cpHtml+=cps.map(cp=>{
      ensurePhotoSlot(cp.key);
      const done=state.photos[cp.key];
      const nb=(done.face?1:0)+(done.profil?1:0)+(done.dos?1:0);
      const isDue = pr && pr.jalon===cp.sem && !pr.dejaFait;
      return '<div class="card" id="cp-'+cp.key+'" '+(isDue?'style="border-color:rgba(255,111,174,.5)"':'')+'>'+
        '<div class="spread mb"><b class="'+(nb?'gold':'')+'">'+(isDue?'🔔 ':'')+cp.label+'</b>'+
        '<span class="chip '+(nb===3?'chip-green':nb?'chip-orange':'chip-mut')+'">'+(nb===3?'complet':nb?nb+'/3 photos':'à faire')+'</span></div>'+
        '<div class="photo-grid" style="grid-template-columns:1fr 1fr">'+
        photoCard(cp.key,'face','Face')+photoCard(cp.key,'profil','Profil')+photoCard(cp.key,'dos','Dos')+
        '</div></div>';
    }).join('');
  }

  $('#photo-milestones').innerHTML = jalons + checklist + cpHtml;

  /* comparateur — jalons + bilans 4 semaines */
  const allSlots=[...ms.map(m=>({k:m,l:labels[m]})), ...cps.map(cp=>({k:cp.key,l:cp.label}))];
  const opt=allSlots.map(o=>'<option value="'+o.k+'">'+o.l+'</option>').join('');
  $('#cmp-a').innerHTML=opt; $('#cmp-b').innerHTML=opt;
  $('#cmp-a').value='j0';
  const remplis=allSlots.filter(o=>{ const p2=state.photos[o.k]; return p2&&(p2.face||p2.profil||p2.dos); }).map(o=>o.k);
  $('#cmp-b').value = remplis.length>1 ? remplis[remplis.length-1] : (remplis[0]||'m3');
  loadComparison();
}
function loadComparison(){
  const a=$('#cmp-a').value, b=$('#cmp-b').value, vue=$('#cmp-view').value;
  const sA=ensurePhotoSlot(a), sB=ensurePhotoSlot(b);
  const imgA=sA[vue], imgB=sB[vue];
  const lbl=k=>({j0:'Jour 0',m3:'Mois 3',m6:'Mois 6',m9:'Mois 9',m12:'Mois 12'})[k] || (/^s(\d+)$/.test(k)? 'Semaine '+k.slice(1) : k);
  const area=$('#cmp-area');
  if(!imgA||!imgB){
    area.innerHTML='<div class="chart-empty">Ajoutez les photos des deux bilans (face/profil/dos) pour les comparer.</div>';
    return;
  }
  area.innerHTML='<div class="compare-wrap" id="cmp-w">'+
    '<img src="'+photoSrc(imgB)+'" alt="'+b+'">'+
    '<div class="cw-top" id="cmp-top"><img src="'+photoSrc(imgA)+'" alt="'+a+'"></div>'+
    '<div class="compare-lbl">'+lbl(a)+'</div>'+
    '<div class="compare-lbl r">'+lbl(b)+'</div>'+
    '<div class="compare-slider" id="cmp-slider"></div></div>';
  const w=$('#cmp-w'), top=$('#cmp-top'), sl=$('#cmp-slider');
  let pos=50;
  const set=p=>{ pos=clamp(p,0,100); top.style.width=pos+'%'; sl.style.left='calc('+pos+'% - 1.5px)'; };
  set(50);
  const move=e=>{
    const r=w.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
    set(x/r.width*100);
  };
  sl.addEventListener('mousedown',()=>{ const mv=e=>move(e), up=()=>{document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);}; document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up); });
  sl.addEventListener('touchstart',e=>{ e.preventDefault(); const mv=ev=>move(ev), up=()=>{document.removeEventListener('touchmove',mv);document.removeEventListener('touchend',up);}; document.addEventListener('touchmove',mv); document.addEventListener('touchend',up); });
  w.addEventListener('click',e=>move(e));
}

/* ================== CALENDRIER ================== */
function renderCalendrier(){
  if(!state.profil.date){ $('#cal-wrap').innerHTML='<div class="card center">Complétez d\'abord le profil pour générer votre calendrier de 365 jours.</div>'; return; }
  const start=parseDate(state.profil.date);
  const off=state.calOffset||0;
  const first=new Date(start.getFullYear(), start.getMonth()+off, 1);
  $('#cal-range').textContent = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'][first.getMonth()]+' '+first.getFullYear();
  const end365=addDays(start,364);
  let html='';
  const moisNames=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const dow=['L','M','M','J','V','S','D'];
  for(let dm=0;dm<13;dm++){
    const y=start.getFullYear()+((start.getMonth()+dm)>=12?1:0);
    const m=(start.getMonth()+dm)%12;
    const jour1=new Date(y,m,1);
    if(off>0 && first.getTime()>jour1.getTime()) continue;
    if(off>12) continue;
    if(jour1.getTime()>end365.getTime()) continue;
    const nb= new Date(y,m+1,0).getDate();
    const startDow=(jour1.getDay()+6)%7; // lundi=0
    let cells='';
    let dernierJourDansFenetre = null;
    for(let i=0;i<startDow;i++) cells+='<div class="cal-day other"></div>';
    for(let d=1;d<=nb;d++){
      const dd=dateKey(new Date(y,m,d));
      if(dd<state.profil.date || dd>dateKey(end365)){
        cells+='<div class="cal-day other"><span class="d-num">'+d+'</span></div>'; continue;
      }
      dernierJourDansFenetre = dd;
      const plan=weekPlan(dd).find(p=>p.date===dd);
      const st=state.seances[dd];
      let cls='', dot='';
      if(st==='ok'){cls='done'; dot='<span class="d-dot" style="background:var(--grn)"></span>';}
      else if(st==='partiel'){cls='part'; dot='<span class="d-dot" style="background:var(--org)"></span>';}
      else if(st==='non'){cls='skip'; dot='<span class="d-dot" style="background:var(--red)"></span>';}
      else if(plan&&plan.type==='metcon'){ dot='<span class="d-dot" style="background:var(--blu)"></span>'; }
      else if(plan&&plan.type==='seance'){ dot='<span class="d-dot" style="background:var(--line2)"></span>'; }
      if(dd===todayKey()) cls+=' today';
      cells+='<div class="cal-day '+cls+'" onclick="openDay(\''+dd+'\')"><span class="d-num">'+d+'</span>'+dot+'</div>';
    }
    const joursDansFenetre = dernierJourDansFenetre ? Math.max(1, Math.round((parseDate(dernierJourDansFenetre)-parseDate(state.profil.date))/86400000+1)) : 0;
    html+='<div class="cal-month"><div class="cal-head"><h3>'+moisNames[m]+' '+y+'</h3><span class="chip chip-mut">'+joursDansFenetre+' j</span></div>'+
      '<div class="cal-grid">'+dow.map(x=>'<div class="cal-dow">'+x+'</div>').join('')+cells+'</div></div>';
  }
  $('#cal-wrap').innerHTML=html;
}
function calNav(d){ state.calOffset=(state.calOffset||0)+d; save(); renderCalendrier(); }
function openDay(d){
  const plan=weekPlan(d).find(p=>p.date===d);
  const st=state.seances[d];
  const j=state.journal[d];
  const rec=state.recup[d];
  const sc=recupScore(rec);
  const poids=state.poids[d];
  let body='';
  if(plan){
    body+='<div class="field"><label>Contenu planifié</label><div class="chip '+(plan.type==='seance'?'chip-gold':plan.type==='metcon'?'chip-blue':'chip-mut')+'">'+esc(plan.label)+'</div></div>';
    if(plan.type==='seance') body+='<button class="btn btn-grad btn-block" onclick="closeModal();openSession(\''+d+'\')">🏋️ Saisir la séance</button>';
  }
  body+='<div class="field mt"><label>Statut</label><div class="flex">'+
    '<button class="btn btn-line btn-sm" onclick="setSeanceDay(\''+d+'\',\'ok\')">✅</button>'+
    '<button class="btn btn-line btn-sm" onclick="setSeanceDay(\''+d+'\',\'partiel\')">🟡</button>'+
    '<button class="btn btn-line btn-sm" onclick="setSeanceDay(\''+d+'\',\'non\')">❌</button>'+
    '<span class="chip '+(st==='ok'?'chip-green':st==='partiel'?'chip-orange':st==='non'?'chip-red':'chip-mut')+'">'+(st==='ok'?'Terminée':st==='partiel'?'Partielle':st==='non'?'Non effectuée':'Non renseigné')+'</span></div></div>';
  body+='<div class="grid g2 mt">'+
    '<div class="field"><label for="d-poids">Poids du jour (kg)</label>'+
    '<div class="num-stepper">'+
    '<button type="button" class="ns-btn" data-id="d-poids" data-step="-0.1" data-stepsize="0.1" data-min="0">−</button>'+
    '<input class="inp inp-num" type="tel" inputmode="decimal" autocomplete="off" id="d-poids" value="'+(poids||'')+'" placeholder="—">'+
    '<button type="button" class="ns-btn" data-id="d-poids" data-step="0.1" data-stepsize="0.1" data-min="0">+</button>'+
    '</div></div>'+
    '<div class="field"><label>Récupération</label><div class="chip '+(sc==null?'chip-mut':sc>=65?'chip-green':sc>=50?'chip-orange':'chip-red')+'">'+(sc==null?'non renseignée':sc+'/100')+'</div></div>'+
    '</div>'+
    '<button class="btn btn-line btn-block mt" onclick="saveDayQuick(\''+d+'\')">💾 Enregistrer poids du jour</button>';
  openModal('<h3>📅 '+fmtDateFr(d)+'</h3>'+body);
}
function setSeanceDay(d,v){ setSeanceStatus(d,v); closeModal(); openDay(d); renderCurrent(); }
function saveDayQuick(d){
  const v=numOr($('#d-poids').value);
  if(v) state.poids[d]=v;
  save(); closeModal(); renderCalendrier(); toast('✅ Enregistré');
}
function autoFillCalendar(){
  let n=0;
  Object.keys(state.journal).forEach(d=>{ state.seances[d]=state.journal[d].statut||'ok'; n++; });
  save(); renderCalendrier(); toast('✅ Calendrier mis à jour depuis le journal ('+n+' jours)');
}

/* ================== OBJECTIFS ================== */
function renderObjectifs(){
  const p=state.profil;
  const op=state.objectifs.principal||'recomposition';
  $('#obj-principal').innerHTML = Object.entries({masse:['💪','Prise de masse'],esthetique:['💃','Esthétique féminine'],recomposition:['♻️','Recomposition (recommandé)'],seche:['🔥','Perte de graisse'],force:['🏋️','Force']}).map(([k,[ic,n]])=>
    '<label><input type="radio" name="obj-p" value="'+k+'" '+(op===k?'checked':'')+' onchange="setObjectifPrincipal(\''+k+'\')"><span>'+ic+' '+n+'</span></label>').join('');
  $('#obj-principal-desc').textContent = objectifPrincipalTexte();
  // discipline
  const adh=scoreAdherenceGlobal();
  const disc=scoreDiscipline();
  $('#obj-discipline').innerHTML =
    '<div class="pbar-row"><span class="pr-lbl">Séances cette sem.</span><div class="pbar" style="flex:1"><div class="fill blu" style="width:'+disc.pct+'%"></div></div><span class="pr-val">'+disc.rea+'/'+disc.pre+'</span></div>'+
    '<div class="pbar-row"><span class="pr-lbl">Adhérence globale</span><div class="pbar" style="flex:1"><div class="fill" style="width:'+(adh||0)+'%"></div></div><span class="pr-val">'+(adh==null?'—':adh+' %')+'</span></div>'+
    '<div class="pbar-row"><span class="pr-lbl">Avancement programme</span><div class="pbar" style="flex:1"><div class="fill grn" style="width:'+Math.round(nbSemainesEcoulees()/52*100)+'%"></div></div><span class="pr-val">'+nbSemainesEcoulees()+'/52</span></div>'+
    '<div class="note-box mt">Score de discipline : '+Math.round(((adh||0)+(disc.pct||0))/2)+'/100 — '+(adh>=80?'excellent, continuez !':adh>=50?'régulier, gardez le rythme':'il est temps de reprendre le rythme')+'</div>';
  // cibles
  const c=(state.objectifs.cibles||{});
  const j0=state.mensurations.jour0||{}, dm=dernierMensuration()||{};
  const pa=poidsActuel();
  const cuisseMoy=o=>o&&o.cuisseD? (o.cuisseG? round1((parseFloat(o.cuisseD)+parseFloat(o.cuisseG))/2) : parseFloat(o.cuisseD)) : null;
  /* Cibles alignées sur l'objectif féminin : taille ↓, ventre ↓, fessiers ↑, cuisses ↑ */
  const rows=[
    ['🔥 Tour de taille (cm)', 'taille', j0.taille, dm.taille, '↓'],
    ['🔥 Tour de ventre (cm)', 'ventre', j0.ventre, dm.ventre, '↓'],
    ['🍑 Tour de fessiers (cm)', 'fessiers', j0.fessiers, dm.fessiers, '↑'],
    ['Tour de hanches (cm)', 'hanches', j0.hanches, dm.hanches, '→'],
    ['🦵 Tour de cuisse moyen (cm)', 'cuisse', cuisseMoy(j0), cuisseMoy(dm), '↑'],
    ['⚖️ Poids (kg)', 'poids', p.poidsDepart, pa, p.objectifPoids>p.poidsDepart?'↑':'↓'],
    ['Masse grasse (%)', 'mg', p.mg, Object.entries(state.mg).sort().pop()?Object.entries(state.mg).sort().pop()[1]:null, '↓']
  ];
  const lifts=[['🍑 Hip thrust (1RM kg)','hipthrust'],['🍑 Soulevé de terre roumain (1RM kg)','rdl'],['🦵 Squat (1RM kg)','squat'],['🦵 Bulgarian split squat (1RM kg)','bulgarian'],['🦍 Rowing / tirage (1RM kg)','row']];
  $('#obj-cibles').innerHTML =
    '<div class="tbl-wrap"><table class="tbl"><tr><th>Indicateur</th><th class="num">Cible</th><th class="num">Actuel</th><th>Progression</th></tr>'+
    rows.map(([nom,key,dep,act,dir])=>{
      const cible=c[key];
      const cur=act!=null?act:dep;
      const pct = (cible&&dep)? clamp(Math.round(Math.abs(cur-dep)/Math.abs(cible-dep)*100),0,100):0;
      return '<tr><td>'+nom+'</td><td class="num">'+(cible?cible:'—')+'</td><td class="num">'+(cur?round1(cur):'—')+'</td><td style="min-width:140px"><div class="pbar"><div class="fill '+(dir==='↓'?'grn':'')+'" style="width:'+pct+'%"></div></div><span class="tiny mut">'+pct+' %</span></td></tr>';
    }).join('')+
    lifts.map(([nom,key])=>{
      const cible=c[key]; const pr=perfSerie(key);
      const cur=pr?pr.max:null;
      const pct=(cible&&cur)? clamp(Math.round(cur/cible*100),0,100):0;
      return '<tr><td>'+nom+'</td><td class="num">'+(cible||'—')+'</td><td class="num">'+(cur?Math.round(cur):'—')+'</td><td><div class="pbar"><div class="fill blu" style="width:'+pct+'%"></div></div><span class="tiny mut">'+pct+' %</span></td></tr>';
    }).join('')+
    '</table></div>'+
    '<div class="mt"><b class="small">Modifier mes cibles :</b><div class="form-grid mt">'+
    [['taille','Tour de taille'],['ventre','Tour de ventre'],['fessiers','Tour de fessiers'],['hanches','Tour de hanches'],['cuisse','Tour de cuisse (moyen)']].map(([k,l])=>'<div class="field"><label>'+esc(l)+'</label><input class="inp" type="tel" inputmode="decimal" step="0.5" id="c-'+k+'" value="'+(c[k]||'')+'" placeholder="cm"></div>').join('')+
    '<div class="field"><label>Poids</label><input class="inp" type="tel" inputmode="decimal" step="0.1" id="c-poids" value="'+(c.poids||'')+'" placeholder="kg"></div>'+
    '<div class="field"><label>Masse grasse</label><input class="inp" type="tel" inputmode="decimal" step="0.1" id="c-mg" value="'+(c.mg||'')+'" placeholder="%"></div>'+
    lifts.map(([nom,key])=>'<div class="field"><label>'+esc(nom)+'</label><input class="inp" type="tel" inputmode="decimal" step="0.5" id="c-'+key+'" value="'+(c[key]||'')+'" placeholder="kg"></div>').join('')+
    '</div><button class="btn btn-grad btn-sm mt" onclick="saveCibles()">💾 Enregistrer mes cibles</button></div>';
  // objectifs mensuels
  const pos=programPos(todayKey());
  const mois=(pos.idx==='F'?12:(+pos.idx))||1;
  const om=genererObjectifsMensuels(mois);
  state.objectifsMensuels['M'+mois]=om;
  $('#obj-mensuels').innerHTML=om.map((o,i)=>
    '<div class="checkrow"><input type="checkbox" '+(o.fait?'checked':'')+' onchange="validerObjMensuel('+mois+','+i+',this.checked)"><div style="flex:1"><b>'+esc(o.txt)+'</b><div class="tiny mut">'+esc(o.prog)+'</div></div>'+(o.fait?'<span class="chip chip-green">✓</span>':'')+'</div>'
  ).join('')+
  '<div class="flex mt"><button class="btn btn-line btn-sm" onclick="genererAutoObjMensuels('+(mois-1)+')">◀</button><span class="chip chip-gold">Mois '+mois+'</span><button class="btn btn-line btn-sm" onclick="genererAutoObjMensuels('+(mois+1)+')">▶</button></div>';
  // badges
  $('#obj-badges').innerHTML = BADGES.map(b=>{
    const got=state.badges.includes(b.id);
    const nouveau=state.badgesNouveaux.includes(b.id);
    return '<div class="badge '+(got?'unlocked':'locked')+'" title="'+esc(b.d)+'"><span class="b-ic">'+b.ic+'</span><span class="b-n">'+esc(b.n)+'</span>'+(nouveau?'<span class="b-new">NOUVEAU</span>':'')+'</div>';
  }).join('');
}
function setObjectifPrincipal(k){ state.objectifs.principal=k; if(!state.nutri.phase) state.nutri.phase=phaseNutritionRecommandee(); save(); renderCurrent(); }
function saveCibles(){
  const c={};
  ['taille','ventre','fessiers','hanches','cuisse','poids','mg','hipthrust','rdl','squat','bulgarian','row'].forEach(k=>{ const el=$('#c-'+k); if(!el) return; const v=numOr(el.value); if(v) c[k]=v; });
  state.objectifs.cibles=c; save(); toast('🎯 Cibles enregistrées'); renderCurrent();
}
function genererObjectifsMensuels(mois){
  const phase=PROGRAM[mois]||PROGRAM.finale;
  const se=(+state.profil.seancesSemaine||4);
  const prev=state.objectifsMensuels['M'+mois]||{};
  const items=[];
  const nSeances=Math.round(se*3.2);
  const seancesFaites=Object.keys(state.seances).filter(d=>{ const p=programPos(d); return p.mois===mois && state.seances[d]!=='non'; }).length;
  items.push({txt:'Compléter au moins '+nSeances+' séances de qualité', prog:seancesFaites+'/'+nSeances+' séances validées', fait: prev.fait||false});
  if(phase.type==='developpement'||phase.type==='raffermissement'){
    items.push({txt:'Battre votre record de hip thrust (1RM estimé)', prog: perfActuelle('hipthrust')? 'Actuel : '+fmtKg(perfActuelle('hipthrust').v) : 'Notez vos charges dans le journal', fait:prev.fait||false});
    items.push({txt:'Atteindre 16 séries de fessiers sur au moins une semaine', prog:'Compté automatiquement depuis le journal', fait:prev.fait||false});
  } else if(phase.type==='composition'){
    items.push({txt:'Réduire le tour de taille de 1 cm', prog:'Mesuré via les mensurations mensuelles', fait:prev.fait||false});
    items.push({txt:'Réaliser 3 séances de cardio (elliptique ou piscine)', prog:Object.keys(state.cardio).length+' séance(s) cardio enregistrée(s) au total', fait:prev.fait||false});
  } else if(phase.type==='adaptation'){
    items.push({txt:'Ressentir la contraction des fessiers sur chaque hip thrust', prog:'Auto-évaluation : notez-le en commentaire de séance', fait:prev.fait||false});
  } else {
    items.push({txt:'Maintenir vos charges sur le hip thrust et le soulevé de terre roumain', prog:'Notez vos charges dans le journal', fait:prev.fait||false});
  }
  const recs=Object.values(state.recup);
  const hm=recs.length? recs.reduce((a,b)=>a+(+b.h||0),0)/recs.length:null;
  items.push({txt:'Moyenne de sommeil ≥ 7 h 30', prog:hm? hm.toFixed(1)+' h de moyenne':'à mesurer via les check-ins', fait:prev.fait||false});
  const st=strategieAnnuelle()[clamp(mois,1,13)-1];
  const poids=Object.values(state.poids);
  const dp=poids.length? (+poids[poids.length-1]-+poids[0]):0;
  items.push({txt: st.phase==='deficit' ? 'Perdre 1 à 1,5 kg ce mois (sans perdre de tour de fessiers)'
                 : st.phase==='surplus' ? 'Prendre au maximum 0,5 kg ce mois (construction propre)'
                 : 'Stabiliser le poids (± 0,3 kg) en améliorant les mensurations',
    prog:'Tendance actuelle : '+(dp>=0?'+':'')+round1(dp)+' kg depuis le début du programme', fait:prev.fait||false});
  items.push({txt:'Enregistrer le relevé de mensurations du mois (taille, ventre, hanches, fessiers, cuisses)', prog:state.mensurations.mensuel['M'+mois]?'✓ relevé présent':'à faire', fait:prev.fait||false});
  items.push({txt:'Faire les 2 bilans photo du mois (toutes les 4 semaines)', prog:(function(){const r=photoRappelEtat(); return r? (r.dejaFait? '✓ dernier bilan pris':'à faire') : 'à faire';})(), fait:prev.fait||false});
  return items;
}
function validerObjMensuel(mois,i,checked){
  if(!state.objectifsMensuels['M'+mois]) state.objectifsMensuels['M'+mois]=genererObjectifsMensuels(mois);
  state.objectifsMensuels['M'+mois][i].fait=checked;
  if(checked) state.objectifsMensuels['M'+mois]._valide=true;
  save(); checkBadges(); renderCurrent();
  if(checked) toast('🏆 Objectif mensuel validé !');
}
function genererAutoObjMensuels(mois){
  mois=clamp(mois,1,12);
  state.objectifsMensuels['M'+mois]=genererObjectifsMensuels(mois);
  save(); renderCurrent();
}

/* ================== BILAN HEBDOMADAIRE (modal + équipe) ================== */
function openBilanHebdoModal(){
  const etat=bilanHebdoEtat();
  if(!etat){ toast('⚠️ Complétez d\'abord le profil'); return; }
  const b=state.hebdo? state.hebdo[etat.wk]:null;
  const manquantes=donneesManquantesHebdo(etat.wk);
  const sg=signauxEntrainement(etat.wk);
  let blocSignaux='';
  if(sg){
    const parts=[];
    if(sg.prevues) parts.push('🏋️ '+(sg.faites+sg.partiellement)+'/'+sg.prevues+' séances');
    if(sg.volTrend!=null) parts.push('📦 volume '+(sg.volTrend>=0?'+':'')+Math.round(sg.volTrend)+' % vs sem. préc.');
    if(sg.rpeMoy!=null) parts.push('🔥 RPE moy. '+sg.rpeMoy+'/10');
    if(sg.rirMoy!=null) parts.push('🎯 RIR moy. '+sg.rirMoy);
    if(sg.prMax!=null) parts.push('🏆 PR '+sg.prNom+' '+Math.round(sg.prMax)+' kg');
    if(parts.length) blocSignaux='<div class="ok-box mb" style="padding:9px 12px"><b>📊 Vos enregistrements analysés par l\'équipe :</b> '+parts.join(' · ')+'</div>';
  }
  openModal('<h3>📋 Bilan hebdomadaire de l\'équipe</h3>'+
    '<div class="small mut mb">Semaine '+(etat.wk+1)+' — réponses transmises à votre équipe pour adapter la semaine prochaine.</div>'+
    blocSignaux+
    (manquantes.length? '<div class="warn-box mb" style="padding:9px 12px"><b>📊 Données de suivi à compléter :</b> '+manquantes.join(' · ')+'</div>':'')+
    '<div class="grid g2">'+
      '<div class="field"><label>💥 Énergie générale (1-5)</label><input class="inp" type="range" id="bh-en" min="1" max="5" value="'+(b?b.energie:3)+'" oninput="this.nextElementSibling.textContent=this.value"><b id="bh-en-v" class="gold">'+(b?b.energie:3)+'</b></div>'+
      '<div class="field"><label>🛌 Fatigue (1-5)</label><input class="inp" type="range" id="bh-fa" min="1" max="5" value="'+(b?b.fatigue:2)+'" oninput="this.nextElementSibling.textContent=this.value"><b id="bh-fa-v" class="gold">'+(b?b.fatigue:2)+'</b></div>'+
      '<div class="field"><label>🩹 Douleurs / courbatures (1-5)</label><input class="inp" type="range" id="bh-do" min="1" max="5" value="'+(b?b.douleurs:2)+'" oninput="this.nextElementSibling.textContent=this.value"><b id="bh-do-v" class="gold">'+(b?b.douleurs:2)+'</b></div>'+
      '<div class="field"><label>🔥 Motivation (1-5)</label><input class="inp" type="range" id="bh-mo" min="1" max="5" value="'+(b?b.motivation:4)+'" oninput="this.nextElementSibling.textContent=this.value"><b id="bh-mo-v" class="gold">'+(b?b.motivation:4)+'</b></div>'+
    '</div>'+
    '<div class="field"><label>🧠 Vos ressentis de la semaine</label><textarea class="inp" id="bh-res" placeholder="Ex. : bonnes séances, j\'ai senti une progression sur le développé couché, mais les jambes étaient dures…">'+(b?esc(b.ressentis):'')+'</textarea></div>'+
    '<div class="field"><label>⚠️ Difficultés rencontrées</label><textarea class="inp" id="bh-diff" placeholder="Ex. : sommeil perturbé, stress au travail, douleur à l\'épaule, manque de temps…">'+(b?esc(b.difficultes):'')+'</textarea></div>'+
    '<div class="field"><label>❓ Question pour l\'équipe (facultatif)</label><textarea class="inp" id="bh-q" placeholder="Ex. : dois-je augmenter ma charge sur le squat ?">'+(b?esc(b.questions):'')+'</textarea></div>'+
    '<div class="note-box">💡 Ces réponses déclenchent des ajustements automatiques : volume réduit si fatigue élevée, exercices remplacés si douleurs, conseils nutrition/sommeil selon vos difficultés.</div>'+
    '<button class="btn btn-grad btn-block mt" onclick="saveBilanHebdo()">💾 Transmettre mon bilan à l\'équipe</button>');
}
function saveBilanHebdo(){
  const etat=bilanHebdoEtat(); if(!etat) return;
  const val=n=>parseInt($('#bh-'+n).value||'3');
  const entry={
    wk:etat.wk,
    date:todayKey(),
    energie:val('en'), fatigue:val('fa'), douleurs:val('do'), motivation:val('mo'),
    ressentis:($('#bh-res').value||'').trim(),
    difficultes:($('#bh-diff').value||'').trim(),
    questions:($('#bh-q').value||'').trim(),
    conseils:genererConseilsHebdo({energie:val('en'),fatigue:val('fa'),douleurs:val('do'),motivation:val('mo'),ressentis:($('#bh-res').value||'').trim(),difficultes:($('#bh-diff').value||'').trim()}, etat.wk)
  };
  if(!state.hebdo) state.hebdo={};
  state.hebdo[etat.wk]=entry;
  save(); closeModal(); renderCurrent();
  toast('✅ Bilan transmis à l\'équipe — ajustements prêts !');
  // réaffiche le dashboard pour montrer les conseils
  go('v-dashboard');
}
function renderTeamHebdo(){
  const el=$('#team-hebdo'); if(!el) return;
  const etat=bilanHebdoEtat();
  const hebdo=state.hebdo||{};
  const wks=Object.keys(hebdo).map(Number).sort((a,b)=>b-a);
  let html='<div class="sectitle" style="margin-top:0"><div class="bar"></div><h2>Bilan hebdomadaire de l\'équipe</h2><span class="sub">vos ressentis → adaptations des séances</span></div>';
  if(!state.profil.date){ el.innerHTML=''; return; }
  html+='<div class="card">';
  if(etat){
    if(etat.soumis){
      const b=hebdo[etat.wk];
      html+='<div class="ok-box mb">📋 <b>Bilan de la semaine '+(etat.wk+1)+' transmis</b> ('+fmtDateFr(b.date)+') — l\'équipe a préparé les ajustements ci-dessous.</div>';
      html+='<div class="rec-list">'+b.conseils.map(c=>'<div class="rec-item '+ (c.tag==='Référent santé'?'danger':c.tag==='Coach'?'success':'info') +'"><div class="r-ic">'+c.ic+'</div><div><span class="r-tag">'+c.tag+'</span>'+esc(c.txt)+'</div></div>').join('')+'</div>';
      if(b.questions) html+='<div class="note-box mt">❓ <b>Votre question :</b> '+esc(b.questions)+'</div>';
      html+='<div class="flex mt"><button class="btn btn-line btn-sm" onclick="openBilanHebdoModal()">✏️ Modifier mon bilan</button></div>';
    } else if(etat.due){
      html+='<div class="warn-box mb">🔔 <b>Jour J :</b> l\'équipe attend votre bilan de la semaine '+(etat.wk+1)+' pour adapter vos séances de la semaine prochaine.</div>'+
        '<button class="btn btn-grad" onclick="openBilanHebdoModal()">📋 Remplir le bilan hebdomadaire</button>';
    } else {
      html+='<div class="small mut">Prochain jour J : <b class="gold">'+fmtDateFr(etat.sunday)+'</b> ('+(etat.joursAvant===0?'aujourd\'hui':'dans '+etat.joursAvant+' jour'+(etat.joursAvant>1?'s':''))+'). Un rappel apparaîtra dans le dashboard.</div>'+
        '<button class="btn btn-line btn-sm mt" onclick="openBilanHebdoModal()">Remplir maintenant</button>';
    }
  }
  // Historique
  if(wks.length){
    html+='<div class="divider"></div><b class="small">Historique des bilans :</b><div class="flex mt">'+wks.slice(0,8).map(k=>'<button class="btn btn-line btn-sm" onclick="openBilanAncien('+k+')">S'+(k+1)+'</button>').join('')+'</div>';
  }
  html+='</div>';
  el.innerHTML=html;
}
function openBilanAncien(wk){
  const b=(state.hebdo||{})[wk]; if(!b){ toast('Bilan introuvable'); return; }
  openModal('<h3>📋 Bilan — semaine '+(wk+1)+' <span class="small mut">('+fmtDateFr(b.date)+')</span></h3>'+
    '<div class="grid g2 mb">'+
      '<div class="report-cell"><div class="rc-l">Énergie</div><div class="rc-v">'+b.energie+'/5</div></div>'+
      '<div class="report-cell"><div class="rc-l">Fatigue</div><div class="rc-v">'+b.fatigue+'/5</div></div>'+
      '<div class="report-cell"><div class="rc-l">Douleurs</div><div class="rc-v">'+b.douleurs+'/5</div></div>'+
      '<div class="report-cell"><div class="rc-l">Motivation</div><div class="rc-v">'+b.motivation+'/5</div></div>'+
    '</div>'+
    (b.ressentis? '<div class="field"><label>Ressentis</label><div class="small mut">'+esc(b.ressentis)+'</div></div>':'')+
    (b.difficultes? '<div class="field"><label>Difficultés</label><div class="small mut">'+esc(b.difficultes)+'</div></div>':'')+
    '<div class="rec-list mt">'+(b.conseils||[]).map(c=>'<div class="rec-item info"><div class="r-ic">'+c.ic+'</div><div><span class="r-tag">'+c.tag+'</span>'+esc(c.txt)+'</div></div>').join('')+'</div>');
}

/* ================== ÉQUIPE ================== */
function renderEquipe(){
  renderTeamHebdo();
  const p=state.profil;
  const recs=buildRecommendations();
  const rm=moyenneRecup();
  const adh=scoreAdherenceGlobal();
  const pos=programPos(todayKey());
  const phase=pos.phase;
  const c=caloriesCibles();
  const equipe=[
    {ic:'🌸',nom:'Coach principale',role:'Programmation féminine & périodisation',coul:'chip-gold',
      desc:'Responsable des 5 cycles, des 4 séances hebdomadaires et de la progression des charges.',
      avis:p.date? 'Votre cycle actuel : <b>'+esc(phase.titre)+'</b> — '+esc(phase.macro||'')+'. Semaine '+(pos.weekGlobal+1)+'/52. '+(pos.deload?'C\'est une semaine de deload : volume -50 %, cardio léger ou piscine, concentrez-vous sur la technique et la contraction fessière.':'Objectif de la semaine : compléter '+(p.seancesSemaine||4)+' séances en gardant un RIR 2 sur les exercices fessiers — la qualité de contraction prime sur la charge.') : 'Complétez votre bilan pour activer le coaching.'},
    {ic:'🍑',nom:'Spécialiste fessiers',role:'Volume, fréquence & galbe',coul:'chip-gold',
      desc:'Priorité absolue du programme : analyse le volume fessier, la fréquence de stimulation et la qualité du recrutement.',
      avis: (function(){ const sf=signauxFessiers(pos.weekGlobal); const cible = phase.type==='developpement'?18:phase.type==='adaptation'?10:14;
        return 'Cette semaine : <b>'+(sf?sf.setsTotal:0)+' séries</b> de fessiers pour une cible de <b>'+cible+' à '+(cible+6)+'</b>. Grand fessier (hip thrust, soulevé de terre roumain, fentes bulgares) = volume et projection. Moyen fessier (abduction, clamshell) = arrondi latéral et comblement du creux de hanche. <b>'+(sf?sf.setsMoy:0)+' séries</b> de moyen fessier cette semaine (visez 8 à 12). Les quadriceps restent volontairement contenus pour préserver les proportions.'; })()},
    {ic:'🥗',nom:'Nutritionniste',role:'Calories & macronutriments',coul:'chip-blue',
      desc:'Calcule vos besoins, ajuste les phases (surplus, maintien, déficit, recomposition).',
      avis:c? (function(){ const jt=jourTypeDe(todayKey()); const f=FACTEURS_JOUR[jt]; const mJ=macroJour(pos.idx==='F'?13:+pos.idx, jt);
        return 'Aujourd\'hui ('+f.ic+' '+esc(f.n)+') : <b>'+(mJ?mJ.cal:c.cal)+' kcal</b> · '+(mJ?mJ.prot:c.prot)+' g protéines · '+(mJ?mJ.glu:c.glu)+' g glucides · '+(mJ?mJ.lip:c.lip)+' g lipides. Phase conseillée : <b>'+nutriPhaseInfo().n+'</b> — '+esc(strategieAnnuelle()[clamp(pos.idx==='F'?13:+pos.idx,1,13)-1].nom)+'. Dépense de base estimée : '+c.tdee+' kcal (Mifflin-St Jeor féminin, activité ×1,5). Repas détaillé dans l\'onglet 🥗 Repas.'; })() : 'Renseignez votre profil pour le calcul.'},
    {ic:'🧠',nom:'Préparateur mental',role:'Motivation & discipline',coul:'chip-violet',
      desc:'Habitudes, constance, gestion de la fatigue, sommeil, adhérence.',
      avis:'Adhérence aux séances : <b>'+(adh==null?'—':adh+' %')+'</b>. '+(adh>=85?'Votre constance est votre plus grand atout : continuez.':'Rappel : 3 séances par semaine pendant 12 mois = 150+ séances. La régularité bat l\'intensité isolée. Fixez-vous un rituel fixe (mêmes jours, mêmes horaires).')},
    {ic:'🩺',nom:'Référent santé',role:'Prévention & prudence',coul:'chip-red',
      desc:'Recommandations générales de prudence — aucun diagnostic médical.',
      avis:'Rappels : échauffez-vous 5-10 min, respectez les tempos, hydratez-vous. Douleur articulaire aiguë, blessure, fatigue anormale ou malaise → <b>arrêtez et consultez un professionnel de santé</b>. '+(rm!=null&&rm<50?'Votre score de récupération est faible ('+rm+'/100) : une semaine de deload est recommandée.':'')},
    {ic:'🧘',nom:'Expert mobilité',role:'Mobilité, amplitude & prévention',coul:'chip-green',
      desc:'Échauffement, amplitude, retour au calme, prévention des blessures.',
      avis:'Avant chaque séance : 5 min d\'elliptique très facile + mobilité complète (10 rotations par articulation, focus hanches) + <b>activation fessiers obligatoire</b> les jours J1, J3, J4 et J5 + séries d\'approche à 50 % puis 70-80 %. Après : 5-10 min d\'étirements statiques des groupes travaillés. Priorité absolue : <b>mobilité de hanche</b> (fléchisseurs et rotateurs externes) — c\'est elle qui conditionne l\'amplitude du hip thrust et donc le recrutement du grand fessier.'},
    {ic:'🫀',nom:'Préparatrice cardio',role:'Elliptique · piscine · repos actif',coul:'chip-orange',
      desc:'Programme le cardio pour augmenter la dépense énergétique sans nuire à la récupération des fessiers.',
      avis:(function(){ const ci=cardioSemaineInfos(pos.weekGlobal);
        return 'Cette phase : <b>'+esc(phase.metcon)+'</b>. '+ci.faites+' / '+ci.prevues+' séance(s) réalisée(s) cette semaine. <b>Règles :</b> jamais de fractionné la veille d\'une séance fessiers ; cardio modéré (60-70 % FCM = '+Math.round(fcm()*0.6)+'-'+Math.round(fcm()*0.7)+' bpm) en priorité ; <b>piscine</b> les jours de fatigue ou de courbatures ; <b>repos actif</b> (marche 35-45 min) en semaine de deload. Choisissez votre support dans l\'onglet 🚴 Cardio.'; })()},
    {ic:'📊',nom:'Analyste de performance',role:'Données & recommandations',coul:'chip-blue',
      desc:'Analyse vos données (poids, mensurations, charges, récupération) et génère des recommandations.',
      avis: (forceTestDone()? 'Bilan 1RM : <b>'+fmtKg(state.force.valeurs.hipthrust||'—')+' hip thrust</b> · '+fmtKg(state.force.valeurs.rdl||'—')+' SDT roumain</b> · '+fmtKg(state.force.valeurs.squat||'—')+' squat</b> · '+fmtKg(state.force.valeurs.bulgarian||'—')+' bulgarian</b> · '+fmtKg(state.force.valeurs.row||'—')+' rowing</b> · '+(forceReevalDue()?'<b class="warn">réévaluation recommandée</b>':'prochaine rééval. '+fmtDateFr(nextReevalDate()))+'.<br>':'<b>Bilan 1RM non réalisé</b> : recommandé avant le bilan de départ pour personnaliser les charges.<br>') + (buildRecommendations().filter(r=>r.tag!=='Référent santé').slice(0,2).map(r=>'• '+esc(r.txt)).join('<br>')||'Enregistrez vos données régulièrement : pesées, relevés mensuels, charges du journal et check-ins de récupération. Plus vous renseignez, plus les recommandations sont précises.')}
  ];
  $('#team-cards').innerHTML = equipe.map(e=>
    '<div class="team-card"><div class="team-avatar">'+e.ic+'</div><div><h3>'+esc(e.nom)+'</h3><div class="team-role">'+esc(e.role)+'</div></div><div class="team-desc">'+esc(e.desc)+'</div></div>'
  ).join('');
  $('#team-advices').innerHTML = equipe.map(e=>
    '<div class="team-voice"><div class="tv-ic">'+e.ic+'</div><div><b>'+esc(e.nom)+' <span class="chip '+e.coul+'" style="margin-left:6px">'+esc(e.role)+'</span></b><p class="team-advice" style="margin-top:6px">'+e.avis+'</p></div></div>'
  ).join('');
  // consulter un expert → modal
  equipe.forEach((e,i)=>{
    const cards=$$('#team-cards .team-card');
    if(cards[i]) cards[i].style.cursor='pointer', cards[i].onclick=()=>openModal('<h3>'+e.ic+' '+esc(e.nom)+'</h3><span class="chip '+e.coul+'">'+esc(e.role)+'</span><p class="small mut mt">'+esc(e.desc)+'</p><div class="team-advice mt">'+e.avis+'</div>');
  });
}

/* ================== BILAN MENSUEL ================== */
function renderBilan(){
  const mois=curBilan||1;
  const html=genererBilan(mois);
  $('#bilan-content').innerHTML=
    '<div class="spread mb"><button class="btn btn-line btn-sm" onclick="goBilan('+Math.max(1,mois-1)+')">◀ Mois '+(mois-1)+'</button>'+
    '<div class="flex"><select class="inp" style="width:150px" onchange="goBilan(+this.value)">'+Array.from({length:12},(_,i)=>'<option value="'+(i+1)+'" '+(i+1===mois?'selected':'')+'>Mois '+(i+1)+'</option>').join('')+'</select>'+
    '<button class="btn btn-line btn-sm no-print" onclick="printReport()">🖨️ Imprimer</button></div>'+
    '<button class="btn btn-line btn-sm" onclick="goBilan('+Math.min(12,mois+1)+')">Mois '+(mois+1)+' ▶</button></div>'+
    html;
  state.bilanVu['M'+mois]=true; save(); checkBadges();
}
function genererBilan(mois){
  const p=state.profil;
  const phase=PROGRAM[mois]||PROGRAM.finale;
  const j0=state.mensurations.jour0||{};
  const mm=(state.mensurations.mensuel||{})['M'+mois]||dernierMensuration()||{};
  // poids
  const pe=Object.entries(state.poids).sort();
  const moisDebut=addDays(parseDate(state.profil.date||todayKey()),(mois-1)*28);
  const moisFin=addDays(parseDate(state.profil.date||todayKey()),mois*28-1);
  const peseeMois=pe.filter(([d])=>d>=dateKey(moisDebut)&&d<=dateKey(moisFin));
  const poidsDebut = pe[0]? +pe[0][1]:(p.poidsDepart?+p.poidsDepart:null);
  const poidsFin = peseeMois.length? +peseeMois[peseeMois.length-1][1] : (poidsDebut);
  // séances
  let pre=0,reussies=0;
  for(let i=0;i<28;i++){
    const d=dateKey(addDays(moisDebut,i));
    const plan=weekPlan(d).find(x=>x.date===d);
    if(plan&&plan.type==='seance'){ pre++; const st=state.seances[d]; if(st&&st!=='non') reussies++; }
  }
  const adherence= pre? Math.round(reussies/pre*100):0;
  // recup moyenne du mois
  let sRec=0,nRec=0;
  Object.entries(state.recup).forEach(([d,e])=>{ if(d>=dateKey(moisDebut)&&d<=dateKey(moisFin)){ const sc=recupScore(e); if(sc!=null){sRec+=sc;nRec++;} } });
  const recMoy=nRec? Math.round(sRec/nRec):null;
  // perf du mois
  const liftGains=Object.keys(MAIN_LIFTS).map(k=>{
    const h=perfHistorique(k).filter(x=>x.date>=dateKey(moisDebut)&&x.date<=dateKey(moisFin));
    return h.length? {n:MAIN_LIFTS[k].n, best:Math.max(...h.map(x=>x.v))}:null;
  }).filter(Boolean);
  // nutrition
  let nJ=0;
  Object.keys(state.nutri.journal||{}).forEach(d=>{ if(d>=dateKey(moisDebut)&&d<=dateKey(moisFin)) nJ++; });
  // photos
  const phM = mois===3?'m3':mois===6?'m6':mois===9?'m9':mois===12?'m12':null;
  const hasPhoto = phM && (state.photos[phM].face||state.photos[phM].profil||state.photos[phM].dos);
  // mensurations delta
  const mDeltas = MENS_FIELDS.map(([k,l])=>{
    const a=j0[k], b=mm[k];
    return a&&b? {l, v:round1(b-a)}:null;
  }).filter(Boolean);
  const brasD=(mm.brasD&&j0.brasD)? round1(+mm.brasD-(+j0.brasD)):null;
  const poitrineD=(mm.poitrine&&j0.poitrine)? round1(+mm.poitrine-(+j0.poitrine)):null;
  const tailleD=(mm.taille&&j0.taille)? round1(+mm.taille-(+j0.taille)):null;
  // Volume du mois et RPE moyenne (issus du journal d'entraînement)
  const volMois = Object.keys(state.journal).filter(d=>d>=dateKey(moisDebut)&&d<=dateKey(moisFin)).reduce((acc,d)=>{
    (state.journal[d].exos||[]).forEach(e=>{ if(e.ch&&e.reps&&e.se) acc+=e.ch*e.reps*e.se; });
    return acc;
  },0);
  const moisPrecDebut=addDays(parseDate(state.profil.date||todayKey()),(mois-2)*28);
  const moisPrecFin=addDays(parseDate(state.profil.date||todayKey()),(mois-1)*28-1);
  const volPrec = Object.keys(state.journal).filter(d=>d>=dateKey(moisPrecDebut)&&d<=dateKey(moisPrecFin)).reduce((acc,d)=>{
    (state.journal[d].exos||[]).forEach(e=>{ if(e.ch&&e.reps&&e.se) acc+=e.ch*e.reps*e.se; });
    return acc;
  },0);
  const volTrend = (volPrec>0 && volMois>0)? Math.round((volMois/volPrec-1)*100) : null;
  let rpeSumM=0, rpeNM=0;
  Object.keys(state.journal).forEach(d=>{
    if(d>=dateKey(moisDebut)&&d<=dateKey(moisFin)){
      (state.journal[d].exos||[]).forEach(e=>{ if(e.rpe!==''&&e.rpe!=null){ rpeSumM+=+e.rpe; rpeNM++; } });
    }
  });
  const rpeMois = rpeNM? round1(rpeSumM/rpeNM):null;
  // avis équipe
  const avisEquipe=[
    ['🏋️','Coach', p.date? 'Mois '+mois+' — '+phase.titre+' : '+(adherence>=75?'excellente adhérence ('+adherence+' %), progression conforme. '+((liftGains.length?'Records battus sur : '+liftGains.map(g=>g.n).join(', ')+'.':'Poursuivez la montée des charges.')) : adherence>=50?'adhérence moyenne ('+adherence+' %). Les séances sont le moteur : verrouillez vos créneaux.':'adhérence faible ('+adherence+' %). Réduisez la fréquence si nécessaire, mais restez actif 3×/semaine.') : 'Complétez le profil pour un suivi.'],
    ['🥗','Nutritionniste', p.date? 'Stratégie du mois : '+strategieAnnuelle()[mois-1].nom+'. '+(nJ>=7?'Journal alimentaire tenu '+nJ+' jour(s) : bonne visibilité sur les apports.':'Journal alimentaire peu renseigné ('+nJ+' jour(s)) : 5 minutes par jour suffisent pour fiabiliser les ajustements.')+(tailleD!=null?' Tour de taille : '+(tailleD>0?'+'+tailleD+' cm — surveiller les glucides.':tailleD+' cm — objectif de sécheresse sur la bonne voie.') : '') : ''],
    ['🧠','Préparateur mental','Discipline sur les séances : '+adherence+' %. '+(recMoy!=null?'Récupération moyenne : '+recMoy+'/100. ':'')+(recMoy!=null&&recMoy>=70?'Votre corps suit : continuez sur votre lancée.':recMoy!=null?'Un mois à haute intensité : prévoyez une vraie semaine de repos complet si la tendance se prolonge.':'Renseignez vos check-ins pour un suivi de la fatigue.')],
    ['📊','Analyste performance', 'Poids : '+(poidsDebut?fmtKg(poidsDebut)+' → '+fmtKg(poidsFin):'—')+(poidsDebut&&poidsFin?' ('+(poidsFin-poidsDebut>0?'+':'')+round1(poidsFin-poidsDebut)+' kg)':'')+'. '+(liftGains.length?'1RM estimés du mois : '+liftGains.map(g=>g.n+' '+Math.round(g.best)+' kg').join(' · ')+'.':'Aucune charge journalisée ce mois : notez vos séances pour l\'analyse de force.')+' Volume : '+(Math.round(Object.entries(volumeHebdo()).filter(([w])=>w<=mois*4+4).reduce((a,[,v])=>a+v,0)/1000))+' tonnes cumulées'+(volTrend!=null?' ('+(volTrend>=0?'+':'')+volTrend+' % vs mois précédent)':'')+(rpeMois!=null?'. Intensité perçue moyenne : RPE '+rpeMois+'/10':'')+'.'],
    ['🧘','Expert mobilité','Si des tensions sont apparues ce mois (épaules, lombaires, hanches), ajoutez 10 min de mobilité le matin et étirez les groupes travaillés après chaque séance. La prévention passe par l\'amplitude.']
  ];
  const prios=[
    'Maintenir '+(p.seancesSemaine||4)+' séances par semaine, semaine après semaine',
    (tailleD!=null&&tailleD>0?'Stabiliser le tour de taille (ajuster glucides du soir)':'Visiter l\'onglet Progression chaque vendredi pour suivre les courbes'),
    (recMoy!=null&&recMoy<70?'Reprendre le contrôle du sommeil : 7 h 30 minimum':'Poursuivre la montée de charge (+2,5 % sur les exercices principaux)'),
    ([2,4,6,8,10,12].includes(mois)?'Réévaluer le bilan 1RM (le coach fixe une réévaluation toutes les 8 semaines, en fin de phase d\'intensification)':(liftGains.length?'Battre '+liftGains[0].n+' au prochain cycle':'Fixer 1 record personnel sur un exercice principal ce mois')),
    'Prendre les photos de bilan'+(phM?' (Mois '+phM.slice(1)+')':'')+' dans les mêmes conditions que le Jour 0'
  ];
  const perfMois = liftGains.length? liftGains.map(g=>g.n+' '+Math.round(g.best)+' kg').join(' · '):'Aucun record journalisé';
  let finalMotivation = '';
  if(mois===12){
    const pInit = j0.poidsDepart || p.poidsDepart;
    const deltaFinal = (poidsDebut&&poidsFin) ? round1(poidsFin-poidsDebut) : null;
    const nbPR = Object.keys(MAIN_LIFTS).filter(k=>perfSerie(k)).length;
    const phrase = [
      '12 mois. '+adherence+' % d\'adhérence. '+(deltaFinal!=null?((deltaFinal>0?'+':'')+deltaFinal+' kg de poids, '):'')+(nbPR?nbPR+' records personnels, ':'')+'des mensurations transformées. Ce que la balance ne dit pas : chaque série terminée, chaque repas respecté, chaque nuit de sommeil priorisée. Vous êtes entré·e en tant qu\'athlète, vous ressortez bâti·e.',
      'Il n\'y a rien de magique dans une transformation de 12 mois : seulement des jours ordinaires exécutés avec une discipline hors du commun. '+ (nbPR? 'Vos '+nbPR+' records personnels en sont la preuve. ':'')+'Le muscle construit appartient maintenant à votre corps pour toujours — il ne s\'efface pas, il se maintient.',
      'Regardez vos photos du Jour 0. Regardez maintenant. La différence visible dans le miroir, c\'est vous qui l\'avez construite, séance après séance. '+ (adherence>=70? 'Et avec '+adherence+' % d\'adhérence, vous faites partie des 10 % qui vont au bout de leurs engagements. ':'')+'Fier·ère ? Vous avez le droit de l\'être.'
    ][new Date().getDate() % 3];
    finalMotivation = '<div class="report-sec"><h4>🏆 12 MOIS — TRANSFORMATION ACCOMPLIE</h4>'+
      '<div class="report-grid">'+
        cell('Poids initial', fmtKg(poidsDebut))+cell('Poids final', fmtKg(poidsFin))+cell('Différence', deltaFinal!=null?((deltaFinal>0?'+':'')+deltaFinal+' kg'):'—')+
        cell('Séances réalisées', reussies+' / '+pre)+cell('Adhérence', adherence+' %')+cell('Records', nbPR+' / 4 suivis')+
        cell('Récupération moyenne', recMoy!=null? recMoy+'/100':'—')+cell('Score de transformation', scoreTransformation().total+'/100')+
      '</div>'+
      '<div class="card mt" style="border-color:rgba(255,111,174,.45);background:linear-gradient(160deg,rgba(255,111,174,.1),var(--panel))"><div class="flex" style="gap:12px"><div style="font-size:34px">🏆</div><p style="font-size:15px;font-weight:700;line-height:1.6">'+esc(phrase)+'</p></div></div>'+
      '<div class="flex mt"><button class="btn btn-grad no-print" onclick="go(\'v-photos\')">📸 Voir la galerie de transformation</button><button class="btn btn-line no-print" onclick="exportData()">📦 Sauvegarder mes données</button></div></div>';
  }
  return '<div class="card report-head"><div class="r-m">Bilan mensuel automatique</div><h2>Mois '+mois+'</h2><div class="small mut mt">'+esc(phase.titre)+' — '+esc(phase.macro||'')+' · '+esc(phase.schema)+' · '+esc(phase.intensite)+'</div></div>'+
  '<div class="report-grid">'+
    cell('Poids', 'Départ', fmtKg(poidsDebut))+cell('→ Mois '+mois, fmtKg(poidsFin))+cell('Évolution', (poidsDebut&&poidsFin)?((poidsFin-poidsDebut>0?'+':'')+round1(poidsFin-poidsDebut)+' kg'):'—')+
    cell('Séances', reussies+' / '+pre)+cell('Adhérence', adherence+' %')+
    cell('Récupération moy.', recMoy!=null? recMoy+'/100':'—')+
    cell('Nutrition', nJ+' jour(s) journalisé')+
    cell('Bras', brasD!=null?((brasD>0?'+':'')+brasD+' cm'):'—')+
    cell('Poitrine', poitrineD!=null?((poitrineD>0?'+':'')+poitrineD+' cm'):'—')+
    cell('Tour de taille', tailleD!=null?((tailleD>0?'+':'')+tailleD+' cm'):'—')+
    cell('Performances', perfMois)+
    cell('Photos', phM? (hasPhoto?'✓ prises':'à prendre') : '—')+
  '</div>'+
  '<div class="report-sec"><h4>📈 Mensurations — détail</h4><div class="tbl-wrap"><table class="tbl"><tr><th>Mesure</th><th class="num">Jour 0</th><th class="num">Mois '+mois+'</th><th class="num">Écart</th></tr>'+
  MENS_FIELDS.map(([k,l])=>'<tr><td>'+esc(l)+'</td><td class="num">'+(j0[k]||'—')+'</td><td class="num">'+(mm[k]||'—')+'</td><td class="num">'+(j0[k]&&mm[k]?((mm[k]-j0[k]>0?'+':'')+round1(mm[k]-j0[k])+' cm'):'—')+'</td></tr>').join('')+
  '</table></div></div>'+
  '<div class="report-sec"><h4>💪 Performances du mois</h4>'+(liftGains.length?'<div class="report-grid">'+liftGains.map(g=>cell(g.n, Math.round(g.best)+' kg (1RM est.)','PR') ).join('')+'</div>':'<div class="chart-empty">Journalisez vos séances pour suivre vos records ici.</div>')+'</div>'+
  '<div class="report-sec"><h4>🧠 Avis de l\'équipe</h4>'+avisEquipe.map(a=>'<div class="team-voice"><div class="tv-ic">'+a[0]+'</div><div><b>'+a[1]+'</b><p>'+esc(a[2])+'</p></div></div>').join('')+'</div>'+
  '<div class="report-sec"><h4>🎯 Priorités du mois suivant</h4><ol class="prio-list">'+prios.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></div>'+
  '<div class="danger-box mt no-print">Ces bilans sont générés automatiquement à titre informatif. Ils ne remplacent pas l\'avis d\'un professionnel de santé.</div>'+
  finalMotivation;
}
function cell(l,v,extra){
  return '<div class="report-cell"><div class="rc-l">'+esc(l)+'</div><div class="rc-v">'+esc(v)+'</div>'+(extra?'<div class="tiny mut">'+esc(extra)+'</div>':'')+'</div>';
}

/* ============================================================
   ÉMILIE TRANSFORMATION — Modules ajoutés
   🚴 CARDIO (elliptique / piscine / repos actif) · 📊 TRANSFORMATION
   📸 Bilans photo toutes les 4 semaines · 🍑 Suivi fessiers
   ============================================================ */

/* ================== 🚴 CARDIO ================== */
/* Dépense estimée : kcal = MET × 3,5 × poids(kg) / 200 × minutes */
const MET_CARDIO = {
  elliptique:{modere:5.0, intense:7.0},
  piscine:{modere:6.0, intense:8.0},
  repos:{modere:3.5, intense:4.5}
};
function kcalCardio(format, duree, rpe){
  const w = poidsActuel()||parseFloat(state.profil.poidsDepart)||66;
  const met = (MET_CARDIO[format]||MET_CARDIO.elliptique)[ (rpe!=null && +rpe>=8)?'intense':'modere' ];
  return Math.round(met*3.5*w/200*(+duree||0));
}
function setCardioChoix(date, format){
  state.cardioChoix[date]=format;
  save(); renderCurrent();
  toast((CARDIO_TYPES[format]||{}).ic+' '+((CARDIO_TYPES[format]||{}).n||format)+' programmé pour le '+fmtDateShort(date));
}
function openCardioLog(date){
  date = date || todayKey();
  const cur = state.cardio[date]||{};
  const plan = weekPlan(date).find(p=>p.date===date);
  const sugg = plan && plan.cardio ? plan.cardio : null;
  const formats = Object.keys(CARDIO_TYPES).map(k=>
    '<label><input type="radio" name="c-format" value="'+k+'" '+((cur.format|| (sugg?sugg.format:'elliptique'))===k?'checked':'')+' onchange="cardioRecalc()"><span>'
    +CARDIO_TYPES[k].ic+' '+CARDIO_TYPES[k].n+'</span></label>').join('');
  openModal('<h3>🚴 Enregistrer mon cardio — '+fmtDateFr(date)+'</h3>'+
    (sugg? '<div class="note-box mb">📋 <b>Prévu par le programme :</b> '+esc(sugg.label)+' — '+esc(sugg.detail)+'<br>Zone cible : <b>'+sugg.zoneNom+'</b> ('+Math.round(fcm()*sugg.zonePct[0])+'-'+Math.round(fcm()*sugg.zonePct[1])+' bpm)</div>':'')+
    '<div class="field"><label>Type d\'activité</label><div class="radio-pills">'+formats+'</div></div>'+
    '<div class="grid g3">'+
    '<div class="field"><label for="c-duree">Durée (min)</label>'+
      '<div class="num-stepper"><button type="button" class="ns-btn" data-id="c-duree" data-step="-5" data-stepsize="5" data-min="0">−</button>'+
      '<input class="inp inp-num" type="tel" inputmode="decimal" id="c-duree" value="'+(cur.duree||(sugg?sugg.duree:20))+'" oninput="cardioRecalc()">'+
      '<button type="button" class="ns-btn" data-id="c-duree" data-step="5" data-stepsize="5" data-min="0">+</button></div></div>'+
    '<div class="field"><label for="c-rpe">Intensité perçue (RPE 1-10)</label>'+
      '<div class="num-stepper"><button type="button" class="ns-btn" data-id="c-rpe" data-step="-1" data-stepsize="1" data-min="1">−</button>'+
      '<input class="inp inp-num" type="tel" inputmode="decimal" id="c-rpe" value="'+(cur.rpe||6)+'" oninput="cardioRecalc()">'+
      '<button type="button" class="ns-btn" data-id="c-rpe" data-step="1" data-stepsize="1" data-min="1">+</button></div></div>'+
    '<div class="field"><label for="c-kcal">Kcal (estimées)</label><input class="inp" type="tel" inputmode="decimal" id="c-kcal" value="'+(cur.kcal||'')+'" placeholder="auto"></div>'+
    '</div>'+
    '<div class="field"><label for="c-note">Note (ressenti, fatigue des jambes…)</label><input class="inp" id="c-note" value="'+esc(cur.note||'')+'" placeholder="Ex. jambes légères, aucune gêne pour la séance de demain"></div>'+
    '<div class="ok-box mt" id="c-info"></div>'+
    '<button class="btn btn-grad btn-block mt" onclick="saveCardio(\''+date+'\')">💾 Enregistrer</button>');
  cardioRecalc();
}
function cardioRecalc(){
  const f=($('#modal-root input[name="c-format"]:checked')||{}).value||'elliptique';
  const d=numOr($('#c-duree').value)||0;
  const r=numOr($('#c-rpe').value)||6;
  const kcal=kcalCardio(f,d,r);
  const el=$('#c-kcal'); if(el && !el.value) el.placeholder=kcal+' (auto)';
  const info=$('#c-info');
  if(info){
    const z = r>=9?3 : r>=7?2 : r>=5?1 : 0;
    const zone=ZONES_CARDIO[z];
    const fc=zoneFC(zone);
    info.innerHTML='<b>'+CARDIO_TYPES[f].ic+' '+CARDIO_TYPES[f].n+'</b> · '+d+' min · RPE '+r+
      ' → zone <b>'+zone.n+'</b> ('+fc[0]+'-'+fc[1]+' bpm, FCM '+fcm()+')<br>'+
      '<span class="small mut">Dépense estimée : <b>'+kcal+' kcal</b>. '+esc(zone.usage)+'</span>';
  }
}
function saveCardio(date){
  const f=($('#modal-root input[name="c-format"]:checked')||{}).value||'elliptique';
  const d=numOr($('#c-duree').value)||0;
  const r=numOr($('#c-rpe').value)||6;
  const kcal=numOr($('#c-kcal').value)||kcalCardio(f,d,r);
  const note=($('#c-note')||{}).value||'';
  state.cardio[date]={format:f, duree:d, rpe:r, kcal:Math.round(kcal), note:note, ts:Date.now()};
  state.cardioChoix[date]=f;
  state.seances[date]='ok';
  const j=state.journal[date]||{exos:[]}; j.statut='ok'; state.journal[date]=j;
  save(); closeModal(); checkBadges(); renderCurrent();
  toast('✅ Cardio enregistré : '+CARDIO_TYPES[f].n+' · '+d+' min · ≈'+Math.round(kcal)+' kcal');
}
function cardioSemaineVolume(){
  const out={};
  Object.keys(state.cardio).forEach(d=>{
    if(!state.profil.date) return;
    const wk=programPos(d).weekGlobal+1;
    out[wk]=(out[wk]||0)+(+state.cardio[d].duree||0);
  });
  return out;
}
function renderCardio(){
  const p=state.profil;
  const el=$('#cardio-wrap'); if(!el) return;
  if(!p.date){ el.innerHTML='<div class="card center">Complétez d\'abord votre profil pour activer le plan cardio.</div>'; return; }
  const pos=programPos(todayKey());
  const plan=weekPlan(todayKey());
  const fc=fcm();
  const rm=moyenneRecup();
  const recommand = rm!=null && rm<60 ? 'piscine' : null;
  let html='';
  /* Bandeau zones cardiaques */
  html+='<div class="card glow"><div class="spread"><div>'+
    '<span class="chip chip-blue">❤️ Fréquence cardiaque maximale estimée : <b>'+fc+' bpm</b></span>'+
    '<h2 class="mt" style="font-size:18px;font-weight:900">Vos zones de travail</h2>'+
    '<div class="small mut mt">Formule de Tanaka (208 − 0,7 × âge), plus fiable que 220 − âge après 40 ans.</div></div></div>'+
    '<div class="grid g4 mt">'+ZONES_CARDIO.map((z,i)=>{
      const a=Math.round(fc*z.pct[0]), b=Math.round(fc*z.pct[1]);
      return '<div class="tile"><div class="t-ic">'+z.ic+'</div><div class="t-lbl">'+esc(z.n)+'</div>'+
        '<div class="t-val" style="font-size:17px">'+a+'-'+b+'</div><div class="t-delta mut" style="font-size:10.5px">'+esc(z.usage)+'</div></div>';
    }).join('')+'</div></div>';

  /* Carte du jour */
  const todayPlan=plan.find(x=>x.date===todayKey());
  const cToday=state.cardio[todayKey()];
  if(todayPlan && todayPlan.type==='metcon' && todayPlan.cardio){
    const cd=todayPlan.cardio;
    html+='<div class="card mt" style="border-color:rgba(58,160,255,.4)"><div class="spread"><div>'+
      '<span class="chip chip-blue">🚴 Aujourd\'hui : cardio prévu</span>'+
      '<h3 class="mt" style="font-size:16px">'+esc(cd.label)+'</h3>'+
      '<p class="small mut mt">'+esc(cd.detail)+'</p>'+
      '<div class="flex mt"><span class="chip chip-mut">Zone cible : '+esc(cd.zoneNom)+' ('+Math.round(fc*cd.zonePct[0])+'-'+Math.round(fc*cd.zonePct[1])+' bpm)</span></div>'+
      '</div><button class="btn btn-grad" onclick="openCardioLog(\''+todayKey()+'\')">📝 '+(cToday?'Modifier':'Enregistrer')+'</button></div></div>';
  } else if(cToday){
    html+='<div class="card mt" style="border-color:rgba(45,212,167,.4)"><div class="spread"><div><span class="chip chip-green">✅ Cardio enregistré aujourd\'hui</span>'+
      '<h3 class="mt" style="font-size:16px">'+CARDIO_TYPES[cToday.format].ic+' '+esc(CARDIO_TYPES[cToday.format].n)+' · '+cToday.duree+' min · ≈'+cToday.kcal+' kcal</h3></div>'+
      '<button class="btn btn-line btn-sm" onclick="openCardioLog(\''+todayKey()+'\')">📝 Modifier</button></div></div>';
  }

  /* Plan de la semaine + choix du support */
  html+='<div class="sectitle mt2"><div class="bar"></div><h2>Cette semaine — choisissez votre support</h2>'+
    '<span class="sub">elliptique · piscine · repos actif</span></div><div class="card">';
  if(recommand) html+='<div class="ok-box mb">🌿 Récupération moyenne faible ('+rm+'/100) : la <b>piscine</b> ou le <b>repos actif</b> sont recommandés cette semaine plutôt que l\'elliptique.</div>';
  html+='<div class="tbl-wrap"><table class="tbl"><tr><th>Jour</th><th>Prévu</th><th>Votre choix</th><th>Statut</th></tr>';
  plan.forEach(d2=>{
    const nom=['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][d2.wk];
    if(d2.type==='seance'){
      const s=d2.session;
      const apres = s && s.cardio;
      const done=state.cardio[d2.date];
      html+='<tr><td class="b">'+nom+'</td><td>'+esc(d2.label)+(apres?'<div class="tiny mut">+ '+CARDIO_TYPES[apres.apres].ic+' '+apres.duree+' min après la séance</div>':'')+'</td>'+
        '<td>'+(apres? '<div class="flex">'+Object.keys(CARDIO_TYPES).map(k=>
          '<button class="btn btn-line btn-sm" style="'+(((state.cardioChoix[d2.date]||apres.apres)===k)?'border-color:var(--acc);color:var(--acc)':'')+'" onclick="setCardioChoix(\''+d2.date+'\',\''+k+'\')" title="'+esc(CARDIO_TYPES[k].n)+'">'+CARDIO_TYPES[k].ic+'</button>').join('')+'</div>':'<span class="chip chip-mut">—</span>')+'</td>'+
        '<td class="center">'+(done? '<span class="chip chip-green">✅ '+done.duree+' min</span>' : (apres? '<button class="btn btn-line btn-sm" onclick="openCardioLog(\''+d2.date+'\')">📝</button>':'—'))+'</td></tr>';
    } else if(d2.type==='metcon'){
      const cd=d2.cardio;
      const done=state.cardio[d2.date];
      html+='<tr><td class="b">'+nom+'</td><td>'+esc(cd.label)+'<div class="tiny mut">'+esc(cd.zoneNom)+' · '+Math.round(fc*cd.zonePct[0])+'-'+Math.round(fc*cd.zonePct[1])+' bpm</div></td>'+
        '<td><div class="flex">'+Object.keys(CARDIO_TYPES).map(k=>
          '<button class="btn btn-line btn-sm" style="'+(((state.cardioChoix[d2.date]||cd.format)===k)?'border-color:var(--acc);color:var(--acc)':'')+'" onclick="setCardioChoix(\''+d2.date+'\',\''+k+'\')" title="'+esc(CARDIO_TYPES[k].n)+'">'+CARDIO_TYPES[k].ic+'</button>').join('')+'</div></td>'+
        '<td class="center">'+(done? '<span class="chip chip-green">✅ '+done.duree+' min</span>' : '<button class="btn btn-line btn-sm" onclick="openCardioLog(\''+d2.date+'\')">📝</button>')+'</td></tr>';
    } else {
      html+='<tr><td class="b">'+nom+'</td><td class="mut">Repos</td><td class="mut">—</td><td class="center mut">—</td></tr>';
    }
  });
  html+='</table></div><div class="note-box mt">🚴 <b>Règle d\'or :</b> le cardio ne doit jamais compromettre la récupération des fessiers. Jamais de fractionné la veille d\'une séance fessiers. En cas de courbatures importantes ou de fatigue, remplacez l\'elliptique par la piscine ou une marche active — vous ne perdrez rien, vous gagnerez en récupération.</div></div>';

  /* Formats détaillés */
  html+='<div class="sectitle mt2"><div class="bar"></div><h2>Les trois supports</h2></div><div class="grid g3">'+
    Object.keys(CARDIO_TYPES).map(k=>{
      const t=CARDIO_TYPES[k];
      const seances = k==='elliptique'? ['Modéré 20-25 min (zone 2) — 2×/sem.','Fractionné 6-10 × 30 s rapide / 60-90 s lent — 1×/sem. maximum.','Récupération 12-15 min (zone 1) en fin de séance.']
        : k==='piscine'? ['Nage continue 20-30 min souple.','Aquagym 30 min : renforcement sans impact.','Marche dans l\'eau 20 min + mobilité 10 min.']
        : ['Marche active 35-45 min.','Mobilité hanches / épaules 15 min.','Étirements + respiration 10 min.'];
      return '<div class="card"><div class="spread mb"><b style="font-size:16px">'+t.ic+' '+t.n+'</b></div>'+
        '<p class="small mut">'+esc(t.desc)+'</p><ul style="padding-left:18px;margin-top:10px;color:var(--mut);font-size:13px;line-height:1.8">'+
        seances.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>';
    }).join('')+'</div>';

  /* Séances piscine types */
  html+='<div class="sectitle mt2"><div class="bar"></div><h2>🏊 Séances type à la piscine</h2></div><div class="grid g2">'+
    [['Récupération active (25 min)','🌿','5 min marche dans l\'eau · 10 min nage très souple (brasse ou crawl lent) · 5 min aquagym léger · 5 min étirements dans l\'eau. Idéale le lendemain d\'une grosse séance fessiers ou en semaine de deload.'],
     ['Endurance sans impact (30 min)','🏊','5 min échauffement · 4 × 5 min nage continue (30 s de pause) · 5 min retour au calme. Travail cardiovasculaire complet sans aucun impact articulaire.'],
     ['Renforcement aquatique (30 min)','💪','5 min marche · 10 min aquagym (squats, fentes et abductions dans l\'eau) · 10 min nage · 5 min étirements. Rappel fessier sans fatigue nerveuse.'],
     ['Semaine de fatigue (20 min)','😴','10 min marche dans l\'eau · 5 min nage très lente · 5 min respiration et étirements. Objectif : faire circuler, pas performer.']
    ].map(([t,ic,d])=>'<div class="card"><div class="spread mb"><b>'+ic+' '+esc(t)+'</b></div><p class="small mut">'+esc(d)+'</p></div>').join('')+'</div>';

  /* Historique + graphique */
  const entries=Object.keys(state.cardio).sort();
  const totMin=entries.reduce((a,d)=>a+(+state.cardio[d].duree||0),0);
  const totKcal=entries.reduce((a,d)=>a+(+state.cardio[d].kcal||0),0);
  html+='<div class="sectitle mt2"><div class="bar"></div><h2>Historique cardio</h2></div>'+
    '<div class="grid g4">'+
    tile('🚴','Séances cardio', entries.length+'', 'enregistrées','gold')+
    tile('⏱️','Durée totale', totMin? Math.round(totMin/60)+' h '+String(totMin%60).padStart(2,'0'):'—','cumulées','up')+
    tile('🔥','Kcal estimées', totKcal? Math.round(totKcal/1000*10)/10+' k':'—','dépensées','up')+
    tile('❤️','FCM', fc+' bpm','zone 2 : '+Math.round(fc*0.6)+'-'+Math.round(fc*0.7)+' bpm','')
    +'</div>'+
    '<div class="card mt"><div class="chart-box"><canvas id="chart-cardio" class="chart"></canvas></div></div>';
  if(entries.length){
    html+='<div class="card mt"><div class="tbl-wrap"><table class="tbl"><tr><th>Date</th><th>Activité</th><th class="num">Durée</th><th class="num">RPE</th><th class="num">Kcal</th><th>Note</th></tr>'+
      entries.slice().reverse().slice(0,20).map(d=>{
        const c=state.cardio[d];
        return '<tr><td>'+fmtDateShort(d)+'</td><td><b>'+(CARDIO_TYPES[c.format]||{}).ic+' '+esc((CARDIO_TYPES[c.format]||{}).n||c.format)+'</b></td>'+
          '<td class="num">'+c.duree+' min</td><td class="num">'+(c.rpe||'—')+'</td><td class="num">'+(c.kcal||'—')+'</td><td class="small mut">'+esc(c.note||'')+'</td></tr>';
      }).join('')+'</table></div></div>';
  }
  el.innerHTML=html;
  /* graphique : minutes de cardio par semaine */
  const cv=$('#chart-cardio');
  if(cv){
    const vol=cardioSemaineVolume();
    const keysW=Object.keys(vol).map(Number);
    const maxW=Math.max(nbSemainesEcoulees(), ...keysW, 4);
    const labs=[], vals=[];
    for(let i=1;i<=maxW;i++){ labs.push('S'+i); vals.push(vol[i]||0); }
    barChart(cv, labs, vals, {color:'#3aa0ff', color2:'#a78bfa', empty:'Enregistrez vos séances de cardio pour suivre votre volume hebdomadaire (en minutes).'});
  }
}

/* ================== 📊 TABLEAU DE BORD TRANSFORMATION ================== */
function perfActuelle(key){
  const h=perfHistorique(key);
  if(!h.length) return null;
  return {v:round1(h[h.length-1].v), first:round1(h[0].v), n:h.length,
          gain: h[0].v? round1((h[h.length-1].v-h[0].v)/h[0].v*100) : null};
}
/* Index global de transformation (0-100) : corps + performance + régularité */
function indiceTransformation(){
  const s1=scoreProgressionMesures();          // corporel
  const s2=scorePerformance();                 // performance
  const adh=scoreAdherenceGlobal();            // régularité
  const rm=moyenneRecup();
  const s3=adh==null?50:adh;
  const s4=rm==null?50:rm;
  const total=Math.round(s1*0.32 + s2*0.30 + s3*0.24 + s4*0.14);
  return {total, corporel:s1, perf:s2, adherence:s3, recup:s4};
}
function renderTransfo(){
  const el=$('#transfo-wrap'); if(!el) return;
  const p=state.profil;
  if(!p.date){ el.innerHTML='<div class="card center">Complétez d\'abord votre profil et vos mensurations du Jour 0 pour activer le tableau de bord de transformation.</div>'; return; }
  const d=deltasMensurations();
  const pa=poidsActuel(), pd=parseFloat(p.poidsDepart);
  const dPoids = (pa!=null&&pd)? round1(pa-pd) : null;
  const idx=indiceTransformation();
  let html='';

  /* En-tête : lecture des résultats */
  html+='<div class="card glow"><div class="spread"><div>'+
    '<span class="chip chip-gold">🎯 Corps plus ferme · ventre plus plat · fesses plus rondes · silhouette harmonieuse</span>'+
    '<h2 class="mt" style="font-size:19px;font-weight:900">Votre transformation, mesurée autrement que par la balance</h2>'+
    '<p class="small mut mt">Une prise de poids peut être une excellente nouvelle : si vos charges montent, que votre tour de taille baisse et que votre tour de fessiers augmente, c\'est de la recomposition corporelle — exactement ce que vous cherchez.</p>'+
    '</div><div style="text-align:center"><div class="gauge" id="gauge-transfo"></div><b class="small mut">Indice de transformation</b></div></div></div>';

  /* Données corporelles */
  html+='<div class="sectitle mt2"><div class="bar"></div><h2>Données corporelles</h2><span class="sub">Jour 0 → dernier relevé</span></div>';
  const corpsCles=[
    ['poids','Poids', dPoids!=null? ((dPoids>0?'+':'')+dPoids+' kg') : null, 'kg', 0],
    ['taille','Tour de taille', d&&d.taille? d.taille.d : null, 'cm', -1],
    ['ventre','Tour de ventre', d&&d.ventre? d.ventre.d : null, 'cm', -1],
    ['hanches','Tour de hanches', d&&d.hanches? d.hanches.d : null, 'cm', 0],
    ['fessiers','Tour de fessiers', d&&d.fessiers? d.fessiers.d : null, 'cm', +1],
    ['cuisse','Tour de cuisse', d&&d.cuisseD? round1(((d.cuisseD.d||0)+(d.cuisseG?d.cuisseG.d:0))/2) : null, 'cm', +1]
  ];
  html+='<div class="grid g3">'+corpsCles.map(([k,lbl,dv,unit,sens])=>{
    let cls='mut', verdict='à mesurer';
    if(dv!=null){
      if(sens===0){ cls = Math.abs(dv)<=0.8?'green':(dv>0?'orange':'blue'); verdict = Math.abs(dv)<=0.8?'stable':(dv>0?'en hausse':'en baisse'); }
      else {
        const bon = dv*sens > 0.3;
        const neutre = Math.abs(dv)<=0.3;
        cls = bon?'green':(neutre?'blue':'orange');
        verdict = bon?'dans le bon sens ✅':(neutre?'stable':'à surveiller');
      }
    }
    const val = k==='poids'? (pa!=null? pa.toFixed(1)+' kg':'—')
              : d&&d[k==='cuisse'?'cuisseD':k]? d[k==='cuisse'?'cuisseD':k].b.toFixed(1)+' cm':'—';
    return '<div class="tile"><div class="t-lbl">'+lbl+'</div><div class="t-val" style="font-size:20px">'+val+'</div>'+
      '<div class="t-delta '+(cls==='green'?'up':cls==='orange'?'down':'mut')+'">'+(dv!=null?((dv>0?'+':'')+round1(dv)+' '+unit+' · '+verdict):verdict)+'</div></div>';
  }).join('')+'</div>';

  /* Lecture intelligente */
  html+='<div class="card mt">'+lectureTransformation(d, dPoids)+'</div>';

  /* Performances */
  html+='<div class="sectitle mt2"><div class="bar"></div><h2>Performances</h2><span class="sub">1RM estimé (formule d\'Epley)</span></div>';
  const perfs=[
    ['hipthrust','🍑 Hip thrust','Priorité absolue — c\'est l\'indicateur n°1 du galbe'],
    ['squat','🦵 Squat','Jambes fermes, quadriceps contrôlés'],
    ['rdl','🍑 Soulevé de terre roumain','Ischios toniques, fermeté sous la fesse'],
    ['bulgarian','🦵 Bulgarian split squat','Unilatéral : symétrie et galbe'],
    ['row','🦍 Rowing / tirage','Dos tonique et posture']
  ];
  html+='<div class="tbl-wrap"><table class="tbl"><tr><th>Mouvement</th><th class="num">1RM actuel</th><th class="num">Au départ</th><th class="num">Évolution</th><th>Rôle</th></tr>'+
    perfs.map(([k,nom,role])=>{
      const pf=perfActuelle(k);
      return '<tr><td><b>'+nom+'</b></td>'+
        '<td class="num gold">'+(pf? fmtKg(pf.v):'—')+'</td>'+
        '<td class="num">'+(pf&&pf.n>1? fmtKg(pf.first):'—')+'</td>'+
        '<td class="num '+(pf&&pf.gain>0?'up':pf&&pf.gain<0?'down':'mut')+'">'+(pf&&pf.gain!=null?((pf.gain>0?'+':'')+pf.gain+' %'):'—')+'</td>'+
        '<td class="small mut">'+esc(role)+'</td></tr>';
    }).join('')+'</table></div>';

  /* Cardio */
  const cEntries=Object.keys(state.cardio).sort();
  const cMin=cEntries.reduce((a,dd)=>a+(+state.cardio[dd].duree||0),0);
  const cKcal=cEntries.reduce((a,dd)=>a+(+state.cardio[dd].kcal||0),0);
  html+='<div class="grid g4 mt">'+
    tile('🚴','Séances cardio', cEntries.length+'','enregistrées','')+
    tile('⏱️','Volume cardio', cMin? Math.round(cMin)+' min':'—','cumulé','up')+
    tile('🔥','Dépense cardio', cKcal? Math.round(cKcal)+' kcal':'—','estimée','up')+
    tile('📈','Progression globale', idx.perf>20? '+'+(idx.perf-20)+' %':'—','est. via 1RM','up')+
    '</div>';

  /* Graphiques */
  html+='<div class="sectitle mt2"><div class="bar"></div><h2>Courbes de la transformation</h2><span class="sub">mises à jour automatiquement</span></div>'+
    '<div class="grid g2">'+
    '<div class="card"><h3 class="mb">⚖️ Poids</h3><canvas id="chart-tr-poids" class="chart"></canvas></div>'+
    '<div class="card"><h3 class="mb">📏 Tour de taille</h3><canvas id="chart-tr-taille" class="chart"></canvas></div>'+
    '<div class="card"><h3 class="mb">🍑 Hanches &amp; fessiers</h3><canvas id="chart-tr-hanches" class="chart"></canvas></div>'+
    '<div class="card"><h3 class="mb">🦵 Cuisses</h3><canvas id="chart-tr-cuisses" class="chart"></canvas></div>'+
    '<div class="card"><h3 class="mb">🏋️ Charges — bas du corps</h3><canvas id="chart-tr-perf1" class="chart"></canvas></div>'+
    '<div class="card"><h3 class="mb">💪 Charges — haut du corps &amp; unilatéral</h3><canvas id="chart-tr-perf2" class="chart"></canvas></div>'+
    '</div>'+
    '<div class="card mt"><h3 class="mb">📈 Évolution globale (indice composite)</h3><div class="chart-box"><canvas id="chart-tr-global" class="chart"></canvas></div>'+
    '<div class="note-box mt">Indice composite = 32 % corporel (mensurations selon leur sens souhaité) + 30 % performance (1RM) + 24 % régularité + 14 % récupération. Il monte même quand le poids stagne : c\'est le signe d\'une vraie recomposition.</div></div>';

  el.innerHTML=html;

  /* Gauges & graphiques */
  const g=$('#gauge-transfo'); if(g) g.innerHTML=gaugeSVG(idx.total, '#ff6fae', idx.total+'/100');
  const pe=Object.entries(state.poids).sort();
  lineChart($('#chart-tr-poids'), pe.map(x=>fmtDateShort(x[0])), [{name:'Poids',color:'#ff6fae',data:pe.map(x=>+x[1])}], {unit:' kg', empty:'Saisissez vos pesées (3×/semaine)'});
  const mm=state.mensurations.mensuel||{}; const keys=Object.keys(mm).sort();
  const j0=state.mensurations.jour0||{};
  const labels=['J0',...keys];
  const pick=(k)=>labels.map(l=> l==='J0'? (j0[k]!=null?parseFloat(j0[k]):null) : (mm[l]&&mm[l][k]!=null? parseFloat(mm[l][k]):null));
  lineChart($('#chart-tr-taille'), labels, [{name:'Taille',color:'#ff5252',data:pick('taille')},{name:'Ventre',color:'#ff9f43',data:pick('ventre')}], {unit:' cm', empty:'Renseignez le Jour 0 puis vos relevés mensuels'});
  lineChart($('#chart-tr-hanches'), labels, [{name:'Fessiers',color:'#ff6fae',data:pick('fessiers')},{name:'Hanches',color:'#a78bfa',data:pick('hanches')}], {unit:' cm', empty:'Renseignez le Jour 0 puis vos relevés mensuels'});
  lineChart($('#chart-tr-cuisses'), labels, [{name:'Cuisse D',color:'#2dd4a7',data:pick('cuisseD')},{name:'Cuisse G',color:'#3aa0ff',data:pick('cuisseG')}], {unit:' cm', empty:'Renseignez le Jour 0 puis vos relevés mensuels'});
  ['hipthrust','squat','rdl'].forEach(()=>{});
  const ser1=[{name:'Hip thrust',color:'#ff6fae',data:[]},{name:'Squat',color:'#ff6fae',data:[]},{name:'SDT roumain',color:'#2dd4a7',data:[]}];
  const ser2=[{name:'Bulgarian',color:'#3aa0ff',data:[]},{name:'Rowing/tirage',color:'#a78bfa',data:[]}];
  const dates1=unionDates(['hipthrust','squat','rdl']);
  const dates2=unionDates(['bulgarian','row']);
  ser1.forEach((s,i)=>{ s.data=dates1.map(dd=>pointAt(['hipthrust','squat','rdl'][i], dd)); });
  ser2.forEach((s,i)=>{ s.data=dates2.map(dd=>pointAt(['bulgarian','row'][i], dd)); });
  lineChart($('#chart-tr-perf1'), dates1.map(fmtDateShort), ser1, {unit:' kg', empty:'Journalisez vos séances fessiers et jambes'});
  lineChart($('#chart-tr-perf2'), dates2.map(fmtDateShort), ser2, {unit:' kg', empty:'Journalisez vos séances haut du corps'});
  lineChart($('#chart-tr-global'), histIndiceGlobal().map(x=>fmtDateShort(x.date)), [{name:'Indice global',color:'#ff6fae',data:histIndiceGlobal().map(x=>x.v)}], {unit:'', empty:'L\'indice se construit au fil de vos relevés et de vos séances'});
}
function unionDates(keys){
  const set=new Set();
  keys.forEach(k=>perfHistorique(k).forEach(x=>set.add(x.date)));
  return [...set].sort();
}
function pointAt(key, date){
  const h=perfHistorique(key);
  let v=null;
  h.forEach(x=>{ if(x.date<=date) v=x.v; });
  return v;
}
/* Historique de l'indice global reconstruit à partir des relevés mensuels */
function histIndiceGlobal(){
  const mm=state.mensurations.mensuel||{};
  const keys=Object.keys(mm).sort();
  const out=[];
  const base=state.mensurations.jour0||{};
  const bareme={taille:4,ventre:4,fessiers:4,cuisseD:2,cuisseG:2,hanches:1.5,brasD:1.5,brasG:1.5};
  keys.forEach((k,i)=>{
    let sc=0,n=0;
    Object.keys(bareme).forEach(f=>{
      const a=parseFloat(base[f]), b=parseFloat(mm[k][f]);
      const sens=MENS_SENS[f]||0; if(!a||!b||!sens) return;
      sc+=clamp(50+((b-a)*sens)/bareme[f]*50,0,100); n++;
    });
    const corp = n? Math.round(sc/n) : 50;
    const perf = clamp(Math.round(50 + (i+1)*4),0,100);
    out.push({date: dernierMensDateApprox(k), v: Math.round(corp*0.6 + perf*0.4)});
  });
  if(!out.length){ const cur=indiceTransformation().total; out.push({date:todayKey(), v:cur}); }
  return out;
}
function dernierMensDateApprox(mk){
  /* Les relevés mensuels sont indexés M1..M12 : on approxime la date réelle. */
  const n=parseInt(String(mk).replace(/\D/g,''))||1;
  return dateKey(addDays(parseDate(startDate()), n*30));
}
/* Lecture intelligente des données corporelles */
function lectureTransformation(d, dPoids){
  const msgs=[];
  if(dPoids==null && !d) return '<p class="small mut">Renseignez votre poids (3×/semaine) et vos mensurations (1×/mois) pour obtenir une analyse.</p>';
  const t = d&&d.taille? d.taille.d : null;
  const f = d&&d.fessiers? d.fessiers.d : null;
  const c = d&&d.cuisseD? round1(((d.cuisseD.d||0)+(d.cuisseG?d.cuisseG.d:0))/2) : null;
  const h = d&&d.hanches? d.hanches.d : null;
  const pfH=perfActuelle('hipthrust'), pfR=perfActuelle('rdl');
  const perfMonte = (pfH&&pfH.gain>2)||(pfR&&pfR.gain>2);
  if(dPoids!=null && dPoids>0.3 && (t==null || t<=0.3) && perfMonte){
    msgs.push({c:'ok', t:'✅ <b>Recomposition corporelle en cours.</b> Votre poids augmente de +'+round1(dPoids)+' kg mais votre tour de taille '+(t!=null?'ne bouge pas ('+t+' cm)':'reste stable')+' et vos charges progressent : c\'est du muscle, pas du gras. <b>Ne réduisez pas vos calories</b> — c\'est exactement le mécanisme qui construit le galbe.'});
  }
  if(dPoids!=null && dPoids<-0.5 && t!=null && t<-0.5){
    msgs.push({c:'ok', t:'✅ <b>Perte de masse grasse confirmée.</b> '+round1(dPoids)+' kg et '+round1(t)+' cm de tour de taille : la sangle abdominale se resserre. Vérifiez que le tour de fessiers ne baisse pas en même temps — sinon remontez légèrement les calories.'});
  }
  if(f!=null && f>=1 && (t==null||t<=0.5)){
    msgs.push({c:'ok', t:'🍑 <b>Galbe en construction.</b> +'+round1(f)+' cm de tour de fessiers'+(t!=null?' avec '+round1(t)+' cm de tour de taille':'')+' : c\'est le résultat le plus recherché de votre programme.'});
  }
  if(f!=null && f<=-1.5){
    msgs.push({c:'warn', t:'⚠️ <b>Tour de fessiers en baisse ('+round1(f)+' cm).</b> Vous perdez probablement du muscle. Remontez les calories de 150-200 kcal, portez les protéines à 1,9-2,0 g/kg et conservez le hip thrust lourd : c\'est lui qui protège le galbe en déficit.'});
  }
  if(c!=null && c>=1){
    msgs.push({c:'ok', t:'🦵 <b>Cuisses +'+round1(c)+' cm</b> : jambes plus fermes et dessinées.'});
  }
  if(t!=null && t>1.5 && dPoids!=null && dPoids<=0){
    msgs.push({c:'warn', t:'⚠️ <b>Tour de taille +'+round1(t)+' cm sans prise de poids.</b> Signal possible : sommeil insuffisant, stress, rétention d\'eau ou apport en glucides trop concentré le soir. Priorité au sommeil (7 h 30-9 h) et glucides déplacés autour de l\'entraînement.'});
  }
  if(!msgs.length){
    msgs.push({c:'info', t:'ℹ️ Vos données sont encore insuffisantes pour une conclusion fiable. Le minimum utile : <b>poids 3 fois par semaine</b>, <b>mensurations une fois par mois</b> (taille, ventre, hanches, fessiers, cuisses) et <b>charges notées à chaque séance</b>. Les trois ensemble permettent de distinguer une vraie recomposition d\'une simple variation de poids.'});
  }
  return msgs.map(m=>'<div class="'+(m.c==='ok'?'ok-box':m.c==='warn'?'danger-box':'note-box')+(msgs.indexOf(m)?' mt':'')+'">'+m.t+'</div>').join('');
}

/* ================== 📸 BILANS PHOTO TOUTES LES 4 SEMAINES ================== */
const JALONS_PHOTO = ['j0','m3','m6','m9','m12'];
const JALONS_LABELS = {j0:'Jour 0',m3:'Mois 3',m6:'Mois 6',m9:'Mois 9',m12:'Mois 12'};
function ensurePhotoSlot(k){
  if(!state.photos[k]) state.photos[k]={face:'',profil:'',dos:'',compl:''};
  return state.photos[k];
}
function photoCheckpoints(){
  const out=[];
  const sem=nbSemainesEcoulees();
  for(let s=4; s<=Math.max(4, sem+4); s+=4){
    if(s>=48) break;
    out.push({key:'s'+s, label:'Semaine '+s, sem:s});
  }
  return out;
}
function photoRappelEtat(){
  if(!state.profil.date) return null;
  const sem=nbSemainesEcoulees();
  const dernierJalon = Math.floor(sem/4)*4;      // 0, 4, 8…
  if(dernierJalon===0) return {due:false, joursRestants:null, prochain:4};
  const dateJalon=dateKey(addDays(parseDate(state.profil.date), dernierJalon*7));
  const retard = Math.floor((parseDate(todayKey())-parseDate(dateJalon))/86400000);
  const slot=state.photos['s'+dernierJalon];
  const dejaFait = !!(slot && (slot.face||slot.profil||slot.dos));
  const prochain = dernierJalon+4;
  const joursAvant = Math.max(0, 28 - retard);
  return {due: !dejaFait && retard>=0, jalon:dernierJalon, slot:'s'+dernierJalon,
          joursRestants: dejaFait?null:retard, prochain, joursAvant, dejaFait,
          dateJalon};
}

/* ================== INIT ================== */
function applyEmbeddedPhotos(){
  // Charge les photos embarquées (Jour 0 réelles + simulation Mois 12) dans la galerie,
  // uniquement si l'utilisateur n'a pas déjà mis ses propres photos.
  if(typeof EMBEDDED_PHOTOS==='undefined') return;
  let applique=false;
  Object.keys(EMBEDDED_PHOTOS).forEach(slot=>{
    const cible = state.photos[slot] || {};
    Object.keys(EMBEDDED_PHOTOS[slot]).forEach(vue=>{
      const cur = cible[vue];
      const estVide = !cur || String(cur).length<100;
      if(estVide){ cible[vue]=EMBEDDED_PHOTOS[slot][vue]; applique=true; }
    });
  });
  if(applique) save();
}

/* ============================================================
   POOL LAB (V5) — piscine : protocoles guidés, minuteur,
   guides d'exercices (GIFs), jours piscine, détente du repos.
   Porté depuis le fichier coach et adapté au programme d'Émilie.
   ============================================================ */
function ENS_NAT(){ try{ if(!state.natation||typeof state.natation!=='object') state.natation={seances:[],planDim:false,jours:[5],checks:{}}; if(!Array.isArray(state.natation.seances)) state.natation.seances=[]; if(!Array.isArray(state.natation.jours)) state.natation.jours=[]; if(!state.natation.checks||typeof state.natation.checks!=='object') state.natation.checks={}; }catch(_){} }
function _protoDur(steps){ return (steps||[]).reduce((a,x)=>a+(+x[1]||0),0); }
function _fmtDur(sec){ sec=Math.round(sec||0); const m=Math.floor(sec/60), s=sec%60; return m+' min'+(s?' '+s+' s':''); }
function _R(n, wLbl, wS, rLbl, rS){ const o=[]; for(let i=1;i<=n;i++){ o.push([wLbl+' '+i+'/'+n, wS]); if(rS>0) o.push([rLbl, rS]); } return o; }
function _aquaTours(tours){
  const bloc=[['Aqua-jogging sur place',40],['Repos',20],['Montées de genoux',40],['Repos',20],
    ['Ciseaux — mains au bord',40],['Repos',20],['Déplacements latéraux (4 m)',40],['Repos',20],
    ['Gainage vertical au bord',40],['Repos',20]];
  const o=[['Échauffement — marche aquatique',180]];
  for(let t=1;t<=tours;t++){ o.push(['Tour '+t+'/'+tours+' — en place',5]); bloc.forEach(s=>o.push(s)); }
  o.push(['Retour au calme — nage douce',180]);
  return o;
}
function _aquaTabata(cycles){
  const mv=['Aqua-jogging','Montées de genoux','Ciseaux au bord','Battements de jambes','Déplacements latéraux (4 m)','Pompes au bord','Gainage vertical','Talons-fesses'];
  const o=[['Échauffement — marche aquatique',120]];
  for(let c=1;c<=cycles;c++){
    o.push(['Tabata '+c+'/'+cycles+' — en place',5]);
    mv.forEach(m=>{ o.push([m+' — EFFORT',20]); o.push(['Repos',10]); });
    if(c<cycles) o.push(['Récup entre tabatas',120]);
  }
  o.push(['Retour au calme — nage douce',120]);
  return o;
}
let __AC=null;
function beep(f,d){
  try{
    __AC=__AC||new (window.AudioContext||window.webkitAudioContext)();
    if(__AC.state==='suspended') __AC.resume();
    const o=__AC.createOscillator(), g=__AC.createGain();
    o.type='sine'; o.frequency.value=f||880; g.gain.value=0.12;
    o.connect(g); g.connect(__AC.destination);
    o.start(); o.stop(__AC.currentTime+(d||0.15));
  }catch(_){}
}
function poolSay(text){
  try{
    if(!ttsSupported()) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang='fr-FR'; u.rate=1.02; u.pitch=1;
    const v=(window.speechSynthesis.getVoices()||[]).find(x=>/^fr/i.test(x.lang));
    if(v) u.voice=v;
    window.speechSynthesis.speak(u);
  }catch(_){}
}
const POOL_PROTOS=[
  {id:'endurance', ic:'🌊', nom:'Swim Endurance', desc:'Fond aquatique : nage statique à l\'élastique (ou battements au bord) en zone facile. Idéal en récupération active.',
   niveaux:[
    {n:'BEGINNER', conseil:'Allure facile : vous pouvez parler. Élastique souple ou battements amples au bord.', steps:[['Échauffement — battements au bord',120],['Nage statique douce',240],['Récup — marche aquatique',60],['Nage statique douce',240],['Retour au calme + respiration',120]]},
    {n:'INTERMEDIATE', conseil:'Deux blocs Z2. Focus glisse et respiration régulière (tous les 3 temps si crawl).', steps:[['Échauffement — battements + mobilité',180],['Nage statique Z2',420],['Récup — marche aquatique',90],['Nage statique Z2',420],['Retour au calme — nage très douce',180]]},
    {n:'ADVANCED', conseil:'Gros volume Z2/Z3. Gardez la technique propre jusqu\'au bout.', steps:[['Échauffement — nage douce',180],['Nage statique Z2',600],['Récup active — marche aquatique',90],['Nage statique Z2/Z3',600],['Nage douce',120],['Retour au calme + mobilité',240]]}
   ]},
  {id:'interval', ic:'⚡', nom:'Swim Interval', desc:'Intervalles soutenus / récupération. Le format roi du petit bassin : intensité sans longueurs.',
   niveaux:[
    {n:'BEGINNER', conseil:'6 répétitions. Allure « soutenue mais propre », récup complète en marchant.', steps:[['Échauffement — nage douce',180]].concat(_R(6,'Nager — fractionné',30,'Récup — marche',60)).concat([['Retour au calme — nage très douce',180]])},
    {n:'INTERMEDIATE', conseil:'8 répétitions 45/45. La dernière doit être aussi propre que la première.', steps:[['Échauffement — nage douce',180]].concat(_R(8,'Nager — fractionné',45,'Récup active — marche aquatique',45)).concat([['Retour au calme — nage très douce',180]])},
    {n:'ADVANCED', conseil:'10 répétitions 60/30. Séance exigeante : pas de muscu dure le même jour.', steps:[['Échauffement — nage douce',240]].concat(_R(10,'Nager — fractionné',60,'Récup courte — marche',30)).concat([['Retour au calme — nage très douce',240]])}
   ]},
  {id:'sprint', ic:'🔥', nom:'Swim Sprint', desc:'Sprints très courts + récup complète. Puissance et explosivité, zéro risque articulaire.',
   niveaux:[
    {n:'BEGINNER', conseil:'8 sprints de 15 s. À fond mais gainé, récup complète entre chacun.', steps:[['Échauffement soigneux — nage douce',180]].concat(_R(8,'Nager sprint',15,'Récup complète — souffler au bord',45)).concat([['Retour au calme — nage très douce',180]])},
    {n:'INTERMEDIATE', conseil:'10 sprints de 20 s. Qualité > quantité.', steps:[['Échauffement soigneux — nage douce',240]].concat(_R(10,'Nager sprint',20,'Récup complète — souffler au bord',40)).concat([['Retour au calme — nage très douce',240]])},
    {n:'ADVANCED', conseil:'12 sprints de 20 s, récup 30 s. Réservé aux jours 🟢.', steps:[['Échauffement soigneux — nage douce',240]].concat(_R(12,'Nager sprint',20,'Récup — marche',30)).concat([['Retour au calme',300]])}
   ]},
  {id:'aquahiit', ic:'💥', nom:'Aqua HIIT (sans nage)', desc:'Circuit debout : 40 s d\'effort / 20 s de repos. Parfait si vous ne voulez pas nager.',
   niveaux:[
    {n:'BEGINNER', conseil:'2 tours. Amplitude complète, appuis dynamiques au fond.', steps:_aquaTours(2)},
    {n:'INTERMEDIATE', conseil:'3 tours. Gardez le rythme sur les déplacements latéraux.', steps:_aquaTours(3)},
    {n:'ADVANCED', conseil:'4 tours. Séance complète corps entier.', steps:_aquaTours(4)}
   ]},
  {id:'recovery', ic:'🧊', nom:'Aqua Recovery', desc:'Récupération douce : nage lente, mobilité aquatique, respiration. Idéal lendemain de jambes.',
   niveaux:[
    {n:'DOUCE 12 MIN', conseil:'Très facile. L\'eau fait le travail : relâchez tout.', steps:[['Nage douce sur place',300],['Mobilité épaules aquatique',120],['Mobilité hanches / chevilles',120],['Étirements au bord',120]]},
    {n:'COMPLÈTE 18 MIN', conseil:'Notre protocole standard de récupération.', steps:[['Nage douce sur place',360],['Mobilité épaules aquatique',180],['Mobilité hanches / chevilles',180],['Nage douce + respiration',180],['Étirements au bord',120]]},
    {n:'TOTALE 25 MIN', conseil:'Version longue pour semaines chargées.', steps:[['Nage douce sur place',480],['Mobilité épaules aquatique',240],['Mobilité hanches / chevilles',240],['Nage douce + respiration',300],['Étirements au bord',240]]}
   ]},
  {id:'aquatabata', ic:'🔥', nom:'Aqua Tabata', desc:'Tabata 20/10 × 8 dans l\'eau : intense, ludique, zéro impact. Oui, le tabata se fait très bien en piscine !',
   niveaux:[
    {n:'BEGINNER ×2', conseil:'2 cycles. Mouvements amples, restez gainé.', steps:_aquaTabata(2)},
    {n:'INTERMEDIATE ×3', conseil:'3 cycles. Le standard : 4 min d\'effort dense par cycle.', steps:_aquaTabata(3)},
    {n:'ADVANCED ×4', conseil:'4 cycles. Séance complète, jours 🟢 uniquement.', steps:_aquaTabata(4)}
   ]}
];
let __pt=null;
function ensureTimerRoot(){
  let r=document.getElementById('timer-ov');
  if(!r){ r=document.createElement('div'); r.id='timer-ov'; r.className='demo-ov'; r.style.display='none'; document.body.appendChild(r); }
  return r;
}
function _fmtT(s){ s=Math.max(0,Math.ceil(s)); const m=Math.floor(s/60), r=s%60; return (m<10?'0':'')+m+':'+(r<10?'0':'')+r; }
function _runSteps(kind,title,sub,steps,meta){
  ensureTimerRoot();
  if(__pt&&__pt.iv){ clearInterval(__pt.iv); }
  __pt={kind:kind,title:title,sub:sub,steps:steps,meta:meta||{},idx:0,remain:steps[0][1],elapsed:0,paused:false,iv:null,last:Date.now(),rpe:7};
  _renderTimer();
  try{ poolSay(title+'. '+steps[0][0]); }catch(_){}
  beep(660,0.2);
  __pt.iv=setInterval(_tick,250);
}
function _tick(){
  const P=__pt; if(!P||P.paused) return;
  const now=Date.now(); const dt=Math.min(2,(now-P.last)/1000); P.last=now;
  const before=Math.ceil(P.remain);
  P.remain-=dt; P.elapsed+=dt;
  const cur=Math.ceil(P.remain);
  if(cur!==before&&cur<=3&&cur>0) beep(880,0.12);
  if(P.remain<=0){
    P.idx++;
    if(P.idx>=P.steps.length){ _finishTimer(); return; }
    P.remain=P.steps[P.idx][1];
    beep(660,0.25);
    try{ poolSay(P.steps[P.idx][0]); }catch(_){}
    _renderTimer();
  } else _renderTimerNums();
}
function _renderTimer(){
  const P=__pt; if(!P) return;
  const ov=ensureTimerRoot(); ov.style.display='flex';
  const done=P.steps.slice(0,P.idx).reduce((a,s)=>a+(+s[1]||0),0);
  const tot=_protoDur(P.steps)||1;
  const pct=Math.round((done+(P.steps[P.idx][1]-P.remain))/tot*100);
  const next=P.steps[P.idx+1]?P.steps[P.idx+1][0]:'Terminé 🏁';
  ov.innerHTML='<div class="timer-box"><div class="tiny mut">'+esc(P.title)+'</div><div class="small gold"><b>'+esc(P.sub)+'</b></div>'
    +'<div class="t-step">'+esc(P.steps[P.idx][0])+qBtnTimer()+'</div>'
    +'<div class="t-big" id="t-big">'+_fmtT(P.remain)+'</div>'
    +'<div class="pbar"><div class="fill" id="t-bar" style="width:'+pct+'%"></div></div>'
    +'<div class="small mut mt">Étape '+(P.idx+1)+'/'+P.steps.length+' · Ensuite : '+esc(next)+'</div>'
    +'<div class="flex mt" style="justify-content:center"><button class="btn btn-line" id="t-pause" onclick="_timerPause()">⏸ Pause</button><button class="btn btn-line" onclick="_timerSkip()">⏭ Étape suivante</button><button class="btn btn-red btn-sm" onclick="_timerStop()">■ Stop</button></div></div>';
}
function _renderTimerNums(){
  const P=__pt; if(!P) return;
  const b=document.getElementById('t-big'); if(b) b.textContent=_fmtT(P.remain);
  const bar=document.getElementById('t-bar');
  if(bar){ const done=P.steps.slice(0,P.idx).reduce((a,s)=>a+(+s[1]||0),0); const tot=_protoDur(P.steps)||1; bar.style.width=Math.round((done+(P.steps[P.idx][1]-P.remain))/tot*100)+'%'; }
}
function _timerPause(){ const P=__pt; if(!P) return; P.paused=!P.paused; P.last=Date.now(); const b=document.getElementById('t-pause'); if(b) b.textContent=P.paused?'▶ Reprendre':'⏸ Pause'; }
function _timerSkip(){ const P=__pt; if(!P) return; P.idx++; if(P.idx>=P.steps.length){_finishTimer();return;} P.remain=P.steps[P.idx][1]; P.last=Date.now(); _renderTimer(); }
function _timerStop(){ if(__pt&&__pt.iv) clearInterval(__pt.iv); __pt=null; const ov=document.getElementById('timer-ov'); if(ov) ov.style.display='none'; toast('⏹ Minuteur arrêté (non enregistré)'); }
function _finishTimer(){
  const P=__pt; if(!P) return;
  if(P.iv) clearInterval(P.iv);
  beep(880,0.2); setTimeout(function(){beep(880,0.2);},250); setTimeout(function(){beep(1175,0.4);},500);
  try{ poolSay('Protocole terminé. Bravo !'); }catch(_){}
  const ov=ensureTimerRoot();
  const pills=[1,2,3,4,5,6,7,8,9,10].map(v=>'<button class="btn btn-sm '+(v===7?'btn-grad':'btn-line')+'" data-rpe="'+v+'" onclick="_timerSetRpe('+v+',this)">'+v+'</button>').join('');
  ov.innerHTML='<div class="timer-box"><div class="t-step">🏁 Terminé !</div><div class="small mut">'+esc(P.title)+' · '+_fmtDur(Math.round(P.elapsed))+' effectifs</div>'
    +'<div class="field mt" style="text-align:left"><label>RPE ressenti (1–10)</label><div class="flex">'+pills+'</div></div>'
    +'<div class="field" style="text-align:left"><label for="t-note">Note (optionnel)</label><input class="inp" id="t-note" placeholder="Sensations, allure, eau froide…"></div>'
    +'<div class="flex" style="justify-content:center"><button class="btn btn-grad" onclick="_saveProtoResult()">💾 Enregistrer</button><button class="btn btn-line" onclick="_timerStop()">Sans enregistrer</button></div></div>';
}
function _timerSetRpe(v,btn){ if(__pt) __pt.rpe=v; const box=btn&&btn.parentElement; if(box){ Array.prototype.forEach.call(box.children,function(b){ b.className='btn btn-sm '+(+b.getAttribute('data-rpe')===v?'btn-grad':'btn-line'); }); } }
function _saveProtoResult(){
  const P=__pt; if(!P) return;
  ENS_NAT();
  const note=((document.getElementById('t-note')||{}).value||'');
  const duree=Math.max(1,Math.round(P.elapsed/60));
  if(P.kind==='elliptique'){
    ENS_CAR();
    state.cardio[todayKey()]={format:'elliptique', duree:duree, rpe:P.rpe||'', kcal:kcalCardio('elliptique',duree,P.rpe||''), note:String(note).slice(0,140)};
  } else {
    state[P.kind].seances.push({d:todayKey(), proto:((P.meta&&P.meta.label)||P.title), niv:((P.meta&&P.meta.niv)||''), duree:duree, secs:Math.round(P.elapsed), rpe:P.rpe||'', note:String(note).slice(0,140)});
    if(P.meta&&P.meta.combo){ const _cb=P.meta.combo; state[_cb.kind2].seances.push({d:todayKey(), proto:_cb.label2, niv:_cb.niv2||'', duree:_cb.duree2, secs:_cb.secs2, rpe:P.rpe||'', note:String(note).slice(0,140)}); }
    if(P.kind==='natation'){ try{ const _pl2=weekPlan(todayKey()).find(p=>p.date===todayKey()); if(_pl2 && _pl2.cardio && _pl2.cardio.format==='piscine'){ if(!state.cardio||typeof state.cardio!=='object') state.cardio={}; state.cardio[todayKey()]={format:'piscine', duree:duree, rpe:P.rpe||'', kcal:kcalCardio('piscine',duree,P.rpe||''), note:'Protocole piscine — '+((P.meta&&P.meta.label)||'')}; } }catch(_){} }
  }
  try{
    const _pl=weekPlan(todayKey()).find(p=>p.date===todayKey());
    if(_pl&&(_pl.type==='metcon'||_pl.type==='piscine'||!_pl.key)){ const _j=state.journal[todayKey()]||{exos:[]}; _j.statut='ok'; state.journal[todayKey()]=_j; state.seances[todayKey()]='ok'; }
  }catch(_){}
  save(); checkBadges();
  __pt=null; const ov=document.getElementById('timer-ov'); if(ov) ov.style.display='none';
  renderCurrent(); toast('✅ Séance enregistrée ('+duree+' min)');
}
function startProtocol(kind, id, li){
  ENS_NAT();
  const pr=POOL_PROTOS.find(p=>p.id===id); if(!pr) return;
  const nv=pr.niveaux[li||0];
  _runSteps('natation', pr.ic+' '+pr.nom, 'Niveau '+nv.n+' · base temps · zéro impact', nv.steps, {label:pr.nom, niv:nv.n});
}
function poolDays(){
  try{
    const n=state.natation||{};
    let j=Array.isArray(n.jours)?n.jours.slice():[];
    if(n.planDim&&j.indexOf(0)<0) j.push(0);
    return j;
  }catch(_){ return []; }
}
function togglePoolDay(d,v){
  ENS_NAT();
  let j=Array.isArray(state.natation.jours)?state.natation.jours.slice():[];
  d=+d;
  if(v&&j.indexOf(d)<0) j.push(d);
  if(!v) j=j.filter(x=>x!==d);
  state.natation.jours=j; state.natation.planDim=j.indexOf(0)>=0;
  save(); renderCurrent(); toast(v?'🏊 Piscine ajoutée ce jour-là':'🏊 Piscine retirée ce jour-là');
}
function poolStepsOf(pid, lvl){
  const pr=POOL_PROTOS.find(p=>p.id===pid); const nv=pr&&pr.niveaux[lvl||0];
  return (nv&&nv.steps)||[];
}
function poolPhaseHtml(pid, lvl){
  const steps=poolStepsOf(pid, lvl||0);
  if(!steps.length) return '';
  const L=[];
  const line=h=>L.push('<div>• '+h+'</div>');
  const fmt=(nm,du)=>'<b>'+esc(nm)+'</b> — '+_fmtDur(du)+qBtn(nm);
  let i=0;
  if(/chauffement/.test(steps[0][0])){ line(fmt(steps[0][0],steps[0][1])); i=1; }
  let end=steps.length;
  if(end-i>1&&/Retour au calme/.test(steps[end-1][0])) end--;
  const mid=steps.slice(i,end);
  const m0=mid.length>1&&/^(.*) (\d+)\/(\d+)$/.exec(mid[0][0]);
  if(m0&&mid[1]){
    line('<b>'+m0[3]+'× '+esc(m0[1])+'</b>'+qBtn(m0[1])+' — '+_fmtDur(mid[0][1])+' + '+esc(mid[1][0])+qBtn(mid[1][0])+' '+_fmtDur(mid[1][1]));
  } else {
    const marks=mid.filter(s=>/en place$/.test(s[0]));
    const start=marks.length?mid.indexOf(marks[0])+1:0;
    let stop=mid.length;
    for(let k=start;k<mid.length;k++){ if(/en place$/.test(mid[k][0])||/^Récup entre/.test(mid[k][0])){ stop=k; break; } }
    const bloc=mid.slice(start,stop);
    for(let k=0;k<bloc.length;k++){
      const nx=bloc[k+1];
      if(nx&&nx[0]==='Repos'){ line(fmt(bloc[k][0],bloc[k][1])+' + repos '+_fmtDur(nx[1])); k++; }
      else line(fmt(bloc[k][0],bloc[k][1]));
    }
    const rb=mid.find(s=>/^Récup entre/.test(s[0]));
    if(marks.length>1){
      const cyc=/Tabata/.test(marks[0][0])?'cycles':'tours';
      line('<span class="mut">↻ Même bloc × '+marks.length+' '+cyc+'</span>');
    }
    if(rb) line(fmt(rb[0],rb[1]));
  }
  if(end<steps.length) line(fmt(steps[end][0],steps[end][1]));
  return '<div class="tiny" style="line-height:1.8;text-align:left;margin-top:2px">'+L.join('')+'</div>';
}
function poolSummaryHtml(pid, lvl){
  const pr=POOL_PROTOS.find(p=>p.id===pid); if(!pr) return '';
  const nv=pr.niveaux[lvl||0]||pr.niveaux[0]; if(!nv) return '';
  const steps=nv.steps||[];
  return '<div class="tiny mt" style="background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:10px;padding:8px 10px;line-height:1.7;text-align:left">'
    +'🏊 '+esc(pr.desc||pr.nom)+(nv.conseil?'<br>💡 <b>'+esc(nv.conseil)+'</b>':'')
    +'<br><span class="mut">Bloc piscine : '+_fmtDur(_protoDur(steps))+' · le minuteur vous guidera étape par étape.</span></div>'+poolPhaseHtml(pid, lvl||0);
}
const POOL_GUIDES=[
{k:['pompes au bord'],t:'Pompes au bord',img:'data:image/gif;base64,[BINARY_ASSET_4ca1a1caeb35: 144784 characters]',h:['Face au bord, <b>mains sur la margelle</b>, largeur épaules','Corps <b>incliné et aligné</b> dans l\'eau, jambes tendues derrière','<b>Pliez les coudes</b> (poitrine vers le bord), puis poussez','💡 Soufflez en poussant — l\'eau porte une partie du poids.']},
{k:['gainage'],t:'Gainage au bord (vertical)',img:'data:image/gif;base64,[BINARY_ASSET_a1bdfb473212: 285208 characters]',h:['Face au bord, eau à hauteur de poitrine','<b>Mains sur la margelle</b>, bras tendus','Jambes tendues vers le fond, <b>abdos + fessiers contractés</b>','💡 Tenez sans bouger, dos droit, respiration régulière.']},
{k:['mobilite epaules'],t:'Mobilité épaules aquatique',img:'data:image/gif;base64,[BINARY_ASSET_1a35f3c420a0: 237584 characters]',h:['Debout dans l\'eau, mouvements <b>lents et amples</b>','<b>Cercles de bras</b> : petits puis grands, avant puis arrière','<b>Montées de bras</b> devant jusqu\'au-dessus de la tête','💡 La résistance douce de l\'eau renforce en douceur.']},
{k:['mobilite hanches','chevilles'],t:'Mobilité hanches / chevilles',img:'data:image/gif;base64,[BINARY_ASSET_3dad5d73757d: 187840 characters]',h:['<b>Hanches</b> (une main au bord) : jambe tendue, <b>balancez</b> avant/arrière puis latéral','<b>Genou levé</b> : dessinez des cercles dans l\'eau','<b>Chevilles</b> : montées sur <b>pointes puis talons</b>, cercles du pied','💡 Lent et contrôlé, sans douleur.']},
{k:['etirements au bord'],t:'Étirements au bord',h:['<b>Mollets</b> : un pied contre le mur, jambe tendue, poussez le talon','<b>Épaules/dos</b> : mains au bord, laissez le buste descendre dans l\'eau','<b>Quadriceps</b> : talon à la fesse en gardant l\'équilibre au bord','💡 20 à 30 s par position, respirez profondément.']},
{k:['battements'],t:'Battements au bord',img:'data:image/gif;base64,[BINARY_ASSET_548ff912ba40: 120456 characters]',h:['<b>Mains sur la margelle</b>, bras tendus, corps allongé dans l\'eau','Jambes tendues, <b>battez des pieds</b> (haut-bas, petite amplitude)','Restez <b>gainé</b>, fesses à la surface','💡 Échauffement : ample et facile ; effort : rapide et tonique.']},
{k:['nage statique'],t:'Nage statique (à l\'élastique)',h:['Élastique accroché au bord, <b>ceinture autour de la taille</b>','<b>Nagez sur place</b> (crawl de préférence) contre la résistance','Sans élastique : <b>battements amples au bord</b>','💡 Allure facile : vous devez pouvoir parler.']},
{k:['nage douce'],t:'Nage douce',h:['<b>Nagez lentement</b> sur place ou en petits allers-retours','Mouvements <b>amples et relâchés</b>, respiration calme','Avec « + respiration » : <b>soufflez longuement</b> dans l\'eau','💡 Allure récup : vous devez pouvoir parler.']},
{k:['marche'],t:'Marche aquatique',h:['<b>Marchez dans le bassin</b>, eau à hauteur de poitrine','<b>Grands pas</b>, bras qui accompagnent, dos droit','Récup : allure facile, <b>respirez profondément</b>','💡 Plus vous poussez fort, plus ça travaille.']},
{k:['fractionne'],t:'Fractionné — nager',h:['<b>Nagez à allure soutenue</b> (statique ou petits allers-retours)','Intensité : <b>ça doit piquer</b> mais rester propre techniquement','Puis récup en marchant comme indiqué','💡 La dernière répétition doit être aussi propre que la première.']},
{k:['sprint'],t:'Sprint — nager à fond',h:['<b>Nagez à fond</b> pendant les secondes indiquées','Corps <b>gainé</b>, battements explosifs','Récup <b>complète</b> entre chaque sprint (soufflez au bord)','💡 Qualité > quantité : 8 sprints propres plutôt que 12 bâclés.']},
{k:['souffler'],t:'Récup complète — souffler',h:['<b>Arrêtez-vous au bord</b>, mains sur la margelle','<b>Respirez profondément</b> : inspirez par le nez, soufflez longuement','Relâchez épaules et bras','💡 Le cœur doit redescendre avant le sprint suivant.']},
{k:['recup entre tabatas'],t:'Récup entre tabatas',h:['<b>Marchez doucement</b> dans l\'eau ou restez au bord','<b>Buvez une gorgée</b> si besoin','Reprenez le cycle suivant quand le chrono sonne','💡 Gardez les muscles chauds : ne restez pas immobile.']},
{k:['retour au calme'],t:'Retour au calme',h:['<b>Nage très douce</b> ou marche lente','<b>Ralentissez progressivement</b>, relâchez tout','Séance terminée : <b>hydratez-vous</b>','💡 Bien joué, la récupération commence maintenant.']},
{k:['aqua-jogging'],t:'Aqua-jogging sur place',img:'data:image/gif;base64,[BINARY_ASSET_8514ad6535fe: 94204 characters]',h:['<b>Courez sur place</b>, eau à hauteur de poitrine','Genoux <b>bien hauts</b>, bras qui pompent comme en course','Buste droit, abdos serrés','💡 Plus les genoux montent, plus le cœur travaille.']},
{k:['montees de genoux'],t:'Montées de genoux',img:'data:image/gif;base64,[BINARY_ASSET_2b5cc1d86d7a: 150948 characters]',h:['Sur place, <b>montez les genoux</b> à hauteur de hanches, en rythme','<b>Bras opposés</b> (comme en course), buste droit','Enchaînez vite pendant les 40 s','💡 Touchez vos mains avec les genoux si vous pouvez.']},
{k:['ciseaux'],t:'Ciseaux au bord',img:'data:image/gif;base64,[BINARY_ASSET_04205c05cd27: 231748 characters]',h:['<b>Mains au bord</b>, corps allongé dans l\'eau','Jambes tendues : <b>ouvrez-fermez</b> rapidement (ciseaux)','Petite amplitude, rythme rapide','💡 Abdos serrés, ne cambrez pas.']},
{k:['deplacements lateraux'],t:'Déplacements latéraux (4 m)',h:['En <b>pas chassés</b>, traversez le bassin dans la largeur (4 m)','Restez <b>fléchi</b> (demi-squat), buste droit','Touchez le bord, repartez dans l\'autre sens','💡 Poussez fort sur les jambes, gainez le buste.']},
{k:['talons-fesses'],t:'Talons-fesses',img:'data:image/gif;base64,[BINARY_ASSET_6c6c085d1a21: 212608 characters]',h:['Sur place, <b>joggez en ramenant les talons aux fesses</b>','Buste droit, bras qui accompagnent','Rythme rapide pendant l\'effort','💡 Échauffez bien les genoux avant (marche + battements).']}
];
function poolGuideFor(nom){
  const n=norm(nom||'');
  for(const g of POOL_GUIDES){ if(g.k.some(k=>n.indexOf(k)>=0)) return g; }
  return null;
}
function qBtn(nom){
  try{
    if(!poolGuideFor(nom)) return '';
    return '<button class="btn btn-line btn-sm" style="padding:1px 7px;margin-left:6px" onclick="event.stopPropagation();openGuide(\''+nom+'\')">❓</button>';
  }catch(_){ return ''; }
}
function qBtnTimer(){
  try{
    const P=__pt; if(!P) return '';
    const nm=(P.steps[P.idx]&&P.steps[P.idx][0])||'';
    if(P.kind==='natation') return qBtn(nm);
    return '';
  }catch(_){ return ''; }
}
function openGuide(nom){
  const g=poolGuideFor(nom);
  if(!g) return;
  try{ if(__pt&&__pt.iv&&!__pt.paused) _timerPause(); }catch(_){}
  const gl=g.img?g.h.slice(-1):g.h;
  openModal('<h3>❓ '+esc(g.t)+'</h3>'+(g.img?'<img src="'+g.img+'" style="width:100%;border-radius:12px;margin-bottom:8px" alt="guide">':'')+'<div class="tiny mut mb">'+esc(nom)+'</div><ul style="padding-left:18px;line-height:1.9;font-size:13.5px">'+gl.map(x=>'<li>'+x+'</li>').join('')+'</ul><div class="flex mt"><button class="btn btn-grad btn-sm" onclick="closeModal()">Compris !</button></div>');
  try{
    const to=document.getElementById('timer-ov');
    if(to&&to.style.display!=='none'){ const mo=document.querySelector('#modal-root .modal-ov'); if(mo) mo.style.zIndex=400; }
  }catch(_){}
}
function delProtoRow(kind, idx){
  ENS_NAT();
  if(state[kind]&&state[kind].seances&&state[kind].seances[idx]!=null){
    state[kind].seances.splice(idx,1); save(); renderCurrent(); toast('🗑️ Séance supprimée');
  }
}
function renderPiscine(){
  ENS_NAT();
  const plan=weekPlan(todayKey()).filter(p=>!p.key);
  const jours=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const creneaux=plan.length? plan.map(p=>fmtDateShort(p.date)+' ('+jours[p.wk]+')').join(' · ') : 'aucun (semaine complète)';
  const today=weekPlan(todayKey()).find(p=>p.date===todayKey())||{};
  const isPoolDay = today.type==='piscine' || (today.cardio && today.cardio.format==='piscine');
  const h=state.natation.seances;
  let html='<div class="card glow"><div><b>🛰️ Créneaux conseillés cette semaine</b><div class="small mut">'+esc(creneaux)+'</div>'
    +'<div class="tiny mut mt">Tous les protocoles sont en <b>base temps</b> (aucune longueur imposée) : adaptés à tout bassin. Élastique de nage statique conseillé.</div></div>';
  if(isPoolDay){
    html+='<div class="ok-box mt" style="padding:10px 12px">🏊 <b>Aujourd\'hui : piscine prévue'+(today.type==='piscine'?' (imposée)':'')+'.</b> Choisissez un protocole ci-dessous — le minuteur vous guide et <b>valide le jour</b> à la fin.</div>';
  }
  html+='<div class="mt"><b>🏊 Jours piscine dans ma semaine</b><div class="tiny mut">Le vendredi piscine est prévu par le programme. Ajoutez d\'autres jours de repos si vous voulez nager aussi le week-end (affiché dans <b>Entraînement → Cette semaine</b>, le dashboard et le calendrier).</div><div class="flex mt">'
    +[1,2,3,4,5,6,0].map(d=>'<label class="chip '+(poolDays().indexOf(d)>=0?'chip-blue':'chip-mut')+'" style="cursor:pointer"><input type="checkbox" style="display:none" '+(poolDays().indexOf(d)>=0?'checked':'')+' onchange="togglePoolDay('+d+',this.checked)"> '+['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][d]+'</label>').join('')+'</div></div>'
    +'<div class="warn-box mt">⚠️ Savoir nager requis. Ne nagez jamais seule, bord antidérapant, pas de plongeon ni de sprint violent en petit bassin. Hydratez-vous.</div></div>';
  $('#pool-plan').innerHTML=html;
  $('#pool-protos').innerHTML='<div class="grid g2">'+POOL_PROTOS.map(pr=>{
    return '<div class="card"><div class="spread"><b>'+pr.ic+' '+esc(pr.nom)+'</b></div><div class="small mut mt">'+esc(pr.desc)+'</div>'
      +pr.niveaux.map((nv,li)=>'<div class="prep-step mt"><div class="prep-h"><b>'+esc(nv.n)+'</b><span class="chip chip-mut" style="margin-left:auto">'+_fmtDur(_protoDur(nv.steps))+'</span></div><p class="prep-p">'+esc(nv.conseil)+'</p><div class="flex mt"><button class="btn btn-grad btn-sm" onclick="startProtocol(\'pool\',\''+pr.id+'\','+li+')">▶ Démarrer</button><button class="btn btn-line btn-sm" onclick="this.parentElement.nextElementSibling.style.display=this.parentElement.nextElementSibling.style.display===\'none\'?\'block\':\'none\'">Détail</button></div><div class="tiny mut mt" style="display:none">'+nv.steps.map(s=>esc(s[0])+qBtn(s[0])+' — '+_fmtDur(s[1])).join('<br>')+'</div></div>').join('')
      +'</div>';
  }).join('')+'</div>';
  $('#pool-hist').innerHTML = h.length
    ? '<div class="tbl-wrap"><table class="tbl"><tr><th>Date</th><th>Protocole</th><th>Niveau</th><th>Durée</th><th>RPE</th><th></th></tr>'
      +h.map((s,i)=>'<tr><td>'+fmtDateShort(s.d)+'</td><td><b>'+esc(s.proto)+'</b>'+(s.note?'<div class="tiny mut">'+esc(s.note)+'</div>':'')+'</td><td>'+esc(s.niv||'—')+'</td><td class="num">'+s.duree+' min</td><td class="num">'+(s.rpe||'—')+'</td><td><button class="btn btn-line btn-sm" onclick="delProtoRow(\'natation\','+i+')">✕</button></td></tr>').reverse().join('')+'</table></div>'
      +'<div class="small mut mt">Total : '+h.reduce((a,s)=>a+(+s.duree||0),0)+' min · '+h.length+' séance(s)</div>'
    : '<div class="chart-empty">Aucune séance piscine pour l\'instant — lancez un protocole ci-dessus.</div>';
}
function openDetente(date){
  date = date || todayKey();
  const rec = state.recup[date] ? recupScore(state.recup[date]) : null;
  const steps=[
    ['Mobilité douce — nuque, épaules, hanches, chevilles','10 min'],
    ['Étirements complets (fiches de la séance ou Récupération)','10–15 min'],
    ['Respiration lente — 4 s inspirer / 6 s expirer','5 min'],
    ['Hydratation (1,5 L d\'eau)','tout au long de la journée']
  ];
  openModal('<h3>🧊 Détente — '+fmtDateFr(date)+'</h3>'
    +'<div class="ok-box mb">🧠 <b>Le repos fait progresser :</b> c\'est pendant la récupération que les muscles se renforcent et se raffermissent.'+(rec!=null?' Score de récupération actuel : <b>'+rec+' %</b>':'')+'</div>'
    +'<div class="card glow"><b>Programme détente du jour</b><div class="tiny mut mt" style="line-height:1.9">'+steps.map(s=>'<div>• '+s[0]+' — <b>'+s[1]+'</b></div>').join('')+'</div>'
    +'<div class="flex mt"><button class="btn btn-grad" onclick="validerRepos(\''+date+'\')">✅ Valider mon repos</button></div></div>'
    +'<div class="tiny mut mt">Marche 10–15 min si vous en avez envie, mais sans forcer. Le jour validé apparaîtra ✅ dans votre semaine.</div>');
}
function validerRepos(date){
  setSeanceStatus(date,'ok');
  closeModal();
  toast('😴 Détente validée — bonne récupération !');
}

/* ============================================================
   POOL SESSION (V6) — fiche séance piscine dans « Cette semaine » :
   protocole du coach, exercices avec démo (GIF), durées,
   cases à cocher et validation.
   ============================================================ */
function poolProtocolFor(date){
  const pos = programPos(date);
  const rec = state.recup[date] ? recupScore(state.recup[date]) : null;
  if(pos.deload) return {id:'recovery', lvl:1, why:'Semaine de deload : récupération active uniquement, aucune intensité.'};
  if(rec!=null && rec<60) return {id:'recovery', lvl:0, why:'Récupération basse ('+rec+' %) : version douce pour ne pas surcharger.'};
  const m = (pos.idx==='F') ? 12 : (+pos.idx||1);
  const t = pos.phase.type;
  if(t==='adaptation'||t==='developpement') return {id:'endurance', lvl: m<=3?0:1, why:'Phase de développement : fond aquatique facile pour drainer les jambes et préserver la récupération des fessiers.'};
  if(t==='composition') return {id:'interval', lvl: m<=8?0:1, why:'Phase de composition : intervalles pour la dépense énergétique, zéro impact sur les articulations.'};
  return {id:'interval', lvl: m>=10?1:0, why:'Entretien : intervalles réguliers à allure maîtrisée.'};
}
function openPoolSession(date){
  ENS_NAT();
  date = date || todayKey();
  const spec = poolProtocolFor(date);
  const pr = POOL_PROTOS.find(p=>p.id===spec.id) || POOL_PROTOS[0];
  const nv = pr.niveaux[spec.lvl||0] || pr.niveaux[0];
  const steps = nv.steps;
  const tot = _protoDur(steps);
  const st = state.seances[date];
  const checks = (state.natation.checks||{})[date] || steps.map(function(){return false;});
  const doneN = checks.filter(Boolean).length;
  const wp = (weekPlan(date).find(function(x){return x.date===date;})||{});
  const isProgramCardio = !!(wp.cardio && wp.cardio.format==='piscine');
  const rows = steps.map(function(s,i){
    const c = !!checks[i];
    return '<div class="pool-row"><div class="pool-main"><b class="small" style="'+(c?'text-decoration:line-through;color:var(--mut)':'')+'">'+esc(s[0])+'</b> <button class="btn btn-line btn-sm pool-demo-btn" style="padding:2px 8px;font-size:11px" data-exo="'+esc(s[0])+'" data-dur="'+_fmtDur(s[1])+'">▶</button></div>'
      +'<span class="chip '+(c?'chip-green':'chip-mut')+'">'+_fmtDur(s[1])+'</span>'
      +'<label class="pool-check"><input type="checkbox" '+(c?'checked':'')+' onchange="togglePoolStep(\''+date+'\','+i+',this.checked)"> ✓ fait</label></div>';
  }).join('');
  const rpeOpts = [1,2,3,4,5,6,7,8,9,10].map(function(v){ return '<option value="'+v+'">'+v+'</option>'; }).join('');
  openModal('<h3>🏊 '+esc(pr.nom)+' <span class="small mut">— '+fmtDateFr(date)+'</span></h3>'
    +'<div class="small mut mb">Pool Lab · niveau '+esc(nv.n)+' · <b>'+_fmtDur(tot)+'</b> · base temps (aucune longueur imposée)</div>'
    +'<div class="ok-box mb">🧠 <b>Le coach a choisi :</b> '+esc(spec.why)+(isProgramCardio?' C\'est aussi le <b>cardio piscine du programme</b> pour ce jour.':'')+'</div>'
    +(nv.conseil?'<div class="note-box mb">💡 '+esc(nv.conseil)+'</div>':'')
    +'<div class="small mut mb" style="letter-spacing:.05em;text-transform:uppercase;font-weight:900;font-size:10.5px">Les exercices — ▶ pour la démonstration, cochez au fur et à mesure</div>'
    +rows
    +'<div class="flex mt"><button class="btn btn-grad" onclick="closeModal();startProtocol(\'pool\',\''+pr.id+'\','+(spec.lvl||0)+')">▶ Lancer le minuteur ('+_fmtDur(tot)+')</button></div>'
    +'<div class="field mt" style="text-align:left"><label>RPE ressenti (optionnel, 1–10)</label><select class="inp" id="pool-rpe"><option value="">—</option>'+rpeOpts+'</select></div>'
    +(st==='ok'?'<div class="ok-box mb">✅ Cette séance est déjà validée — vous pouvez modifier et re-valider.</div>':'')
    +'<button class="btn btn-grad btn-block mt" onclick="savePoolSession(\''+date+'\')">💾 Valider la séance</button>');
}
function togglePoolStep(date, i, v){
  ENS_NAT();
  if(!state.natation.checks) state.natation.checks = {};
  const c = state.natation.checks[date] || [];
  c[i] = !!v;
  state.natation.checks[date] = c;
  debounceSave();
}
function savePoolSession(date){
  ENS_NAT();
  const spec = poolProtocolFor(date);
  const pr = POOL_PROTOS.find(p=>p.id===spec.id);
  const nv = pr.niveaux[spec.lvl||0] || pr.niveaux[0];
  const checks = (state.natation.checks||{})[date] || [];
  const doneN = checks.filter(Boolean).length;
  const rpeEl = document.getElementById('pool-rpe');
  const rpe = rpeEl ? (rpeEl.value || '') : '';
  const secs = _protoDur(nv.steps);
  const duree = Math.max(1, Math.round(secs/60));
  const rec = {d:date, proto:pr.nom, niv:nv.n, duree:duree, secs:secs, rpe:rpe, note: doneN<nv.steps.length ? doneN+'/'+nv.steps.length+' étapes cochées' : ''};
  const exist = state.natation.seances.findIndex(function(s){ return s.d===date && s.proto===pr.nom; });
  if(exist>=0) state.natation.seances[exist]=rec; else state.natation.seances.push(rec);
  const _wp=(weekPlan(date).find(function(x){return x.date===date;})||{});
  if(_wp.cardio && _wp.cardio.format==='piscine'){ try{ if(!state.cardio||typeof state.cardio!=='object') state.cardio={}; state.cardio[date]={format:'piscine', duree:duree, rpe:rpe, kcal:kcalCardio('piscine',duree,rpe), note:'Protocole piscine — '+pr.nom}; }catch(_){} }
  setSeanceStatus(date,'ok');
  closeModal();
  toast('✅ Séance piscine validée ('+pr.nom+' · '+duree+' min)');
}
/* Boutons ▶ des fiches piscine : démonstration avec GIF (POOL_GUIDES) */
document.addEventListener('click', function(e){
  const b = e.target && e.target.closest ? e.target.closest('.pool-demo-btn') : null;
  if(!b) return;
  const nm = b.getAttribute('data-exo') || '';
  const g = poolGuideFor(nm);
  if(g){ openGuide(nm); return; }
  const dur = b.getAttribute('data-dur') || '';
  openModal('<h3>🏊 '+esc(nm)+'</h3><p class="small mut">Étape de '+dur+' — suivez le minuteur : respiration calme, amplitude douce, zéro effort maximal.</p><div class="flex mt"><button class="btn btn-grad btn-sm" onclick="closeModal()">Compris !</button></div>');
});

/* ================== CARDIO ELLIPTIQUE — fiche séance (V7) ================== */
function ENS_CAR(){ try{ if(!state.cardio||typeof state.cardio!=='object') state.cardio={}; if(!state.cardioChecks||typeof state.cardioChecks!=='object') state.cardioChecks={}; }catch(_){} }
function cardioElliptiqueSpec(date){
  const pos = programPos(date);
  const dj = cardioDuJour(date, parseDate(date).getDay());
  const totMin = Math.max(10, +dj.duree||20);
  const warm=300, cool=300;
  const mainS = Math.max(300, (totMin-10)*60);
  const Z0=ZONES_CARDIO[0], Z1=ZONES_CARDIO[1], Z2=ZONES_CARDIO[2];
  const bpm = function(z){ try{ const r=zoneFC(z); return r[0]+'–'+r[1]+' bpm'; }catch(_){ return ''; } };
  let steps, why, zLabel;
  if(pos.deload){
    zLabel = Z0.n + ' (' + bpm(Z0) + ')';
    steps = [['Échauffement — allure très douce', warm], ['Cardio continu ' + Z0.n + ' ' + bpm(Z0), mainS], ['Retour au calme — dégressif', cool]];
    why = 'Semaine de décharge : uniquement du très léger pour relancer la circulation sans entamer la récupération.';
  } else if(pos.phase && pos.phase.type==='composition'){
    zLabel = Z2.n + ' (' + bpm(Z2) + ')';
    steps = [['Échauffement — allure douce', warm]];
    let left = mainS;
    while(left > 0){
      const hi = Math.min(90, left); left -= hi;
      steps.push(['Fraction ' + Z2.n + ' ' + bpm(Z2) + ' — effort soutenu', hi]);
      if(left > 0){ const lo = Math.min(90, left); left -= lo; steps.push(['Récupération ' + Z0.n + ' — respiration', lo]); }
    }
    steps.push(['Retour au calme — dégressif', cool]);
    why = 'Phase de composition : des fractions en zone 3 augmentent la dépense énergétique — jamais la veille d\'une séance fessiers.';
  } else {
    zLabel = Z1.n + ' (' + bpm(Z1) + ')';
    steps = [['Échauffement — allure douce', warm]];
    let left = mainS;
    while(left > 0){
      const hi = Math.min(240, left); left -= hi;
      steps.push(['Cardio ' + Z1.n + ' ' + bpm(Z1) + ' — on parle par phrases courtes', hi]);
      if(left > 0){ const lo = Math.min(60, left); left -= lo; steps.push(['Récupération ' + Z0.n + ' — allure conversable', lo]); }
    }
    steps.push(['Retour au calme — dégressif', cool]);
    why = 'Zone 2, la zone graisse : l\'effort reste modéré, la récupération des fessiers n\'est pas entamée.';
  }
  return {steps:steps, why:why, zLabel:zLabel, zoneNom:dj.zoneNom, totalMin:Math.round(_protoDur(steps)/60)};
}
function openCardioSession(date){
  ENS_CAR();
  date = date || todayKey();
  const dj = cardioDuJour(date, parseDate(date).getDay());
  const spec = cardioElliptiqueSpec(date);
  const steps = spec.steps;
  const st = state.seances[date];
  const checks = (state.cardioChecks||{})[date] || steps.map(function(){return false;});
  const prev = state.cardio[date];
  const rows = steps.map(function(s,i){
    const c = !!checks[i];
    return '<div class="pool-row"><div class="pool-main"><b class="small" style="'+(c?'text-decoration:line-through;color:var(--mut)':'')+'">'+esc(s[0])+'</b></div>'
      +'<span class="chip '+(c?'chip-green':'chip-mut')+'">'+_fmtDur(s[1])+'</span>'
      +'<label class="pool-check"><input type="checkbox" '+(c?'checked':'')+' onchange="toggleCardioStep(\''+date+'\','+i+',this.checked)"> ✓ fait</label></div>';
  }).join('');
  const rpeOpts = [1,2,3,4,5,6,7,8,9,10].map(function(v){ return '<option value="'+v+'">'+v+'</option>'; }).join('');
  openModal('<h3>🚴 Cardio elliptique — '+esc(spec.zLabel)+'</h3>'
    +'<div class="small mut mb">'+fmtDateFr(date)+' · <b>'+spec.totalMin+' min</b> · elliptique : mouvement continu, zéro impact</div>'
    +'<div class="ok-box mb">🧠 <b>Le coach a choisi :</b> '+esc(spec.why)+(dj.detail?' <span class="mut">'+esc(dj.detail)+'</span>':'')+'</div>'
    +'<div class="small mut mb" style="letter-spacing:.05em;text-transform:uppercase;font-weight:900;font-size:10.5px">Les étapes — cochez au fur et à mesure</div>'
    +rows
    +'<div class="flex mt"><button class="btn btn-grad" onclick="startCardioElliptique(\''+date+'\')">▶ Lancer le minuteur ('+spec.totalMin+' min)</button></div>'
    +'<div class="field mt" style="text-align:left"><label>RPE ressenti (optionnel, 1–10)</label><select class="inp" id="cardio-rpe"><option value="">—</option>'+rpeOpts+'</select></div>'
    +(st==='ok'?'<div class="ok-box mb">✅ Cette séance est déjà validée'+(prev?' — '+Math.round(+prev.duree||0)+' min enregistrés':'')+' — vous pouvez modifier et re-valider.</div>':'')
    +'<button class="btn btn-grad btn-block mt" onclick="saveCardioSession(\''+date+'\')">💾 Valider la séance</button>');
}
function toggleCardioStep(date, i, v){
  ENS_CAR();
  const c = state.cardioChecks[date] || [];
  c[i] = !!v;
  state.cardioChecks[date] = c;
  debounceSave();
}
function saveCardioSession(date){
  ENS_CAR();
  const spec = cardioElliptiqueSpec(date);
  const rpeEl = document.getElementById('cardio-rpe');
  const rpe = rpeEl ? (rpeEl.value || '') : '';
  const secs = _protoDur(spec.steps);
  const duree = Math.max(1, Math.round(secs/60));
  state.cardio[date] = {format:'elliptique', duree:duree, rpe:rpe, kcal:kcalCardio('elliptique',duree,rpe), note:'Fiche cardio elliptique — '+spec.zLabel};
  setSeanceStatus(date,'ok');
  closeModal();
  toast('✅ Cardio elliptique validé ('+duree+' min)');
}
function startCardioElliptique(date){
  ENS_CAR();
  const spec = cardioElliptiqueSpec(date||todayKey());
  closeModal();
  _runSteps('elliptique', '🚴 Cardio elliptique', spec.zLabel+' · base temps · zéro impact', spec.steps, {label:'Cardio elliptique'});
}
function init(){
  load();
  applyEmbeddedPhotos();
  if(state.profil.date && !state.stats.demarrage) state.stats.demarrage=state.profil.date;
  buildNav();
  bindRanges();
  bindAutoSave();
  go('v-dashboard');
  // sauvegarde auto avant fermeture
  window.addEventListener('beforeunload', save);
  // Redessin au redimensionnement — MAIS jamais pendant une saisie :
  // sur Android, ouvrir le clavier déclenche un resize → un re-rendu ferait
  // perdre le focus au champ et refermerait le clavier.
  let resizeT=null;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeT);
    resizeT=setTimeout(()=>{ if(!textFocused) renderCurrent(); }, 260);
  });
  // toute erreur est signalée à l'utilisateur au lieu de rester silencieuse
  window.addEventListener('error', ev=>{
    try{ toast('⚠️ Erreur détectée : '+(ev.message||'inconnue').slice(0,140)); }catch(_){}
  });
  // si le stockage navigateur est bloqué (aperçu intégré), prévenir clairement
  if(!storageAvailable()) showStorageBanner();
  // aucun état trouvé (1er lancement OU nouveau fichier sans données) →
  // proposer l'import d'une sauvegarde pour ne rien perdre
  if(__hasStored===false && storageAvailable()) showNoDataBanner();
  // badges à l'init silencieuse
  try{ checkBadges(); }catch(e){}
}
document.addEventListener('DOMContentLoaded', init);


/* ============================================================
   ASSISTANT VOCAL & CONVERSATIONNEL ÉLITE
   Comprend les questions en français, répond avec les VRAIES
   données de l'application (séance, poids, nutrition, récup,
   records, équipe…) via la reconnaissance vocale (Chrome) ou
   la saisie texte. Réponses vocales via la synthèse vocale.
   ============================================================ */
'use strict';

let asRec = null;
let asListening = false;
let asMuted = false;

function speechSupported(){ return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
function ttsSupported(){ return !!window.speechSynthesis; }

function asAddMsg(who, text){
  const body=$('#as-body'); if(!body) return;
  const div=document.createElement('div');
  div.className='as-msg '+(who==='user'?'user':'bot');
  div.textContent=text;
  body.appendChild(div);
  body.scrollTop=body.scrollHeight;
}
function asSay(text){
  asAddMsg('bot', text);
  if(!asMuted && ttsSupported()){
    try{
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      u.lang='fr-FR'; u.rate=1.02; u.pitch=1;
      const voices=window.speechSynthesis.getVoices()||[];
      const v=voices.find(x=>/^fr/i.test(x.lang)) || voices.find(x=>/^fr/i.test(x.lang)&&/female|Amelie|Thomas|Audrey/i.test(x.name));
      if(v) u.voice=v;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }
}
function asEnvoyerTexte(){
  const inp=$('#as-text'); if(!inp) return;
  const txt=inp.value.trim();
  if(!txt) return;
  inp.value='';
  asAddMsg('user', txt);
  asTraiter(txt);
}
function asTraiter(texte){
  try{
    const r=assistantRepondre(texte);
    asSay(r.reply);
    if(r.act){ setTimeout(()=>{ try{ r.act(); }catch(e){} }, 400); }
  }catch(e){
    asSay("Désolé, je n'ai pas pu analyser votre demande. Essayez : « quelle est ma séance du jour ? » ou « aide ».");
  }
}
function asToggleListen(){
  if(!speechSupported()){
    asSay("La reconnaissance vocale n'est pas disponible dans ce navigateur ou cet aperçu. Utilisez le champ texte, ou ouvrez le fichier dans Chrome pour activer le micro.");
    return;
  }
  if(asListening){ asStopListen(); return; }
  try{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!asRec){
      asRec=new SR();
      asRec.lang='fr-FR';
      asRec.interimResults=false;
      asRec.maxAlternatives=1;
      asRec.onresult=e=>{
        const txt=((e.results[0]||{})[0]||{}).transcript||'';
        const clean=txt.trim();
        if(clean){ asAddMsg('user', clean); asTraiter(clean); }
      };
      asRec.onerror=e=>{
        if(e.error==='not-allowed'||e.error==='service-not-allowed'){
          asStopListen(true);
          asSay("Microphone non autorisé. Autorisez l'accès au micro (ou ouvrez le fichier directement dans Chrome).");
        } else if(e.error!=='aborted'){
          asStopListen(true);
          asSay("Erreur de reconnaissance vocale : "+e.error+". Utilisez le champ texte.");
        }
      };
      asRec.onend=()=>{ asSetListening(false); };
    }
    asRec.start();
    asSetListening(true);
  }catch(e){
    asSay("Impossible de démarrer le micro dans cet aperçu. Utilisez le champ texte, ou ouvrez le fichier dans Chrome.");
  }
}
function asStopListen(silent){
  try{ if(asRec) asRec.stop(); }catch(e){}
  asSetListening(false);
}
function asSetListening(on){
  asListening=on;
  const btn=$('#as-mic'), fab=$('#fab-assistant'), st=$('#as-status');
  if(btn) btn.classList.toggle('listening',on);
  if(fab) fab.classList.toggle('listening',on);
  if(st) st.textContent = on ? "🎤 À l'écoute… parlez" : (speechSupported()? "Prêt" : "Mode texte");
}
function asToggleMute(){
  asMuted=!asMuted;
  const b=$('#as-mute');
  if(b) b.textContent=asMuted?'🔇':'🔊';
}
function toggleAssistant(){
  const p=$('#assistant-panel');
  if(!p) return;
  const open = p.style.display!=='none';
  p.style.display=open?'none':'flex';
  if(!open){
    if(!asHistoryShown){ asHistoryShown=true; asSay("Bonjour ! Je suis l'assistant de votre équipe. Posez-moi une question à voix haute (bouton 🎤) ou par écrit. Exemples : « Quelle est ma séance du jour ? », « Mes calories ? », « Les conseils de l'équipe ? », « Mes records ? »."); }
    setTimeout(()=>{ const i=$('#as-text'); if(i) i.focus({preventScroll:true}); },100);
  } else { asStopListen(true); }
}
let asHistoryShown=false;

/* ============================================================
   CERVEAU : interprète la demande et répond avec les données
   ============================================================ */
function asNumber(texte){
  const m=String(texte||'').match(/\d+(?:[.,]\d+)?/);
  return m? parseFloat(m[0].replace(',','.')) : null;
}
function assistantRepondre(texte){
  const bas=String(texte||'').toLowerCase();
  const t=norm(bas); // minuscules, sans accents
  const nums=(String(texte).match(/\d+(?:[.,]\d+)?/g)||[]).map(x=>parseFloat(x.replace(',','.')));

  /* ---------- Politesse ---------- */
  if(/(bonjour|salut|coucou|bonsoir)/.test(bas) && bas.length<20) return {reply:"Bonjour ! Je suis l'assistant de votre équipe de transformation. Dites-moi par exemple : « quelle est ma séance du jour ? », « mes calories ? », « mes records ? » ou « conseils de l'équipe »."};
  if(/merci/.test(bas)) return {reply:"Avec plaisir ! L'équipe est fière de votre constance. Continuez, la progression est au rendez-vous. 💪"};

  /* ---------- Aide ---------- */
  if(/aide|que peux|possibilite|commande|exemple/.test(t)){
    return {reply:"Voici ce que je sais faire : « ma séance du jour », « mes fessiers », « mes abdominaux », « mon cardio », « mes calories », « le repas du jour », « mon poids actuel », « ma récupération », « mes records », « mes mensurations », « mon objectif », « les conseils de l'équipe », « mon bilan de la semaine », « comment m'échauffer ». Je peux aussi naviguer (« ouvre la nutrition ») et enregistrer (« enregistre mon poids 64,5 »)."};
  }

  /* ---------- Navigation (avec mot-clé d'action) ---------- */
  if(/(va sur|vas sur|va dans|ouvre|affiche|montre|accede|amene|dirige|va a|va au|va vers)/.test(t)){
    const nav=[
      ["tableau de bord","v-dashboard","le tableau de bord"],
      ["dashboard","v-dashboard","le tableau de bord"],
      ["profil","v-profil","le profil"],
      ["1rm","v-force","le bilan 1RM"],
      ["bilan de force","v-force","le bilan 1RM"],
      ["mensuration","v-mensurations","les mensurations"],
      ["entrainement","v-entrainement","l'entraînement"],
      ["cardio","v-cardio","le cardio (elliptique et piscine)"],
      ["elliptique","v-cardio","le cardio elliptique"],
      ["piscine","v-cardio","la piscine"],
      ["transformation","v-transfo","le tableau de bord de la transformation"],
      ["nutrition","v-nutrition","la nutrition"],
      ["repas","v-repas","les repas jour par jour"],
      ["recuperation","v-recuperation","la récupération"],
      ["progression","v-progression","la progression"],
      ["photo","v-photos","la galerie photos"],
      ["calendrier","v-calendrier","le calendrier"],
      ["objectif","v-objectifs","les objectifs"],
      ["equipe","v-equipe","l'équipe"]
    ];
    for(const [mot,vue,label] of nav){ if(t.includes(mot)){ return {reply:"J'ouvre "+label+".", act:()=>go(vue)}; } }
  }



  /* ---------- Cardio / elliptique / piscine ---------- */
  if(t.includes('cardio')||t.includes('elliptique')||t.includes('piscine')||t.includes('velo')){
    if(/(ouvre|affiche|montre|va)/.test(t)) return {reply:"J'ouvre l'onglet Cardio.", act:()=>go('v-cardio')};
    const pos=programPos(todayKey());
    const ci=cardioSemaineInfos(pos.weekGlobal);
    const today=weekPlan(todayKey()).find(x=>x.date===todayKey());
    let msg="Cette semaine : "+ci.faites+" cardio enregistré(s) sur "+ci.prevues+" prévu(s). Programme : "+pos.phase.metcon+".";
    if(today&&today.type==='metcon'&&today.cardio){
      msg+=" Aujourd'hui : "+today.cardio.label+" — "+today.cardio.detail+" Zone cible : "+today.cardio.zoneNom+" ("+Math.round(fcm()*today.cardio.zonePct[0])+"-"+Math.round(fcm()*today.cardio.zonePct[1])+" bpm).";
    } else if(today&&today.type==='seance'&&today.session&&today.session.cardio){
      msg+=" Aujourd'hui, après la séance : "+CARDIO_TYPES[today.session.cardio.apres].n+" "+today.session.cardio.duree+" min.";
    }
    msg+=" Rappel : jamais de fractionné la veille d'une séance fessiers. En cas de fatigue, choisissez la piscine ou une marche active.";
    return {reply:msg};
  }

  /* ---------- Fessiers ---------- */
  if(t.includes('fess')||t.includes('galbe')||t.includes('hip thrust')||t.includes('fesse')){
    const pos=programPos(todayKey());
    const sf=signauxFessiers(pos.weekGlobal);
    const cible = pos.phase.type==='developpement'?18:pos.phase.type==='adaptation'?10:14;
    const pf=perfActuelle('hipthrust');
    return {reply:"Coach fessiers : cette semaine vous avez noté "+(sf?sf.setsTotal:0)+" séries de fessiers (cible "+cible+" à "+(cible+6)+"), dont "+(sf?sf.setsMoy:0)+" de moyen fessier. "+
      (pf? "Votre hip thrust est estimé à "+fmtKg(pf.v)+(pf.gain!=null?" ("+(pf.gain>0?"+":"")+pf.gain+" % depuis le départ)":"")+". ":"")+
      "Progression du cycle en cours : "+(pos.phase.progression||"")+" Les charges n'augmentent jamais automatiquement : on suit d'abord la technique, l'amplitude et la sensation de contraction."};
  }

  /* ---------- Abdominaux ---------- */
  if(t.includes('abdo')||t.includes('ventre')||t.includes('gainage')||t.includes('taille')){
    const pos=programPos(todayKey());
    const f=absFocusSemaine(pos.weekGlobal);
    const d=deltasMensurations();
    return {reply:"Focus abdominaux de la semaine : "+f.ic+" "+f.n+". "+f.desc+" "+nbStimAbs()+" stimulations recommandées cette semaine. "+
      (d&&d.taille? "Votre tour de taille a évolué de "+(d.taille.d>0?"+":"")+d.taille.d+" cm depuis le Jour 0. ":"")+
      "Rappel : ventre plat = transverse entraîné + déficit calorique modéré. Les abdominaux seuls ne font pas disparaître le gras."};
  }

  /* ---------- Calories / nutrition / repas ---------- */
  if(t.includes('calorie')||t.includes('macro')||t.includes('proteine')||t.includes('glucide')||t.includes('lipide')||t.includes('nutrition')||t.includes('repas')||t.includes('manger')||t.includes('aliment')||t.includes('combien de kcal')){
    const c=caloriesCibles();
    if(!c) return {reply:"Complétez d'abord votre bilan de départ (onglet Profil) pour que la nutritionniste calcule vos besoins."};
    const pos=programPos(todayKey());
    const mois=(pos.idx==='F'?13:+pos.idx)||1;
    const jourIdx=parseInt(todayKey().slice(-2),10)||1;
    const jt=jourTypeDe(todayKey());
    const f=FACTEURS_JOUR[jt];
    const gp=genererPlanJour(mois,jourIdx,jt);
    let repas='';
    if(gp){
      const pd=gp.plan.find(m=>/Petit-déjeuner/.test(m.nom));
      const dj=gp.plan.find(m=>/Déjeuner/.test(m.nom));
      repas=". Aujourd'hui, par exemple : "+(pd&&pd.rows.length?pd.rows.map(r=>r.nom).join(', '):'petit-déjeuner varié')+" au petit-déjeuner, et "+(dj&&dj.rows.length?dj.rows.map(r=>r.nom).join(', '):'déjeuner équilibré')+" au déjeuner.";
    }
    const mJ=macroJour(mois,jt);
    return {reply:"La nutritionniste : aujourd'hui est un "+f.ic+" "+f.n+". Vos besoins du jour sont de "+(mJ?mJ.cal:c.cal)+" kcal, dont "+(mJ?mJ.prot:c.prot)+" g de protéines, "+(mJ?mJ.glu:c.glu)+" g de glucides et "+(mJ?mJ.lip:c.lip)+" g de lipides. Dépense de base estimée : "+c.tdee+" kcal (Mifflin-St Jeor féminin, activité x1,5). Stratégie actuelle : "+nutriPhaseInfo().n+repas+" Le plan complet est dans l'onglet Repas."};
  }


  /* ---------- Enregistrer le poids à la voix ---------- */
  const mPoids=bas.match(/(?:enregistre|note|ajoute|saisis|inscris|je pe(?:se|s)e|pese|mon poids (?:est|fait|de|vaut))\s*(?:mon poids\s*)?(?:de|a|:)?\s*(\d+(?:[.,]\d+)?)/);
  if(mPoids && !/quel|combien|actuel|evolution|actuel/.test(bas) && !/calorie|macro|proteine/.test(bas)){
    const v=parseFloat(mPoids[1].replace(',','.'));
    if(v>=30&&v<=300){
      let d=todayKey();
      if(/hier/.test(bas)) d=dateKey(addDays(new Date(),-1));
      state.poids[d]=v;
      save();
      return {reply:"Poids enregistré : "+v+" kg le "+fmtDateShort(d)+". La nutritionniste et l'analyste de performance en tiendront compte dans vos recommandations.",
        act:()=>{ renderCurrent(); }};
    }
  }

  /* ---------- Sommeil à la voix (« j'ai dormi 7 heures ») ---------- */
  const mSom=bas.match(/(?:dormi|sommeil de|dormis?)\s*(\d+(?:[.,]\d+)?)\s*(?:heures?|h)/);
  if(mSom){
    const h=parseFloat(mSom[1].replace(',','.'));
    if(h>=1&&h<=16){
      let d=todayKey();
      if(/hier/.test(bas)) d=dateKey(addDays(new Date(),-1));
      const r=state.recup[d]||{};
      r.h=h; state.recup[d]=r; save();
      return {reply:"Sommeil enregistré : "+h+" heures. Le préparateur mental vous recommande 7 h 30 à 9 h pour optimiser la croissance musculaire. "+(h>=7.5?"Excellent, votre récupération est bien gérée.":"Essayez de vous coucher un peu plus tôt ce soir."),
        act:()=>{ renderCurrent(); }};
    }
  }

  /* ---------- Séance du jour ---------- */
  if((t.includes('seance')||t.includes('entrain')||t.includes('programme')||t.includes('aujourd')) && (t.includes('aujourd')||t.includes('jour')||t.includes('faire')||t.includes('programme')||t.includes('entrain')) && !t.includes('prochaine') && !t.includes('combien de seance') && !t.includes('cette semaine')){
    const pos=programPos(todayKey());
    const plan=weekPlan(todayKey());
    const td=plan.find(p=>p.date===todayKey());
    if(td&&td.type==='seance'){
      return {reply:"Aujourd'hui, c'est « "+td.label+" » — "+pos.phase.titre+", semaine "+(pos.weekGlobal+1)+" sur 52. "+td.session.exos.length+" exercices au programme. Rappel de l'expert mobilité : échauffement 8 à 12 minutes avant, étirements ciblés après. Vous pouvez ouvrir la séance dans l'onglet Entraînement."};
    }
    if(td&&td.type==='metcon'&&td.cardio){
      return {reply:"Aujourd'hui, c'est cardio : "+td.cardio.label+". "+td.cardio.detail+" Zone cible : "+td.cardio.zoneNom+" ("+Math.round(fcm()*td.cardio.zonePct[0])+"-"+Math.round(fcm()*td.cardio.zonePct[1])+" bpm). Vous pouvez le faire en elliptique, à la piscine ou en repos actif selon votre récupération."};
    }
    return {reply:"Aujourd'hui est un jour de repos. La récupération fait partie du programme ! Marche, mobilité et sommeil au menu."};
  }

  /* ---------- Prochaine séance ---------- */
  if(t.includes('prochaine seance')||t.includes('prochaine seance')||(t.includes('prochaine')&&t.includes('seance'))){
    const plan=weekPlan(todayKey());
    const nxt=plan.find(p=>p.type==='seance'&&p.date>todayKey());
    if(nxt) return {reply:"Votre prochaine séance : « "+nxt.label+" » le "+fmtDateFr(nxt.date)+"."};
    return {reply:"Aucune séance planifiée après aujourd'hui dans cette semaine — vérifiez le calendrier."};
  }

  /* ---------- Combien de séances cette semaine ---------- */
  if(t.includes('combien de seance')||t.includes('combien de seances')||(t.includes('seance')&&t.includes('cette semaine'))){
    const plan=weekPlan(todayKey());
    const n=plan.filter(p=>p.type==='seance').length;
    const faits=plan.filter(p=>p.type==='seance'&&state.seances[p.date]==='ok').length;
    return {reply:"Cette semaine : "+n+" séances prévues, "+faits+" déjà validées. Le coach vous rappelle de cocher vos séances pour un suivi précis."};
  }

  /* ---------- Poids actuel ---------- */
  if((t.includes('poids')||t.includes('peser')||t.includes('je pe')||t.includes('combien je')) && (t.includes('quel')||t.includes('combien')||t.includes('actuel')||t.includes('maintenant')||t.includes('evolution')||t.includes('actuel')) || (t.includes('mon poids')) && !mPoids){
    const pa=poidsActuel();
    if(pa==null) return {reply:"Aucun poids enregistré pour l'instant. Renseignez votre bilan de départ ou dites-moi « enregistre mon poids 78,5 »."};
    const dep=state.profil.poidsDepart?+state.profil.poidsDepart:null;
    const delta=dep?round1(pa-dep):null;
    const entries=Object.entries(state.poids).sort();
    let tendance='';
    if(entries.length>=2){
      const prec=entries[entries.length-2][1];
      tendance=", "+(pa-prec>=0?'+':'')+round1(pa-prec)+" kg vs la pesée précédente ("+fmtDateShort(entries[entries.length-2][0])+")";
    }
    return {reply:"Votre poids actuel est de "+fmtKg(pa)+(delta!=null?" soit "+(delta>0?'+':'')+delta+" kg depuis le départ":"")+tendance+". L'analyste compare cette tendance à vos objectifs pour ajuster la nutrition."};
  }

  /* ---------- Récupération / sommeil ---------- */
  if(t.includes('recuper')||t.includes('sommeil')||t.includes('fatigue')||t.includes('dormi')||t.includes('courbature')||t.includes('check')){
    const rm=moyenneRecup();
    const recups=Object.values(state.recup);
    const hm=recups.length?round1(recups.reduce((a,b)=>a+(+b.h||0),0)/recups.length):null;
    const etat=recupScore(state.recup[todayKey()]);
    let txt='';
    if(etat!=null) txt+="Votre score de récupération aujourd'hui : "+etat+"/100. ";
    else txt+="Pas encore de check-in aujourd'hui. ";
    if(hm!=null) txt+="Sommeil moyen : "+hm+" h (objectif 7 h 30-9 h). ";
    txt+=rm!=null?("Récupération moyenne globale : "+rm+"/100. "):'';
    txt+=(rm!=null&&rm<60)? "Le préparateur mental recommande une semaine plus légère ou un deload.":"Le préparateur mental vous dit : votre récupération est un atout, continuez à la suivre.";
    return {reply:txt};
  }

  /* ---------- Conseils de l'équipe ---------- */
  if(t.includes('conseil')||t.includes('equipe')||t.includes('coach')||t.includes('recommandation')||t.includes('avis')||t.includes('dis moi ce qu')||t.includes('suggestion')){
    const recs=buildRecommendations();
    if(!recs.length) return {reply:"L'équipe n'a pas encore de conseil spécifique — complétez vos données (profil, pesées, séances) pour activer le coaching personnalisé."};
    const top=recs.slice(0,3);
    return {reply:"L'équipe vous recommande : "+top.map((r,i)=>(i+1)+") "+r.tag+" : "+r.txt).join(' ')+". Pour le détail, ouvrez l'onglet Équipe."};
  }

  /* ---------- Records / 1RM / force ---------- */
  if(t.includes('1rm')||t.includes('record')||t.includes('force')||t.includes('bilan de force')||t.includes('developpe')||t.includes('squat')||t.includes('souleve')){
    const lignes=[];
    Object.keys(MAIN_LIFTS).forEach(k=>{
      const pr=perfSerie(k);
      if(pr) lignes.push(MAIN_LIFTS[k].n+" "+Math.round(pr.max)+" kg (estimé le "+fmtDateShort(pr.date)+")");
    });
    let txt=lignes.length?("Vos records estimés : "+lignes.join(', ')+". "):"Aucun record enregistré — notez vos charges dans vos séances. ";
    if(forceTestDone()){
      const f=state.force.valeurs;
      txt+="Votre bilan 1RM déclaré : hip thrust "+fmtKg(f.hipthrust||'—')+", soulevé de terre roumain "+fmtKg(f.rdl||'—')+", squat "+fmtKg(f.squat||'—')+", bulgarian "+fmtKg(f.bulgarian||'—')+", rowing "+fmtKg(f.row||'—')+". "+(forceReevalDue()?"La réévaluation 1RM est recommandée : vos charges seront recalculées.":"Prochaine réévaluation conseillée : "+fmtDateFr(nextReevalDate())+".");
    } else txt+="Pensez à réaliser votre bilan 1RM (onglet Bilan 1RM) pour personnaliser les charges.";
    return {reply:txt};
  }

  /* ---------- Objectif / progression ---------- */
  if(t.includes('objectif')||t.includes('progression')||t.includes('pourcentage')||t.includes('but')||t.includes('avance')||t.includes('cible')){
    const obj=progressionObjectifAnnuel();
    const op={masse:'prise de masse',esthetique:'esthétique',recomposition:'recomposition corporelle',seche:'perte de graisse',force:'force'}[state.objectifs.principal]||'recomposition';
    let txt="Votre objectif principal : "+op+". ";
    if(state.profil.poidsDepart&&state.profil.objectifPoids){
      txt+="Vous êtes à "+obj.pct+" % de votre objectif de poids ("+obj.label+"). ";
    }
    const j0=state.mensurations.jour0, dm=dernierMensuration();
    if(j0&&dm&&j0.brasD&&dm.brasD) txt+="Bras : "+(dm.brasD-j0.brasD>0?'+':'')+round1(dm.brasD-j0.brasD)+" cm depuis le départ. ";
    txt+="L'équipe suit votre progression semaine après semaine — les bilans sont dans l'onglet Progression.";
    return {reply:txt};
  }

  /* ---------- Mensurations ---------- */
  if(t.includes('mensuration')||t.includes('tour de')||t.includes('bras')||t.includes('poitrine')||t.includes('cuisse')||t.includes('epaule')){
    const j0=state.mensurations.jour0||{}, dm=dernierMensuration()||{};
    const lignes=[];
    [['brasD','bras'],['poitrine','poitrine'],['epaules','épaules'],['taille','taille']].forEach(([k,l])=>{
      if(j0[k]&&dm[k]) lignes.push(l+" "+(dm[k]-j0[k]>0?'+':'')+round1(dm[k]-j0[k])+" cm");
    });
    if(!lignes.length) return {reply:"Renseignez vos mensurations (Jour 0 et relevés mensuels) pour que l'analyste suive votre évolution. Aujourd'hui : vos mesures de départ sont enregistrées."};
    return {reply:"Évolution de vos mensurations depuis le départ : "+lignes.join(', ')+". Relevez vos mesures chaque mois pour affiner le suivi."};
  }

  /* ---------- Échauffement / étirements ---------- */
  if(t.includes('echauff')||t.includes('etirement')||t.includes('chauffer')||t.includes('mobilite')){
    return {reply:"L'expert mobilité : avant chaque séance, 5 minutes de cardio léger, puis 2-3 minutes de rotations articulaires (épaules, hanches, chevilles), puis 3 séries d'approche à 50, 70 et 85 % de la charge sur le premier exercice. Après la séance, 5-8 minutes d'étirements statiques (20-30 secondes) sur les muscles travaillés. Le détail complet s'affiche quand vous ouvrez une séance."};
  }

  /* ---------- Bilan de la semaine ---------- */
  if(t.includes('bilan')||t.includes('hebdo')||t.includes('semaine')&&(t.includes('resume')||t.includes('recap')||t.includes('rapport')||t.includes('bilan'))){
    const etat=bilanHebdoEtat();
    if(!etat) return {reply:"Complétez d'abord votre profil pour activer le bilan hebdomadaire."};
    const b=state.hebdo?state.hebdo[etat.wk]:null;
    if(b&&b.conseils&&b.conseils.length){
      return {reply:"Votre bilan de la semaine "+(etat.wk+1)+" a été transmis. Ajustements de l'équipe : "+b.conseils.slice(0,3).map(c=>c.tag+" — "+c.txt).join(' ')+" Vous pouvez modifier votre bilan dans l'onglet Équipe."};
    }
    if(etat.due){
      return {reply:"C'est le jour J : l'équipe attend votre bilan hebdomadaire ! Je l'ouvre pour vous.", act:()=>openBilanHebdoModal()};
    }
    return {reply:"Le prochain jour J (bilan hebdomadaire) est le "+fmtDateFr(etat.sunday)+(etat.joursAvant>0?" (dans "+etat.joursAvant+" jour"+(etat.joursAvant>1?"s":"")+")":"")+". Vous pouvez le remplir quand vous voulez.", act:()=>{}};
  }

  /* ---------- Nom / identité ---------- */
  if(t.includes('comment tu t appel')||t.includes('qui es tu')||t.includes('ton nom')||t.includes('assistant')){
    return {reply:"Je suis l'assistant de votre programme Transformation Élite, au service de votre équipe : le coach, l'expert hypertrophie, la nutritionniste, le préparateur mental, le référent santé, l'expert mobilité, le préparateur cardio et l'analyste de performance. Posez-moi une question sur vos données !"};
  }

  /* ---------- Réponse générique ---------- */
  return {reply:"Je n'ai pas bien compris. Dites-moi « aide » pour voir tout ce que je sais faire, ou essayez : « quelle est ma séance du jour ? », « mes calories ? », « mon poids actuel ? », « mes records ? », « les conseils de l'équipe ? »."};
}

/* ---------- Chips de suggestions ---------- */
function asInit(){
  const chips=$('#as-chips');
  if(chips){
    const ex=["Quelle est ma séance du jour ?","Combien de calories aujourd'hui ?","Mon poids actuel ?","Mes records ?","Conseils de l'équipe ?","Mon bilan de la semaine ?","Comment m'échauffer ?","Aide"];
    chips.innerHTML=ex.map(c=>'<button class="as-chip" onclick="asChip(\''+c.replace(/'/g,"\\'")+'\')">'+esc(c)+'</button>').join('');
  }
  const st=$('#as-status');
  if(st) st.textContent = speechSupported()? "Prêt" : "Mode texte (micro indisponible ici)";
}
function asChip(txt){
  const inp=$('#as-text'); if(inp){ inp.value=txt; }
  asEnvoyerTexte();
}
document.addEventListener('DOMContentLoaded', asInit);

/* ===== PHOTOS EMBARQUÉES (Jour 0 + Simulation Mois 12) ===== */
/* Photos de démonstration supprimées : cette version est personnalisée pour Émilie.
   La galerie, l'upload, la compression et le comparateur restent 100 % fonctionnels. */
const EMBEDDED_PHOTOS = {};
