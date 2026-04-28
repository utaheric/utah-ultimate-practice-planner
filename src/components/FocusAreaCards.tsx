import { useMemo } from "react";
import {
  aggregateEquipment,
  FOCUS_AREAS,
  FOCUS_AREA_DESCRIPTIONS,
  generateSchedule,
} from "../data/drills";
import {
  loadCustomDrills,
  loadRoster,
  loadSavedPractices,
  loadSeasonPlan,
  type SavedPractice,
} from "../data/storage";
import { toLocalDateInputValue } from "../data/date";

const ICONS: Record<string, string> = {
  cutting: "CU",
  "zone defense": "ZD",
  "handler movement": "HM",
  "break throws": "BT",
  "red zone offense": "RZ",
  "hex offense": "HX",
  "reset corners": "RC",
  "scram defense": "SD",
  "double team": "DT",
  "chunk yards": "CY",
};

const SHORT_DESCRIPTIONS: Record<string, string> = {
  cutting: "Separation, timing, and burst mechanics.",
  "zone defense": "Shape, traps, rotation, and communication.",
  "handler movement": "Resets, weaves, and dump-swing flow.",
  "break throws": "Release points, mark reads, and footwork.",
  "red zone offense": "Small-space scoring and cone priorities.",
  "hex offense": "Connected spacing and throw-and-run habits.",
  "reset corners": "Alpha, Beta, Burnie, and Trail resets.",
  "scram defense": "Cascading pressure and return-to-man reads.",
  "double team": "Pressure, pivots, and cutter engagement.",
  "chunk yards": "Attack-column continuations and power cuts.",
};

interface Props {
  onSelect: (key: string) => void;
  onBuildCustom: () => void;
  onRepeatPractice: (practice: SavedPractice) => void;
  onOpenHistory: () => void;
  onOpenRoster: () => void;
  onOpenSeason: () => void;
}

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
    month: "short",
    day: "numeric",
  });
}

function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return toLocalDateInputValue(d);
}

function getLastPractice(practices: SavedPractice[]): SavedPractice | null {
  if (practices.length === 0) return null;
  return [...practices].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  )[0];
}

function summarizeEquipment(key: string): string {
  const equipment = aggregateEquipment(generateSchedule(key));
  if (equipment.length === 0) return "no gear";
  return equipment
    .map((item) => item.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(" + ");
}

export default function FocusAreaCards({
  onSelect,
  onBuildCustom,
  onRepeatPractice,
  onOpenHistory,
  onOpenRoster,
  onOpenSeason,
}: Props) {
  const dashboard = useMemo(() => {
    const savedPractices = loadSavedPractices();
    const roster = loadRoster();
    const customDrills = loadCustomDrills();
    const seasonPlan = loadSeasonPlan();
    const currentWeek = seasonPlan?.weeks.find(
      (week) => week.weekStart === getMonday(new Date())
    );

    return {
      lastPractice: getLastPractice(savedPractices),
      savedPracticeCount: savedPractices.length,
      playerCount: roster.length,
      customDrillCount: customDrills.length,
      seasonFocus: currentWeek?.focusArea ?? null,
    };
  }, []);

  const jumpToFocusAreas = () => {
    document
      .getElementById("focus-areas")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="focus-cards-section">
      <div className="coach-dashboard">
        <div className="dashboard-hero">
          <span className="section-kicker">Today&apos;s Practice</span>
          <h2>Build the plan, run the field, capture what matters.</h2>
          <p>
            Start from this week&apos;s season focus, repeat a recent theme, or
            build a fresh practice from the drill library.
          </p>
          <div className="dashboard-actions">
            {dashboard.seasonFocus && (
              <button
                className="btn-primary"
                onClick={() => onSelect(dashboard.seasonFocus!)}
              >
                Use {formatTitle(dashboard.seasonFocus)}
              </button>
            )}
            <button className="btn-primary" onClick={onBuildCustom}>
              Build Custom Plan
            </button>
            {dashboard.lastPractice && (
              <button
                className="btn-secondary"
                onClick={() => onRepeatPractice(dashboard.lastPractice!)}
              >
                Start From Last
              </button>
            )}
            <button className="btn-secondary" onClick={jumpToFocusAreas}>
              Browse Focus Areas
            </button>
          </div>
        </div>

        <div className="dashboard-side">
          <button className="dashboard-card" onClick={onOpenHistory}>
            <span className="dashboard-card-label">Last Saved</span>
            <strong>
              {dashboard.lastPractice
                ? formatTitle(dashboard.lastPractice.focusKey)
                : "No practices yet"}
            </strong>
            <small>
              {dashboard.lastPractice
                ? `${formatDate(dashboard.lastPractice.date)} - open history`
                : "Save a practice to build a coaching trail."}
            </small>
          </button>
          <button className="dashboard-card" onClick={onOpenSeason}>
            <span className="dashboard-card-label">Season Focus</span>
            <strong>
              {dashboard.seasonFocus
                ? formatTitle(dashboard.seasonFocus)
                : "Unassigned"}
            </strong>
            <small>Open the season calendar</small>
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <button onClick={onOpenHistory}>
          <strong>{dashboard.savedPracticeCount}</strong>
          <span>saved practices</span>
        </button>
        <button onClick={onOpenRoster}>
          <strong>{dashboard.playerCount}</strong>
          <span>roster players</span>
        </button>
        <button onClick={onBuildCustom}>
          <strong>{dashboard.customDrillCount}</strong>
          <span>custom drills</span>
        </button>
      </div>

      <h3 id="focus-areas" className="focus-grid-title">
        Focus Areas
      </h3>
      <div className="focus-grid">
        {FOCUS_AREAS.map((key) => {
          const blockCount = generateSchedule(key).length;
          const equipmentSummary = summarizeEquipment(key);

          return (
            <button
              key={key}
              className="focus-card"
              onClick={() => onSelect(key)}
            >
              <div className="focus-card-main">
                <span className="focus-card-icon">{ICONS[key] || "FA"}</span>
                <div>
                  <h3 className="focus-card-title">{formatTitle(key)}</h3>
                  <p className="focus-card-desc">
                    {SHORT_DESCRIPTIONS[key] || FOCUS_AREA_DESCRIPTIONS[key]}
                  </p>
                </div>
              </div>
              <div className="focus-card-footer">
                <span>{blockCount} blocks</span>
                <span>{equipmentSummary}</span>
                <strong>Start</strong>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
