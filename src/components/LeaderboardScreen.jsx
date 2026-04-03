import { useMemo } from "react";
import useGameStore from "../store/gameStore";
import { getRank } from "../data/ranks";
import { sounds } from "../utils/sound";

const RANK_COLORS = ["gold", "silver", "bronze"];

export default function LeaderboardScreen() {
  const { leaderboard, soundEnabled, setScreen } = useGameStore();

  const sorted = useMemo(() => [...leaderboard].sort((a, b) => b.xp - a.xp), [leaderboard]);

  return (
    <>
      <div className="header-bar" style={{ padding: "16px 20px" }}>
        <div className="lb-title">Leaderboard</div>
        <div className="lb-subtitle">Top Pinoy Trivia Masters</div>
      </div>

      <div className="scroll-area">
        <div className="lb-body">
          <div className="lb-section-title">🏆 Top Pinoy Trivia Masters</div>
          {sorted.map((entry, i) => {
            const isYou = entry.name === "Ikaw (You)";
            const rank = getRank(entry.xp);
            return (
              <div key={i} className={`lb-row ${isYou ? "lb-you" : ""}`}>
                <div className={`lb-rank-num ${RANK_COLORS[i] || ""}`}>{i + 1}</div>
                <div className="lb-info">
                  <div className="lb-name">{entry.name}{isYou ? " (You)" : ""}</div>
                  <div className="lb-detail">{rank.icon} {rank.name} • {entry.date || ""}</div>
                </div>
                <div className="lb-score">{entry.xp.toLocaleString()} XP</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "10px 14px", flexShrink: 0 }}>
        <button
          className="btn-secondary"
          style={{ padding: 10, fontSize: 13 }}
          onClick={() => { if (soundEnabled) sounds.click(); setScreen("menu"); }}
        >
          ← Bumalik
        </button>
      </div>
      <div className="ad-banner">[ Ad Space — Banner Ad ]</div>
    </>
  );
}
