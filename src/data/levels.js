// ============================================================
// LEVEL MAP — Each level is a location on the Philippine map
// 20 main levels + 10 bonus levels with Sports & Science
// ============================================================

const levels = [
  // LUZON — Easy
  { id: 1, name: "Batanes", region: "luzon", topic: "history", diff: "easy", icon: "📜", x: 52, y: 2 },
  { id: 2, name: "Ilocos Norte", region: "luzon", topic: "food", diff: "easy", icon: "🍛", x: 30, y: 6 },
  { id: 3, name: "Cagayan Valley", region: "luzon", topic: "culture", diff: "easy", icon: "🎭", x: 65, y: 9 },
  { id: 4, name: "Cordillera", region: "luzon", topic: "geo", diff: "easy", icon: "⛰️", x: 42, y: 13 },
  { id: 5, name: "Pampanga", region: "luzon", topic: "popculture", diff: "easy", icon: "🎬", x: 55, y: 16 },
  { id: 6, name: "Metro Manila", region: "luzon", topic: "sports", diff: "easy", icon: "🏀", x: 57, y: 20 },
  { id: 7, name: "Cavite", region: "luzon", topic: "science", diff: "easy", icon: "🔬", x: 42, y: 23 },
  { id: 8, name: "Laguna", region: "luzon", topic: "history", diff: "easy", icon: "📜", x: 62, y: 26 },

  // VISAYAS — Normal
  { id: 9, name: "Quezon", region: "visayas", topic: "culture", diff: "normal", icon: "🌺", x: 68, y: 32 },
  { id: 10, name: "Palawan", region: "visayas", topic: "geo", diff: "normal", icon: "🏝️", x: 28, y: 36 },
  { id: 11, name: "Cebu", region: "visayas", topic: "sports", diff: "normal", icon: "🏊", x: 64, y: 39 },
  { id: 12, name: "Bohol", region: "visayas", topic: "science", diff: "normal", icon: "🧬", x: 72, y: 43 },
  { id: 13, name: "Leyte", region: "visayas", topic: "food", diff: "normal", icon: "🌴", x: 76, y: 46 },
  { id: 14, name: "Iloilo", region: "visayas", topic: "popculture", diff: "normal", icon: "🎭", x: 46, y: 49 },
  { id: 15, name: "Negros", region: "visayas", topic: "history", diff: "normal", icon: "📜", x: 56, y: 53 },

  // MINDANAO — Hard
  { id: 16, name: "Zamboanga", region: "mindanao", topic: "culture", diff: "hard", icon: "🎨", x: 32, y: 60 },
  { id: 17, name: "Misamis", region: "mindanao", topic: "sports", diff: "hard", icon: "🥊", x: 64, y: 63 },
  { id: 18, name: "Bukidnon", region: "mindanao", topic: "food", diff: "hard", icon: "🍽️", x: 56, y: 67 },
  { id: 19, name: "Davao", region: "mindanao", topic: "science", diff: "hard", icon: "🌋", x: 70, y: 70 },
  { id: 20, name: "South Cotabato", region: "mindanao", topic: "geo", diff: "hard", icon: "🏔️", x: 50, y: 74 },

  // BONUS ISLANDS — Mixed difficulty
  { id: 21, name: "Siargao", region: "bonus", topic: "sports", diff: "easy", icon: "🏄", x: 80, y: 80 },
  { id: 22, name: "Camiguin", region: "bonus", topic: "science", diff: "easy", icon: "🔭", x: 68, y: 83 },
  { id: 23, name: "Siquijor", region: "bonus", topic: "sports", diff: "normal", icon: "🏐", x: 56, y: 86 },
  { id: 24, name: "Marinduque", region: "bonus", topic: "science", diff: "normal", icon: "🧪", x: 42, y: 83 },
  { id: 25, name: "Romblon", region: "bonus", topic: "sports", diff: "normal", icon: "🎯", x: 30, y: 86 },
  { id: 26, name: "Catanduanes", region: "bonus", topic: "science", diff: "hard", icon: "⚗️", x: 76, y: 89 },
  { id: 27, name: "Basilan", region: "bonus", topic: "sports", diff: "hard", icon: "🏆", x: 38, y: 92 },
  { id: 28, name: "Tawi-Tawi", region: "bonus", topic: "science", diff: "hard", icon: "🧠", x: 28, y: 95 },
  { id: 29, name: "Samal Island", region: "bonus", topic: "sports", diff: "hard", icon: "🥇", x: 64, y: 92 },
  { id: 30, name: "Turtle Islands", region: "bonus", topic: "science", diff: "hard", icon: "🐢", x: 50, y: 97 },
];

export const TOPIC_NAMES = {
  history: "Philippine History",
  food: "Filipino Food",
  culture: "Philippine Culture",
  geo: "Philippine Geography",
  popculture: "Pinoy Pop Culture",
  sports: "Pinoy Sports",
  science: "Science & Nature PH",
};

export const DIFF_CONFIG = {
  easy: { time: 15, label: "Easy — 15s per question", xpBase: 15, bonus: 0 },
  normal: { time: 12, label: "Normal — 12s per question", xpBase: 25, bonus: 5 },
  hard: { time: 10, label: "Hard — 10s per question", xpBase: 40, bonus: 12 },
};

export const REGION_BANNERS = [
  { label: "🌿 LUZON — Easy", y: 3 },
  { label: "🌊 VISAYAS — Normal", y: 31 },
  { label: "🔥 MINDANAO — Hard", y: 58 },
  { label: "🏝️ BONUS ISLANDS", y: 79 },
];

export default levels;
