# Accueil plus JARVIS — trois idées avant validation

**Étude visuelle du 21 septembre 2026. Aucune intégration à l’application.** L’utilisateur demande à voir les idées avant de valider et place cette étape avant l’IA conversationnelle. Lire aussi [`../../PASSATION.md`](../../PASSATION.md).

## Comparatif

![Trois propositions d’accueil — données d’exemple uniquement](propositions-accueil.png)

| Piste | Intention | Compromis |
|---|---|---|
| [A — NEXUS](proposition-a.png) | Cockpit bleu nuit/cyan, anneaux et orbe JARVIS, statut local visible. | Le plus immersif ; limiter la place du décor pour garder les actions proches. |
| [B — VECTOR](proposition-b.png) | Séance tout en haut, puis point de l’équipe et priorité ; graphite/menthe. | Le plus lisible et efficace ; présence JARVIS moins spectaculaire. |
| [C — ORBIT](proposition-c.png) | Halo indigo, verre fumé, orbe doux et accompagnement personnel. | Plus calme, mais le héros prend davantage de place avant la séance. |

**Recommandation :** B comme structure, avec un orbe compact inspiré de A. Ce mélange n’est pas encore dessiné comme quatrième variante ; il reste à valider. Les noms NEXUS/VECTOR/ORBIT sont des noms de pistes, pas des changements du nom **Yanis Fitness Evolution**.

## « Faire remonter » — interprétation à confirmer

Proposition de hiérarchie, à adapter au choix de l’utilisateur :

1. En cas de besoin : alerte de sécurité/stockage ou séance/chrono en cours, toujours avant le décor et jamais masquée.
2. **Prochaine séance réelle** et bouton **Préparer ma séance**. Pas de séance inventée ni de lancement automatique ; s’il n’y a rien de prévu, proposer d’ouvrir le programme.
3. **Point JARVIS de l’équipe**, court, fondé sur les données existantes, avec Pourquoi et lecture à la demande. Aucun micro activé seul.
4. **Une à trois priorités** utiles : bilan, mensurations, décision à examiner. Lire ou ouvrir n’enregistre pas une réalisation.
5. Le reste du suivi et des historiques plus bas. Les **11 rubriques** restent accessibles ; le bouton Plus du dessin représente l’accès à tous les modules, pas leur suppression.

Ni cette hiérarchie ni un style n’ont encore été approuvés. Demander ce que l’utilisateur entendait précisément par « faire remonter » s’il ne le précise pas dans son choix.

## Ce qui est réel dans cette étude

- HTML/CSS/SVG autonomes, hors du bundle et des ressources de l’APK.
- Texte, séance, durée et rappel **fictifs, marqués comme données d’exemple**.
- Le choix Yanis/Émilie ne modifie que la maquette concernée. Les autres boutons expliquent qu’il ne s’agit pas encore de fonctions reliées.
- Le cadre de téléphone, l’encoche et l’heure sont des éléments de présentation : ne pas les recopier comme fausse barre système dans l’application. Tous les exemples devront être remplacés par les états réels ou des états vides après validation.
- Aucun accès aux sauvegardes, aucun appel d’IA, aucune activation du micro, aucun appel natif, aucune écriture localStorage/IndexedDB.
- Aucune animation en boucle. Une animation discrète de l’orbe pourrait être proposée plus tard, avec respect d’Animations réduites.
- La police Manrope est copiée depuis les ressources existantes avec sa licence OFL. Aucun nouvel outil natif ni clé privée utilisé.

## Voir les propositions

Ouvrir `index.html`, ou servir **uniquement ce dossier**, jamais la racine du dépôt :

```sh
python3 -m http.server 5181 --bind 0.0.0.0 --directory design/accueil-jarvis
```

Le comparatif PNG et les trois vues séparées sont conservés dans Git pour rester accessibles depuis une nouvelle conversation, même si l’aperçu temporaire s’arrête.

## Vérifications de la maquette

`render.mjs` vérifie les trois concepts, les largeurs 320/360/390/768/1024/1280/1440 px, l’absence de débordement horizontal ou de contenu recouvert par la navigation, l’isolation des profils de démonstration, l’absence d’écriture des stockages web, d’appel externe et d’erreur JavaScript. Il produit le comparatif et les trois vues séparées.

```sh
# Dépendances de test du dépôt + Chromium local nécessaires.
CHROMIUM_EXECUTABLE_PATH=/chemin/vers/chromium \
  node design/accueil-jarvis/render.mjs
```

Pour cet environnement : Chromium 138.0.2 provenant du package npm `@sparticuz/chromium`, binaire `/tmp/chromium`, bibliothèques sous `.cache/browser-libs/lib` et variable `LD_LIBRARY_PATH`. Ces outils sont temporaires et hors Git.

L’APK 1.3.0 reste strictement inchangé, SHA-256 `4c2efeaea0d1d59e9bc329f4b3651e2a860a1416bad900c23a15e0249622a323`. Les essais ci-dessus concernent **les maquettes uniquement**, pas de nouvelles validations Android.

**Prochaine étape : choix et ajustements visuels par l’utilisateur ; intégration seulement après son accord. L’IA reste en pause.**
