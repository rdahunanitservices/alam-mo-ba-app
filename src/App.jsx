import { useEffect } from "react";
import useGameStore from "./store/gameStore";
import { resumeAudio } from "./utils/sound";
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
