import { useMemo, useState } from "react";
import {
  aggregateEquipment,
  FOCUS_AREA_DESCRIPTIONS,
  type ScheduleBlock,
} from "../data/drills";
import type { SharedPractice } from "../data/sharing";

const SECTION_COLORS: Record<string, string> = {
  warmup: "#f59e0b",
  drill_1: "#3b82f6",
  drill_2: "#8b5cf6",
  scrimmage: "#ef4444",
  conditioning: "#10b981",
  cooldown: "#6b7280",
  freeplay: "#ec4899",
};

function formatTitle(key: string): string {
  return key
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
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

interface Props {
  practice: SharedPractice;
  onClose: () => void;
}

export default function SharedPlanView({ practice, onClose }: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () =>
      new Set(
        practice.schedule.map((b) => b.sectionKey)
      )
  );

  const equipment = useMemo(
    () => aggregateEquipment(practice.schedule),
    [practice.schedule]
  );

  const hasNotes =
    practice.notes.workedWell ||
    practice.notes.needsReps ||
    practice.notes.playerNotes ||
    practice.notes.adjustments;

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="plan shared-plan">
      <div className="shared-banner">
        <span className="shared-banner-icon">&#x1F517;</span>
        <div>
          <strong>Shared Practice Plan</strong>
          <span className="shared-banner-sub">Read-only view</span>
        </div>
      </div>

      <div className="plan-header">
        <h2 className="plan-title">{formatTitle(practice.focusKey)}</h2>
        <p className="plan-desc">
          {FOCUS_AREA_DESCRIPTIONS[practice.focusKey]}
        </p>
        <div className="plan-meta">
          <div className="plan-meta-item">
            <span className="meta-label">Date</span>
            <span className="meta-value shared-date">
              {formatDate(practice.date)}
            </span>
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
          {practice.schedule.map((block) => (
            <button
              key={block.sectionKey}
              className="timeline-block"
              style={
                {
                  "--block-color":
                    SECTION_COLORS[block.sectionKey] || "#6b7280",
                  flex: block.duration,
                } as React.CSSProperties
              }
              onClick={() => {
                const el = document.getElementById(
                  `shared-section-${block.sectionKey}`
                );
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
        <button
          onClick={() =>
            setExpandedSections(
              new Set(practice.schedule.map((b) => b.sectionKey))
            )
          }
        >
          Expand All
        </button>
        <button onClick={() => setExpandedSections(new Set())}>
          Collapse All
        </button>
      </div>

      <section className="drills-section">
        {practice.schedule.map((block) => (
          <SharedDrillCard
            key={block.sectionKey}
            block={block}
            expanded={expandedSections.has(block.sectionKey)}
            onToggle={() => toggleSection(block.sectionKey)}
          />
        ))}
      </section>

      {hasNotes && (
        <section className="shared-notes-section">
          <h3>Coach Notes</h3>
          <div className="shared-notes-display">
            {practice.notes.workedWell && (
              <div>
                <strong>Worked well:</strong> {practice.notes.workedWell}
              </div>
            )}
            {practice.notes.needsReps && (
              <div>
                <strong>Needs reps:</strong> {practice.notes.needsReps}
              </div>
            )}
            {practice.notes.playerNotes && (
              <div>
                <strong>Player notes:</strong> {practice.notes.playerNotes}
              </div>
            )}
            {practice.notes.adjustments && (
              <div>
                <strong>Adjustments:</strong> {practice.notes.adjustments}
              </div>
            )}
          </div>
        </section>
      )}

      <div className="print-bar no-print">
        <button className="print-button" onClick={() => window.print()}>
          Print Practice Plan
        </button>
        <button className="btn-secondary" onClick={onClose}>
          Go to Planner
        </button>
      </div>
    </div>
  );
}

function SharedDrillCard({
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
      id={`shared-section-${block.sectionKey}`}
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
          <span
            className={`drill-card-chevron ${expanded ? "expanded" : ""}`}
          >
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
