// Yanis Fitness Evolution — identité applicative distincte de JARVIS Fitness.
// Clé de stockage propre à cette application ; l'import JSON accepte toujours
// les sauvegardes JARVIS (schemaVersion 3) sans conversion destructive.
export const APP_ID = "app.yanis.fitness.evolution";
export const APP_NAME = "Yanis Fitness Evolution";
export const APP_VERSION = "1.5.1";
export const BUILD_CODE = 151;
export const STORAGE_KEY = "yanis_evolution_v3";
// Les anciennes clés JARVIS sont relues à la première ouverture (migration
// lecture seule, jamais d'écrasement : l'app d'origine reste intacte).
export const LEGACY_STORAGE_KEYS = ["jarvis_fitness_v3"];
export const IDB_NAME = "yanis-fitness-evolution";
