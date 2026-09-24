import { today, addDays, reminders, settings, lastWeighIn, postpone, cancelPostponement, setSettings, reconcileNotifications } from './engine.mjs';
import css from './reminders.css';

// Use the complete app's React/context/modal: no second React or duplicated store.
export function createFollowUp({ React, useApp, Modal, Button }) {
  const { useState, useEffect } = React;
  const labelDate = value => value ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value + 'T12:00:00')) : 'À planifier';
  function useDay() {
    const [day, setDay] = useState(today());
    useEffect(() => {
      const refresh = () => setDay(today());
      const visible = () => { if (!document.hidden) refresh(); };
      const timer = setInterval(refresh, 30000);
      window.addEventListener('focus', refresh);
      document.addEventListener('visibilitychange', visible);
      return () => { clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', visible); };
    }, []);
    return day;
  }
  function Observer() {
    const { p, updateProfile } = useApp();
    const day = useDay();
    useEffect(() => {
      if (!p || reconcileNotifications(p, day) === p.notifications) return;
      const id = p.id;
      updateProfile(q => {
        if (q.id !== id) return;
        const next = reconcileNotifications(q, day);
        if (next !== q.notifications) q.notifications = next;
      });
    }, [p, day, updateProfile]);
    return null;
  }
  function Board() {
    const { p } = useApp();
    return p ? <ProfileBoard key={p.id} /> : null;
  }
  function ProfileBoard() {
    const { p, updateProfile, setModal, navigate, notify } = useApp();
    const day = useDay();
    const tasks = reminders(p, day), weight = lastWeighIn(p, day);
    const [panel, setPanel] = useState(null);
    const mutate = fn => updateProfile(q => { if (q.id === p.id) fn(q); });
    const openTask = task => {
      if (task.action.modal) setModal({ type: task.action.modal, measurementId: task.action.measurementId });
      else navigate(task.action.page, task.action.tab);
    };
    const reportTask = panel?.type === 'postpone' ? tasks.find(t => t.key === panel.key) : null;
    return <section className="jf-reminders" aria-labelledby="jf-follow-up-title">
      <style>{css}</style>
      <header className="jf-reminders-head">
        <div><span className="jf-eyebrow">VOTRE ÉQUIPE · {p.user.name || (p.id === 'elite' ? 'Yanis' : 'Émilie')}</span>
          <h2 id="jf-follow-up-title">Ton suivi avec l’équipe</h2>
          <p>Les prochaines étapes, sans rien oublier. Ouvrir un bilan ne le marque pas comme réalisé.</p>
        </div>
        <button className="jf-button secondary" onClick={() => setPanel({ type: 'settings' })}>Régler mes rappels</button>
      </header>
      <div className="jf-summary" aria-label="Résumé du suivi">
        <span><b>{tasks.filter(t => t.status === 'due').length}</b> à faire</span>
        <span><b>{tasks.filter(t => t.status === 'postponed').length}</b> reporté(s)</span>
        <span><b>{tasks.filter(t => t.status === 'upcoming').length}</b> à venir</span>
      </div>
      <div className="jf-reminders-grid">
        {tasks.map(task => <article key={task.key} className={`jf-reminder ${task.status}`} data-kind={task.kind} data-status={task.status}>
          <div className="jf-card-top"><span className="jf-state">{task.status === 'postponed' ? 'REPORTÉ' : task.status === 'upcoming' ? 'À VENIR' : task.due && task.days < 0 ? 'EN RETARD' : 'À FAIRE'}</span>
            <span className="jf-symbol" aria-hidden="true">{{ measurements: '↔', force: '↗', weekly: '◎', photos: '▣' }[task.kind]}</span></div>
          <h3>{task.title}</h3>
          <p className="jf-due">{task.postponedUntil ? `Rappel le ${labelDate(task.postponedUntil)}` : task.due ? labelDate(task.due) : 'Premier bilan ou date à vérifier'}</p>
          <p className="jf-last">{task.last ? `Dernier bilan : ${labelDate(task.last)}` : 'Aucune date fiable de bilan'}
            {task.status === 'due' && task.days < 0 && <><br />{Math.abs(task.days)} jour(s) de retard · reste à traiter</>}
            {task.status === 'postponed' && task.due && <><br />Échéance initiale : {labelDate(task.due)}</>}
          </p>
          <details><summary>Voir pourquoi</summary><p>{task.reason}</p><p>Ce rappel se recalcule après une saisie datée correspondante. « Tout marquer comme lu » dans la cloche ne le supprime pas.</p></details>
          <div className="jf-card-actions">
            <button className="jf-button" onClick={() => openTask(task)}>{task.actionLabel}</button>
            {task.status === 'postponed' ? <button className="jf-link" onClick={() => {
              mutate(q => cancelPostponement(q, task.key)); notify('Report annulé. Le bilan reste à faire.');
            }}>Annuler le report</button> : <button className="jf-link" onClick={() => setPanel({ type: 'postpone', key: task.key })}>Reporter</button>}
          </div>
        </article>)}
      </div>
      <footer className="jf-reminders-foot">
        <p>{weight ? `Dernière pesée : ${Number(weight.weight).toLocaleString('fr-FR')} kg · ${labelDate(weight.date)}.` : 'Aucune pesée datée.'} <strong>Poids et mensurations sont suivis séparément.</strong></p>
        <p>Rappels actualisés dans l’application. Les alertes Android lorsque l’application est fermée ne sont pas encore activées.</p>
      </footer>
      {panel?.type === 'settings' && <SettingsPanel profile={p} onClose={() => setPanel(null)} onSave={values => {
        mutate(q => setSettings(q, values)); setPanel(null); notify('Rythme du suivi enregistré pour ce profil.');
      }} />}
      {reportTask && <PostponePanel key={reportTask.key} task={reportTask} day={day} onClose={() => setPanel(null)} onSave={until => {
        // Validate before entering React's state updater (avoid provider-level errors).
        const detached = { ...p, followUp: { ...p.followUp } };
        postpone(detached, reportTask.key, until, day);
        mutate(q => { if (reminders(q, day).some(t => t.key === reportTask.key)) postpone(q, reportTask.key, until, day); });
        setPanel(null); notify(`Rappel reporté au ${labelDate(until)}. Le bilan n’est pas marqué comme fait.`);
      }} />}
    </section>;
  }
  function SettingsPanel({ profile, onClose, onSave }) {
    const [form, setForm] = useState(settings(profile));
    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
    return <Modal title="Rythme de mon suivi" subtitle={`Réglages propres à ${profile.user.name || profile.id}. Les données déjà enregistrées ne changent pas.`} onClose={onClose}>
      <form className="jf-follow-form" onSubmit={event => { event.preventDefault(); onSave(form); }}>
        <label>Mensurations<select className="input" value={form.measurementCadence} onChange={e => set('measurementCadence', e.target.value)}>
          <option value="month">Chaque mois, depuis le dernier relevé</option><option value="four-weeks">Toutes les 4 semaines (28 jours)</option>
        </select></label>
        <label>Bilan de force<select className="input" value={form.forceWeeks} onChange={e => set('forceWeeks', Number(e.target.value))}>
          {[4, 6, 8, 10, 12].map(n => <option key={n} value={n}>Toutes les {n} semaines</option>)}
        </select></label>
        <p className="jf-help">Un bilan n’impose pas de tester une charge maximale. Ce réglage est aussi celui de la rubrique Bilan 1RM.</p>
        <label className="jf-check"><input type="checkbox" checked={form.weeklyEnabled} onChange={e => set('weeklyEnabled', e.target.checked)} />Me rappeler le bilan d’équipe tous les 7 jours</label>
        <label className="jf-check"><input type="checkbox" checked={form.photosEnabled} onChange={e => set('photosEnabled', e.target.checked)} />Activer les rappels de photos (facultatif)</label>
        {form.photosEnabled && <label>Photos de suivi<select className="input" value={form.photoCadence} onChange={e => set('photoCadence', e.target.value)}>
          <option value="month">Chaque mois</option><option value="four-weeks">Toutes les 4 semaines (28 jours)</option>
        </select></label>}
        <div className="jf-form-actions"><button className="jf-button secondary" type="button" onClick={onClose}>Annuler</button><button className="jf-button" type="submit">Enregistrer mes rappels</button></div>
      </form>
    </Modal>;
  }
  function PostponePanel({ task, day, onClose, onSave }) {
    const min = addDays(task.due && task.due > day ? task.due : day, 1), max = addDays(day, 90);
    const [until, setUntil] = useState(addDays(min, 6) > max ? max : addDays(min, 6));
    const [error, setError] = useState('');
    return <Modal title={`Reporter : ${task.title}`} subtitle="Le rappel reste visible dans les reports. Il revient automatiquement à la date choisie." onClose={onClose}>
      <form className="jf-follow-form" onSubmit={e => { e.preventDefault(); try { onSave(until); } catch (err) { setError(err.message); } }}>
        <label>Me rappeler le<input className="input" type="date" required min={min} max={max} value={until} onChange={e => setUntil(e.target.value)} /></label>
        <p className="jf-help">Ce report ne change ni les mesures enregistrées, ni la date réelle de l’échéance. Délai maximal : 90 jours.</p>
        {error && <p role="alert">{error}</p>}
        <div className="jf-form-actions"><button type="button" className="jf-button secondary" onClick={onClose}>Annuler</button><button type="submit" className="jf-button">Confirmer le report</button></div>
      </form>
    </Modal>;
  }
  function NotificationLink() {
    const { navigate } = useApp();
    return <Button variant="secondary" onClick={() => navigate('dashboard')}>Ouvrir mon suivi et ses rappels</Button>;
  }
  return { Board, Observer, NotificationLink };
}
