import { useState, useCallback, useEffect } from "react";
import useGameStore from "../store/gameStore";
import levels, { DIFF_CONFIG } from "../data/levels";
import { useTimer } from "../hooks/useTimer";
import { sounds } from "../utils/sound";

const LETTERS = ["A", "B", "C", "D"];

function StreakBar({ streak }) {
  if (streak === 0) {
    return (
      <div className="streak-bar">
        <span style={{ opacity: 0.4, fontSize: 11 }}>Answer correctly to build a streak!</span>
      </div>
    );
  }
  return (
    <div className="streak-bar">
      <span>{streak >= 3 ? "🔥" : ""} Streak: {streak}</span>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={`streak-dot ${i < streak % 5 || streak >= 5 ? "lit" : ""}`} />
      ))}
    </div>
  );
}

export default function QuizScreen() {
  const store = useGameStore();
  const {
    currentLevelId, quizQuestions, quizIndex, quizScore, quizStreak,
    quizAnswered, soundEnabled, answerQuestion, nextQuestion, endQuiz,
  } = store;

  const [scorePopups, setScorePopups] = useState([]);
  const [timedOut, setTimedOut] = useState(false);

  const lv = levels.find((l) => l.id === currentLevelId);
  const timePerQ = DIFF_CONFIG[lv?.diff]?.time || 15;
  const q = quizQuestions[quizIndex];

  const onTimeUp = useCallback(() => {
    if (quizAnswered || timedOut) return;
    setTimedOut(true);
    if (soundEnabled) sounds.wrong();
    answerQuestion(-1, 0, false);
  }, [quizAnswered, timedOut, soundEnabled, answerQuestion]);

  const { timeLeft, pct: timerPct, isWarning, start, stop, reset } = useTimer(timePerQ, onTimeUp);

  // Start timer when question changes
  useEffect(() => {
    setTimedOut(false);
    start();
    return () => stop();
  }, [quizIndex, start, stop]);

  const handleAnswer = (idx) => {
    if (quizAnswered) return;
    stop();
    const isCorrect = idx === q.c;

    if (isCorrect) {
      if (soundEnabled) sounds.correct();
      const tb = Math.ceil((timeLeft / timePerQ) * 5);
      const db = DIFF_CONFIG[lv.diff]?.bonus || 0;
      const pts = 10 + tb + db;
      answerQuestion(idx, pts, true);

      // Score popup
      const id = Date.now();
      setScorePopups((p) => [...p, { id, text: `+${pts}`, left: Math.random() * 40 + 30 }]);
      setTimeout(() => setScorePopups((p) => p.filter((s) => s.id !== id)), 900);
    } else {
      if (soundEnabled) sounds.wrong();
      answerQuestion(idx, 0, false);
    }
  };

  const handleNext = () => {
    if (soundEnabled) sounds.click();
    if (quizIndex < quizQuestions.length - 1) {
      nextQuestion();
    } else {
      endQuiz();
    }
  };

  if (!q || !lv) return null;

  const selectedAnswer = store.selectedAnswer;
  const isLast = quizIndex >= quizQuestions.length - 1;

  return (
    <>
      <div className="header-bar quiz-header">
        <div className="quiz-cat-label">{lv.icon} Lvl {lv.id}: {lv.name}</div>
        <div className="quiz-score-pill">★ {quizScore}</div>
      </div>

      <div className="q-progress-bar">
        <div className="q-progress-fill" style={{ width: `${(quizIndex / quizQuestions.length) * 100}%` }} />
      </div>

      <div className="timer-track">
        <div className={`timer-fill ${isWarning ? "warning" : ""}`} style={{ width: `${timerPct}%` }} />
      </div>

      <StreakBar streak={quizStreak} />

      <div className="scroll-area">
        <div className="quiz-body">
          <div className="q-meta">
            <div className="q-num">Q{quizIndex + 1} of {quizQuestions.length}</div>
            <div className={`q-timer-num ${isWarning ? "warning" : ""}`}>
              {Math.ceil(timeLeft)}
            </div>
          </div>

          <div className={`diff-badge ${lv.diff}`}>{lv.diff.toUpperCase()}</div>
          <div className="q-text">{q.q}</div>

          <div className="answers">
            {q.o.map((opt, i) => {
              let cls = "answer-btn";
              if (quizAnswered) {
                cls += " disabled";
                if (i === q.c) cls += " correct";
                if (i === selectedAnswer && selectedAnswer !== q.c) cls += " wrong";
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                  <span className="answer-letter">{LETTERS[i]}</span>
                  <span>{opt}</span>
                  {quizAnswered && i === q.c && <span className="answer-status">✓</span>}
                  {quizAnswered && i === selectedAnswer && selectedAnswer !== q.c && (
                    <span className="answer-status">✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {quizAnswered && (
            <div className={`explanation-box ${timedOut ? "timeout" : ""}`}>
              {timedOut ? (
                <>⏰ <b>Naubos ang oras!</b> Sagot: <b>{q.o[q.c]}</b><br /></>
              ) : null}
              💡 {q.e}
            </div>
          )}

          {quizAnswered && (
            <button className="next-btn" onClick={handleNext}>
              {isLast ? "Tingnan ang Results →" : "Susunod →"}
            </button>
          )}
        </div>
      </div>

      {scorePopups.map((p) => (
        <div key={p.id} className="score-popup" style={{ left: `${p.left}%`, top: "55%" }}>
          {p.text}
        </div>
      ))}
    </>
  );
}
