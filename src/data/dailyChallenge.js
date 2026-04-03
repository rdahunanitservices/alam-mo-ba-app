// ============================================================
// DAILY CHALLENGE SYSTEM
// Uses the date as a seed to generate the same challenge for everyone each day
// ============================================================

import questions from "./questions";
import { TOPIC_NAMES } from "./levels";

const TOPICS = ["history", "food", "culture", "geo", "popculture", "sports", "science"];
const DIFFS = ["easy", "normal", "hard"];

// Simple seeded random number generator
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function seededShuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getDailyChallenge() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const seed = dateStr.split("").reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
  const rng = seededRandom(Math.abs(seed));

  // Pick topic and difficulty based on today's seed
  const topicIdx = Math.floor(rng() * TOPICS.length);
  const topic = TOPICS[topicIdx];
  const diffIdx = Math.floor(rng() * DIFFS.length);
  const diff = DIFFS[diffIdx];

  // Get questions from that topic/diff
  const pool = questions[topic]?.[diff] || questions[topic]?.easy || [];
  const qs = seededShuffle(pool, rng).slice(0, 10);

  const topicName = TOPIC_NAMES[topic] || topic;
  const timePerQ = { easy: 12, normal: 10, hard: 8 }[diff]; // Slightly harder than normal

  return {
    dateStr,
    topic,
    topicName,
    diff,
    timePerQ,
    questions: qs,
    title: `Daily Challenge — ${topicName}`,
    subtitle: `${diff.charAt(0).toUpperCase() + diff.slice(1)} • ${dateStr}`,
  };
}

export function getTodayDateStr() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}
