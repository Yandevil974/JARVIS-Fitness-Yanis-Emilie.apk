import React, { useState } from "react";
import { useApp } from "../store/AppContext.jsx";
import { Panel, SectionHeading, Icon, IconButton, Badge } from "./ui.jsx";
import { today, monday, addDays, dateLabel } from "../engine/utils.js";
import { sourcePosition } from "../engine/source-schedule.js";
import { eventsForDay, eventTags } from "../engine/schedule-events.js";
export default function WeekSchedule() {
  const { p, setModal, navigate } = useApp(),
    [offset, setOffset] = useState(0);
  const start = addDays(monday(today()), offset * 7),
    dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const position = sourcePosition(
    p,
    start < p.user.startDate ? p.user.startDate : start,
  );
  const manualMetcon = dates.some((date) =>
    eventsForDay(p, date).some(
      (e) => e.type === "metcon" && e.scheduleModified,
    ),
  );
  const actual = p.sessions.filter(
    (s) => s.date >= start && s.date <= dates[6] && s.status === "completed",
  ).length;
  return (
    <Panel className="week-panel complete-week-panel">
      <SectionHeading
        title="Votre semaine complète"
        subtitle={`${dateLabel(start)} — ${dateLabel(dates[6])}`}
      >
        <button
          className="text-link"
          onClick={() => navigate("program", "calendar")}
        >
          Calendrier <Icon name="ArrowUpRight" size={14} />
        </button>
      </SectionHeading>
      <div className="week-navigation">
        <div>
          <IconButton
            icon="ChevronLeft"
            label="Semaine précédente"
            onClick={() => setOffset((n) => n - 1)}
          />
          <button onClick={() => setOffset(0)} className="text-link">
            {offset === 0 ? "Cette semaine" : "Aujourd’hui"}
          </button>
          <IconButton
            icon="ChevronRight"
            label="Semaine suivante"
            onClick={() => setOffset((n) => n + 1)}
          />
        </div>
        <Badge color={position.deload ? "amber" : "blue"}>
          S{position.weekGlobal + 1} ·{" "}
          {position.deload ? "Allégée (HTML)" : "Programme source"}
        </Badge>
      </div>
      <div className="week-strip full-week-strip">
        {dates.map((date, i) => {
          const events = eventsForDay(p, date),
            tags = events.flatMap((s) =>
              eventTags(s).map((t) => ({ ...t, status: s.status })),
            );
          return (
            <button
              key={date}
              className={`week-day ${date === today() ? "today selected" : ""} ${tags[0] ? "discipline-" + tags[0].type : "discipline-rest"}`}
              onClick={() => setModal({ type: "day-schedule", date })}
            >
              <span>
                {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"][i]}
              </span>
              <strong>{Number(date.slice(8))}</strong>
              <div className="week-day-tags">
                {tags.length ? (
                  tags.map((tag, j) => (
                    <span
                      className={`day-discipline ${tag.type} ${tag.status}`}
                      key={j}
                    >
                      <Icon
                        name={
                          tag.type === "strength"
                            ? "Dumbbell"
                            : tag.type === "metcon"
                              ? "Zap"
                              : tag.type === "swim"
                                ? "Waves"
                                : "HeartPulse"
                        }
                        size={12}
                      />
                      {tag.label}
                      {tag.status === "completed"
                        ? " ✓"
                        : tag.status === "missed"
                          ? " ×"
                          : ""}
                    </span>
                  ))
                ) : (
                  <span className="day-discipline rest">
                    <Icon name="Leaf" size={13} />
                    Repos
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {position.deload && (
        <div className="week-deload-note">
          <Icon name="Info" size={16} />
          <span>
            Semaine allégée prévue par le HTML.{" "}
            {p.id === "elite"
              ? "Pas de METCON intense cette semaine. Consultez la semaine suivante pour retrouver les séances combinées elliptique + piscine."
              : "Cardio et piscine de récupération, sans intensité."}
          </span>
        </div>
      )}
      <div className="week-key">
        <span className="strength">Musculation</span>
        <span className="metcon">METCON</span>
        <span className="swim">Piscine</span>
        <span className="recovery">Récupération</span>
      </div>
    </Panel>
  );
}
