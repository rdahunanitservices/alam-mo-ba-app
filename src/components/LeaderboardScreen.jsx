import { useMemo, useEffect, useState } from "react";
import useGameStore from "../store/gameStore";
import { getRank } from "../data/ranks";
import { getTopLeaderboard, getUserRank } from "../firebase/service";
import { sounds } from "../utils/sound";

const RANK_COLORS = ["gold", "silver", "bronze"];

export default function LeaderboardScreen() {
  const { leaderboard, soundEnabled, setScreen, user, isOnline, setOnlineLeaderboard, onlineLeaderboard } = useGameStore();
  const [tab, setTab] = useState(isOnline ? "online" : "local");
  const [loading, setLoading] = useState(false);
  const [myRank, setMyRank] = useState(null);

  const localSorted = useMemo(() => [...leaderboard].sort((a, b) => b.xp - a.xp), [leaderboard]);

  // Fetch online leaderboard
  useEffect(() => {
    if (tab === "online" && isOnline) {
      setLoading(true);
      getTopLeaderboard(50).then((results) => {
        setOnlineLeaderboard(results);
        setLoading(false);
      });
      if (user) {
        getUserRank(user.uid).then((rank) => setMyRank(rank));
      }
    }
  }, [tab, isOnline, user, setOnlineLeaderboard]);

  const renderRow = (entry, i, isOnlineRow = false) => {
    const isYou = isOnlineRow
      ? entry.id === user?.uid
      : entry.name === "Ikaw (You)";
    const rank = getRank(entry.totalXp || entry.xp || 0);
    const name = isOnlineRow ? entry.displayName : entry.name;
    const xp = entry.totalXp || entry.xp || 0;
    const photo = isOnlineRow ? entry.photoURL : null;

    return (
      <div key={i} className={`lb-row ${isYou ? "lb-you" : ""}`}>
        <div className={`lb-rank-num ${RANK_COLORS[i] || ""}`}>{i + 1}</div>
        {photo && <img src={photo} alt="" className="lb-avatar" referrerPolicy="no-referrer" />}
        <div className="lb-info">
          <div className="lb-name">{name}{isYou ? " (You)" : ""}</div>
          <div className="lb-detail">{rank.icon} {rank.name}</div>
        </div>
        <div className="lb-score">{xp.toLocaleString()} XP</div>
      </div>
    );
  };

  return (
    <>
      <div className="header-bar" style={{ padding: "16px 20px" }}>
        <div className="lb-title">🏆 Leaderboard</div>
        <div className="lb-subtitle">
          {tab === "online" && myRank ? `Your rank: #${myRank}` : "Top Pinoy Trivia Masters"}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="lb-tabs">
        <button
          className={`lb-tab ${tab === "local" ? "active" : ""}`}
          onClick={() => { if (soundEnabled) sounds.click(); setTab("local"); }}
        >
          📱 Local
        </button>
        <button
          className={`lb-tab ${tab === "online" ? "active" : ""}`}
          onClick={() => { if (soundEnabled) sounds.click(); setTab("online"); }}
          disabled={!isOnline}
        >
          🌐 Online {!isOnline && "(Sign in)"}
        </button>
      </div>

      <div className="scroll-area">
        <div className="lb-body">
          {tab === "local" && (
            <>
              <div className="lb-section-title">📱 Local Leaderboard</div>
              {localSorted.map((entry, i) => renderRow(entry, i, false))}
            </>
          )}

          {tab === "online" && loading && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-mid)" }}>
              Loading online rankings...
            </div>
          )}

          {tab === "online" && !loading && onlineLeaderboard.length > 0 && (
            <>
              <div className="lb-section-title">🌐 Online — Top 50 Players</div>
              {onlineLeaderboard.map((entry, i) => renderRow(entry, i, true))}
            </>
          )}

          {tab === "online" && !loading && onlineLeaderboard.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-mid)", fontSize: 13 }}>
              {isOnline
                ? "No online scores yet. Play a game to be the first!"
                : "Sign in with Google to see online rankings."
              }
            </div>
          )}
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
