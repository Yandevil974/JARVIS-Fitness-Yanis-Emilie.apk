import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import { Panel, SectionHeading, Button, Badge, Icon } from "./ui.jsx";
import {
  bluetoothAvailability,
  connectWearable,
  heartRateZones,
  zoneForHeartRate,
} from "../engine/wearable.js";
import { num } from "../engine/utils.js";
// Montre & ceinture cardio — portée de la 1.5.0 : direct Web Bluetooth, zones
// Tanaka, batterie, déconnexion surveillée. Affiche aussi la marche à suivre
// pour les Galaxy Watch (qui ne diffusent pas nativement).
export default function WearablePanel() {
  const { p, updateProfile, notify } = useApp();
  const availability = bluetoothAvailability();
  const [live, setLive] = useState(null),
    [device, setDevice] = useState(null),
    [connecting, setConnecting] = useState(false);
  const handle = useRef(null);
  const age = num(p.user.age),
    zones = age ? heartRateZones(age) : null,
    zone = live && age ? zoneForHeartRate(live.bpm, age) : null;
  useEffect(
    () => () => {
      handle.current?.stop?.();
    },
    [],
  );
  async function pair() {
    setConnecting(true);
    try {
      const h = await connectWearable(
        (s) => setLive({ ...s, at: Date.now() }),
        () => {
          setDevice(null);
          setLive(null);
          notify("Capteur déconnecté.", "info");
        },
      );
      handle.current = h;
      setDevice({ name: h.name, battery: h.battery });
      updateProfile((q) => {
        q.preferences.wearable = { name: h.name, id: h.id };
      });
      notify(`${h.name} connecté. Fréquence cardiaque en direct.`);
    } catch (e) {
      notify(e.message || "Connexion impossible.", "error");
    } finally {
      setConnecting(false);
    }
  }
  function disconnect() {
    handle.current?.stop?.();
    handle.current = null;
    setDevice(null);
    setLive(null);
    notify("Capteur déconnecté.");
  }
  return (
    <Panel className="wearable-panel">
      <SectionHeading
        title="Montre & ceinture cardio"
        subtitle="Connexion directe en Bluetooth, sans compte ni serveur."
      />
      {availability.ok ? (
        device ? (
          <div className="wearable-live">
            <div className="wearable-head">
              <div>
                <strong>{device.name}</strong>
                <small>
                  Connecté
                  {device.battery != null ? ` · batterie ${device.battery} %` : ""}
                </small>
              </div>
              <Button variant="ghost" onClick={disconnect}>
                Déconnecter
              </Button>
            </div>
            <div className="wearable-bpm">
              <span className="bpm-value">{live ? live.bpm : "—"}</span>
              <span className="bpm-unit">bpm</span>
              {zone && (
                <Badge color={zone.color}>
                  Zone {zone.index} · {zone.name}
                </Badge>
              )}
            </div>
            {live?.rr?.length > 0 && (
              <p className="wearable-rr">
                Intervalles RR reçus : variabilité exploitable pour la récupération.
              </p>
            )}
            {!age && (
              <p className="wearable-rr">
                Renseignez votre âge dans l’onglet Profil pour afficher les zones
                cardiaques.
              </p>
            )}
            {zones && (
              <ul className="wearable-zones">
                {zones.map((z) => (
                  <li key={z.index} className={zone?.index === z.index ? "active" : ""}>
                    <span>
                      Z{z.index} · {z.name}
                    </span>
                    <small>
                      {z.min}–{z.max} bpm
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <>
            <p className="wearable-intro">
              JARVIS lit le service Bluetooth standard de fréquence cardiaque
              (0x180D). Sont compatibles directement les ceintures Polar, Garmin,
              Wahoo, Decathlon, et les montres de sport qui diffusent leur cardio
              en direct.
            </p>
            <Button icon="Watch" onClick={pair} disabled={connecting}>
              {connecting ? "Recherche…" : "Connecter un capteur"}
            </Button>
          </>
        )
      ) : (
        <>
          <div className="info-line">
            <Icon name="Info" size={16} />
            <p>{availability.reason}</p>
          </div>
          <details className="wearable-samsung">
            <summary>
              <Icon name="Watch" size={14} /> Vous avez une montre Samsung Galaxy
              Watch ?
            </summary>
            <p>
              Les Galaxy Watch <strong>ne diffusent pas</strong> leur fréquence
              cardiaque en Bluetooth standard : Samsung garde le capteur pour
              Samsung Health. Aucune application ne peut contourner cela
              directement, et je préfère vous le dire plutôt que de vous laisser
              chercher.
            </p>
            <p>
              La solution qui fonctionne : installer sur la montre une application
              relais qui rediffuse le cardio comme une ceinture classique. « Heart
              for Bluetooth » (Play Store, sur la montre) est la plus utilisée et
              gratuite. Lancez-la sur la montre, laissez-la ouverte, puis
              appairez ici.
            </p>
            <p>
              Pensez à autoriser l’activité en arrière-plan pour la montre
              (Galaxy Wearable → Paramètres de la montre → Applications), sans
              quoi la diffusion se coupe au bout d’une minute.
            </p>
          </details>
          <p className="wearable-intro">
            Pour appairer malgré tout : ouvrez cette même application dans Chrome
            sur le téléphone. Le Bluetooth y est disponible, alors que la version
            installée ne l’expose pas.
          </p>
        </>
      )}
      <p className="wearable-note">
        Aucune donnée de capteur n’est inventée : si rien n’est connecté, rien
        n’est affiché. Les mesures restent sur l’appareil.
      </p>
    </Panel>
  );
}
