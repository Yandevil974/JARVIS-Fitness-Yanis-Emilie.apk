import { Capacitor, registerPlugin } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { App as AndroidApp } from "@capacitor/app";
export const isAndroid = () => Capacitor.getPlatform() === "android";
export const NativeSpeech = registerPlugin("JarvisSpeech");
export { AndroidApp };
export const voiceAvailable = () => isAndroid() || !!globalThis.speechSynthesis;
export async function nativeSnapshots() {
  if (!isAndroid()) return [];
  const result = [];
  for (const path of ["jarvis/state.json", "jarvis/previous.json"]) {
    try {
      const file = await Filesystem.readFile({
        path,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      result.push({ source: "Android · " + path, raw: file.data });
    } catch (e) {}
  }
  return result;
}
export async function persistNative(state) {
  if (!isAndroid()) return false;
  const options = {
    directory: Directory.Data,
    encoding: Encoding.UTF8,
    recursive: true,
  };
  try {
    let previous;
    try {
      previous = await Filesystem.readFile({
        path: "jarvis/state.json",
        ...options,
      });
    } catch (e) {}
    if (previous)
      await Filesystem.writeFile({
        path: "jarvis/previous.json",
        data: previous.data,
        ...options,
      });
    await Filesystem.writeFile({
      path: "jarvis/state.json",
      data: JSON.stringify(state),
      ...options,
    });
    return true;
  } catch (e) {
    return false;
  }
}
export async function nativeExport(name, content) {
  const safe = name.replace(/[^A-Za-z0-9._À-ÿ-]/g, "-");
  const result = await Filesystem.writeFile({
    path: "exports/" + safe,
    data: typeof content === "string" ? content : JSON.stringify(content),
    directory: Directory.Cache,
    encoding: Encoding.UTF8,
    recursive: true,
  });
  await Share.share({
    title: "JARVIS · " + name,
    url: result.uri,
    dialogTitle: "Enregistrer ou partager votre sauvegarde",
  });
  return true;
}
export async function tactile() {
  if (isAndroid())
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (e) {}
}

export const NativeBackup = registerPlugin("JarvisBackup");
export async function bundledProfileBackup() {
  if (!isAndroid()) return null;
  try {
    const result = await NativeBackup.readBundled();
    if (result.uri) {
      const response = await fetch(Capacitor.convertFileSrc(result.uri));
      if (!response.ok) return null;
      return await response.json();
    }
    return result.text ? JSON.parse(result.text) : null;
  } catch (e) {
    return null;
  }
}
