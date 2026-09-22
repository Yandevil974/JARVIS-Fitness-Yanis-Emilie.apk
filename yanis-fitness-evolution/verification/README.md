# Vérification visuelle — comparaison pixel à pixel contre l’APK 1.5.0

Méthode : les deux applications sont servies côte à côte (l’originale depuis
les assets extraits de `JARVIS-Fitness.apk`, la nouvelle depuis `release/`
généré par `npm run build`), rendues par le même moteur Chromium dans un
viewport identique (1440×1000), puis comparées pixel à pixel (PIL/numpy).

| Étape capturée | Pixels identiques | Pixels modifiés (>12/255) | Nature des écarts |
| --- | --- | --- | --- |
| Accueil (dashboard complet) | 99,6 % | 0,23 % | Ligne « V 1.5.1 » vs « V 1.0.4 » (volontaire), anti-crénelage |
| Bilan 1RM | 99,96 % | 0,03 % | idem |
| Fenêtre coach JARVIS | 99,96 % | 0,03 % | idem |
| Profil → Matériel & préférences (capteur cardio, thème, guidage vocal) | 99,96 % | 0,03 % | idem |
| Entraînement (plan du jour) | 99,96 % | 0,03 % | idem |
| Séance en cours (session) | 98,97 % | 0,54 % | secondes du minuteur et image GIF figée à des millisecondes différentes ; aucun écart de mise en page (voir `diffx8-session.png` dans le rapport de session) |

Fichiers : `orig-*.png` = rendu de l’APK 1.5.0 réel, `new-*.png` = build de production de Yanis Fitness Evolution.

## Reproduire

```bash
npm run build
npx vite preview --port 4173 &          # nouvelle application
# application originale :
unzip -j ../../JARVIS-Fitness.apk "assets/public/*" -d /tmp/orig && (cd /tmp/orig && python3 -m http.server 4174) &
# puis tout script Playwright/puppeteer ouvrant les deux URLs au même viewport
```

## Limites connues (déclarées, pas masquées)

- L’APK d’origine ne livre ni `runtime.js` ni `runtime.css` dans ses assets
  (seul `media-index.json`, 150 entrées, y figure) : l’export « HTML
  autonome » y affiche son message d’erreur ; la nouvelle application régénère
  les trois fichiers au build (`npm run build:portable`) et l’export
  fonctionne.
- Les captures ont été produites en headless Chromium via CDP ; le parcours
  tactile (échauffement, validation de série, minuteur de repos, voix) a été
  vérifié par les mêmes pilotes avec assertions DOM + zéro erreur console.
