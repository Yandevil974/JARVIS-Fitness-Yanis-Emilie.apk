/* ============================================================
   DONNÉES PROGRAMME — GB Performance amélioré (12 mois / 52 sem.)
   Codage exercices : [nom, muscle, séries, reps, tempo, repos(s), note]
   Muscles : pec,dos,epA,epL,epP,bic,tri,avb,abs,lom,fes,qua,isc,add,mol
   ============================================================ */
'use strict';

const MUSCLES = {
  pec:{n:'Pectoraux', zone:[6,20], ic:'🏋️'},
  dos:{n:'Dorsaux', zone:[10,24], ic:'🦍'},
  epA:{n:'Épaules ant.', zone:[4,12], ic:'🟡'},
  epL:{n:'Épaules lat.', zone:[6,16], ic:'🔷'},
  epP:{n:'Épaules post.', zone:[4,12], ic:'🔷'},
  bic:{n:'Biceps', zone:[6,16], ic:'💪'},
  tri:{n:'Triceps', zone:[8,18], ic:'💪'},
  avb:{n:'Avant-bras', zone:[3,8], ic:'🤜'},
  abs:{n:'Abdominaux', zone:[5,12], ic:'🧱'},
  lom:{n:'Lombaires', zone:[3,8], ic:'🔙'},
  fes:{n:'Fessiers', zone:[4,10], ic:'🍑'},
  qua:{n:'Quadriceps', zone:[10,22], ic:'🦵'},
  isc:{n:'Ischio-jambiers', zone:[8,18], ic:'🦵'},
  add:{n:'Adducteurs', zone:[3,8], ic:'🦵'},
  mol:{n:'Mollets', zone:[6,16], ic:'🦶'}
};

const E = (n,m,s,r,t,rest,note)=>[n,m,s,r,t,rest,note||''];

const PROGRAM = {
  finale:{
    titre:"Phase finale — Affûtage & bilan 12 mois",
    type:"finale", macro:"Finale", mois:"S. 49–52", semaine:[49,52],
    objectif:"Finalisation esthétique : affûtage léger, maintien de la force, comparaison complète des données, préparation de la suite.",
    schema:"8-10", intensite:"70 %", methode:"Récupération active + records",
    metcon:"2 séances/sem. — 25–30 min tempo modéré (75–80 % FCM) ou 6 sprints de 20 s + 2 min.",
    deload:true,
    split:"3 jours — Full body entretien · Records · Affûtage",
    sessions:{
      J1:{nom:"Full body — entretien 1", muscles:['pec','dos','qua','tri','bic'],
        exos:[
          E("Développé couché barre","pec",3,"8-10","3010",120,"Volume réduit : entretien, technique parfaite."),
          E("Tractions (pull-up)","dos",3,"8-10","3010",120),
          E("Back squat","qua",3,"8-10","3010",150),
          E("Extensions triceps poulie","tri",3,"10-12","3010",75),
          E("Curl barre","bic",3,"10-12","3010",75)
        ]},
      J2:{nom:"Records personnels (session test)", muscles:['pec','qua','isc','epA'],
        exos:[
          E("Développé couché — test 1RM","pec",5,"1-5","4010",180,"Testez votre record annuel en toute sécurité."),
          E("Back squat — test 1RM","qua",5,"1-5","4010",180),
          E("Soulevé de terre — test 1RM","isc",5,"1-5","4010",180),
          E("Développé militaire — test 1RM","epA",5,"1-5","4010",180)
        ]},
      J3:{nom:"Full body — affûtage & pose", muscles:['pec','dos','abs','mol'],
        exos:[
          E("Développé haltères incliné","pec",3,"10-12","3010",90),
          E("Rowing haltère un bras","dos",3,"10-12","3010",90),
          E("Élévations latérales","epL",3,"12-15","3010",75),
          E("Crunch à la poulie","abs",3,"15-20","3011",60),
          E("Mollets debout","mol",4,"12-15","3011",60)
        ]}
    }
  },
  1:{
    titre:"Accumulation 1 — Trisets", type:"accumulation", macro:"A · Fondations", mois:"S. 1–4",
    schema:"10 / 12 / 15", intensite:"70 %", methode:"Trisets (3 exercices du même muscle à la suite)",
    objectif:"Préparer le corps : technique, capacité de travail, connexion neuro-musculaire, gonflement cellulaire (hypertrophie sarcoplasmique).",
    metcon:"2×/sem. — 10 sprints de 30 s, 90 s de repos actif entre chaque.",
    deload:false,
    split:"3 jours — Bras/épaules · Jambes · Pectoraux/Dos",
    sessions:{
      J1:{nom:"Bras & épaules", muscles:['tri','bic','epL'],
        exos:[
          E("Triceps dips","tri",4,"8-10","3010",0,"Attacher un poids si nécessaire. Alternative : close grip push-ups."),
          E("Triceps extensions haltères, banc plat","tri",4,"10-12","3010",0),
          E("French press poulie basse","tri",4,"12-15","3010",120),
          E("Curl Scott barre EZ, pronation","bic",4,"8-10","3010",0,"Beaucoup plus léger qu'en supination pour protéger les avant-bras."),
          E("Curl marteau assis","bic",4,"10-12","3010",0),
          E("Curl haltères incliné","bic",4,"12-15","3010",120),
          E("Élévations latérales assises","epL",4,"8-10","3010",0),
          E("Élévations latérales assises (variante)","epL",4,"10-12","3010",0),
          E("Élévations latérales coude à 90°","epL",4,"12-15","3010",120)
        ]},
      J2:{nom:"Jambes", muscles:['qua','isc','lom','mol','fes'],
        exos:[
          E("Squat cycliste (squat complet)","qua",5,"8-10","3010",0,"Plus léger qu'un squat classique ; ischios contre mollets en bas."),
          E("Leg press","qua",5,"10-12","3010",0,"Pieds parallèles, largeur de hanches."),
          E("Leg extension","qua",5,"12-15","2011",120,"Très léger, contraction complète + pause en haut."),
          E("Leg curl allongé","isc",5,"8-10","3010",0),
          E("Soulevé de terre roumain haltères","isc",5,"10-12","3010",0,"Dos droit en permanence."),
          E("Back extension horizontal","isc",5,"12-15","3010",120),
          E("Mollets debout","mol",4,"8-10","3210",60,"Tenir 2 s en position contractée en haut."),
          E("Mollets assis","mol",3,"15-20","2210",60,"Tenir 2 s en position étirée en bas.")
        ]},
      J3:{nom:"Pectoraux & dos", muscles:['pec','dos','abs'],
        exos:[
          E("Développé incliné barre","pec",5,"8-10","3010",0,"Mains légèrement plus larges que les épaules."),
          E("Développé haltères plat, prise neutre","pec",5,"10-12","3010",0),
          E("Écartés haltères décliné","pec",5,"12-15","3010",120,"Insister sur l'étirement en bas."),
          E("Rowing barre buste penché, pronation","dos",5,"8-10","3010",0),
          E("Rowing assis, prise neutre","dos",5,"10-12","3010",0),
          E("Tirage vertical prise pronation","dos",5,"12-15","3010",120),
          E("Relevés de jambes allongé","abs",4,"10-12","3010",60),
          E("Crunch sur swiss ball","abs",3,"15-20","2012",60,"Tenir 2 s en position contractée.")
        ]}
    }
  },
  2:{
    titre:"Intensification 1 — Pauses isométriques", type:"intensification", macro:"A · Fondations", mois:"S. 5–8",
    schema:"5-7", intensite:"80 %", methode:"Pauses isométriques (2 s) sur les exercices principaux",
    objectif:"Recruter un maximum d'unités motrices : inhibition du réflexe d'étirement, masse musculaire fonctionnelle.",
    metcon:"1–2×/sem. — 15-20 sprints de 15 s, 45 s de repos.",
    deload:false,
    split:"4 jours — Haut 1 · Bas 1 · Haut 2 · Bas 2",
    sessions:{
      J1:{nom:"Haut du corps 1", muscles:['epA','tri','dos','bic','pec'],
        exos:[
          E("Développé militaire debout","epA",5,"5-7","4210",90,"Pause de 2 s au menton, sans relâcher la tension."),
          E("Tractions (pull-up)","dos",5,"5-7","4210",90,"Pause de 2 s en bas. Alternative : tirage vertical."),
          E("Développé haltères incliné 30°","pec",4,"8-10","4010",90),
          E("Rowing haltère un bras","dos",4,"8-10","4010",90),
          E("French press barre EZ","tri",4,"8-10","4010",75),
          E("Curl marteau assis","bic",4,"8-10","4010",75)
        ]},
      J2:{nom:"Bas du corps 1", muscles:['qua','isc','abs','mol'],
        exos:[
          E("Front squat","qua",5,"5-7","4210",120,"Pause de 2 s en bas complètement."),
          E("Leg curl debout","isc",4,"8-10","4010",90),
          E("Fentes bulgares haltères (pied avant surélevé)","qua",4,"8-10","4010",90),
          E("Soulevé de terre roumain barre","isc",4,"8-10","4010",0),
          E("Relevés de jambes incliné","abs",4,"10-12","3010",90),
          E("Mollets unilatéraux","mol",4,"10-12","3210",75,"Tenir 2 s en position étirée.")
        ]},
      J3:{nom:"Haut du corps 2", muscles:['pec','dos','tri','bic'],
        exos:[
          E("Développé incliné barre","pec",5,"5-7","4210",90,"Pause de 2 s au menton."),
          E("Tractions prise neutre (chin-up)","dos",5,"5-7","4210",90,"Pause de 2 s en bas. Alternative : tirage vertical neutre."),
          E("Développé haltères décliné, prise neutre","pec",4,"8-10","4010",90),
          E("Rowing haltère un bras, coude ouvert","dos",4,"8-10","4010",90),
          E("Extensions triceps barre EZ","tri",4,"8-10","4010",75),
          E("Curl Scott barre EZ, supination","bic",4,"8-10","4010",75)
        ]},
      J4:{nom:"Bas du corps 2", muscles:['isc','qua','fes','abs','mol'],
        exos:[
          E("Soulevé de terre","isc",5,"5-7","4210",120,"Pause de 2 s à 2 pouces du sol (méthode)."),
          E("Leg press","qua",4,"10-12","3010",90,"Pieds largeur de hanches."),
          E("Back extension horizontal","isc",4,"8-10","4010",90),
          E("Step-up haut","qua",4,"8-10","4010",0),
          E("Crunch à la poulie","abs",4,"12-15","3011",90),
          E("Mollets assis","mol",4,"12-15","3020",75)
        ]}
    }
  },
  3:{
    titre:"Accumulation 2 — Drop sets", type:"accumulation", macro:"A · Fondations", mois:"S. 9–12",
    schema:"10 / 8 / 6", intensite:"74 %", methode:"Drop sets 10/8/6 (réduire la charge, continuer)",
    objectif:"Fatiguer au maximum les fibres recrutées en phase 2 : stress métabolique, gonflement, croissance.",
    metcon:"2×/sem. — 15 sprints de 30 s, 50 s de repos.",
    deload:false,
    split:"3 jours — Bras/épaules · Bas de corps · Pectoraux/Dos",
    sessions:{
      J1:{nom:"Bras & épaules", muscles:['tri','bic','epA','epL'],
        exos:[
          E("Triceps dips","tri",4,"8-10","3010",75),
          E("Curl Scott haltère, prise neutre","bic",4,"8-10","3010",75),
          E("Barre au front (pushdown triceps)","tri",3,"10/8/6","3010",75,"Méthode drop set : après l'échec à 10, réduire et enchaîner 8, puis 6."),
          E("Curl poulie basse, supination","bic",3,"10/8/6","3010",75,"Méthode drop set."),
          E("Développé haltères assis, neutre→pronation","epA",4,"8-10","3010",90),
          E("Élévations latérales haltères","epL",3,"10/8/6","3010",75,"Méthode drop set.")
        ]},
      J2:{nom:"Bas de corps", muscles:['qua','isc','lom','abs','mol'],
        exos:[
          E("Back squat barre haute","qua",4,"8-10","3010",120),
          E("Leg curl allongé","isc",4,"10/8/6","3010",90,"Drop set."),
          E("Hack squat","qua",4,"10/8/6","3010",90,"Drop set."),
          E("Back extension 45°, prise snatch","lom",3,"10-12","3010",60),
          E("Jackknife sur swiss ball","abs",3,"10-12","3010",60),
          E("Mollets debout","mol",3,"10/8/6","3010",75,"Drop set.")
        ]},
      J3:{nom:"Pectoraux & dos", muscles:['pec','dos','epP'],
        exos:[
          E("Développé haltères plat","pec",4,"8-10","3010",75),
          E("Rowing barre EZ supination, buste penché","dos",4,"8-10","3010",75),
          E("Câbles croisés","pec",4,"10/8/6","3010",75,"Drop set."),
          E("Rowing assis + étirement","dos",4,"10/8/6","3010",75,"Drop set."),
          E("Élévations latérales incliné 30° (face au banc)","epP",3,"10/8/6","3010",75,"Drop set.")
        ]}
    }
  },
  4:{
    titre:"Intensification 2 — Stage system", type:"intensification", macro:"A · Fondations", mois:"S. 13–16",
    schema:"6, 6, 6, 8, 8", intensite:"81 %", methode:"Stage system (charges lourdes puis dégressives)",
    objectif:"Pic de force du 1er macrocycle : charges élevées, système nerveux, masse musculaire fonctionnelle.",
    metcon:"1–2×/sem. — 3-4 tabata (8 × 20 s effort / 10 s repos), 3 min de repos entre.",
    deload:true,
    split:"4 jours — Haut 1 · Bas 1 · Haut 2 · Bas 2",
    sessions:{
      J1:{nom:"Haut du corps 1", muscles:['epA','dos','pec','tri','bic'],
        exos:[
          E("Développé militaire debout","epA",5,"6,6,6,8,8","4010",90),
          E("Tractions (pull-up)","dos",5,"6,6,6,8,8","4010",90,"Alternative : tirage vertical pronation."),
          E("Développé haltères plat","pec",4,"6-8","4010",90),
          E("Rowing haltère un bras","dos",4,"6-8","4010",90),
          E("French press haltère un bras","tri",3,"8-10","3010",75),
          E("Curl barre debout","bic",3,"8-10","3010",75)
        ]},
      J2:{nom:"Bas du corps 1", muscles:['qua','isc','mol'],
        exos:[
          E("Front squat","qua",5,"6,6,6,8,8","4010",180),
          E("Back squat inertie (pause complète)","qua",5,"6-8","3210",150,"Pause complète sur les barres de sécurité."),
          E("Fentes barre","qua",3,"8-10","2010",75,"10 reps par côté."),
          E("Soulevé de terre roumain barre","isc",3,"8-10","4010",75),
          E("Mollets debout","mol",4,"8-10","3020",75)
        ]},
      J3:{nom:"Haut du corps 2", muscles:['pec','dos','epA','tri','bic'],
        exos:[
          E("Développé couché barre plat","pec",5,"6,6,6,8,8","4010",90),
          E("Tractions supination (chin-up)","dos",5,"6,6,6,8,8","4010",90),
          E("Développé haltères assis","epA",4,"6-8","4010",90),
          E("Rowing haltère un bras, coude ouvert","dos",4,"6-8","4010",90),
          E("Extensions triceps + pullover barre EZ","tri",3,"8-10","3010",75),
          E("Curl haltère supination, banc Scott 90°","bic",3,"8-10","3010",75)
        ]},
      J4:{nom:"Bas du corps 2", muscles:['isc','qua','abs'],
        exos:[
          E("Soulevé de terre","isc",5,"6,6,6,8,8","4010",180),
          E("Bulgarian split squat","qua",5,"6-8","4010",90),
          E("Leg curl allongé","isc",5,"6-8","4010",90),
          E("Step-up haut","qua",4,"12-15","2010",75),
          E("Relevés de jambes suspendu","abs",4,"8-10","3020",75)
        ]}
    }
  },
  5:{
    titre:"Accumulation 3 — Giant sets", type:"accumulation", macro:"B · Développement", mois:"S. 17–20",
    schema:"10 / 10 / 10 / 10", intensite:"74 %", methode:"Giant sets (4 exercices du même muscle à la suite)",
    objectif:"Début du 2e macrocycle : volume élevé, stress métabolique maximal, capacité de travail accrue.",
    metcon:"2×/sem. — 15-20 sprints de 15 s, 1 min de repos actif.",
    deload:false,
    split:"3 jours — Bras/épaules · Jambes · Pectoraux/Dos",
    sessions:{
      J1:{nom:"Bras & épaules", muscles:['tri','bic','epP','epL','epA'],
        exos:[
          E("Développé couché prise serrée","tri",3,"8-10","3010",0),
          E("Extensions triceps haltères incliné","tri",3,"8-10","3010",0,"Banc à 30°."),
          E("French press barre EZ","tri",3,"8-10","3010",0),
          E("Pushdown triceps câble","tri",3,"8-10","3010",120),
          E("Curl Scott haltère neutre","bic",3,"8-10","3010",0),
          E("Curl Zottman assis","bic",3,"8-10","3010",0),
          E("Curl haltères incliné","bic",3,"8-10","3010",0),
          E("Curl poulie basse","bic",3,"8-10","3010",120),
          E("Élévations latérales incliné 30°","epP",3,"8-10","3010",0),
          E("Élévations latérales incliné 45°","epP",3,"8-10","3010",0),
          E("Élévations latérales","epL",3,"8-10","3010",0),
          E("Développé haltères assis","epA",3,"8-10","3010",120)
        ]},
      J2:{nom:"Jambes", muscles:['qua','isc','lom'],
        exos:[
          E("Back squat","qua",5,"8-10","3010",0),
          E("Hack squat","qua",5,"8-10","3010",0),
          E("Fentes marchées","qua",5,"15-20","3010",0,"10 par côté."),
          E("Leg press","qua",5,"8-10","3010",120),
          E("Leg curl allongé, pieds pointés","isc",5,"6-8","4010",0,"Contracter les mollets."),
          E("Leg curl allongé, pieds fléchis","isc",5,"6-8","4010",0,"Tirer les pieds (tibial antérieur)."),
          E("Good morning debout","isc",5,"8-10","3010",0,"Léger si première fois."),
          E("Back extension horizontal","isc",5,"8-10","3010",120)
        ]},
      J3:{nom:"Pectoraux & dos", muscles:['pec','dos'],
        exos:[
          E("Développé haltères incliné 45°, prise neutre","pec",5,"8-10","3010",0),
          E("Développé haltères incliné 30°","pec",5,"8-10","3010",0,"Diminuer l'angle du banc."),
          E("Câbles croisés","pec",5,"8-10","3010",0),
          E("Écartés haltères","pec",5,"8-10","3010",120),
          E("Rowing barre EZ supination, buste penché","dos",5,"8-10","3010",0),
          E("Rowing assis, prise neutre","dos",5,"8-10","3010",0),
          E("Tirage vertical prise large","dos",5,"8-10","3010",0),
          E("Rowing haltère buste penché","dos",5,"8-10","3010",120)
        ]}
    }
  },
  6:{
    titre:"Intensification 3 — Plateaux descendants", type:"intensification", macro:"B · Développement", mois:"S. 21–24",
    schema:"8, 8, 6, 6, 4, 4", intensite:"83 %", methode:"Plateaux descendants (8→8→6→6→4→4, charge croissante)",
    objectif:"Stress mécanique croissant au fil des séries : force, myofibrilles, densité.",
    metcon:"1–2×/sem. — 10-12 sprints de 25 s, 75 s de repos actif.",
    deload:true,
    split:"4 jours — Haut 1 · Bas 1 · Haut 2 · Bas 2",
    sessions:{
      J1:{nom:"Haut du corps 1", muscles:['pec','dos','tri','bic'],
        exos:[
          E("Développé incliné barre","pec",6,"8,8,6,6,4,4","4010",120,"Charge croissante : 2×8, 2×6, 2×4."),
          E("Tractions prise neutre (chin-up)","dos",6,"8,8,6,6,4,4","4010",120),
          E("Développé haltères décliné, prise neutre","pec",4,"6-8","4010",90),
          E("Rowing barre buste penché, pronation","dos",4,"6-8","3011",90),
          E("French press barre EZ","tri",4,"6-8","4010",75),
          E("Curl Zottman un bras, banc Scott","bic",4,"6-8","4010",75)
        ]},
      J2:{nom:"Bas du corps 1", muscles:['qua','isc'],
        exos:[
          E("Back squat","qua",6,"8,8,6,6,4,4","4010",180,"Charge croissante."),
          E("Split squat poulie basse","qua",4,"6-8","4010",90),
          E("Leg curl debout","isc",4,"6-8","3011",90),
          E("Leg press","qua",4,"12-15","3010",75),
          E("Soulevé de terre roumain haltères","isc",4,"10-12","4010",75)
        ]},
      J3:{nom:"Haut du corps 2", muscles:['pec','dos','tri','bic'],
        exos:[
          E("Dips","pec",6,"8,8,6,6,4,4","4010",120,"Charge croissante."),
          E("Tractions prise large","dos",6,"8,8,6,6,4,4","4010",120),
          E("Développé haltères incliné, pronation","pec",4,"6-8","4010",90),
          E("Rowing barre EZ supination, buste penché","dos",4,"6-8","3011",90),
          E("Extensions triceps barre EZ","tri",4,"6-8","4010",75),
          E("Curl haltères incliné","bic",4,"6-8","4010",75)
        ]},
      J4:{nom:"Bas du corps 2", muscles:['qua','isc','abs','mol'],
        exos:[
          E("Front squat","qua",6,"8,8,6,6,4,4","4010",180,"Charge croissante."),
          E("Soulevé de terre partiel, prise snatch","isc",5,"6-8","3210",120,"Pause complète de 2 s sur les barres de sécurité."),
          E("Mollets unilatéraux","mol",4,"12-15","2011",75),
          E("Jackknife sur swiss ball","abs",4,"10-12","3011",75)
        ]}
    }
  },
  7:{
    titre:"Accumulation 4 — Supersets agonistes", type:"accumulation", macro:"B · Développement", mois:"S. 25–28",
    schema:"6-8 / 8-10", intensite:"75 %", methode:"Supersets agonistes (2 exercices du même muscle)",
    objectif:"Dernière accumulation du 2e macrocycle : volume soutenu, endurance de force, densité.",
    metcon:"2×/sem. — 6 sprints de 15 s + 15 s de repos, 3 min de repos, 4-5 circuits.",
    deload:false,
    split:"3 jours — Bras/épaules · Jambes · Pectoraux/Dos",
    sessions:{
      J1:{nom:"Bras & épaules", muscles:['tri','bic','epA','epL'],
        exos:[
          E("Triceps dips","tri",5,"6-8","3110",0,"Ajouter du poids si nécessaire."),
          E("French press poulie basse","tri",5,"8-10","3010",120),
          E("Tractions supination (chin-up)","bic",5,"6-8","4010",0,"Ajouter du poids si nécessaire."),
          E("Curl haltères incliné, supination","bic",5,"8-10","3010",120),
          E("Développé derrière la nuque","epA",5,"6-8","4010",0),
          E("Élévations latérales assises (variante)","epL",5,"8-10","3010",90)
        ]},
      J2:{nom:"Jambes", muscles:['qua','isc','mol'],
        exos:[
          E("Back squat barre haute","qua",5,"6-8","4010",0),
          E("Hack squat","qua",5,"8-10","3010",120),
          E("Leg curl allongé, 1 1/4 en haut","isc",5,"4-6","3210",0,"Méthode 1 1/4 : demi-rep en plus en haut."),
          E("Soulevé de terre roumain barre","isc",5,"8-10","3010",120),
          E("Mollets debout","mol",5,"6-8","3011",0),
          E("Mollets à la presse","mol",5,"8-10","3010",90)
        ]},
      J3:{nom:"Pectoraux & dos", muscles:['dos','pec','epP'],
        exos:[
          E("Rowing barre EZ supination, buste penché","dos",5,"6-8","3011",0),
          E("Tirage vertical prise pronation","dos",5,"8-10","3010",120),
          E("Développé haltères plat","pec",5,"4-6","3210",0),
          E("Écartés câbles incliné","pec",5,"8-10","3010",120),
          E("Rowing assis au cou","dos",5,"6-8","3011",0),
          E("Élévations latérales incliné 30°","epP",5,"8-10","3010",90)
        ]}
    }
  },
  8:{
    titre:"Intensification 4 — Wave load", type:"intensification", macro:"B · Développement", mois:"S. 29–32",
    schema:"3-5 (vague)", intensite:"83 %", methode:"Wave loading 7,5,7,5,7,5 → charges très lourdes",
    objectif:"Pic de force du 2e macrocycle : charges les plus lourdes des 8 premiers mois, maximales sur les exercices clés.",
    metcon:"1–2×/sem. — 4 sprints de 30 s + 30 s de repos, 3 min de repos, 4-5 circuits.",
    deload:true,
    split:"4 jours — Haut 1 · Bas 1 · Haut 2 · Bas 2",
    sessions:{
      J1:{nom:"Haut du corps 1", muscles:['pec','dos'],
        exos:[
          E("Développé incliné barre","pec",7,"3-5","3010",120,"Vague 7-5 : monter la charge, redescendre, remonter."),
          E("Tractions prise neutre (chin-up)","dos",7,"3-5","3010",120),
          E("Développé haltères décliné, prise neutre","pec",5,"5-7","4010",120),
          E("Rowing haltère un bras, coude ouvert","dos",5,"5-7","4010",120)
        ]},
      J2:{nom:"Bas du corps 1", muscles:['qua','isc','abs'],
        exos:[
          E("Back squat barre haute","qua",7,"3-5","3010",180),
          E("Drop lunges (fentes sautées contrôlées)","qua",5,"5-7","2010",120),
          E("Glute ham raise","isc",5,"5-7","4010",120),
          E("Relevés de jambes suspendu","abs",4,"10-12","3020",90)
        ]},
      J3:{nom:"Haut du corps 2", muscles:['pec','dos'],
        exos:[
          E("Dips","pec",7,"3-5","3010",120,"Ajouter du poids si nécessaire."),
          E("Lean away pull-ups","dos",7,"3-5","3010",120),
          E("Développé haltères incliné 45°","pec",5,"5-7","4010",120),
          E("Rowing haltère un bras, prise neutre","dos",5,"5-7","4010",120)
        ]},
      J4:{nom:"Bas du corps 2", muscles:['qua','isc','mol','abs'],
        exos:[
          E("Front squat","qua",7,"3-5","3010",180),
          E("Soulevé de terre partiel","isc",7,"3-5","3210",180,"Pause complète de 2 s sur les barres de sécurité."),
          E("Mollets unilatéraux","mol",4,"10-12","3020",75),
          E("Ab wheel (roulette)","abs",4,"10-12","3020",75)
        ]}
    }
  },
  9:{
    titre:"Accumulation 5 — Pyramide large", type:"accumulation", macro:"C · Perfectionnement", mois:"S. 33–36",
    schema:"11, 9, 7, 7, 9, 11", intensite:"76 %", methode:"Pyramide large (12,10,8,15 avec back-off set)",
    objectif:"3e macrocycle : nouveau volume élevé, reconnexion métabolique, préparation aux pics de fin d'année.",
    metcon:"2×/sem. — 10 sprints de 30 s, 90 s de repos.",
    deload:false,
    split:"3 jours — Bras/épaules · Jambes · Pectoraux/Dos",
    sessions:{
      J1:{nom:"Bras & épaules", muscles:['tri','bic','epA','epL'],
        exos:[
          E("Triceps dips","tri",4,"12,10,8,15","3010",90,"12→10→8 puis back-off set 15 reps."),
          E("Curl marteau","bic",4,"12,10,8,15","3010",90),
          E("Développé derrière la nuque","epA",4,"12,10,8,15","3010",90),
          E("Curl Scott 90° haltère supination","bic",4,"12,10,8,15","3010",90),
          E("California press (barre au cou)","tri",4,"12-15","3010",60,"Ne pas trop charger !"),
          E("Élévations latérales incliné","epL",4,"12-15","3010",60)
        ]},
      J2:{nom:"Jambes", muscles:['qua','isc','mol'],
        exos:[
          E("Safety bar squat (ou barre classique)","qua",4,"12,10,8,15","3010",120,"12→10→8 puis back-off 15."),
          E("Hack squat","qua",4,"12,10,8,15","3010",90),
          E("Leg curl allongé","isc",4,"12,10,8,15","3010",90),
          E("Leg press","qua",3,"12-15","3010",60),
          E("Soulevé de terre roumain haltères","isc",3,"12-15","3010",60),
          E("Mollets debout","mol",4,"12,10,8,15","3010",60)
        ]},
      J3:{nom:"Pectoraux & dos", muscles:['pec','dos'],
        exos:[
          E("Développé haltères incliné","pec",4,"12,10,8,15","3010",90,"12→10→8 puis back-off 15."),
          E("Rowing barre buste penché, pronation","dos",4,"12,10,8,15","3010",90),
          E("Développé haltères décliné, prise neutre","pec",4,"12,10,8,15","3010",90),
          E("Tirage vertical prise large","dos",4,"12,10,8,15","3010",90),
          E("Câbles croisés + rotation externe","pec",3,"12-15","3010",60),
          E("Pullover câble bras tendus","dos",3,"12-15","3010",60)
        ]}
    }
  },
  10:{
    titre:"Intensification 5 — Plateaux ascendants", type:"intensification", macro:"C · Perfectionnement", mois:"S. 37–40",
    schema:"5, 5, 7, 7, 9, 9", intensite:"85 %", methode:"Plateaux ascendants — méthode Reg Park adaptée",
    objectif:"Densité et force : commencer lourd, diminuer la charge d'environ 5-6 % par palier.",
    metcon:"1–2×/sem. — 5 sprints de 30 s + 60 s de repos, 3 min de repos, 3-4 circuits.",
    deload:true,
    split:"4 jours — Haut 1 · Bas 1 · Haut 2 · Bas 2",
    sessions:{
      J1:{nom:"Haut du corps 1", muscles:['epA','dos','pec','tri','bic'],
        exos:[
          E("Développé militaire debout","epA",6,"5,5,7,7,9,9","4010",120,"Charge maximale puis -5-6 % par palier."),
          E("Tractions supination (chin-up)","dos",6,"5,5,7,7,9,9","4010",120,"Ajouter du poids si nécessaire."),
          E("Développé haltères plat","pec",4,"7-9","4010",90),
          E("Rowing assis câble unilatéral","dos",4,"7-9","3011",90),
          E("French press barre EZ","tri",3,"10-12","3010",75),
          E("Curl Zottman","bic",3,"10-12","3010",75)
        ]},
      J2:{nom:"Bas du corps 1", muscles:['qua','isc','abs'],
        exos:[
          E("Back squat barre haute","qua",6,"5,5,7,7,9,9","4010",180,"Charge maximale puis -5-6 % par palier."),
          E("Squat cycliste","qua",5,"7-9","4010",120),
          E("Good morning debout","isc",4,"10-12","3020",90),
          E("Leg press unilatéral","qua",4,"10-12","3010",90),
          E("Wood chop poulie haute","abs",3,"10-12","3010",75)
        ]},
      J3:{nom:"Haut du corps 2", muscles:['pec','dos','epA','tri','bic'],
        exos:[
          E("Développé couché barre plat","pec",6,"5,5,7,7,9,9","4010",120,"Charge maximale puis -5-6 % par palier."),
          E("Tractions (pull-up)","dos",6,"5,5,7,7,9,9","4010",120),
          E("Développé haltère un bras debout","epA",4,"7-9","4010",90),
          E("Rowing barre EZ supination, buste penché","dos",4,"7-9","3011",90),
          E("Extensions triceps barre EZ + pullover","tri",3,"10-12","3010",75),
          E("Curl concentration","bic",3,"10-12","3010",75)
        ]},
      J4:{nom:"Bas du corps 2", muscles:['isc','qua','abs','mol'],
        exos:[
          E("Soulevé de terre","isc",6,"5,5,7,7,9,9","4010",180,"Charge maximale puis -5-6 % par palier."),
          E("Split squat barbell (pied avant surélevé)","qua",4,"7-9","3210",90),
          E("Leg curl allongé, 1 1/4 en haut","isc",4,"5-7","3210",90),
          E("Jackknife sur swiss ball","abs",4,"10-12","3020",75),
          E("Mollets debout","mol",4,"10-12","3020",75)
        ]}
    }
  },
  11:{
    titre:"Accumulation 6 — Plateaux ascendants volume", type:"accumulation", macro:"C · Perfectionnement", mois:"S. 41–44",
    schema:"8-10 (double plateau)", intensite:"78 %", methode:"5 × 8-10 + méthode 1 1/4",
    objectif:"Dernière grande accumulation : volume, technique, remplissage glycogénique avant le pic final.",
    metcon:"2×/sem. — 10 sprints de 45 s, 90 s de repos.",
    deload:false,
    split:"3 jours — Bras/épaules · Jambes · Pectoraux/Dos",
    sessions:{
      J1:{nom:"Bras & épaules", muscles:['tri','bic','epA','epL'],
        exos:[
          E("Développé couché décliné prise serrée","tri",5,"8-10","3010",90),
          E("Curl barre debout","bic",5,"8-10","3010",90),
          E("Extensions triceps haltères plat","tri",4,"8-10","3210",90,"Méthode 1 1/4 en bas."),
          E("Curl haltères incliné, prise neutre","bic",4,"8-10","3210",90,"Méthode 1 1/4 en bas."),
          E("Développé haltères assis, prise neutre","epA",4,"8-10","3210",90,"Méthode 1 1/4 en bas."),
          E("Élévations latérales lean away","epL",3,"12-15","3011",60)
        ]},
      J2:{nom:"Jambes", muscles:['qua','isc','mol'],
        exos:[
          E("Front squat","qua",5,"4-6","3010",0),
          E("Back squat barre haute","qua",5,"2-4","3010",120,"Même charge que le front squat."),
          E("Soulevé de terre roumain barre","isc",5,"8-10","4010",120),
          E("Leg curl allongé","isc",4,"6-8","3210",90,"Méthode 1 1/4 en haut."),
          E("Hack squat","qua",4,"8-10","3210",90,"Méthode 1 1/4 en haut."),
          E("Mollets debout","mol",4,"8-10","3210",60,"Méthode 1 1/4 en bas.")
        ]},
      J3:{nom:"Pectoraux & dos", muscles:['pec','dos'],
        exos:[
          E("Développé incliné barre","pec",5,"8-10","3010",90),
          E("Rowing assis, prise neutre","dos",5,"8-10","3010",90),
          E("Développé haltères plat, prise neutre","pec",4,"8-10","3210",90,"Méthode 1 1/4 en bas."),
          E("Tirage vertical lean away","dos",4,"8-10","3012",90,"Méthode 1 1/4 en bas."),
          E("Écartés haltères décliné","pec",3,"12-15","3010",60),
          E("Pullover haltère plat","dos",3,"12-15","3010",60)
        ]}
    }
  },
  12:{
    titre:"Intensification 6 — Wave load final", type:"intensification", macro:"C · Perfectionnement", mois:"S. 45–48",
    schema:"8, 6, 4 (vague)", intensite:"85 %", methode:"Wave loading 8,6,4,8,6,4 — pic annuel",
    objectif:"PIC de l'année : battre tous vos records (développé couché, militaire, squat, soulevé de terre) et sculpter la densité finale.",
    metcon:"1–2×/sem. — 8 sprints de 20 s + 10 s de repos, 3 min de repos, 4-5 circuits.",
    deload:true,
    split:"4 jours — Haut 1 · Bas 1 · Haut 2 · Bas 2",
    sessions:{
      J1:{nom:"Haut du corps 1", muscles:['epA','dos','pec','tri','bic'],
        exos:[
          E("Développé militaire debout","epA",6,"8,6,4,8,6,4","3010",120,"Vague : 8→6→4 puis recommencer."),
          E("Tractions prise neutre (chin-up)","dos",6,"8,6,4,8,6,4","3010",120,"Ajouter du poids si nécessaire."),
          E("Développé couché plat, inertie depuis les pins","pec",5,"6-8","4010",120,"Pause complète sur les pins."),
          E("Rowing haltère un bras","dos",5,"6-8","3011",120)
        ]},
      J2:{nom:"Bas du corps 1", muscles:['qua','isc','abs'],
        exos:[
          E("Back squat barre haute","qua",6,"8,6,4,8,6,4","3010",180,"Vague 8→6→4."),
          E("Soulevé de terre partiel","isc",6,"6-8","3210",180,"Barres de sécurité à hauteur des genoux."),
          E("Relevés de jambes suspendu","abs",4,"10-12","3020",90)
        ]},
      J3:{nom:"Haut du corps 2", muscles:['pec','dos','epA'],
        exos:[
          E("Développé couché barre plat","pec",6,"8,6,4,8,6,4","3010",120,"Vague 8→6→4."),
          E("Tractions (pull-up)","dos",6,"8,6,4,8,6,4","3010",120,"Ajouter du poids si nécessaire."),
          E("Développé militaire, inertie depuis les pins","epA",5,"6-8","3210",120,"Barre à hauteur du front."),
          E("Rowing haltère un bras, coude ouvert","dos",5,"6-8","3011",120)
        ]},
      J4:{nom:"Bas du corps 2", muscles:['isc','qua','abs'],
        exos:[
          E("Soulevé de terre","isc",6,"8,6,4,8,6,4","3010",180,"Vague 8→6→4 — record annuel ici !"),
          E("Drop lunges (fentes contrôlées)","qua",6,"8-10","1010",180),
          E("Ab wheel (roulette)","abs",4,"10-12","3020",90)
        ]}
    }
  }
};

/* Récapitulatif périodisation pour l'affichage */
const PERIODISATION = [
  {mois:[1,4], nom:"MACROCYCLE A — FONDATIONS", desc:"Technique, capacité de travail, première vague de force (70 % → 81 %).", phases:[1,2,3,4]},
  {mois:[5,8], nom:"MACROCYCLE B — DÉVELOPPEMENT", desc:"Volume avancé, force accrue, densité (74 % → 83 %).", phases:[5,6,7,8]},
  {mois:[9,12], nom:"MACROCYCLE C — PERFECTIONNEMENT", desc:"Densité, pics de force, finalisation (76 % → 85 %).", phases:[9,10,11,12]},
  {mois:[13,13], nom:"PHASE FINALE — AFFÛTAGE", desc:"Semaines 49-52 : affûtage esthétique, maintien de la force, bilan complet.", phases:['F']}
];

/* Aliments simplifiés (par 100 g) pour le plan de repas */
const ALIMENTS = {
  'Blanc de poulet':{cal:120,p:24,g:0,f:2.5,cat:'prot'},
  'Blanc de dinde':{cal:110,p:23,g:0,f:1.5,cat:'prot'},
  'Bœuf haché 5 %':{cal:137,p:21,g:0,f:5.5,cat:'prot'},
  'Œufs entiers':{cal:143,p:12.5,g:0.7,f:10,cat:'prot'},
  'Blancs d\'œufs':{cal:52,p:11,g:0.7,f:0.2,cat:'prot'},
  'Saumon':{cal:208,p:20,g:0,f:13,cat:'prot'},
  'Thon au naturel':{cal:116,p:26,g:0,f:0.9,cat:'prot'},
  'Fromage blanc 0 %':{cal:70,p:12,g:4,f:0.3,cat:'prot'},
  'Yaourt grec nature':{cal:97,p:9,g:3.9,f:5,cat:'prot'},
  'Whey protéine':{cal:400,p:80,g:8,f:6,cat:'prot'},
  'Riz blanc cuit':{cal:130,p:2.7,g:28,f:0.3,cat:'glu'},
  'Riz complet cuit':{cal:111,p:2.6,g:23,f:0.9,cat:'glu'},
  'Pâtes cuites':{cal:158,p:5.8,g:31,f:0.9,cat:'glu'},
  'Pommes de terre':{cal:77,p:2,g:17,f:0.1,cat:'glu'},
  'Patate douce':{cal:86,p:1.6,g:20,f:0.1,cat:'glu'},
  'Flocons d\'avoine':{cal:379,p:13,g:67,f:7,cat:'glu'},
  'Pain complet':{cal:247,p:13,g:41,f:3.4,cat:'glu'},
  'Quinoa cuit':{cal:120,p:4.4,g:21,f:1.9,cat:'glu'},
  'Banane':{cal:89,p:1.1,g:23,f:0.3,cat:'fruit'},
  'Pomme':{cal:52,p:0.3,g:14,f:0.2,cat:'fruit'},
  'Brocoli':{cal:34,p:2.8,g:7,f:0.4,cat:'leg'},
  'Épinards':{cal:23,p:2.9,g:3.6,f:0.4,cat:'leg'},
  'Huile d\'olive':{cal:884,p:0,g:0,f:100,cat:'lip'},
  'Amandes':{cal:579,p:21,g:22,f:50,cat:'lip'},
  'Beurre de cacahuète':{cal:588,p:25,g:20,f:50,cat:'lip'},
  'Avocat':{cal:160,p:2,g:9,f:15,cat:'lip'}
};

const MENS_FIELDS = [
  ['cou','Tour de cou'],['epaules','Tour d\'épaules'],['poitrine','Tour de poitrine'],
  ['brasD','Bras droit'],['brasG','Bras gauche'],['avBrasD','Avant-bras droit'],['avBrasG','Avant-bras gauche'],
  ['taille','Tour de taille'],['ventre','Tour de ventre'],['hanches','Tour de hanches'],
  ['cuisseD','Cuisse droite'],['cuisseG','Cuisse gauche'],['molletD','Mollet droit'],['molletG','Mollet gauche']
];


/* ============================================================
   BILAN DE FORCE MAXIMALE (1RM) — test & correspondance des charges
   ============================================================ */
const FORCE_REVAL_WEEKS = 8; // fréquence de réévaluation fixée par le coach

const TEST_1RM = {
  titre:"Bilan de force maximale (1RM)",
  exercices:[
    {key:'bench', nom:"Développé couché", ic:"🏋️", essentiel:true},
    {key:'squat', nom:"Back squat", ic:"🦵", essentiel:true},
    {key:'dead', nom:"Soulevé de terre", ic:"🏋️", essentiel:true},
    {key:'ohp', nom:"Développé militaire debout", ic:"💪", essentiel:true},
    {key:'row', nom:"Rowing barre buste penché", ic:"🦍", essentiel:false},
    {key:'pullup', nom:"Tractions (poids additionnel)", ic:"🦍", essentiel:false},
    {key:'dips', nom:"Dips (poids additionnel)", ic:"💪", essentiel:false},
    {key:'curl', nom:"Curl barre", ic:"💪", essentiel:false},
    {key:'triext', nom:"Extension triceps (câble/barre)", ic:"💪", essentiel:false},
    {key:'latraise', nom:"Élévations latérales", ic:"🔷", essentiel:false}
  ]
};

/* Charge suggérée = 1RM de l'exercice × % de la phase (selon fourchette de reps).
   [base, motif (normalisé), ratio, perHand?] — le 1er motif qui correspond gagne,
   donc les motifs spécifiques précèdent les génériques. */
const CHARGE_RULES = [
  // --- Sur-correspondances prioritaires (trancher les ambiguïtés) ---
  ['triext','french',1.0], ['triext','triceps',1.0], ['triext','pushdown',1.0],
  ['triext','extension triceps',1.0], ['triext','barre au front',0.95],
  ['dead','leg curl',0.30], ['dead','ischio',0.30],
  ['squat','leg extension',0.35],
  ['squat','mollet',0.45], ['squat','calf',0.45],
  ['latraise','elevations lat',1.0,true], ['latraise','lateral raise',1.0,true], ['latraise','lateral',1.0,true],
  ['ohp','lean away',0.25,true], ['ohp','telle raise',0.25,true],
  ['ohp','prone',0.20,true], ['ohp','rear delt',0.20,true], ['ohp','face pull',0.20], ['ohp','wood chop',0.25],
  // --- Squat et dérivés (avant le motif générique 'squat') ---
  ['squat','front squat',0.85], ['squat','back squat',1.0],
  ['squat','hack',0.90], ['squat','leg press',1.20], ['squat','presse',1.20],
  ['squat','lunge',0.45], ['squat','fente',0.45],
  ['squat','bulgarian',0.35], ['squat','bulgare',0.35], ['squat','split squat',0.35],
  ['squat','step up',0.35], ['squat','cyclist',0.80], ['squat','cycliste',0.80],
  ['squat','safety bar',1.0],
  ['squat','squat',1.0],
  // --- Développé couché, presses haltères et dérivés ---
  ['bench','developpe couche',1.0],
  // Presses haltères d'abord (par côté) pour ne pas être captées par 'incline'/'decline'
  ['ohp','haltere un bras',0.45,true], ['ohp','halteres assis',0.45,true], ['ohp','seated dumbell press',0.45,true],
  ['bench','developpe halt',0.45,true],
  ['bench','flat dumbell press',0.45,true], ['bench','incline dumbell press',0.45,true], ['bench','decline dumbell press',0.45,true],
  ['bench','dumbell press',0.45,true],
  // Puis barre incliné / décliné
  ['bench','incline',0.85], ['bench','developpe inclin',0.85],
  ['bench','decline',0.90], ['bench','developpe declin',0.90],
  ['bench','close grip',0.85], ['bench','prise serree',0.85],
  ['bench','ecart',0.30,true], ['bench','fly',0.30,true],
  ['bench','cable croise',0.30,true], ['bench','crossover',0.30,true], ['bench','croise',0.30,true],
  ['bench','bench',1.0],
  // --- Soulevé de terre et chaîne postérieure ---
  ['dead','roumain',0.70], ['dead','romanian',0.70],
  ['dead','good morning',0.50],
  ['dead','back extension',0.35], ['dead','hyperextension',0.35],
  ['dead','glute ham',0.40],
  ['dead','souleve de terre',1.0], ['dead','deadlift',1.0],
  // --- Épaules / développé militaire ---
  ['ohp','militaire',1.0], ['ohp','derriere la nuque',1.0], ['ohp','behind the neck',1.0], ['ohp','overhead',1.0],
  ['ohp','california',0.80],
  ['ohp','press',1.0],
  // --- Tractions (poids additionnel) ---
  ['pullup','traction',1.0], ['pullup','pull up',1.0], ['pullup','chin up',1.0],
  ['pullup','pull-up',1.0], ['pullup','chin-up',1.0], ['pullup','lean away pull',1.0],
  // --- Dips ---
  ['dips','dips',1.0], ['dips','dip',1.0],
  // --- Curls (barre ; haltères par côté) ---
  ['curl','curl marteau',0.80], ['curl','marteau',0.80], ['curl','hammer',0.80],
  ['curl','dumbell curl',0.50,true], ['curl','zottman',0.50,true], ['curl','concentration',0.45,true],
  ['curl','scott',0.85],
  ['curl','poulie basse',0.75], ['curl','low pulley',0.75],
  ['curl','curl',1.0],
  // --- Rowing / dos ---
  ['row','rowing assis',0.80], ['row','seated row',0.80],
  ['row','rowing',1.0], ['row','row',1.0],
  ['row','tirage vertical',0.80], ['row','lat pulldown',0.80], ['row','tirage',0.80],
  ['row','pullover',0.45]
];

/* Repli par groupe musculaire si aucun motif ne correspond */
const CHARGE_FALLBACK = {
  pec:['bench',0.80], dos:['row',1.0], epA:['ohp',0.85], epL:['latraise',0.90], epP:['ohp',0.40],
  bic:['curl',0.90], tri:['triext',0.90], avb:['curl',0.40], abs:null, lom:['dead',0.40],
  fes:['squat',0.60], qua:['squat',0.70], isc:['dead',0.45], add:['squat',0.40], mol:['squat',0.45]
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
    {ic:'🚴', nom:'Cardio léger', temps:'5 min',
     quoi:'Vélo, rameur, tapis, marche rapide ou corde à sauter à intensité FACILE : vous devez pouvoir parler sans difficulté. Objectif : augmenter la température du corps et lubrifier les articulations.'},
    {ic:'🔄', nom:'Mobilité articulaire complète', temps:'2-3 min',
     quoi:'10 rotations LENTES dans chaque sens, dans l\'ordre : cou → épaules (grands cercles avant puis arrière) → coudes & poignets → hanches → genoux → chevilles. Terminez par des rotations du tronc, bras pliés devant la poitrine.'},
    {ic:'🏋️', nom:'Séries d\'approche sur le 1er exercice', temps:'3-5 min',
     quoi:'Préparez le système nerveux et validez votre charge sur le premier exercice de la séance :\n• Série 1 : ~50 % de la charge de travail (barre légère ou haltères), 8-10 reps faciles\n• Série 2 : ~70 %, 5-8 reps contrôlées\n• Série 3 : ~85 %, 3-5 reps propres (si besoin)\nPuis repos 1-2 min avant la 1ère série de travail. Ne JAMAIS attaquer une série lourde sans cette approche.'}
  ]
};
const ACTIVATION_JAMBES = '2×10 squats au poids du corps (lents) + 2×10 ponts fessiers + 2×10 élévations mollets. But : réveiller quadriceps, fessiers et mollets avant de charger.';
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
    ['🕊️','Pigeon assis','30-45 s/côté','Assis, une cheville posée sur l\'autre genou, penchez-vous doucement vers l\'avant, dos droit.']
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

const LS_KEY = 'tmx12_transform_v1';
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
  return {
    profil:{nom:'',date:'',age:'',taille:'',poidsDepart:'',objectifPoids:'',niveau:'intermediaire',annees:'',seancesSemaine:4,mg:'',mm:''},
    mensurations:{jour0:{},mensuel:{}},
    poids:{}, mg:{},
    objectifs:{principal:'recomposition',cibles:{}},
    objectifsMensuels:{},
    photos:{j0:{face:'',profil:'',dos:'',compl:''},m3:{face:'',profil:'',dos:'',compl:''},m6:{face:'',profil:'',dos:'',compl:''},m9:{face:'',profil:'',dos:'',compl:''},m12:{face:'',profil:'',dos:'',compl:''}},
    journal:{}, seances:{}, recup:{},
    nutri:{phase:'recomp',auto:true,ajustement:0,manuel:null,plan:null,journal:{}},
    force:{date:'',valeurs:{},historique:[],freqWeeks:FORCE_REVAL_WEEKS,repsMax:{}},
    hebdo:{},
    natation:{seances:[],planDim:false,jours:[]},
    cardio:{seances:[]},
    tabata:{seances:[]},
    stretchSuivi:{},
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
  if(storageAvailable()){
    try{ localStorage.setItem(LS_KEY, data); }
    catch(e){
      // quota plein : on garde quand même en mémoire pour la session
      memoryStore[LS_KEY]=data;
      toast('⚠️ Stockage local plein : exportez vos données (⚙️) et réduisez les photos.');
    }
  } else {
    memoryStore[LS_KEY]=data;
    showStorageBanner();
  }
}
function load(){
  let raw=null;
  try{ raw = localStorage.getItem(LS_KEY); }catch(e){ raw = memoryStore[LS_KEY]||null; }
  if(raw){ try{ const d=JSON.parse(raw); state=Object.assign(defaultState(), d); }catch(e){} }
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
  'p-niveau':'niveau','p-seances':'seancesSemaine'
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
function closeModal(){ const ovs=document.querySelectorAll('#modal-root .modal-ov'); const ov=ovs[ovs.length-1]; if(ov){ ov.remove(); } if(!document.querySelector('#modal-root .modal-ov')){ document.body.style.overflow=''; } }

/* ---------- Navigation ---------- */
const NAV=[['v-dashboard','🏠','Dashboard'],['v-profil','👤','Profil'],['v-force','🔢','Bilan 1RM'],['v-mensurations','📏','Mensurations'],['v-entrainement','🏋️','Entraînement'],['v-nutrition','🍽️','Nutrition'],['v-repas','🥗','Repas'],['v-recuperation','😴','Récupération'],['v-progression','📊','Progression'],['v-photos','📸','Photos'],['v-calendrier','📅','Calendrier'],['v-objectifs','🏆','Objectifs'],['v-equipe','🧠','Équipe'],['v-piscine','🏊','Piscine'],['v-cardio','⚡','Cardio']];
function buildNav(){
  $('#topnav').innerHTML = NAV.map(n=>'<button data-v="'+n[0]+'" onclick="go(\''+n[0]+'\')"><span class="ic">'+n[1]+'</span>'+n[2]+'</button>').join('');
  const primary = ['v-dashboard','v-entrainement','v-repas','v-nutrition','v-recuperation'].map(id=>NAV.find(n=>n[0]===id)).filter(Boolean);
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
  else if(vid==='v-nutrition') renderNutrition();
  else if(vid==='v-repas') renderRepas();
  else if(vid==='v-recuperation') renderRecuperation();
  else if(vid==='v-progression') renderProgression();
  else if(vid==='v-photos') renderPhotos();
  else if(vid==='v-calendrier') renderCalendrier();
  else if(vid==='v-objectifs') renderObjectifs();
  else if(vid==='v-equipe') renderEquipe();
  else if(vid==='v-piscine') renderPiscine();
  else if(vid==='v-cardio') renderCardio();
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

/* ---------- Plan de la semaine ---------- */
function weekPlan(dateStr){
  const pos = programPos(dateStr);
  const phase = pos.phase;
  const keys = Object.keys(phase.sessions||{});
  const n = keys.length;
  const a = clamp(parseInt(state.profil.seancesSemaine||4)||4, 3, 5);
  const eff = Math.min(a, n);
  const start = parseDate(startDate());
  const d = parseDate(dateStr);
  const weekGlobal = Math.max(0, Math.floor((d-start)/86400000/7));
  const monday = addDays(start, weekGlobal*7);
  const off = weekGlobal % n;
  let plan=[];
  for(let i=0;i<7;i++){
    const day = addDays(monday,i);
    const wk = day.getDay(); // 0 dim..6 sam
    let key=null, type=null;
    const slot = (wk===1)?0:(wk===2)?1:(wk===3)?2:(wk===4)?3:(wk===5)?4:(wk===6)?5:6;
    const trainDays = a===3?[1,3,5]:a===4?[1,2,4,5]:[1,2,4,5,6];
    if(trainDays.includes(wk)){
      const idx = trainDays.indexOf(wk);
      if(idx < eff){
        key = 'J'+((idx+off)%n+1);
        type='seance';
      }
    }
    // METCON sur les jours restants (jamais le même jour qu'une séance)
    if(!key && !pos.deload && phase.type!=='finale'){
      const metDays = a===3?[2,6]:a===4?[3,6]:[3,0];
      if(metDays.includes(wk)){ key='METCON'; type='metcon'; }
    }
    if(!key && !pos.deload && phase.type!=='finale'){ try{ if(poolDays().indexOf(wk)>=0){ key='PISCINE'; type='piscine'; } }catch(_){} }
    plan.push({date:dateKey(day),wk,key,type,
      label: key? (type==='metcon'?'⚡ METCON imposé (coach) : elliptique + piscine':type==='piscine'?'🏊 Piscine imposée (coach) : elliptique + piscine':(phase.sessions[key]||{}).nom) : 'Repos',
      session: key&&type==='seance' ? phase.sessions[key] : null});
  }
  return plan;
}
function planifieMois(mois){
  const phase = PROGRAM[mois]||PROGRAM.finale;
  return {mois, phase};
}

/* ---------- Nutrition ---------- */
function bmr(p){
  if(!p.age||!p.taille||!p.poidsDepart) return null;
  return 10*(+p.poidsDepart) + 6.25*(+p.taille) - 5*(+p.age) + 5;
}
function tdee(p){
  const b = bmr(p); if(!b) return null;
  const se = clamp(parseInt(p.seancesSemaine||4)||4,3,5);
  const facteur = se>=5?1.7:se===4?1.625:1.55;
  return Math.round(b*facteur);
}
function objectifPrincipalTexte(){
  const map = {
    masse:'Prise de masse musculaire — surplus calorique contrôlé tout au long du programme.',
    esthetique:'Esthétique — construction équilibrée avec un léger surplus, puis affûtage en fin d\'année.',
    recomposition:'Recomposition corporelle — maintien calorique, protéines élevées, perte de gras + gain de muscle.',
    seche:'Perte de graisse — déficit calorique modéré en préservant la masse musculaire.',
    force:'Force — surplus modéré, priorité aux charges lourdes et aux exercices de base.'
  };
  return map[state.objectifs.principal]||'';
}
function phaseNutritionRecommandee(){
  const mg = parseFloat(state.profil.mg);
  const obj = state.objectifs.principal;
  if(obj==='masse') return 'surplus';
  if(obj==='seche') return 'deficit';
  if(obj==='force') return 'surplus';
  if(obj==='esthetique') return mg>=22?'recomp':'surplus';
  return mg>=20?'recomp':'maintien';
}
function caloriesCibles(){
  const t = tdee(state.profil);
  if(!t) return null;
  const p = state.nutri.phase||'maintien';
  const obj = state.objectifs.principal;
  let cal = t;
  if(p==='surplus') cal = obj==='force'? t*1.08 : t*1.12;
  else if(p==='deficit') cal = t*0.82;
  else if(p==='recomp') cal = t*1.00;
  else cal = t*1.02;
  cal += (state.nutri.ajustement||0);
  const prot = (obj==='seche'||p==='recomp') ? 2.2 : 2.0;
  const lip = 1.0;
  const pG = round1(prot*(+state.profil.poidsDepart));
  const lG = round1(lip*(+state.profil.poidsDepart));
  const cG = Math.max(60, Math.round((cal - pG*4 - lG*9)/4));
  return {cal:Math.round(cal), prot:pG, glu:cG, lip:lG, tdee:t};
}
function nutriPhaseInfo(){
  const map = {
    maintien:{n:'Maintien',ic:'⚖️',desc:'Calories ~ dépense : stabilisation du poids, base de la recomposition.',coul:'chip-blue'},
    surplus:{n:'Surplus contrôlé',ic:'📈',desc:'+10 à 12 % : prise de masse musculaire progressive en limitant le gras.',coul:'chip-green'},
    deficit:{n:'Déficit',ic:'📉',desc:'-15 à 18 % : perte de graisse en préservant le muscle grâce aux protéines élevées.',coul:'chip-orange'},
    recomp:{n:'Recomposition',ic:'♻️',desc:'Maintien calorique + protéines 2,2 g/kg : perte de gras et gain de muscle simultanés.',coul:'chip-gold'}
  };
  return map[state.nutri.phase]||map.maintien;
}
function strategieAnnuelle(){
  const strats = [
    {mois:1, nom:'Surplus contrôlé (ou maintien si MG élevée)', detail:'Base : 2,0-2,2 g/kg de protéines. Calories = dépense +10 % si MG < 15-20 %, sinon maintien.', phase:'surplus'},
    {mois:2, nom:'Surplus contrôlé — ajustement', detail:'Maintenir le surplus. Si prise > 1 %/mois, réduire de 100 kcal.', phase:'surplus'},
    {mois:3, nom:'Surplus contrôlé — montée progressive', detail:'Volume élevé : glucides augmentés autour des entraînements.', phase:'surplus'},
    {mois:4, nom:'Maintien (fin de macrocycle)', detail:'Semaine 4 en deload : maintien strict pour stabiliser.', phase:'maintien'},
    {mois:5, nom:'Surplus modéré', detail:'+8-10 % : reprise de la construction.', phase:'surplus'},
    {mois:6, nom:'Surplus modéré', detail:'Glucides maintenus, protéines 2,0 g/kg.', phase:'surplus'},
    {mois:7, nom:'Maintien ou surplus léger', detail:'Selon l\'évolution du tour de taille.', phase:'maintien'},
    {mois:8, nom:'Maintien (fin de macrocycle)', detail:'Force au pic : maintien strict.', phase:'maintien'},
    {mois:9, nom:'Recomposition', detail:'Maintien, protéines 2,2 g/kg : redémarrage métabolique.', phase:'recomp'},
    {mois:10, nom:'Maintien strict', detail:'Charges lourdes : maintien strict pour la performance.', phase:'maintien'},
    {mois:11, nom:'Déficit léger (-10 %)', detail:'Début de l\'affûtage : protéines 2,2 g/kg.', phase:'deficit'},
    {mois:12, nom:'Déficit léger (-12 à 15 %)', detail:'Affûtage final pour révéler le muscle construit.', phase:'deficit'},
    {mois:13, nom:'Maintien — bilan final', detail:'Semaines 49-52 : retour progressif au maintien.', phase:'maintien'}
  ];
  return strats;
}
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
  if(phase==='surplus') attendu = state.objectifs.principal==='force'?0.15:0.25;
  if(phase==='deficit') attendu = -0.5;
  if(phase==='recomp'||phase==='maintien') attendu = 0.02;
  const ecart = taux - attendu;
  let delta=0, msg='';
  if(Math.abs(ecart)>0.25){
    delta = ecart>0 ? -100 : 100;
    msg = ecart>0
      ? '⚠️ Votre poids augmente plus vite que prévu ('+round1(taux)+' kg/sem.) : '+Math.abs(delta)+' kcal/jour suggérées en moins.'
      : '⚠️ Votre poids n\'augmente pas assez ('+round1(taux)+' kg/sem.) : +'+Math.abs(delta)+' kcal/jour suggérées.';
  } else if(duree>=1){
    msg = '✅ Tendance de poids conforme aux objectifs ('+round1(taux)+' kg/sem.). Aucun ajustement nécessaire.';
  } else msg='';
  return {msg, delta};
}
function macroJour(mois){
  const c = caloriesCibles(); if(!c) return null;
  const plan=strategieAnnuelle(); const st=plan[clamp(mois,1,13)-1]||plan[0];
  let prot=c.prot, lip=c.lip;
  if(st.phase==='deficit'||st.phase==='recomp'){ prot = round1(2.2*(+state.profil.poidsDepart)); }
  const cal = Math.round(st.phase==='surplus'? c.tdee*(mois===1?1.10:mois===2?1.10:mois===3?1.12:1.08) : st.phase==='deficit'? c.tdee*(mois===11?0.90:0.88) : c.tdee*(mois===13?1.0:(state.nutri.ajustement||0)>0?1.01:0.99));
  const glu = Math.max(60, Math.round((cal - prot*4 - lip*9)/4));
  return {cal, prot, glu, lip, phase:st.phase, nom:st.nom};
}
/* ---------- Plan de repas jour par jour ---------- */
function genererPlanJour(mois, jourIdx){
  const m = macroJour(mois); if(!m) return null;
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
  return {plan, final, cible:T};
}
function genererPlanRepas(mois){ return genererPlanJour(mois, 0); }

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
  if(rm!=null && rm<60) conseils.push({ic:'📊',tag:'Analyste',txt:'Récupération moyenne de la semaine : '+rm+'/100. Envisagez 1 séance en moins ou remplacez un METCON par une marche active.'});
  if(!conseils.length) conseils.push({ic:'👍',tag:'Coach',txt:'Semaine conforme au plan : on maintient le cap. Poursuivez la montée de charge (+2,5 %) sur les exercices principaux.'});
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
    g.addColorStop(0, opts.color||'#ffb300'); g.addColorStop(1, opts.color2||'#ff7a00');
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.roundRect(x-bw/2, padT+ih-bh, bw, bh, 4); ctx.fill();
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
  const col = color||(val>=75?'#2dd4a7':val>=50?'#ffb300':'#ff5252');
  return '<svg data-audit-asset="2"><text x="70" y="66" text-anchor="middle" fill="#fff" font-size="30" font-weight="900" font-family="inherit">'+Math.round(val)+'</text><text x="70" y="86" text-anchor="middle" fill="#8b98b3" font-size="9" font-weight="700" letter-spacing="1">'+label+'</text></svg>';
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
const MAIN_LIFTS = {
  bench:{n:'Développé couché', ic:'🏋️', match:['developpe couche','bench','flat bench']},
  squat:{n:'Squat', ic:'🏋️', match:['squat','front squat','back squat','high bar']},
  dead:{n:'Soulevé de terre', ic:'🏋️', match:['soulevé de terre','deadlift','soulevé de terre partiel']},
  ohp:{n:'Développé militaire', ic:'🏋️', match:['militaire','overhead press','behind the neck','develope militaire']}
};
function est1RM(charge,reps){ return charge && reps ? charge*(1+(+reps)/30) : null; }
function perfSerie(key){
  const match = MAIN_LIFTS[key].match;
  let best=null;
  Object.entries(state.journal).sort().forEach(([d,j])=>{
    (j.exos||[]).forEach(e=>{
      if(!e.ch||!e.reps) return;
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
  const out=[];
  Object.entries(state.journal).sort().forEach(([d,j])=>{
    (j.exos||[]).forEach(e=>{
      if(!e.ch||!e.reps) return;
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
function statutMuscle(sets, zone){
  if(sets<zone[0]) return {s:'🔴', cls:'chip-red', txt:'sous-entraîné'};
  if(sets>zone[1]) return {s:'🟠', cls:'chip-orange', txt:'à surveiller (surplus de volume)'};
  return {s:'🟢', cls:'chip-green', txt:'correctement stimulé'};
}

/* ---------- Échauffement & étirements (préparation de séance) ---------- */
function echauffementPour(session){
  const muscles = session.muscles || [];
  const hasLegs = muscles.some(m=>['qua','isc','mol','fes','add'].includes(m));
  const hasPush = muscles.some(m=>['pec','epA','tri'].includes(m));
  const hasArms = muscles.some(m=>['bic','tri','avb'].includes(m));
  let activation;
  if(hasLegs) activation = ACTIVATION_JAMBES;
  else if(hasPush) activation = ACTIVATION_HAUT;
  else if(hasArms) activation = ACTIVATION_BRAS;
  else activation = ACTIVATION_HAUT;
  return {
    etapes: ECHAUFFEMENT.etapes,
    activation: {ic:'⚡', nom:'Activation spécifique', temps:'1-2 min', quoi:activation}
  };
}
function etirementsPour(muscles){
  const vus = {};
  const out = [];
  (muscles||[]).forEach(m=>{
    const g = ETIREMENTS_PAR_MUSCLE[m];
    if(!g || vus[g.nom]) return;
    vus[g.nom] = 1;
    out.push({key:m, nom:g.nom, exos:g.exos});
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
BADGES.push(
  {id:'piscine-1', ic:'🏊', n:'Première piscine', d:'1 séance piscine 8,5×4'},
  {id:'piscine-10', ic:'🌊', n:'10 piscines', d:'10 séances piscine'},
  {id:'tabata-1', ic:'⚡', n:'Premier Tabata', d:'1 Tabata terminé'},
  {id:'tabata-10', ic:'🔥', n:'10 Tabatas', d:'10 Tabatas terminés'},
  {id:'cardio-5', ic:'🫀', n:'5 cardios', d:'5 séances cardio'},
  {id:'demos-10', ic:'🎬', n:'Œil du coach', d:'10 démos visionnées'}
);
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
  const poolN=(state.natation&&state.natation.seances?state.natation.seances.length:0);
  const tabN=(state.tabata&&state.tabata.seances?state.tabata.seances.length:0);
  const carN=(state.cardio&&state.cardio.seances?state.cardio.seances.length:0);
  const demN=(state.ui&&state.ui.demosVues)||0;
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
    'transformation-12':moisEcoules>=12 || moisEcoules==='F',
    'piscine-1':poolN>=1, 'piscine-10':poolN>=10,
    'tabata-1':tabN>=1, 'tabata-10':tabN>=10,
    'cardio-5':carN>=5, 'demos-10':demN>=10
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
function scoreProgressionMesures(){
  const j0=state.mensurations.jour0||{};
  const dernier=dernierMensuration();
  if(!dernier) return 20;
  let gain=0, nb=0;
  MENS_FIELDS.forEach(([k])=>{
    const a=parseFloat(j0[k]), b=parseFloat(dernier[k]);
    if(a&&b){ gain += (b-a); nb++; }
  });
  if(!nb) return 20;
  const cible = (state.objectifs.cibles||{}).bras || 5;
  const v = clamp(Math.round(((gain/nb)/Math.max(1,cible*0.5))*100), 0, 100);
  return Math.round(v*0.5 + 50);
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
  a.download='transformation_12_mois_sauvegarde.json'; a.click();
  URL.revokeObjectURL(a.href);
  toast('📦 Données exportées');
}
function importData(file){
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const d=JSON.parse(e.target.result);
      state=Object.assign(defaultState(),d); save(); location.reload();
    }catch(err){ toast('❌ Fichier invalide'); }
  };
  reader.readAsText(file);
}
function openSettings(){
  openModal(
    '<h3>⚙️ Données & sauvegarde</h3>'+
    '<div class="field"><label>Exporter mes données</label><button class="btn btn-grad btn-block" onclick="exportData()">📦 Télécharger le fichier de sauvegarde</button></div>'+
    '<div class="field mt"><label>Importer des données</label><input type="file" class="inp" accept=".json" onchange="importData(this.files[0])"></div>'+
    '<div class="danger-box mt">Réinitialiser supprime définitivement toutes les données enregistrées dans ce navigateur (profil, journal, photos, mesures). Exportez d\'abord une sauvegarde si nécessaire.</div>'+
    '<button class="btn btn-red btn-block mt" onclick="if(confirm(\'Toutes vos données seront définitivement supprimées. Continuer ?\')){resetAll()}">🗑️ Réinitialiser complètement</button>'
    +'<div class="field"><label>Thème ATHLETE OS (HUD futuriste)</label><button class="btn btn-line btn-block" onclick="setHud(!hudOn());closeModal()">🛰️ '+(hudOn()?'Désactiver le HUD (thème classique)':'Activer le HUD futuriste')+'</button></div>'
    +'<div class="field mt"><label>Diagnostic ATHLETE OS</label><button class="btn btn-line btn-block" onclick="selfTest()">🧪 Lancer l\'auto-test (sans toucher aux données)</button><div class="tiny mut mt">Vérifie navigation, calculs, sauvegarde, minuteurs et démos sur une copie mémoire.</div></div>'
  );
}
function printReport(){
  window.print();
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
  // Force / progression
  let prGain=0, prN=0;
  Object.keys(MAIN_LIFTS).forEach(k=>{
    const h=perfHistorique(k);
    if(h.length>=2){ const g=(h[h.length-1].v-h[0].v)/h[0].v*100; prGain+=g; prN++; }
  });
  const moy = prN? prGain/prN : 0;
  if(prN>=2 && moy>=8){
    rec.push({ic:'💪',tag:'Coach',cls:'success',txt:'Vos 1RM estimés progressent en moyenne de +'+round1(moy)+' %. Excellente adaptation : poursuivez la progression, charge +2,5 % sur vos exercices principaux si le RIR est atteint avec le haut de la fourchette.'});
  } else if(prN>=2 && moy<1){
    rec.push({ic:'📉',tag:'Coach',cls:'warn',txt:'Vos performances stagnent depuis plusieurs semaines. Réévaluez : technique, sommeil, nutrition, ou refaites la même charge en visant +2 reps (double progression) avant d\'augmenter.'});
  }
  // Poids
  const poids=Object.entries(state.poids).sort();
  if(poids.length>=3){
    const dep=+poids[0][1], act=+poids[poids.length-1][1];
    const sem=Math.max(0.1,(parseDate(poids[poids.length-1][0])-parseDate(poids[0][0]))/86400000/7);
    const taux=(act-dep)/sem;
    const phase=phaseNutritionRecommandee();
    if(phase==='surplus' && taux<0.1) rec.push({ic:'🥗',tag:'Nutritionniste',cls:'warn',txt:'Votre poids progresse lentement ('+round1(taux)+' kg/sem.) pour une phase de prise. Augmentez légèrement les glucides (+50 à 100 kcal/jour) et vérifiez l\'adhérence au plan de repas.'});
    if(phase!=='surplus' && taux>0.3) rec.push({ic:'🥗',tag:'Nutritionniste',cls:'danger',txt:'Votre poids augmente de '+round1(taux)+' kg/sem. alors que la stratégie vise la stabilité. Réduisez d\'environ 100-150 kcal/jour pendant 2 semaines et réévaluez.'});
    if(taux<-0.7) rec.push({ic:'🩺',tag:'Référent santé',cls:'danger',txt:'Perte de poids rapide ('+round1(taux)+' kg/sem.). Une perte supérieure à 0,5-0,7 kg/semaine peut compromettre la masse musculaire. Vérifiez vos apports protéiques et votre sommeil.'});
  }
  // Tour de taille
  const j0=state.mensurations.jour0, dm=dernierMensuration();
  if(j0&&j0.taille&&dm&&dm.taille){
    const deltaTaille=(+dm.taille)-(+j0.taille);
    const deltaPoids=(poidsActuel()||+p.poidsDepart)-(+p.poidsDepart);
    if(deltaTaille>2 && deltaPoids<=deltaTaille){
      rec.push({ic:'📏',tag:'Analyste',cls:'warn',txt:'Votre tour de taille augmente ('+round1(deltaTaille)+' cm) plus vite que votre poids n\'explique. Réévaluation des apports énergétiques recommandée : réduisez les glucides du soir de 20-30 g.'});
    }
  }
  // Récupération
  const rm=moyenneRecup();
  if(rm!=null && rm<60){
    rec.push({ic:'😴',tag:'Préparateur mental',cls:'danger',txt:'Votre récupération moyenne est de '+rm+'/100 cette période. Envisagez une semaine de deload (volume réduit de 50 %) ou une séance en moins pendant 1 semaine. Priorité au sommeil : visez 7 h 30-8 h.'});
  }
  const recups=Object.values(state.recup);
  if(recups.length){
    const hm=recups.reduce((a,b)=>a+(+b.h||0),0)/recups.length;
    if(hm<7) rec.push({ic:'🌙',tag:'Préparateur mental',cls:'warn',txt:'Sommeil moyen de '+round1(hm)+' h : sous 7 h, la croissance musculaire est significativement réduite. Cible : 7 h 30-9 h. Couchez-vous 30 min plus tôt et évitez les écrans 1 h avant.'});
  }
  // Adhérence
  const adh=scoreAdherenceGlobal();
  if(adh!=null && adh<60){
    rec.push({ic:'🧠',tag:'Préparateur mental',cls:'warn',txt:'Adhérence de '+adh+' % aux séances. Réduisez la fréquence si nécessaire plutôt que d\'abandonner : 3 séances solides valent mieux que 5 sautées. Fixez des objectifs hebdomadaires réalistes.'});
  } else if(adh!=null && adh>=85){
    rec.push({ic:'🔥',tag:'Préparateur mental',cls:'success',txt:'Adhérence de '+adh+' % : une discipline exemplaire. Continuez ; c\'est la constance sur 12 mois qui produit la transformation.'});
  }
  // Cardio
  if(!rec.some(r=>r.tag==='Coach')){}
  // Stade du programme
  const pos=programPos(todayKey());
  if(pos.deload){
    rec.push({ic:'🛌',tag:'Coach',cls:'info',txt:'Semaine de deload en cours : volume réduit de 50 %, charges ~65 %. Profitez-en pour perfectionner la technique et maximiser la récupération avant la reprise.'});
  }
  if(pos.idx==='F'){
    rec.push({ic:'🏆',tag:'Coach',cls:'success',txt:'Vous êtes en phase finale : récapitulez vos records, préparez vos photos de fin de programme et définissez les objectifs de la suite (nouveau cycle ou maintien).'});
  }
  // Bilan 1RM & charges
  if(p.date && !forceTestDone()){
    rec.push({ic:'🔢',tag:'Coach',cls:'info',txt:'Réalisez votre bilan 1RM (5-8 min, onglet « Bilan 1RM ») : les charges de chaque exercice seront pré-remplies automatiquement selon votre force réelle.'});
  }
  if(forceReevalDue()){
    rec.push({ic:'🔁',tag:'Coach',cls:'warn',txt:'Votre bilan 1RM date de plus de 8 semaines. Réévaluation recommandée par le coach : refaites le test, vos charges suggérées seront recalculées automatiquement.'});
  }
  Object.keys((state.force&&state.force.valeurs)||{}).forEach(k=>{
    const pr = MAIN_LIFTS[k]? perfSerie(k) : null;
    const decl = parseFloat(state.force.valeurs[k]);
    if(pr && decl && pr.max > decl*1.03){
      rec.push({ic:'📈',tag:'Analyste',cls:'success',txt:'Record journalisé sur '+(MAIN_LIFTS[k]?MAIN_LIFTS[k].n:k)+' ('+Math.round(pr.max)+' kg) supérieur à votre 1RM déclaré ('+fmtNum(decl)+' kg) : mettez à jour votre bilan 1RM.'});
    }
  });
  rec.push({ic:'🩺',tag:'Référent santé',cls:'info',txt:'Rappel : en cas de douleur articulaire persistante, de blessure, de fatigue inhabituelle ou de signe médical, stoppez et consultez un professionnel de santé. Ces recommandations sont indicatives.'});
  return rec.slice(0,8);
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
    '<span class="tagline">🔥 Programme GB Performance — 12 mois / 52 semaines</span>'+
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
    tile('💪','Progression muscle', mm==='—'?'est. en cours':'est. '+mm+' kg', prN>0? prN+' records personnels' : 'Renseignez vos charges', 'up'),
    tile('📏','Mensurations', delt('brasD')!=null?'bras '+delt('brasD')+' cm':'—', delt('taille')!=null?'taille '+delt('taille')+' cm':(dm?'—':'relevé J0 requis'), delt('taille')!=null&&delt('taille')>0?'down':'up'),
    tile('🏋️','Performance', vol>0? (Math.round(vol/1000)+' t totaux'):'—', 'prog. moy. '+ (prN? '+'+round1(scorePerformance()/10)+' %' : '—'), 'up'),
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
  } else if(today.type==='metcon'){
    todayHtml+='<span class="chip chip-blue">Cardio METCON</span><p class="mt small mut">'+esc((PROGRAM[programPos(todayKey()).mois]||PROGRAM.finale).metcon)+'</p><div class="flex mt"><button class="btn btn-grad btn-sm" onclick="openExtra(\''+todayKey()+'\')">🧠 Coach</button><button class="btn btn-line btn-sm" onclick="setSeanceStatus(\''+todayKey()+'\',\'ok\');renderCurrent()">✅ Fait</button></div>';
  } else if(today.type==='piscine'){
    todayHtml+='<span class="chip chip-blue">🏊 Piscine 8,5×4</span><p class="mt small mut">Séance imposée par le coach : METCON elliptique + piscine.</p><div class="flex mt"><button class="btn btn-grad btn-sm" onclick="openExtra(\''+todayKey()+'\')">🧠 Coach</button></div>';
  } else {
    const next=weekPlan(todayKey()).find(p2=>p2.type==='seance'&&p2.date>todayKey());
    todayHtml+='<span class="chip chip-mut">Jour de repos</span>'+
      (next? '<p class="mt small mut">Prochaine séance : <b class="gold">'+esc(next.label)+'</b> — '+fmtDateFr(next.date)+'</p>':'<p class="mt small mut">Jour de récupération : marche, mobilité, sommeil.</p>')+
      '<div class="flex mt"><button class="btn btn-line btn-sm" onclick="go(\'v-recuperation\')">😴 Check-in récupération</button><button class="btn btn-line btn-sm" onclick="openExtra(\''+todayKey()+'\')">🧊 Détente</button></div>';
  }
  todayHtml+='</div>';
  $('#dash-today').innerHTML=athleteBriefing()+todayHtml;
  // Recs
  const recs=buildRecommendations();
  $('#dash-rec').innerHTML = recs.map(r=>recItem(r)).join('') || '<div class="note-box">Aucune recommandation pour l\'instant.</div>';
  // Gauge
  $('#gauge-global').innerHTML = gaugeSVG(scoreTransformation().total, null, 'SUR 100');
  // Phase
  $('#dash-phase-chip').textContent = (pos.idx==='F'?'Finale':'Mois '+pos.idx);
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
  $('#dash-goal-chip').textContent = ({masse:'Prise de masse',esthetique:'Esthétique',recomposition:'Recomposition',seche:'Perte de gras',force:'Force'})[state.objectifs.principal]||'—';
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
    state.photos[ms][vue]=data;
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
        return '<tr><td><b>'+ex.ic+' '+esc(ex.nom)+'</b></td><td class="num gold">'+fmtKg(v)+'</td><td class="num">'+(d!=null?'—':'—')+'</td><td class="num '+(d>0?'up':d<0?'down':'mut')+'">'+(d!=null?((d>0?'+':'')+d+' kg'):'—')+'</td><td class="num">'+(autoV!=null?'<b class="'+(autoUp?'up':'mut')+'">'+fmtKg(autoV)+'</b>':'—')+'</td><td class="num mut">'+fmtKg(roundCharge((autoV||v)*0.75))+'</td></tr>';
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
      return '<tr><td><b>'+ex.ic+' '+esc(ex.nom)+'</b>'+(ex.essentiel?' <span class="chip chip-gold" style="margin-left:6px">essentiel</span>':' <span class="chip chip-mut" style="margin-left:6px">complémentaire</span>')+'</td>'+
        '<td class="num"><input class="inp" type="tel" inputmode="decimal" step="0.5" min="0" id="f1rm-'+ex.key+'" value="'+(v||'')+'" placeholder="kg" style="width:100px;text-align:center" oninput="calcEst1RM(\''+ex.key+'\')"></td>'+
        '<td class="num"><select class="inp" id="f1rmr-'+ex.key+'" style="width:78px" onchange="calcEst1RM(\''+ex.key+'\')">'+
          [1,2,3,5].map(r=>'<option value="'+r+'" '+( (f.repsMax&&f.repsMax[ex.key]==r)?'selected':'')+'>'+r+'</option>').join('')+'</select></td>'+
        '<td class="num"><b id="f1rme-'+ex.key+'" class="gold">'+(v? fmtKg(v):'—')+'</b></td></tr>';
    }).join('')+'</table></div>'+
    '<div class="flex mt"><button class="btn btn-grad" onclick="saveForceTest()">💾 Enregistrer mon bilan 1RM</button>'+
    (teste?'<button class="btn btn-line" onclick="renderForce()">↩ Annuler les modifications</button>':'')+
    '<span class="small mut">Les 4 mouvements essentiels sont recommandés (développé couché, squat, soulevé de terre, militaire).</span></div>'+
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
  // Pré-remplit le formulaire depuis les records du journal (développé, squat, SDT, militaire)
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
    '<tr style="background:rgba(255,179,0,.06)"><td class="b gold">TOTAL</td><td class="small mut">vs cible : '+gp.cible.cal+' kcal · '+gp.cible.p+' g P · '+gp.cible.g+' g G · '+gp.cible.l+' g L</td><td class="num gold"><b>'+gp.final.cal+'</b></td><td class="num gold"><b>'+gp.final.p+'</b></td><td class="num gold"><b>'+gp.final.g+'</b></td><td class="num gold"><b>'+gp.final.l+'</b></td></tr>'+
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
    rowsWeek.push('<tr '+(isToday?'style="background:rgba(255,179,0,.07)"':'')+' onclick="repasAller(\''+dd+'\')" style="cursor:pointer"><td class="b">'+['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][new Date(dd).getDay()]+' '+fmtDateShort(dd)+(isToday?' <span class="chip chip-gold">auj.</span>':'')+'</td>'+
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
  lineChart($('#chart-poids'), pe.map(x=>fmtDateShort(x[0])), [{name:'Poids', color:'#ffb300', data:pe.map(x=>+x[1])}], {unit:' kg', empty:'Saisissez vos pesées hebdomadaires'});
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
  const ser=[
    {name:'Épaules', color:'#ffb300', data:['J0',...keys].map(k=> k==='J0'? state.mensurations.jour0.epaules : (mm[k]&&mm[k].epaules)||null)},
    {name:'Poitrine', color:'#3aa0ff', data:['J0',...keys].map(k=> k==='J0'? state.mensurations.jour0.poitrine : (mm[k]&&mm[k].poitrine)||null)},
    {name:'Bras', color:'#2dd4a7', data:['J0',...keys].map(k=> k==='J0'? state.mensurations.jour0.brasD : (mm[k]&&mm[k].brasD)||null)},
    {name:'Taille', color:'#ff5252', data:['J0',...keys].map(k=> k==='J0'? state.mensurations.jour0.taille : (mm[k]&&mm[k].taille)||null)}
  ];
  lineChart($('#chart-mens'), labels, ser, {unit:' cm', empty:'Renseignez au moins le Jour 0 pour voir la courbe'});
  $('#legend-mens').innerHTML = ser.map(s=>'<span><i style="background:'+s.color+'"></i>'+s.name+'</span>').join('');
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
      stat('METCON', phase.metcon.split('— ')[1]||phase.metcon.split('—')[1]||phase.metcon)+
      stat('Progression', 'Charge +2,5 % si haut de fourchette atteint avec RIR ≤ 1 ; sinon refaire avec +1 rep')
    +'</div>'+
    (pos.deload? '<div class="ok-box mt">🛌 <b>Semaine de deload :</b> séries réduites de ~50 %, charges à ~65 %, pas de METCON, pas de méthodes intensives. Priorité technique et récupération.</div>':'')+
    '</div>';
  // semaine
  $('#ent-week').innerHTML = '<div class="tbl-wrap"><table class="tbl"><tr><th>Jour</th><th>Date</th><th>Contenu</th><th>Statut</th><th></th></tr>'+
    plan.map(d2=>{
      const st=state.seances[d2.date];
      const chip = st==='ok'?'<span class="chip chip-green">✅</span>':st==='partiel'?'<span class="chip chip-orange">🟡</span>':st==='non'?'<span class="chip chip-red">❌</span>':(d2.date===todayKey()?'<span class="chip chip-gold">Aujourd\'hui</span>':'<span class="chip chip-mut">—</span>');
      const btns = d2.type==='seance'
        ? '<button class="btn btn-line btn-sm" onclick="openSession(\''+d2.date+'\')">'+(st?'📝':'🏋️')+' Ouvrir</button>'
        : d2.type==='metcon'? '<div class="flex"><button class="btn btn-grad btn-sm" onclick="openExtra(\''+d2.date+'\')">👁 Ouvrir</button><button class="btn btn-line btn-sm" onclick="setSeanceStatus(\''+d2.date+'\',\'ok\');renderCurrent()">✅</button><button class="btn btn-line btn-sm" onclick="setSeanceStatus(\''+d2.date+'\',\'non\');renderCurrent()">❌</button></div>':(d2.type==='piscine'?'<div class="flex"><button class="btn btn-grad btn-sm" onclick="openExtra(\''+d2.date+'\')">👁 Ouvrir</button></div>':'<button class="btn btn-line btn-sm" onclick="openExtra(\''+d2.date+'\')">🧊 Détente</button>');
      return '<tr><td class="b">'+['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][d2.wk]+'</td><td>'+fmtDateShort(d2.date)+'</td><td class="b">'+esc(d2.label)+extraDetail(d2)+'</td><td>'+chip+'</td><td class="center">'+btns+'</td></tr>';
    }).join('')+'</table></div>';
  // Historique des semaines & progression des charges
  renderEntHist();
  renderEntProgress();
  // Périodisation
  $('#ent-program').innerHTML = PERIODISATION.map(mc=>{
    return '<div class="acc-item"><button class="acc-head" onclick="this.parentElement.classList.toggle(\'open\')"><span class="phase-num" style="background:linear-gradient(135deg,#ffb300,#ff7a00);color:#171000">■</span><div class="ph-mid"><div class="ph-t">'+mc.nom+'</div><div class="ph-s">'+mc.desc+'</div></div><span class="acc-arrow">▼</span></button><div class="acc-body">'+
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
    '<li><b class="gold">Charge :</b> si vous complétez le haut de la fourchette de reps avec un RIR ≤ 1 sur toutes les séries utiles → augmentez de +2,5 % (2,5 kg gros exercices, 1,25 kg isolations).</li>'+
    '<li><b class="gold">Répétitions :</b> sinon, visez +1 à +2 répétitions à charge égale à la séance suivante.</li>'+
    '<li><b class="gold">RIR / RPE :</b> notez chaque série : RIR 0-1 = échec quasi, RIR 2-3 = 2-3 reps en réserve, RPE 7-9.</li>'+
    '<li><b class="gold">Deload :</b> semaine 4 de chaque mois = récupération (volume -50 %).</li></ul></div>'+
    '<div><h3 class="mb">🔥 Échauffement (5-10 min)</h3><ul style="padding-left:18px;color:var(--mut);font-size:13.5px;line-height:1.9">'+
    '<li>Réalisez 1 série à ~50 % de la charge visée, puis 2-4 séries progressives sur le premier exercice de la séance.</li>'+
    '<li>Mobilité ciblée (hanches, épaules, chevilles) avant les séances lourdes.</li>'+
    '<li>Respectez le <b class="gold">tempo</b> : ex. 3010 = 3 s descente, 0 pause, 1 s montée, 0 pause.</li>'+
    '<li>Règle des 2 : jamais +2 jours d\'entraînement de suite, jamais +2 jours de repos.</li></ul></div>'+
    '</div><div class="note-box mt">Les exercices marqués « drop set », « 1 1/4 », « pauses iso », « vague » etc. appliquent la méthode de la phase — regardez la description de chaque phase pour la technique exacte.</div>';
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
  let extras=0;
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
    extras+=extrasDuJour(dd).length;
    let cellule='';
    if(plan&&plan.type==='seance'){
      const chip = st==='ok'?'<span class="chip chip-green">✅</span>':st==='partiel'?'<span class="chip chip-orange">🟡</span>':st==='non'?'<span class="chip chip-red">❌</span>':(dd===todayKey()?'<span class="chip chip-gold">auj.</span>':'<span class="chip chip-mut">—</span>');
      const exos=jx.length? '<div class="small" style="color:var(--mut)">'+jx.map(e=>'<b style="color:var(--txt)">'+esc(e.n)+'</b> : '+fmtNum(e.ch)+' kg × '+esc(e.reps||'—')+' séries '+(e.se||'—')+(e.rir!==''&&e.rir!=null?' · RIR '+e.rir:'')+(e.rpe!==''&&e.rpe!=null?' · RPE '+e.rpe:'')+(e.com?' · <i>'+esc(e.com)+'</i>':'')).join('<br>')+'</div>'
        : '<span class="small mut">Aucune charge enregistrée</span>';
      cellule='<td><div class="b">'+esc(plan.label)+'</div>'+exos+'</td><td class="center">'+chip+'</td>'+
        '<td class="center"><button class="btn btn-line btn-sm" onclick="openSession(\''+dd+'\')">'+(jx.length?'📝':'🏋️')+' '+(jx.length?'Rouvrir':'Faire')+'</button></td>';
    } else if(plan&&(plan.type==='metcon'||plan.type==='piscine')){
      const chipX = st==='ok'?'<span class="chip chip-green">✅</span>':st==='partiel'?'<span class="chip chip-orange">🟡</span>':st==='non'?'<span class="chip chip-red">❌</span>':(dd===todayKey()?'<span class="chip chip-gold">auj.</span>':'<span class="chip chip-mut">—</span>');
      cellule='<td><div class="b">'+esc(plan.label)+'</div><div class="tiny" style="color:var(--mut)">'+(plan.type==='metcon'?'⚡ Jour METCON — séance imposée :':'🏊 Jour piscine — séance imposée :')+'</div>'+extraDetail({type:plan.type,date:dd})+extrasHtml(dd)+'</td><td class="center">'+chipX+'</td>'+
        '<td class="center"><button class="btn btn-line btn-sm" onclick="openExtra(\''+dd+'\')">👁 Ouvrir</button></td>';
    } else {
      const chipR = st==='ok'?'<span class="chip chip-green">✅</span>':st==='non'?'<span class="chip chip-red">❌</span>':'';
      cellule='<td class="small mut">😴 Repos / récupération'+extrasHtml(dd)+'</td><td class="center">'+chipR+'</td><td class="center"><button class="btn btn-line btn-sm" onclick="openExtra(\''+dd+'\')">🧊 Détente</button></td>';
    }
    rows.push('<tr'+(dd===todayKey()?' style="background:rgba(255,179,0,.06)"':'')+'><td class="b">'+['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][new Date(dd).getDay()]+' '+fmtDateShort(dd)+'</td>'+cellule+'</tr>');
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
        '<span class="chip chip-green">'+(volume?Math.round(volume/1000)+' t de volume':'—')+'</span>'+'<span class="chip chip-orange">🏊⚡🔥 '+extras+' extra'+(extras>1?'s':'')+'</span>'+
        (wk!==cur?'<button class="btn btn-line btn-sm" onclick="entHistToday()">Aujourd\'hui</button>':'')+
      '</div>'+
    '</div>'+
    '<div class="tbl-wrap"><table class="tbl"><tr><th>Jour</th><th>Séance & charges enregistrées</th><th>Statut</th><th></th></tr>'+rows.join('')+'</table></div>'+
    '<div class="small mut mt">💡 Cliquez sur « Rouvrir » pour voir ou modifier les charges de cette séance — vos valeurs enregistrées s\'affichent exactement comme vous les aviez saisies. 👁 <b>Ouvrir</b> sur un jour cardio/piscine montre la séance imposée par le coach et vos séances enregistrées.</div>'+
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
    '<div class="legend mt"><span><i style="background:#ffb300"></i>Charge (kg)</span><span><i style="background:#2dd4a7"></i>1RM estimé (Epley)</span></div>'+
    '<div class="tbl-wrap mt"><table class="tbl"><tr><th>Date</th><th class="num">Charge</th><th class="num">Reps</th><th class="num">Séries</th><th class="num">RIR</th><th class="num">RPE</th></tr>'+
    recentes.map(e=>'<tr><td>'+fmtDateShort(e.date)+'</td><td class="num">'+(e.ch?fmtNum(e.ch)+' kg':'—')+'</td><td class="num">'+(e.reps||'—')+'</td><td class="num">'+(e.se||'—')+'</td><td class="num">'+(e.rir!==''&&e.rir!=null?e.rir:'—')+'</td><td class="num">'+(e.rpe!==''&&e.rpe!=null?e.rpe:'—')+'</td></tr>').join('')+
    '</table></div>'+
    (exo.entries.length>12?'<div class="small mut mt">Les 12 dernières séances sont affichées — le graphique couvre toutes les séances.</div>':'')+
    '<div class="note-box mt">📈 <b>Lecture de progression :</b> charge en hausse + RIR stable ou en baisse = progression solide. Charge identique + reps en hausse = double progression (valide aussi). Charge identique + RPE en hausse = limite atteinte, prêt à augmenter de +2,5 %.</div>';
  lineChart($('#ent-prog-chart'), labels, [
    {name:'Charge', color:'#ffb300', data:dataCh},
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
    '<p class="small mut">🫀 <b>METCON :</b> '+esc(m.metcon)+'</p>'+
    '<div class="mt">'+keys.map(k=>{
      const s=m.sessions[k];
      return '<div class="acc-item"><button class="acc-head" onclick="this.parentElement.classList.toggle(\'open\')"><span class="phase-num" style="font-size:13px">'+k+'</span><div class="ph-mid"><div class="ph-t">'+esc(s.nom)+'</div><div class="ph-s">'+s.exos.length+' exercices</div></div><span class="acc-arrow">▼</span></button><div class="acc-body"><div class="tbl-wrap"><table class="tbl"><tr><th>Exercice</th><th>Séries</th><th>Reps</th><th>Tempo</th><th>Repos</th></tr>'+
      s.exos.map((e,ei)=>'<tr><td><b>'+esc(e[0])+'</b><button class="btn btn-line btn-sm" style="margin-left:8px;padding:2px 8px;font-size:11px" onclick="openExoDemoByRef(\''+ph+'\',\''+k+'\','+ei+')">▶</button>'+(e[6]?'<div class="small mut">'+esc(e[6])+'</div>':'')+'</td><td>'+e[2]+'</td><td>'+esc(e[3])+'</td><td>'+e[4]+'</td><td>'+(e[5]? e[5]+' s':'—')+'</td></tr>').join('')+
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
  curSession={date,key,exos:s.exos};
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
      '<span class="phase-num" style="font-size:15px;background:linear-gradient(135deg,#ff9f43,#ff7a00);color:#171000">🔥</span>'+
      '<div class="ph-mid"><div class="ph-t">Échauffement — à faire AVANT</div><div class="ph-s">'+ECHAUFFEMENT.duree+' · '+(ech.etapes.length+1)+' étapes</div></div>'+
      (fait? '<span class="chip chip-green">✓ fait</span>':'<span class="chip chip-orange">à faire</span>')+
      '<span class="acc-arrow">▼</span></button>'+
      '<div class="acc-body">'+
      ech.etapes.map((e,i)=>prepStep(i+1, e)).join('')+
      prepStep(ech.etapes.length+1, ech.activation)+
      '<label class="checkrow mt"><input type="checkbox" '+(fait?'checked':'')+' onchange="togglePrep(\''+date+'\',\'ech\',this.checked)"> <b>✅ J\'ai fait mon échauffement complet</b></label>'+
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
      (etirs.length? etirs.map(g=>'<div class="prep-grp"><span class="grp-t">'+esc(g.nom)+'</span>'+g.exos.map((ex,xi)=>prepStep(-1,{nom:ex[1],temps:ex[2],quoi:ex[3],ic:ex[0],demoMuscle:(g.key||''),demoIdx:xi})).join('')+'</div>').join(''):'<div class="small mut">—</div>')+
      '<label class="checkrow mt"><input type="checkbox" '+(fait?'checked':'')+' onchange="togglePrep(\''+date+'\',\'etir\',this.checked)"> <b>✅ J\'ai fait mes étirements</b></label>'+
      '</div></div>';
  }
  function prepStep(i, e){
    const demoBtn=(e.demoMuscle)?'<button class="btn btn-line btn-sm" style="margin-left:8px;padding:3px 9px;font-size:11px" onclick="openStretchDemo(\''+e.demoMuscle+'\','+(e.demoIdx||0)+')">▶ Démo</button>':'';
    return '<div class="prep-step"><div class="prep-h">'+(i>0?'<span class="prep-n">'+i+'</span>':'')+'<span class="prep-ic">'+e.ic+'</span><b>'+esc(e.nom)+'</b>'+demoBtn+'<span class="chip chip-mut" style="margin-left:auto">'+esc(e.temps)+'</span></div>'+
      '<p class="prep-p">'+esc(e.quoi).replace(/\n/g,'<br>')+'</p></div>';
  }
  openModal('<h3>🏋️ '+(deload?'[DELOAD] ':'')+esc(s.nom)+' <span class="small mut">— '+fmtDateFr(date)+'</span></h3>'+
    '<div class="small mut mb">Mois '+(pos.idx==='F'?'finale':pos.idx)+' · '+esc(phase.titre)+' · Tempo ex. 3010 = 3s/0s/1s/0s</div>'+
    '<div class="coach-mot">'+
      '<div class="cm-ic">🏋️</div>'+
      '<div class="cm-txt"><b>Mot de l\'entraîneur</b><p>'+esc(coachMotSession(s, suggs).txt)+'</p></div>'+
    '</div>'+
    (nSugg? '<div class="ok-box mb" style="padding:8px 12px">⚡ <b>'+nSugg+' charges pré-remplies</b> — recalculées automatiquement à partir de votre bilan 1RM et de <b>vos séances enregistrées</b> (1RM auto). Elles visent à rendre les reps cibles réalisables avec un RIR 1-2 : ajustez à votre ressenti.</div>':'')+
    prepBlock()+
    '<div class="flex mb"><label class="chip chip-mut" style="cursor:pointer"><input type="radio" name="st-'+date+'" value="ok"'+(j.statut==='ok'?' checked':'')+' onchange="saveSessionStatut(this.value)"> ✅ Terminée</label>'+
    '<label class="chip chip-mut" style="cursor:pointer"><input type="radio" name="st-'+date+'" value="partiel"'+(j.statut==='partiel'?' checked':'')+' onchange="saveSessionStatut(this.value)"> 🟡 Partielle</label>'+
    '<label class="chip chip-mut" style="cursor:pointer"><input type="radio" name="st-'+date+'" value="non"'+(j.statut==='non'?' checked':'')+' onchange="saveSessionStatut(this.value)"> ❌ Non effectuée</label></div>'+
    '<div class="small mut mb" style="margin-top:-6px">💡 Modifiez charges, RIR et RPE : <b>tout est enregistré automatiquement</b> (à la frappe et en validant « Terminée »).</div>'+restTimerBarHTML()+
    '<div class="journal-row" style="font-size:10.5px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--mut)"><span>Exercice</span><span>Charge kg</span><span>Reps</span><span>Séries</span><span>RIR</span><span>RPE</span><span class="hide-m">Note</span></div>'+
    s.exos.map((e,i)=>{
      const prev=byNom[e[0]];
      const sugg=suggs[i];
      const setsU = e[2]===1? 1 : Math.round(parseFloat(String(e[2]).split('/')[0]||e[2])*mult);
      const valCh = (prev&&prev.ch!==''&&prev.ch!=null) ? prev.ch : (sugg? sugg.charge : '');
      const valOf = k => (prev&&prev[k]!==''&&prev[k]!=null)? prev[k] : '';
      const hint = (sugg && !(prev&&prev.ch))
        ? ' · ≈ '+fmtNum(sugg.charge)+' kg'+(sugg.perHand?'/côté':'')+' · '+sugg.pct+' % 1RM'+
          (sugg.auto1RM?' (auto — vos séances)':'')+
          (sugg.fromLast? ' · adaptée de votre dernière séance ('+fmtNum(sugg.lastCharge)+' kg)':'')
        : '';
      return '<div class="journal-row exo-row">'+
        '<span><b class="small">'+esc(e[0])+'</b><button class="btn btn-line btn-sm" style="margin:4px 0 0 0;padding:3px 9px;font-size:11px" onclick="openExoDemoIdx('+i+')">▶ Démo</button><div class="tiny mut">'+(e[2]+' × '+esc(e[3])+(e[5]?' · '+e[5]+'s':'')+(deload?' · 50% vol':'')+hint)+'</div></span>'+
        '<input class="inp" type="tel" inputmode="decimal" step="0.5" placeholder="kg" data-f="ch" value="'+valCh+'">'+
        '<input class="inp" type="tel" inputmode="decimal" placeholder="rep" data-f="reps" value="'+valOf('reps')+'">'+
        '<input class="inp" type="tel" inputmode="decimal" placeholder="séries" data-f="se" value="'+(prev&&prev.se!==''&&prev.se!=null?prev.se:setsU)+'">'+
        '<input class="inp" type="tel" inputmode="decimal" min="0" max="5" placeholder="RIR" data-f="rir" value="'+valOf('rir')+'">'+
        '<input class="inp" type="tel" inputmode="decimal" min="1" max="10" placeholder="RPE" data-f="rpe" value="'+valOf('rpe')+'">'+
        '<input class="inp hide-m" placeholder="commentaire" data-f="com" value="'+valOf('com')+'">'+
        '</div>';
    }).join('')+
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
  // « Valider pour terminer » → ferme la séance
  closeModal();
  curSession=null;
  renderCurrent();
  const lib={ok:'terminée ✅',partiel:'partielle 🟡',non:'non effectuée ❌'};
  toast('✅ Séance '+ (lib[v]||v) +' — charges, RIR et RPE enregistrés');
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
      '<tr style="background:rgba(255,179,0,.06)"><td class="b gold">TOTAL</td><td class="small mut">vs cible : '+gp.cible.cal+' kcal · '+gp.cible.p+' g P · '+gp.cible.g+' g G · '+gp.cible.l+' g L</td><td class="num gold"><b>'+gp.final.cal+'</b></td><td class="num gold"><b>'+gp.final.p+'</b></td><td class="num gold"><b>'+gp.final.g+'</b></td><td class="num gold"><b>'+gp.final.l+'</b></td></tr>'+
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
  const mm=dernierMensuration(), j0=state.mensurations.jour0;
  let brasDelta='—'; if(mm&&j0&&j0.brasD&&mm.brasD) brasDelta=(+mm.brasD-(+j0.brasD)>0?'+':'')+round1(+mm.brasD-(+j0.brasD))+' cm';
  $('#prog-tiles').innerHTML = [
    tile('🎯','Records personnels', prCount>0? prCount+' / 4 suivis':'—', 'développé couché · squat · SDT · militaire','gold'),
    tile('🏋️','Volume total', volTot>0? Math.round(volTot/1000)+' t':'—', vol.length+' semaines suivies','up'),
    tile('📈','Progression force', sp>0? '+'+(sp-20)+' %':'—', 'est. via 1RM (Epley)','up'),
    tile('📏','Bras', brasDelta, 'depuis le Jour 0','up')
  ].join('');
  // graphiques lift
  [['bench','chart-bench'],['squat','chart-squat'],['dead','chart-dead'],['ohp','chart-ohp']].forEach(([k,id])=>{
    const h=perfHistorique(k);
    lineChart($('#'+id), h.map(x=>fmtDateShort(x.date)), [{name:MAIN_LIFTS[k].n, color:'#ffb300', data:h.map(x=>x.v)}], {unit:' kg (1RM est.)', empty:'Journalisez des séances de '+MAIN_LIFTS[k].n+' pour suivre votre record.'});
  });
  // volume bar
  const vh=volumeHebdo();
  const keysW=Object.keys(vh).map(Number).sort((a,b)=>a-b);
  const labs=[]; const vals=[];
  for(let i=0;i<=Math.min(51,Math.max(nbSemainesEcoulees(),...keysW));i++){
    labs.push('S'+(i+1)); vals.push(Math.round((vh[i+1]||0)/1000));
  }
  barChart($('#chart-volume'), labs, vals, {color:'#ffb300',color2:'#ff7a00', empty:'Aucun volume enregistré — notez vos charges dans le journal d\'entraînement.'});
  // volume muscles
  const vm=volumeMuscles();
  $('#muscle-volume').innerHTML=Object.keys(MUSCLES).map(m=>{
    const s=vm[m]||0, st=statutMuscle(s, MUSCLES[m].zone);
    return '<div class="muscle-item"><div class="m-name"><span class="dot" style="background:'+(st.cls==='chip-green'?'var(--grn)':st.cls==='chip-orange'?'var(--org)':'var(--red)')+'"></span>'+MUSCLES[m].n+'</div><div class="m-sets">'+s+' séries / sem. · <span class="'+st.cls.replace('chip-','')+'">'+st.txt+'</span></div></div>';
  }).join('');
  try{ const o1=document.getElementById('scan-v2'); if(o1) o1.remove(); const o2=document.getElementById('trend-v2'); if(o2) o2.remove(); $('#muscle-volume').insertAdjacentHTML('afterend', bodyScannerHTML()+prediTrendHTML()); }catch(_){}
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
  const m12Sim = state.photos.m12 && (state.photos.m12.face||state.photos.m12.profil||state.photos.m12.dos);
  $('#photo-milestones').innerHTML = ms.map(m=>
    '<div class="card"><div class="spread mb"><b class="gold" style="text-transform:uppercase;letter-spacing:.08em">'+labels[m]+'</b>'+
    (m==='m12'&&m12Sim?'<span class="chip chip-blue">🎯 Simulation (objectif visuel)</span>':(m!=='j0'?'<span class="chip chip-mut">bientôt</span>':'<span class="chip chip-gold">Départ</span>'))+'</div>'+
    '<div class="photo-grid" style="grid-template-columns:1fr 1fr">'+
    photoCard(m,'face','Face')+photoCard(m,'profil','Profil')+photoCard(m,'dos','Dos')+photoCard(m,'compl','Complémentaire')+
    '</div></div>'
  ).join('');
  // Bandeau explicatif si photos embarquées
  const j0Fill = state.photos.j0 && (state.photos.j0.face||state.photos.j0.profil||state.photos.j0.dos);
  if(j0Fill){
    const bandeau = document.getElementById('photos-banner');
    if(bandeau) bandeau.innerHTML =
      '<div class="ok-box">📸 <b>Vos photos Jour 0 et la simulation Mois 12 sont déjà chargées.</b> '+
      'Utilisez le comparateur ci-dessous (curseur doré). Pour remplacer une photo, cliquez sur 🔄 sur la vignette — '+
      'vos propres photos du mois 12 remplaceront la simulation au fil de votre progression.</div>';
  }
  // comparateur
  const opt=ms.map(m=>'<option value="'+m+'">'+labels[m]+'</option>').join('');
  $('#cmp-a').innerHTML=opt; $('#cmp-b').innerHTML=opt;
  $('#cmp-a').value='j0';
  // sélection par défaut : simulation m12 si dispo, sinon dernier jalon rempli
  $('#cmp-b').value = m12Sim ? 'm12' : (state.photos.m6.face ? 'm6' : ms[Math.min(3,ms.length-1)]);
  loadComparison();
}
function loadComparison(){
  const a=$('#cmp-a').value, b=$('#cmp-b').value, vue=$('#cmp-view').value;
  const imgA=state.photos[a][vue], imgB=state.photos[b][vue];
  const area=$('#cmp-area');
  if(!imgA||!imgB){
    area.innerHTML='<div class="chart-empty">Ajoutez les photos des deux bilans (face/profil/dos) pour les comparer.</div>';
    return;
  }
  area.innerHTML='<div class="compare-wrap" id="cmp-w">'+
    '<img src="'+photoSrc(imgB)+'" alt="'+b+'">'+
    '<div class="cw-top" id="cmp-top"><img src="'+photoSrc(imgA)+'" alt="'+a+'"></div>'+
    '<div class="compare-lbl">'+({j0:'Jour 0',m3:'Mois 3',m6:'Mois 6',m9:'Mois 9',m12:'Mois 12'})[a]+'</div>'+
    '<div class="compare-lbl r">'+({j0:'Jour 0',m3:'Mois 3',m6:'Mois 6',m9:'Mois 9',m12:'Mois 12'})[b]+'</div>'+
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
    body+='<div class="field"><label>Contenu planifié</label><div class="chip '+(plan.type==='seance'?'chip-gold':(plan.type==='metcon'||plan.type==='piscine')?'chip-blue':'chip-mut')+'">'+esc(plan.label)+'</div></div>';
    if(plan.type==='seance') body+='<button class="btn btn-grad btn-block" onclick="closeModal();openSession(\''+d+'\')">🏋️ Saisir la séance</button>';
  if(plan&&plan.type==='metcon') body+='<div class="flex"><button class="btn btn-grad btn-sm" onclick="closeModal();go(\'v-cardio\')">⚡ Cardio/Tabata</button><button class="btn btn-line btn-sm" onclick="closeModal();go(\'v-piscine\')">🏊 Piscine</button></div>';
  if(plan&&plan.type==='piscine') body+='<button class="btn btn-grad btn-block" onclick="closeModal();go(\'v-piscine\')">🏊 Ouvrir Pool Lab</button>';
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
  $('#obj-principal').innerHTML = Object.entries({masse:['💪','Prise de masse'],esthetique:['🕺','Esthétique'],recomposition:['♻️','Recomposition'],seche:['🔥','Perte de graisse'],force:['🏋️','Force']}).map(([k,[ic,n]])=>
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
  const rows=[
    ['Tour de bras (cm)', 'bras', j0.brasD, dm.brasD, '↑'],
    ['Tour de poitrine (cm)', 'poitrine', j0.poitrine, dm.poitrine, '↑'],
    ['Largeur d\'épaules (cm)', 'epaules', j0.epaules, dm.epaules, '↑'],
    ['Tour de taille (cm)', 'taille', j0.taille, dm.taille, '↓'],
    ['Poids (kg)', 'poids', p.poidsDepart, pa, p.objectifPoids>p.poidsDepart?'↑':'↓'],
    ['Masse grasse (%)', 'mg', p.mg, Object.entries(state.mg).sort().pop()?Object.entries(state.mg).sort().pop()[1]:null, '↓']
  ];
  const lifts=[['Développé couché (1RM kg)','bench'],['Squat (1RM kg)','squat'],['Soulevé de terre (1RM kg)','dead'],['Développé militaire (1RM kg)','ohp']];
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
    MENS_FIELDS.filter(f=>['bras','poitrine','epaules','taille'].includes(f[0])).map(([k,l])=>'<div class="field"><label>'+esc(l)+'</label><input class="inp" type="tel" inputmode="decimal" step="0.5" id="c-'+k+'" value="'+(c[k]||'')+'" placeholder="cm"></div>').join('')+
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
  ['bras','poitrine','epaules','taille','poids','mg','bench','squat','dead','ohp'].forEach(k=>{ const v=numOr($('#c-'+k).value); if(v) c[k]=v; });
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
  if(phase.type==='intensification'){
    const lift=mois%2? 'soulevé de terre':'développé couché';
    items.push({txt:'Battre votre record sur '+lift, prog:'Notez vos charges dans le journal', fait:prev.fait||false});
  } else {
    items.push({txt:'Augmenter le volume total hebdomadaire de 5 %', prog:'Mesuré via le journal d\'entraînement', fait:prev.fait||false});
  }
  const recs=Object.values(state.recup);
  const hm=recs.length? recs.reduce((a,b)=>a+(+b.h||0),0)/recs.length:null;
  items.push({txt:'Moyenne de sommeil ≥ 7 h 30', prog:hm? hm.toFixed(1)+' h de moyenne':'à mesurer via les check-ins', fait:prev.fait||false});
  const st=strategieAnnuelle()[clamp(mois,1,13)-1];
  const poids=Object.values(state.poids);
  const dp=poids.length? (+poids[poids.length-1]-+poids[0]):0;
  items.push({txt:st.phase==='deficit'?'Perdre 0,5 à 1 kg ce mois':'Prendre 0,5 à 1 kg de masse ce mois', prog:'Tendance actuelle : '+(dp>=0?'+':'')+round1(dp)+' kg depuis le début du programme', fait:prev.fait||false});
  items.push({txt:'Enregistrer le relevé de mensurations du mois', prog:state.mensurations.mensuel['M'+mois]?'✓ relevé présent':'à faire', fait:prev.fait||false});
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
    {ic:'🏋️',nom:'Coach principal',role:'Programmation musculaire',coul:'chip-gold',
      desc:'Responsable de la périodisation, des séances et de la progression des charges.',
      avis:p.date? 'Votre cycle actuel : <b>'+esc(phase.titre)+'</b>. Semaine '+(pos.weekGlobal+1)+'/52. '+(pos.deload?'C\'est une semaine de deload : volume -50 %, concentrez-vous sur la technique.':'Objectif de la semaine : compléter '+(p.seancesSemaine||4)+' séances avec un RIR ≤ 1 sur les séries clés.') : 'Complétez votre bilan pour activer le coaching.'},
    {ic:'💪',nom:'Expert hypertrophie',role:'Volume & progression musculaire',coul:'chip-green',
      desc:'Analyse le volume, la fréquence, les exercices et la croissance musculaire.',
      avis: 'Le volume hebdomadaire par groupe est affiché dans l\'onglet Progression (🟢/🟠/🔴). '+(MUSCLES? 'Les groupes prioritaires de ce mois : '+Object.keys(phase.sessions||{}).map(k=>phase.sessions[k].nom).join(' · '):'')+'. Rester dans les zones de volume recommandées maximise l\'hypertrophie sans excès de fatigue.'},
    {ic:'🥗',nom:'Nutritionniste',role:'Calories & macronutriments',coul:'chip-blue',
      desc:'Calcule vos besoins, ajuste les phases (surplus, maintien, déficit, recomposition).',
      avis:c? 'Aujourd\'hui : <b>'+c.cal+' kcal</b> · '+c.prot+' g protéines · '+c.glu+' g glucides · '+c.lip+' g lipides. Phase conseillée : <b>'+nutriPhaseInfo().n+'</b> — '+esc(strategieAnnuelle()[clamp(pos.idx==='F'?13:+pos.idx,1,13)-1].nom)+'. Repas type disponible dans l\'onglet Nutrition.' : 'Renseignez votre profil pour le calcul.'},
    {ic:'🧠',nom:'Préparateur mental',role:'Motivation & discipline',coul:'chip-violet',
      desc:'Habitudes, constance, gestion de la fatigue, sommeil, adhérence.',
      avis:'Adhérence aux séances : <b>'+(adh==null?'—':adh+' %')+'</b>. '+(adh>=85?'Votre constance est votre plus grand atout : continuez.':'Rappel : 3 séances par semaine pendant 12 mois = 150+ séances. La régularité bat l\'intensité isolée. Fixez-vous un rituel fixe (mêmes jours, mêmes horaires).')},
    {ic:'🩺',nom:'Référent santé',role:'Prévention & prudence',coul:'chip-red',
      desc:'Recommandations générales de prudence — aucun diagnostic médical.',
      avis:'Rappels : échauffez-vous 5-10 min, respectez les tempos, hydratez-vous. Douleur articulaire aiguë, blessure, fatigue anormale ou malaise → <b>arrêtez et consultez un professionnel de santé</b>. '+(rm!=null&&rm<50?'Votre score de récupération est faible ('+rm+'/100) : une semaine de deload est recommandée.':'')},
    {ic:'🧘',nom:'Expert mobilité',role:'Mobilité, amplitude & prévention',coul:'chip-green',
      desc:'Échauffement, amplitude, retour au calme, prévention des blessures.',
      avis:'Avant chaque séance : 5 min de cardio léger + mobilité hanches/épaules/chevilles (10 rotations × articulation) + séries d\'approche à 50 % puis 70-80 %. Après : 5-10 min d\'étirements statiques des groupes travaillés. Mobilité ciblée : <b>hanches</b> (squats) et <b>épaules</b> (développés) sont prioritaires cette phase.'},
    {ic:'🫀',nom:'Préparateur cardio',role:'Conditionnement métabolique',coul:'chip-orange',
      desc:'Programme le cardio pour compléter la musculation sans nuire à la récupération.',
      avis:'Cette phase : <b>'+esc(phase.metcon)+'</b>. Réalisez le METCON sur les jours de repos ou 4-6 h après la musculation — jamais immédiatement après, pour préserver les gains. '+(p.seancesSemaine>=5?'Avec 5 séances/semaine, limitez-vous à 1 METCON/semaine.':'2 METCON/semaine recommandés.')},
    {ic:'📊',nom:'Analyste de performance',role:'Données & recommandations',coul:'chip-blue',
      desc:'Analyse vos données (poids, mensurations, charges, récupération) et génère des recommandations.',
      avis: (forceTestDone()? 'Bilan 1RM : <b>'+fmtKg(state.force.valeurs.bench||'—')+' couché</b> · '+fmtKg(state.force.valeurs.squat||'—')+' squat · '+fmtKg(state.force.valeurs.dead||'—')+' SDT · '+(forceReevalDue()?'<b class="warn">réévaluation recommandée</b>':'prochaine rééval. '+fmtDateFr(nextReevalDate()))+'.<br>':'<b>Bilan 1RM non réalisé</b> : recommandé avant le bilan de départ pour personnaliser les charges.<br>') + (buildRecommendations().filter(r=>r.tag!=='Référent santé').slice(0,2).map(r=>'• '+esc(r.txt)).join('<br>')||'Enregistrez vos données régulièrement : pesées, relevés mensuels, charges du journal et check-ins de récupération. Plus vous renseignez, plus les recommandations sont précises.')}
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
      '<div class="card mt" style="border-color:rgba(255,179,0,.45);background:linear-gradient(160deg,rgba(255,179,0,.1),var(--panel))"><div class="flex" style="gap:12px"><div style="font-size:34px">🏆</div><p style="font-size:15px;font-weight:700;line-height:1.6">'+esc(phrase)+'</p></div></div>'+
      '<div class="flex mt"><button class="btn btn-grad no-print" onclick="go(\'v-photos\')">📸 Voir la galerie de transformation</button><button class="btn btn-line no-print" onclick="exportData()">📦 Sauvegarder mes données</button></div></div>';
  }
  return '<div class="card report-head"><div class="r-m">Bilan mensuel automatique</div><h2>Mois '+mois+'</h2><div class="small mut mt">'+esc(phase.titre)+' — '+(phase.type==='accumulation'?'phase de volume':'phase d\'intensité')+' · '+esc(phase.schema)+' · '+esc(phase.intensite)+'</div></div>'+
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
   ATHLETE OS V2 — module additif
   Pool Lab 8,5×4 · Cardio/Tabata guidés · Démos anatomiques
   Briefing · Body scanner · Projection · Auto-test
   RÈGLE : 100 % additif — ne modifie ni PROGRAM ni les clés V1.
   ============================================================ */

/* ---------- Gardes : clés V2 (rétrocompatibles) ---------- */
function V2S(){
  if(!state.natation) state.natation={seances:[],planDim:false,jours:[]};
  if(!Array.isArray(state.natation.jours)) state.natation.jours=[];
  if(!state.cardio) state.cardio={seances:[]};
  if(!state.tabata) state.tabata={seances:[]};
  if(!state.stretchSuivi) state.stretchSuivi={};
  if(!state.ui) state.ui={};
  return state;
}
document.addEventListener('DOMContentLoaded', function(){ try{ V2S(); }catch(_){} });

/* ---------- Utilitaires V2 ---------- */
function _fmtDur(sec){ sec=Math.round(sec||0); const m=Math.floor(sec/60), s=sec%60; return m+' min'+(s?' '+s+' s':''); }
function _protoDur(steps){ return (steps||[]).reduce((a,x)=>a+(+x[1]||0),0); }
function _R(n, wLbl, wS, rLbl, rS){
  const o=[];
  for(let i=1;i<=n;i++){ o.push([wLbl+' '+i+'/'+n, wS]); if(rS>0) o.push([rLbl, rS]); }
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

/* ============================================================
   POOL LAB — bassin 8,5 × 4 m, 100 % base TEMPS (aucune longueur)
   ============================================================ */
function _aquaTours(tours){
  const bloc=[['Aqua-jogging sur place',40],['Repos',20],['Montées de genoux',40],['Repos',20],
    ['Ciseaux — mains au bord',40],['Repos',20],['Déplacements latéraux (4 m)',40],['Repos',20],
    ['Gainage vertical au bord',40],['Repos',20]];
  const o=[['Échauffement — marche aquatique',180]];
  for(let t=1;t<=tours;t++){ o.push(['Tour '+t+'/'+tours+' — en place',5]); bloc.forEach(s=>o.push(s)); }
  o.push(['Retour au calme — nage douce',180]);
  return o;
}
/* ---------- V4 : jours piscine + Aqua Tabata ---------- */
function poolDays(){
  try{
    const n=state.natation||{};
    let j=Array.isArray(n.jours)?n.jours.slice():[];
    if(n.planDim&&j.indexOf(0)<0) j.push(0);
    return j;
  }catch(_){ return []; }
}
function togglePoolDay(d,v){
  V2S();
  let j=Array.isArray(state.natation.jours)?state.natation.jours.slice():[];
  d=+d;
  if(v&&j.indexOf(d)<0) j.push(d);
  if(!v) j=j.filter(x=>x!==d);
  state.natation.jours=j; state.natation.planDim=j.indexOf(0)>=0;
  save(); renderCurrent(); toast(v?'🏊 Piscine ajoutée ce jour-là':'🏊 Piscine retirée ce jour-là');
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

/* ---------- Tabata & Cardio ---------- */
const TABATA_MODES=[
  {id:'full', nom:'Full Body', ic:'🔥', exos:['Jumping jacks','Squats','Pompes','Mountain climbers','Fentes alternées','Gainage planche','Burpees simplifiés','Relevés de jambes']},
  {id:'upper', nom:'Upper', ic:'💪', exos:['Pompes','Dips au bord','Gainage planche','Pompes inclinées','Superman','Mountain climbers','Planche latérale G','Planche latérale D']},
  {id:'lower', nom:'Lower', ic:'🦵', exos:['Squats','Fentes alternées','Ponts fessiers','Squats sumo','Montées sur mollets','Fentes arrière','Chaise au mur','Battements de jambes']},
  {id:'core', nom:'Core', ic:'🧱', exos:['Crunch','Relevés de jambes','Gainage planche','Russian twist','Planche','Mountain climbers lents','Dead bug','Superman']},
  {id:'cardio', nom:'Cardio', ic:'🫀', exos:['Jumping jacks','Montées de genoux','Burpees','Corde invisible','Patineurs','High knees','Squats sautés','Repos actif']},
  {id:'low', nom:'Low Impact', ic:'🌿', exos:['Marche sur place','Squats doux','Pompes au mur','Ponts fessiers','Oiseau-chien','Chaise douce','Mollets','Respiration profonde']}
];
const CARDIO_TYPES=[
  {id:'endu', nom:'Endurance', ic:'🫀', desc:'allure facile, parler possible'},
  {id:'inter', nom:'Intervalles', ic:'⚡', desc:'1 min soutenu / 1 min facile'},
  {id:'hiit', nom:'HIIT', ic:'🔥', desc:'30 s fort / 30 s facile'},
  {id:'recup', nom:'Récup active', ic:'🌿', desc:'très facile, lendemain de séance'}
];
const CARDIO_DURS=[10,20,30,45,60];

/* ============================================================
   MOTEUR MINUTEUR UNIVERSEL (piscine / tabata / cardio)
   ============================================================ */
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
  try{ asSay(title+'. '+steps[0][0]); }catch(_){}
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
    try{ asSay(P.steps[P.idx][0]); }catch(_){}
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
  try{ asSay('Protocole terminé. Bravo !'); }catch(_){}
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
  V2S();
  const note=((document.getElementById('t-note')||{}).value||'');
  const duree=Math.max(1,Math.round(P.elapsed/60));
  state[P.kind].seances.push({d:todayKey(), proto:((P.meta&&P.meta.label)||P.title), niv:((P.meta&&P.meta.niv)||''), duree:duree, secs:Math.round(P.elapsed), rpe:P.rpe||'', note:String(note).slice(0,140)});
  if(P.meta&&P.meta.combo){ const _cb=P.meta.combo; state[_cb.kind2].seances.push({d:todayKey(), proto:_cb.label2, niv:_cb.niv2||'', duree:_cb.duree2, secs:_cb.secs2, rpe:P.rpe||'', note:String(note).slice(0,140)}); }
  try{
    const _pl=weekPlan(todayKey()).find(p=>p.date===todayKey());
    if(_pl&&(_pl.type==='metcon'||_pl.type==='piscine'||!_pl.key)){ const _j=state.journal[todayKey()]||{exos:[]}; _j.statut='ok'; state.journal[todayKey()]=_j; state.seances[todayKey()]='ok'; }
  }catch(_){}
  save(); checkBadges();
  __pt=null; const ov=document.getElementById('timer-ov'); if(ov) ov.style.display='none';
  renderCurrent(); toast('✅ Séance enregistrée ('+duree+' min)');
}
function delProtoRow(kind, idx){
  V2S();
  if(state[kind]&&state[kind].seances&&state[kind].seances[idx]!=null){
    state[kind].seances.splice(idx,1); save(); renderCurrent(); toast('🗑️ Séance supprimée');
  }
}

/* ---------- Lancements ---------- */
function startProtocol(kind, id, li){
  V2S();
  const pr=POOL_PROTOS.find(p=>p.id===id); if(!pr) return;
  const nv=pr.niveaux[li||0];
  _runSteps('natation', pr.ic+' '+pr.nom, 'Niveau '+nv.n+' · bassin 8,5×4 · base temps', nv.steps, {label:pr.nom, niv:nv.n});
}
function startTabata(modeId, cycles){
  V2S();
  const m=TABATA_MODES.find(x=>x.id===modeId); if(!m) return;
  cycles=cycles||3;
  const steps=_tabataSteps(m, cycles);
  _runSteps('tabata','⚡ Tabata '+m.nom, cycles+' cycle(s) · 20 s effort / 10 s repos', steps, {label:'Tabata '+m.nom, niv:'×'+cycles});
}
function _cardioSteps(tp, min){
  const tot=min*60;
  const w=Math.max(120,Math.round(tot*0.15/30)*30), c=Math.max(60,Math.round(tot*0.1/30)*30);
  const main=Math.max(60,tot-w-c);
  const steps=[['Échauffement',w]];
  if(tp.id==='endu'||tp.id==='recup'){
    steps.push([(tp.id==='endu'?'Bloc principal — allure facile (parler possible)':'Bloc principal — très facile'),main]);
  } else if(tp.id==='inter'){
    let t=0,i=1;
    while(t<main){ const w1=Math.min(60,main-t); steps.push(['Fractionné '+i+' — soutenu',w1]); t+=w1; if(t<main){ const r1=Math.min(60,main-t); steps.push(['Récup active',r1]); t+=r1; } i++; }
  } else {
    let t=0,i=1;
    while(t<main){ const w1=Math.min(30,main-t); steps.push(['Sprint '+i+' — fort',w1]); t+=w1; if(t<main){ const r1=Math.min(30,main-t); steps.push(['Récup',r1]); t+=r1; } i++; }
  }
  steps.push(['Retour au calme',c]);
  return steps;
}
function startCardio(typeId, min){
  V2S();
  const tp=CARDIO_TYPES.find(x=>x.id===typeId); if(!tp) return;
  min=min||20;
  _runSteps('cardio', tp.ic+' Cardio '+tp.nom, min+' min · '+tp.desc, _cardioSteps(tp,min), {label:'Cardio '+tp.nom, niv:min+' min'});
}

/* ============================================================
   MINUTEUR DE REPOS (séances muscu) — pastille flottante
   ============================================================ */
let __rest=null;
function restTimerBarHTML(){
  return '<div class="restbar"><span>⏱ <b>Repos</b></span>'+[30,60,90,120,180].map(s=>'<button class="btn btn-line btn-sm" onclick="startRestTimer('+s+')">'+s+'s</button>').join('')+'<span class="tiny mut">lance un compte à rebours avec alerte sonore + voix</span></div>';
}
function startRestTimer(sec){
  sec=Math.min(600,Math.max(10,Math.round(sec||90)));
  if(__rest&&__rest.iv) clearInterval(__rest.iv);
  let pill=document.getElementById('rest-pill');
  if(!pill){ pill=document.createElement('div'); pill.id='rest-pill'; document.body.appendChild(pill); }
  pill.style.display='flex';
  __rest={total:sec, remain:sec, iv:null, last:Date.now()};
  pill.innerHTML='⏱ <span class="rp-t" id="rest-t">'+_fmtT(sec)+'</span><button class="btn btn-line btn-sm" onclick="_restAdd(15)">+15s</button><button class="btn btn-line btn-sm" onclick="stopRestTimer()">✕</button>';
  beep(660,0.15);
  __rest.iv=setInterval(_restTick,250);
}
function _restTick(){
  const R=__rest; if(!R) return;
  const now=Date.now(); const dt=Math.min(2,(now-R.last)/1000); R.last=now;
  const before=Math.ceil(R.remain);
  R.remain-=dt;
  const cur=Math.ceil(R.remain);
  if(cur!==before&&cur<=3&&cur>0) beep(880,0.12);
  const el=document.getElementById('rest-t'); if(el) el.textContent=_fmtT(R.remain);
  if(R.remain<=0){
    clearInterval(R.iv); __rest=null;
    beep(880,0.2); setTimeout(function(){beep(880,0.2);},250); setTimeout(function(){beep(1175,0.4);},500);
    try{ asSay('Repos terminé. À vous !'); }catch(_){}
    toast('⏱ Repos terminé — à vous !');
    if(el) el.textContent='GO !';
    setTimeout(function(){ const p=document.getElementById('rest-pill'); if(p) p.style.display='none'; },6000);
  }
}
function _restAdd(s){ if(__rest){ __rest.remain+=s; __rest.last=Date.now(); } }
function stopRestTimer(){ if(__rest&&__rest.iv) clearInterval(__rest.iv); __rest=null; const p=document.getElementById('rest-pill'); if(p) p.style.display='none'; }

/* ============================================================
   DÉMOS ANATOMIQUES — silhouette SVG animée style « scan »
   ============================================================ */
const DOS_VIEW_MUSCLES=['dos','tri','isc','mol','lom','fes','epP'];
const SECONDAIRES={pec:['tri','epA'],dos:['bic','epP'],epA:['tri','pec'],epL:['epA','epP'],epP:['dos','tri'],bic:['avb','epA'],tri:['epA','pec'],avb:['bic'],abs:['lom'],lom:['abs','fes'],fes:['qua','isc'],qua:['fes','mol'],isc:['lom','mol'],add:['qua'],mol:['qua']};
const PAT_DD={static:2.6,press:2.6,raise:2.6,lat:2.6,pull:2.8,row:2.6,hinge:3.0,squat:2.8,lunge:2.8,curl:2.2,crunch:1.8,calf:1.6,legext:2.2,legcurl:2.2,stretch:5.2,swim:2.4};
/* [motif normalisé, pattern, vue] — ordre = priorité (spécifique d'abord) */
const EXO_PATTERNS=[
  ['ecarte','press','face'],['fly','press','face'],['cable croise','press','face'],['crossover','press','face'],['croise','press','face'],
  ['traction','pull','dos'],['pull up','pull','dos'],['chin up','pull','dos'],['pull-up','pull','dos'],['chin-up','pull','dos'],
  ['tirage','pull','face'],['lat pulldown','pull','face'],
  ['rowing assis','row','dos'],['seated row','row','dos'],['rowing','row','dos'],
  ['face pull','lat','dos'],['rear delt','lat','dos'],['prone','lat','dos'],
  ['souleve de terre','hinge','dos'],['deadlift','hinge','dos'],
  ['roumain','hinge','dos'],['romanian','hinge','dos'],['good morning','hinge','dos'],['back extension','hinge','dos'],['hyperextension','hinge','dos'],['glute ham','hinge','dos'],
  ['front squat','squat','face'],['back squat','squat','face'],['safety bar','squat','face'],['cyclist','squat','face'],['cycliste','squat','face'],['hack','squat','face'],['leg press','squat','face'],['presse','squat','face'],['squat','squat','face'],
  ['bulgarian','lunge','face'],['bulgare','lunge','face'],['split squat','lunge','face'],['step','lunge','face'],['fente','lunge','face'],['lunge','lunge','face'],
  ['leg extension','legext','face'],
  ['leg curl','legcurl','dos'],['ischio','legcurl','dos'],
  ['mollet','calf','dos'],['calf','calf','dos'],
  ['curl marteau','curl','face'],['marteau','curl','face'],['hammer','curl','face'],['zottman','curl','face'],['concentration','curl','face'],['dumbell curl','curl','face'],['scott','curl','face'],['poulie basse','curl','face'],['low pulley','curl','face'],['curl','curl','face'],
  ['french','curl','dos'],['triceps','curl','dos'],['pushdown','curl','dos'],['extension triceps','curl','dos'],['barre au front','curl','dos'],
  ['pullover','pull','face'],
  ['elevations lat','lat','face'],['lateral raise','lat','face'],['lateral','lat','face'],['lean away','lat','face'],['telle raise','lat','face'],
  ['developpe couche','press','face'],['bench','press','face'],['dips','press','face'],['pompe','press','face'],['push up','press','face'],
  ['developpe inclin','press','face'],['incline dumb','press','face'],['developpe declin','press','face'],['decline dumb','press','face'],
  ['militaire','raise','face'],['derriere la nuque','raise','face'],['behind the neck','raise','face'],['overhead','raise','face'],['california','raise','face'],['haltere un bras','raise','face'],['halteres assis','raise','face'],['seated dumb','raise','face'],
  ['developpe halt','press','face'],['dumbell press','press','face'],
  ['ab wheel','hinge','face'],['roulette','hinge','face'],
  ['crunch','crunch','face'],['releve','crunch','face'],['jackknife','crunch','face'],['wood chop','crunch','face'],['gainage','static','face'],['planche','static','face'],
  ['row','row','dos'],['press','raise','face']
];
const PATTERN_INFO={
  press:{resp:'Inspirez à la descente, expirez en poussant.',etapes:['Placez-vous stable, omoplates serrées, pieds ancrés.','Descendez en contrôlant (phase excentrique du tempo).','Poussez sans verrouiller brutalement les coudes.'],erreurs:['Rebondir en bas du mouvement.','Cambrer excessivement le dos.']},
  raise:{resp:'Expirez en montant la charge au-dessus de la tête.',etapes:['Gainage actif, côtes basses, fessiers serrés.','Montez en ligne droite jusqu\'à extension presque complète.','Redescendez lentement jusqu\'au menton/épaules.'],erreurs:['Cambrer le dos pour tricher.','Descendre trop vite.']},
  lat:{resp:'Expirez en montant les bras sur le côté.',etapes:['Buste droit, épaules basses, légère flexion des coudes.','Montez jusqu\'à hauteur d\'épaules.','Redescendez lentement sans relâcher.'],erreurs:['Hausser les épaules vers les oreilles.','Utiliser l\'élan du buste.']},
  pull:{resp:'Expirez en tirant vers vous / en montant.',etapes:['Départ bras tendus, épaules basses, poitrine fière.','Tirez les coudes vers le bas/arrière.','Contrôlez le retour jusqu\'à extension complète.'],erreurs:['Tirer avec les bras sans fixer les omoplates.','Se balancer pour tricher.']},
  row:{resp:'Expirez en tirant, inspirez en relâchant.',etapes:['Dos plat, buste gainé, regard au sol.','Tirez jusqu\'au bas des côtes en serrant les omoplates.','Étirez sans arrondir le dos.'],erreurs:['Arrondir le dos en bas.','Tirer trop haut vers le cou.']},
  hinge:{resp:'Inspirez en bas, bloquez, expirez en remontant.',etapes:['Hanches en arrière, dos plat, barre proche du corps.','Poussez les hanches vers l\'avant en verrouillant.','Redescendez en gardant le dos neutre.'],erreurs:['Arrondir le bas du dos.','Éloigner la barre du corps.']},
  squat:{resp:'Inspirez en descendant, expirez en remontant.',etapes:['Pieds largeur d\'épaules, genoux dans l\'axe des pieds.','Descendez poitrine fière, poids sur le milieu du pied.','Remontez en poussant le sol, sans rentrer les genoux.'],erreurs:['Genoux qui rentrent vers l\'intérieur.','Talons qui décollent.']},
  lunge:{resp:'Inspirez en descendant, expirez en remontant.',etapes:['Grand pas, buste droit, genou avant au-dessus de la cheville.','Descendez jusqu\'à ~90° des deux genoux.','Poussez sur le talon avant pour remonter.'],erreurs:['Genou avant qui dépasse trop loin.','Buste penché en avant.']},
  curl:{resp:'Expirez en fléchissant, inspirez en descendant.',etapes:['Coudes fixes près du corps, épaules basses.','Montez sans balancer le buste.','Descendez lentement jusqu\'à extension presque complète.'],erreurs:['Balancer le dos pour monter.','Descendre trop vite / relâcher.']},
  crunch:{resp:'Expirez en enroulant, inspirez en revenant.',etapes:['Lombaires plaquées, menton décollé de la poitrine.','Enroulez les épaules vers le bassin.','Redescendez lentement sans relâcher.'],erreurs:['Tirer sur la nuque avec les mains.','Creuser le dos.']},
  calf:{resp:'Respiration fluide, expirez en montant.',etapes:['Montée complète sur l\'avant du pied.','Marquez la contraction en haut.','Descente lente avec étirement en bas.'],erreurs:['Rebondir sans amplitude.','Plier les genoux.']},
  legext:{resp:'Expirez en tendant les jambes.',etapes:['Dos plaqué au dossier, mains aux poignées.','Tendez jusqu\'à contraction maximale.','Redescendez lentement sans claquer.'],erreurs:['Verrouiller violemment les genoux.','Décoller les fesses du siège.']},
  legcurl:{resp:'Expirez en fléchissant, inspirez en revenant.',etapes:['Bassin plaqué, pointe de pieds selon consigne.','Fléchissez à fond.','Retenez le retour sur 3 secondes.'],erreurs:['Décoller les hanches du banc.','Laisser retomber la charge.']},
  stretch:{resp:'Respiration lente : inspirez par le nez, expirez en relâchant.',etapes:['Installez la position sans forcer.','Tenez la durée en respirant lentement.','Répétez de l\'autre côté si besoin.'],erreurs:['Rebondir ou tirer brutalement.','Bloquer la respiration.']},
  swim:{resp:'Respiration régulière, tous les 2-3 temps si crawl.',etapes:['Corps gainé et horizontal, tête basse.','Mouvement ample et relâché.','Gardez le rythme du minuteur.'],erreurs:['Se crisper des épaules.','Partir trop vite.']},
  static:{resp:'Respiration continue, ne bloquez jamais.',etapes:['Alignez tête, bassin, talons.','Serrez abdos et fessiers.','Tenez la position sans casser l\'alignement.'],erreurs:['Creuser le dos.','Bloquer la respiration.']}
};
function mediaForExo(nom, muscle){
  const n=norm(nom||'');
  for(let i=0;i<EXO_PATTERNS.length;i++){ const r=EXO_PATTERNS[i]; if(n.indexOf(r[0])>=0) return {pattern:r[1], view:r[2]}; }
  return {pattern:'static', view:DOS_VIEW_MUSCLES.indexOf(muscle)>=0?'dos':'face'};
}
function tempoDecode(tp){
  const s=String(tp||''); const m=s.match(/(\d)(\d)(\d)(\d)/);
  if(!m) return 'Tempo libre';
  return m[1]+'s excentrique · '+m[2]+'s pause basse · '+m[3]+'s concentrique · '+m[4]+'s pause haute';
}
function _cls(cmap,m){ const c=cmap&&cmap[m]; return 'class="mus'+(c?' m-'+c:'')+'" data-m="'+m+'"'; }
function svgAnatomy(view, cmap, pattern){
  view=(view==='dos')?'dos':'face';
  pattern=pattern||'static';
  const C=m=>_cls(cmap,m);
  const grid='<g class="grid"><line x1="40" y1="8" x2="40" y2="252"/><line x1="100" y1="8" x2="100" y2="252"/><line x1="160" y1="8" x2="160" y2="252"/><line x1="8" y1="70" x2="192" y2="70"/><line x1="8" y1="130" x2="192" y2="130"/><line x1="8" y1="190" x2="192" y2="190"/><line x1="8" y1="245" x2="192" y2="245"/></g>';
  const head='<circle cx="100" cy="28" r="15" class="base"/><rect x="94" y="42" width="12" height="10" rx="4" class="base"/>';
  let torso='',armL='',armR='',legL='',legR='';
  if(view==='face'){
    torso='<rect x="79" y="52" width="42" height="88" rx="13" class="base"/>'
      +'<ellipse cx="89" cy="72" rx="10" ry="8" '+C('pec')+'/>'
      +'<ellipse cx="111" cy="72" rx="10" ry="8" '+C('pec')+'/>'
      +'<rect x="90" y="90" width="20" height="36" rx="4" '+C('abs')+'/>'
      +'<circle cx="74" cy="58" r="6.5" '+C('epL')+'/>'
      +'<circle cx="126" cy="58" r="6.5" '+C('epL')+'/>';
    armL='<g class="arm-l"><rect x="63" y="62" width="11" height="32" rx="5" '+C('bic')+'/><g class="fore-l"><rect x="62" y="96" width="11" height="30" rx="5" '+C('avb')+'/><circle cx="67.5" cy="129" r="5" class="base"/></g></g>';
    armR='<g class="arm-r"><rect x="126" y="62" width="11" height="32" rx="5" '+C('bic')+'/><g class="fore-r"><rect x="127" y="96" width="11" height="30" rx="5" '+C('avb')+'/><circle cx="132.5" cy="129" r="5" class="base"/></g></g>';
    legL='<g class="leg-l"><rect x="84" y="144" width="14" height="50" rx="6" '+C('qua')+'/><g class="shin-l"><rect x="85" y="196" width="12" height="42" rx="6" class="base"/><ellipse cx="91" cy="241" rx="9" ry="5" class="base"/></g></g>';
    legR='<g class="leg-r"><rect x="102" y="144" width="14" height="50" rx="6" '+C('qua')+'/><g class="shin-r"><rect x="103" y="196" width="12" height="42" rx="6" class="base"/><ellipse cx="109" cy="241" rx="9" ry="5" class="base"/></g></g>';
  } else {
    torso='<rect x="79" y="52" width="42" height="88" rx="13" class="base"/>'
      +'<rect x="86" y="53" width="28" height="10" rx="5" '+C('epP')+'/>'
      +'<ellipse cx="87" cy="90" rx="7" ry="17" '+C('dos')+'/>'
      +'<ellipse cx="113" cy="90" rx="7" ry="17" '+C('dos')+'/>'
      +'<rect x="90" y="108" width="20" height="22" rx="4" '+C('lom')+'/>'
      +'<ellipse cx="91" cy="141" rx="9" ry="9" '+C('fes')+'/>'
      +'<ellipse cx="109" cy="141" rx="9" ry="9" '+C('fes')+'/>'
      +'<circle cx="74" cy="58" r="6.5" '+C('epP')+'/>'
      +'<circle cx="126" cy="58" r="6.5" '+C('epP')+'/>';
    armL='<g class="arm-l"><rect x="63" y="62" width="11" height="32" rx="5" '+C('tri')+'/><g class="fore-l"><rect x="62" y="96" width="11" height="30" rx="5" '+C('avb')+'/><circle cx="67.5" cy="129" r="5" class="base"/></g></g>';
    armR='<g class="arm-r"><rect x="126" y="62" width="11" height="32" rx="5" '+C('tri')+'/><g class="fore-r"><rect x="127" y="96" width="11" height="30" rx="5" '+C('avb')+'/><circle cx="132.5" cy="129" r="5" class="base"/></g></g>';
    legL='<g class="leg-l"><rect x="84" y="144" width="14" height="50" rx="6" '+C('isc')+'/><g class="shin-l"><rect x="85" y="196" width="12" height="42" rx="6" class="base"/><ellipse cx="91" cy="210" rx="7" ry="12" '+C('mol')+'/><ellipse cx="91" cy="241" rx="9" ry="5" class="base"/></g></g>';
    legR='<g class="leg-r"><rect x="102" y="144" width="14" height="50" rx="6" '+C('isc')+'/><g class="shin-r"><rect x="103" y="196" width="12" height="42" rx="6" class="base"/><ellipse cx="109" cy="210" rx="7" ry="12" '+C('mol')+'/><ellipse cx="109" cy="241" rx="9" ry="5" class="base"/></g></g>';
  }
  const corners='<g class="corners"><path d="M10 26 V12 Q10 10 12 10 H26"/><path d="M174 10 H188 Q190 10 190 12 V26"/><path d="M10 234 V248 Q10 250 12 250 H26"/><path d="M174 250 H188 Q190 250 190 248 V234"/></g>';
  const dd=PAT_DD[pattern]||2.6;
  return '<div class="demo-stage pat-'+pattern+'" data-dd="'+dd+'" style="--dd:'+dd+'s">'
    +'<svg data-audit-asset="3"><text x="14" y="22" class="scan-t">ATHLETE SCAN · '+(view==='dos'?'DOS':'FACE')+'</text></svg></div>';
}

/* ---------- Viewer démo ---------- */
function openDemoOverlay(title, inner){
  closeDemo();
  const ov=document.createElement('div'); ov.className='demo-ov'; ov.id='demo-ov';
  ov.innerHTML='<div class="demo-box"><div class="spread"><b>'+title+'</b><button class="iconbtn" onclick="closeDemo()">✕</button></div><div class="demo-body">'+inner+'</div></div>';
  ov.addEventListener('mousedown',function(e){ if(e.target===ov) closeDemo(); });
  document.body.appendChild(ov); document.body.style.overflow='hidden';
}
function closeDemo(){
  const ov=document.getElementById('demo-ov'); if(ov) ov.remove();
  if(!document.querySelector('#modal-root .modal-ov')) document.body.style.overflow='';
}
function demoPause(btn){ const st=document.querySelector('#demo-ov .demo-stage'); if(!st) return; st.classList.toggle('paused'); if(btn) btn.textContent=st.classList.contains('paused')?'▶ Lecture':'⏸ Pause'; }
function demoSpeed(mult){ const st=document.querySelector('#demo-ov .demo-stage'); if(!st) return; const base=parseFloat(st.getAttribute('data-dd'))||2.6; st.style.setProperty('--dd',(base/mult)+'s'); }
function demoReplay(){ const st=document.querySelector('#demo-ov .demo-stage'); if(!st||!st.parentNode) return; const c=st.cloneNode(true); st.parentNode.replaceChild(c,st); }
function openDemo(title, sub, view, cmap, pattern, d){
  try{ V2S(); state.ui.demosVues=(state.ui.demosVues||0)+1; debounceSave(); setTimeout(function(){try{checkBadges();}catch(_){/*noop*/}},600); }catch(_){}
  const info=d||{};
  const leg='<div class="flex mt"><span class="chip chip-red">🔴 Primaire</span><span class="chip chip-gold">🟡 Secondaires</span><span class="chip chip-mut">VUE '+(view==='dos'?'DOS':'FACE')+'</span></div>';
  const grid='<div class="grid g2 mt"><div class="report-cell"><div class="rc-l">Tempo</div><div class="rc-v" style="font-size:13px">'+esc(info.tempo||'—')+'</div></div><div class="report-cell"><div class="rc-l">Respiration</div><div class="rc-v" style="font-size:13px">'+esc(info.resp||'—')+'</div></div></div>';
  const steps=(info.etapes||[]).map(s=>'<li>'+esc(s)+'</li>').join('');
  const errs=(info.erreurs||[]).map(s=>'<li>'+esc(s)+'</li>').join('');
  openDemoOverlay('🎬 '+esc(title),
    '<div class="small mut mb">'+sub+'</div>'
    +svgAnatomy(view, cmap, pattern)
    +leg+grid
    +'<h4>✅ Exécution</h4><ul class="demo-list">'+steps+'</ul>'
    +'<h4>⚠️ Erreurs à éviter</h4><ul class="demo-list">'+errs+'</ul>'
    +(info.note?'<div class="note-box mt">💡 '+esc(info.note)+'</div>':'')
    +'<div class="demo-ctrl"><button class="btn btn-line btn-sm" onclick="demoPause(this)">⏸ Pause</button>'
    +'<button class="btn btn-line btn-sm" onclick="demoSpeed(0.5)">0,5×</button>'
    +'<button class="btn btn-line btn-sm" onclick="demoSpeed(1)">1×</button>'
    +'<button class="btn btn-line btn-sm" onclick="demoSpeed(1.5)">1,5×</button>'
    +'<button class="btn btn-line btn-sm" onclick="demoReplay()">🔄 Rejouer</button></div>'
    +'<div class="tiny mut center mt">Animation schématique : amplitude et muscles simplifiés. En cas de douleur, stoppez et consultez un professionnel.</div>'
  );
}
function _openExoDemo(exo){
  if(!exo){ toast('⚠️ Exercice introuvable'); return; }
  try{ let mg=MUSCU_GUIDES[norm(exo[0])]; if(mg&&mg.ref) mg=MUSCU_GUIDES[mg.ref]||mg; if(mg){ const sub='<span class="chip chip-gold">'+esc(((MUSCLES[exo[1]]||{}).n||exo[1]))+'</span> <span class="chip chip-blue">'+esc(String(exo[2]))+' × '+esc(String(exo[3]))+'</span> '+(exo[5]?'<span class="chip chip-mut">repos '+exo[5]+' s</span>':''); openModal('<h3>▶ '+esc(exo[0])+'</h3><img src="'+mg.img+'" style="width:100%;border-radius:12px;margin-bottom:8px" alt="démo"><div class="mb">'+sub+'</div><ul style="padding-left:18px;line-height:1.9;font-size:13.5px"><li>'+mg.tip+'</li></ul><div class="flex mt"><button class="btn btn-grad btn-sm" onclick="closeModal()">Compris !</button></div>'); return; } }catch(_){}
  const med=mediaForExo(exo[0], exo[1]);
  const prim=exo[1], secs=SECONDAIRES[prim]||[];
  const cmap={}; cmap[prim]='prim'; secs.forEach(s=>{cmap[s]='sec';});
  const info=PATTERN_INFO[med.pattern]||PATTERN_INFO.static;
  const sub='<span class="chip chip-gold">'+esc(((MUSCLES[prim]||{}).n||prim))+'</span> <span class="chip chip-blue">'+esc(String(exo[2]))+' × '+esc(String(exo[3]))+'</span> '+(exo[5]?'<span class="chip chip-mut">repos '+exo[5]+' s</span>':'');
  openDemo(exo[0], sub, med.view, cmap, med.pattern, {tempo:tempoDecode(exo[4]), resp:info.resp, etapes:info.etapes, erreurs:info.erreurs, note:exo[6]||''});
}
function openExoDemoIdx(i){ const s=curSession&&curSession.exos; _openExoDemo(s&&s[i]); }
function openExoDemoByRef(ph,k,ei){
  try{ const m=(ph==='F')?PROGRAM.finale:PROGRAM[ph]; _openExoDemo(m&&m.sessions&&m.sessions[k]&&m.sessions[k].exos[ei]); }
  catch(e){ toast('⚠️ Exercice introuvable'); }
}
function openDemoByName(q){
  const nq=norm(q||''); if(!nq||nq.length<3) return false;
  const all=[];
  Object.keys(PROGRAM).forEach(pk=>{ const m=PROGRAM[pk]; if(!m||!m.sessions) return; Object.keys(m.sessions).forEach(sk=>{ (m.sessions[sk].exos||[]).forEach(e=>all.push(e)); }); });
  let f=all.find(e=>norm(e[0])===nq)||all.find(e=>{ const ne=norm(e[0]); return ne.indexOf(nq)>=0||nq.indexOf(ne)>=0; });
  if(!f){ const words=nq.split(' ').filter(w=>w.length>3); if(words.length) f=all.find(e=>{ const ne=norm(e[0]); return words.every(w=>ne.indexOf(w)>=0); }); }
  if(f){ _openExoDemo(f); return true; }
  return false;
}
function openStretchDemo(mk, idx){
  const g=ETIREMENTS_PAR_MUSCLE[mk]; if(!g) return;
  const ex=g.exos[idx||0]; if(!ex) return;
  const cmap={}; cmap[mk]='prim';
  const view=DOS_VIEW_MUSCLES.indexOf(mk)>=0?'dos':'face';
  openDemo(ex[1], '<span class="chip chip-green">'+esc(g.nom)+'</span> <span class="chip chip-mut">'+esc(ex[2])+'</span>', view, cmap, 'stretch', {
    tempo:'Tenir '+ex[2]+' · sans à-coups',
    resp:'Respiration lente : inspirez par le nez, expirez profondément en relâchant.',
    etapes:['Installez la position décrite ci-dessous, sans forcer.','Tenez '+ex[2]+' en respirant lentement.','Répétez de l\'autre côté si besoin.'],
    erreurs:['Rebondir ou tirer brutalement.','Bloquer la respiration / se crisper.'],
    note:ex[3]||''
  });
}

/* ============================================================
   VUES V2 — Piscine & Cardio
   ============================================================ */
function renderPiscine(){
  V2S();
  const plan=weekPlan(todayKey()).filter(p=>!p.key);
  const jours=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const creneaux=plan.length? plan.map(p=>fmtDateShort(p.date)+' ('+jours[p.wk]+')').join(' · ') : 'aucun (semaine complète)';
  $('#pool-plan').innerHTML='<div class="card glow"><div><b>🛰️ Créneaux conseillés cette semaine</b><div class="small mut">'+esc(creneaux)+'</div>'
    +'<div class="tiny mut mt">Bassin 8,5 × 4 m : longueur utile &lt; 8 m — tous les protocoles sont en base TEMPS (aucune longueur 25/50 m). Élastique de nage statique conseillé.</div></div>'
    +'<div class="mt"><b>🏊 Jours piscine dans ma semaine</b><div class="tiny mut">La piscine apparaît dans <b>Entraînement → Cette semaine</b>, le dashboard et le calendrier ces jours-là (si repos, hors deload).</div><div class="flex mt">'
    +[1,2,3,4,5,6,0].map(d=>'<label class="chip '+(poolDays().indexOf(d)>=0?'chip-blue':'chip-mut')+'" style="cursor:pointer"><input type="checkbox" style="display:none" '+(poolDays().indexOf(d)>=0?'checked':'')+' onchange="togglePoolDay('+d+',this.checked)"> '+['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][d]+'</label>').join('')+'</div></div>'
    +'<div class="warn-box mt">⚠️ Savoir nager requis. Ne nagez jamais seul, bord antidérapant, pas de plongeon ni de sprint violent en petit bassin. Hydratez-vous.</div></div>';
  $('#pool-protos').innerHTML='<div class="grid g2">'+POOL_PROTOS.map(pr=>{
    return '<div class="card"><div class="spread"><b>'+pr.ic+' '+esc(pr.nom)+'</b></div><div class="small mut mt">'+esc(pr.desc)+'</div>'
      +pr.niveaux.map((nv,li)=>'<div class="prep-step mt"><div class="prep-h"><b>'+esc(nv.n)+'</b><span class="chip chip-mut" style="margin-left:auto">'+_fmtDur(_protoDur(nv.steps))+'</span></div><p class="prep-p">'+esc(nv.conseil)+'</p><div class="flex mt"><button class="btn btn-grad btn-sm" onclick="startProtocol(\'pool\',\''+pr.id+'\','+li+')">▶ Démarrer</button><button class="btn btn-line btn-sm" onclick="this.parentElement.nextElementSibling.style.display=this.parentElement.nextElementSibling.style.display===\'none\'?\'block\':\'none\'">Détail</button></div><div class="tiny mut mt" style="display:none">'+nv.steps.map(s=>esc(s[0])+qBtn(s[0])+' — '+_fmtDur(s[1])).join('<br>')+'</div></div>').join('')
      +'</div>';
  }).join('')+'</div>';
  const h=state.natation.seances;
  $('#pool-hist').innerHTML = h.length
    ? '<div class="tbl-wrap"><table class="tbl"><tr><th>Date</th><th>Protocole</th><th>Niveau</th><th>Durée</th><th>RPE</th><th></th></tr>'
      +h.map((s,i)=>'<tr><td>'+fmtDateShort(s.d)+'</td><td><b>'+esc(s.proto)+'</b>'+(s.note?'<div class="tiny mut">'+esc(s.note)+'</div>':'')+'</td><td>'+esc(s.niv||'—')+'</td><td class="num">'+s.duree+' min</td><td class="num">'+(s.rpe||'—')+'</td><td><button class="btn btn-line btn-sm" onclick="delProtoRow(\'natation\','+i+')">✕</button></td></tr>').reverse().join('')+'</table></div>'
      +'<div class="small mut mt">Total : '+h.reduce((a,s)=>a+(+s.duree||0),0)+' min · '+h.length+' séance(s)</div>'
    : '<div class="chart-empty">Aucune séance piscine pour l\'instant — lancez un protocole ci-dessus.</div>';
}
function togglePoolDim(v){ V2S(); state.natation.planDim=!!v; save(); toast(v?'🏊 Piscine ajoutée au dimanche':'🏊 Piscine retirée du planning'); renderCurrent(); }
function _histMini(liste, vide){
  if(!liste.length) return '<div class="chart-empty">'+vide+'</div>';
  return '<div class="tbl-wrap"><table class="tbl"><tr><th>Date</th><th>Séance</th><th>Durée</th><th>RPE</th><th></th></tr>'
    +liste.map((s,i)=>'<tr><td>'+fmtDateShort(s.d)+'</td><td><b>'+esc(s.proto)+'</b></td><td class="num">'+s.duree+' min</td><td class="num">'+(s.rpe||'—')+'</td><td><button class="btn btn-line btn-sm" data-k="'+i+'">✕</button></td></tr>').reverse().join('')+'</table></div>';
}
function renderCardio(){
  V2S();
  $('#tabata-modes').innerHTML='<div class="note-box mb">🔥 Le Tabata se fait aussi <b>dans la piscine</b> (20/10, zéro impact) : voir <b>Pool Lab → Aqua Tabata</b>. <button class="btn btn-line btn-sm" onclick="go(\'v-piscine\')">🏊 Y aller</button></div><div class="grid g3">'+TABATA_MODES.map(m=>{
    return '<div class="card"><b>'+m.ic+' '+esc(m.nom)+'</b><div class="tiny mut mt">'+m.exos.join(' · ')+'</div>'
      +'<div class="flex mt">'+[1,2,3,4].map(c=>'<button class="btn '+(c===3?'btn-grad':'btn-line')+' btn-sm" onclick="startTabata(\''+m.id+'\','+c+')">▶ ×'+c+'</button>').join('')+'</div></div>';
  }).join('')+'</div>';
  const pos=programPos(todayKey());
  $('#cardio-presets').innerHTML='<div class="grid g2">'+CARDIO_TYPES.map(tp=>{
    return '<div class="card"><div class="spread"><b>'+tp.ic+' '+esc(tp.nom)+'</b><span class="chip chip-mut">'+esc(tp.desc)+'</span></div>'
      +'<div class="flex mt">'+CARDIO_DURS.map(d=>'<button class="btn btn-line btn-sm" onclick="startCardio(\''+tp.id+'\','+d+')">'+d+' min</button>').join('')+'</div></div>';
  }).join('')+'</div>'
  +'<div class="note-box mt">🫀 <b>METCON du mois</b> (« '+esc(pos.phase.metcon)+' ») — équivalent guidé : <button class="btn btn-line btn-sm" onclick="startCardio(\'inter\',20)">⚡ Intervalles 20 min</button></div>';
  const th=state.tabata.seances, ch=state.cardio.seances;
  $('#tabata-hist').innerHTML='<b>⚡ Tabata ('+th.length+')</b>'+_histMini(th,'Aucun Tabata enregistré.');
  $('#cardio-hist').innerHTML='<b>🫀 Cardio ('+ch.length+')</b>'+_histMini(ch,'Aucun cardio enregistré.');
  Array.prototype.forEach.call(document.querySelectorAll('#tabata-hist [data-k]'),function(b){ b.onclick=function(){ delProtoRow('tabata',+b.getAttribute('data-k')); }; });
  Array.prototype.forEach.call(document.querySelectorAll('#cardio-hist [data-k]'),function(b){ b.onclick=function(){ delProtoRow('cardio',+b.getAttribute('data-k')); }; });
}

/* ============================================================
   BRIEFING · BODY SCANNER · PROJECTION
   ============================================================ */
function athleteBriefing(){
  try{
    const p=state.profil; if(!p.date) return '';
    const tk=todayKey();
    const today=weekPlan(tk).find(x=>x.date===tk)||{};
    const sc=recupScore(state.recup[tk]);
    const chip=sc==null?'<span class="chip chip-mut">RÉCUP —</span>':sc>=65?'<span class="chip chip-green">🟢 RÉCUP '+sc+' %</span>':sc>=50?'<span class="chip chip-orange">🟠 RÉCUP '+sc+' %</span>':'<span class="chip chip-red">🔴 RÉCUP '+sc+' %</span>';
    let txt='', btns='';
    if(today.type==='seance'){
      const ds=Object.keys(state.journal).filter(d=>d<tk).sort();
      const last=ds.length?ds[ds.length-1]:null;
      const delayH=last?Math.round((parseDate(tk)-parseDate(last))/36e5):null;
      let suggTxt='';
      try{
        const pos=programPos(tk); const sess=today.session; const first=sess&&sess.exos&&sess.exos[0];
        if(first){ const g=chargeSuggestion(first[0],first[1],first[3],pos); if(g) suggTxt=' Charge de référence : <b>'+esc(first[0])+' ≈ '+fmtNum(g.charge)+' kg</b> ('+g.pct+' % 1RM).'; }
      }catch(_){}
      txt='Mission du jour : <b>'+esc(today.label||'Séance')+'</b>.'+(delayH!=null?' Dernière séance il y a <b>'+delayH+' h</b>.':' Première séance enregistrée : donnez tout, proprement.')+suggTxt;
      if(sc!=null&&sc<50) txt+=' <b>Récup basse : séance allégée conseillée (−10 à −20 %) ou récupération active.</b>';
      btns='<button class="btn btn-grad btn-sm" onclick="openSession(\''+tk+'\')">▶ START MISSION</button><button class="btn btn-line btn-sm" onclick="go(\'v-recuperation\')">😴 Récupération</button>';
    } else if(today.type==='metcon'){
      txt='Jour cardio : votre METCON du mois peut être lancé en <b>mode guidé</b> (minuteur + voix).';
      btns='<button class="btn btn-grad btn-sm" onclick="go(\'v-cardio\')">⚡ Lancer le cardio guidé</button>';
    } else if(today.type==='piscine'){
      txt='Jour piscine : privilégiez <b>Aqua Recovery</b> ou <b>Swim Endurance BEGINNER</b> si la semaine fut chargée.';
      btns='<button class="btn btn-grad btn-sm" onclick="go(\'v-piscine\')">🏊 Ouvrir Pool Lab</button>';
    } else {
      txt='Jour de repos : marche douce, mobilité, sommeil. La croissance se joue ici aussi.';
      btns='<button class="btn btn-line btn-sm" onclick="go(\'v-recuperation\')">😴 Check-in</button><button class="btn btn-line btn-sm" onclick="openExtra(\''+todayKey()+'\')">🧊 Détente</button>';
    }
    return '<div class="card glow mb hud-brief"><div class="spread"><div><b>🛰️ SYSTEM BRIEFING</b> '+chip+'</div><span class="chip chip-gold">SCORE '+(athleteScore1000()==null?'—':athleteScore1000())+'/1000</span></div><div class="sys-line">ATHLETE OS · ONLINE · SYSTEM NOMINAL</div><p class="small mt">'+txt+'</p><div class="flex mt">'+btns+'<button class="btn btn-line btn-sm" onclick="speakBriefing()">🔊 Briefing vocal</button><button class="btn btn-line btn-sm" onclick="toggleAssistant()">● COMMAND</button></div></div>';
  }catch(e){ return ''; }
}
function bodyScannerHTML(){
  try{
    const vm=volumeMuscles();
    const cmap={}, bad=[], warn=[];
    Object.keys(MUSCLES).forEach(m=>{
      const st=statutMuscle(vm[m]||0, MUSCLES[m].zone);
      const c=st.cls==='chip-green'?'ok':st.cls==='chip-orange'?'warn':'bad';
      cmap[m]=c;
      if(c==='bad') bad.push(MUSCLES[m].n); else if(c==='warn') warn.push(MUSCLES[m].n);
    });
    return '<div class="card mt" id="scan-v2"><div class="sectitle" style="margin-top:0"><div class="bar"></div><h2>Body scanner</h2><span class="sub">volume hebdo par groupe</span></div>'
      +'<div class="scan-wrap"><div>'+svgAnatomy('face',cmap,'static')+'<div class="tiny mut center">FACE</div></div>'
      +'<div>'+svgAnatomy('dos',cmap,'static')+'<div class="tiny mut center">DOS</div></div>'
      +'<div class="scan-legend small mut"><span class="chip chip-green">🟢 stimulé</span> <span class="chip chip-orange">🟠 à surveiller</span> <span class="chip chip-red">🔴 sous-entraîné</span>'
      +(bad.length?'<div class="mt">🔴 Priorités : <b>'+esc(bad.join(', '))+'</b> — vérifiez qu\'une séance les cible cette semaine.</div>':'<div class="mt">✅ Aucun groupe sous-entraîné cette semaine.</div>')
      +(warn.length?'<div class="tiny">🟠 À surveiller : '+esc(warn.join(', '))+'.</div>':'')+'</div></div></div>';
  }catch(e){ return ''; }
}
function linReg(ys){
  const n=ys.length; if(n<2) return null;
  let sx=0,sy=0,sxx=0,sxy=0;
  for(let i=0;i<n;i++){ sx+=i; sy+=ys[i]; sxx+=i*i; sxy+=i*ys[i]; }
  const d=n*sxx-sx*sx; if(!d) return null;
  return {a:(n*sxy-sx*sy)/d, b:(sy-((n*sxy-sx*sy)/d)*sx)/n};
}
function prediTrendHTML(){
  try{
    const h=perfHistorique('bench'), wks=nbSemainesEcoulees();
    if(!h||h.length<3) return '<div class="card mt" id="trend-v2"><b>🔮 Projection</b><div class="small mut mt">Encore '+Math.max(0,3-(h?h.length:0))+' séance(s) de développé couché avec charges pour activer la projection (minimum 3 points).</div></div>';
    const ys=h.map(x=>x.v), r=linReg(ys), last=ys[ys.length-1];
    if(!r) return '';
    const p30=last+r.a*4, p90=last+r.a*12;
    const fiab=wks<8?'faible ('+wks+' sem. de données) — indicative uniquement':wks<20?'modérée':'correcte';
    const dir=r.a>0.05?'📈 en hausse':r.a<-0.05?'📉 en baisse — vérifiez récup, sommeil, nutrition':'➡️ stable';
    return '<div class="card mt" id="trend-v2"><b>🔮 Projection développé couché (1RM est.)</b> <span class="chip chip-mut">fiabilité '+fiab+'</span>'
      +'<div class="grid g3 mt"><div class="report-cell"><div class="rc-l">Actuel</div><div class="rc-v">'+fmtNum(last)+' kg</div></div>'
      +'<div class="report-cell"><div class="rc-l">+30 jours</div><div class="rc-v gold">≈ '+fmtNum(p30)+' kg</div></div>'
      +'<div class="report-cell"><div class="rc-l">+90 jours</div><div class="rc-v gold">≈ '+fmtNum(p90)+' kg</div></div></div>'
      +'<div class="small mut mt">Tendance '+dir+' ('+(r.a>=0?'+':'')+round1(r.a)+' kg/séance). Projection mathématique indicative, pas une promesse : sommeil, nutrition et assiduité décident.</div></div>';
  }catch(e){ return ''; }
}

/* ============================================================
   AUTO-TEST (lecture seule — ne modifie aucune donnée)
   ============================================================ */
function selfTest(){
  const R=[];
  const ok=(n,c)=>R.push({n:n,ok:!!c});
  try{
    ok('16 vues présentes (14 + piscine + cardio)', ['v-dashboard','v-profil','v-force','v-mensurations','v-entrainement','v-nutrition','v-repas','v-recuperation','v-progression','v-photos','v-calendrier','v-objectifs','v-equipe','v-bilan','v-piscine','v-cardio'].every(id=>document.getElementById(id)));
    let nE=0; Object.keys(PROGRAM).forEach(k=>{ const m=PROGRAM[k]; if(m&&m.sessions) Object.keys(m.sessions).forEach(s=>{ nE+=(m.sessions[s].exos||[]).length; }); });
    ok('Programme intact ('+nE+' entrées)', nE>=250);
    ok('Clés V2 présentes (natation/cardio/tabata)', !!(V2S().natation&&state.cardio&&state.tabata));
    let g=null; try{ g=chargeSuggestion('Développé couché barre','pec','8-10',programPos(todayKey())); }catch(e){ g=null; }
    ok('Suggestion de charge', !g||typeof g.charge==='number');
    const vm=volumeMuscles(); ok('Volume 15 groupes', !!(vm&&Object.keys(MUSCLES).every(m=>typeof vm[m]==='number')));
    const sc=recupScore({h:8,qual:4,fa:2,str:2,cour:2,mot:4,en:4}); ok('Score récup 0-100', typeof sc==='number'&&sc>=0&&sc<=100);
    const cov=['Développé couché barre','Back squat','Soulevé de terre','Tractions (pull-up)','Curl barre','Mollets debout','Crunch à la poulie','Fentes bulgares haltères (pied avant surélevé)','Dips','Rowing barre buste penché, pronation'].every(nm=>{ const m=mediaForExo(nm,'pec'); return m&&m.pattern; });
    ok('Démos : 10 exos types couverts', cov);
    ok('SVG anatomique face/dos', svgAnatomy('face',{},'squat').indexOf('<svg')>0&&svgAnatomy('dos',{},'hinge').indexOf('<svg')>0);
    ok('Pool Lab : 6 protocoles × 3 niveaux', POOL_PROTOS.length===6&&POOL_PROTOS.every(p=>p.niveaux.length===3));
    ok('Tabata : 6 modes', TABATA_MODES.length===6);
    ok('Moteurs minuteurs', typeof _runSteps==='function'&&typeof startRestTimer==='function');
    ok('Coach extra', (function(){try{const c=coachExtra(todayKey());return c&&c.main&&c.main.nom;}catch(e){return false;}})());
    ok('Extras archivés', typeof extrasDuJour==='function'&&typeof extrasHtml==='function');
    ok('Séance combinée', typeof startCombo==='function'&&typeof comboSteps==='function');
    ok('Détail piscine', typeof poolSummaryHtml==='function');
    ok('Phases piscine', typeof poolPhaseHtml==='function');
    ok('Rotation coach', typeof extraSeq==='function');
    ok('Guides piscine', typeof openGuide==='function'&&typeof qBtn==='function');
    ok('Modales empilées', (function(){try{return /querySelectorAll/.test(closeModal.toString());}catch(e){return false;}})());
    ok('Enregistrement manuel', typeof logExtraManu==='function');
    ok('Visuels guides', (function(){try{return POOL_GUIDES.filter(g=>g.img).length>=9;}catch(e){return false;}})());
    ok('Visuels muscu', (function(){try{return Object.keys(MUSCU_GUIDES).length>=49;}catch(e){return false;}})());
    ok('Export JSON prêt ('+Math.round(JSON.stringify(state).length/1024)+' Ko)', JSON.stringify(state).length>1000);
  }catch(e){ R.push({n:'Exception : '+e.message, ok:false}); }
  const pass=R.filter(r=>r.ok).length;
  openModal('<h3>🧪 Auto-test ATHLETE OS</h3><div class="small mut mb">'+pass+' / '+R.length+' vérifications réussies — aucune donnée modifiée.</div>'+R.map(r=>'<div class="checkrow"><span>'+(r.ok?'✅':'❌')+'</span> '+esc(r.n)+'</div>').join(''));
}

/* ============================================================
   ATHLETE OS V3 — peau JARVIS / HUD (désactivable, additif)
   Boot system · thème HUD · score /1000 · briefing vocal
   ============================================================ */
function hudOn(){ try{ return !(state.ui&&state.ui.hud===false); }catch(_){ return true; } }
function setHud(v){
  try{ V2S(); state.ui.hud=!!v; save(); }catch(_){}
  applyHud();
  toast(v?'🛰️ HUD ATHLETE OS activé':'🎨 Thème classique activé');
  try{ renderCurrent(); }catch(_){}
}
function applyHud(){
  const on=hudOn();
  try{ document.body.classList.toggle('hud', !!on); }catch(_){}
  try{
    const bar=document.querySelector('.top-actions');
    let pill=document.getElementById('hud-pill');
    if(on&&bar&&!pill){
      pill=document.createElement('span');
      pill.id='hud-pill'; pill.className='hud-pill'; pill.textContent='● ONLINE';
      pill.title='ATHLETE OS actif';
      bar.insertBefore(pill, bar.firstChild);
    }
    if(!on&&pill) pill.remove();
  }catch(_){}
}
function athleteScore1000(){
  try{
    const s=scoreTransformation();
    if(!s||typeof s.total!=='number') return null;
    return Math.max(0,Math.min(1000, s.total*10));
  }catch(_){ return null; }
}
function speakBriefing(){
  try{
    const tk=todayKey();
    const today=weekPlan(tk).find(x=>x.date===tk)||{};
    const sc=recupScore(state.recup[tk]);
    const score=athleteScore1000();
    let txt='Analyse terminée. ';
    txt+=sc==null?'Récupération non renseignée. ':'Récupération '+sc+' pour cent. ';
    if(score!=null) txt+='Score athlète '+score+' sur 1000. ';
    if(today.type==='seance') txt+='Mission du jour : '+(today.label||'séance')+'. '+(sc!=null&&sc<50?'Récupération basse : séance allégée conseillée.':'Séance maintenue normalement.');
    else if(today.type==='metcon') txt+='Jour cardio : lancez le mode guidé.';
    else if(today.type==='piscine') txt+='Jour piscine : récupération active conseillée.';
    else txt+='Jour de repos : récupération et sommeil.';
    asSay(txt);
  }catch(e){ toast('⚠️ Briefing vocal indisponible'); }
}
function hudBoot(){
  try{
    if(!hudOn()) return;
    if(document.getElementById('boot-ov')) return;
    const nom=((state.profil||{}).nom||'Athlète').split(' ')[0];
    const score=athleteScore1000();
    const sc=recupScore(state.recup[todayKey()]);
    const ov=document.createElement('div');
    ov.id='boot-ov'; ov.className='boot-ov';
    ov.innerHTML='<div class="boot-box"><div class="boot-logo">🛰️</div>'
      +'<div class="boot-title">ATHLETE OS</div>'
      +'<div class="boot-sub">SYSTEM STATUS : <span class="up">OPTIMAL</span></div>'
      +'<div class="boot-bar"><div class="boot-fill"></div></div>'
      +'<div class="boot-lines">'
      +'<div>RÉCUP … '+(sc==null?'—':sc+' %')+'</div>'
      +'<div>SCORE … '+(score==null?'—':score+' / 1000')+'</div>'
      +'<div>Bonjour, '+esc(nom)+'. Toucher pour continuer.</div>'
      +'</div></div>';
    ov.addEventListener('click', function(){ ov.remove(); });
    document.body.appendChild(ov);
    setTimeout(function(){ const o=document.getElementById('boot-ov'); if(o){ o.classList.add('boot-out'); setTimeout(function(){ o.remove(); },350); } },2100);
  }catch(_){}
}
document.addEventListener('DOMContentLoaded', function(){ try{ V2S(); applyHud(); setTimeout(hudBoot,200); }catch(_){} });

/* ============================================================
   V5 — COACH EXTRA : décide et propose (metcon/piscine/repos)
   ============================================================ */
function _tabataSteps(m, cycles){
  const steps=[['Échauffement — cardio léger',120]];
  for(let c=1;c<=cycles;c++){
    steps.push(['Tabata '+c+'/'+cycles+' — en place',5]);
    m.exos.forEach(ex=>{ steps.push([ex+' — EFFORT',20]); steps.push(['Repos',10]); });
    if(c<cycles) steps.push(['Récup entre tabatas',180]);
  }
  steps.push(['Retour au calme',120]);
  return steps;
}
function _extraFam(proto){
  const p=norm(proto||'');
  if(p.indexOf('tabata')>=0) return 'tabata';
  if(p.indexOf('cardio')>=0) return 'cardio';
  if(p.indexOf('swim')>=0||p.indexOf('aqua')>=0) return 'pool';
  return 'autre';
}
function _runFam(run){ return run.fn==='tabata'?'tabata':run.fn==='cardio'?'cardio':run.fn==='repos'?'repos':'pool'; }
function extraSteps(run){
  if(!run||run.fn==='repos') return [];
  if(run.fn==='combo') return comboSteps(run);
  if(run.fn==='pool'){ const pr=POOL_PROTOS.find(p=>p.id===run.id); const nv=pr&&pr.niveaux[run.lvl||0]; return nv?nv.steps:[]; }
  if(run.fn==='tabata'){ const m=TABATA_MODES.find(x=>x.id===run.id)||TABATA_MODES[0]; return _tabataSteps(m, run.cycles||3); }
  if(run.fn==='cardio'){ const tp=CARDIO_TYPES.find(x=>x.id===run.id)||CARDIO_TYPES[0]; return _cardioSteps(tp, run.min||20); }
  return [];
}
function extraDuree(run){ const s=extraSteps(run); return s.length?_fmtDur(_protoDur(s)):'—'; }
function runLaunch(run,date){
  if(run.fn==='combo') return "closeModal();startCombo('"+date+"')";
  if(run.fn==='pool') return "closeModal();startProtocol('pool','"+run.id+"',"+(run.lvl||0)+")";
  if(run.fn==='tabata') return "closeModal();startTabata('"+run.id+"',"+(run.cycles||3)+")";
  if(run.fn==='cardio') return "closeModal();startCardio('"+run.id+"',"+(run.min||20)+")";
  return "setSeanceStatus('"+date+"','ok');closeModal();renderCurrent()";
}
function coachExtra(date){
  V2S();
  const wk=(weekPlan(date).find(p=>p.date===date))||{};
  const pos=programPos(date);
  const type=wk.type||'repos';
  const rec=state.recup[date]?recupScore(state.recup[date]):(function(){try{return moyenneRecup();}catch(_){return null;}})();
  const score=rec==null?65:rec;
  const base=parseDate(date);
  const ds=[]; for(let i=6;i>=0;i--) ds.push(dateKey(addDays(base,-i)));
  let durs=0;
  ['natation','cardio','tabata'].forEach(k=>{
    ((state[k]&&state[k].seances)||[]).forEach(s=>{
      if(ds.indexOf(s.d)<0) return;
      const hard=(k==='tabata')||(k==='cardio'&&/HIIT|Intervalles/.test(s.proto||''))||(k==='natation'&&!/Recovery|Endurance/.test(s.proto||''));
      if(hard) durs++;
    });
  });
  const lastPoolKey=(function(){ const s=(state.natation&&state.natation.seances)||[]; return s.length?_poolKey(s[s.length-1].proto):''; })();
  const lastCardio=(function(){ const s=(state.cardio&&state.cardio.seances)||[]; return s.length?(s[s.length-1].proto||''):''; })();
  const deload=!!pos.deload;
  const seq=extraSeq(date);
  const rot=list=>{ const k=((seq%list.length)+list.length)%list.length; return list.slice(k).concat(list.slice(0,k)); };
  const PP=(id,lvl,nom)=>({fn:'pool',id:id,lvl:lvl,nom:nom});
  const REPOS={fn:'repos',nom:'Repos total + mobilité douce'};
  const REC0=PP('recovery',0,'Aqua Recovery douce (12 min)'), REC1=PP('recovery',1,'Aqua Recovery complète (18 min)');
  const combo=(cid,cmin,pid,plvl,pnom)=>{
    const tp=CARDIO_TYPES.find(x=>x.id===cid)||CARDIO_TYPES[0];
    const pdur=_fmtDur(_protoDur(poolStepsOf(pid,plvl||0)));
    return {fn:'combo',cardio:{id:cid,min:cmin},pool:{id:pid,lvl:plvl||0,nom:pnom},
      nom:'METCON Elliptique '+tp.nom+' '+cmin+' min + '+pnom,
      cardioTxt:'🚴 METCON vélo elliptique — '+tp.nom+' '+cmin+' min',
      poolTxt:'🏊 '+pnom+(pdur?' · '+pdur:'')};
  };
  let main, why='';
  if(type==='repos'){
    if(score<50){ main=REPOS; why='Récupération à '+score+' % : le coach impose un vrai repos. Mobilité douce, étirements, hydratation — le repos fait progresser.'; }
    else { main=REC1; why='Jour de repos (récup '+score+' %) : le coach impose une récupération active en piscine — nage douce + mobilité, sans fatigue.'; }
  } else if(deload||score<50){
    main=REC0;
    why=deload?'Semaine deload : volume réduit, le coach impose uniquement Aqua Recovery douce.':'Récupération à '+score+' % : le coach impose une séance douce en piscine. Les jours durs reviendront avec la forme.';
  } else if(score<65||durs>=3){
    const pools=rot([PP('interval',0,'Swim Interval BEGINNER'),PP('aquahiit',0,'Aqua HIIT BEGINNER'),PP('aquatabata',0,'Aqua Tabata ×2'),PP('endurance',0,'Swim Endurance BEGINNER')]);
    const p=pools.find(o=>o.id!==lastPoolKey)||pools[0];
    const copts=rot([{id:'inter',re:/Intervalles/},{id:'endu',re:/Endurance/}]);
    const cid=(copts.find(o=>!o.re.test(lastCardio))||copts[0]).id;
    const cmin=score<60?15:20;
    main=combo(cid,cmin,p.id,p.lvl,p.nom);
    why='Charge '+(durs>=3?'élevée ('+durs+' séances dures / 7 j)':'modérée')+' (récup '+score+' %) : le coach impose METCON elliptique '+cmin+' min + '+p.nom+' en piscine'+(type==='metcon'?' — votre METCON du mois en version imposée':'')+'. Protocoles en rotation automatique : variés à chaque séance.';
  } else {
    const pools=rot([PP('interval',1,'Swim Interval INTERMEDIATE'),PP('aquatabata',1,'Aqua Tabata ×3'),PP('sprint',0,'Swim Sprint BEGINNER'),PP('aquahiit',1,'Aqua HIIT INTERMEDIATE')]);
    const p=pools.find(o=>o.id!==lastPoolKey)||pools[0];
    const copts=rot([{id:'hiit',re:/HIIT/},{id:'inter',re:/Intervalles/}]);
    const cid=(copts.find(o=>!o.re.test(lastCardio))||copts[0]).id;
    const cmin=20;
    main=combo(cid,cmin,p.id,p.lvl,p.nom);
    why='Bonne fraîcheur (récup '+score+' %, '+durs+' séance(s) dure(s) / 7 j) : le coach impose METCON elliptique '+cmin+' min + '+p.nom+' en piscine'+(type==='metcon'?' — votre METCON du mois en version imposée':'')+'. Protocoles en rotation automatique. On exécute. 💪';
  }
  return {type:type, main:main, why:why};
}
function extraDetail(d2){
  try{
    if(!d2||d2.type==='seance') return '';
    const c=coachExtra(d2.date);
    const ic=c.main.fn==='combo'?'🚴🏊':c.main.fn==='pool'?'🏊':c.main.fn==='tabata'?'🔥':c.main.fn==='cardio'?'⚡':'😴';
    return '<div class="tiny" style="font-weight:400;color:var(--mut)">→ '+ic+' '+esc(c.main.nom)+(c.main.fn==='repos'?'':' · '+extraDuree(c.main))+'</div>';
  }catch(_){ return ''; }
}
function openExtra(date){
  const c=coachExtra(date);
  const tag=c.type==='metcon'?'⚡ METCON':c.type==='piscine'?'🏊 Piscine':'😴 Repos';
  const steps=extraSteps(c.main);
  const prev=(c.main.fn==='combo')
    ?'<b>'+esc(c.main.cardioTxt)+'</b><br>🔄 Transition — boire, rejoindre la piscine (5 min)<br><b>'+esc(c.main.poolTxt)+'</b>'+poolSummaryHtml(c.main.pool.id,c.main.pool.lvl||0)+'<div class="tiny mut mt">Minuteur combiné : '+steps.length+' étapes · '+extraDuree(c.main)+' au total</div>'
    :(c.main.fn==='pool'?poolSummaryHtml(c.main.id,c.main.lvl||0)
    :steps.length?steps.slice(0,6).map(s=>esc(s[0])+' — '+_fmtDur(s[1])).join('<br>')+(steps.length>6?'<br>… +'+(steps.length-6)+' étapes':''):'Mobilité douce 10 min + étirements + hydratation. Le vrai repos fait progresser.');
  const mainBtn=c.main.fn==='repos'
    ?'<button class="btn btn-grad" onclick="'+runLaunch(c.main,date)+'">✅ Valider mon repos</button>'
    :'<button class="btn btn-grad" onclick="'+runLaunch(c.main,date)+'">▶ Démarrer ('+extraDuree(c.main)+')</button><button class="btn btn-line" onclick="logExtraManu(\''+date+'\')">✅ Séance terminée</button>';
  openModal('<h3>🧠 Coach — '+tag+' <span class="small mut">— '+fmtDateFr(date)+'</span></h3>'
    +'<div class="ok-box mb">🧠 <b>Décision du coach :</b> '+esc(c.why)+'</div>'
    +'<div class="card glow"><b>'+esc(c.main.nom)+'</b> '+(c.main.fn==='repos'?'':'<span class="chip chip-blue">'+extraDuree(c.main)+'</span>')
    +'<div class="tiny mut mt">'+prev+'</div><div class="flex mt">'+mainBtn+'</div></div>'
    +'<div class="tiny mut mt">Séance imposée par le coach : aucune option, on exécute. 💪 La séance enregistrée cochera ce jour dans la semaine.</div>');
}

/* ============================================================
   V6 — EXTRAS VISIBLES DANS « MES SEMAINES & CHARGES ENREGISTRÉES »
   ============================================================ */
function extrasDuJour(dd){
  V2S();
  const out=[];
  const push=(fam,ic)=>{ ((state[fam]&&state[fam].seances)||[]).forEach(s=>{ if(s.d===dd) out.push({ic:ic, txt:(s.proto||fam)+(s.duree?' · '+s.duree+' min':''), rpe:s.rpe}); }); };
  push('natation','🏊'); push('cardio','⚡'); push('tabata','🔥');
  return out;
}
function extrasHtml(dd){
  const r=extrasDuJour(dd);
  if(!r.length) return '';
  return '<div class="small mt">'+r.map(e=>e.ic+' <b>'+esc(e.txt)+'</b>'+(e.rpe!==''&&e.rpe!=null?' · RPE '+e.rpe:'')).join('<br>')+'</div>';
}

/* ============================================================
   V7 — SÉANCE IMPOSÉE : METCON elliptique + piscine (coach)
   ============================================================ */
function _poolKey(proto){
  const p=norm(proto||'');
  if(p.indexOf('tabata')>=0) return 'aquatabata';
  if(p.indexOf('hiit')>=0) return 'aquahiit';
  if(p.indexOf('interval')>=0) return 'interval';
  if(p.indexOf('sprint')>=0) return 'sprint';
  if(p.indexOf('endurance')>=0) return 'endurance';
  if(p.indexOf('recovery')>=0) return 'recovery';
  return '';
}
function poolStepsOf(pid, lvl){
  const pr=POOL_PROTOS.find(p=>p.id===pid); const nv=pr&&pr.niveaux[lvl||0];
  return (nv&&nv.steps)||[];
}
function comboSteps(run){
  const tp=CARDIO_TYPES.find(x=>x.id===run.cardio.id)||CARDIO_TYPES[0];
  const s1=_cardioSteps(tp,run.cardio.min).map(s=>['🚴 '+s[0],s[1]]);
  const s2=poolStepsOf(run.pool.id, run.pool.lvl||0).map(s=>['🏊 '+s[0],s[1]]);
  return s1.concat([['🔄 Transition — boire, rejoindre la piscine',300]],s2);
}
function startCombo(date){
  const c=coachExtra(date||todayKey());
  const run=c.main;
  if(!run||run.fn!=='combo') return;
  const tp=CARDIO_TYPES.find(x=>x.id===run.cardio.id)||CARDIO_TYPES[0];
  const secs2=poolStepsOf(run.pool.id, run.pool.lvl||0).reduce((a,s)=>a+s[1],0);
  const pr=POOL_PROTOS.find(p=>p.id===run.pool.id); const nv=pr&&pr.niveaux[run.pool.lvl||0];
  _runSteps('cardio','🚴🏊 METCON + Piscine (imposé)', run.nom, comboSteps(run), {label:'METCON Elliptique — '+tp.nom+' '+run.cardio.min+' min', niv:'', combo:{kind2:'pool', label2:run.pool.nom, niv2:(nv&&nv.n)||'', duree2:Math.max(1,Math.round(secs2/60)), secs2:secs2}});
}

/* ============================================================
   V9 — BLOC 2 : phrase explicative (le minuteur détaille déjà)
   ============================================================ */
function poolSummaryHtml(pid, lvl){
  const pr=POOL_PROTOS.find(p=>p.id===pid); if(!pr) return '';
  const nv=pr.niveaux[lvl||0]||pr.niveaux[0]; if(!nv) return '';
  const steps=nv.steps||[];
  return '<div class="tiny mt" style="background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:10px;padding:8px 10px;line-height:1.7;text-align:left">'
    +'🏊 '+esc(pr.desc||pr.nom)+(nv.conseil?'<br>💡 <b>'+esc(nv.conseil)+'</b>':'')
    +'<br><span class="mut">Bloc piscine : '+_fmtDur(_protoDur(steps))+' · le minuteur vous guidera étape par étape.</span></div>'+poolPhaseHtml(pid, lvl||0);
}

/* ============================================================
   V10 — BLOC 2 : phases compactes avec ACTIONS explicites
   ============================================================ */
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

/* ============================================================
   V11 — ROTATION : le coach varie les protocoles à chaque séance
   ============================================================ */
let _SEQ_CACHE={key:'',map:{}};
function extraSeq(date){
  try{
    if(typeof startDate!=='function') throw 0;
    const ck=(startDate()||'')+'|'+((state.profil&&state.profil.seancesSemaine)||'')+'|'+poolDays().slice().sort().join(',');
    if(_SEQ_CACHE.key!==ck) _SEQ_CACHE={key:ck,map:{}};
    if(_SEQ_CACHE.map[date]!=null) return _SEQ_CACHE.map[date];
    let n=0;
    const d0=parseDate(startDate()), d1=parseDate(date);
    for(let d=new Date(d0.getTime()); d<=d1; d=addDays(d,1)){
      const k=dateKey(d);
      if(_SEQ_CACHE.map[k]!=null){ n=_SEQ_CACHE.map[k]; continue; }
      const pl=weekPlan(k).find(p=>p.date===k);
      if(pl&&(pl.type==='metcon'||pl.type==='piscine')) n++;
      _SEQ_CACHE.map[k]=n;
    }
    return n;
  }catch(_){
    try{ return Math.floor(parseDate(date).getTime()/86400000); }catch(_2){ return 0; }
  }
}

/* ============================================================
   V12 — GUIDES PISCINE : bouton « Comment faire » (❓)
   ============================================================ */
const POOL_GUIDES=[
 {k:['pompes au bord'],t:'Pompes au bord',img:'data:image/gif;base64,[BINARY_ASSET_4ca1a1caeb35: 144784 characters]',h:['Face au bord, <b>mains sur la margelle</b>, largeur épaules','Corps <b>incliné et aligné</b> dans l\'eau, jambes tendues derrière','<b>Pliez les coudes</b> (poitrine vers le bord), puis poussez','💡 Soufflez en poussant — l\'eau porte une partie du poids.']},
 {k:['gainage'],t:'Gainage au bord (vertical)',img:'data:image/jpeg;base64,[BINARY_ASSET_6132ec851022: 15372 characters]',h:['Face au bord, eau à hauteur de poitrine','<b>Mains sur la margelle</b>, bras tendus','Jambes tendues vers le fond, <b>abdos + fessiers contractés</b>','💡 Tenez sans bouger, dos droit, respiration régulière.']},
 {k:['mobilite epaules'],t:'Mobilité épaules aquatique',img:'data:image/jpeg;base64,[BINARY_ASSET_7a4676dc0083: 10152 characters]',h:['Debout dans l\'eau, mouvements <b>lents et amples</b>','<b>Cercles de bras</b> : petits puis grands, avant puis arrière','<b>Montées de bras</b> devant jusqu\'au-dessus de la tête','💡 La résistance douce de l\'eau renforce en douceur.']},
 {k:['mobilite hanches','chevilles'],t:'Mobilité hanches / chevilles',img:'data:image/jpeg;base64,[BINARY_ASSET_6cc03b0d2dfe: 18556 characters]',h:['<b>Hanches</b> (une main au bord) : jambe tendue, <b>balancez</b> avant/arrière puis latéral','<b>Genou levé</b> : dessinez des cercles dans l\'eau','<b>Chevilles</b> : montées sur <b>pointes puis talons</b>, cercles du pied','💡 Lent et contrôlé, sans douleur.']},
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
 {k:['ciseaux'],t:'Ciseaux au bord',img:'data:image/jpeg;base64,[BINARY_ASSET_7d235b9dd114: 13792 characters]',h:['<b>Mains au bord</b>, corps allongé dans l\'eau','Jambes tendues : <b>ouvrez-fermez</b> rapidement (ciseaux)','Petite amplitude, rythme rapide','💡 Abdos serrés, ne cambrez pas.']},
 {k:['deplacements lateraux'],t:'Déplacements latéraux (4 m)',h:['En <b>pas chassés</b>, traversez le bassin dans la largeur (4 m)','Restez <b>fléchi</b> (demi-squat), buste droit','Touchez le bord, repartez dans l\'autre sens','💡 Poussez fort sur les jambes, gainez le buste.']},
 {k:['talons-fesses'],t:'Talons-fesses',img:'data:image/jpeg;base64,[BINARY_ASSET_2b1d32897f5f: 13400 characters]',h:['Sur place, <b>joggez en ramenant les talons aux fesses</b>','Buste droit, bras qui accompagnent','Rythme rapide pendant l\'effort','💡 Échauffez bien les genoux avant (marche + battements).']}
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
    if(P.kind==='pool') return qBtn(nm);
    if(P.meta&&P.meta.combo&&nm.indexOf('🏊')===0) return qBtn(nm);
    return '';
  }catch(_){ return ''; }
}
/* V17 — VISUELS MUSCU (vague 1 : top fréquence) */
const MUSCU_GUIDES={
'back squat barre haute':{img:'data:image/gif;base64,[BINARY_ASSET_a1b63bbf4c58: 223452 characters]',tip:'💡 Poitrine haute, genoux dans l\'axe des pieds.'},
'tractions (pull-up)':{img:'data:image/gif;base64,[BINARY_ASSET_8b7a576ae670: 322492 characters]',tip:'💡 Pars bras tendus, menton au-dessus de la barre.'},
'developpe incline barre':{img:'data:image/gif;base64,[BINARY_ASSET_7a20f0c2c1f5: 220312 characters]',tip:'💡 Barre à la poitrine, omoplates serrées.'},
'leg curl allonge':{img:'data:image/gif;base64,[BINARY_ASSET_03656913707e: 222700 characters]',tip:'💡 Monte jusqu\'à 90°, hanches collées au banc.'},
'leg press':{img:'data:image/gif;base64,[BINARY_ASSET_44c809c5374f: 171368 characters]',tip:'💡 Descends à 90°, dos plaqué au dossier.'},
'mollets debout':{img:'data:image/gif;base64,[BINARY_ASSET_0b33850d5f4e: 317740 characters]',tip:'💡 Monte haut sur la pointe, pause 1 s en haut.'},
'front squat':{img:'data:image/gif;base64,[BINARY_ASSET_93d53600360b: 213652 characters]',tip:'💡 Coudes hauts, buste vertical.'},
'hack squat':{img:'data:image/gif;base64,[BINARY_ASSET_63d21c6c4cb4: 187304 characters]',tip:'💡 Dos plaqué, descends à 90°.'},
'rowing barre ez supination, buste penche':{img:'data:image/gif;base64,[BINARY_ASSET_da8e8a1c82d2: 148984 characters]',tip:'💡 Dos plat, tire la barre vers le nombril.'},
'rowing haltere un bras':{img:'data:image/gif;base64,[BINARY_ASSET_22b7b3f8a6d2: 153384 characters]',tip:'💡 Dos plat, coude vers le ciel.'},
'triceps dips':{img:'data:image/gif;base64,[BINARY_ASSET_7965ff21dfcf: 322900 characters]',tip:'💡 Descends à 90°, buste droit.'},
'developpe militaire debout':{img:'data:image/gif;base64,[BINARY_ASSET_f4279588c296: 159812 characters]',tip:'💡 Gaine les abdos, verrouille en haut.'},
'french press barre ez':{img:'data:image/gif;base64,[BINARY_ASSET_c19f4132260b: 156652 characters]',tip:'💡 Coudes fixes, barre vers le front.'},
'souleve de terre roumain barre':{img:'data:image/gif;base64,[BINARY_ASSET_23dc351049d5: 143008 characters]',tip:'💡 Dos plat, pousse les hanches en arrière.'},
'tractions prise neutre (chin-up)':{img:'data:image/gif;base64,[BINARY_ASSET_ab61b324ccab: 232052 characters]',tip:'💡 Pars bras tendus, menton au-dessus.'},
'developpe halteres decline, prise neutre':{img:'data:image/gif;base64,[BINARY_ASSET_547df0b6075a: 64268 characters]',tip:'💡 Haltères à la poitrine, pousse vers le haut.'},
'rowing haltere un bras, coude ouvert':{img:'data:image/gif;base64,[BINARY_ASSET_f1e030ca95c3: 162604 characters]',tip:'💡 Coude ouvert sur le côté, omoplate serrée.'},
'souleve de terre':{img:'data:image/gif;base64,[BINARY_ASSET_f14b3625cb1f: 304688 characters]',tip:'💡 Dos plat, barre contre les tibias.'},
'developpe halteres plat':{img:'data:image/gif;base64,[BINARY_ASSET_52529ff80d03: 171492 characters]',tip:'💡 Haltères à la poitrine, omoplates serrées.'},
'curl halteres incline':{img:'data:image/gif;base64,[BINARY_ASSET_3cc2e5f427a1: 139544 characters]',tip:'💡 Coudes fixes, ne balance pas le buste.'},
'back squat':{ref:'back squat barre haute',tip:'💡 Poitrine haute, genoux dans l\'axe des pieds.'},
'souleve de terre roumain halteres':{img:'data:image/gif;base64,[BINARY_ASSET_7e261f1226cb: 129356 characters]',tip:'💡 Dos plat, haltères contre les cuisses.'},
'back extension horizontal':{img:'data:image/gif;base64,[BINARY_ASSET_dfd5b885b8eb: 176352 characters]',tip:'💡 Monte à l\'horizontale, sans cambrer.'},
'rowing barre buste penche, pronation':{img:'data:image/gif;base64,[BINARY_ASSET_98081f1ce34f: 174612 characters]',tip:'💡 Dos plat, tire la barre vers le nombril.'},
'rowing assis, prise neutre':{img:'data:image/gif;base64,[BINARY_ASSET_06b34a5cc515: 137540 characters]',tip:'💡 Buste droit, tire la poignée vers le ventre.'},
'mollets unilateraux':{img:'data:image/gif;base64,[BINARY_ASSET_7d8b7609677a: 146532 characters]',tip:'💡 Monte haut, pause 1 s en haut.'},
'jackknife sur swiss ball':{img:'data:image/gif;base64,[BINARY_ASSET_7526c0217cb1: 137668 characters]',tip:'💡 Roule le ballon, gaine les abdos.'},
'developpe couche barre plat':{img:'data:image/gif;base64,[BINARY_ASSET_bda979f5fecf: 156164 characters]',tip:'💡 Barre à la poitrine, omoplates serrées.'},
'tractions supination (chin-up)':{img:'data:image/gif;base64,[BINARY_ASSET_b65d1fe38051: 229336 characters]',tip:'💡 Pars bras tendus, menton au-dessus de la barre.'},
'releves de jambes suspendu':{img:'data:image/gif;base64,[BINARY_ASSET_030d055cb378: 166056 characters]',tip:'💡 Monte les jambes à 90°, sans balancer.'},
'developpe halteres incline':{img:'data:image/gif;base64,[BINARY_ASSET_387ccebdb9aa: 248004 characters]',tip:'💡 Haltères à la poitrine, pousse vers le haut.'},
'elevations laterales':{img:'data:image/gif;base64,[BINARY_ASSET_546dae976d3e: 140436 characters]',tip:'💡 Monte à hauteur d\'épaules, sans balancer.'},
'crunch a la poulie':{img:'data:image/gif;base64,[BINARY_ASSET_881aff1a404b: 130760 characters]',tip:'💡 Enroule le buste, menton vers la poitrine.'},
'french press poulie basse':{img:'data:image/gif;base64,[BINARY_ASSET_e979dfd3bf34: 292868 characters]',tip:'💡 Coudes fixes, mains derrière la tête.'},
'curl marteau assis':{img:'data:image/gif;base64,[BINARY_ASSET_ab2b86848fa7: 172648 characters]',tip:'💡 Coudes fixes, prise neutre.'},
'mollets assis':{img:'data:image/gif;base64,[BINARY_ASSET_2fbc534522fc: 163312 characters]',tip:'💡 Monte haut, pause 1 s en haut.'},
'elevations laterales assises (variante)':{ref:'elevations laterales',tip:'💡 Monte à hauteur d\'épaules, sans balancer.'},
'developpe halteres plat, prise neutre':{img:'data:image/gif;base64,[BINARY_ASSET_5247fa49a912: 162416 characters]',tip:'💡 Haltères à la poitrine, paumes face à face.'},
'ecartes halteres decline':{img:'data:image/gif;base64,[BINARY_ASSET_88574f1e9e02: 107872 characters]',tip:'💡 Ouvre large, coudes légèrement fléchis.'},
'tirage vertical prise pronation':{img:'data:image/gif;base64,[BINARY_ASSET_91833afbd0b8: 160568 characters]',tip:'💡 Tire la barre à la poitrine, buste droit.'},
'developpe halteres incline 30°':{img:'data:image/gif;base64,[BINARY_ASSET_95e3956c2771: 186492 characters]',tip:'💡 Haltères à la poitrine, pousse vers le haut.'},
'leg curl debout':{img:'data:image/gif;base64,[BINARY_ASSET_7c3bcac646bc: 134556 characters]',tip:'💡 Monte le talon à 90°, sans balancer.'},
'extensions triceps barre ez':{img:'data:image/gif;base64,[BINARY_ASSET_af94f71b70eb: 172764 characters]',tip:'💡 Coudes fixes, barre derrière la tête.'},
'step-up haut':{img:'data:image/gif;base64,[BINARY_ASSET_8bd37f4b3cc3: 162216 characters]',tip:'💡 Pousse sur la jambe haute, sans élan.'},
'cables croises':{img:'data:image/gif;base64,[BINARY_ASSET_004931a5fccb: 117804 characters]',tip:'💡 Ouvre large, serre devant la poitrine.'},
'curl barre debout':{img:'data:image/gif;base64,[BINARY_ASSET_b069c8808b4f: 182292 characters]',tip:'💡 Coudes fixes, ne balance pas le buste.'},
'developpe halteres assis':{img:'data:image/jpeg;base64,[BINARY_ASSET_b7a158bd5b4e: 32048 characters]',tip:'💡 Dos calé, verrouille en haut.'},
'dips':{ref:'triceps dips',tip:'💡 Descends à 90°, buste droit.'},
'leg curl allonge, 1 1/4 en haut':{ref:'leg curl allonge',tip:'💡 Monte, quart de descente, remonte.'}
};
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

/* ============================================================
   V14 — ENREGISTREMENT MANUEL : séance faite sans chrono
   ============================================================ */
function logExtraManu(date){
  const c=coachExtra(date||todayKey());
  const run=c.main;
  if(!run) return;
  V2S();
  const d=date||todayKey();
  const mark=()=>{ try{ const _j=state.journal[d]||{exos:[]}; _j.statut='ok'; state.journal[d]=_j; state.seances[d]='ok'; }catch(_){} };
  if(run.fn==='repos'){ mark(); }
  else if(run.fn==='pool'){
    const pr=POOL_PROTOS.find(p=>p.id===run.id); const nv=pr&&pr.niveaux[run.lvl||0];
    const secs=((nv&&nv.steps)||[]).reduce((a,s)=>a+s[1],0);
    state.natation.seances.push({d:d, proto:run.nom, niv:(nv&&nv.n)||'', duree:Math.max(1,Math.round(secs/60)), secs:secs, rpe:'', note:'Enregistré sans chrono'});
    mark();
  }
  else if(run.fn==='combo'){
    const tp=CARDIO_TYPES.find(x=>x.id===run.cardio.id)||CARDIO_TYPES[0];
    state.cardio.seances.push({d:d, proto:'METCON Elliptique — '+tp.nom+' '+run.cardio.min+' min', niv:'', duree:run.cardio.min, secs:run.cardio.min*60, rpe:'', note:'Enregistré sans chrono'});
    const pr=POOL_PROTOS.find(p=>p.id===run.pool.id); const nv=pr&&pr.niveaux[run.pool.lvl||0];
    const secs=((nv&&nv.steps)||[]).reduce((a,s)=>a+s[1],0);
    state.natation.seances.push({d:d, proto:run.pool.nom, niv:(nv&&nv.n)||'', duree:Math.max(1,Math.round(secs/60)), secs:secs, rpe:'', note:'Enregistré sans chrono'});
    mark();
  }
  else {
    const steps=extraSteps(run);
    const secs=steps.reduce((a,s)=>a+s[1],0);
    const fam=run.fn==='tabata'?'tabata':'cardio';
    state[fam].seances.push({d:d, proto:run.nom, niv:'', duree:Math.max(1,Math.round(secs/60)), secs:secs, rpe:'', note:'Enregistré sans chrono'});
    mark();
  }
  try{ save(); checkBadges(); }catch(_){}
  try{ closeModal(); }catch(_){}
  try{ toast('Séance enregistrée'); }catch(_){}
  try{ renderCurrent(); }catch(_){}
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
    if(!asHistoryShown){ asHistoryShown=true; asSay("Système en ligne. Bonjour, je suis ATHLETE, votre assistant personnel. Parlez-moi au micro ou par écrit. Essayez : briefing, séance du jour, piscine, démo squat, analyse ma semaine."); }
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
    return {reply:"Voici ce que je sais faire : « ma séance du jour », « mon poids actuel », « mes calories », « le repas du jour », « ma récupération », « mes records », « mes mensurations », « mon objectif », « les conseils de l'équipe », « mon bilan de la semaine », « comment m'échauffer », « piscine », « tabata », « montre la démo [exercice] », « analyse ma semaine ». Je peux aussi naviguer (« ouvre la nutrition ») et enregistrer (« enregistre mon poids 78,5 »)."};
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



  /* ---------- Calories / nutrition / repas ---------- */
  if(t.includes('calorie')||t.includes('macro')||t.includes('proteine')||t.includes('glucide')||t.includes('lipide')||t.includes('nutrition')||t.includes('repas')||t.includes('manger')||t.includes('aliment')||t.includes('combien de kcal')){
    const c=caloriesCibles();
    if(!c) return {reply:"Complétez d'abord votre bilan de départ (onglet Profil) pour que la nutritionniste calcule vos besoins."};
    const pos=programPos(todayKey());
    const mois=(pos.idx==='F'?13:+pos.idx)||1;
    const jourIdx=parseInt(todayKey().slice(-2),10)||1;
    const gp=genererPlanJour(mois,jourIdx);
    let repas='';
    if(gp){
      const pd=gp.plan.find(m=>/Petit-déjeuner/.test(m.nom));
      const dj=gp.plan.find(m=>/Déjeuner/.test(m.nom));
      repas=". Aujourd'hui, par exemple : "+(pd&&pd.rows.length?pd.rows.map(r=>r.nom).join(', '):'petit-déjeuner varié')+" au petit-déjeuner, et "+(dj&&dj.rows.length?dj.rows.map(r=>r.nom).join(', '):'déjeuner équilibré')+" au déjeuner.";
    }
    return {reply:"La nutritionniste : vos besoins sont de "+c.cal+" kcal par jour, dont "+c.prot+" g de protéines, "+c.glu+" g de glucides et "+c.lip+" g de lipides. Stratégie actuelle : "+nutriPhaseInfo().n+repas+" Le plan complet est dans l'onglet Repas."};
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
    if(td&&td.type==='metcon'){
      return {reply:"Aujourd'hui, c'est cardio METCON : "+(PROGRAM[pos.mois]?PROGRAM[pos.mois].metcon.split('— ')[1]||PROGRAM[pos.mois].metcon:'—')+". Une séance de conditionnement sans compromettre la récupération."};
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
      txt+="Votre bilan 1RM déclaré : couché "+fmtKg(f.bench||'—')+", squat "+fmtKg(f.squat||'—')+", soulevé de terre "+fmtKg(f.dead||'—')+". "+(forceReevalDue()?"La réévaluation 1RM est recommandée : vos charges seront recalculées.":"Prochaine réévaluation conseillée : "+fmtDateFr(nextReevalDate())+".");
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

  /* ---------- ATHLETE OS V2 : piscine ---------- */
  if(t.includes('piscine')||t.includes('nage')||t.includes('natation')||t.includes('pool')||t.includes('aqua')){
    V2S();
    const n=state.natation.seances.length, mins=state.natation.seances.reduce((a,s)=>a+(+s.duree||0),0);
    return {reply:"🏊 Pool Lab (bassin 8,5×4 m, 100 % base temps) : Swim Endurance, Swim Interval, Swim Sprint, Aqua HIIT, Aqua Recovery et Aqua Tabata, chacun en 3 niveaux, avec minuteur guidé. Vous avez "+n+" séance(s) ("+mins+" min cumulées). J'ouvre la piscine.", act:()=>go('v-piscine')};
  }
  /* ---------- V2 : tabata / cardio ---------- */
  if(t.includes('tabata')){
    V2S();
    return {reply:"⚡ Tabata System : 20 secondes d'effort, 10 secondes de repos, 8 exercices, 6 modes (Full, Upper, Lower, Core, Cardio, Low Impact) + l\'Aqua Tabata en piscine. "+state.tabata.seances.length+" tabata(s) enregistré(s). J'ouvre le module.", act:()=>go('v-cardio')};
  }
  if(t.includes('cardio')&&!t.includes('piscine')){
    V2S();
    return {reply:"🫀 Cardio : endurance, intervalles, HIIT ou récupération active, de 10 à 60 minutes, avec minuteur guidé. "+state.cardio.seances.length+" séance(s) enregistrée(s). J'ouvre le module.", act:()=>go('v-cardio')};
  }
  /* ---------- V2 : démo d'exercice ---------- */
  if(t.includes('demo')||t.includes('demonstration')||t.includes('montre')||t.includes('visualiser')){
    const q=String(bas||'').toLowerCase().replace(/(montre|montrez|voir|visualiser|la|le|les|une|de|du|des|d'|l'|démo|demo|démonstration|demonstration|exercice|stp|me|\?)/g,' ').replace(/\s+/g,' ').trim();
    if(q&&q.length>=3&&openDemoByName(q)) return {reply:"🎬 Voici la démo : mouvement animé, muscles sollicités, tempo et respiration."};
    return {reply:"🎬 Dites par exemple : « montre la démo développé couché » ou « démo squat ». Chaque exercice du programme et chaque étirement a aussi son bouton ▶ Démo."};
  }
  /* ---------- V2 : minuteur de repos ---------- */
  if((t.includes('repos')||t.includes('chrono')||t.includes('minuteur')||t.includes('timer'))&&(t.includes('lance')||t.includes('demarre')||t.includes('part')||nums.length)){
    const s=nums.length?Math.round(nums[0]):90;
    startRestTimer(Math.min(600,Math.max(10,s)));
    return {reply:"⏱ Minuteur de repos lancé : "+Math.min(600,Math.max(10,s))+" secondes. Je vous préviens à la fin."};
  }
  if(t.includes('lance')&&t.includes('recup')){
    return {reply:"🧘 Je vous emmène vers la récupération : check-in du jour, score et protocole retour au calme.", act:()=>go('v-recuperation')};
  }
  /* ---------- V2 : analyse de la semaine ---------- */
  if(t.includes('analyse')&&t.includes('semaine')){
    V2S();
    const ds=[]; for(let i=6;i>=0;i--) ds.push(dateKey(addDays(new Date(),-i)));
    const nb=ds.filter(d=>state.journal[d]&&state.journal[d].exos&&state.journal[d].exos.length).length;
    const pl=state.natation.seances.filter(s=>ds.indexOf(s.d)>=0).length, cb=state.cardio.seances.filter(s=>ds.indexOf(s.d)>=0).length, tb=state.tabata.seances.filter(s=>ds.indexOf(s.d)>=0).length;
    const rm=moyenneRecup();
    return {reply:"📊 Vos 7 derniers jours : "+nb+" séance(s) musculation, "+pl+" piscine, "+cb+" cardio, "+tb+" tabata. Récupération moyenne : "+(rm==null?'non renseignée':rm+'/100')+". "+(nb>=3?"Bonne assiduité, continuez.":"Sous les 3 séances : priorisez la constance cette semaine.")};
  }
  /* ---------- V2 : pourquoi la charge baisse ---------- */
  if(t.includes('charge')&&(t.includes('baisse')||t.includes('baisser')||t.includes('diminue')||t.includes('pourquoi')||t.includes('faible'))){
    const ds=Object.keys(state.journal).sort().slice(-3);
    let rpes=[];
    ds.forEach(d=>{(state.journal[d].exos||[]).forEach(e=>{if(e.rpe) rpes.push(+e.rpe);});});
    const moy=rpes.length?(rpes.reduce((a,b)=>a+b,0)/rpes.length):null;
    const sc=recupScore(state.recup[todayKey()]);
    let why="Le coach gèle ou allège une charge quand : les reps cibles ne sont pas atteintes, le RPE grimpe à 9-10, ou la récupération chute.";
    if(moy!=null&&moy>=8.5) why+=" Vos RPE récents sont élevés ("+round1(moy)+"/10 en moyenne) : terminez d'abord vos fourchettes à charge égale, la charge remontera ensuite (+2,5 %).";
    else if(sc!=null&&sc<60) why+=" Votre récupération du jour est à "+sc+"/100 : dormez et récupérez, la charge suivra.";
    else why+=" Vos RPE ("+(moy==null?'non renseignés':round1(moy)+'/10')+") et votre récup ("+(sc==null?'—':sc+'/100')+") semblent corrects : vérifiez le sommeil et la nutrition, puis forcez la progression en répétitions.";
    return {reply:"🔍 "+why};
  }
  /* ---------- V2 : prépare demain ---------- */
  if(t.includes('demain')||t.includes('prepar')){
    const dm=dateKey(addDays(new Date(),1));
    const pl=weekPlan(dm).find(p=>p.date===dm);
    if(!pl||!pl.key) return {reply:"😴 Demain ("+fmtDateFr(dm)+") : repos prévu. Marche douce, mobilité, bon sommeil."};
    if(pl.type==='seance') return {reply:"🗓️ Demain ("+fmtDateFr(dm)+") : "+pl.label+". Préparez votre sac, dormez 7-9 h.", act:()=>{}};
    return {reply:"🗓️ Demain ("+fmtDateFr(dm)+") : "+pl.label+".", act:()=>{}};
  }
  /* ---------- V2 : séance courte ---------- */
  if(t.includes('minute')&&nums.length){
    const m=Math.round(nums[0]);
    if(m<=25) return {reply:"⏱ Séance express "+m+" min : échauffement 3 min, puis 3 exercices polyarticulaires de la séance du jour en supersets, 2 séries chacun, repos 60 s. J'ouvre la séance, cochez au fur et à mesure.", act:()=>openSession(todayKey())};
    return {reply:"⏱ Séance "+m+" min : faites la séance du jour en réduisant à 2-3 séries par exercice et 60-90 s de repos. J'ouvre la séance.", act:()=>openSession(todayKey())};
  }
  /* ---------- V2 : machine occupée ---------- */
  if((t.includes('machine')&&t.includes('occupe'))||(t.includes('remplace')&&t.includes('exercice'))){
    const tk=todayKey(); const today=weekPlan(tk).find(p=>p.date===tk);
    const s=today&&today.session;
    if(s&&s.exos&&s.exos[0]){
      const e0=s.exos[0]; const grp=((MUSCLES[e0[1]]||{}).n||e0[1]);
      return {reply:"🔄 Pas de souci : remplacez « "+e0[0]+" » par un exercice du même groupe ("+grp+") disponible — mêmes séries × reps, notez-le en commentaire. Dites « montre la démo » + nom pour vérifier le mouvement."};
    }
    return {reply:"🔄 Remplacez l'exercice indisponible par un mouvement du même groupe musculaire, mêmes séries et reps."};
  }
  /* ---------- V5 : conseil du coach ---------- */
  if(t.includes('coach')&&(t.includes('conseil')||t.includes('propose')||t.includes('impose')||t.includes('extra')||t.includes('metcon')||t.includes('aujourd')||t.includes('seance'))){
    return {reply:"🧠 Le coach a imposé votre séance du jour : METCON sur elliptique + exercices en piscine. On exécute. 💪", act:()=>openExtra(todayKey())};
  }
  /* ---------- Réponse générique ---------- */
  return {reply:"Je n'ai pas bien compris. Dites-moi « aide » pour voir tout ce que je sais faire, ou essayez : « quelle est ma séance du jour ? », « mes calories ? », « mon poids actuel ? », « mes records ? », « les conseils de l'équipe ? »."};
}

/* ---------- Chips de suggestions ---------- */
function asInit(){
  const chips=$('#as-chips');
  if(chips){
    const ex=["Quelle est ma séance du jour ?","Combien de calories aujourd'hui ?","Mon poids actuel ?","Mes records ?","Conseils de l'équipe ?","Mon bilan de la semaine ?","Comment m'échauffer ?","Piscine","Tabata","Analyse ma semaine ?","Coach : séance du jour ?","Aide"];
    chips.innerHTML=ex.map(c=>'<button class="as-chip" onclick="asChip(\''+c.replace(/'/g,"\\'")+'\')">'+esc(c)+'</button>').join('');
  }
  const st=$('#as-status');
  if(st) st.textContent = speechSupported()? "● ONLINE" : "● ONLINE (texte)";
}
function asChip(txt){
  const inp=$('#as-text'); if(inp){ inp.value=txt; }
  asEnvoyerTexte();
}
document.addEventListener('DOMContentLoaded', asInit);

/* ===== PHOTOS EMBARQUÉES (Jour 0 + Simulation Mois 12) ===== */
const EMBEDDED_PHOTOS = {"j0": {"face": "[BINARY_BASE64: 72024 chars]", "profil": "[BINARY_BASE64: 79996 chars]", "dos": "[BINARY_BASE64: 65888 chars]", "compl": "[BINARY_BASE64: 74400 chars]"}, "m12": {"face": "[BINARY_BASE64: 69788 chars]", "profil": "[BINARY_BASE64: 77744 chars]", "dos": "[BINARY_BASE64: 50440 chars]", "compl": "[BINARY_BASE64: 74100 chars]"}};
