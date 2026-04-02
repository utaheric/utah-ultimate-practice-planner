import type { Drill, ScheduleBlock } from "./drills";
import { generateSchedule } from "./drills";
import type { SavedPractice } from "./storage";

interface ShareData {
  f: string; // focusKey
  d: string; // date
  n?: Partial<SavedPractice["notes"]>; // notes (only non-empty)
  x?: Record<string, Drill>; // swapped drills (only changed sections)
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

export function encodeShareUrl(practice: SavedPractice): string {
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

  const notes = practice.notes;
  const hasNotes =
    notes.workedWell || notes.needsReps || notes.playerNotes || notes.adjustments;
  if (hasNotes) {
    const n: Partial<SavedPractice["notes"]> = {};
    if (notes.workedWell) n.workedWell = notes.workedWell;
    if (notes.needsReps) n.needsReps = notes.needsReps;
    if (notes.playerNotes) n.playerNotes = notes.playerNotes;
    if (notes.adjustments) n.adjustments = notes.adjustments;
    data.n = n;
  }

  if (Object.keys(swaps).length > 0) {
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

    const schedule = generateSchedule(data.f);
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
