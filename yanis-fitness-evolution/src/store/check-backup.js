import { safeJSON } from '../engine/utils.js';
import { validateState } from './model.js';

// Validation pure d'un export complet : ne lit ni n'écrit le stockage de l'application.
export function checkFullBackup(text) {
  try {
    validateState(safeJSON(text));
    return { ok: true, message: 'Structure de la sauvegarde valide. Ce contrôle ne confirme pas que l’écriture sur le téléphone fonctionne.' };
  } catch (error) {
    const reason = error instanceof SyntaxError ? 'Format JSON illisible.' : error?.message || 'erreur inconnue.';
    return { ok: false, message: `Sauvegarde non validée : ${reason} Aucun import ni remplacement n’a été effectué.` };
  }
}
