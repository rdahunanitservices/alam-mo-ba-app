// ============================================================
// ACHIEVEMENTS SYSTEM
// ============================================================

export const ACHIEVEMENTS = [
  // Progress achievements
  { id: "first_win", name: "Unang Tagumpay", desc: "Complete your first level", icon: "🎯", condition: (s) => Object.values(s.levelProgress).some(l => l.stars > 0) },
  { id: "five_levels", name: "Limang Beses", desc: "Complete 5 levels", icon: "⭐", condition: (s) => Object.values(s.levelProgress).filter(l => l.stars > 0).length >= 5 },
  { id: "ten_levels", name: "Sampung Tagumpay", desc: "Complete 10 levels", icon: "🌟", condition: (s) => Object.values(s.levelProgress).filter(l => l.stars > 0).length >= 10 },
  { id: "twenty_levels", name: "Dalawampung Tagumpay", desc: "Complete 20 levels", icon: "🌠", condition: (s) => Object.values(s.levelProgress).filter(l => l.stars > 0).length >= 20 },
  { id: "all_levels", name: "Mapa Master", desc: "Complete all 30 levels", icon: "🗺️", condition: (s) => Object.values(s.levelProgress).filter(l => l.stars > 0).length >= 30 },

  // Star achievements
  { id: "first_3star", name: "Perpekto!", desc: "Get 3 stars on any level", icon: "💫", condition: (s) => Object.values(s.levelProgress).some(l => l.stars >= 3) },
  { id: "ten_3star", name: "Star Collector", desc: "Get 3 stars on 10 levels", icon: "🏅", condition: (s) => Object.values(s.levelProgress).filter(l => l.stars >= 3).length >= 10 },
  { id: "all_3star", name: "Henyo ng Henyo", desc: "Get 3 stars on ALL 30 levels", icon: "👑", condition: (s) => Object.values(s.levelProgress).filter(l => l.stars >= 3).length >= 30 },

  // Score achievements
  { id: "score_100", name: "Centurion", desc: "Score 100+ points in one game", icon: "💯", condition: (s) => Object.values(s.bestScores).some(sc => sc >= 100) },
  { id: "score_150", name: "High Roller", desc: "Score 150+ points in one game", icon: "🎰", condition: (s) => Object.values(s.bestScores).some(sc => sc >= 150) },

  // XP achievements
  { id: "xp_500", name: "Manlilikha", desc: "Earn 500 total XP", icon: "🎨", condition: (s) => s.totalXp >= 500 },
  { id: "xp_2000", name: "Bayani", desc: "Earn 2,000 total XP", icon: "⚔️", condition: (s) => s.totalXp >= 2000 },
  { id: "xp_5000", name: "Pilipino", desc: "Earn 5,000 total XP", icon: "🇵🇭", condition: (s) => s.totalXp >= 5000 },

  // Streak achievements
  { id: "streak_5", name: "On Fire!", desc: "Get a 5-question streak", icon: "🔥", condition: (s) => (s.bestStreak || 0) >= 5 },
  { id: "streak_10", name: "Unstoppable", desc: "Get a 10-question streak", icon: "⚡", condition: (s) => (s.bestStreak || 0) >= 10 },

  // Daily challenge achievements
  { id: "daily_1", name: "Araw-Araw", desc: "Complete your first daily challenge", icon: "📅", condition: (s) => (s.dailyCompleted || 0) >= 1 },
  { id: "daily_7", name: "Linggo-Linggo", desc: "Complete 7 daily challenges", icon: "🗓️", condition: (s) => (s.dailyCompleted || 0) >= 7 },
  { id: "daily_30", name: "Buwan-Buwan", desc: "Complete 30 daily challenges", icon: "🏆", condition: (s) => (s.dailyCompleted || 0) >= 30 },

  // Region achievements
  { id: "luzon_done", name: "Luzon Explorer", desc: "Complete all Luzon levels", icon: "🌿", condition: (s) => [1,2,3,4,5,6,7,8].every(id => s.levelProgress[id]?.stars > 0) },
  { id: "visayas_done", name: "Visayas Voyager", desc: "Complete all Visayas levels", icon: "🌊", condition: (s) => [9,10,11,12,13,14,15].every(id => s.levelProgress[id]?.stars > 0) },
  { id: "mindanao_done", name: "Mindanao Warrior", desc: "Complete all Mindanao levels", icon: "🔥", condition: (s) => [16,17,18,19,20].every(id => s.levelProgress[id]?.stars > 0) },
  { id: "bonus_done", name: "Island Hopper", desc: "Complete all Bonus Islands", icon: "🏝️", condition: (s) => [21,22,23,24,25,26,27,28,29,30].every(id => s.levelProgress[id]?.stars > 0) },

  // Topic achievements
  { id: "sports_fan", name: "Sports Fan", desc: "Complete all Sports levels", icon: "🏀", condition: (s) => [6,11,17,21,23,25,27,29].every(id => s.levelProgress[id]?.stars > 0) },
  { id: "scientist", name: "Scientist", desc: "Complete all Science levels", icon: "🔬", condition: (s) => [7,12,19,22,24,26,28,30].every(id => s.levelProgress[id]?.stars > 0) },
];

export function checkAchievements(state) {
  const unlocked = state.unlockedAchievements || [];
  const newlyUnlocked = [];
  
  for (const ach of ACHIEVEMENTS) {
    if (!unlocked.includes(ach.id) && ach.condition(state)) {
      newlyUnlocked.push(ach);
    }
  }
  
  return newlyUnlocked;
}
