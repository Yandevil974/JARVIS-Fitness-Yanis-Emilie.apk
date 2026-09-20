import { tasks, encode } from "./engine.mjs";
// One writer, immutable task snapshots captured BEFORE any asynchronous work.
export function createController({ native, isAndroid, encodePlan = encode }) {
  let queue = Promise.resolve(),
    token = null,
    revision = 0,
    applied = null;
  let state = {
    supported: false,
    pending: false,
    enabled: { elite: false, emilie: false },
    error: "",
    permission: false,
  };
  const listeners = new Set();
  const publish = (patch) => {
    state = { ...state, ...patch };
    for (const f of listeners) f(state);
  };
  const supported = () => !!isAndroid() && !!native;
  function write(operation) {
    if (!supported()) return Promise.resolve(null);
    const result = queue.then(async () => {
      publish({ pending: true, error: "" });
      try {
        if (!token) {
          const begin = await native.begin();
          if (begin.protocol !== 1 || typeof begin.token !== "string")
            throw Error("Module de rappels incompatible.");
          token = begin.token;
        }
        const value = await operation();
        if (value) publish({ ...value, supported: true });
        return value;
      } catch (error) {
        applied = null;
        publish({
          error:
            error?.message ||
            "Impossible de mettre à jour les rappels Android.",
        });
        return null;
      } finally {
        publish({ pending: false });
      }
    });
    queue = result.catch(() => {});
    return result;
  }
  const envelope = () => ({ token, revision: ++revision });
  return {
    getSnapshot: () => state,
    subscribe(f) {
      listeners.add(f);
      return () => listeners.delete(f);
    },
    refresh: () => write(() => native.status()),
    sync(store, day) {
      let snapshot;
      try {
        snapshot = { plan: tasks(store, day) };
      } catch (error) {
        snapshot = { error };
      }
      return write(async () => {
        if (snapshot.error) {
          applied = null;
          await native.replace({ ...envelope(), jobs: [] });
          throw snapshot.error;
        }
        const signature = JSON.stringify(snapshot.plan);
        if (signature === applied) return null;
        let jobs;
        try {
          jobs = await encodePlan(snapshot.plan);
        } catch (error) {
          applied = null;
          await native.replace({ ...envelope(), jobs: [] });
          throw error;
        }
        const value = await native.replace({ ...envelope(), jobs });
        applied = signature;
        return value;
      });
    },
    permission: () => write(() => native.requestPermission()),
    enable(profile, enabled) {
      if (
        !["elite", "emilie"].includes(profile) ||
        typeof enabled !== "boolean"
      )
        return Promise.resolve(null);
      return write(() =>
        native.setEnabled({ ...envelope(), profile, enabled }),
      );
    },
    test: () => write(() => native.test()),
    openSettings: () => write(() => native.openSettings()),
  };
}
