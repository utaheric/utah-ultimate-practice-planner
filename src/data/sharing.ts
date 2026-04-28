import type { Drill, ScheduleBlock } from "./drills";
import { generateSchedule } from "./drills";
import type { SavedPractice } from "./storage";

interface ShareData {
  f: string; // focusKey
  d: string; // date
  n?: Partial<SavedPractice["notes"]>; // notes (only non-empty)
  x?: Record<string, Drill>; // swapped drills (only changed sections)
  s?: ScheduleBlock[]; // full schedule for custom plans
}

interface EncodeShareOptions {
  includeNotes?: boolean;
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

function cloneDrill(drill: Drill): Drill {
  return {
    ...drill,
    coaching_points: [...drill.coaching_points],
    equipment: [...drill.equipment],
  };
}

function cloneSchedule(block: ScheduleBlock): ScheduleBlock {
  return {
    ...block,
    drill: cloneDrill(block.drill),
  };
}

function toBase64Url(data: object): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(encoded: string): unknown {
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json);
}

export function encodeShareUrl(
  practice: SavedPractice,
  options: EncodeShareOptions = {}
): string {
  const includeNotes = options.includeNotes ?? true;
  const defaultSchedule = generateSchedule(practice.focusKey);
  const swaps: Record<string, Drill> = {};

  for (const block of practice.schedule) {
    const defaultBlock = defaultSchedule.find(
      (b) => b.sectionKey === block.sectionKey
    );
    if (defaultBlock && defaultBlock.drill.name !== block.drill.name) {
      swaps[block.sectionKey] = block.drill;
    }
  }

  const data: ShareData = {
    f: practice.focusKey,
    d: practice.date,
  };

  if (practice.focusKey === "custom" || defaultSchedule.length === 0) {
    data.s = practice.schedule.map(cloneSchedule);
  }

  const notes = practice.notes;
  const hasNotes =
    notes.workedWell || notes.needsReps || notes.playerNotes || notes.adjustments;
  if (includeNotes && hasNotes) {
    const n: Partial<SavedPractice["notes"]> = {};
    if (notes.workedWell) n.workedWell = notes.workedWell;
    if (notes.needsReps) n.needsReps = notes.needsReps;
    if (notes.playerNotes) n.playerNotes = notes.playerNotes;
    if (notes.adjustments) n.adjustments = notes.adjustments;
    data.n = n;
  }

  if (!data.s && Object.keys(swaps).length > 0) {
    data.x = swaps;
  }

  const encoded = toBase64Url(data);
  return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
}

export interface SharedPractice {
  focusKey: string;
  date: string;
  schedule: ScheduleBlock[];
  notes: SavedPractice["notes"];
}

export function decodeShareUrl(hash: string): SharedPractice | null {
  try {
    const match = hash.match(/^#share=(.+)$/);
    if (!match) return null;

    const data = fromBase64Url(match[1]) as ShareData;
    if (!data.f || !data.d) return null;

    const schedule =
      Array.isArray(data.s) && data.s.every(isScheduleBlock)
        ? data.s.map(cloneSchedule)
        : generateSchedule(data.f);
    if (schedule.length === 0) return null;

    // Apply swaps
    if (data.x) {
      for (const block of schedule) {
        if (data.x[block.sectionKey]) {
          block.drill = data.x[block.sectionKey];
        }
      }
    }

    return {
      focusKey: data.f,
      date: data.d,
      schedule,
      notes: {
        workedWell: data.n?.workedWell || "",
        needsReps: data.n?.needsReps || "",
        playerNotes: data.n?.playerNotes || "",
        adjustments: data.n?.adjustments || "",
      },
    };
  } catch {
    return null;
  }
}

export function getShareDataFromHash(): SharedPractice | null {
  return decodeShareUrl(window.location.hash);
}
