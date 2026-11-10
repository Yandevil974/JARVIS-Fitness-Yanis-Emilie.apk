/** User-facing save failure: never confuse invalid data or protection with a storage outage. */
export function saveProblem(saving) {
  if (!saving || saving.ok) return null;
  const safeguard = "Exportez une sauvegarde avant de fermer. Ne désinstallez pas l’application et n’effacez pas ses données.";
  switch (saving.mode) {
    case "validation":
      return {
        title: "Enregistrement refusé : données à vérifier.",
        message: `${saving.error || "Une donnée de la session n’est pas valide."} Les derniers changements ne sont pas confirmés. ${safeguard}`,
      };
    case "conflit":
      return {
        title: "Enregistrement bloqué : autre version détectée.",
        message: `Une sauvegarde plus récente a été détectée. Les originaux sont protégés et les changements de cette session ne sont pas confirmés. ${safeguard} Dans Profil → Données, téléchargez aussi les copies originales.`,
      };
    case "protection":
      return {
        title: "Enregistrement bloqué pour protéger les données.",
        message: `Une sauvegarde nécessite une vérification ; les originaux sont protégés. Les changements de cette session ne sont pas confirmés. ${safeguard} Dans Profil → Données, téléchargez aussi les copies originales.`,
      };
    case "mémoire":
      return {
        title: "Enregistrement local indisponible.",
        message: `Aucun stockage disponible n’a confirmé la sauvegarde. Les changements de cette session restent en mémoire et peuvent être perdus. ${safeguard}`,
      };
    default:
      return {
        title: "Enregistrement non confirmé.",
        message: `La cause n’a pas pu être déterminée. Les changements de cette session peuvent être perdus. ${safeguard}`,
      };
  }
}
