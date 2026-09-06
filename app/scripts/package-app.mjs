/* ============================================================
   MISE EN PAQUET DE L'APPLICATION À TÉLÉCHARGER
   ------------------------------------------------------------
   Produit un dossier unique, autonome, contenant l'application
   compilée et un mode d'emploi. Aucune installation, aucun
   serveur : on ouvre index.html dans un navigateur.

   Le résultat est écrit dans dist-app/ à la racine du dépôt,
   puis compressé en un seul fichier .zip à télécharger.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve("..");
const OUT = path.join(ROOT, "JARVIS-Fitness");
const ZIP = path.join(ROOT, "JARVIS-Fitness.zip");

if (!fs.existsSync("release/index.html")) {
  console.error("release/ est absent : lancez d'abord `npm run build`.");
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.rmSync(ZIP, { force: true });
fs.cpSync("release", OUT, { recursive: true });

const readme = `JARVIS FITNESS — Yanis & Émilie
================================

COMMENT OUVRIR L'APPLICATION
----------------------------
Ordinateur : ouvrez le fichier « index.html » dans ce dossier,
avec un double-clic. Chrome, Edge ou Firefox conviennent.

Téléphone Android : copiez le dossier entier sur le téléphone,
puis ouvrez « index.html » avec Chrome.

Rien à installer, aucun compte, aucune connexion internet.
Tout fonctionne hors-ligne.


OÙ SONT MES DONNÉES
-------------------
Vos séances, mesures et réglages sont enregistrés par le
navigateur, sur l'appareil lui-même. Rien n'est envoyé nulle part.

Conséquence importante : si vous videz les données du navigateur,
vous perdez l'historique. Utilisez « Profil → Exporter » de temps
en temps pour garder une sauvegarde.

Autre conséquence : chaque appareil a son propre historique.
Pour passer de l'un à l'autre, exportez puis réimportez.


LES DEUX PROFILS
----------------
L'application contient deux espaces indépendants, Yanis et Émilie,
avec chacun son programme, son historique et ses couleurs.
Le changement de profil se fait en haut de l'écran.


VOS DONNÉES EXISTANTES (Yanis)
------------------------------
Votre historique récupéré depuis l'ancienne application (1RM, séances,
pesées, photos) est fourni séparément, dans le fichier
« MES-DONNEES-Yanis.json ».

Il n'est volontairement pas inclus ici : ce paquet peut être partagé,
vos données personnelles non.

Importez-le au premier lancement :
Profil -> onglet Sauvegarde -> Importer une sauvegarde.
Sans cet import, l'application démarre vide.


LE BILAN 1RM
------------
C'est le point de départ : il calibre automatiquement les charges
de tous les exercices. Sans lui, les charges sont seulement
déduites de ce que vous enregistrez.

Onglet « Bilan 1RM ». Comptez cinq à huit minutes.
JARVIS vous rappellera de le refaire toutes les huit semaines.


MONTRE CONNECTÉE
----------------
Profil → Montre & ceinture cardio.

Fonctionne avec les ceintures cardio Bluetooth (Polar, Garmin,
Wahoo, Decathlon) et les montres de sport qui diffusent leur
fréquence cardiaque.

Les montres Samsung Galaxy Watch ne diffusent pas leur cardio en
Bluetooth standard. Il faut installer sur la montre une
application relais, par exemple « Heart for Bluetooth ».
Le détail est expliqué dans l'application.

Cette fonction demande Chrome et une page servie en HTTPS ou en
local : ouverte par double-clic, elle peut être indisponible.


GUIDAGE VOCAL
-------------
Pendant une séance, JARVIS annonce l'exercice, la série, la
charge, le tempo et le décompte de récupération, pour ne pas
avoir à regarder l'écran.
Réglage dans Profil → Votre expérience JARVIS.
`;
fs.writeFileSync(path.join(OUT, "LISEZ-MOI.txt"), readme);

// Compression en un seul fichier, sans dépendance externe.
try {
  execFileSync("zip", ["-r", "-q", ZIP, path.basename(OUT)], { cwd: ROOT });
} catch (e) {
  console.error("Compression impossible :", e.message);
  process.exit(1);
}

const size = (p) =>
  (fs.statSync(p).size / 1024 / 1024).toFixed(1) + " Mo";
console.log(`Dossier   : ${OUT}`);
console.log(`Archive   : ${ZIP} (${size(ZIP)})`);
