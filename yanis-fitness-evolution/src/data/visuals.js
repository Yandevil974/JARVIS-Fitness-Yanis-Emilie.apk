// Visuels de séances (portés depuis la version 1.5.0 d'origine, puis audités) :
// illustrations « bord de bassin », étirements guidés, échauffements et étapes
// cardio. Chaque étape affiche le visuel de SON domaine (pas de vélo dans une
// étape piscine, pas de piscine dans une étape elliptique).
export const STRETCH_IMAGES = {
  "Étirement dans l'encadrement de porte": "/media/stretch-pec-porte.jpg",
  "Bras tendu contre le mur": "/media/stretch-pec-mur.jpg",
  "Position de l'enfant (Balasana)": "/media/stretch-dos-enfant.jpg",
  "Position de l'enfant": "/media/stretch-dos-enfant.jpg",
  "Suspension à la barre": "/media/stretch-dos-suspension.jpg",
  "Torsion allongée": "/media/stretch-torsion-allongee.jpg",
  "Torsion allongée genoux": "/media/stretch-torsion-allongee.jpg",
  "Mains croisées derrière le dos": "/media/stretch-ep-arriere.jpg",
  "Bras tendu contre la poitrine": "/media/stretch-ep-lateral.jpg",
  "Bras tendu devant, main tirée": "/media/stretch-ep-posterieur.jpg",
  "Bras tendu derrière": "/media/stretch-biceps.jpg",
  "Coude au-dessus de la tête": "/media/stretch-triceps-coude.jpg",
  "Main dans le dos": "/media/stretch-triceps-dos.jpg",
  "Étirement des fléchisseurs": "/media/stretch-avb-flechisseurs.jpg",
  "Étirement des extenseurs": "/media/stretch-avb-extenseurs.jpg",
  "Étirement du cobra": "/media/stretch-cobra.jpg",
  "Cobra doux": "/media/stretch-cobra.jpg",
  "Pigeon assis": "/media/stretch-pigeon.jpg",
  "Étirement du piriforme assis": "/media/stretch-piriforme.jpg",
  "Talon vers la fesse (debout)": "/media/stretch-quad-debout.jpg",
  "Allongé sur le côté": "/media/stretch-quad-cote.jpg",
  "Flexion avant jambes tendues": "/media/stretch-isc-flexion.jpg",
  "Une jambe tendue, une pliée": "/media/stretch-isc-une-jambe.jpg",
  "Grenouille (plantes jointes)": "/media/stretch-grenouille.jpg",
  "Étirement contre le mur": "/media/stretch-mollet-mur.jpg",
  "Adduction de la hanche debout": "/media/stretch-adduction-debout.jpg",
  "Étirement du fléchisseur de hanche (chevalier)":
    "/media/stretch-flechisseur-hanche.jpg",
  "Respiration diaphragmatique allongée": "/media/stretch-respiration.jpg",
  "Mollet en escalier": "/media/stretch-mollet-marche.jpg",
};
export const POOL_STEP_IMAGES = {
  "Étirements au bord": "/media/pool-etirements-bord.jpg",
  "Nage statique (à l'élastique)": "/media/pool-nage-statique.jpg",
  "Nage douce": "/media/pool-nage-douce.jpg",
  "Marche aquatique": "/media/pool-marche-aquatique.jpg",
  "Fractionné — nager": "/media/pool-fractionne.jpg",
  "Sprint — nager à fond": "/media/pool-sprint.jpg",
  "Récup complète — souffler": "/media/pool-recup-complete.jpg",
  "Récup entre tabatas": "/media/pool-recup-tabata.jpg",
  "Retour au calme": "/media/pool-retour-calme.jpg",
  "Déplacements latéraux (4 m)": "/media/pool-deplacements-lateraux.jpg",
};
export const WARMUP_IMAGES = {
  route: "/media/warmup-cardio.jpg",
  mobilite: "/media/warmup-mobilite.jpg",
  approche: "/media/warmup-series-approche.jpg",
};
export const CARDIO_STEPS = [
  {
    k: ["echauffement elliptique", "elliptique"],
    t: "Elliptique — mise en route",
    img: "/media/cardio-elliptique.jpg",
    h: [
      "Buste droit, épaules basses, regard devant.",
      "Pieds à plat sur les pédales, appui réparti sur tout le pied.",
      "Poussez et tirez les bras : le haut du corps travaille aussi.",
      "Allure facile : vous devez pouvoir tenir une conversation.",
    ],
  },
  {
    k: ["fractionne soutenu", "fractionne"],
    t: "Elliptique — fractionné",
    img: "/media/cardio-elliptique.jpg",
    h: [
      "Augmentez la cadence sans casser la posture.",
      "Poussez fort sur les jambes, tirez franchement sur les bras.",
      "Respiration ample : inspirez par le nez, soufflez par la bouche.",
      "L'effort doit être difficile mais maîtrisé jusqu'à la fin.",
    ],
  },
  {
    k: ["recuperation active", "recup active"],
    t: "Elliptique — récupération active",
    img: "/media/cardio-recup-active.jpg",
    h: [
      "Ralentissez franchement, laissez le rythme cardiaque redescendre.",
      "Relâchez les épaules et les bras, restez en mouvement.",
      "Ne vous arrêtez pas net : la reprise en serait plus dure.",
      "Profitez-en pour boire une gorgée.",
    ],
  },
  {
    k: ["retour au calme elliptique"],
    t: "Elliptique — retour au calme",
    img: "/media/cardio-recup-active.jpg",
    h: [
      "Allure très facile, mouvement fluide.",
      "Diminuez progressivement jusqu'à l'arrêt.",
      "Respirez profondément, relâchez tout le haut du corps.",
      "Hydratez-vous : la récupération commence maintenant.",
    ],
  },
  {
    k: ["transition"],
    t: "Transition",
    img: "/media/cardio-transition.jpg",
    h: [
      "Buvez quelques gorgées, sans excès.",
      "Séchez-vous et rejoignez le bassin sans traîner.",
      "Gardez les muscles chauds : ne restez pas immobile trop longtemps.",
    ],
  },
];
// Résolution contextuelle : une étape de piscine cherche d'abord un guide
// piscine, une étape cardio d'abord un guide cardio ; le repli croisé n'est
// accepté que si AUCUN guide du domaine ne correspond (jamais un vélo pendant
// une nage, jamais une nage pendant un elliptique lorsque l'image existe).
export function stepGuide(name, segment, poolGuides = []) {
  // Normalisation IDENTIQUE des deux côtés (nom d'étape ET clés des guides) :
  // l'original 1.5.0 normalisait aussi les deux (Ge) — un tirait la clé
  // « aqua-jogging » hors de « Aqua-jogging — EFFORT » en ne traitant les
  // tirets que d'un seul côté.
  const norm = (s) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']/g, " ")
      .replace(/[-–—]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const n = norm(name);
  const best = (list) => {
    let hit = null,
      len = 0;
    for (const g of list)
      for (const k of g.k) {
        const key = norm(k);
        if (n.includes(key) && key.length > len) ((hit = g), (len = key.length));
      }
    return hit;
  };
  const poolFirst = !segment || segment === "pool";
  const a = poolFirst ? [poolGuides, CARDIO_STEPS] : [CARDIO_STEPS, poolGuides];
  return best(a[0]) || best(a[1]);
}
