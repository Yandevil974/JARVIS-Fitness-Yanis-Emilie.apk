import { normalizeUtterance } from './coach.js';

// L'IA ne reçoit que les messages de conversation, jamais l'état complet du
// profil. Les faits personnels et les actions restent traités localement.
export function useConversationalModel(text, answer) {
  const q = normalizeUtterance(text);
  if (answer?.turn || (answer?.brain && answer.brain.source !== 'coach')) return false;
  if (answer?.action?.type === 'pain' || answer?.automatic) return false;
  if (/^(oui|ouais|ok|okay|non|nan|d accord|vas y|confirme|applique)\b/.test(q)) return false;
  const personalData = /\b(?:mon|ma|mes|notre|nos|votre|vos)\b/.test(q) &&
    /\b(?:programme|planning|seance|entrainement|serie|exercice|charge|poids|performance|record|1rm|historique|donnee|donnees|sauvegarde|profil|sommeil|recuperation|progression|calendrier|repetition|repetitions|muscles|objectif|objectifs)\b/.test(q);
  if (personalData) return false;
  // Une question générale n'est pas une instruction, même si une règle locale
  // a proposé à tort une adaptation à partir d'un mot comme « fatigue ».
  const question = /\?/.test(String(text)) || /^(?:pourquoi|comment|quand|quel(?:le|s|les)?|qu est ce|qu est ce que|est ce que|explique(?:z)?|peux tu expliquer|pourrais tu expliquer)\b/.test(q);
  if (question) return true;
  if (answer?.action || answer?.choices?.length || answer?.exerciseIds?.length) return false;
  return true;
}
