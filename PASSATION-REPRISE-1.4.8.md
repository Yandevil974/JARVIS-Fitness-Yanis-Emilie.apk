# Passation de reprise — JARVIS Fitness Evolution 1.4.8

Document de reprise pour continuer le travail sur **le modèle 1.4.8 livré**, et non sur la branche de démonstration 1.5.1 ouverte dans une autre session.

Date de reprise : 25 septembre 2026

## 1. Base de travail obligatoire

Le travail doit commencer depuis cette branche et ce commit :

- Branche : `arena/01a0cd68-jarvis-fitness-yanis-emilie-ap`
- Dernier commit connu : `2c112b15aad932d05c66104c75dabd6ab21bba1d`
- Dépôt : `Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk`
- Application concernée : **Yanis-Fitness-Evolution 1.4.8**

Arborescence attendue :

```text
PASSATION.md
evolution/media/
evolution/media/candidate/
evolution/media/review/
evolution/media/tests/
evolution/android/
downloads/Yanis-Fitness-Evolution-1.4.8.apk
```

Ne pas utiliser comme base le dossier `yanis-fitness-evolution/` de la branche
`arena/01a0d4ce-jarvis-fitness-yanis-emilie-ap` : il s'agit d'une autre
architecture de démonstration, version 1.5.1. Ne pas mélanger ses sources, son
APK ou ses médias avec la chaîne 1.4.8.

## 2. Version livrée à préserver

APK à conserver comme point de départ :

- Fichier : `downloads/Yanis-Fitness-Evolution-1.4.8.apk`
- Taille : `28 035 594` octets
- SHA-256 : `fee667192291dd8adc93593bb395b6193e82849e11a4d5db94bf9218c8b99e9f`
- Signature : certificat commençant par `150e3846…`
- Installation : par-dessus les versions 1.4.2 à 1.4.7, sans désinstallation
- Ne jamais installer la 1.4.7 : cinq médias référencés étaient absents de son APK
- Ne jamais régénérer ni remplacer l'identité de signature

Lien de la version livrée :

<https://github.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/raw/f48bf739a824661c774e524062aea1ca19958516/downloads/Yanis-Fitness-Evolution-1.4.8.apk>

La clé de récupération de signature ne doit jamais être écrite dans ce fichier,
committée ou publiée. Elle doit rester uniquement dans `/tmp/rk.txt` avec les
droits `0600` et dans le matériel privé restauré. Si elle est absente après un
effacement de l'espace de travail, demander à l'utilisateur de la recoller ;
le 6e caractère est la lettre `l` minuscule, pas le chiffre `1`.

## 3. Direction artistique validée par l'utilisateur

Les visuels doivent être des **photos/illustrations humaines animées** dans un
rendu réaliste et lumineux :

### Homme, modèle unique pour tous les exercices masculins

- Même visage pour tous les exercices.
- Homme chauve.
- Peau marron naturelle.
- Morphologie plus musclée : épaules, pectoraux, bras, dos et jambes développés.
- Même identité visuelle d'une animation à l'autre.

### Femme, modèle unique pour tous les exercices féminins

- Même visage pour tous les exercices.
- Peau marron naturelle.
- Morphologie athlétique avec poitrine légèrement plus généreuse.
- Même identité visuelle d'une animation à l'autre.

### Décor et muscles

- Décor lumineux de salle de sport : mur gris chaud, sol bois, plantes et
  matériel visible.
- Le matériel et les machines changent selon l'exercice prescrit : poulie,
  banc, machine, haltères, piscine, elliptique, etc.
- Le décor reste cohérent mais ne doit pas montrer une machine incorrecte.
- Seuls les muscles travaillés par l'exercice apparaissent en vert.
- Aucun corps argenté ou métallique.
- Aucun éclairage excessivement sombre.
- Les poses doivent être propres, lisibles et fluides du départ à la fin.

Les aperçus produits dans la branche de démonstration servent uniquement à
confirmer cette direction artistique ; ils ne remplacent pas la chaîne média
1.4.8 et ne doivent pas être câblés automatiquement dans celle-ci.

## 4. Exigences de fidélité

Pour chaque exercice :

1. Montrer le mouvement prescrit, pas un mouvement de la même famille.
2. Montrer le bon outil : barre, haltères, câble, machine, banc, élastique,
   piscine ou elliptique selon la prescription.
3. Montrer le bon angle et la bonne variante : incliné, décliné, unilatéral,
   prise serrée, banc à 30°, etc.
4. Vérifier chaque image de chaque animation, pas uniquement le décodage du GIF
   ou sa première image.
5. Aucun exercice sans visuel et aucun écran vide.
6. Aucun visuel de la famille C refusée.
7. Aucune rotation ou miroir global pour masquer une mauvaise correspondance.
8. En piscine : jamais de vélo, d'elliptique ou de photo générique ; un visuel
   aquatique reste aquatique.
9. Ne jamais réécrire une prescription pour justifier un mauvais visuel.
10. Conserver les 209 exercices, les 11 rubriques, les deux profils, les étapes
    1 à 7, l'accueil, les charges et l'historique.

## 5. Travail restant, dans l'ordre

### Lot visuel à refaire ou produire

Refaire avec la nouvelle direction artistique :

1. Élévations latérales incliné 30° : inclinaison du banc clairement visible.
2. Écartés câbles incliné : athlète allongé sur le banc incliné.
3. Rowing assis câble unilatéral : un seul bras tire la poignée.
4. Développé couché décliné prise serrée.
5. Pallof press à l'élastique.

Puis contrôler que le style final est appliqué à toutes les autres familles :

- musculation ;
- Tabata au sol ;
- Aqua Tabata ;
- piscine ;
- Metcon piscine ;
- vélo elliptique ;
- échauffement ;
- étirements ;
- récupération et transitions.

### Câblage

Mettre à jour :

- `evolution/media/candidate/alias-visuals-map.json` ;
- `evolution/media/candidate/alias-animations/` ;
- les alias visuels et leurs empreintes ;
- l'autorisation d'un même fichier pour deux identifiants lorsque le mouvement
  est réellement identique ;
- `delivered-bundle.test.mjs` ;
- `alias-visuals.test.mjs` ;
- `media-inventory.test.mjs` ;
- `evolution/media/candidate/build.mjs` ;
- le pin `BUNDLE_SHA` dans `evolution/android/build-media-148.py`.

### Construction et vérification

Après câblage :

1. Reconstruire le paquet web.
2. Reconstruire l'APK 1.4.8 avec le même certificat.
3. Vérifier l'inventaire réellement embarqué dans l'APK.
4. Produire le `.sha256` et le `.fidelity.json`.
5. Vérifier la signature v2/v3, l'alignement et les 9/9 DEX.
6. Relancer les 64 tests :

```bash
node --test evolution/media/tests/*.test.mjs
python3 evolution/android/build-media-148.py --real
```

La version finale doit être livrée en une seule version complète. Ne pas publier
un correctif séparé et ne pas fermer les constats sans essai réel sur le
Téléphone de l'utilisateur.

## 6. Constats qui restent ouverts

Les constats sont à reprendre dans :

- `evolution/media/review/findings.json` ;
- `evolution/media/review/GAPS-SANS-DESSIN.json` ;
- `evolution/media/review/alias-lot2-verification.png` ;
- `evolution/media/review/alias-restants-dessins-livres.png`.

Ils restent ouverts jusqu'à l'acceptation après installation sur le téléphone.
L'IA conversationnelle reste en pause et ne doit être traitée qu'après la
validation complète des visuels et de l'APK.

## 7. Contrôle de reprise recommandé

Avant de modifier quoi que ce soit :

```bash
git status --short
git log --oneline -5
find evolution/media evolution/android -maxdepth 2 -type f | sort | head -200
sha256sum downloads/Yanis-Fitness-Evolution-1.4.8.apk
node --test evolution/media/tests/*.test.mjs
```

Si `PASSATION.md`, `evolution/media/` ou `evolution/android/` n'existent pas,
arrêter la reprise : le mauvais checkout est ouvert. Ne pas mélanger les deux
architectures et ne pas produire un APK à partir de la mauvaise branche.
