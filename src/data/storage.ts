import type { Drill, ScheduleBlock } from "./drills";

/* ===== Custom Drill ===== */

export interface CustomDrill extends Drill {
  id: string;
  focusAreas: string[]; // which focus area keys it belongs to
}

const CUSTOM_DRILLS_KEY = "practice-planner-custom-drills";
const BUILTIN_DRILL_OVERRIDES_KEY = "practice-planner-built-in-drill-overrides";

export type BuiltInDrillOverrides = Record<string, Drill>;

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

export function loadBuiltInDrillOverrides(): BuiltInDrillOverrides {
  try {
    const raw = localStorage.getItem(BUILTIN_DRILL_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveBuiltInDrillOverrides(
  overrides: BuiltInDrillOverrides
): void {
  localStorage.setItem(
    BUILTIN_DRILL_OVERRIDES_KEY,
    JSON.stringify(overrides)
  );
}

export interface DrillLibraryBackup {
  version: 1;
  exportedAt: string;
  customDrills: CustomDrill[];
  builtInOverrides: BuiltInDrillOverrides;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isDrill(value: unknown): value is Drill {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.description === "string" &&
    isStringArray(value.coaching_points) &&
    isStringArray(value.equipment)
  );
}

function isCustomDrill(value: unknown): value is CustomDrill {
  return (
    isDrill(value) &&
    isRecord(value) &&
    typeof value["id"] === "string" &&
    isStringArray(value["focusAreas"])
  );
}

function cloneDrill(drill: Drill): Drill {
  return {
    ...drill,
    coaching_points: [...drill.coaching_points],
    equipment: [...drill.equipment],
  };
}

function cloneCustomDrill(drill: CustomDrill): CustomDrill {
  return {
    ...cloneDrill(drill),
    id: drill.id,
    focusAreas: [...drill.focusAreas],
  };
}

function isScheduleBlock(value: unknown): value is ScheduleBlock {
  return (
    isRecord(value) &&
    isNumber(value.startMin) &&
    isNumber(value.endMin) &&
    typeof value.label === "string" &&
    isDrill(value.drill) &&
    isNumber(value.duration) &&
    typeof value.sectionKey === "string"
  );
}

function cloneScheduleBlock(block: ScheduleBlock): ScheduleBlock {
  return {
    ...block,
    drill: cloneDrill(block.drill),
  };
}

function isSavedPracticeNotes(
  value: unknown
): value is SavedPractice["notes"] {
  return (
    isRecord(value) &&
    typeof value.workedWell === "string" &&
    typeof value.needsReps === "string" &&
    typeof value.playerNotes === "string" &&
    typeof value.adjustments === "string"
  );
}

function isSavedPractice(value: unknown): value is SavedPractice {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.date === "string" &&
    typeof value.focusKey === "string" &&
    Array.isArray(value.schedule) &&
    value.schedule.every(isScheduleBlock) &&
    isSavedPracticeNotes(value.notes) &&
    typeof value.savedAt === "string" &&
    (value.completedAt === undefined || typeof value.completedAt === "string")
  );
}

function cloneSavedPractice(practice: SavedPractice): SavedPractice {
  return {
    ...practice,
    schedule: practice.schedule.map(cloneScheduleBlock),
    notes: { ...practice.notes },
  };
}

function isSeasonWeek(value: unknown): value is SeasonWeek {
  return (
    isRecord(value) &&
    typeof value.weekStart === "string" &&
    (typeof value.focusArea === "string" || value.focusArea === null)
  );
}

function isSeasonPlan(value: unknown): value is SeasonPlan {
  return (
    isRecord(value) &&
    typeof value.startDate === "string" &&
    typeof value.endDate === "string" &&
    Array.isArray(value.weeks) &&
    value.weeks.every(isSeasonWeek)
  );
}

function cloneSeasonPlan(plan: SeasonPlan): SeasonPlan {
  return {
    ...plan,
    weeks: plan.weeks.map((week) => ({ ...week })),
  };
}

function isPlayer(value: unknown): value is Player {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (value.watchNotes === undefined || typeof value.watchNotes === "string")
  );
}

function clonePlayer(player: Player): Player {
  return { ...player };
}

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return (
    isRecord(value) &&
    Object.values(value).every((item) => typeof item === "boolean")
  );
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    isRecord(value) &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

function isPracticeAttendance(value: unknown): value is PracticeAttendance {
  return (
    isRecord(value) &&
    typeof value.practiceId === "string" &&
    isBooleanRecord(value.attendance) &&
    isStringRecord(value.playerNotes)
  );
}

function clonePracticeAttendance(
  record: PracticeAttendance
): PracticeAttendance {
  return {
    ...record,
    attendance: { ...record.attendance },
    playerNotes: { ...record.playerNotes },
  };
}

export function createDrillLibraryBackup(
  customDrills: CustomDrill[],
  builtInOverrides: BuiltInDrillOverrides
): DrillLibraryBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    customDrills: customDrills.map(cloneCustomDrill),
    builtInOverrides: Object.fromEntries(
      Object.entries(builtInOverrides).map(([id, drill]) => [id, cloneDrill(drill)])
    ),
  };
}

export function parseDrillLibraryBackup(raw: string): DrillLibraryBackup | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed) || parsed.version !== 1) return null;

    const { exportedAt, customDrills, builtInOverrides } = parsed;
    if (typeof exportedAt !== "string" || !Array.isArray(customDrills)) {
      return null;
    }
    if (!customDrills.every(isCustomDrill) || !isRecord(builtInOverrides)) {
      return null;
    }

    const normalizedOverrides: BuiltInDrillOverrides = {};
    for (const [id, drill] of Object.entries(builtInOverrides)) {
      if (!isDrill(drill)) return null;
      normalizedOverrides[id] = cloneDrill(drill);
    }

    const normalizedCustomDrills = (customDrills as CustomDrill[]).map(
      cloneCustomDrill
    );

    return {
      version: 1,
      exportedAt,
      customDrills: normalizedCustomDrills,
      builtInOverrides: normalizedOverrides,
    };
  } catch {
    return null;
  }
}

export interface PracticePlannerBackup {
  version: 1;
  exportedAt: string;
  customDrills: CustomDrill[];
  builtInOverrides: BuiltInDrillOverrides;
  savedPractices: SavedPractice[];
  seasonPlan: SeasonPlan | null;
  roster: Player[];
  attendance: PracticeAttendance[];
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
  completedAt?: string; // ISO timestamp
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

export function saveSavedPractices(practices: SavedPractice[]): void {
  localStorage.setItem(SAVED_PRACTICES_KEY, JSON.stringify(practices));
}

export function savePracticeToHistory(practice: SavedPractice): void {
  const all = loadSavedPractices();
  all.push(practice);
  saveSavedPractices(all);
}

export function updatePracticeNotes(
  id: string,
  notes: SavedPractice["notes"]
): void {
  const all = loadSavedPractices();
  const idx = all.findIndex((p) => p.id === id);
  if (idx !== -1) {
    all[idx].notes = notes;
    saveSavedPractices(all);
  }
}

export function updatePracticeCompleted(
  id: string,
  completedAt: string | undefined
): void {
  const all = loadSavedPractices();
  const idx = all.findIndex((p) => p.id === id);
  if (idx !== -1) {
    if (completedAt) all[idx].completedAt = completedAt;
    else delete all[idx].completedAt;
    saveSavedPractices(all);
  }
}

export function deleteSavedPractice(id: string): void {
  const all = loadSavedPractices().filter((p) => p.id !== id);
  saveSavedPractices(all);
  saveAllAttendance(loadAllAttendance().filter((r) => r.practiceId !== id));
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

export function clearSeasonPlan(): void {
  localStorage.removeItem(SEASON_KEY);
}

/* ===== Roster ===== */

export interface Player {
  id: string;
  name: string;
  watchNotes?: string;
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

export function saveAllAttendance(records: PracticeAttendance[]): void {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

export function saveAttendanceRecord(record: PracticeAttendance): void {
  const all = loadAllAttendance();
  const idx = all.findIndex((r) => r.practiceId === record.practiceId);
  if (idx !== -1) {
    all[idx] = record;
  } else {
    all.push(record);
  }
  saveAllAttendance(all);
}

export function getAttendanceForPractice(
  practiceId: string
): PracticeAttendance | null {
  return (
    loadAllAttendance().find((r) => r.practiceId === practiceId) ?? null
  );
}

export function createPracticePlannerBackup(): PracticePlannerBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    customDrills: loadCustomDrills().map(cloneCustomDrill),
    builtInOverrides: Object.fromEntries(
      Object.entries(loadBuiltInDrillOverrides()).map(([id, drill]) => [
        id,
        cloneDrill(drill),
      ])
    ),
    savedPractices: loadSavedPractices().map(cloneSavedPractice),
    seasonPlan: (() => {
      const plan = loadSeasonPlan();
      return plan ? cloneSeasonPlan(plan) : null;
    })(),
    roster: loadRoster().map(clonePlayer),
    attendance: loadAllAttendance().map(clonePracticeAttendance),
  };
}

export function parsePracticePlannerBackup(
  raw: string
): PracticePlannerBackup | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed) || parsed.version !== 1) return null;

    const {
      exportedAt,
      customDrills,
      builtInOverrides,
      savedPractices,
      seasonPlan,
      roster,
      attendance,
    } = parsed;

    if (
      typeof exportedAt !== "string" ||
      !Array.isArray(customDrills) ||
      !isRecord(builtInOverrides) ||
      !Array.isArray(savedPractices) ||
      !(seasonPlan === null || isSeasonPlan(seasonPlan)) ||
      !Array.isArray(roster) ||
      !Array.isArray(attendance)
    ) {
      return null;
    }

    if (
      !customDrills.every(isCustomDrill) ||
      !savedPractices.every(isSavedPractice) ||
      !roster.every(isPlayer) ||
      !attendance.every(isPracticeAttendance)
    ) {
      return null;
    }

    const normalizedOverrides: BuiltInDrillOverrides = {};
    for (const [id, drill] of Object.entries(builtInOverrides)) {
      if (!isDrill(drill)) return null;
      normalizedOverrides[id] = cloneDrill(drill);
    }

    return {
      version: 1,
      exportedAt,
      customDrills: (customDrills as CustomDrill[]).map(cloneCustomDrill),
      builtInOverrides: normalizedOverrides,
      savedPractices: (savedPractices as SavedPractice[]).map(cloneSavedPractice),
      seasonPlan: seasonPlan ? cloneSeasonPlan(seasonPlan as SeasonPlan) : null,
      roster: (roster as Player[]).map(clonePlayer),
      attendance: (attendance as PracticeAttendance[]).map(clonePracticeAttendance),
    };
  } catch {
    return null;
  }
}

export function applyPracticePlannerBackup(
  backup: PracticePlannerBackup
): void {
  saveCustomDrills(backup.customDrills.map(cloneCustomDrill));
  saveBuiltInDrillOverrides(
    Object.fromEntries(
      Object.entries(backup.builtInOverrides).map(([id, drill]) => [
        id,
        cloneDrill(drill),
      ])
    )
  );
  saveSavedPractices(backup.savedPractices.map(cloneSavedPractice));
  if (backup.seasonPlan) {
    saveSeasonPlan(cloneSeasonPlan(backup.seasonPlan));
  } else {
    clearSeasonPlan();
  }
  saveRoster(backup.roster.map(clonePlayer));
  saveAllAttendance(backup.attendance.map(clonePracticeAttendance));
}
