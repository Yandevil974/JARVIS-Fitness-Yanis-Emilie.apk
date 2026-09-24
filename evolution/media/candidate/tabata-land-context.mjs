// Contexte TERRE du Tabata : les 38 mouvements du generateur au sol.
//
// Mesure du 23 septembre 2026 : 34 des 38 noms ne resolvaient aucun media
// (l'ecran montrait la photo generique de recuperation) et 4 noms identiques
// entre les deux contextes (Gainage planche, Battements de jambes, Montees de
// genoux, Marche sur place) affichaient un guide AQUATIQUE dans un enchainement
// au sol. La 1.4.5 a supprime le repli aquatique ; depuis, ces quatre noms
// n'affichent plus rien au sol.
//
// Ce module fournit une animation humaine pour les mouvements au sol, et
// uniquement dans ce contexte : hors Tabata au sol (piscine, etirements,
// echauffement, repos), il ne resout rien et le comportement livre est conserve.
// Aucun nom, aucune duree, aucune consigne, aucun etat enregistre n'est touche.
export function createTabataLandMedia({normalize, providedAnimations = {}}) {
  const table = new Map();
  for (const [name, path] of Object.entries(providedAnimations)) table.set(normalize(name), {name, path});
  // Le generateur nomme chaque pas « <mouvement> · round n/N ».
  const ROUND = / · round \d+\/\d+$/;
  function movement(raw) {
    const text = String(raw || '').replace(ROUND, '').trim();
    return text ? table.get(normalize(text)) || null : null;
  }
  function isLandTabata(step, meta) {
    if (!step || meta?.type === 'aqua' || meta?.type === 'swim') return false;
    return ROUND.test(String(step.name || '')) || ['hiit', 'tabata'].includes(meta?.type);
  }
  function resolve(step, meta, poolMedia) {
    // Un pas aquatique garde son guide valide : jamais d'animation de terre.
    if (poolMedia || !isLandTabata(step, meta)) return null;
    const found = movement(step.name);
    return found ? {...found, level: 'exact-land'} : null;
  }
  return {resolve, movement, isLandTabata, table};
}
