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

## Le reste du dossier

| Élément | À quoi ça sert |
|---|---|
| `JARVIS-Fitness.zip` | **L'application à télécharger.** C'est tout ce dont vous avez besoin. |
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
