/* ============================================================
   NOTIFICATIONS SYSTÈME
   ------------------------------------------------------------
   Le bouton « Notifications système » ne se contentait pas de stocker
   une préférence : il pouvait rester activé alors qu'aucune notification
   ne pouvait réellement être affichée, et l'utilisateur n'avait aucun
   retour. Ce module centralise :

   - la détection réelle de la disponibilité (navigateur / Android),
   - la demande d'autorisation et ses trois issues (accordée, refusée,
     déjà refusée définitivement),
   - l'envoi effectif, avec repli silencieux si la permission a été
     révoquée entre-temps,
   - une notification de test, pour vérifier que cela fonctionne.

   Aucune notification n'est promise lorsque l'application est fermée :
   cette version n'utilise pas de service Android permanent.
   ============================================================ */
import { isAndroid } from "./native.js";

/** Le système de notifications est-il utilisable ici ? */
export function notificationsSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

/** État courant : "unsupported" | "default" | "granted" | "denied". */
export function notificationPermission() {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Demande l'autorisation et retourne un résultat explicite.
 * @returns {Promise<{ok: boolean, state: string, message: string}>}
 */
export async function requestNotifications() {
  if (!notificationsSupported())
    return {
      ok: false,
      state: "unsupported",
      message: isAndroid()
        ? "Ce système Android ne fournit pas de notifications à l’application. Les alertes dans l’application restent actives."
        : "Ce navigateur ne propose pas les notifications système. Les alertes dans l’application restent actives.",
    };
  if (Notification.permission === "granted")
    return {
      ok: true,
      state: "granted",
      message: "Notifications système activées.",
    };
  if (Notification.permission === "denied")
    return {
      ok: false,
      state: "denied",
      message:
        "Les notifications ont été refusées pour cette application. Réautorisez-les dans les réglages du système ou du navigateur, puis réessayez.",
    };
  let permission;
  try {
    permission = await Notification.requestPermission();
  } catch (e) {
    return {
      ok: false,
      state: "error",
      message: "La demande d’autorisation n’a pas abouti. Réessayez.",
    };
  }
  return permission === "granted"
    ? { ok: true, state: "granted", message: "Notifications système activées." }
    : {
        ok: false,
        state: permission,
        message:
          "Autorisation non accordée. Les rappels restent visibles dans la cloche de l’application.",
      };
}

/**
 * Affiche une notification système si — et seulement si — la préférence
 * est active ET l'autorisation toujours valide.
 * @returns {boolean} vrai si la notification a réellement été affichée.
 */
export function pushNotification(title, body, { tag, enabled = true } = {}) {
  if (!enabled) return false;
  if (!notificationsSupported()) return false;
  if (Notification.permission !== "granted") return false;
  try {
    const notification = new Notification(title, {
      body,
      tag,
      icon: "/app-icon.png",
      badge: "/favicon.svg",
      silent: false,
    });
    notification.onclick = () => {
      try {
        window.focus();
        notification.close();
      } catch (e) {}
    };
    return true;
  } catch (e) {
    return false;
  }
}

/** Notification de vérification, déclenchée depuis les préférences. */
export function testNotification() {
  return pushNotification(
    "JARVIS · Test",
    "Les notifications système fonctionnent. Vous recevrez vos rappels de séance ici.",
    { tag: "jarvis-test" },
  );
}
