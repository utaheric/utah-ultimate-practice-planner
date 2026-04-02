import type { Drill, ScheduleBlock } from "./drills";

/* ===== Custom Drill ===== */

export interface CustomDrill extends Drill {
  id: string;
  focusAreas: string[]; // which focus area keys it belongs to
}

const CUSTOM_DRILLS_KEY = "practice-planner-custom-drills";

export function loadCustomDrills(): CustomDrill[] {
  try {
    const raw = localStorage.getItem(CUSTOM_DRILLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomDrills(drills: CustomDrill[]): void {
  localStorage.setItem(CUSTOM_DRILLS_KEY, JSON.stringify(drills));
}

/* ===== Saved Practice ===== */

export interface SavedPractice {
  id: string;
  date: string;
  focusKey: string;
  schedule: ScheduleBlock[];
  notes: {
    workedWell: string;
    needsReps: string;
    playerNotes: string;
    adjustments: string;
  };
  savedAt: string; // ISO timestamp
}

const SAVED_PRACTICES_KEY = "practice-planner-history";

export function loadSavedPractices(): SavedPractice[] {
  try {
    const raw = localStorage.getItem(SAVED_PRACTICES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePracticeToHistory(practice: SavedPractice): void {
  const all = loadSavedPractices();
  all.push(practice);
  localStorage.setItem(SAVED_PRACTICES_KEY, JSON.stringify(all));
}

export function updatePracticeNotes(
  id: string,
  notes: SavedPractice["notes"]
): void {
  const all = loadSavedPractices();
  const idx = all.findIndex((p) => p.id === id);
  if (idx !== -1) {
    all[idx].notes = notes;
    localStorage.setItem(SAVED_PRACTICES_KEY, JSON.stringify(all));
  }
}

export function deleteSavedPractice(id: string): void {
  const all = loadSavedPractices().filter((p) => p.id !== id);
  localStorage.setItem(SAVED_PRACTICES_KEY, JSON.stringify(all));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
