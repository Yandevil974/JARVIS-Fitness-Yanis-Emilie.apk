# Installation de Yanis Fitness Evolution 1.4.6 (23 septembre 2026)

Cette version corrige **deux visuels d'étirement** qui ne montraient pas la posture décrite (« Pigeon assis », « Main dans le dos » : l'image est échangée contre un dessin déjà présent, aucune consigne n'est réécrite) et **cinq guides aquatiques** qui affichaient un dessin terrestre (gainage au bord, mobilité épaules, mobilité hanches/chevilles, ciseaux au bord, talons-fesses) : la lacune est désormais explicite, et les consignes aquatiques restent affichées. La 1.4.6 contient aussi **l'étape piscine qui restait aquatique après les poids**, **la séance oubliée qui bloquait le programme d'Émilie** (« Reprendre ma séance » et compteur 40320:00), **les durées illisibles de la modale de séance combinée** (« 1500 s » devient « 25 min ») et **un guide aquatique qui pouvait s'afficher dans un Tabata au sol** (Gainage planche, Montées de genoux, Battements de jambes, Marche sur place) : le Tabata au sol n'affiche plus d'image ni de consigne de bassin, et l'Aqua Tabata garde exactement ses guides validés. : une séance de
musculation commencée puis quittée sans « Terminer » était reprise d'office des
semaines plus tard — ses exercices déjà validés réapparaissaient, l'échauffement
restait « Avant de commencer » et le chronomètre ne démarrait plus.

**Désormais**, au chargement d'un nouveau jour, cette séance est **clôturée
automatiquement en « partielle »** : elle garde **sa date réelle** et **toutes ses
séries validées**, va dans l'historique, la séance du jour est marquée du même
statut, et un message l'explique. Aucune charge, aucune répétition, aucune consigne,
aucune image et aucune donnée ne sont modifiées. Une séance **du jour même** n'est
jamais clôturée automatiquement.

La 1.4.6 contient aussi la correction piscine de la 1.4.1/1.4.2 : les étapes
aquatiques (marche aquatique, nage douce, fractionné nagé) affichent le guide
aquatique dans l'aperçu **et** dans le chrono, même quand le bloc piscine suit une
séance de musculation. Jamais de vélo ni d'elliptique pour une récupération en piscine.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `Yanis-Fitness-Evolution-1.4.6.apk` | application à installer (24 909 281 octets) |
| `Yanis-Fitness-Evolution-1.4.6.apk.sha256` | empreinte de contrôle |
| `Yanis-Fitness-Evolution-1.4.6.fidelity.json` | inventaire de fidélité (ce qui change, ce qui ne change pas) |

Empreinte SHA-256 de l'APK :

```
31e950848b0379830c09e9a4061eab49c812869343050747a0e163944941151c
```

Téléchargements :
[APK 1.4.6](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/4971809/downloads/Yanis-Fitness-Evolution-1.4.6.apk) ·
[empreinte](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/4971809/downloads/Yanis-Fitness-Evolution-1.4.6.apk.sha256) ·
[inventaire de fidélité](https://raw.githubusercontent.com/Yandevil974/JARVIS-Fitness-Yanis-Emilie.apk/4971809/downloads/Yanis-Fitness-Evolution-1.4.6.fidelity.json)

## Installation selon votre version actuelle

- **Vous avez déjà installé la 1.4.2 ou la 1.4.3** : même identifiant d'application **et
  même signature**. Installez directement la 1.4.6 **par-dessus**, sans rien désinstaller :
  vos données, vos charges et votre historique sont conservés tels quels.
- **Vous êtes encore en 1.4.0 ou 1.4.1** : la signature est différente, Android
  refuse la mise à jour par-dessus. Dans ce cas seulement :
  1. exporter d'abord le **JSON de sauvegarde** depuis votre version actuelle ;
  2. désinstaller l'ancienne application ;
  3. installer la 1.4.6 ;
  4. restaurer le JSON.

Vérification facultative sur un ordinateur :

```
sha256sum Yanis-Fitness-Evolution-1.4.6.apk
# doit afficher 31e950848b0379830c09e9a4061eab49c812869343050747a0e163944941151c
```

## Limites honnêtes

- La règle de clôture a été vérifiée **dans un navigateur** sur le paquet web
  exactement embarqué dans l'APK (2 tests Émilie, 28 tests média, 90 tests d'origine,
  tous verts). **Aucun essai sur téléphone** n'a été possible ici : c'est à confirmer
  par Émilie.
- Le comportement change : une séance d'un autre jour est clôturée sans demander.
  C'était la correction recommandée et acceptée (« fais ce que tu recommande ») ;
  dites-le si vous préférez une confirmation manuelle à la place.
- La sauvegarde privée de la clé reste **à conserver hors du téléphone** (fichier
  `Yanis-Fitness-Evolution-1.4.2-SAUVEGARDE-PRIVEE.zip` et clé de récupération).
- L'IA conversationnelle reste exclue, comme demandé.
