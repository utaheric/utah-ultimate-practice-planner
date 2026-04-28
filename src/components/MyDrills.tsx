import { useState, useCallback, useMemo, useRef, type ChangeEvent } from "react";
import {
  FOCUS_AREAS,
  listEditableBuiltInDrills,
  type Drill,
  type EditableBuiltInDrill,
} from "../data/drills";
import {
  applyPracticePlannerBackup,
  createDrillLibraryBackup,
  createPracticePlannerBackup,
  loadBuiltInDrillOverrides,
  loadCustomDrills,
  parseDrillLibraryBackup,
  parsePracticePlannerBackup,
  saveBuiltInDrillOverrides,
  saveCustomDrills,
  generateId,
  type BuiltInDrillOverrides,
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

type EditingState =
  | { type: "custom"; drill: CustomDrill | null }
  | { type: "built-in"; drill: EditableBuiltInDrill }
  | null;

type StatusMessage =
  | { type: "success" | "error"; text: string }
  | null;

function buildDraft(
  drill: Pick<Drill, "name" | "description" | "coaching_points" | "equipment">,
  focusAreas: string[]
) {
  return {
    name: drill.name,
    description: drill.description,
    coachingText: drill.coaching_points.join("\n"),
    equipmentText: drill.equipment.join("\n"),
    focusAreas: [...focusAreas],
  };
}

export default function MyDrills() {
  const [customDrills, setCustomDrills] = useState<CustomDrill[]>(loadCustomDrills);
  const [builtInOverrides, setBuiltInOverrides] =
    useState<BuiltInDrillOverrides>(loadBuiltInDrillOverrides);
  const [editing, setEditing] = useState<EditingState>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coachingText, setCoachingText] = useState("");
  const [equipmentText, setEquipmentText] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [focusFilter, setFocusFilter] = useState<string>("all");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
  const drillImportInputRef = useRef<HTMLInputElement | null>(null);
  const appImportInputRef = useRef<HTMLInputElement | null>(null);

  const builtInDrills = useMemo(
    () => listEditableBuiltInDrills(builtInOverrides),
    [builtInOverrides]
  );

  const filteredBuiltInDrills = useMemo(() => {
    if (focusFilter === "all") return builtInDrills;
    return builtInDrills.filter((drill) => drill.focusAreas.includes(focusFilter));
  }, [builtInDrills, focusFilter]);

  const filteredCustomDrills = useMemo(() => {
    if (focusFilter === "all") return customDrills;
    return customDrills.filter((drill) => drill.focusAreas.includes(focusFilter));
  }, [customDrills, focusFilter]);

  const editedBuiltInCount = useMemo(
    () => Object.keys(builtInOverrides).length,
    [builtInOverrides]
  );

  const resetForm = useCallback(() => {
    setName(EMPTY_DRILL.name);
    setDescription(EMPTY_DRILL.description);
    setCoachingText("");
    setEquipmentText("");
    setFocusAreas([]);
  }, []);

  const persistCustomDrills = useCallback((updated: CustomDrill[]) => {
    setCustomDrills(updated);
    saveCustomDrills(updated);
  }, []);

  const persistBuiltInOverrides = useCallback((updated: BuiltInDrillOverrides) => {
    setBuiltInOverrides(updated);
    saveBuiltInDrillOverrides(updated);
  }, []);

  const openNew = useCallback(() => {
    setStatusMessage(null);
    setEditing({ type: "custom", drill: null });
    resetForm();
  }, [resetForm]);

  const openEditCustom = useCallback((drill: CustomDrill) => {
    setStatusMessage(null);
    setEditing({ type: "custom", drill });
    const draft = buildDraft(drill, drill.focusAreas);
    setName(draft.name);
    setDescription(draft.description);
    setCoachingText(draft.coachingText);
    setEquipmentText(draft.equipmentText);
    setFocusAreas(draft.focusAreas);
  }, []);

  const openEditBuiltIn = useCallback((drill: EditableBuiltInDrill) => {
    setStatusMessage(null);
    setEditing({ type: "built-in", drill });
    const draft = buildDraft(drill, drill.focusAreas);
    setName(draft.name);
    setDescription(draft.description);
    setCoachingText(draft.coachingText);
    setEquipmentText(draft.equipmentText);
    setFocusAreas(draft.focusAreas);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(null);
    resetForm();
  }, [resetForm]);

  const toggleFocusArea = useCallback((key: string) => {
    setFocusAreas((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;

    const draftDrill: Drill = {
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
    };

    if (editing?.type === "built-in") {
      persistBuiltInOverrides({
        ...builtInOverrides,
        [editing.drill.id]: draftDrill,
      });
      setStatusMessage({ type: "success", text: `Saved built-in drill changes for ${editing.drill.name}.` });
      setEditing(null);
      return;
    }

    const customDrill: CustomDrill = {
      ...draftDrill,
      id: editing?.drill?.id || generateId(),
      focusAreas,
    };

    const updated = editing?.drill
      ? customDrills.map((drill) =>
          drill.id === customDrill.id ? customDrill : drill
        )
      : [...customDrills, customDrill];

    persistCustomDrills(updated);
    setStatusMessage({
      type: "success",
      text: editing?.drill
        ? `Saved changes to ${customDrill.name}.`
        : `Added ${customDrill.name} to your custom drill library.`,
    });
    setEditing(null);
    resetForm();
  }, [
    name,
    description,
    coachingText,
    equipmentText,
    editing,
    builtInOverrides,
    persistBuiltInOverrides,
    focusAreas,
    customDrills,
    persistCustomDrills,
    resetForm,
  ]);

  const handleDeleteCustom = useCallback(
    (id: string) => {
      const deleted = customDrills.find((drill) => drill.id === id);
      if (
        !deleted ||
        !window.confirm(`Delete ${deleted.name} from your custom drill library?`)
      ) {
        return;
      }
      persistCustomDrills(customDrills.filter((drill) => drill.id !== id));
      setStatusMessage({
        type: "success",
        text: `Deleted ${deleted.name} from your custom drill library.`,
      });
    },
    [customDrills, persistCustomDrills]
  );

  const handleResetBuiltIn = useCallback(
    (id: string) => {
      if (!window.confirm("Reset this built-in drill back to its default text?")) {
        return;
      }
      const next = { ...builtInOverrides };
      delete next[id];
      persistBuiltInOverrides(next);
      setStatusMessage({ type: "success", text: "Reset that built-in drill back to its default version." });
      if (editing?.type === "built-in" && editing.drill.id === id) {
        setEditing(null);
        resetForm();
      }
    },
    [builtInOverrides, persistBuiltInOverrides, editing, resetForm]
  );

  const handleExportLibrary = useCallback(() => {
    const backup = createDrillLibraryBackup(customDrills, builtInOverrides);
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `practice-planner-drill-library-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatusMessage({
      type: "success",
      text: "Exported your drill-library backup JSON.",
    });
  }, [customDrills, builtInOverrides]);

  const handleExportAppBackup = useCallback(() => {
    const backup = createPracticePlannerBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `practice-planner-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatusMessage({
      type: "success",
      text: "Exported a full Practice Planner backup with drills, history, roster, season plan, and attendance.",
    });
  }, []);

  const handleDrillImportPicker = useCallback(() => {
    drillImportInputRef.current?.click();
  }, []);

  const handleAppImportPicker = useCallback(() => {
    appImportInputRef.current?.click();
  }, []);

  const handleImportLibrary = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const parsed = parseDrillLibraryBackup(await file.text());
        if (!parsed) {
          throw new Error(
            "That file does not look like a valid Practice Planner drill-library backup."
          );
        }

        const hasExistingData =
          customDrills.length > 0 || Object.keys(builtInOverrides).length > 0;

        if (
          hasExistingData &&
          !window.confirm(
            "Importing will replace the current custom drills and built-in drill edits in this browser. Continue?"
          )
        ) {
          return;
        }

        persistCustomDrills(parsed.customDrills);
        persistBuiltInOverrides(parsed.builtInOverrides);
        setEditing(null);
        resetForm();
        setStatusMessage({
          type: "success",
          text: `Imported ${parsed.customDrills.length} custom drills and ${Object.keys(parsed.builtInOverrides).length} built-in drill edits.`,
        });
      } catch (error) {
        setStatusMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Import failed. Try a different drill-backup file.",
        });
      } finally {
        event.target.value = "";
      }
    },
    [customDrills.length, builtInOverrides, persistCustomDrills, persistBuiltInOverrides, resetForm]
  );

  const handleImportAppBackup = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const parsed = parsePracticePlannerBackup(await file.text());
        if (!parsed) {
          throw new Error(
            "That file does not look like a valid full Practice Planner backup."
          );
        }

        const currentBackup = createPracticePlannerBackup();
        const hasExistingData =
          currentBackup.customDrills.length > 0 ||
          Object.keys(currentBackup.builtInOverrides).length > 0 ||
          currentBackup.savedPractices.length > 0 ||
          currentBackup.seasonPlan !== null ||
          currentBackup.roster.length > 0 ||
          currentBackup.attendance.length > 0;

        if (
          hasExistingData &&
          !window.confirm(
            "Importing a full backup will replace the current drills, history, roster, season plan, and attendance in this browser. Continue?"
          )
        ) {
          return;
        }

        applyPracticePlannerBackup(parsed);
        setStatusMessage({
          type: "success",
          text: "Imported the full Practice Planner backup. Reloading to refresh every page...",
        });
        window.setTimeout(() => {
          window.location.reload();
        }, 250);
      } catch (error) {
        setStatusMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Import failed. Try a different full-backup file.",
        });
      } finally {
        event.target.value = "";
      }
    },
    []
  );

  const showForm = editing !== null;
  const isBuiltInEdit = editing?.type === "built-in";

  return (
    <section className="mydrills-section">
      <div className="mydrills-header">
        <div>
          <h2>Drill Library</h2>
          <p className="text-muted">
            Edit the built-in drill library, add your own custom drills, and back the whole thing up.
          </p>
        </div>
        <div className="mydrills-header-actions">
          {!showForm && (
            <button className="btn-primary" onClick={openNew}>
              + New Drill
            </button>
          )}
          <button className="btn-secondary" onClick={handleExportAppBackup}>
            Export App Backup
          </button>
          <button className="btn-secondary" onClick={handleAppImportPicker}>
            Import App Backup
          </button>
          <button className="btn-secondary" onClick={handleExportLibrary}>
            Export Drill Backup
          </button>
          <button className="btn-secondary" onClick={handleDrillImportPicker}>
            Import Drill Backup
          </button>
          <input
            ref={appImportInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportAppBackup}
            hidden
          />
          <input
            ref={drillImportInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportLibrary}
            hidden
          />
        </div>
      </div>

      <div className="mydrills-summary">
        <span className="mydrills-summary-pill">{builtInDrills.length} built-in</span>
        <span className="mydrills-summary-pill">{editedBuiltInCount} edited built-in</span>
        <span className="mydrills-summary-pill">{customDrills.length} custom</span>
      </div>

      {statusMessage && (
        <div className={`mydrills-status ${statusMessage.type}`}>
          {statusMessage.text}
        </div>
      )}

      <div className="mydrills-filters">
        <span className="mydrills-filter-label">Filter</span>
        <div className="focus-area-toggles">
          <button
            className={`focus-toggle ${focusFilter === "all" ? "active" : ""}`}
            onClick={() => setFocusFilter("all")}
            type="button"
          >
            All
          </button>
          {FOCUS_AREAS.map((key) => (
            <button
              key={key}
              className={`focus-toggle ${focusFilter === key ? "active" : ""}`}
              onClick={() => setFocusFilter(key)}
              type="button"
            >
              {formatTitle(key)}
            </button>
          ))}
          <button
            className={`focus-toggle ${focusFilter === "general" ? "active" : ""}`}
            onClick={() => setFocusFilter("general")}
            type="button"
          >
            General
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mydrills-form">
          <h3>
            {isBuiltInEdit
              ? `Edit Built-In Drill${editing ? `, ${editing.drill.sectionLabel}` : ""}`
              : editing?.drill
                ? "Edit Custom Drill"
                : "New Drill"}
          </h3>
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
              rows={4}
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
          {isBuiltInEdit ? (
            <div className="form-field">
              <label>Focus Area</label>
              <div className="mydrills-static-tags">
                {focusAreas.map((key) => (
                  <span key={key} className="equipment-tag small">
                    {formatTitle(key)}
                  </span>
                ))}
              </div>
              <p className="text-muted mydrills-help-text">
                Built-in drills keep their original focus area. Reset restores the original drill text.
              </p>
            </div>
          ) : (
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
          )}
          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              {isBuiltInEdit
                ? "Save Built-In Drill"
                : editing?.drill
                  ? "Save Changes"
                  : "Add Drill"}
            </button>
            <button className="btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
            {isBuiltInEdit && editing && editing.drill.isOverridden && (
              <button
                className="btn-secondary"
                onClick={() => handleResetBuiltIn(editing.drill.id)}
              >
                Reset to Default
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mydrills-subsection">
        <div className="mydrills-subsection-header">
          <div>
            <h3>Built-In Drills</h3>
            <p className="text-muted">
              Changes here update the planner's default drills for this browser.
            </p>
          </div>
        </div>
        {filteredBuiltInDrills.length === 0 ? (
          <div className="history-empty mydrills-empty-state">
            <h2>No built-in drills match this filter</h2>
            <p>Try a different focus area filter to see more of the built-in library.</p>
          </div>
        ) : (
          <div className="mydrills-list">
            {filteredBuiltInDrills.map((drill) => (
              <div key={drill.id} className="mydrills-card">
                <div className="mydrills-card-top">
                  <div>
                    <div className="mydrills-card-title-row">
                      <h4 className="mydrills-card-name">{drill.name}</h4>
                      <div className="mydrills-card-badges">
                        <span className="swap-badge">Built-In</span>
                        {drill.isOverridden && <span className="swap-badge">Edited</span>}
                      </div>
                    </div>
                    <p className="mydrills-card-meta">
                      {formatTitle(drill.focusAreas[0])} • {drill.sectionLabel}
                    </p>
                    {drill.description && (
                      <p className="mydrills-card-desc">{drill.description}</p>
                    )}
                  </div>
                  <div className="mydrills-card-actions">
                    <button className="btn-secondary btn-sm" onClick={() => openEditBuiltIn(drill)}>
                      Edit
                    </button>
                    {drill.isOverridden && (
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => handleResetBuiltIn(drill.id)}
                      >
                        Reset
                      </button>
                    )}
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
      </div>

      <div className="mydrills-subsection">
        <div className="mydrills-subsection-header">
          <div>
            <h3>Custom Drills</h3>
            <p className="text-muted">
              Custom drills can be added to matching focus areas and swapped into practice plans.
            </p>
          </div>
        </div>

        {filteredCustomDrills.length === 0 ? (
          <div className="history-empty">
            <div className="history-empty-icon">&#x1F3CB;&#xFE0F;</div>
            <h2>No Custom Drills</h2>
            <p>Create your own drills and they&apos;ll appear in practice plans for the selected focus areas.</p>
          </div>
        ) : (
          <div className="mydrills-list">
            {filteredCustomDrills.map((drill) => (
              <div key={drill.id} className="mydrills-card">
                <div className="mydrills-card-top">
                  <div>
                    <div className="mydrills-card-title-row">
                      <h4 className="mydrills-card-name">{drill.name}</h4>
                      <div className="mydrills-card-badges">
                        <span className="swap-badge">Custom</span>
                      </div>
                    </div>
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
                    <button className="btn-secondary btn-sm" onClick={() => openEditCustom(drill)}>
                      Edit
                    </button>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => handleDeleteCustom(drill.id)}
                    >
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
      </div>
    </section>
  );
}
