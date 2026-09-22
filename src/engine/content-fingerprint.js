// Two independent 32-bit checksums + length, for local deduplication (not a security signature).
export function contentFingerprint(value) {
  const text = String(value || "");
  let a = 2166136261,
    b = 5381;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    a = Math.imul(a ^ c, 16777619);
    b = (Math.imul(b, 33) ^ c) >>> 0;
  }
  return `${text.length}-${(a >>> 0).toString(16)}-${(b >>> 0).toString(16)}`;
}
export function canonicalJSON(value) {
  if (Array.isArray(value))
    return "[" + value.map(canonicalJSON).join(",") + "]";
  if (value && typeof value === "object")
    return (
      "{" +
      Object.keys(value)
        .sort()
        .map((k) => JSON.stringify(k) + ":" + canonicalJSON(value[k]))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}
export const dataFingerprint = (value) =>
  contentFingerprint(canonicalJSON(value));
export const photoFingerprint = (data) =>
  contentFingerprint(
    String(data)
      .replace(/^data:[^,]+,/, "")
      .replace(/\s/g, ""),
  );
