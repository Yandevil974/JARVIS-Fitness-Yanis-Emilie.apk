// Persist only opaque platform voice IDs, not voice objects or recorded audio.
export const RATES = [0.8, 0.9, 0.98, 1.1, 1.2];
export function playbackSettings(raw = {}) {
  const id = value => typeof value === 'string' && value.length <= 512 ? value : '';
  return { silent: raw?.silent === true,
    rate: RATES.includes(Number(raw?.rate)) ? Number(raw.rate) : 0.98,
    voiceIds: { browser: id(raw?.voiceIds?.browser), android: id(raw?.voiceIds?.android) } };
}
export function browserVoices(synth) {
  const seen = new Set();
  return (synth?.getVoices?.() || []).filter(v => /^fr(?:-|$)/i.test(v.lang)).flatMap(v => {
    const id = v.voiceURI || v.name;
    if (!id || seen.has(id)) return [];
    seen.add(id);
    return [{ id, name: v.name || id, lang: v.lang, networkRequired: v.localService === false }];
  });
}
