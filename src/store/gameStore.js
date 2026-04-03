import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRank, getNextRank, DEFAULT_LEADERBOARD } from "../data/ranks";
import levels from "../data/levels";

const useGameStore = create(
  persist(
    (set, get) => ({
      // === State ===
      screen: "menu",
      totalXp: 0,
      levelProgress: {}, // { [levelId]: { stars, score, completed } }
      bestScores: {},
      leaderboard: [...DEFAULT_LEADERBOARD],
      soundEnabled: true,

      // === Quiz state (not persisted) ===
      currentLevelId: null,
      quizQuestions: [],
      quizIndex: 0,
      quizScore: 0,
      quizCorrect: 0,
      quizStreak: 0,
      quizMaxStreak: 0,
      quizAnswered: false,
      selectedAnswer: null,

      // === Actions ===
      setScreen: (screen) => set({ screen }),

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      getUnlockedUpTo: () => {
        const { levelProgress } = get();
        for (let i = 0; i < levels.length; i++) {
          const lp = levelProgress[levels[i].id];
          if (!lp || !lp.stars) return levels[i].id;
        }
        return levels[levels.length - 1].id + 1;
      },

      startQuiz: (levelId, questions) => set({
        screen: "quiz",
        currentLevelId: levelId,
        quizQuestions: questions,
        quizIndex: 0,
        quizScore: 0,
        quizCorrect: 0,
        quizStreak: 0,
        quizMaxStreak: 0,
        quizAnswered: false,
        selectedAnswer: null,
      }),

      answerQuestion: (idx, points, isCorrect) => set((s) => {
        const newStreak = isCorrect ? s.quizStreak + 1 : 0;
        return {
          quizScore: s.quizScore + points,
          quizCorrect: s.quizCorrect + (isCorrect ? 1 : 0),
          quizStreak: newStreak,
          quizMaxStreak: Math.max(s.quizMaxStreak, newStreak),
          quizAnswered: true,
          selectedAnswer: idx,
        };
      }),

      nextQuestion: () => set((s) => ({
        quizIndex: s.quizIndex + 1,
        quizAnswered: false,
        selectedAnswer: null,
      })),

      endQuiz: () => {
        const s = get();
        const lv = levels.find((l) => l.id === s.currentLevelId);
        if (!lv) return {};

        const pct = Math.round((s.quizCorrect / s.quizQuestions.length) * 100);
        const stars = s.quizCorrect >= 9 ? 3 : s.quizCorrect >= 6 ? 2 : s.quizCorrect >= 4 ? 1 : 0;

        const xpBase = { easy: 15, normal: 25, hard: 40 }[lv.diff] || 15;
        const xpBonus = s.quizMaxStreak >= 5 ? 20 : s.quizMaxStreak >= 3 ? 10 : 0;
        const xpGained = Math.round(xpBase * s.quizCorrect + xpBonus);

        const prevRank = getRank(s.totalXp);
        const newTotalXp = s.totalXp + xpGained;
        const newRank = getRank(newTotalXp);
        const rankedUp = newRank.name !== prevRank.name;

        const prev = s.levelProgress[lv.id] || { stars: 0, score: 0 };
        const isNewBest = s.quizScore > (prev.score || 0);

        const newLp = {
          ...s.levelProgress,
          [lv.id]: {
            stars: Math.max(stars, prev.stars || 0),
            score: Math.max(s.quizScore, prev.score || 0),
            completed: stars > 0,
          },
        };

        const newBestScores = isNewBest
          ? { ...s.bestScores, [lv.id]: s.quizScore }
          : s.bestScores;

        // Update leaderboard
        const playerEntry = { name: "Ikaw (You)", xp: newTotalXp, rank: newRank.name, date: "Ngayon" };
        let lb = [...s.leaderboard];
        const pi = lb.findIndex((e) => e.name === "Ikaw (You)");
        if (pi >= 0) lb[pi] = playerEntry;
        else lb.push(playerEntry);
        lb.sort((a, b) => b.xp - a.xp);

        // Check if next level was just unlocked
        const nextLv = levels.find((l) => l.id === s.currentLevelId + 1);
        const justUnlocked = nextLv && stars > 0 && !(s.levelProgress[nextLv.id]?.stars > 0);

        set({
          screen: "results",
          totalXp: newTotalXp,
          levelProgress: newLp,
          bestScores: newBestScores,
          leaderboard: lb,
        });

        return { pct, stars, xpGained, rankedUp, newRank, isNewBest, justUnlocked, nextLv };
      },

      resetAll: () => set({
        totalXp: 0,
        levelProgress: {},
        bestScores: {},
        leaderboard: [...DEFAULT_LEADERBOARD],
        screen: "menu",
      }),
    }),
    {
      name: "alam-mo-ba-v2",
      partialize: (state) => ({
        totalXp: state.totalXp,
        levelProgress: state.levelProgress,
        bestScores: state.bestScores,
        leaderboard: state.leaderboard,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);

export default useGameStore;
