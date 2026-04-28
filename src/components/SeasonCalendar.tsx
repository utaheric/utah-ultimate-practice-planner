import { useState, useMemo, useCallback } from "react";
import { FOCUS_AREAS } from "../data/drills";
import { toLocalDateInputValue } from "../data/date";
import {
  loadSeasonPlan,
  saveSeasonPlan,
  type SeasonPlan,
  type SeasonWeek,
} from "../data/storage";

const FOCUS_COLORS: Record<string, string> = {
  cutting: "#f59e0b",
  "zone defense": "#3b82f6",
  "handler movement": "#8b5cf6",
  "break throws": "#ef4444",
  "endzone offense": "#10b981",
  "hex offense": "#ec4899",
};

function formatTitle(key: string): string {
  return key
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function generateWeeks(startDate: string, endDate: string): SeasonWeek[] {
  const weeks: SeasonWeek[] = [];
  const start = getMonday(new Date(startDate + "T00:00:00"));
  const end = new Date(endDate + "T00:00:00");

  const current = new Date(start);
  while (current <= end) {
    weeks.push({
      weekStart: toLocalDateInputValue(current),
      focusArea: null,
    });
    current.setDate(current.getDate() + 7);
  }
  return weeks;
}

function formatWeekLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMonthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function SeasonCalendar() {
  const [plan, setPlan] = useState<SeasonPlan | null>(loadSeasonPlan);
  const [startDate, setStartDate] = useState(
    plan?.startDate || toLocalDateInputValue()
  );
  const [endDate, setEndDate] = useState(() => {
    if (plan?.endDate) return plan.endDate;
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return toLocalDateInputValue(d);
  });
  const [editingWeek, setEditingWeek] = useState<number | null>(null);

  const weeks = useMemo(() => {
    if (!plan) return [];
    return plan.weeks;
  }, [plan]);

  const handleSetDates = useCallback(() => {
    if (startDate >= endDate) return;
    const newWeeks = generateWeeks(startDate, endDate);
    // Preserve existing assignments if dates overlap
    if (plan) {
      const existing = new Map(plan.weeks.map((w) => [w.weekStart, w.focusArea]));
      for (const w of newWeeks) {
        if (existing.has(w.weekStart)) {
          w.focusArea = existing.get(w.weekStart)!;
        }
      }
    }
    const newPlan: SeasonPlan = { startDate, endDate, weeks: newWeeks };
    setPlan(newPlan);
    saveSeasonPlan(newPlan);
  }, [startDate, endDate, plan]);

  const assignFocus = useCallback(
    (weekIdx: number, focusArea: string | null) => {
      if (!plan) return;
      const newWeeks = [...plan.weeks];
      newWeeks[weekIdx] = { ...newWeeks[weekIdx], focusArea };
      const newPlan = { ...plan, weeks: newWeeks };
      setPlan(newPlan);
      saveSeasonPlan(newPlan);
      setEditingWeek(null);
    },
    [plan]
  );

  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const fa of FOCUS_AREAS) counts[fa] = 0;
    let unassigned = 0;
    for (const w of weeks) {
      if (w.focusArea && counts[w.focusArea] !== undefined) {
        counts[w.focusArea]++;
      } else {
        unassigned++;
      }
    }
    return { counts, unassigned };
  }, [weeks]);

  const missingAreas = FOCUS_AREAS.filter((fa) => summary.counts[fa] === 0);

  // Group weeks by month for display
  const monthGroups = useMemo(() => {
    const groups: { month: string; weeks: { week: SeasonWeek; idx: number }[] }[] = [];
    for (let i = 0; i < weeks.length; i++) {
      const label = formatMonthYear(weeks[i].weekStart);
      if (groups.length === 0 || groups[groups.length - 1].month !== label) {
        groups.push({ month: label, weeks: [] });
      }
      groups[groups.length - 1].weeks.push({ week: weeks[i], idx: i });
    }
    return groups;
  }, [weeks]);

  return (
    <section className="season-section">
      <div className="season-header">
        <h2>Season Calendar</h2>
        <p className="text-muted">
          Plan your season week-by-week with focus area assignments.
        </p>
      </div>

      <div className="season-date-setup">
        <div className="season-date-row">
          <div className="form-field">
            <label>Season Start</label>
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Season End</label>
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleSetDates}>
            {plan ? "Update Dates" : "Generate Calendar"}
          </button>
        </div>
      </div>

      {plan && weeks.length > 0 && (
        <>
          {/* Summary */}
          <div className="season-summary">
            <h3>Focus Area Distribution</h3>
            <div className="season-summary-grid">
              {FOCUS_AREAS.map((fa) => (
                <div key={fa} className="season-summary-item">
                  <span
                    className="season-color-dot"
                    style={{ background: FOCUS_COLORS[fa] }}
                  />
                  <span className="season-summary-label">
                    {formatTitle(fa)}
                  </span>
                  <span className="season-summary-count">
                    {summary.counts[fa]} week{summary.counts[fa] !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
              {summary.unassigned > 0 && (
                <div className="season-summary-item">
                  <span
                    className="season-color-dot"
                    style={{ background: "#94a3b8" }}
                  />
                  <span className="season-summary-label">Unassigned</span>
                  <span className="season-summary-count">
                    {summary.unassigned} week{summary.unassigned !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
            {missingAreas.length > 0 && (
              <div className="season-warning">
                Missing focus areas: {missingAreas.map(formatTitle).join(", ")}
              </div>
            )}
          </div>

          {/* Calendar grid */}
          <div className="season-calendar">
            {monthGroups.map((group) => (
              <div key={group.month} className="season-month">
                <h4 className="season-month-label">{group.month}</h4>
                <div className="season-week-grid">
                  {group.weeks.map(({ week, idx }) => {
                    const color = week.focusArea
                      ? FOCUS_COLORS[week.focusArea] || "#94a3b8"
                      : undefined;
                    const isEditing = editingWeek === idx;
                    return (
                      <div key={week.weekStart} className="season-week-cell">
                        <button
                          className={`season-week-btn ${week.focusArea ? "assigned" : ""}`}
                          style={
                            color
                              ? ({
                                  "--week-color": color,
                                  background: color + "22",
                                  borderColor: color,
                                } as React.CSSProperties)
                              : undefined
                          }
                          onClick={() =>
                            setEditingWeek(isEditing ? null : idx)
                          }
                        >
                          <span className="season-week-date">
                            {formatWeekLabel(week.weekStart)}
                          </span>
                          {week.focusArea ? (
                            <span
                              className="season-week-focus"
                              style={{ color }}
                            >
                              {formatTitle(week.focusArea)}
                            </span>
                          ) : (
                            <span className="season-week-empty">
                              Tap to assign
                            </span>
                          )}
                        </button>
                        {isEditing && (
                          <div className="season-dropdown">
                            {FOCUS_AREAS.map((fa) => (
                              <button
                                key={fa}
                                className="season-dropdown-item"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  assignFocus(idx, fa);
                                }}
                              >
                                <span
                                  className="season-color-dot"
                                  style={{ background: FOCUS_COLORS[fa] }}
                                />
                                {formatTitle(fa)}
                              </button>
                            ))}
                            {week.focusArea && (
                              <button
                                className="season-dropdown-item season-dropdown-clear"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  assignFocus(idx, null);
                                }}
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!plan && (
        <div className="history-empty">
          <div className="history-empty-icon">&#x1F4C6;</div>
          <h2>No Season Planned</h2>
          <p>Set your season dates above to start planning week by week.</p>
        </div>
      )}
    </section>
  );
}
