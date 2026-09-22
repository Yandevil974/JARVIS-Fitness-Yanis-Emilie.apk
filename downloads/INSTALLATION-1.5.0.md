# Yanis Fitness Evolution 1.5.0 — installation et transfert des données

**APK : `downloads/Yanis-Fitness-Evolution-1.5.0.apk`** — 26 008 963 octets.
SHA-256 : `8db21bd9ed8410b77fc913f708da273864626c2110c1905daa75f7dfa3d8bd9d`
Package : `app.yanis.fitness.evolution.home` (identique à la 1.4.0) · versionCode 12.
Certificat : `f6fd7ffcb736b482300a9c9afe4d97acb571643c232b203ad02ecf31440675c8`
(ancien certificat 1.4.0 : `7d6f9c8f…21fd` — voir « Pourquoi désinstaller »).

## ⚠️ Pourquoi il faut d'abord DÉSINSTALLER la 1.4.0

La clé de signature de la 1.4.0 ayant été perdue, une **nouvelle clé de remplacement** a été
créée avec ton accord explicite, pour le **même package**. Android refuse une mise à jour
dont le certificat change : sans désinstallation, l'installation échoue avec
« App non installée ». **La 1.5.0 ne peut donc PAS remplacer la 1.4.0 en place.**

## Étapes

1. **Exporte tes données depuis la 1.4.0** : ouvre Yanis Fitness Evolution 1.4.0 →
   Réglages/Sauvegarde → **Exporter le JSON** (vérifie que les deux profils, Yanis ET Émilie,
   sont inclus) → enregistre le fichier (Téléchargements/Drive/e-mail).
2. **Désinstalle** Yanis Fitness Evolution (la 1.4.0). Ne désinstalle aucune autre application.
3. Installe `Yanis-Fitness-Evolution-1.5.0.apk` (autorise « installer depuis cette source »).
4. Ouvre la 1.5.0 → Réglages/Sauvegarde → **Importer le JSON** → choisis le fichier exporté.
5. **Vérifie** : les deux profils sont présents, charges et historiques intacts ;
   ferme et rouvre l'app, vérifie à nouveau. Ne supprime le JSON exporté qu'après ce contrôle.

## Ce que contient la 1.5.0

- Les **sept étapes** et l'accueil approuvé (orbe bleu), inchangés.
- **Démonstrations corrigées** : GIF dips/triceps cohérent, extension triceps haltères sur banc,
  oiseau-chien réel, cercles d'épaules et vélo animés, jumping jacks, superman ; table
  tractions/step-up/hip thrust restaurée ; absences explicites au lieu de mauvaises images
  (piscine/Tabata séparés par contexte).
- L'IA conversationnelle générale reste **en pause**.
- Les neuf DEX Android et toutes les ressources natives sont **identiques octet pour octet**
  à la 1.4.0. Signature v2+v3 vérifiée par un vérificateur indépendant auto-testé sur la 1.4.0.

## Sauvegarde de signature — À CONSERVER

Le fichier **`Yanis-Fitness-Evolution-1.5-SAUVEGARDE-PRIVEE.zip`** (remis via le visualiseur,
jamais publié) contient la clé qui signera **toutes les futures mises à jour**. Garde-le en
**deux endroits privés** (téléphone + cloud privé ou clé USB). Sans lui, la prochaine mise à
jour exigera encore une nouvelle clé et une nouvelle désinstallation.
