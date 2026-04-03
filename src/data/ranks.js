// ============================================================
// RANKS & XP SYSTEM
// ============================================================

export const RANKS = [
  { name: "Magsasaka", minXp: 0, icon: "🌾" },
  { name: "Estudyante", minXp: 200, icon: "📚" },
  { name: "Manlilikha", minXp: 500, icon: "🎨" },
  { name: "Bayani", minXp: 1000, icon: "⚔️" },
  { name: "Guro", minXp: 1800, icon: "🧑‍🏫" },
  { name: "Heneral", minXp: 3000, icon: "🎖️" },
  { name: "Pilipino", minXp: 5000, icon: "🇵🇭" },
  { name: "Hari ng Trivia", minXp: 8000, icon: "👑" },
];

export function getRank(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.minXp) rank = r;
    else break;
  }
  return rank;
}

export function getNextRank(xp) {
  for (let i = 0; i < RANKS.length - 1; i++) {
    if (xp < RANKS[i + 1].minXp) return RANKS[i + 1];
  }
  return null;
}

export function getXpProgress(xp) {
  const rank = getRank(xp);
  const next = getNextRank(xp);
  if (!next) return { pct: 100, label: "MAX RANK!" };
  const range = next.minXp - rank.minXp;
  const prog = xp - rank.minXp;
  return { pct: Math.round((prog / range) * 100), label: `${prog}/${range} XP` };
}

export const DEFAULT_LEADERBOARD = [
  { name: "Bayaning Rizal", xp: 7200, rank: "Heneral", date: "Mar 2026" },
  { name: "Ate Ninang", xp: 4100, rank: "Pilipino", date: "Mar 2026" },
  { name: "Kuya Nando", xp: 2300, rank: "Guro", date: "Mar 2026" },
  { name: "Lola Nena", xp: 1500, rank: "Bayani", date: "Feb 2026" },
  { name: "Dodong Trivia", xp: 900, rank: "Manlilikha", date: "Feb 2026" },
];
