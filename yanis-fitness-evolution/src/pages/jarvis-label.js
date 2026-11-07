/* Libellé d'un message assistant JARVIS.
   Attention : le Fitness Brain local range `brain` en OBJET ({ source, topics,
   kind, memoryId, ... }) sur ses réponses, alors que le connecteur ARENA//X
   range une CHAÎNE ("groq//solo", "openrouter//collab"). Le libellé doit
   rester inoffensif dans les deux cas (régression 1.8.6 : toUpperCase() sur
   l'objet crashait toute la page JARVIS). */
export function assistantLabel(m) {
  if (typeof m.brain === "string") return "ARENA//X " + m.brain.toUpperCase();
  if (m.fallback) return "SECOURS LOCAL";
  return "ANALYSE LOCALE";
}
