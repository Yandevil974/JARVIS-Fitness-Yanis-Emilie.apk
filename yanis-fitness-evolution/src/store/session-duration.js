import { num } from '../engine/utils.js';

// The timer records wall-clock time, not necessarily time actually trained.
// Preserve suspicious values separately rather than inventing an active duration.
export const MAX_SESSION_DURATION_SEC = 86400;
export function preserveUncertainSessionDuration(session) {
  const seconds = num(session.durationSec);
  if (seconds == null || seconds <= MAX_SESSION_DURATION_SEC) return false;
  const existing = session.durationReview;
  session.durationReview = {
    reason: 'duration-over-24h',
    originalSeconds: session.durationSec,
    ...(existing == null ? {} : { previous: existing }),
  };
  session.durationSec = null;
  return true;
}
