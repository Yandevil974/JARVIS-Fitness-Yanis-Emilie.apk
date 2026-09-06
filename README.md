# JARVIS Fitness — Yanis & Émilie

Application de coaching pour deux profils, entièrement hors-ligne.

---

## ➜ CE QU'IL FAUT TÉLÉCHARGER

### **`JARVIS-Fitness.apk`** (22 Mo)

L'application Android, signée et installable.

1. **Désinstallez l'ancienne application** — la clé de signature est
   nouvelle, Android refuse la mise à jour par-dessus l'ancienne
2. Ouvrez l'APK, autorisez l'installation depuis cette source
3. Importez vos données (voir ci-dessous)

> Sans installation : **`JARVIS-Fitness.zip`** contient la même
> application à ouvrir dans un navigateur (double-clic sur
> `index.html`). Seule la montre connectée y est indisponible,
> car elle exige HTTPS.

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
| `JARVIS-Fitness.apk` | **L'application Android à installer.** Signature vérifiée. |
| `JARVIS-Fitness.zip` | La même application, version navigateur, sans installation. |
| `MES-DONNEES-Yanis.json` | **Votre historique à réimporter.** Reste dans l'espace de travail, jamais sur GitHub. |
| `app/` | Le code source. Utile seulement pour modifier l'application. |
| `ANCIENNE-VERSION-obsolete.apk` | L'ancien APK, **périmé** : il ne contient aucune des évolutions récentes. Conservé par précaution, à supprimer quand vous voudrez. |

---

## À propos de l'APK

L'APK est reconstruit en réinjectant l'application web compilée dans
l'enveloppe Android existante, puis en le resignant — la compilation
Gradle demanderait un JDK et le SDK Android, absents de cet
environnement. L'enveloppe (code Capacitor, permissions, icônes) étant
inchangée, le résultat est équivalent.

```bash
cd app
npm install
npm run build                    # compile l'application web
node scripts/build-apk.mjs       # réinjecte et signe
```

La signature est validée par un vérificateur indépendant
(`apksigtool` : `v2 verified`).

**La clé de signature** est dans `app/.private/jarvis-signing-key.pem`,
exclue de Git. Conservez-la : elle seule permettra d'installer les
futures mises à jour **par-dessus** celle-ci, sans désinstaller ni
perdre les données. Si vous la perdez, il faudra à nouveau désinstaller
avant de réinstaller.

`ANCIENNE-VERSION-obsolete.apk` sert d'enveloppe de base : ne le
supprimez pas tant que vous voudrez refabriquer l'APK.

## Développement

```bash
cd app
npm install
npm run dev        # serveur local, http://localhost:5173
npm test           # 83 tests
npm run build      # compile dans release/
node scripts/package-app.mjs   # refabrique JARVIS-Fitness.zip
```
