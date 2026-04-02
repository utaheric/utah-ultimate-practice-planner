import { useState, useCallback } from "react";
import { FOCUS_AREAS } from "../data/drills";
import {
  loadCustomDrills,
  saveCustomDrills,
  generateId,
  type CustomDrill,
} from "../data/storage";

function formatTitle(key: string): string {
  return key
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

const EMPTY_DRILL: Omit<CustomDrill, "id"> = {
  name: "",
  description: "",
  coaching_points: [],
  equipment: [],
  focusAreas: [],
};

export default function MyDrills() {
  const [drills, setDrills] = useState<CustomDrill[]>(loadCustomDrills);
  const [editing, setEditing] = useState<CustomDrill | null>(null);
  const [isNew, setIsNew] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coachingText, setCoachingText] = useState("");
  const [equipmentText, setEquipmentText] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const persist = useCallback((updated: CustomDrill[]) => {
    setDrills(updated);
    saveCustomDrills(updated);
  }, []);

  const openNew = useCallback(() => {
    setEditing(null);
    setIsNew(true);
    setName(EMPTY_DRILL.name);
    setDescription(EMPTY_DRILL.description);
    setCoachingText("");
    setEquipmentText("");
    setFocusAreas([]);
  }, []);

  const openEdit = useCallback((drill: CustomDrill) => {
    setEditing(drill);
    setIsNew(false);
    setName(drill.name);
    setDescription(drill.description);
    setCoachingText(drill.coaching_points.join("\n"));
    setEquipmentText(drill.equipment.join("\n"));
    setFocusAreas([...drill.focusAreas]);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(null);
    setIsNew(false);
  }, []);

  const toggleFocusArea = useCallback((key: string) => {
    setFocusAreas((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    const drill: CustomDrill = {
      id: editing?.id || generateId(),
      name: name.trim(),
      description: description.trim(),
      coaching_points: coachingText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      equipment: equipmentText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      focusAreas,
    };

    let updated: CustomDrill[];
    if (isNew) {
      updated = [...drills, drill];
    } else {
      updated = drills.map((d) => (d.id === drill.id ? drill : d));
    }
    persist(updated);
    setEditing(null);
    setIsNew(false);
  }, [name, description, coachingText, equipmentText, focusAreas, editing, isNew, drills, persist]);

  const handleDelete = useCallback(
    (id: string) => {
      persist(drills.filter((d) => d.id !== id));
    },
    [drills, persist]
  );

  const showForm = isNew || editing !== null;

  return (
    <section className="mydrills-section">
      <div className="mydrills-header">
        <div>
          <h2>My Drills</h2>
          <p className="text-muted">Create custom drills that appear in practice plans.</p>
        </div>
        {!showForm && (
          <button className="btn-primary" onClick={openNew}>
            + New Drill
          </button>
        )}
      </div>

      {showForm && (
        <div className="mydrills-form">
          <h3>{isNew ? "New Drill" : "Edit Drill"}</h3>
          <div className="form-field">
            <label>Drill Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Huck & Recover"
            />
          </div>
          <div className="form-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how to run this drill..."
              rows={3}
            />
          </div>
          <div className="form-field">
            <label>Coaching Points (one per line)</label>
            <textarea
              value={coachingText}
              onChange={(e) => setCoachingText(e.target.value)}
              placeholder={"Focus on footwork\nKeep hips low\nCommunicate early"}
              rows={3}
            />
          </div>
          <div className="form-field">
            <label>Equipment (one per line, e.g. "cones (4)")</label>
            <textarea
              value={equipmentText}
              onChange={(e) => setEquipmentText(e.target.value)}
              placeholder={"cones (4)\ndiscs (6)"}
              rows={2}
            />
          </div>
          <div className="form-field">
            <label>Focus Areas</label>
            <div className="focus-area-toggles">
              {FOCUS_AREAS.map((key) => (
                <button
                  key={key}
                  className={`focus-toggle ${focusAreas.includes(key) ? "active" : ""}`}
                  onClick={() => toggleFocusArea(key)}
                  type="button"
                >
                  {formatTitle(key)}
                </button>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              {isNew ? "Add Drill" : "Save Changes"}
            </button>
            <button className="btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {drills.length === 0 && !showForm ? (
        <div className="history-empty">
          <div className="history-empty-icon">&#x1F3CB;&#xFE0F;</div>
          <h2>No Custom Drills</h2>
          <p>Create your own drills and they'll appear in practice plans for the selected focus areas.</p>
        </div>
      ) : (
        <div className="mydrills-list">
          {drills.map((drill) => (
            <div key={drill.id} className="mydrills-card">
              <div className="mydrills-card-top">
                <div>
                  <h4 className="mydrills-card-name">{drill.name}</h4>
                  {drill.description && (
                    <p className="mydrills-card-desc">{drill.description}</p>
                  )}
                  {drill.focusAreas.length > 0 && (
                    <div className="mydrills-card-tags">
                      {drill.focusAreas.map((fa) => (
                        <span key={fa} className="equipment-tag small">
                          {formatTitle(fa)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mydrills-card-actions">
                  <button className="btn-secondary btn-sm" onClick={() => openEdit(drill)}>
                    Edit
                  </button>
                  <button className="btn-danger btn-sm" onClick={() => handleDelete(drill.id)}>
                    Delete
                  </button>
                </div>
              </div>
              {drill.coaching_points.length > 0 && (
                <ul className="mydrills-card-points">
                  {drill.coaching_points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
