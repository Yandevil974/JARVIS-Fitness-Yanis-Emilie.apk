# Fitness Brain — mémoire contrôlée locale

Le **Fitness Brain** est un module **additif** : il ne remplace rien. Le coach
déterministe de `src/engine/coach.js` reste l'unique auteur des actions
sportives (programme, séances, charges, performances, arrêt douleur) et
continue de fonctionner à l'identique si le Brain est désactivé.

Le Brain n'ajoute que trois choses, toutes locales :

1. le **routage** d'un message vers la mémoire contrôlée ou vers le coach ;
2. des **propositions de mémoire** créées uniquement sur commande explicite,
   utilisables seulement après confirmation manuelle ;
3. un **rappel en lecture seule** des seules mémoires confirmées et non
   expirées.

## Fichiers

| Fichier           | Rôle                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `policy.js`       | état et activation du Brain (`p.brain`), textes de statut, refus honnête quand il est coupé |
| `contracts.js`    | contrats de résultat **fermés** ; toute action sportive est refusée à la construction       |
| `memory.js`       | mémoires typées : brouillon, matérialisation, confirmation, refus, expiration, rappel       |
| `context.js`      | contexte minimal par sujets, alimenté par les moteurs déterministes existants               |
| `router.js`       | classification pure du message (commande, rappel, garde de confirmation, délégation)        |
| `conversation.js` | mise en mots, application de la proposition, réponse prête pour l'application               |

## Ce qui est garanti

- **Aucun apprentissage automatique.** Une proposition n'est créée que par une
  commande explicite (`« Retiens que… »`, `« Souviens-toi que… »`,
  `« Mémorise… »`, `« Garde en mémoire… »`). Une phrase ordinaire ne crée rien :
  elle part au coach.
- **Une demande ambiguë reste une hypothèse.** Clause trop courte, marqueur
  d'incertitude (`peut-être`, `je crois`, `sans doute`…), auto-référence
  (`ce que je t'ai dit`) ou question : l'entrée est créée avec
  `state: "hypothesis"`, jamais comme un fait.
- **`confirmedAt: null` à la création.** Une proposition est inutilisable avant
  sa confirmation manuelle : elle n'apparaît ni dans le rappel, ni dans le
  contexte transmis au coach.
- **La confirmation est manuelle et uniquement dans l'interface.**
  `confirmMemory(..., { via: "chat" })` lève une erreur ; un « oui » dans le
  chat déclenche un message de garde qui explique où confirmer. Une
  confirmation sportive en cours (proposition du coach) conserve son cycle
  historique : le Brain ne l'intercepte pas.
- **Une proposition mémoire ne déclenche jamais d'action sportive.**
  `brainResult()` refuse toute réponse portant une action connue de
  `applyCoachAction`, et `assertBrainSafe()` le revérifie sur le tour complet.
- **Rappel en lecture seule.** Seules les mémoires `confirmed` et non expirées
  sont restituées ; un rappel ne modifie ni programme, ni séance, ni
  performance (testé par comparaison avant/après).
- **Brain désactivé = coach historique intact.** Le routeur délègue tout, et
  une commande de mémoire reçoit une réponse honnête (« je n'enregistre
  rien ») avec le chemin d'activation.
- **Aucun fournisseur, SDK, appel distant, serveur ni clé.** Aucune donnée de
  l'application ne sort de l'appareil. La piste hybride évoquée dans la
  passation n'est **pas** une autorisation : ce module ne fait aucun réseau.

## Données

```js
p.brain = {
  version: 1,
  enabled: true, // interrupteur dans Profil → Mémoire JARVIS
  memories: [
    {
      id,
      type, // preference | constraint | goal | context
      text,
      topics, // sujets du contexte (seance, force, nutrition…)
      state, // pending | hypothesis | confirmed | rejected | expired
      origin: "explicit",
      createdAt,
      createdAtMs,
      confirmedAt, // null tant que l'utilisateur n'a pas confirmé
      confirmedBy, // "interface"
      rejectedAt,
      expiresAt, // expiration optionnelle (défaut : 90 j pour un contexte)
    },
  ],
  updatedAt,
};
```

Bornes : 120 mémoires, 240 caractères par mémoire, 12 entrées rappelées.

## Validation

`tests/brain.test.js` couvre : commande explicite, absence d'apprentissage
automatique, proposition en attente, refus du « oui » du chat, confirmation
manuelle, hypothèse, expiration, rappel en lecture seule, refus d'action
sportive, mode désactivé, contexte par sujets et compatibilité de restauration
d'une sauvegarde sans `brain`.
