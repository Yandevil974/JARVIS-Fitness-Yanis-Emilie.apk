import React, { useEffect, useRef, useId } from "react";
import { ICONS } from "./icon-map.js";
export function Icon({ name, size = 20, ...props }) {
  const I = ICONS[name] || ICONS.Circle;
  return <I size={size} strokeWidth={1.7} aria-hidden="true" {...props} />;
}
export function Button({
  children,
  icon,
  variant = "",
  className = "",
  ...props
}) {
  return (
    <button className={`btn ${variant} ${className}`} {...props}>
      {icon && <Icon name={icon} size={17} />}
      <span>{children}</span>
    </button>
  );
}
export function IconButton({ icon, label, className = "", ...props }) {
  return (
    <button
      className={`icon-button ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon name={icon} />
    </button>
  );
}
export function Badge({ children, color = "", dot = false }) {
  return (
    <span className={`badge ${color}`}>
      {dot && <i />}
      {children}
    </span>
  );
}
export function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  );
}
export function SectionHeading({ title, subtitle, children }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
export function Panel({ children, className = "", ...props }) {
  return (
    <section className={`panel ${className}`} {...props}>
      {children}
    </section>
  );
}
export function Tabs({ items, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {items.map(([id, label, count]) => (
        <button
          role="tab"
          aria-selected={value === id}
          key={id}
          className={value === id ? "active" : ""}
          onClick={() => onChange(id)}
        >
          {label}
          {count != null && <span>{count}</span>}
        </button>
      ))}
    </div>
  );
}
export function Field({ label, children, hint, error, ...props }) {
  const id = useId();
  const content = React.Children.map(children, (child) => {
    if (
      !React.isValidElement(child) ||
      ![Input, Select, "input", "select", "textarea"].includes(child.type)
    )
      return child;
    return React.cloneElement(child, {
      "aria-labelledby": child.props["aria-label"]
        ? undefined
        : child.props["aria-labelledby"] || id,
      "aria-describedby":
        child.props["aria-describedby"] || (hint ? id + "-hint" : undefined),
    });
  });
  return (
    <label className="field" {...props}>
      <span id={id}>{label}</span>
      {content}
      {hint && <small id={id + "-hint"}>{hint}</small>}
      {error && <small className="red-text">{error}</small>}
    </label>
  );
}
export function Input({ className = "", ...props }) {
  return <input className={`input ${className}`} {...props} />;
}
export function Select({ children, ...props }) {
  return (
    <select className="input" {...props}>
      {children}
    </select>
  );
}
export function Empty({
  icon = "Activity",
  title = "Vos données prennent vie ici",
  text,
  children,
  compact = false,
}) {
  return (
    <div className={`empty ${compact ? "compact" : ""}`}>
      <span className="empty-icon">
        <Icon name={icon} size={compact ? 22 : 28} />
      </span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
export function ProgressBar({ value = 0, color = "", className = "" }) {
  return (
    <div className={`progress-bar ${color} ${className}`}>
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
export function Ring({
  value,
  size = 132,
  children,
  color = "var(--mint)",
  stroke = 7,
}) {
  const r = (size - stroke * 2) / 2,
    circ = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={
            circ * (1 - Math.max(0, Math.min(100, value || 0)) / 100)
          }
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div>{children}</div>
    </div>
  );
}
export function Orb({ small = false }) {
  return (
    <div className={`jarvis-orb ${small ? "small" : ""}`} aria-hidden="true">
      <span />
      <i />
      <b />
      <em />
    </div>
  );
}
export function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
  className = "",
}) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = ref.current;
    const focusables = () =>
      [
        ...root.querySelectorAll(
          'button,input,select,textarea,a[href],[tabindex="0"]',
        ),
      ].filter((e) => !e.disabled && e.offsetParent !== null);
    focusables()[0]?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const f = focusables();
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === f.at(-1)) {
          e.preventDefault();
          f[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", key);
      previous?.focus?.();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        ref={ref}
        className={`modal ${wide ? "wide" : ""} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <IconButton icon="X" label="Fermer" onClick={onClose} />
        </header>
        <div className="modal-content">{children}</div>
      </section>
    </div>
  );
}
export function Switch({ checked, onChange, label, description }) {
  return (
    <label className="switch-row">
      <div>
        <strong>{label}</strong>
        {description && <p>{description}</p>}
      </div>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-track" />
    </label>
  );
}
export function Metric({ icon, label, value, unit, detail, color = "mint" }) {
  return (
    <div className={`metric ${color}`}>
      <div className="metric-top">
        <span className="metric-icon">
          <Icon name={icon} size={18} />
        </span>
        <span>{label}</span>
        <Icon name="ArrowUpRight" size={15} />
      </div>
      <div className="metric-value">
        {value === "—" || value == null ? (
          <span className="missing-data">Donnée insuffisante</span>
        ) : (
          value
        )}
        <small>{unit}</small>
      </div>
      <p>{detail}</p>
    </div>
  );
}
export function Confirm({
  title,
  description,
  onConfirm,
  onClose,
  danger = false,
  label = "Confirmer",
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="muted" style={{ lineHeight: 1.8 }}>
        {description}
      </p>
      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          {label}
        </Button>
      </div>
    </Modal>
  );
}
