import { useState, useEffect, useMemo } from "react";
import useGameStore from "../store/gameStore";
import levels, { TOPIC_NAMES } from "../data/levels";
import questionsData from "../data/questions";
import { getRank } from "../data/ranks";
import { sounds } from "../utils/sound";
import { shareScore, shuffle } from "../utils/helpers";

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

export default function ResultsScreen() {
  const store = useGameStore();
  const { currentLevelId, quizScore, quizCorrect, quizMaxStreak, quizQuestions, totalXp, soundEnabled, setScreen, startQuiz } = store;

  const [resultData, setResultData] = useState(null);
  const [unlockLevel, setUnlockLevel] = useState(null);

  const lv = levels.find((l) => l.id === currentLevelId);
  const rank = useMemo(() => getRank(totalXp), [totalXp]);

  // endQuiz returns result data, but we need to capture it
  // Since endQuiz was already called when transitioning to results, we compute display data from state
  const pct = quizQuestions.length ? Math.round((quizCorrect / quizQuestions.length) * 100) : 0;
  const stars = quizCorrect >= 9 ? 3 : quizCorrect >= 6 ? 2 : quizCorrect >= 4 ? 1 : 0;

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
    const bank = questionsData[lv.topic];
    let pool = [];
    if (lv.diff === "easy") pool = [...(bank.easy || [])];
    else if (lv.diff === "normal") pool = [...(bank.normal || []), ...(bank.easy || []).slice(0, 3)];
    else pool = [...(bank.hard || []), ...(bank.normal || []).slice(0, 3)];
    const qs = shuffle(pool).slice(0, 10);
    startQuiz(lv.id, qs);
  };

  const handleShare = () => {
    if (soundEnabled) sounds.click();
    shareScore(lv?.id, lv?.name, quizScore, rank, totalXp);
  };

  if (!lv) return null;

  return (
    <>
      <div className="header-bar results-header">
        <div className="results-title">{title}</div>
        <div className="results-sub">{lv.icon} Lvl {lv.id}: {lv.name}</div>
      </div>

      <div className="scroll-area">
        <div className="results-body">
          <div className="score-circle">
            <div className="score-num">{quizScore}</div>
            <div className="score-label">POINTS</div>
          </div>

          <div className="xp-gain">+XP earned!</div>

          <div className="result-stars">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rstar ${i < stars ? "earned" : "empty"}`} />
            ))}
          </div>

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

          <div className="result-msg">{msg}</div>
          <div className="result-submsg">{sub}</div>

          <div className="result-actions">
            <button className="btn-play" onClick={handleReplay}>Laro Ulit!</button>
            <button className="btn-secondary" onClick={() => { if (soundEnabled) sounds.click(); setScreen("map"); }}>
              Back to Map
            </button>
            <button className="btn-secondary" onClick={handleShare}>
              I-share ang Score
            </button>
            <button className="btn-secondary" onClick={() => { if (soundEnabled) sounds.click(); setScreen("menu"); }}>
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
    </>
  );
}
