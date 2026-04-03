import { useEffect } from "react";
import useGameStore from "./store/gameStore";
import { resumeAudio } from "./utils/sound";
import { onAuthChange, checkRedirectResult } from "./firebase/service";
import MenuScreen from "./components/MenuScreen";
import MapScreen from "./components/MapScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import AchievementsScreen from "./components/AchievementsScreen";
import "./styles/app.css";

const SCREENS = {
  menu: MenuScreen,
  map: MapScreen,
  quiz: QuizScreen,
  results: ResultsScreen,
  leaderboard: LeaderboardScreen,
  achievements: AchievementsScreen,
};

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const setUser = useGameStore((s) => s.setUser);
  const syncFromCloud = useGameStore((s) => s.syncFromCloud);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      if (user) {
        // Sync progress from cloud when user logs in
        await syncFromCloud();
      }
    });

    // Check for redirect result (mobile Google sign-in)
    checkRedirectResult();

    return () => unsubscribe();
  }, [setUser, syncFromCloud]);

  // Resume audio context on first interaction
  useEffect(() => {
    const handler = () => { resumeAudio(); };
    document.addEventListener("pointerdown", handler, { once: true });
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  const ScreenComponent = SCREENS[screen] || MenuScreen;

  return (
    <div className="app-shell">
      <ScreenComponent />
    </div>
  );
}
