// Capteurs cardio BLE (port exact de la 1.5.0) : Web Bluetooth sur le service
// standard heart_rate (0x180D), batterie via battery_service (0x180F), zones
// Tanaka (208 − 0,7 × âge). Aucune donnée inventée : sans capteur, rien.
const HEART_RATE_SERVICE = "heart_rate",
  HEART_RATE_MEASUREMENT = "heart_rate_measurement",
  BATTERY_SERVICE = "battery_service",
  BATTERY_LEVEL = "battery_level";
function bluetoothExposed() {
  return (
    typeof navigator < "u" &&
    !!navigator.bluetooth &&
    typeof navigator.bluetooth.requestDevice === "function"
  );
}
function secureContext() {
  return typeof window === "undefined" ? false : !!window.isSecureContext;
}
export function bluetoothAvailability() {
  return bluetoothExposed()
    ? secureContext()
      ? {
          ok: true,
          reason:
            "Compatible : appairez une ceinture ou une montre diffusant le service cardio standard.",
        }
      : {
          ok: false,
          reason:
            "Une connexion sécurisée (HTTPS) est nécessaire pour appairer un capteur.",
        }
    : {
        ok: false,
        reason:
          "Le Bluetooth web n’est pas exposé ici. Sur Android, l’application doit être ouverte dans Chrome ; la WebView embarquée ne le fournit pas. Vous pouvez importer un export de votre montre à la place.",
      };
}
// Décodage Heart Rate Measurement (Bluetooth SIG) : bpm, contact, énergie,
// intervalles RR (1024e-3 s → ms).
export function parseHeartRateMeasurement(view) {
  const flags = view.getUint8(0),
    format = flags & 1,
    bpm = format ? view.getUint16(1, true) : view.getUint8(1);
  let offset = format ? 3 : 2;
  const contact = (flags >> 2) & 1 ? !!((flags >> 1) & 1) : null;
  let energy = null;
  if ((flags >> 3) & 1) {
    energy = view.getUint16(offset, true);
    offset += 2;
  }
  const rr = [];
  if ((flags >> 4) & 1)
    while (offset + 1 < view.byteLength) {
      rr.push(Math.round((view.getUint16(offset, true) / 1024) * 1000));
      offset += 2;
    }
  return { bpm, contact, energy, rr };
}
export function heartRateZones(age) {
  if (!Number.isFinite(age) || age < 10 || age > 100) return null;
  const max = Math.round(208 - 0.7 * age),
    zone = (index, name, minR, maxR, color, intent) => ({
      index,
      name,
      min: Math.round(max * minR),
      max: Math.round(max * maxR),
      color,
      intent,
      hrMax: max,
    });
  return [
    zone(1, "Récupération", 0.5, 0.6, "blue", "Retour au calme, échauffement."),
    zone(2, "Endurance", 0.6, 0.7, "mint", "Base aérobie, brûlage des graisses."),
    zone(3, "Tempo", 0.7, 0.8, "amber", "Endurance active, allure soutenable."),
    zone(4, "Seuil", 0.8, 0.9, "amber", "Seuil lactique, effort dur et tenu."),
    zone(5, "Maximal", 0.9, 1.02, "red", "Intervalles courts, très intense."),
  ];
}
export function zoneForHeartRate(bpm, age) {
  const zones = heartRateZones(age);
  if (!zones || !Number.isFinite(bpm) || bpm < zones[0].min) return null;
  return zones.find((z) => bpm >= z.min && bpm < z.max) || zones.at(-1);
}
export async function connectWearable(onSample, onDisconnect) {
  const availability = bluetoothAvailability();
  if (!availability.ok) throw new Error(availability.reason);
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
    } catch (e2) {}
    throw new Error(
      `${device.name || "Cet appareil"} ne diffuse pas le service cardio Bluetooth standard. Les Galaxy Watch ne le font pas nativement : installez sur la montre une application de diffusion (par exemple « Heart for Bluetooth »), lancez-la, puis relancez l’appairage.`,
    );
  }
  const characteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT),
    onValue = (event) => {
      try {
        const sample = parseHeartRateMeasurement(event.target.value);
        onSample?.({ ...sample, at: Date.now() });
      } catch (e) {}
    };
  characteristic.addEventListener("characteristicvaluechanged", onValue);
  await characteristic.startNotifications();
  let battery = null;
  try {
    battery = (
      await (
        await (await server.getPrimaryService(BATTERY_SERVICE)).getCharacteristic(BATTERY_LEVEL)
      ).readValue()
    ).getUint8(0);
  } catch (e) {}
  const onGone = () => onDisconnect?.();
  device.addEventListener("gattserverdisconnected", onGone);
  return {
    name: device.name || "Capteur cardio",
    id: device.id,
    battery,
    async stop() {
      try {
        characteristic.removeEventListener("characteristicvaluechanged", onValue);
        device.removeEventListener("gattserverdisconnected", onGone);
        await characteristic.stopNotifications().catch(() => {});
        if (device.gatt.connected) device.gatt.disconnect();
      } catch (e) {}
    },
  };
}
