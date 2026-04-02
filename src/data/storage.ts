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

/* ===== Season Plan ===== */

export interface SeasonWeek {
  weekStart: string; // ISO date (Monday of that week)
  focusArea: string | null;
}

export interface SeasonPlan {
  startDate: string;
  endDate: string;
  weeks: SeasonWeek[];
}

const SEASON_KEY = "practice-planner-season";

export function loadSeasonPlan(): SeasonPlan | null {
  try {
    const raw = localStorage.getItem(SEASON_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSeasonPlan(plan: SeasonPlan): void {
  localStorage.setItem(SEASON_KEY, JSON.stringify(plan));
}

/* ===== Roster ===== */

export interface Player {
  id: string;
  name: string;
}

const ROSTER_KEY = "practice-planner-roster";

export function loadRoster(): Player[] {
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRoster(players: Player[]): void {
  localStorage.setItem(ROSTER_KEY, JSON.stringify(players));
}

/* ===== Attendance ===== */

export interface PracticeAttendance {
  practiceId: string;
  attendance: Record<string, boolean>; // playerId -> present
  playerNotes: Record<string, string>; // playerId -> note
}

const ATTENDANCE_KEY = "practice-planner-attendance";

export function loadAllAttendance(): PracticeAttendance[] {
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAttendanceRecord(record: PracticeAttendance): void {
  const all = loadAllAttendance();
  const idx = all.findIndex((r) => r.practiceId === record.practiceId);
  if (idx !== -1) {
    all[idx] = record;
  } else {
    all.push(record);
  }
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(all));
}

export function getAttendanceForPractice(
  practiceId: string
): PracticeAttendance | null {
  return (
    loadAllAttendance().find((r) => r.practiceId === practiceId) ?? null
  );
}
