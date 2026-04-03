// ============================================================
// FIREBASE SERVICE — Auth, Cloud Save, Online Leaderboard
// ============================================================

import { auth, googleProvider, db } from "./config";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  where,
} from "firebase/firestore";

// ============================================================
// AUTHENTICATION
// ============================================================

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signInWithGoogle() {
  try {
    // Try popup first (works on desktop)
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    if (error.code === "auth/popup-blocked" || error.code === "auth/popup-closed-by-user") {
      // Fallback to redirect (works on mobile)
      await signInWithRedirect(auth, googleProvider);
      return null; // Will be handled by getRedirectResult
    }
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function checkRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error("Redirect result error:", error);
    return null;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

// ============================================================
// CLOUD SAVE — Save & Load user progress
// ============================================================

export async function saveProgressToCloud(userId, gameState) {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      displayName: auth.currentUser?.displayName || "Anonymous",
      photoURL: auth.currentUser?.photoURL || null,
      totalXp: gameState.totalXp || 0,
      levelProgress: gameState.levelProgress || {},
      bestScores: gameState.bestScores || {},
      powerups: gameState.powerups || {},
      unlockedAchievements: gameState.unlockedAchievements || [],
      bestStreak: gameState.bestStreak || 0,
      dailyCompleted: gameState.dailyCompleted || 0,
      dailyStreak: gameState.dailyStreak || 0,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Save to cloud error:", error);
    return false;
  }
}

export async function loadProgressFromCloud(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error("Load from cloud error:", error);
    return null;
  }
}

// ============================================================
// ONLINE LEADERBOARD
// ============================================================

export async function submitScore(userId, displayName, photoURL, totalXp, rankName) {
  try {
    const leaderRef = doc(db, "leaderboard", userId);
    await setDoc(leaderRef, {
      displayName: displayName || "Anonymous",
      photoURL: photoURL || null,
      totalXp: totalXp || 0,
      rank: rankName || "Magsasaka",
      lastUpdated: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Submit score error:", error);
    return false;
  }
}

export async function getTopLeaderboard(count = 50) {
  try {
    const leaderRef = collection(db, "leaderboard");
    const q = query(leaderRef, orderBy("totalXp", "desc"), limit(count));
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return [];
  }
}

export async function getUserRank(userId) {
  try {
    // Get user's score first
    const userRef = doc(db, "leaderboard", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;

    const userXp = userSnap.data().totalXp;

    // Count how many players have higher XP
    const leaderRef = collection(db, "leaderboard");
    const q = query(leaderRef, where("totalXp", ">", userXp));
    const snapshot = await getDocs(q);

    return snapshot.size + 1; // rank is number of players above + 1
  } catch (error) {
    console.error("Get user rank error:", error);
    return null;
  }
}

// ============================================================
// SOCIAL SHARING — Generate share text/card
// ============================================================

export function generateShareData(score, levelName, rank, totalXp, isDaily = false) {
  const emoji = score >= 100 ? "🏆" : score >= 70 ? "⭐" : "🎮";
  const type = isDaily ? "Daily Challenge" : levelName;

  const text = `${emoji} I scored ${score} pts on ${type} — Alam Mo Ba?! Pinoy Quiz!\n\n` +
    `🏅 Rank: ${rank.icon} ${rank.name}\n` +
    `⚡ Total XP: ${totalXp.toLocaleString()}\n\n` +
    `Subukan mo rin! Gaano ka ka-Pinoy? 🇵🇭\n` +
    `#AlamMoBa #PinoyQuiz #PinoyTrivia`;

  return {
    title: "Alam Mo Ba?! Pinoy Quiz",
    text,
    url: "https://play.google.com/store/apps/details?id=com.rdahunanitservices.alamdoba",
  };
}

export async function shareResults(shareData) {
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert("Score copied to clipboard! Paste it anywhere to share.");
      return true;
    } else {
      // Fallback
      alert(shareData.text);
      return true;
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Share error:", error);
    }
    return false;
  }
}
