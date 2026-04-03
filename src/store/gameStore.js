import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRank, getNextRank, DEFAULT_LEADERBOARD } from "../data/ranks";
import { checkAchievements } from "../data/achievements";
import { getTodayDateStr } from "../data/dailyChallenge";
import levels from "../data/levels";

const useGameStore = create(
  persist(
    (set, get) => ({
      // === Core State ===
      screen: "menu",
      totalXp: 0,
      levelProgress: {},
      bestScores: {},
      leaderboard: [...DEFAULT_LEADERBOARD],
      soundEnabled: true,

      // === Power-ups (persisted) ===
      powerups: { fiftyFifty: 3, skip: 3, extraTime: 3 },

      // === Achievements (persisted) ===
      unlockedAchievements: [],
      bestStreak: 0,
      newAchievements: [], // newly unlocked this session, shown as toast

      // === Daily Challenge (persisted) ===
      dailyCompleted: 0,
      lastDailyDate: null,
      dailyBestScore: 0,
      dailyStreak: 0, // consecutive days

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
      hiddenAnswers: [], // for 50/50 power-up
      skippedQuestion: false,
      isDaily: false, // true if playing daily challenge
      quizPowerupsUsed: { fiftyFifty: 0, skip: 0, extraTime: 0 },

      // === Actions ===
      setScreen: (screen) => set({ screen }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      clearNewAchievements: () => set({ newAchievements: [] }),

      getUnlockedUpTo: () => {
        const { levelProgress } = get();
        for (let i = 0; i < levels.length; i++) {
          const lp = levelProgress[levels[i].id];
          if (!lp || !lp.stars) return levels[i].id;
        }
        return levels[levels.length - 1].id + 1;
      },

      canPlayDaily: () => {
        const { lastDailyDate } = get();
        return lastDailyDate !== getTodayDateStr();
      },

      startQuiz: (levelId, questions, isDaily = false) => set({
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
        hiddenAnswers: [],
        skippedQuestion: false,
        isDaily,
        quizPowerupsUsed: { fiftyFifty: 0, skip: 0, extraTime: 0 },
      }),

      // === Power-up Actions ===
      useFiftyFifty: (correctIdx) => {
        const s = get();
        if (s.powerups.fiftyFifty <= 0 || s.quizAnswered) return false;
        // Find wrong answers and hide 2 of them
        const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
        const toHide = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
        set({
          powerups: { ...s.powerups, fiftyFifty: s.powerups.fiftyFifty - 1 },
          hiddenAnswers: toHide,
          quizPowerupsUsed: { ...s.quizPowerupsUsed, fiftyFifty: s.quizPowerupsUsed.fiftyFifty + 1 },
        });
        return true;
      },

      useSkip: () => {
        const s = get();
        if (s.powerups.skip <= 0 || s.quizAnswered) return false;
        set({
          powerups: { ...s.powerups, skip: s.powerups.skip - 1 },
          quizAnswered: true,
          skippedQuestion: true,
          selectedAnswer: -2, // special value for skip
          quizPowerupsUsed: { ...s.quizPowerupsUsed, skip: s.quizPowerupsUsed.skip + 1 },
        });
        return true;
      },

      useExtraTime: () => {
        const s = get();
        if (s.powerups.extraTime <= 0 || s.quizAnswered) return false;
        set({
          powerups: { ...s.powerups, extraTime: s.powerups.extraTime - 1 },
          quizPowerupsUsed: { ...s.quizPowerupsUsed, extraTime: s.quizPowerupsUsed.extraTime + 1 },
        });
        return true; // caller adds time
      },

      answerQuestion: (idx, points, isCorrect) => set((s) => {
        const newStreak = isCorrect ? s.quizStreak + 1 : 0;
        const newMaxStreak = Math.max(s.quizMaxStreak, newStreak);
        return {
          quizScore: s.quizScore + points,
          quizCorrect: s.quizCorrect + (isCorrect ? 1 : 0),
          quizStreak: newStreak,
          quizMaxStreak: newMaxStreak,
          quizAnswered: true,
          selectedAnswer: idx,
          hiddenAnswers: [],
        };
      }),

      nextQuestion: () => set((s) => ({
        quizIndex: s.quizIndex + 1,
        quizAnswered: false,
        selectedAnswer: null,
        hiddenAnswers: [],
        skippedQuestion: false,
      })),

      endQuiz: () => {
        const s = get();
        const isDaily = s.isDaily;
        const lv = isDaily ? null : levels.find((l) => l.id === s.currentLevelId);

        const pct = Math.round((s.quizCorrect / s.quizQuestions.length) * 100);
        const stars = s.quizCorrect >= 9 ? 3 : s.quizCorrect >= 6 ? 2 : s.quizCorrect >= 4 ? 1 : 0;

        const diff = isDaily ? "normal" : lv?.diff || "easy";
        const xpBase = { easy: 15, normal: 25, hard: 40 }[diff] || 15;
        const xpBonus = s.quizMaxStreak >= 5 ? 20 : s.quizMaxStreak >= 3 ? 10 : 0;
        let xpGained = Math.round(xpBase * s.quizCorrect + xpBonus);
        if (isDaily) xpGained = Math.round(xpGained * 1.5); // Daily bonus!

        const prevRank = getRank(s.totalXp);
        const newTotalXp = s.totalXp + xpGained;
        const newRank = getRank(newTotalXp);
        const rankedUp = newRank.name !== prevRank.name;

        // Update best streak globally
        const newBestStreak = Math.max(s.bestStreak || 0, s.quizMaxStreak);

        // Earn powerups from performance
        let earnedPowerups = { ...s.powerups };
        if (stars >= 3) {
          earnedPowerups.fiftyFifty += 1;
          earnedPowerups.skip += 1;
          earnedPowerups.extraTime += 1;
        } else if (stars >= 2) {
          // Random one
          const types = ["fiftyFifty", "skip", "extraTime"];
          const pick = types[Math.floor(Math.random() * types.length)];
          earnedPowerups[pick] += 1;
        }

        let updates = {
          screen: "results",
          totalXp: newTotalXp,
          bestStreak: newBestStreak,
          powerups: earnedPowerups,
        };

        // Level-specific updates
        if (!isDaily && lv) {
          const prev = s.levelProgress[lv.id] || { stars: 0, score: 0 };
          const isNewBest = s.quizScore > (prev.score || 0);

          updates.levelProgress = {
            ...s.levelProgress,
            [lv.id]: {
              stars: Math.max(stars, prev.stars || 0),
              score: Math.max(s.quizScore, prev.score || 0),
              completed: stars > 0,
            },
          };
          updates.bestScores = isNewBest
            ? { ...s.bestScores, [lv.id]: s.quizScore }
            : s.bestScores;
        }

        // Daily challenge updates
        if (isDaily) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
          const wasYesterday = s.lastDailyDate === yStr;

          updates.dailyCompleted = (s.dailyCompleted || 0) + 1;
          updates.lastDailyDate = getTodayDateStr();
          updates.dailyBestScore = Math.max(s.dailyBestScore || 0, s.quizScore);
          updates.dailyStreak = wasYesterday ? (s.dailyStreak || 0) + 1 : 1;
        }

        // Update leaderboard
        const playerEntry = { name: "Ikaw (You)", xp: newTotalXp, rank: newRank.name, date: "Ngayon" };
        let lb = [...s.leaderboard];
        const pi = lb.findIndex((e) => e.name === "Ikaw (You)");
        if (pi >= 0) lb[pi] = playerEntry;
        else lb.push(playerEntry);
        lb.sort((a, b) => b.xp - a.xp);
        updates.leaderboard = lb;

        // Check achievements
        const tempState = { ...s, ...updates };
        const newAch = checkAchievements(tempState);
        if (newAch.length > 0) {
          updates.unlockedAchievements = [
            ...(s.unlockedAchievements || []),
            ...newAch.map(a => a.id),
          ];
          updates.newAchievements = newAch;
        }

        set(updates);

        const nextLv = !isDaily ? levels.find((l) => l.id === s.currentLevelId + 1) : null;
        const justUnlocked = nextLv && stars > 0 && !(s.levelProgress[nextLv.id]?.stars > 0);

        return { pct, stars, xpGained, rankedUp, newRank, isNewBest: false, justUnlocked, nextLv, isDaily };
      },

      resetAll: () => set({
        totalXp: 0,
        levelProgress: {},
        bestScores: {},
        leaderboard: [...DEFAULT_LEADERBOARD],
        powerups: { fiftyFifty: 3, skip: 3, extraTime: 3 },
        unlockedAchievements: [],
        bestStreak: 0,
        dailyCompleted: 0,
        lastDailyDate: null,
        dailyBestScore: 0,
        dailyStreak: 0,
        screen: "menu",
      }),
    }),
    {
      name: "alam-mo-ba-v3",
      partialize: (state) => ({
        totalXp: state.totalXp,
        levelProgress: state.levelProgress,
        bestScores: state.bestScores,
        leaderboard: state.leaderboard,
        soundEnabled: state.soundEnabled,
        powerups: state.powerups,
        unlockedAchievements: state.unlockedAchievements,
        bestStreak: state.bestStreak,
        dailyCompleted: state.dailyCompleted,
        lastDailyDate: state.lastDailyDate,
        dailyBestScore: state.dailyBestScore,
        dailyStreak: state.dailyStreak,
      }),
    }
  )
);

export default useGameStore;
