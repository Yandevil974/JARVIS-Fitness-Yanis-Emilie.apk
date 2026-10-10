# Suivi — Front squat HOMME B-04

**Date :** 2026-10-10
**État :** prévisualisation assemblée ; validation visuelle finale et intégration applicative en attente.

## Poses et livrables

- `front-squat-A.png` — pose de départ conservée, validée ; aucun changement.
- `front-squat-M.png` — candidat intermédiaire généré à partir d’un guide de pose à mi-flexion, puis raffiné en le comparant à B. La flexion des genoux et l’ouverture des jambes se situent entre A et le bas ; contrôler encore la continuité tête/barre et l’amplitude avant approbation.
- `front-squat-B.png` — nouveau candidat bas, généré à partir de A avec une référence de squat profond utilisée pour la posture seulement. Le pli de hanche est maintenant au niveau ou légèrement sous le haut des genoux, les talons restent au sol et la barre est en front rack. C’est le meilleur candidat B à ce stade ; validation visuelle finale à effectuer.
- `front-squat-homme-B-04-preview.gif` — GIF de prévisualisation, 5 images, 1376×768, boucle `A → M → B → M → A`. Durées : 0,25 s / 0,20 s / 0,50 s / 0,20 s / 0,25 s.
- `front-squat-homme-B-04-planche-validation.png` — planche de contrôle A/M/B.

La première tentative de B profond a changé le décor ; elle a été écartée au profit du candidat qui conserve la terrasse de A. Les tentatives de morphing par moyenne ou déformation locale ont également été écartées lorsqu’elles produisaient des images fantômes ou des déformations visibles.

Aucun changement n’a été fait dans `public/media/`, `src/` ou `release/`. Le GIF reste une prévisualisation source ; toute intégration est en attente de l’autorisation prévue pour cette vague HOMME.

## Références réellement consultées

Les éléments ci-dessous ont été examinés comme aperçus d’images issus de recherches, et non comme pages textuelles chargées. Les références ont servi à observer la posture uniquement ; aucune photo de référence n’est incorporée aux livrables.

| URL | Usage / constat |
| --- | --- |
| https://plt4m.com/blog/barbell-front-squat-form/ | Photo de front squat profond avec spotter, examinée lors d’un essai antérieur pour la pose basse. |
| https://www.muscleandfitness.com/workouts/workout-tips/front-squat-setup-guide-master-bar-position-elbow-drive-perfect-form/ | Front rack en cours collectif ; essayé comme guide d’un M antérieur, flexion trop faible. |
| https://getfitcraft.com/exercises/front-squats | Image trop recadrée, écartée. |
| https://www.bodbot.com/Exercises/5/Front-Squat-_-Parallel-Depth | Diagramme utile pour la profondeur, mais sans barre ni cadrage correspondant. |
| https://squatuniversity.com/2016/04/07/how-to-perfect-the-front-squat/ | Résultat sur la position haute des coudes, utilisé comme repère de rack. |
| https://strongfirst.com/the-barbell-front-squat | Résultat visuel sans rapport avec le squat, écarté. |
| https://powerliftingtechnique.com/where-should-i-put-the-bar-when-squatting/ | Résultat sur le placement de barre high-bar/low-bar, non utilisé comme guide de pose. |
| https://www.menshealth.com/uk/how-tos/a735538/front-squat/ | Démonstrations de squat goblet debout et accroupi, examinées mais non retenues pour la dernière pose basse. |
| https://powerliftingtechnique.com/front-squat/ | Résultat consulté, non retenu comme guide. |
| https://www.menshealth.com/fitness/a70792054/front-squat-leg-day/ | Squat goblet profond de face sur fond neutre ; utilisé comme guide de posture uniquement pour le nouveau candidat B. |
| https://gettyimages.com/photos/front-barbell-squat | Aperçu d’un squat partiel ; essayé comme guide de posture pour un candidat M antérieur, sans amélioration suffisante. |
| https://www.womenshealthmag.com/uk/fitness/strength-training/a63839798/front-squat/ | Aperçu d’un squat profond, examiné mais non utilisé pour les images finales. |
| https://stock.adobe.com/search?k=%22front+squat%22 | Aperçu trop recadré, écarté. |

Un guide synthétique de posture intermédiaire a aussi été généré temporairement pour le travail sur M ; il ne constitue pas une source externe et n’est pas un livrable.

Les pistes H2O Les Angles, Nutrimuscle, ForceIndex et Praticonnect figuraient dans la passation précédente, mais leurs URL n’étaient pas disponibles ici et elles n’ont pas été reconsultées pendant ce tour ; elles ne sont donc pas comptées comme sources consultées ci-dessus.

## À valider ensuite

1. Vérifier visuellement M et le passage M→B dans le GIF ; B est désormais assez bas comme candidat.
2. Si la séquence est approuvée, retirer les mentions `preview`/`validation` et demander séparément l’autorisation d’intégration applicative.
3. Après approbation, poursuivre avec les fentes bulgares haltères pied avant surélevé HOMME B-04.

## Essais de correction de M (10 octobre 2026, session Arena 83fa8373)

Constat sur la planche A/M/B : M garde la barre et le haut du corps presque à la hauteur de A, alors que B descend nettement ; le passage M→B est donc trop brusque.

- `front-squat-M2.png` — génération à partir de A et B avec consigne de mi-hauteur : résultat quasi identique à B (barre et hanches trop basses). **Rejeté.**
- `front-squat-M3.png` — génération à partir de A et B avec consigne « genoux à ~45° » : résultat presque debout, barre trop haute. **Rejeté.**
- `front-squat-M.png` — **conservé** comme M actuel (inchangé). Le GIF `front-squat-homme-B-04-preview.gif` n'a pas été régénéré.

Les deux essais utilisent uniquement A et B comme images de référence ; aucune nouvelle URL n'a été consultée, la section « Références réellement consultées » reste inchangée.

Prochaine piste : soit une nouvelle génération de M avec une autre méthode (guide de posture à mi-flexion explicitement dessiné, puis raffinement), soit validation de M actuel tel quel en acceptant la transition. Aucune intégration dans `public/media/`, `src/` ou `release/`.

### Candidat M4 (même session, 10 octobre 2026)

- `front-squat-M4.png` — nouveau candidat M, généré à partir de A, de l'ancien M et de B. Genoux plus fléchis que dans l'ancien M, hanches un peu plus basses, barre légèrement descendue, talons au sol, cadrage et décor identiques. Il reste plus proche de A que de B pour la hauteur de barre, mais la progression A→M4→B est plus continue.
- `front-squat-homme-B-04-preview-M4.gif` — prévisualisation alternative, 5 images `A → M4 → B → M4 → A`, 1376×768, durées 0,25 / 0,20 / 0,50 / 0,20 / 0,25 s (même rythme que l'original).
- `front-squat-homme-B-04-strip-M4.png` — bande comparative A / M4 / B pour contrôle visuel.

**Statut : candidat, non validé.** Le GIF et la planche d'origine (`front-squat-homme-B-04-preview.gif`, `front-squat-homme-B-04-planche-validation.png`) sont conservés sans modification. Le choix entre ancienne M et M4 reste à faire après contrôle visuel. Les essais M2 et M3 sont rejetés, comme indiqué plus haut.

Aucune source nouvelle n'a été consultée pour M4 ; la table des références reste inchangée. Aucune intégration dans `public/media/`, `src/` ou `release/`.
