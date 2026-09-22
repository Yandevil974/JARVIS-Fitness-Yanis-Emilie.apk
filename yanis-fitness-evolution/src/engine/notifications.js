// Notifications système (port de la 1.5.0) : permission explicite, envoi
// uniquement si l’utilisateur l’a activée, jamais d’invention ni de doublon
// (tag = clé de la notification applicative).
import { isAndroid } from "../platform/native.js";
export function systemNotificationsSupported() {
  return typeof window < "u" && "Notification" in window;
}
export function systemNotificationPermission() {
  return systemNotificationsSupported() ? Notification.permission : "unsupported";
}
export async function requestSystemNotifications() {
  if (!systemNotificationsSupported())
    return {
      ok: false,
      state: "unsupported",
      message: isAndroid()
        ? "Ce système Android ne fournit pas de notifications à l’application. Les alertes dans l’application restent actives."
        : "Ce navigateur ne propose pas les notifications système. Les alertes dans l’application restent actives.",
    };
  if (Notification.permission === "granted")
    return { ok: true, state: "granted", message: "Notifications système activées." };
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
export function sendSystemNotification(
  title,
  body,
  { tag, enabled = true } = {},
) {
  if (!enabled || !systemNotificationsSupported()) return false;
  if (Notification.permission !== "granted") return false;
  try {
    const n = new Notification(title, {
      body,
      tag,
      icon: "/app-icon.png",
      badge: "/favicon.svg",
      silent: false,
    });
    n.onclick = () => {
      try {
        window.focus();
        n.close();
      } catch (e) {}
    };
    return true;
  } catch (e) {
    return false;
  }
}
export function sendTestNotification() {
  return sendSystemNotification(
    "JARVIS · Test",
    "Les notifications système fonctionnent. Vous recevrez vos rappels de séance ici.",
    { tag: "jarvis-test" },
  );
}
