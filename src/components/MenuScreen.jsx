import { useMemo } from "react";
import useGameStore from "../store/gameStore";
import { getRank, getNextRank, getXpProgress } from "../data/ranks";
import { getDailyChallenge } from "../data/dailyChallenge";
import { signInWithGoogle, logOut } from "../firebase/service";
import { sounds } from "../utils/sound";

const SUN_RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

export default function MenuScreen() {
  const {
    totalXp, bestScores, soundEnabled, powerups, dailyStreak,
    setScreen, toggleSound, resetAll, startQuiz, canPlayDaily,
    user, isOnline, isSyncing,
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
    const qs = daily.questions.map(q => ({ ...q, _timePerQ: daily.timePerQ }));
    startQuiz("daily", qs, true);
  };

  const handleSignIn = async () => {
    if (soundEnabled) sounds.click();
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error("Sign in failed:", e);
    }
  };

  const handleSignOut = async () => {
    if (soundEnabled) sounds.click();
    if (confirm("Sign out? Your local progress will be kept.")) {
      await logOut();
    }
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
          {/* User / Sign In */}
          {isOnline && user ? (
            <div className="user-card">
              {user.photoURL && <img src={user.photoURL} alt="" className="user-avatar" referrerPolicy="no-referrer" />}
              <div className="user-info">
                <div className="user-name">{user.displayName || "Player"}</div>
                <div className="user-status">
                  {isSyncing ? "☁️ Syncing..." : "✅ Online — Progress saved"}
                </div>
              </div>
              <button className="sign-out-btn" onClick={handleSignOut}>↪</button>
            </div>
          ) : (
            <button className="btn-google" onClick={handleSignIn}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>
          )}

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
              🏆 Ranking
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
