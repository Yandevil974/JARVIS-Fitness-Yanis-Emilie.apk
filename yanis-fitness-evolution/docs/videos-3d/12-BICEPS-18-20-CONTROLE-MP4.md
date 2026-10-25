# Biceps #18 à #20 — contrôle des trois MP4 reçus

Date : 25/10/2026
Sources : commit utilisateur `c2f6012` (`Add files via upload`).
Statut : **sources contrôlées ; aucune vidéo #18→#20 n'est encore intégrée. Aucun statut `coached` ou `validated` n'est attribué.**

Les trois fichiers sont conservés dans `controle-18-20/` sans écraser les
originaux de la racine. Les GIF du catalogue restent les fallbacks et
l'application 1.11.0 n'est pas modifiée par cet audit.

## Métadonnées et décodage

| Exercice | Source d'origine | Dimensions / cadence | Frames décodées | Durée | SHA-256 |
|----------|------------------|----------------------|-----------------|-------|---------|
| #18 — Curl concentration | `1792904456041.mp4` | 640×480 · 24 i/s | **97/97** | 4,042 s | `8aa0a68e1b6c5ee47d6b7365d195382f7d4df27319052c53a129424188e3da1f` |
| #19 — Curl incliné neutre 1¼ | `1792904486945.mp4` | 640×480 · 24 i/s | **97/97** | 4,042 s | `9769fe9829c5f998325569af01c8c7112ee2cc6f0a4000ed145a82745590b94e` |
| #20 — Curl barre | `1792904707898.mp4` | 640×480 · 24 i/s | **97/97** | 4,042 s | `4bbc60bb16a092f0426d095b69d6d17e74757022ac4cc0948747bd4b67655784` |

Tous les fichiers sont lisibles du début à la fin. La lisibilité technique ne
vaut pas validation du mouvement.

## Synthèse des décisions

| # | Points conformes observés | Réserves bloquantes ou importantes | Décision proposée |
|---|---------------------------|-------------------------------------|-------------------|
| #18 | Un cycle bas–haut–bas, un bras actif, appui contre la cuisse, main libre stable, retour bas et caméra fixe. | Tempo `3010` non respecté, pauses visibles aux extrémités, apparence de l'haltère et halo fluctuants, filigrane PixVerse. | **Intégration `coached` possible uniquement avec accord de Yanis**, poster de référence et audio de tempo. Jamais `validated` pour cette source. |
| #19 | Banc incliné, deux haltères, prise neutre globalement lisible, positions haute et basse présentes. | **Pas de retour en bas après le quart**, remontée complète immédiate, puis deuxième cycle. Durée de 4 s au lieu des 6 s demandées ; tempo `3210` et méthode 1¼ non démontrés. | **À régénérer.** Ne pas présenter cette source comme une démonstration du 1¼. GIF conservé en attendant. |
| #20 | Barre droite et prise supinée lisibles au début ; une descente et une remontée sont visibles. | Cycle initial trop rapide, puis marche vers un banc/rack, changement de cadrage et de décor, fin penchée hors curl et absence de boucle haute. | **À régénérer.** GIF conservé ; aucune intégration de cette source. |

---

## #18 — Curl concentration

Preuves :
[six instants](./controle-18-20/biceps-18-six-instants.jpg) ·
[zooms bras, main et haltère](./controle-18-20/biceps-18-zooms.jpg) ·
[source](./controle-18-20/biceps-18-source-1792904456041.mp4)

### Ce qui est réellement visible

- Départ bas avec un haltère, bras de travail contre l'intérieur de la cuisse
  et autre main posée sur la cuisse opposée.
- Montée vers le haut autour de 0,8→1,6 s, stationnarité haute jusqu'à environ
  2,4 s, puis descente et retour bas à 4,0 s.
- Un seul bras travaille et le cycle revient bien à la position basse.
- La caméra et le décor restent globalement fixes.

### Réserves

- Le tempo demandé était **1 s de montée puis 3 s de descente, sans pause** ;
  la source laisse environ 0,8 s au bas, marque un arrêt en haut et descend
  beaucoup plus rapidement que 3 s.
- L'aspect des têtes d'haltère change pendant le mouvement et le halo
  rouge/orange n'est pas constant.
- Le filigrane `PixVerse.ai` est visible sur une partie de la source.

Ces écarts interdisent un statut `validated`. Si Yanis choisit de conserver
cette meilleure source disponible, l'intégration doit être `coached`, avec le
poster `vague1-biceps-18-concentration.jpg`, une notice ciblée et le rappel
audio « montez en une seconde, descendez en trois secondes, sans pause ».

---

## #19 — Curl haltères incliné, prise neutre, méthode 1¼ en bas

Preuves :
[six instants](./controle-18-20/biceps-19-six-instants.jpg) ·
[séquence rapprochée du quart](./controle-18-20/biceps-19-sequence-quarter.jpg) ·
[zooms de la séquence](./controle-18-20/biceps-19-zooms.jpg) ·
[source](./controle-18-20/biceps-19-source-1792904486945.mp4)

### Séquence relevée

1. La source part bien en position haute et descend jusqu'au bas vers 0,8 s.
2. Après un temps bas, les haltères remontent partiellement vers 1,5–1,6 s.
3. **Ils ne reviennent pas au bas après ce quart** : la remontée se poursuit
   directement jusqu'au haut vers 1,8–2,0 s.
4. La vidéo enchaîne ensuite une descente et une remontée supplémentaires,
  jusqu'au haut final à 4,0 s.

La séquence obtenue est donc proche de **haut → bas → montée complète avec
ralenti → deuxième curl**, et non de :

**haut → bas → quart → bas → haut, une seule fois.**

Le défaut porte sur la consigne principale de l'exercice. Une notice audio ne
doit pas masquer cette absence de retour au bas ni la deuxième répétition. La
source reste hors intégration et le GIF reste le fallback.

Pour la régénération, utiliser le prompt renforcé de
`11-BICEPS-18-20-PRODUCTION.md` et régler la durée sur **6 s au minimum** dans
l'interface, ou 8 s si seul un choix supérieur est disponible.

---

## #20 — Curl barre

Preuves :
[six instants](./controle-18-20/biceps-20-six-instants.jpg) ·
[zooms et sortie du geste](./controle-18-20/biceps-20-zooms.jpg) ·
[source](./controle-18-20/biceps-20-source-1792904707898.mp4)

### Séquence relevée

- Position haute initiale avec une barre droite, descente vers 0,8 s puis
  remontée vers 1,6 s : ce premier cycle est beaucoup trop rapide pour `3010`.
- Au lieu de terminer sur la position haute de référence, l'athlète se déplace
  ensuite vers un banc/rack.
- Le cadrage et le décor changent ; la dernière image le montre penché, hors
  posture de curl, sans boucle vers le départ.

La fin ajoute une action qui n'appartient pas à l'exercice et empêche la
lecture en boucle. La source est refusée pour l'intégration. Pour la nouvelle
tentative, conserver le prompt renforcé avec interdiction explicite de marcher,
de poser ou racker la barre et de changer de décor.

---

## État d'intégration au 25/10/2026

- #18 : **en attente du choix de Yanis** entre régénération et intégration
  `coached` avec réserves.
- #19 : **à régénérer**, GIF actif.
- #20 : **à régénérer**, GIF actif.
- `src/data/exercise-videos.js`, `public/videos/`, `release/videos/` et les
  notices/audio ne sont pas encore modifiés pour #18→#20.
- Aucun build, tag ou APK nouvelle version n'est déclenché par ce contrôle.
