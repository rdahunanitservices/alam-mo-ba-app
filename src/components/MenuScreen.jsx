import { useMemo } from "react";
import useGameStore from "../store/gameStore";
import { getRank, getNextRank, getXpProgress } from "../data/ranks";
import { getDailyChallenge } from "../data/dailyChallenge";
import { sounds } from "../utils/sound";

const SUN_RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

export default function MenuScreen() {
  const {
    totalXp, bestScores, soundEnabled, powerups, dailyStreak,
    setScreen, toggleSound, resetAll, startQuiz, canPlayDaily,
  } = useGameStore();

  const rank = useMemo(() => getRank(totalXp), [totalXp]);
  const nextRank = useMemo(() => getNextRank(totalXp), [totalXp]);
  const xpProg = useMemo(() => getXpProgress(totalXp), [totalXp]);
  const dailyAvailable = canPlayDaily();

  const globalBest = useMemo(() => {
    const scores = Object.values(bestScores).map(Number);
    return scores.length ? Math.max(...scores) : 0;
  }, [bestScores]);

  const play = (fn) => {
    if (soundEnabled) sounds.click();
    fn();
  };

  const handleDaily = () => {
    if (soundEnabled) sounds.click();
    if (!dailyAvailable) return;
    const daily = getDailyChallenge();
    // Tag questions with timePerQ for the quiz screen to read
    const qs = daily.questions.map(q => ({ ...q, _timePerQ: daily.timePerQ }));
    startQuiz("daily", qs, true);
  };

  return (
    <>
      <div className="header-bar" style={{ padding: "26px 20px 20px" }}>
        <div className="menu-stars">
          <div className="menu-star" />
          <div className="menu-star" />
          <div className="menu-star" />
        </div>
        <div className="menu-title">Alam Mo Ba?!</div>
        <div className="menu-subtitle">PINOY TRIVIA QUEST</div>
      </div>

      <div className="scroll-area">
        <div className="menu-body">
          <div className="sun-badge">
            <div className="sun-ray-ring">
              {SUN_RAYS.map((deg) => (
                <div key={deg} className="sray" style={{ transform: `rotate(${deg}deg)` }} />
              ))}
            </div>
            <div className="sun-core">?!</div>
          </div>

          <div className="xp-card">
            <div className="xp-top">
              <div className="xp-rank">{rank.icon} {rank.name}</div>
              <div className="xp-pts">
                {nextRank ? `${totalXp} / ${nextRank.minXp} XP` : `${totalXp} XP — MAX!`}
              </div>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${xpProg.pct}%` }} />
            </div>
            <div className="xp-bar-label">{totalXp} XP total</div>
          </div>

          {/* Power-ups display */}
          <div className="powerups-display">
            <div className="pu-item"><span>½</span> {powerups.fiftyFifty}</div>
            <div className="pu-item"><span>⏭️</span> {powerups.skip}</div>
            <div className="pu-item"><span>⏱️</span> {powerups.extraTime}</div>
          </div>

          <div className="highscore-badge">
            Best: <span>{globalBest}</span> pts
          </div>

          <button className="btn-play" onClick={() => play(() => setScreen("map"))}>
            SIMULAN ANG QUEST!
          </button>

          {/* Daily Challenge */}
          <button
            className={`btn-daily ${!dailyAvailable ? "completed" : ""}`}
            onClick={handleDaily}
            disabled={!dailyAvailable}
          >
            {dailyAvailable
              ? `📅 DAILY CHALLENGE${dailyStreak > 0 ? ` (${dailyStreak}🔥 streak)` : ""}`
              : `✅ Daily Done! ${dailyStreak > 0 ? `(${dailyStreak}🔥 streak)` : "Come back tomorrow!"}`
            }
          </button>

          <div className="settings-row">
            <button
              className={`toggle-btn ${soundEnabled ? "active" : ""}`}
              onClick={() => toggleSound()}
            >
              Sound {soundEnabled ? "ON" : "OFF"}
            </button>
            <button className="toggle-btn" onClick={() => play(() => setScreen("leaderboard"))}>
              Leaderboard
            </button>
            <button className="toggle-btn" onClick={() => play(() => setScreen("achievements"))}>
              🏅 Badges
            </button>
          </div>

          <button
            className="btn-secondary"
            style={{ fontSize: 12, padding: 9 }}
            onClick={() => {
              if (soundEnabled) sounds.click();
              if (confirm("I-reset lahat ng progress, XP, at stars? Hindi na mababawi!")) {
                resetAll();
              }
            }}
          >
            Reset All Progress
          </button>
        </div>
      </div>

      <div className="menu-footer">
        Alam Mo Ba?! v3.0 — Mabuhay! 🇵🇭
        <br />
        <a href="privacy.html" target="_blank" rel="noreferrer">Privacy Policy</a>
      </div>
      <div className="ad-banner">[ Ad Space — Banner Ad ]</div>
    </>
  );
}
