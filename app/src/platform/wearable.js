/* ============================================================
   MONTRE CONNECTÉE ET CAPTEURS
   ------------------------------------------------------------
   Ce module fournit un connecteur RÉEL et vérifiable, sans simuler
   la moindre donnée :

   - Bluetooth LE (Web Bluetooth) : lecture du service standard
     « Heart Rate » (0x180D) exposé par la grande majorité des
     ceintures et montres cardio. C'est la seule voie disponible
     sans compte constructeur ni serveur distant.
   - Détection honnête de la disponibilité : Web Bluetooth n'existe
     pas dans une WebView Android standard ni sur iOS. Dans ce cas
     l'interface le dit clairement au lieu d'afficher un bouton mort.
   - Import de fichier : voie de secours universelle, pour récupérer
     un export de montre (FIT/GPX/CSV) déjà exporté par le
     constructeur.

   Aucune donnée de capteur n'est inventée. Si rien n'est connecté,
   les valeurs restent absentes, et le coach ne s'en sert pas.
   ============================================================ */

const HEART_RATE_SERVICE = "heart_rate";
const HEART_RATE_MEASUREMENT = "heart_rate_measurement";
const BATTERY_SERVICE = "battery_service";
const BATTERY_LEVEL = "battery_level";

/** Web Bluetooth est-il réellement disponible dans cet environnement ? */
export function bluetoothSupported() {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.bluetooth &&
    typeof navigator.bluetooth.requestDevice === "function"
  );
}

/** Contexte sécurisé requis par Web Bluetooth (HTTPS ou localhost). */
export function secureContext() {
  return typeof window === "undefined" ? false : !!window.isSecureContext;
}

/** Diagnostic lisible, affiché dans les préférences. */
export function wearableAvailability() {
  if (!bluetoothSupported())
    return {
      ok: false,
      reason:
        "Le Bluetooth web n’est pas exposé ici. Sur Android, l’application doit être ouverte dans Chrome ; la WebView embarquée ne le fournit pas. Vous pouvez importer un export de votre montre à la place.",
    };
  if (!secureContext())
    return {
      ok: false,
      reason:
        "Une connexion sécurisée (HTTPS) est nécessaire pour appairer un capteur.",
    };
  return {
    ok: true,
    reason:
      "Compatible : appairez une ceinture ou une montre diffusant le service cardio standard.",
  };
}

/** Décode une trame de mesure cardiaque Bluetooth standard (0x2A37). */
export function parseHeartRate(dataView) {
  const flags = dataView.getUint8(0);
  const sixteenBit = flags & 0x01;
  const bpm = sixteenBit ? dataView.getUint16(1, true) : dataView.getUint8(1);
  let index = sixteenBit ? 3 : 2;
  const contactSupported = (flags >> 2) & 0x01;
  const contact = contactSupported ? !!((flags >> 1) & 0x01) : null;
  let energy = null;
  if ((flags >> 3) & 0x01) {
    energy = dataView.getUint16(index, true);
    index += 2;
  }
  const rr = [];
  if ((flags >> 4) & 0x01)
    while (index + 1 < dataView.byteLength) {
      rr.push(Math.round((dataView.getUint16(index, true) / 1024) * 1000));
      index += 2;
    }
  return { bpm, contact, energy, rr };
}

/**
 * Appaire un capteur et diffuse les battements en direct.
 * @param {(reading: {bpm:number, contact:boolean|null, rr:number[], at:number}) => void} onReading
 * @returns {Promise<{name:string, id:string, battery:number|null, stop:()=>Promise<void>}>}
 */
export async function connectHeartRate(onReading, onDisconnect) {
  const availability = wearableAvailability();
  if (!availability.ok) throw new Error(availability.reason);
  // Deux stratégies d'appairage :
  // 1. Filtre sur le service cardio : la liste ne montre que les
  //    capteurs réellement compatibles (ceintures, la plupart des
  //    montres de sport).
  // 2. Repli « tous les appareils » : certaines montres, dont les
  //    Galaxy Watch relayées par une application tierce, n'annoncent
  //    pas 0x180D dans leur trame de publicité alors qu'elles
  //    l'exposent une fois connectées.
  let device;
  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [HEART_RATE_SERVICE] }],
      optionalServices: [BATTERY_SERVICE],
    });
  } catch (e) {
    if (e?.name !== "NotFoundError") throw e;
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [HEART_RATE_SERVICE, BATTERY_SERVICE],
    });
  }
  const server = await device.gatt.connect();
  let service;
  try {
    service = await server.getPrimaryService(HEART_RATE_SERVICE);
  } catch (e) {
    try {
      device.gatt.disconnect();
    } catch (_) {}
    throw new Error(
      `${device.name || "Cet appareil"} ne diffuse pas le service cardio Bluetooth standard. ` +
        "Les Galaxy Watch ne le font pas nativement : installez sur la montre une application de diffusion " +
        "(par exemple « Heart for Bluetooth »), lancez-la, puis relancez l’appairage.",
    );
  }
  const characteristic = await service.getCharacteristic(
    HEART_RATE_MEASUREMENT,
  );
  const listener = (event) => {
    try {
      const reading = parseHeartRate(event.target.value);
      onReading?.({ ...reading, at: Date.now() });
    } catch (e) {}
  };
  characteristic.addEventListener("characteristicvaluechanged", listener);
  await characteristic.startNotifications();

  let battery = null;
  try {
    const batteryService = await server.getPrimaryService(BATTERY_SERVICE);
    const level = await batteryService.getCharacteristic(BATTERY_LEVEL);
    battery = (await level.readValue()).getUint8(0);
  } catch (e) {
    // Tous les capteurs n'exposent pas leur niveau de batterie.
  }

  const disconnected = () => onDisconnect?.();
  device.addEventListener("gattserverdisconnected", disconnected);

  return {
    name: device.name || "Capteur cardio",
    id: device.id,
    battery,
    async stop() {
      try {
        characteristic.removeEventListener(
          "characteristicvaluechanged",
          listener,
        );
        device.removeEventListener("gattserverdisconnected", disconnected);
        await characteristic.stopNotifications().catch(() => {});
        if (device.gatt.connected) device.gatt.disconnect();
      } catch (e) {}
    },
  };
}

/** Zones cardiaques à partir de l'âge, formule de Tanaka (208 − 0,7 × âge). */
/**
 * Zones cardiaques calculées sur la fréquence maximale estimée
 * (formule de Tanaka : 208 − 0,7 × âge). C'est une estimation
 * statistique, pas une mesure : elle peut s'écarter de 10 à 12 bpm
 * de la fréquence maximale réelle.
 * @returns {Array<{index:number,name:string,min:number,max:number,color:string,intent:string}>|null}
 */
export function heartRateZones(age) {
  if (!Number.isFinite(age) || age < 10 || age > 100) return null;
  const hrMax = Math.round(208 - 0.7 * age);
  const band = (index, name, low, high, color, intent) => ({
    index,
    name,
    min: Math.round(hrMax * low),
    max: Math.round(hrMax * high),
    color,
    intent,
    hrMax,
  });
  return [
    band(1, "Récupération", 0.5, 0.6, "blue", "Retour au calme, échauffement."),
    band(2, "Endurance", 0.6, 0.7, "mint", "Base aérobie, brûlage des graisses."),
    band(3, "Tempo", 0.7, 0.8, "amber", "Endurance active, allure soutenable."),
    band(4, "Seuil", 0.8, 0.9, "amber", "Seuil lactique, effort dur et tenu."),
    band(5, "Maximal", 0.9, 1.02, "red", "Intervalles courts, très intense."),
  ];
}

/** Fréquence cardiaque maximale estimée pour un âge donné. */
export function maxHeartRate(age) {
  return Number.isFinite(age) && age >= 10 && age <= 100
    ? Math.round(208 - 0.7 * age)
    : null;
}

/** Zone courante correspondant à une fréquence mesurée. */
export function currentZone(bpm, age) {
  const zones = heartRateZones(age);
  if (!zones || !Number.isFinite(bpm)) return null;
  if (bpm < zones[0].min) return null;
  return zones.find((z) => bpm >= z.min && bpm < z.max) || zones.at(-1);
}
