import { useState, useMemo } from "react";
import {
  generateSchedule,
  aggregateEquipment,
  FOCUS_AREA_DESCRIPTIONS,
  type ScheduleBlock,
} from "../data/drills";

interface Props {
  focusKey: string;
  onBack: () => void;
}

function formatTitle(key: string): string {
  return key
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function todayString(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const SECTION_COLORS: Record<string, string> = {
  warmup: "#f59e0b",
  drill_1: "#3b82f6",
  drill_2: "#8b5cf6",
  scrimmage: "#ef4444",
  conditioning: "#10b981",
  cooldown: "#6b7280",
  freeplay: "#ec4899",
};

export default function PracticePlan({ focusKey, onBack }: Props) {
  const [date, setDate] = useState(todayString);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(["warmup", "drill_1", "drill_2", "scrimmage", "conditioning", "cooldown", "freeplay"])
  );
  const [notes, setNotes] = useState({
    workedWell: "",
    needsReps: "",
    playerNotes: "",
    adjustments: "",
  });

  const schedule = useMemo(() => generateSchedule(focusKey), [focusKey]);
  const equipment = useMemo(() => aggregateEquipment(schedule), [schedule]);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(schedule.map((b) => b.sectionKey)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div className="plan">
      <button className="back-button" onClick={onBack}>
        <span aria-hidden="true">&larr;</span> Focus Areas
      </button>

      <div className="plan-header">
        <h2 className="plan-title">{formatTitle(focusKey)}</h2>
        <p className="plan-desc">{FOCUS_AREA_DESCRIPTIONS[focusKey]}</p>
        <div className="plan-meta">
          <div className="plan-meta-item">
            <label htmlFor="practice-date">Date</label>
            <input
              id="practice-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="date-input"
            />
            <span className="date-display">{formatDate(date)}</span>
          </div>
          <div className="plan-meta-item">
            <span className="meta-label">Duration</span>
            <span className="meta-value">120 min</span>
          </div>
        </div>
      </div>

      <section className="equipment-section">
        <h3>Equipment Needed</h3>
        <div className="equipment-tags">
          {equipment.map((e) => (
            <span key={e.name} className="equipment-tag">
              {e.name} <strong>({e.count})</strong>
            </span>
          ))}
        </div>
      </section>

      <section className="timeline-section">
        <h3>Schedule Overview</h3>
        <div className="timeline">
          {schedule.map((block) => (
            <button
              key={block.sectionKey}
              className="timeline-block"
              style={
                {
                  "--block-color": SECTION_COLORS[block.sectionKey] || "#6b7280",
                  flex: block.duration,
                } as React.CSSProperties
              }
              onClick={() => {
                const el = document.getElementById(`section-${block.sectionKey}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  if (!expandedSections.has(block.sectionKey)) {
                    toggleSection(block.sectionKey);
                  }
                }
              }}
              title={`${block.label}: ${block.drill.name} (${block.duration} min)`}
            >
              <span className="timeline-label">{block.label}</span>
              <span className="timeline-time">
                {block.startMin}–{block.endMin} min
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="expand-controls no-print">
        <button onClick={expandAll}>Expand All</button>
        <button onClick={collapseAll}>Collapse All</button>
      </div>

      <section className="drills-section">
        {schedule.map((block) => (
          <DrillCard
            key={block.sectionKey}
            block={block}
            expanded={expandedSections.has(block.sectionKey)}
            onToggle={() => toggleSection(block.sectionKey)}
          />
        ))}
      </section>

      <section className="notes-section">
        <h3>Post-Practice Notes</h3>
        <div className="notes-grid">
          <NoteField
            label="What worked well"
            value={notes.workedWell}
            onChange={(v) => setNotes((n) => ({ ...n, workedWell: v }))}
          />
          <NoteField
            label="What needs more reps"
            value={notes.needsReps}
            onChange={(v) => setNotes((n) => ({ ...n, needsReps: v }))}
          />
          <NoteField
            label="Individual player notes"
            value={notes.playerNotes}
            onChange={(v) => setNotes((n) => ({ ...n, playerNotes: v }))}
          />
          <NoteField
            label="Adjustments for next practice"
            value={notes.adjustments}
            onChange={(v) => setNotes((n) => ({ ...n, adjustments: v }))}
          />
        </div>
      </section>

      <div className="print-bar no-print">
        <button className="print-button" onClick={() => window.print()}>
          Print Practice Plan
        </button>
      </div>
    </div>
  );
}

function DrillCard({
  block,
  expanded,
  onToggle,
}: {
  block: ScheduleBlock;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color = SECTION_COLORS[block.sectionKey] || "#6b7280";
  return (
    <div
      className="drill-card"
      id={`section-${block.sectionKey}`}
      style={{ "--card-accent": color } as React.CSSProperties}
    >
      <button className="drill-card-header" onClick={onToggle}>
        <div className="drill-card-header-left">
          <span className="drill-card-accent" />
          <div>
            <span className="drill-card-label">{block.label}</span>
            <span className="drill-card-name">{block.drill.name}</span>
          </div>
        </div>
        <div className="drill-card-header-right">
          <span className="drill-card-duration">{block.duration} min</span>
          <span className={`drill-card-chevron ${expanded ? "expanded" : ""}`}>
            &#x25B6;
          </span>
        </div>
      </button>
      {expanded && (
        <div className="drill-card-body">
          <p className="drill-description">{block.drill.description}</p>
          <div className="drill-coaching">
            <h4>Coaching Points</h4>
            <ul>
              {block.drill.coaching_points.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
          {block.drill.equipment.length > 0 && (
            <div className="drill-equipment">
              <h4>Equipment</h4>
              <div className="equipment-tags small">
                {block.drill.equipment.map((e, i) => (
                  <span key={i} className="equipment-tag small">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NoteField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="note-field">
      <label>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label}...`}
        rows={3}
      />
    </div>
  );
}
