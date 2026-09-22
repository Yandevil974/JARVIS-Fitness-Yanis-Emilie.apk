import { createController } from "./controller.mjs";
export function createNotifications({
  React,
  useApp,
  Modal,
  native,
  isAndroid,
  voice,
}) {
  const controller = createController({ native, isAndroid });
  const { useState, useEffect } = React;
  function useStatus() {
    const [value, set] = useState(controller.getSnapshot());
    useEffect(() => {
      const off = controller.subscribe(set);
      set(controller.getSnapshot());
      return off;
    }, []);
    return value;
  }
  function Observer() {
    const { state, ready } = useApp();
    useEffect(() => {
      if (ready) controller.sync(state);
    }, [ready, state]);
    useEffect(() => {
      const refresh = () => {
        if (!document.hidden && ready) {
          controller.refresh();
          controller.sync(state);
        }
      };
      const timer = setInterval(refresh, 60000);
      window.addEventListener("focus", refresh);
      document.addEventListener("visibilitychange", refresh);
      return () => {
        clearInterval(timer);
        window.removeEventListener("focus", refresh);
        document.removeEventListener("visibilitychange", refresh);
      };
    }, [ready, state]);
    return null;
  }
  function Board() {
    const { p, state } = useApp();
    const [open, setOpen] = useState(false);
    const status = useStatus();
    useEffect(() => {
      setOpen(false);
    }, [p?.id]);
    if (!p) return null;
    return (
      <section
        className="jn-owned"
        style={{
          marginBottom: 28,
          padding: 20,
          border: "1px solid var(--line)",
          borderRadius: 18,
          background: "var(--panel)",
        }}
        aria-label="Rappels Android"
      >
        <header className="jf-reminders-head">
          <div>
            <span className="jf-eyebrow">SUIVI · MÊME APPLICATION FERMÉE</span>
            <h2>Les rappels sur ton téléphone</h2>
            <p>
              Facultatifs, discrets et activés séparément pour chaque profil.
            </p>
          </div>
          <button
            className="jf-button secondary"
            onClick={() => {
              voice.cancel("CANCELLED", true);
              setOpen(true);
              controller.refresh();
            }}
          >
            Rappels Android
          </button>
        </header>
        {status.error && !open && <p role="alert">{status.error}</p>}
        {open && (
          <Modal
            title="Rappels Android"
            subtitle={`Réglages de ${p.user.name || p.id} sur ce téléphone uniquement.`}
            onClose={() => setOpen(false)}
          >
            {status.error && <p role="alert">{status.error}</p>}
            {!isAndroid() ? (
              <p>
                Disponibles dans le nouvel APK Android. Cet aperçu ne programme
                aucune alerte système.
              </p>
            ) : (
              <>
                <p>
                  Contenu affiché : « Un point t’attend dans ton suivi ». Aucun
                  nom, poids, douleur, photo ou détail de séance sur l’écran
                  verrouillé.
                </p>
                <p role="status">
                  Autorisation Android :{" "}
                  {status.permission ? "accordée" : "désactivée ou à demander"}.
                  Rappels de ce profil :{" "}
                  {status.enabled?.[p.id] ? "activés" : "désactivés"}.
                </p>
                <div className="jf-form-actions">
                  <button
                    className="jf-button secondary"
                    disabled={status.pending}
                    onClick={() => controller.sync(state)}
                  >
                    Actualiser les rappels
                  </button>
                  {!status.permission && (
                    <button
                      className="jf-button"
                      disabled={status.pending}
                      onClick={() => controller.permission()}
                    >
                      Autoriser les notifications Android
                    </button>
                  )}
                  <button
                    className="jf-button"
                    disabled={
                      status.pending ||
                      (!status.permission && !status.enabled?.[p.id])
                    }
                    onClick={() =>
                      controller.enable(p.id, !status.enabled?.[p.id])
                    }
                  >
                    {status.enabled?.[p.id]
                      ? "Désactiver pour ce profil"
                      : "Activer pour ce profil"}
                  </button>
                  <button
                    className="jf-button secondary"
                    disabled={status.pending || !status.permission}
                    onClick={() => controller.test()}
                  >
                    Envoyer une notification de test
                  </button>
                  <button
                    className="jf-button secondary"
                    disabled={status.pending}
                    onClick={() => controller.openSettings()}
                  >
                    Réglages Android
                  </button>
                </div>
                <p>
                  {Number(status.scheduled) || 0} rappel(s) en attente pour les
                  profils activés.{" "}
                  {status.next
                    ? "Prochain passage : " +
                      new Date(status.next).toLocaleString("fr-FR")
                    : "Aucun rappel programmé pour le moment."}
                </p>
              </>
            )}
            <p>
              Les séances sont rappelées environ 30 minutes avant leur horaire.
              Les bilans sont rappelés à 18 h. Un report ou une saisie recalcule
              les alertes ; consulter une notification ne valide aucun bilan.
            </p>
            <p>
              Android peut retarder les alertes en économie d’énergie. Après «
              Forcer l’arrêt », rouvre l’application. Un redémarrage rétablit
              les rappels après déverrouillage. La ponctualité exacte n’est pas
              garantie.
            </p>
            <p>
              Les autorisations ne sont pas importées depuis une sauvegarde
              JSON. Rien ne s’active automatiquement sur une nouvelle
              installation.
            </p>
            <button
              className="jf-button secondary"
              onClick={() => setOpen(false)}
            >
              Fermer
            </button>
          </Modal>
        )}
      </section>
    );
  }
  function Shortcut() {
    const { navigate } = useApp();
    return (
      <div className="jn-shortcut">
        <strong>Notifications Android</strong>
        <p>
          Les alertes application fermée se règlent dans le suivi, séparément
          pour chaque profil. Aucun ancien réglage importé ne les active.
        </p>
        <button
          className="jf-button secondary"
          onClick={() => {
            voice.cancel("CANCELLED", true);
            navigate("dashboard");
          }}
        >
          Régler les notifications Android
        </button>
      </div>
    );
  }
  return { Board, Observer, Shortcut, controller };
}
