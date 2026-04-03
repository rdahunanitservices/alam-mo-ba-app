import useGameStore from "../store/gameStore";
import { ACHIEVEMENTS } from "../data/achievements";
import { sounds } from "../utils/sound";

export default function AchievementsScreen() {
  const { unlockedAchievements, soundEnabled, setScreen } = useGameStore();
  const unlocked = unlockedAchievements || [];

  const totalUnlocked = unlocked.length;
  const total = ACHIEVEMENTS.length;
  const pct = Math.round((totalUnlocked / total) * 100);

  return (
    <>
      <div className="header-bar" style={{ padding: "16px 20px" }}>
        <div className="lb-title">🏅 Achievements</div>
        <div className="lb-subtitle">{totalUnlocked} / {total} unlocked ({pct}%)</div>
      </div>

      <div className="scroll-area">
        <div className="achievements-body">
          <div className="ach-progress-card">
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="xp-bar-label">{totalUnlocked} of {total} badges earned</div>
          </div>

          <div className="ach-grid">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlocked.includes(ach.id);
              return (
                <div key={ach.id} className={`ach-card ${isUnlocked ? "unlocked" : "locked"}`}>
                  <div className="ach-icon">{isUnlocked ? ach.icon : "🔒"}</div>
                  <div className="ach-info">
                    <div className="ach-name">{isUnlocked ? ach.name : "???"}</div>
                    <div className="ach-desc">{ach.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
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
    </>
  );
}
