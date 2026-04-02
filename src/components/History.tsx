import { useState, useCallback } from "react";
import {
  loadSavedPractices,
  updatePracticeNotes,
  deleteSavedPractice,
  type SavedPractice,
} from "../data/storage";
import type { ScheduleBlock } from "../data/drills";

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
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function History() {
  const [practices, setPractices] = useState<SavedPractice[]>(() =>
    loadSavedPractices().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<SavedPractice["notes"]>({
    workedWell: "",
    needsReps: "",
    playerNotes: "",
    adjustments: "",
  });

  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedId((prev) => (prev === id ? null : id));
      setEditingId(null);
    },
    []
  );

  const handleDelete = useCallback((id: string) => {
    deleteSavedPractice(id);
    setPractices((prev) => prev.filter((p) => p.id !== id));
    setExpandedId(null);
  }, []);

  const startEditing = useCallback((practice: SavedPractice) => {
    setEditingId(practice.id);
    setEditNotes({ ...practice.notes });
  }, []);

  const saveEdits = useCallback(
    (id: string) => {
      updatePracticeNotes(id, editNotes);
      setPractices((prev) =>
        prev.map((p) => (p.id === id ? { ...p, notes: editNotes } : p))
      );
      setEditingId(null);
    },
    [editNotes]
  );

  const hasNotes = (notes: SavedPractice["notes"]) =>
    notes.workedWell || notes.needsReps || notes.playerNotes || notes.adjustments;

  const notesPreview = (notes: SavedPractice["notes"]) => {
    const parts = [notes.workedWell, notes.needsReps, notes.playerNotes, notes.adjustments]
      .filter(Boolean);
    if (parts.length === 0) return "No notes";
    const text = parts.join(" | ");
    return text.length > 80 ? text.slice(0, 80) + "..." : text;
  };

  if (practices.length === 0) {
    return (
      <div className="history-empty">
        <div className="history-empty-icon">&#x1F4CB;</div>
        <h2>No Saved Practices</h2>
        <p>Generate a practice plan and save it to start building your history.</p>
      </div>
    );
  }

  return (
    <section className="history-section">
      <div className="history-header">
        <h2>Practice History</h2>
        <p className="text-muted">{practices.length} saved practice{practices.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="history-list">
        {practices.map((practice) => {
          const isExpanded = expandedId === practice.id;
          const isEditing = editingId === practice.id;
          return (
            <div key={practice.id} className="history-item">
              <button
                className="history-item-header"
                onClick={() => toggleExpand(practice.id)}
              >
                <div className="history-item-left">
                  <span className="history-date">{formatDate(practice.date)}</span>
                  <span className="history-focus">{formatTitle(practice.focusKey)}</span>
                  {!isExpanded && (
                    <span className="history-preview">{notesPreview(practice.notes)}</span>
                  )}
                </div>
                <span className={`drill-card-chevron ${isExpanded ? "expanded" : ""}`}>
                  &#x25B6;
                </span>
              </button>
              {isExpanded && (
                <div className="history-item-body">
                  <div className="history-schedule">
                    <h4>Practice Plan</h4>
                    {practice.schedule.map((block: ScheduleBlock) => (
                      <div
                        key={block.sectionKey}
                        className="history-drill"
                        style={{ borderLeftColor: SECTION_COLORS[block.sectionKey] || "#6b7280" }}
                      >
                        <div className="history-drill-header">
                          <span className="history-drill-label">{block.label}</span>
                          <span className="history-drill-time">{block.duration} min</span>
                        </div>
                        <span className="history-drill-name">{block.drill.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="history-notes">
                    <div className="history-notes-header">
                      <h4>Notes</h4>
                      {!isEditing && (
                        <button
                          className="history-edit-btn"
                          onClick={() => startEditing(practice)}
                        >
                          Edit Notes
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="history-notes-edit">
                        {(
                          [
                            ["workedWell", "What worked well"],
                            ["needsReps", "What needs more reps"],
                            ["playerNotes", "Individual player notes"],
                            ["adjustments", "Adjustments for next practice"],
                          ] as const
                        ).map(([key, label]) => (
                          <div key={key} className="note-field">
                            <label>{label}</label>
                            <textarea
                              value={editNotes[key]}
                              onChange={(e) =>
                                setEditNotes((n) => ({ ...n, [key]: e.target.value }))
                              }
                              placeholder={`${label}...`}
                              rows={2}
                            />
                          </div>
                        ))}
                        <div className="history-edit-actions">
                          <button
                            className="btn-primary"
                            onClick={() => saveEdits(practice.id)}
                          >
                            Save Notes
                          </button>
                          <button
                            className="btn-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : hasNotes(practice.notes) ? (
                      <div className="history-notes-display">
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
                    ) : (
                      <p className="text-muted">
                        No notes yet.{" "}
                        <button
                          className="link-button"
                          onClick={() => startEditing(practice)}
                        >
                          Add notes
                        </button>
                      </p>
                    )}
                  </div>

                  <div className="history-actions">
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(practice.id)}
                    >
                      Delete Practice
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
