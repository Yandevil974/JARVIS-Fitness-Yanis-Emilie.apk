// Visuels de séances : GIF HUMAINS (corpus des 389 + retouches validées).
// Les illustrations statiques d'origine sont remplacées : le chrono affiche un humain
// animé à chaque étape (échauffement, étirements, piscine, cardio).
// illustrations « bord de bassin », étirements guidés, échauffements et étapes
// cardio. Chaque étape affiche le visuel de SON domaine (pas de vélo dans une
// étape piscine, pas de piscine dans une étape elliptique).
import { GIF_STEPS } from "./visuals-gifs.js";

export { GIF_STEPS };

export const STRETCH_IMAGES = {
  "Étirement dans l'encadrement de porte": "/media/a78693d8a7586ec3.gif",
  "Bras tendu contre le mur": "/media/31036c76962c0fd8.gif",
  "Position de l'enfant (Balasana)": "/media/ca55d85fe63748ff.gif",
  "Position de l'enfant": "/media/ca55d85fe63748ff.gif",
  "Suspension à la barre": "/media/58ad573d2614c6f0.gif",
  "Torsion allongée": "/media/e4c658cdff400dca.gif",
  "Torsion allongée genoux": "/media/e4c658cdff400dca.gif",
  "Mains croisées derrière le dos": "/media/22867473af1fb961.gif",
  "Bras tendu contre la poitrine": "/media/5b3aed6740b23734.gif",
  "Bras tendu devant, main tirée": "/media/b0929e5814095b39.gif",
  "Bras tendu derrière": "/media/bc05e6deaf1c4439.gif",
  "Coude au-dessus de la tête": "/media/10da6a636b6c241f.gif",
  "Main dans le dos": "/media/a3e613455df400b6.gif",
  "Étirement des fléchisseurs": "/media/b2b87c3a254bd7fd.gif",
  "Étirement des extenseurs": "/media/7904d339e462c693.gif",
  "Étirement du cobra": "/media/1651c3bb2dc4e3b0.gif",
  "Cobra doux": "/media/1651c3bb2dc4e3b0.gif",
  "Pigeon assis": "/media/2c028e4433214abd.gif",
  "Étirement du piriforme assis": "/media/1e8d5bfcc0bc9ead.gif",
  "Talon vers la fesse (debout)": "/media/56815335e3345463.gif",
  "Allongé sur le côté": "/media/7adfeb9c4e73edec.gif",
  "Flexion avant jambes tendues": "/media/9e70da90895119dd.gif",
  "Une jambe tendue, une pliée": "/media/aa441b52ee032a19.gif",
  "Grenouille (plantes jointes)": "/media/3dde44e4595f3e5e.gif",
  "Étirement contre le mur": "/media/ab272031c33d4b40.gif",
  "Adduction de la hanche debout": "/media/6ec4644eeb54b838.gif",
  "Étirement du fléchisseur de hanche (chevalier)":
    "/media/079e5e801980964e.gif",
  "Respiration diaphragmatique allongée": "/media/54a3ca1547a3a613.gif",
  "Mollet en escalier": "/media/d22b43f8c3eb9f2b.gif",
};
export const POOL_STEP_IMAGES = {
  "Étirements au bord": "/media/8f862f2ae511a13e.gif",
  "Nage statique (à l'élastique)": "/media/236c40fd157f0f41.gif",
  "Nage douce": "/media/a9b2430d317e3bba.gif",
  "Marche aquatique": "/media/60207d563d74fd85.gif",
  "Fractionné — nager": "/media/19750699871755e5.gif",
  "Sprint — nager à fond": "/media/47746e12d90c5e2c.gif",
  "Récup complète — souffler": "/media/d72ff5db739f1e85.gif",
  "Récup entre tabatas": "/media/60207d563d74fd85.gif",
  "Retour au calme": "/media/7ff5fea738f927d8.gif",
  "Déplacements latéraux (4 m)": "/media/0bddac76645e3de9.gif",
};
export const WARMUP_IMAGES = {
  route: "/media/4d6d57f97bdd691e.gif",
  mobilite: "/media/6d278876a579cbc8.gif",
  approche: "/media/0c5a8fe6ba79eb47.gif",
};
export const CARDIO_STEPS = [
  {
    k: ["echauffement elliptique", "elliptique"],
    t: "Elliptique — mise en route",
    img: "/media/7acb83b71752c44c.gif",
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
    img: "/media/d003581431ffef91.gif",
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
    img: "/media/7d74994e8d8777be.gif",
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
    img: "/media/098935746d0a45c3.gif",
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
    img: "/media/bf54d3bdd17514e2.gif",
    h: [
      "Buvez quelques gorgées, sans excès.",
      "Séchez-vous et rejoignez le bassin sans traîner.",
      "Gardez les muscles chauds : ne restez pas immobile trop longtemps.",
    ],
  },
];
// Un segment « pool » ou « cardio » reste strictement dans son domaine.
// Sans segment spécialisé, on conserve le repli croisé historique.
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
  // Les segments explicites sont des frontières de domaine : un texte de
  // piscine qui mentionne « récupération active » ne doit pas tomber sur le
  // guide elliptique, et inversement.
  if (segment === "pool") return best(poolGuides);
  if (segment === "cardio") return best(CARDIO_STEPS);
  const poolFirst = !segment;
  const a = poolFirst ? [poolGuides, CARDIO_STEPS] : [CARDIO_STEPS, poolGuides];
  return best(a[0]) || best(a[1]);
}
