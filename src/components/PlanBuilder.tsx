import { useState, useMemo, useCallback, useRef } from "react";
import {
  DRILL_LIBRARY,
  COOLDOWN,
  FREE_PLAY,
  FOCUS_AREAS,
  aggregateEquipment,
  type Drill,
  type ScheduleBlock,
} from "../data/drills";
import {
  savePracticeToHistory,
  generateId,
  loadCustomDrills,
  loadRoster,
  saveAttendanceRecord,
  type CustomDrill,
  type Player,
} from "../data/storage";

interface Props {
  onBack: () => void;
  onSaved?: () => void;
}

interface BuilderSlot {
  id: string;
  drill: Drill;
  duration: number;
  label: string;
  sectionKey: string;
}

interface CatalogDrill {
  drill: Drill;
  focusArea: string;
  section: string;
  isCustom?: boolean;
}

const SECTION_COLORS: Record<string, string> = {
  warmup: "#f59e0b",
  drill_1: "#3b82f6",
  drill_2: "#8b5cf6",
  scrimmage: "#ef4444",
  conditioning: "#10b981",
  cooldown: "#6b7280",
  freeplay: "#ec4899",
  custom: "#0ea5e9",
};

function formatTitle(key: string): string {
  return key
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
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

function buildCatalog(customDrills: CustomDrill[]): CatalogDrill[] {
  const result: CatalogDrill[] = [];
  for (const focusKey of FOCUS_AREAS) {
    const sections = DRILL_LIBRARY[focusKey];
    if (!sections) continue;
    const entries: [string, Drill][] = [
      ["warmup", sections.warmup],
      ["drill_1", sections.drill_1],
      ["drill_2", sections.drill_2],
      ["scrimmage", sections.scrimmage],
      ["conditioning", sections.conditioning],
    ];
    for (const [sectionKey, drill] of entries) {
      result.push({ drill, focusArea: focusKey, section: sectionKey });
    }
  }
  result.push({ drill: COOLDOWN, focusArea: "general", section: "cooldown" });
  result.push({ drill: FREE_PLAY, focusArea: "general", section: "freeplay" });
  for (const cd of customDrills) {
    result.push({
      drill: cd,
      focusArea: cd.focusAreas[0] || "custom",
      section: "custom",
      isCustom: true,
    });
  }
  return result;
}

const DURATIONS = [60, 90, 120];

export default function PlanBuilder({ onBack, onSaved }: Props) {
  const [totalDuration, setTotalDuration] = useState(120);
  const [slots, setSlots] = useState<BuilderSlot[]>([]);
  const [date, setDate] = useState(todayString);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [filterFocus, setFilterFocus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  // Attendance state
  const roster = useMemo(() => loadRoster(), []);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(() => {
    const rec: Record<string, boolean> = {};
    for (const p of loadRoster()) rec[p.id] = true;
    return rec;
  });
  const [playerNotes, setPlayerNotes] = useState<Record<string, string>>({});

  const customDrills = useMemo(() => loadCustomDrills(), []);
  const catalog = useMemo(() => buildCatalog(customDrills), [customDrills]);

  const filteredCatalog = useMemo(() => {
    let items = catalog;
    if (filterFocus !== "all") {
      items = items.filter((c) => c.focusArea === filterFocus);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((c) => c.drill.name.toLowerCase().includes(q));
    }
    return items;
  }, [catalog, filterFocus, searchQuery]);

  const usedMinutes = slots.reduce((sum, s) => sum + s.duration, 0);
  const remainingMinutes = totalDuration - usedMinutes;

  const schedule: ScheduleBlock[] = useMemo(() => {
    let time = 0;
    return slots.map((s) => {
      const block: ScheduleBlock = {
        startMin: time,
        endMin: time + s.duration,
        label: s.label,
        drill: s.drill,
        duration: s.duration,
        sectionKey: s.sectionKey,
      };
      time += s.duration;
      return block;
    });
  }, [slots]);

  const equipment = useMemo(() => aggregateEquipment(schedule), [schedule]);

  const addDrill = useCallback(
    (catalogItem: CatalogDrill) => {
      const defaultDuration = Math.min(15, Math.max(5, remainingMinutes));
      if (defaultDuration <= 0) return;
      const newSlot: BuilderSlot = {
        id: generateId(),
        drill: catalogItem.drill,
        duration: defaultDuration,
        label: catalogItem.drill.name,
        sectionKey: catalogItem.isCustom ? "custom" : catalogItem.section,
      };
      setSlots((prev) => [...prev, newSlot]);
      setPickerOpen(false);
    },
    [remainingMinutes]
  );

  const removeSlot = useCallback((id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const adjustDuration = useCallback(
    (id: string, delta: number) => {
      setSlots((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const newDur = Math.max(5, s.duration + delta);
          const maxDur = s.duration + remainingMinutes;
          return { ...s, duration: Math.min(newDur, maxDur) };
        })
      );
    },
    [remainingMinutes]
  );

  const moveSlot = useCallback((fromIdx: number, toIdx: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const [removed] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, removed);
      return next;
    });
  }, []);

  // Drag handlers
  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    if (dragItem.current !== null && dragItem.current !== toIdx) {
      moveSlot(dragItem.current, toIdx);
    }
    dragItem.current = null;
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    setDragOverIdx(null);
  };

  // Move up/down for mobile
  const moveUp = (idx: number) => {
    if (idx > 0) moveSlot(idx, idx - 1);
  };
  const moveDown = (idx: number) => {
    if (idx < slots.length - 1) moveSlot(idx, idx + 1);
  };

  const handleSave = useCallback(() => {
    if (slots.length === 0) return;
    const practiceId = generateId();
    savePracticeToHistory({
      id: practiceId,
      date,
      focusKey: "custom",
      schedule,
      notes: { workedWell: "", needsReps: "", playerNotes: "", adjustments: "" },
      savedAt: new Date().toISOString(),
    });
    if (roster.length > 0) {
      saveAttendanceRecord({
        practiceId,
        attendance,
        playerNotes,
      });
    }
    setSaved(true);
    if (onSaved) onSaved();
  }, [slots, date, schedule, roster, attendance, playerNotes, onSaved]);

  return (
    <div className="plan">
      <button className="back-button" onClick={onBack}>
        <span aria-hidden="true">&larr;</span> Focus Areas
      </button>

      <div className="plan-header">
        <h2 className="plan-title">Custom Practice Plan</h2>
        <p className="plan-desc">
          Build your own practice by mixing drills from any focus area.
        </p>
        <div className="plan-meta">
          <div className="plan-meta-item">
            <label htmlFor="builder-date">Date</label>
            <input
              id="builder-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="date-input"
            />
            <span className="date-display">{formatDate(date)}</span>
          </div>
          <div className="plan-meta-item">
            <span className="meta-label">Duration</span>
            <div className="builder-duration-picker">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  className={`builder-dur-btn ${totalDuration === d ? "active" : ""}`}
                  onClick={() => setTotalDuration(d)}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>
          <div className="plan-meta-item">
            <span className="meta-label">Remaining</span>
            <span
              className={`meta-value ${remainingMinutes < 0 ? "over-time" : ""}`}
            >
              {remainingMinutes} min
            </span>
          </div>
        </div>
      </div>

      {equipment.length > 0 && (
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
      )}

      {/* Timeline visualization */}
      {slots.length > 0 && (
        <section className="timeline-section">
          <h3>Schedule Overview</h3>
          <div className="timeline">
            {schedule.map((block) => (
              <div
                key={block.startMin + "-" + block.sectionKey}
                className="timeline-block"
                style={
                  {
                    "--block-color":
                      SECTION_COLORS[block.sectionKey] || "#0ea5e9",
                    flex: block.duration,
                  } as React.CSSProperties
                }
              >
                <span className="timeline-label">{block.drill.name}</span>
                <span className="timeline-time">
                  {block.startMin}–{block.endMin} min
                </span>
              </div>
            ))}
            {remainingMinutes > 0 && (
              <div
                className="timeline-block timeline-empty"
                style={
                  {
                    "--block-color": "#94a3b8",
                    flex: remainingMinutes,
                    opacity: 0.4,
                  } as React.CSSProperties
                }
              >
                <span className="timeline-label">Empty</span>
                <span className="timeline-time">{remainingMinutes} min</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Slot list */}
      <section className="builder-slots">
        <div className="builder-slots-header">
          <h3>Drills ({slots.length})</h3>
          <button
            className="btn-primary"
            onClick={() => setPickerOpen(true)}
            disabled={remainingMinutes <= 0}
          >
            + Add Drill
          </button>
        </div>

        {slots.length === 0 && (
          <div className="builder-empty">
            <p>No drills added yet. Click "Add Drill" to start building your practice.</p>
          </div>
        )}

        <div className="builder-slot-list">
          {slots.map((slot, idx) => (
            <div
              key={slot.id}
              className={`builder-slot ${dragOverIdx === idx ? "drag-over" : ""}`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
            >
              <div
                className="builder-slot-accent"
                style={{
                  background:
                    SECTION_COLORS[slot.sectionKey] || "#0ea5e9",
                }}
              />
              <div className="builder-slot-info">
                <span className="builder-slot-name">{slot.drill.name}</span>
                <span className="builder-slot-meta">
                  {slot.sectionKey !== "custom" && formatTitle(slot.sectionKey)} &middot; {schedule[idx]?.startMin}–{schedule[idx]?.endMin} min
                </span>
              </div>
              <div className="builder-slot-controls">
                <div className="builder-slot-reorder no-print">
                  <button
                    className="builder-move-btn"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    title="Move up"
                  >
                    &#x25B2;
                  </button>
                  <button
                    className="builder-move-btn"
                    onClick={() => moveDown(idx)}
                    disabled={idx === slots.length - 1}
                    title="Move down"
                  >
                    &#x25BC;
                  </button>
                </div>
                <div className="builder-duration-controls">
                  <button
                    className="builder-dur-ctrl"
                    onClick={() => adjustDuration(slot.id, -5)}
                    disabled={slot.duration <= 5}
                  >
                    -
                  </button>
                  <span className="builder-dur-value">{slot.duration}m</span>
                  <button
                    className="builder-dur-ctrl"
                    onClick={() => adjustDuration(slot.id, 5)}
                    disabled={remainingMinutes <= 0}
                  >
                    +
                  </button>
                </div>
                <button
                  className="builder-remove-btn no-print"
                  onClick={() => removeSlot(slot.id)}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attendance section */}
      {roster.length > 0 && (
        <section className="attendance-section">
          <h3>Attendance</h3>
          <div className="attendance-grid">
            {roster.map((player: Player) => (
              <div key={player.id} className="attendance-row">
                <label className="attendance-check">
                  <input
                    type="checkbox"
                    checked={attendance[player.id] ?? false}
                    onChange={(e) =>
                      setAttendance((prev) => ({
                        ...prev,
                        [player.id]: e.target.checked,
                      }))
                    }
                  />
                  <span>{player.name}</span>
                </label>
                <input
                  type="text"
                  className="attendance-note-input"
                  placeholder="Notes..."
                  value={playerNotes[player.id] || ""}
                  onChange={(e) =>
                    setPlayerNotes((prev) => ({
                      ...prev,
                      [player.id]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="print-bar no-print">
        <button className="print-button" onClick={() => window.print()}>
          Print Practice Plan
        </button>
        <button
          className={`save-button ${saved ? "saved" : ""}`}
          onClick={handleSave}
          disabled={saved || slots.length === 0}
        >
          {saved ? "Saved!" : "Save Practice"}
        </button>
      </div>

      {/* Drill Picker Modal */}
      {pickerOpen && (
        <div className="picker-overlay" onClick={() => setPickerOpen(false)}>
          <div className="picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="picker-header">
              <h3>Add a Drill</h3>
              <button
                className="picker-close"
                onClick={() => setPickerOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="picker-filters">
              <input
                type="text"
                className="picker-search"
                placeholder="Search drills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="picker-focus-filters">
                <button
                  className={`focus-toggle ${filterFocus === "all" ? "active" : ""}`}
                  onClick={() => setFilterFocus("all")}
                >
                  All
                </button>
                {FOCUS_AREAS.map((key) => (
                  <button
                    key={key}
                    className={`focus-toggle ${filterFocus === key ? "active" : ""}`}
                    onClick={() => setFilterFocus(key)}
                  >
                    {formatTitle(key)}
                  </button>
                ))}
                {customDrills.length > 0 && (
                  <button
                    className={`focus-toggle ${filterFocus === "custom" ? "active" : ""}`}
                    onClick={() => setFilterFocus("custom")}
                  >
                    Custom
                  </button>
                )}
              </div>
            </div>
            <div className="picker-list">
              {filteredCatalog.map((item, i) => (
                <button
                  key={`${item.drill.name}-${i}`}
                  className="picker-item"
                  onClick={() => addDrill(item)}
                  disabled={remainingMinutes <= 0}
                >
                  <div className="picker-item-info">
                    <span className="picker-item-name">{item.drill.name}</span>
                    <span className="picker-item-meta">
                      {formatTitle(item.focusArea)}{" "}
                      {item.isCustom && (
                        <span className="swap-badge">Custom</span>
                      )}
                    </span>
                  </div>
                  <span className="picker-item-add">+ Add</span>
                </button>
              ))}
              {filteredCatalog.length === 0 && (
                <p className="text-muted" style={{ padding: "20px", textAlign: "center" }}>
                  No drills found.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
