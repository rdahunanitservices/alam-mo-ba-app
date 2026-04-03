import { useState, useEffect, useRef, useMemo } from "react";
import useGameStore from "../store/gameStore";
import { getRank } from "../data/ranks";
import levels, { REGION_BANNERS, TOPIC_NAMES, DIFF_CONFIG } from "../data/levels";
import questions from "../data/questions";
import { shuffle } from "../utils/helpers";
import { sounds } from "../utils/sound";

function LevelPopup({ level, isLocked, stars, bestScore, onPlay, onClose }) {
  const topicName = TOPIC_NAMES[level.topic] || level.topic;
  const diffInfo = DIFF_CONFIG[level.diff]?.label || "";

  return (
    <div className="level-popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="level-popup">
        <div className="popup-handle" />
        <div className={`popup-region ${level.region}`}>
          {level.region.toUpperCase()} — Level {level.id}
        </div>
        <div className="popup-title">{level.icon} {level.name}</div>
        <div className="popup-topic">{topicName}</div>
        <div className={`popup-diff ${level.diff}`}>{diffInfo}</div>
        <div className="popup-stars-row">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`pstar ${i < stars ? "earned" : "empty"}`} />
          ))}
        </div>
        {bestScore > 0 && (
          <div className="popup-best">Best: <strong>{bestScore} pts</strong></div>
        )}
        {isLocked ? (
          <div className="popup-locked-msg">🔒 Complete Level {level.id - 1} first!</div>
        ) : (
          <div className="popup-actions">
            <button className="btn-play" onClick={onPlay}>PLAY!</button>
            <button className="popup-close" onClick={onClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapScreen() {
  const { totalXp, levelProgress, soundEnabled, setScreen, startQuiz, getUnlockedUpTo } = useGameStore();
  const [popup, setPopup] = useState(null);
  const scrollRef = useRef(null);

  const rank = useMemo(() => getRank(totalXp), [totalXp]);
  const unlockedUpTo = getUnlockedUpTo();
  const done = Object.values(levelProgress).filter((l) => l.stars > 0).length;

  useEffect(() => {
    setTimeout(() => {
      if (!scrollRef.current) return;
      const cur = levels.find((l) => l.id === Math.min(unlockedUpTo, levels.length));
      if (cur) {
        const h = scrollRef.current.firstChild?.offsetHeight || 1500;
        scrollRef.current.scrollTo({ top: Math.max(0, (cur.y / 100) * h - 200), behavior: "smooth" });
      }
    }, 300);
  }, [unlockedUpTo]);

  const handleNodeClick = (lv) => {
    if (soundEnabled) sounds.click();
    const lp = levelProgress[lv.id];
    const isLocked = lv.id > unlockedUpTo;
    setPopup({ level: lv, isLocked, stars: lp?.stars || 0, bestScore: lp?.score || 0 });
  };

  const handlePlay = () => {
    if (!popup) return;
    const lv = popup.level;
    setPopup(null);

    const bank = questions[lv.topic];
    if (!bank) return;
    let pool = [];
    if (lv.diff === "easy") pool = [...(bank.easy || [])];
    else if (lv.diff === "normal") pool = [...(bank.normal || []), ...(bank.easy || []).slice(0, 3)];
    else pool = [...(bank.hard || []), ...(bank.normal || []).slice(0, 3)];

    const qs = shuffle(pool).slice(0, 10);
    if (!qs.length) return alert("No questions available!");
    startQuiz(lv.id, qs);
  };

  return (
    <>
      <div className="header-bar map-header">
        <div>
          <div className="map-title">Philippines Quest</div>
          <div className="map-subtitle">{done} / 20 levels done</div>
        </div>
        <div className="map-xp-pill">
          <div className="rank-label">{rank.icon} {rank.name}</div>
          <div className="xp-label">{totalXp} XP</div>
        </div>
      </div>

      <div className="map-container">
        <div className="map-scroll" ref={scrollRef}>
          <div style={{ position: "relative", width: "100%", minHeight: 1500 }}>
            {/* Region banners */}
            {REGION_BANNERS.map((b) => (
              <div key={b.label} className="region-banner" style={{ top: `${b.y}%` }}>
                {b.label}
              </div>
            ))}

            {/* Path lines */}
            {levels.slice(0, -1).map((a, i) => {
              const b = levels[i + 1];
              const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
              const dx = b.x - a.x, dy = b.y - a.y;
              const len = Math.sqrt(dx * dx + dy * dy);
              const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
              const lp = levelProgress[a.id];
              return (
                <div
                  key={`path-${a.id}`}
                  className="node-path"
                  style={{
                    left: `${cx}%`, top: `${cy}%`,
                    width: `${len}%`, height: 5,
                    transform: `translate(-50%,-50%) rotate(${angle}deg)`,
                    opacity: lp?.stars > 0 ? 0.65 : 0.2,
                  }}
                />
              );
            })}

            {/* Level nodes */}
            {levels.map((lv) => {
              const lp = levelProgress[lv.id];
              const stars = lp?.stars || 0;
              const isCompleted = stars > 0;
              const isCurrent = lv.id === unlockedUpTo;
              const isLocked = lv.id > unlockedUpTo;

              let cls = "level-node ";
              if (isLocked) cls += "locked";
              else if (isCurrent) cls += "current";
              else if (isCompleted) cls += `completed-${Math.min(stars, 3)}`;
              else cls += "unlocked";

              return (
                <div
                  key={lv.id}
                  className={cls}
                  style={{ left: `${lv.x}%`, top: `${lv.y}%` }}
                  onClick={() => handleNodeClick(lv)}
                >
                  {isLocked ? (
                    <span style={{ fontSize: 20, opacity: 0.45 }}>🔒</span>
                  ) : (
                    <>
                      <div className="node-num">{lv.id}</div>
                      <div className="node-stars">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className={`nstar ${i < stars ? "on" : "off"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 14px", flexShrink: 0, background: "var(--white)", borderTop: "1px solid #f0ebe0" }}>
        <button
          className="btn-secondary"
          style={{ padding: 10, fontSize: 13 }}
          onClick={() => { if (soundEnabled) sounds.click(); setScreen("menu"); }}
        >
          ← Main Menu
        </button>
      </div>

      {popup && (
        <LevelPopup
          level={popup.level}
          isLocked={popup.isLocked}
          stars={popup.stars}
          bestScore={popup.bestScore}
          onPlay={handlePlay}
          onClose={() => setPopup(null)}
        />
      )}
    </>
  );
}
