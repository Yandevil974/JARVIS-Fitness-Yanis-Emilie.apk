/* ============================================================
   NOTE
   ------------------------------------------------------------
   La signature d'un APK est implémentée en Python (tools/apksign.py)
   car elle demande des primitives cryptographiques (PKCS#7, RSA,
   X.509) absentes de l'environnement Node de ce projet.

   Ce fichier ne sert que de point d'entrée documentaire :

     python3 tools/apksign.py <apk-non-signe> <apk-signe> [keystore.pem]

   Voir tools/apksign.py pour le détail du format.
   ============================================================ */
console.log(
  "Utilisez : python3 tools/apksign.py <apk-non-signe> <apk-signe> [cle.pem]",
);
