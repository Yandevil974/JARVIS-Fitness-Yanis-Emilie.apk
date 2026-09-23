# Émilie — séance jamais clôturée : ni le programme du jour, ni le chronomètre

**Reproduit le 23 septembre 2026 sur le paquet web livré (`b74853bc…`, celui des APK 1.4.1 et 1.4.2).** Défaut **hérité de la 1.4.0** : le mécanisme est identique dans les bundles 1.0.6, 1.3.0 et 1.4.0 embarqués dans les APK publiés — ce n'est pas une régression de la correction piscine. Preuves : `review/emilie-block-w5-{accueil,seance,chrono-refuse,programme}.png`, `review/emilie-block-w9-accueil.png` ; reproduction automatisée `evolution/media/tests/emilie-session-block.spec.mjs` (1 test, vert, 18 s).

## Ce qui se passe exactement

Une **séance de musculation commencée et jamais clôturée** reste enregistrée dans l'état (`workout`). Elle ne change plus jamais : son jour, sa date de départ, ses séries validées, son statut `inProgress`. Aux ouvertures suivantes :

1. le bouton principal de l'accueil annonce **« Reprendre ma séance »** (bandeau « Une séance est en cours. ») au lieu de « Lancer la séance » ;
2. l'appui rouvre **la séance de la semaine 1**, avec **sa série déjà validée** — donc « des exercices terminés validés pour aujourd'hui » — et un compteur de durée qui affiche **40320:00** (4 semaines de minutes) ;
3. l'échauffement reste **« Avant de commencer »** : rien du jour n'est marqué fait ;
4. le programme du jour reste « planifié » : la vue « Cette semaine » ne contient **aucun** mot « Validé » ni « Terminée » ;
5. **toute minuterie guidée est refusée** : « Lancer 30 secondes » (Récupération → Mobilité & stretching) ouvre la modale **« Clôturer votre séance — 1 séries réalisées et déjà sauvegardées »** au lieu de démarrer le chrono.

Mesures relevées (profil Émilie, semaine 1 = jeudi 24 septembre 2026, sessions générées par l'application elle-même) :

| Moment | Bouton principal | Écran de séance | Programmes terminés | Minuteur |
| --- | --- | --- | --- | --- |
| Semaine 1 (24/09) | « Lancer la séance » | démarre normalement, 1 série validée | 0 | le chrono de repos démarre |
| Semaine 5 (22/10) | « Reprendre ma séance » | séance du 24/09, 1/29 séries, 40320:00 | 0 | refusé → modale de clôture |
| Semaine 9 (19/11) | « Reprendre ma séance » | séance du 24/09, 1/29 séries | 0 | refusé → modale de clôture |

Autrement dit : la séance de la semaine 1 **bloque indéfiniment** le programme et le chronomètre, et c'est elle — pas un exercice du jour — qui apparaît « validée ».

## Cause dans le code livré

Deux règles du code publié se combinent, sans aucune limite de date :

- à l'ouverture d'une séance planifiée : `startWorkout` reprend d'office `p.workout` s'il existe ;
- au lancement d'une minuterie : `setTimer` refuse toute minuterie dont le type n'est ni `rest` ni `warmup` quand `p.workout` existe, et ouvre la modale de clôture.

La fonction `md(...)` ne réécrit la séance planifiée (date réelle, statut, `performedDate`) **que lorsqu'une séance est clôturée** (`Terminer` → statut `completed`/`partial`, ajout à l'historique). Rien ne clôture une séance oubliée : elle reste `inProgress` pour toujours.

Ce qui **n'est pas** la cause : les séances terminées des semaines précédentes n'écrivent jamais dans les séances futures (`md` n'agit que sur la séance planifiée liée à la séance clôturée, et aucune séance terminée ne porte de date postérieure). Aucune autre écriture ne touche `sessions` après la clôture.

## Ce que je propose (rien n'est appliqué)

1. **Clôture automatique honnête** : à l'ouverture de l'application un jour différent de la date de début de la séance en cours, clôturer cette séance en **« partielle »** (ses séries déjà validées sont conservées exactement comme la modale « Terminer » le fait : date de départ mémorisée, `performedDate`, statut), puis proposer la séance du jour.
2. **Ou, au minimum, choisir explicitement** : à l'ouverture du lendemain, demander « Continuer la séance du 24/09 » ou « La clôturer comme partielle ». Le comportement par défaut change, donc je ne le décide pas seul.
3. **Corriger aussi l'affichage du compteur** (40320:00), laissé en l'état pour l'instant : c'est le même défaut d'affichage hérité que les durées en secondes de la modale combinée.

À vérifier avec Émilie : sa séance des premières semaines est-elle **encore dans « Reprendre ma séance »**, ou bien a-t-elle réussi à la clôturer entre-temps ? Si elle l'a clôturée, le blocage doit avoir disparu — sinon il reste une seconde cause à chercher.

## Consigné

Groupe ouvert `session-never-closed-blocks-program-and-timers` (`review/findings.json`, 48 groupes ouverts). Aucun exercice promu ; aucun groupe fermé.
