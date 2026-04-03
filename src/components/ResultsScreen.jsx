import { useState, useMemo, useEffect } from "react";
import useGameStore from "../store/gameStore";
import levels, { TOPIC_NAMES } from "../data/levels";
import questionsData from "../data/questions";
import { getRank } from "../data/ranks";
import { sounds } from "../utils/sound";
import { shuffle } from "../utils/helpers";
import { generateShareData, shareResults } from "../firebase/service";

function UnlockOverlay({ level, onClose }) {
  const topicName = TOPIC_NAMES[level.topic] || level.topic;
  return (
    <div className="unlock-overlay">
      <div className="unlock-card">
        <span className="unlock-emoji">{level.icon}</span>
        <div className="unlock-title">Level Unlocked!</div>
        <div className="unlock-sub">
          <strong>Level {level.id}: {level.name}</strong><br />
          {level.region.charAt(0).toUpperCase() + level.region.slice(1)} Region<br />
          Topic: {topicName}
        </div>
        <button className="btn-play" onClick={onClose}>Awesome!</button>
      </div>
    </div>
  );
}

function AchievementToast({ achievements, onDismiss }) {
  if (!achievements || achievements.length === 0) return null;
  return (
    <div className="achievement-toast-overlay" onClick={onDismiss}>
      <div className="achievement-toast" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🏅</div>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: "var(--gold)", marginBottom: 8 }}>
          Achievement Unlocked!
        </div>
        {achievements.map((ach) => (
          <div key={ach.id} className="ach-toast-item">
            <span className="ach-toast-icon">{ach.icon}</span>
            <div>
              <div className="ach-toast-name">{ach.name}</div>
              <div className="ach-toast-desc">{ach.desc}</div>
            </div>
          </div>
        ))}
        <button className="btn-play" style={{ marginTop: 14, fontSize: 16, padding: 10, maxWidth: 180 }} onClick={onDismiss}>
          Nice!
        </button>
      </div>
    </div>
  );
}

export default function ResultsScreen() {
  const store = useGameStore();
  const {
    currentLevelId, quizScore, quizCorrect, quizMaxStreak, quizQuestions,
    totalXp, soundEnabled, setScreen, startQuiz, isDaily, newAchievements,
    clearNewAchievements, powerups, quizPowerupsUsed,
  } = store;

  const [showAchToast, setShowAchToast] = useState(false);
  const [unlockLevel, setUnlockLevel] = useState(null);

  const lv = !isDaily ? levels.find((l) => l.id === currentLevelId) : null;
  const rank = useMemo(() => getRank(totalXp), [totalXp]);

  const pct = quizQuestions.length ? Math.round((quizCorrect / quizQuestions.length) * 100) : 0;
  const stars = quizCorrect >= 9 ? 3 : quizCorrect >= 6 ? 2 : quizCorrect >= 4 ? 1 : 0;

  // Show achievement toast
  useEffect(() => {
    if (newAchievements && newAchievements.length > 0) {
      setTimeout(() => {
        if (soundEnabled) sounds.achievement();
        setShowAchToast(true);
      }, 800);
    }
  }, [newAchievements, soundEnabled]);

  const msgs = [
    ["PERFECT! Henyo ka talaga!", "Zero mistakes — pinakamataas ang antas!"],
    ["Magaling! Tunay kang Pinoy!", "Konti na lang at perfect. Kaya mo!"],
    ["Okay naman! Konting aral pa!", "Practice lang. Mas mataas sa susunod!"],
    ["Kaya mo pa! Ulitin!", "Warm-up lang ito. Bumawi ka na!"],
    ["Ay sus! Aral muna tayo!", "Every round is a chance to learn!"],
  ];
  const [msg, sub] = pct === 100 ? msgs[0] : pct >= 80 ? msgs[1] : pct >= 60 ? msgs[2] : pct >= 40 ? msgs[3] : msgs[4];
  const title = pct === 100 ? "PERFECT!" : pct >= 80 ? "Magaling!" : "Game Over!";

  const handleReplay = () => {
    if (soundEnabled) sounds.click();
    clearNewAchievements();
    if (isDaily) return; // Can't replay daily
    const bank = questionsData[lv.topic];
    const pool = [...(bank[lv.diff] || [])];
    const qs = shuffle(pool).slice(0, 10);
    startQuiz(lv.id, qs);
  };

  const handleShare = () => {
    if (soundEnabled) sounds.click();
    const label = isDaily ? "Daily Challenge" : `Level ${lv?.id} (${lv?.name})`;
    const shareData = generateShareData(quizScore, label, rank, totalXp, isDaily);
    shareResults(shareData);
  };

  const handleNav = (screen) => {
    if (soundEnabled) sounds.click();
    clearNewAchievements();
    setScreen(screen);
  };

  const puUsed = quizPowerupsUsed || {};
  const totalPuUsed = (puUsed.fiftyFifty || 0) + (puUsed.skip || 0) + (puUsed.extraTime || 0);

  return (
    <>
      <div className="header-bar results-header">
        <div className="results-title">{isDaily ? "Daily Results!" : title}</div>
        <div className="results-sub">
          {isDaily ? "📅 Daily Challenge" : `${lv?.icon} Lvl ${lv?.id}: ${lv?.name}`}
        </div>
      </div>

      <div className="scroll-area">
        <div className="results-body">
          <div className="score-circle">
            <div className="score-num">{quizScore}</div>
            <div className="score-label">POINTS</div>
          </div>

          <div className="xp-gain">+XP earned! {isDaily ? "(1.5x daily bonus!)" : ""}</div>

          <div className="result-stars">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rstar ${i < stars ? "earned" : "empty"}`} />
            ))}
          </div>

          {/* Power-ups earned */}
          {stars >= 2 && (
            <div className="powerup-earned-badge">
              🎁 Earned power-up{stars >= 3 ? "s" : ""}!
              {stars >= 3
                ? " (+1 each: ½, ⏭️, ⏱️)"
                : " (+1 random)"
              }
            </div>
          )}

          <div className="result-stats">
            <div className="stat-item">
              <div className="stat-val">{quizCorrect}/{quizQuestions.length}</div>
              <div className="stat-lbl">TAMA</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">{pct}%</div>
              <div className="stat-lbl">ACCURACY</div>
            </div>
            <div className="stat-item">
              <div className="stat-val">{quizMaxStreak}🔥</div>
              <div className="stat-lbl">MAX STREAK</div>
            </div>
          </div>

          {totalPuUsed > 0 && (
            <div style={{ fontSize: 11, color: "var(--text-light)", textAlign: "center" }}>
              Power-ups used: {puUsed.fiftyFifty > 0 ? `½×${puUsed.fiftyFifty} ` : ""}
              {puUsed.skip > 0 ? `⏭️×${puUsed.skip} ` : ""}
              {puUsed.extraTime > 0 ? `⏱️×${puUsed.extraTime}` : ""}
            </div>
          )}

          <div className="result-msg">{msg}</div>
          <div className="result-submsg">{sub}</div>

          <div className="result-actions">
            {!isDaily && (
              <button className="btn-play" onClick={handleReplay}>Laro Ulit!</button>
            )}
            {!isDaily && (
              <button className="btn-secondary" onClick={() => handleNav("map")}>
                Back to Map
              </button>
            )}
            <button className="btn-secondary" onClick={handleShare}>
              I-share ang Score
            </button>
            <button className="btn-secondary" onClick={() => handleNav("menu")}>
              Main Menu
            </button>
          </div>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 11, padding: "5px 0", color: "var(--text-light)" }}>
        <a href="privacy.html" target="_blank" rel="noreferrer" style={{ color: "var(--text-light)" }}>Privacy Policy</a>
      </p>
      <div className="ad-banner">[ Ad Space — Interstitial Ad ]</div>

      {unlockLevel && <UnlockOverlay level={unlockLevel} onClose={() => setUnlockLevel(null)} />}

      {showAchToast && (
        <AchievementToast
          achievements={newAchievements}
          onDismiss={() => { setShowAchToast(false); clearNewAchievements(); }}
        />
      )}
    </>
  );
}
