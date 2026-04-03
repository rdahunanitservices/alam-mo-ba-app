// ============================================================
// LEVEL MAP — Each level is a location on the Philippine map
// Edit this to add new levels, change topics, or adjust difficulty
// ============================================================

const levels = [
  { id: 1, name: "Batanes", region: "luzon", topic: "history", diff: "easy", icon: "📜", x: 52, y: 3 },
  { id: 2, name: "Ilocos Norte", region: "luzon", topic: "food", diff: "easy", icon: "🍛", x: 30, y: 8 },
  { id: 3, name: "Cagayan Valley", region: "luzon", topic: "culture", diff: "easy", icon: "🎭", x: 65, y: 12 },
  { id: 4, name: "Cordillera", region: "luzon", topic: "geo", diff: "easy", icon: "⛰️", x: 42, y: 17 },
  { id: 5, name: "Pampanga", region: "luzon", topic: "popculture", diff: "easy", icon: "🎬", x: 55, y: 22 },
  { id: 6, name: "Metro Manila", region: "luzon", topic: "history", diff: "easy", icon: "🏙️", x: 57, y: 27 },
  { id: 7, name: "Cavite", region: "luzon", topic: "food", diff: "easy", icon: "🍲", x: 48, y: 31 },
  { id: 8, name: "Quezon", region: "luzon", topic: "culture", diff: "normal", icon: "🌺", x: 65, y: 36 },
  { id: 9, name: "Palawan", region: "visayas", topic: "geo", diff: "normal", icon: "🏝️", x: 28, y: 44 },
  { id: 10, name: "Cebu", region: "visayas", topic: "popculture", diff: "normal", icon: "🎪", x: 64, y: 48 },
  { id: 11, name: "Bohol", region: "visayas", topic: "history", diff: "normal", icon: "🦎", x: 70, y: 53 },
  { id: 12, name: "Leyte", region: "visayas", topic: "food", diff: "normal", icon: "🌴", x: 76, y: 57 },
  { id: 13, name: "Iloilo", region: "visayas", topic: "culture", diff: "normal", icon: "🎭", x: 46, y: 61 },
  { id: 14, name: "Negros", region: "visayas", topic: "geo", diff: "hard", icon: "🏔️", x: 56, y: 66 },
  { id: 15, name: "Zamboanga", region: "mindanao", topic: "popculture", diff: "hard", icon: "🎨", x: 32, y: 73 },
  { id: 16, name: "Misamis", region: "mindanao", topic: "history", diff: "hard", icon: "📜", x: 64, y: 76 },
  { id: 17, name: "Bukidnon", region: "mindanao", topic: "food", diff: "hard", icon: "🍽️", x: 56, y: 81 },
  { id: 18, name: "Davao", region: "mindanao", topic: "culture", diff: "hard", icon: "🦅", x: 70, y: 85 },
  { id: 19, name: "South Cotabato", region: "mindanao", topic: "geo", diff: "hard", icon: "🌋", x: 50, y: 90 },
  { id: 20, name: "Tawi-Tawi", region: "mindanao", topic: "popculture", diff: "hard", icon: "👑", x: 38, y: 95 },
];

export const TOPIC_NAMES = {
  history: "Philippine History",
  food: "Filipino Food",
  culture: "Philippine Culture",
  geo: "Philippine Geography",
  popculture: "Pinoy Pop Culture",
};

export const DIFF_CONFIG = {
  easy: { time: 15, label: "Easy — 15s per question", xpBase: 15, bonus: 0 },
  normal: { time: 12, label: "Normal — 12s per question", xpBase: 25, bonus: 5 },
  hard: { time: 10, label: "Hard — 10s per question", xpBase: 40, bonus: 12 },
};

export const REGION_BANNERS = [
  { label: "🌿 LUZON — Easy", y: 5 },
  { label: "🌊 VISAYAS — Normal", y: 43 },
  { label: "🔥 MINDANAO — Hard", y: 72 },
];

export default levels;
