# JARVIS Fitness — Yanis & Émilie

Application de coaching pour deux profils, entièrement hors-ligne.

---

## ➜ CE QU'IL FAUT TÉLÉCHARGER

### **`JARVIS-Fitness.zip`** (17,5 Mo)

C'est l'application, prête à l'emploi.

1. Téléchargez le fichier
2. Décompressez-le
3. Ouvrez **`index.html`** par un double-clic

Rien à installer. Fonctionne sans connexion internet.
Un mode d'emploi (`LISEZ-MOI.txt`) est inclus dans l'archive.

---

---

## ➜ ET VOS DONNÉES

### **`MES-DONNEES-Yanis.json`** (1,7 Mo)

Votre historique, récupéré depuis l'ancien APK :
**10 valeurs de 1RM, 12 séances, 387 séries, 15 questionnaires de forme,
9 pesées, 4 photos.**

Téléchargez-le également, puis dans l'application :
**Profil → onglet Sauvegarde → Importer une sauvegarde.**

À faire une fois, sur chaque appareil. Sans cet import, l'application
démarre vide et les charges ne sont pas calculées.

Ce fichier est **volontairement séparé du `.zip`** et **exclu de GitHub** :
il contient vos mensurations et vos photos.

---

## Le reste du dossier

| Élément | À quoi ça sert |
|---|---|
| `JARVIS-Fitness.zip` | **L'application à télécharger.** Ne contient aucune donnée personnelle. |
| `MES-DONNEES-Yanis.json` | **Votre historique à réimporter.** Reste dans l'espace de travail, jamais sur GitHub. |
| `app/` | Le code source. Utile seulement pour modifier l'application. |
| `ANCIENNE-VERSION-obsolete.apk` | L'ancien APK, **périmé** : il ne contient aucune des évolutions récentes. Conservé par précaution, à supprimer quand vous voudrez. |

---

## À propos de l'APK Android

L'APK présent dans ce dossier est **l'ancienne version**. Il ne contient
ni le thème clair, ni le bilan 1RM, ni le guidage vocal, ni la montre
connectée.

Un nouvel APK n'a pas pu être compilé ici : cela demande un JDK et le SDK
Android, absents de cet environnement et non installables (pas d'accès
réseau aux dépôts). Le projet reste prêt pour cette compilation — la
configuration Capacitor est en place, et sur une machine équipée il suffit
de lancer :

```bash
cd app
npm install
npm run android:build     # produit android/app/build/outputs/apk/debug/
```

En attendant, `JARVIS-Fitness.zip` donne exactement la même application,
ouverte dans le navigateur du téléphone plutôt qu'installée.

---

## Développement

```bash
cd app
npm install
npm run dev        # serveur local, http://localhost:5173
npm test           # 83 tests
npm run build      # compile dans release/
node scripts/package-app.mjs   # refabrique JARVIS-Fitness.zip
```
