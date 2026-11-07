# Dos #15 — Tractions supination : vidéo déposée

Yanis a déposé `1793978523009.mp4` au commit `9c28db6` pour le #15. Selon son accord permanent, la vidéo est intégrée **telle quelle**, sans demander de confirmation ni de nouvelle vidéo, au statut `coached`. Le GIF existant est conservé en repli et la programmation est inchangée : 5 séries `6,6,6,8,8`, tempo `4010`, 90 secondes de repos.

- Source et copies `public/videos/tractions-supination-chin-up.mp4` et `release/videos/tractions-supination-chin-up.mp4` : SHA-256 `f025311d69ba5e3a197e2f0274811f816dd5c654d986f81cf1a5f674753ac38b`.
- Vidéo verticale 416 × 640, 24 images/s, 121 images décodées sur 121, environ 5,04 s ; filigrane PixVerse visible par moments. [Planche de contrôle : dix instants](./controle-dos-15/1793978523009-dix-instants.jpg).
- La supination des deux mains n'est pas clairement vérifiable, le mouvement paraît asymétrique et un coude s'écarte. La descente est plus rapide que les quatre secondes du tempo. Le descriptif et la voix rappellent les paumes vers le visage, une traction symétrique, les coudes près du buste et le tempo prescrit, sans présenter ces détails comme correctement démontrés par la vidéo.
- Ces observations concernent le support déposé ; elles ne constituent pas une demande de le refaire. Les essais antérieurs de photo #15 non conformes ne sont pas proposés comme référence correcte.

## Vérifications

- Tests Node : **238 réussis, 0 échec, 2 ignorés**, incluant l'attribution, les copies, le GIF, la programmation et la voix de #15. Build web réussi.
- Le serveur du build retourne HTTP 200 pour la page, la vidéo, son poster et le GIF d'origine.
- Le parcours Playwright du lot n'a pas pu démarrer : Chromium n'est pas installé dans l'environnement. La lecture réelle en navigateur reste donc à vérifier. Aucun APK produit.
