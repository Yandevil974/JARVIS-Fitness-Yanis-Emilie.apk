import Team from "./pages/Team.jsx";
import React, { useState, useEffect, useRef } from "react";
import { useApp } from "./store/AppContext.jsx";
import { Icon, IconButton, Badge, Button, Orb } from "./components/ui.jsx";
import ModalRoot from "./components/ModalRoot.jsx";
import { TimerObserver, useNow } from "./components/RestTimer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jarvis from "./pages/Jarvis.jsx";
import Training from "./pages/Training.jsx";
import Program from "./pages/Program.jsx";
import Progress from "./pages/Progress.jsx";
import Cardio from "./pages/Cardio.jsx";
import Recovery from "./pages/Recovery.jsx";
import Profile from "./pages/Profile.jsx";
import Nutrition from "./pages/Nutrition.jsx";
import Force from "./pages/Force.jsx";
import { advanceTimer } from "./engine/timer.js";
import {
  today,
  uid,
  monday,
  addDays,
  inRange,
  durationLabel,
} from "./engine/utils.js";
import { weeklyReport } from "./engine/fitness.js";
import { pushNotification } from "./platform/notifications.js";
import { reevaluationStatus } from "./engine/strength.js";
const NAV = [
  ["dashboard", "LayoutDashboard", "Accueil"],
  ["jarvis", "Sparkles", "JARVIS"],
  ["force", "Gauge", "Bilan 1RM"],
  ["training", "Dumbbell", "Entraînement"],
  ["program", "CalendarDays", "Programme"],
  ["progress", "ChartNoAxesCombined", "Progression"],
  ["cardio", "Waves", "Cardio & piscine"],
  ["recovery", "Leaf", "Récupération"],
  ["team", "UsersRound", "Mon équipe"],
];
const PAGE = {
  dashboard: Dashboard,
  jarvis: Jarvis,
  force: Force,
  training: Training,
  program: Program,
  progress: Progress,
  cardio: Cardio,
  recovery: Recovery,
  profile: Profile,
  nutrition: Nutrition,
  team: Team,
};
export default function App() {
  const {
    state,
    ready,
    p,
    page,
    navigate,
    toast,
    saving,
    storageWarning,
    setStorageWarning,
    setModal,
    sendCoach,
    updateProfile,
    bundledBackup,
    restoreDismissed,
    setRestoreDismissed,
    switchProfile,
  } = useApp();
  const [menu, setMenu] = useState(false),
    [topProfiles, setTopProfiles] = useState(false),
    [search, setSearch] = useState("");
  const searchRef = useRef();
  useEffect(() => {
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    setMenu(false);
  }, [page]);
  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      !!p?.preferences.reducedMotion,
    );
    // Les démonstrations SVG sont mises en pause sur leur première image,
    // et relancées si l'utilisateur réactive les animations.
    document.querySelectorAll(".movement-svg").forEach((s) => {
      if (p?.preferences.reducedMotion) {
        s.pauseAnimations?.();
        s.setCurrentTime?.(0);
      } else s.unpauseAnimations?.();
    });
    // Les GIF de démonstration ne peuvent pas être mis en pause par CSS :
    // on les signale pour que Movement.jsx affiche une vignette figée.
    document
      .querySelectorAll("img.movement-media")
      .forEach((img) =>
        img.classList.toggle("paused", !!p?.preferences.reducedMotion),
      );
  }, [p?.preferences.reducedMotion, page]);
  // Mode clair ou sombre, au choix, indépendant du profil.
  useEffect(() => {
    const dark = p?.preferences?.theme === "dark";
    if (dark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }, [p?.preferences?.theme]);
  // Thème par profil : Émilie reçoit la palette rose/violet de son fichier
  // source, Yanis la palette ambre/cuivre du sien. Voir styles.css.
  useEffect(() => {
    if (!p?.id) return;
    document.documentElement.dataset.profile = p.id;
    // Barre système assortie au fond du profil ET du thème.
    const dark = p.preferences?.theme === "dark";
    const color = dark
      ? p.id === "emilie"
        ? "#161013"
        : "#161310"
      : p.id === "emilie"
        ? "#fdf4f9"
        : "#fdf9f4";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, [p?.id, p?.preferences?.theme]);
  if (!ready)
    return (
      <div className="app-loading">
        <Orb />
        <strong>
          JARVIS<span>FITNESS INTELLIGENCE</span>
        </strong>
        <p>Préparation de votre espace personnel…</p>
      </div>
    );
  const Page = PAGE[page] || Dashboard;
  const label =
    NAV.find((n) => n[0] === page)?.[2] ||
    { profile: "Profil", nutrition: "Nutrition" }[page];
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Aller au contenu
      </a>
      <Sidebar menu={menu} setMenu={setMenu} />
      {menu && (
        <button
          className="sidebar-backdrop"
          onClick={() => setMenu(false)}
          aria-label="Fermer la navigation"
        />
      )}
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-title">
            <IconButton
              icon="Menu"
              label="Ouvrir la navigation"
              className="menu-trigger"
              onClick={() => setMenu(true)}
            />
            <span className="topbar-system">ESPACE PERSONNEL</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{label}</strong>
          </div>
          <form
            className="global-search"
            onSubmit={(e) => {
              e.preventDefault();
              if (!search.trim()) return;
              navigate("jarvis");
              sendCoach(
                /minutes|min\b|seance|fatigue/i.test(search)
                  ? search
                  : `exercice ${search}`,
              );
              setSearch("");
            }}
          >
            <Icon name="Search" size={16} />
            <input
              ref={searchRef}
              aria-label="Recherche globale ou commande"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un mouvement…"
            />
            <kbd>⌘ K</kbd>
          </form>
          <div className="topbar-actions">
            <span
              data-revision={state.updatedAt}
              className={`save-status ${saving.ok ? "" : "error"}`}
              title={
                saving.pending
                  ? "Enregistrement en cours"
                  : saving.ok
                    ? `Sauvegarde ${saving.mode}`
                    : "Stockage indisponible"
              }
            >
              <i />
              {saving.pending
                ? "Sauvegarde…"
                : saving.ok
                  ? "Enregistré en local"
                  : "Non sauvegardé"}
            </span>
            <span className="topbar-divider" />
            <button
              className="notification-button icon-button"
              aria-label="Ouvrir les notifications"
              onClick={() => setModal({ type: "notifications" })}
            >
              <Icon name="Bell" size={19} />
              {p.notifications.some((n) => !n.read) && <i />}
            </button>
            {/* L'avatar de la barre du haut est le point où l'on cherche
                naturellement à changer de profil. Il n'ouvrait que la
                page Profil, si bien qu'Émilie semblait absente : son
                sélecteur n'existait qu'en bas de la barre latérale,
                masquée sur téléphone. */}
            <div className="top-profile">
              <button
                className="top-avatar"
                aria-label="Changer de profil ou ouvrir mon profil"
                aria-expanded={topProfiles}
                onClick={() => setTopProfiles((v) => !v)}
              >
                {(p.user.name || "É").slice(0, 1).toUpperCase()}
              </button>
              {topProfiles && (
                <>
                  <button
                    className="top-profile-veil"
                    aria-label="Fermer"
                    onClick={() => setTopProfiles(false)}
                  />
                  <div className="profile-options top-profile-menu">
                    {["elite", "emilie"].map((id) => (
                      <button
                        key={id}
                        className={p.id === id ? "active" : ""}
                        onClick={() => {
                          switchProfile(id);
                          setTopProfiles(false);
                        }}
                      >
                        <Icon name="UserRound" size={16} />
                        <span>
                          {state.profiles[id].user.name ||
                            (id === "emilie" ? "Émilie" : "Yanis")}
                        </span>
                        {p.id === id && <Icon name="Check" size={14} />}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        navigate("profile");
                        setTopProfiles(false);
                      }}
                    >
                      <Icon name="Settings" size={16} />
                      <span>Ouvrir mon profil</span>
                    </button>
                    <small>Historiques totalement séparés</small>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        {(!saving.ok || storageWarning) && (
          <div className="persistent-warning">
            <Icon name="TriangleAlert" size={17} />
            <span>
              {storageWarning ||
                "Stockage indisponible dans cet aperçu : vos changements restent en mémoire. Exportez une sauvegarde avant de fermer."}
            </span>
            <button onClick={() => navigate("profile", "data")}>
              Sauvegarder
            </button>
            {storageWarning && (
              <button
                aria-label="Masquer l’avertissement"
                onClick={() => setStorageWarning("")}
              >
                ×
              </button>
            )}
          </div>
        )}
        {bundledBackup &&
          !restoreDismissed &&
          !state.profiles[bundledBackup.profileId].restoreReceipts?.some(
            (r) => r.fingerprint === bundledBackup.sourceFingerprint,
          ) && (
            <div className="restoration-banner">
              <Icon name="DatabaseBackup" size={22} />
              <div>
                <strong>Votre sauvegarde de Yanis est prête</strong>
                <p>
                  Retrouvez les séances, les photos, le METCON et les bilans
                  d’équipe du fichier joint.
                </p>
              </div>
              <Button
                variant="primary small"
                onClick={() =>
                  setModal({ type: "restore-profile", backup: bundledBackup })
                }
              >
                Restaurer mes données
              </Button>
              <button
                className="icon-button"
                aria-label="Masquer le rappel de restauration"
                onClick={() => setRestoreDismissed(true)}
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          )}
        <main id="main" className={`page page-${page}`} key={p.id + page}>
          <ErrorBoundary key={p.id + page}>
            <Page />
          </ErrorBoundary>
        </main>
        <div className="mobile-nav">
          {NAV.slice(0, 5).map(([id, icon, label]) => (
            <button
              className={page === id ? "active" : ""}
              key={id}
              onClick={() => navigate(id)}
              aria-label={label}
            >
              <Icon name={icon} size={20} />
              <span>{label}</span>
            </button>
          ))}
          <button onClick={() => setMenu(true)} aria-label="Autres modules">
            <Icon name="Menu" size={20} />
            <span>Plus</span>
          </button>
        </div>
      </div>
      <TimerObserver />
      <SmartNotifications />
      {p.timer && <FloatingTimer />}
      <ModalRoot />
      {toast && (
        <div className={`toast ${toast.type}`} role="status" key={toast.id}>
          <div className="toast-icon">
            <Icon
              name={
                toast.type === "record"
                  ? "Trophy"
                  : toast.type === "error"
                    ? "CircleAlert"
                    : toast.type === "info"
                      ? "Info"
                      : "CircleCheck"
              }
              size={toast.type === "record" ? 28 : 20}
            />
          </div>
          <div>
            {toast.type === "record" && <strong>NOUVEAU RECORD</strong>}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
function Sidebar({ menu, setMenu }) {
  const { state, p, page, navigate, switchProfile } = useApp();
  const [profiles, setProfiles] = useState(false);
  const go = (id, tab) => {
    navigate(id, tab);
    setMenu(false);
  };
  return (
    <aside className={`sidebar ${menu ? "open" : ""}`}>
      <button
        className="brand"
        onClick={() => go("dashboard")}
        aria-label="JARVIS, accueil"
      >
        <span className="brand-mark">
          {/* Marque volontairement sobre : un anneau ouvert (la
              progression, jamais tout à fait bouclée) et un J franc.
              L'ancien blason anguleux évoquait trop directement le
              réacteur d'un personnage de fiction. */}
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle
              cx="20"
              cy="20"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="66 22"
              transform="rotate(-58 20 20)"
              opacity="0.85"
            />
            <path
              d="M23.4 11.6V22.6C23.4 25.9 21.3 27.9 18.2 27.9C16.2 27.9 14.6 27.1 13.6 25.7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>
          <strong>
            JARVIS<span>AI</span>
          </strong>
          <small>FITNESS INTELLIGENCE</small>
        </span>
      </button>
      <div className="workspace-label">
        <span className="workspace-icon">
          <Icon name="Command" size={15} />
        </span>
        <span>Votre espace athlète</span>
        <Badge>PRO</Badge>
      </div>
      <div className="nav-section-label">VOTRE COCKPIT</div>
      <nav className="main-nav" aria-label="Navigation principale">
        {NAV.map(([id, icon, label]) => (
          <button
            key={id}
            aria-label={label}
            title={label}
            aria-current={page === id ? "page" : undefined}
            className={page === id ? "active" : ""}
            onClick={() => go(id)}
          >
            <Icon name={icon} size={19} />
            <span>{label}</span>
            {id === "jarvis" ? <small>AI</small> : page === id ? <i /> : null}
          </button>
        ))}
      </nav>
      <div className="nav-section-label essentials-label">VOS ESSENTIELS</div>
      <nav className="main-nav">
        <button
          aria-label="Nutrition"
          title="Nutrition"
          className={page === "nutrition" ? "active" : ""}
          onClick={() => go("nutrition")}
        >
          <Icon name="Utensils" size={19} />
          <span>Nutrition</span>
        </button>
        <button
          aria-label="Mon profil"
          title="Mon profil"
          className={page === "profile" ? "active" : ""}
          onClick={() => go("profile")}
        >
          <Icon name="UserRound" size={19} />
          <span>Mon profil</span>
        </button>
      </nav>
      <div className="sidebar-coach">
        <span className="sidebar-orbit">
          <Icon name="Sparkles" size={18} />
        </span>
        <strong>
          Plus intelligent.
          <br />À chaque séance.
        </strong>
        <p>
          Votre historique devient
          <br />
          votre meilleur allié.
        </p>
        <button onClick={() => go("jarvis")}>
          Échanger avec JARVIS <Icon name="ArrowUpRight" size={14} />
        </button>
      </div>
      <div className="sidebar-bottom">
        <button className="data-nav" onClick={() => go("profile", "data")}>
          <Icon name="Settings2" size={17} />
          <span>Données & paramètres</span>
        </button>
        <div className="profile-switcher">
          <button
            onClick={() => setProfiles((v) => !v)}
            aria-expanded={profiles}
            aria-label="Changer de profil"
          >
            <span className="user-avatar">
              {(p.user.name || "É").slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{p.user.name || "Profil Yanis"}</strong>
              <small>
                {p.id === "emilie" ? "ESPACE ÉMILIE" : "ESPACE YANIS"}
              </small>
            </span>
            <Icon name="ChevronsUpDown" size={15} />
          </button>
          {profiles && (
            <div className="profile-options">
              {["elite", "emilie"].map((id) => (
                <button
                  key={id}
                  className={p.id === id ? "active" : ""}
                  onClick={() => {
                    switchProfile(id);
                    setProfiles(false);
                    setMenu(false);
                  }}
                >
                  <Icon name="UserRound" size={16} />
                  <span>{state.profiles[id].user.name || "Profil Yanis"}</span>
                  {p.id === id && <Icon name="Check" size={14} />}
                </button>
              ))}
              <small>Historiques totalement séparés</small>
            </div>
          )}
        </div>
        <div className="system-status">
          <i /> JARVIS SYSTEM ONLINE <span>V 1.0.4</span>
        </div>
      </div>
    </aside>
  );
}
function FloatingTimer() {
  const { p, setModal, modal } = useApp();
  const now = useNow();
  const t = advanceTimer(p.timer, now);
  if (!t || modal?.type === "timer") return null;
  return (
    <button
      className={`floating-timer ${t.done ? "finished" : ""}`}
      onClick={() => setModal({ type: "timer" })}
    >
      <Icon name={t.done ? "CircleCheck" : "Timer"} size={20} />
      <div>
        <strong>
          {t.done ? "Chrono terminé" : durationLabel(t.remaining)}
        </strong>
        <span>
          {t.done
            ? "Confirmer / fermer"
            : t.paused
              ? "En pause"
              : t.meta.type === "rest"
                ? "Récupération"
                : t.meta.name}
        </span>
      </div>
      <Icon name="Maximize2" size={15} />
    </button>
  );
}
function SmartNotifications() {
  const { p, updateProfile, notify } = useApp();
  useEffect(() => {
    if (!p) return;
    const check = () => {
      const current = Date.now();
      for (const s of p.plan?.sessions || []) {
        if (s.status !== "planned" || s.date !== today()) continue;
        const diff =
          (Date.parse(`${s.date}T${s.time || "18:00"}:00`) - current) / 60000;
        const key = `reminder-${s.id}`;
        if (
          diff > 0 &&
          diff <= 30 &&
          !p.notifications.some((n) => n.key === key)
        ) {
          const text = `${s.name} est prévue dans ${Math.ceil(diff)} minutes.`;
          updateProfile((q) => {
            if (!q.notifications.some((n) => n.key === key))
              q.notifications.unshift({
                id: uid(),
                key,
                date: today(),
                text,
                read: false,
                type: "reminder",
              });
          });
          pushNotification("JARVIS · Votre séance", text, {
            tag: key,
            enabled: p.preferences.notifications,
          });
          break;
        }
      }

      // --- Rappel de réévaluation du bilan 1RM -----------------------
      // Les charges proposées reposent sur le référentiel de force. Passé
      // le délai choisi, le coach demande de refaire le test plutôt que
      // de continuer à extrapoler sur une donnée périmée.
      const force = reevaluationStatus(p);
      if (force.due) {
        const key = `force-reval-${force.next || "initial"}`;
        if (!p.notifications.some((n) => n.key === key)) {
          const text = force.done
            ? `${force.label} Vos charges sont calculées sur un bilan du ${force.last}. Refaites le test pour qu’elles restent justes.`
            : "Aucun bilan 1RM enregistré. Vos charges sont estimées à partir de votre journal seulement. Faites le bilan pour un calcul automatique fiable.";
          updateProfile((q) => {
            if (!q.notifications.some((n) => n.key === key))
              q.notifications.unshift({
                id: uid(),
                key,
                date: today(),
                text,
                read: false,
                type: "coach",
              });
          });
          pushNotification("JARVIS · Bilan de force", text, {
            tag: key,
            enabled: p.preferences.notifications,
          });
        }
      }
    };
    check();
    const i = setInterval(check, 60000);
    return () => clearInterval(i);
  }, [p?.id, p?.plan, p?.notifications, p?.preferences.notifications]);
  useEffect(() => {
    const end = addDays(monday(), -1),
      start = monday(end),
      key = `auto-${start}`;
    if (
      !p.reports.some((r) => r.key === key) &&
      [...p.sessions, ...p.activities].some((s) => inRange(s.date, start, end))
    ) {
      const r = weeklyReport(p, end);
      updateProfile((q) => {
        if (!q.reports.some((r) => r.key === key))
          q.reports.unshift({
            id: uid(),
            key,
            period: "semaine",
            start,
            end,
            stats: r.current,
            recommendations: r.recommendations,
            savedAt: Date.now(),
            automatic: true,
          });
      });
    }
  }, [p?.id, p?.sessions.length, p?.activities.length]);
  return null;
}
class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <div className="module-error">
          <Icon name="TriangleAlert" size={30} />
          <h2>Ce module a rencontré une erreur.</h2>
          <p>
            Vos données restent conservées. Rechargez la page ou exportez votre
            sauvegarde depuis Profil.
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Recharger
          </Button>
          <details>
            <summary>Détail technique</summary>
            {this.state.error.message}
          </details>
        </div>
      );
    return this.props.children;
  }
}
