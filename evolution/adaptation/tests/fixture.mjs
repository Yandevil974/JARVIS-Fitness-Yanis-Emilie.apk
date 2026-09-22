// Synthetic data only. The original library and store remain the host's source of truth.
export const day = "2026-09-20";
export function session(
  id,
  date,
  { reps = 12, rpe = 7, rir = 3, weight = 50 } = {},
) {
  return {
    id,
    date,
    status: "completed",
    name: "Séance de test",
    durationSec: 1200,
    rpe: 7,
    source: "custom",
    phase: "Test",
    method: "Séries classiques",
    deload: false,
    exercises: [
      {
        exerciseId: "squat",
        unit: "kg total",
        targetSets: 3,
        repsLow: 8,
        repsHigh: 12,
        rest: 120,
        tempo: "3010",
        blockIndex: 0,
        repScheme: "8-12",
        setScheme: "3",
        deload: false,
        sets: [0, 1, 2].map((i) => ({
          id: id + "-" + i,
          completed: true,
          weight,
          reps,
          rpe,
          rir,
          unit: "kg total",
        })),
      },
    ],
  };
}
export function profile() {
  return {
    id: "elite",
    user: { name: "Yanis", increment: 2.5 },
    sessions: [session("old", "2026-09-10"), session("new", "2026-09-17")],
    checkIns: {
      [day]: { painReported: false },
      "2026-09-10": { painReported: false },
      "2026-09-17": { painReported: false },
    },
    teamReviews: [],
    appointments: { records: {} },
    plan: { id: "untouched", sessions: [] },
    workout: null,
    forceTests: [],
    activities: [],
    measurements: [],
    photos: [],
  };
}
