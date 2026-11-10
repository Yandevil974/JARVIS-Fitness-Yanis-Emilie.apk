import { safeJSON } from '../engine/utils.js';
import { validateState } from './model.js';

// Validation pure d'un export complet : ne lit ni n'écrit le stockage de l'application.
export function checkFullBackup(text) {
  try {
    const validated = validateState(safeJSON(text));
    const review = Object.values(validated.profiles).some(p =>
      [...p.sessions, ...(p.workout ? [p.workout] : []), ...(p.plan?.sessions || []), ...(p.archivedPlans || []).flatMap(plan => plan.sessions || [])].some(session => session.durationReview)
    );
    return { ok: true, message: review
      ? 'Sauvegarde compatible : une durée de séance est à vérifier. La valeur d’origine est conservée ; aucune donnée n’a été importée. Ce contrôle ne confirme pas l’écriture sur le téléphone.'
      : 'Structure de la sauvegarde valide. Ce contrôle ne confirme pas que l’écriture sur le téléphone fonctionne.' };

  } catch (error) {
    const reason = error instanceof SyntaxError ? 'Format JSON illisible.' : error?.message || 'erreur inconnue.';
    return { ok: false, message: `Sauvegarde non validée : ${reason} Aucun import ni remplacement n’a été effectué.` };
  }
}
