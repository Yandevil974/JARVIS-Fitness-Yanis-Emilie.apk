import fs from "node:fs";
import path from "node:path";
import {
  migrateLegacy,
  initialState,
  validateState,
} from "../src/store/model.js";
import { restorationSummary } from "../src/store/restoration.js";
const input =
  process.env.JARVIS_BACKUP_JSON ||
  path.resolve("../uploads/transformation_12_mois_sauvegarde.json");
const target = "android/app/src/main/assets/restoration/yanis-profile.json";
if (!fs.existsSync(input)) {
  fs.rmSync(target, { force: true });
  console.log(
    "APK standard : aucun JSON personnel ajouté. Import disponible dans Profil.",
  );
} else {
  const raw = JSON.parse(fs.readFileSync(input, "utf8"));
  if (
    String(raw.profil?.nom || "")
      .trim()
      .toLowerCase() !== "yanis"
  )
    throw new Error(
      "La sauvegarde native de ce projet est réservée au profil Yanis. Utilisez l’import explicite pour un autre profil.",
    );
  const p = migrateLegacy(raw, "elite"),
    root = initialState();
  root.profiles.elite = p;
  validateState(root);
  const backup = {
    format: "jarvis-profile",
    schemaVersion: 3,
    profileId: "elite",
    profile: p,
    sourceFile: path.basename(input),
    sourceFingerprint: p.sourceDataFingerprint,
  };
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(backup));
  fs.mkdirSync(".private", { recursive: true });
  fs.writeFileSync(
    ".private/yanis-restored-profile.json",
    JSON.stringify(backup),
  );
  fs.writeFileSync(
    ".private/restoration-summary.json",
    JSON.stringify(restorationSummary(backup), null, 2),
  );
  console.log(
    "APK personnel : sauvegarde Yanis ajoutée dans les assets natifs privés, pas dans le site public.",
  );
}
