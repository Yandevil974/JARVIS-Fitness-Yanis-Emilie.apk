import css from "./home.css";

// Presentation only. All existing boards and the original workout card are passed
// by the complete application; there is no second store or business-rule engine.
export function createHome({ React, useApp, Icon }) {
  const { useEffect, useState } = React;
  function Orb() {
    const { p, modal } = useApp();
    const [paused, setPaused] = useState(false);
    const [hidden, setHidden] = useState(document.hidden);
    const [reduced, setReduced] = useState(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    useEffect(() => {
      const media = matchMedia("(prefers-reduced-motion: reduce)");
      const preference = () => setReduced(media.matches),
        visibility = () => setHidden(document.hidden);
      media.addEventListener("change", preference);
      document.addEventListener("visibilitychange", visibility);
      return () => {
        media.removeEventListener("change", preference);
        document.removeEventListener("visibilitychange", visibility);
      };
    }, []);
    const limited = reduced || !!p.preferences.reducedMotion;
    const suspended =
      hidden || !!modal || !!(p.timer && !p.timer.done && !p.timer.paused);
    return (
      <div
        className="jh-orb-control"
        data-paused={paused || limited || suspended}
      >
        <div className="jh-orb" aria-hidden="true">
          <div className="jh-orb-grid" />
          <div className="jh-ring outer" />
          <div className="jh-ring middle" />
          <div className="jh-ring inner" />
          <div className="jh-core" />
          <span>J / E</span>
          <i className="jh-cross" />
          <i className="jh-cross vertical" />
        </div>
        <span className="jh-orb-label">JARVIS · MODE LOCAL</span>
        <button
          className="jh-orb-toggle"
          disabled={limited || suspended}
          aria-pressed={paused}
          onClick={() => setPaused((v) => !v)}
          aria-label={
            paused ? "Animer l’orbe JARVIS" : "Mettre l’orbe JARVIS en pause"
          }
        >
          {limited
            ? "Mouvements réduits"
            : suspended
              ? "Animation suspendue"
              : paused
                ? "Animer l’orbe"
                : "Pause de l’orbe"}
        </button>
      </div>
    );
  }
  function Layout({
    heading,
    session,
    point,
    followup,
    adaptation,
    appointments,
    notifications,
    dashboard,
    footer,
  }) {
    const { p, state, switchProfile, navigate, setModal } = useApp();
    const activeTimer = !!(p.timer && !p.timer.done);
    return (
      <div className="jh-home">
        <style>{css}</style>
        {(p.workout || activeTimer) && (
          <section className="jh-active" aria-label="Activité en cours">
            <strong>
              {p.workout ? "Une séance est en cours." : "Un chrono est ouvert."}
            </strong>
            {p.workout && (
              <button onClick={() => navigate("training")}>
                Revenir à la séance
              </button>
            )}
            {activeTimer && (
              <button onClick={() => setModal({ type: "timer" })}>
                {p.timer.paused ? "Reprendre le chrono" : "Voir le chrono"}
              </button>
            )}
          </section>
        )}
        <div className="jh-brand">
          <span aria-hidden="true">
            Y<span>/</span>E
          </span>
          <strong>
            YANIS FITNESS<small>EVOLUTION</small>
          </strong>
        </div>
        <div className="jh-profile-strip">
          <div className="jh-profiles" aria-label="Choisir le profil">
            {Object.values(state.profiles).map((person) => (
              <label key={person.id}>
                <input
                  type="radio"
                  name="jh-profile"
                  checked={person.id === p.id}
                  onChange={() => switchProfile(person.id)}
                />
                <span>
                  {person.user.name ||
                    (person.id === "elite" ? "Yanis" : "Émilie")}
                </span>
              </label>
            ))}
          </div>
          <span>Données locales</span>
        </div>
        <div className="jh-welcome">
          {heading}
          <Orb key={p.id} />
        </div>
        <div className="jh-first">{session}</div>
        <div className="jh-focus">
          {point}
          {followup}
        </div>
        <div className="jh-programme">
          <button onClick={() => navigate("program", "source")}>
            <Icon name="CalendarDays" size={18} />
            Mon programme
            <Icon name="ArrowRight" size={18} />
          </button>
        </div>
        <div className="jh-services">
          {appointments}
          {adaptation}
          {notifications}
        </div>
        <div className="jh-preserved">
          {dashboard}
          {footer}
        </div>
      </div>
    );
  }
  return { Layout };
}
