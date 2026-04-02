import { useState, useMemo, useCallback } from "react";
import {
  loadRoster,
  saveRoster,
  loadSavedPractices,
  loadAllAttendance,
  generateId,
  type Player,
  type SavedPractice,
} from "../data/storage";

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
    year: "numeric",
  });
}

export default function Roster() {
  const [players, setPlayers] = useState<Player[]>(loadRoster);
  const [newName, setNewName] = useState("");
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const practices = useMemo(() => loadSavedPractices(), []);
  const allAttendance = useMemo(() => loadAllAttendance(), []);

  const practiceMap = useMemo(() => {
    const map = new Map<string, SavedPractice>();
    for (const p of practices) map.set(p.id, p);
    return map;
  }, [practices]);

  // Compute per-player stats
  const playerStats = useMemo(() => {
    const stats: Record<
      string,
      {
        attended: number;
        total: number;
        logs: { practiceId: string; date: string; focusKey: string; note: string }[];
      }
    > = {};

    for (const player of players) {
      const logs: { practiceId: string; date: string; focusKey: string; note: string }[] = [];
      let attended = 0;
      let total = 0;

      for (const att of allAttendance) {
        if (att.attendance[player.id] !== undefined) {
          total++;
          if (att.attendance[player.id]) {
            attended++;
          }
          const practice = practiceMap.get(att.practiceId);
          if (practice && (att.attendance[player.id] || att.playerNotes[player.id])) {
            logs.push({
              practiceId: att.practiceId,
              date: practice.date,
              focusKey: practice.focusKey,
              note: att.playerNotes[player.id] || "",
            });
          }
        }
      }

      logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      stats[player.id] = { attended, total, logs };
    }
    return stats;
  }, [players, allAttendance, practiceMap]);

  const addPlayer = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const updated = [...players, { id: generateId(), name: trimmed }];
    setPlayers(updated);
    saveRoster(updated);
    setNewName("");
  }, [newName, players]);

  const removePlayer = useCallback(
    (id: string) => {
      const updated = players.filter((p) => p.id !== id);
      setPlayers(updated);
      saveRoster(updated);
      if (expandedPlayer === id) setExpandedPlayer(null);
    },
    [players, expandedPlayer]
  );

  const startEdit = useCallback((player: Player) => {
    setEditingId(player.id);
    setEditName(player.name);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingId || !editName.trim()) return;
    const updated = players.map((p) =>
      p.id === editingId ? { ...p, name: editName.trim() } : p
    );
    setPlayers(updated);
    saveRoster(updated);
    setEditingId(null);
  }, [editingId, editName, players]);

  return (
    <section className="roster-section">
      <div className="roster-header">
        <h2>Roster</h2>
        <p className="text-muted">
          Manage your players and track attendance across practices.
        </p>
      </div>

      <div className="roster-add">
        <input
          type="text"
          className="roster-name-input"
          placeholder="Player name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
        />
        <button
          className="btn-primary"
          onClick={addPlayer}
          disabled={!newName.trim()}
        >
          Add Player
        </button>
      </div>

      {players.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">&#x1F465;</div>
          <h2>No Players Yet</h2>
          <p>Add players above to start tracking attendance.</p>
        </div>
      ) : (
        <div className="roster-list">
          {players.map((player) => {
            const stats = playerStats[player.id];
            const isExpanded = expandedPlayer === player.id;
            const isEditing = editingId === player.id;
            const pct =
              stats && stats.total > 0
                ? Math.round((stats.attended / stats.total) * 100)
                : null;

            return (
              <div key={player.id} className="roster-card">
                <button
                  className="roster-card-header"
                  onClick={() =>
                    setExpandedPlayer(isExpanded ? null : player.id)
                  }
                >
                  <div className="roster-card-left">
                    {isEditing ? (
                      <div
                        className="roster-edit-inline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                          className="roster-edit-input"
                          autoFocus
                        />
                        <button className="btn-primary btn-sm" onClick={saveEdit}>
                          Save
                        </button>
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="roster-player-name">{player.name}</span>
                        <span className="roster-player-stats">
                          {stats && stats.total > 0 ? (
                            <>
                              {stats.attended}/{stats.total} practices
                              {pct !== null && ` (${pct}%)`}
                            </>
                          ) : (
                            "No attendance data"
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  <span
                    className={`drill-card-chevron ${isExpanded ? "expanded" : ""}`}
                  >
                    &#x25B6;
                  </span>
                </button>
                {isExpanded && (
                  <div className="roster-card-body">
                    <div className="roster-card-actions">
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => startEdit(player)}
                      >
                        Edit Name
                      </button>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => removePlayer(player.id)}
                      >
                        Remove
                      </button>
                    </div>
                    {stats && stats.logs.length > 0 ? (
                      <div className="roster-log">
                        <h4>Practice Log</h4>
                        {stats.logs.map((log) => (
                          <div key={log.practiceId} className="roster-log-entry">
                            <div className="roster-log-header">
                              <span className="roster-log-date">
                                {formatDate(log.date)}
                              </span>
                              <span className="roster-log-focus">
                                {formatTitle(log.focusKey)}
                              </span>
                            </div>
                            {log.note && (
                              <p className="roster-log-note">{log.note}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted" style={{ marginTop: 12 }}>
                        No practice logs yet. Attendance is recorded when saving
                        practice plans.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
