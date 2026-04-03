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

function PowerupBar({ powerups, onFiftyFifty, onSkip, onExtraTime, disabled }) {
  return (
    <div className="powerup-bar">
      <button
        className={`powerup-btn fifty-fifty ${powerups.fiftyFifty <= 0 ? "empty" : ""}`}
        onClick={onFiftyFifty}
        disabled={disabled || powerups.fiftyFifty <= 0}
        title="50/50 — Remove 2 wrong answers"
      >
        <span className="pu-icon">½</span>
        <span className="pu-count">{powerups.fiftyFifty}</span>
      </button>
      <button
        className={`powerup-btn skip-btn ${powerups.skip <= 0 ? "empty" : ""}`}
        onClick={onSkip}
        disabled={disabled || powerups.skip <= 0}
        title="Skip — Skip without penalty"
      >
        <span className="pu-icon">⏭️</span>
        <span className="pu-count">{powerups.skip}</span>
      </button>
      <button
        className={`powerup-btn extra-time ${powerups.extraTime <= 0 ? "empty" : ""}`}
        onClick={onExtraTime}
        disabled={disabled || powerups.extraTime <= 0}
        title="Extra Time — Add 10 seconds"
      >
        <span className="pu-icon">⏱️</span>
        <span className="pu-count">{powerups.extraTime}</span>
      </button>
    </div>
  );
}

export default function QuizScreen() {
  const store = useGameStore();
  const {
    currentLevelId, quizQuestions, quizIndex, quizScore, quizStreak,
    quizAnswered, soundEnabled, answerQuestion, nextQuestion, endQuiz,
    powerups, hiddenAnswers, skippedQuestion, isDaily,
    useFiftyFifty, useSkip, useExtraTime,
  } = store;

  const [scorePopups, setScorePopups] = useState([]);
  const [timedOut, setTimedOut] = useState(false);
  const [powerupFlash, setPowerupFlash] = useState(null);

  const lv = !isDaily ? levels.find((l) => l.id === currentLevelId) : null;
  const timePerQ = isDaily
    ? store.quizQuestions[0]?._timePerQ || 10
    : (DIFF_CONFIG[lv?.diff]?.time || 15);
  const q = quizQuestions[quizIndex];

  const onTimeUp = useCallback(() => {
    if (quizAnswered || timedOut) return;
    setTimedOut(true);
    if (soundEnabled) sounds.wrong();
    answerQuestion(-1, 0, false);
  }, [quizAnswered, timedOut, soundEnabled, answerQuestion]);

  const { timeLeft, pct: timerPct, isWarning, start, stop, addTime } = useTimer(timePerQ, onTimeUp);

  useEffect(() => {
    setTimedOut(false);
    start();
    return () => stop();
  }, [quizIndex, start, stop]);

  const showPowerupFlash = (text) => {
    setPowerupFlash(text);
    setTimeout(() => setPowerupFlash(null), 1200);
  };

  const handleFiftyFifty = () => {
    if (!q || quizAnswered) return;
    const ok = useFiftyFifty(q.c);
    if (ok) {
      if (soundEnabled) sounds.fiftyFifty();
      showPowerupFlash("50/50!");
    }
  };

  const handleSkip = () => {
    if (!q || quizAnswered) return;
    const ok = useSkip();
    if (ok) {
      stop();
      if (soundEnabled) sounds.skip();
      showPowerupFlash("Skipped!");
    }
  };

  const handleExtraTime = () => {
    if (!q || quizAnswered) return;
    const ok = useExtraTime();
    if (ok) {
      addTime(10);
      if (soundEnabled) sounds.extraTime();
      showPowerupFlash("+10s!");
    }
  };

  const handleAnswer = (idx) => {
    if (quizAnswered) return;
    stop();
    const isCorrect = idx === q.c;

    if (isCorrect) {
      if (soundEnabled) sounds.correct();
      const tb = Math.ceil((timeLeft / timePerQ) * 5);
      const db = isDaily ? 5 : (DIFF_CONFIG[lv?.diff]?.bonus || 0);
      const pts = 10 + tb + db;
      answerQuestion(idx, pts, true);

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

  if (!q) return null;

  const selectedAnswer = store.selectedAnswer;
  const isLast = quizIndex >= quizQuestions.length - 1;
  const diff = isDaily ? "normal" : lv?.diff || "easy";
  const headerLabel = isDaily
    ? "📅 Daily Challenge"
    : `${lv?.icon} Lvl ${lv?.id}: ${lv?.name}`;

  return (
    <>
      <div className="header-bar quiz-header">
        <div className="quiz-cat-label">{headerLabel}</div>
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

          <div className={`diff-badge ${diff}`}>{diff.toUpperCase()}</div>
          <div className="q-text">{q.q}</div>

          {/* Power-ups */}
          <PowerupBar
            powerups={powerups}
            onFiftyFifty={handleFiftyFifty}
            onSkip={handleSkip}
            onExtraTime={handleExtraTime}
            disabled={quizAnswered}
          />

          <div className="answers">
            {q.o.map((opt, i) => {
              const isHidden = hiddenAnswers.includes(i);
              let cls = "answer-btn";
              if (isHidden) cls += " hidden-answer";
              if (quizAnswered && !skippedQuestion) {
                cls += " disabled";
                if (i === q.c) cls += " correct";
                if (i === selectedAnswer && selectedAnswer !== q.c) cls += " wrong";
              }
              if (quizAnswered && skippedQuestion) {
                cls += " disabled";
                if (i === q.c) cls += " correct";
              }
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => handleAnswer(i)}
                  disabled={isHidden || quizAnswered}
                >
                  <span className="answer-letter">{LETTERS[i]}</span>
                  <span>{isHidden ? "—" : opt}</span>
                  {quizAnswered && !skippedQuestion && i === q.c && <span className="answer-status">✓</span>}
                  {quizAnswered && !skippedQuestion && i === selectedAnswer && selectedAnswer !== q.c && (
                    <span className="answer-status">✗</span>
                  )}
                  {quizAnswered && skippedQuestion && i === q.c && <span className="answer-status">✓</span>}
                </button>
              );
            })}
          </div>

          {quizAnswered && (
            <div className={`explanation-box ${timedOut ? "timeout" : ""} ${skippedQuestion ? "skipped" : ""}`}>
              {timedOut && (
                <>⏰ <b>Naubos ang oras!</b> Sagot: <b>{q.o[q.c]}</b><br /></>
              )}
              {skippedQuestion && (
                <>⏭️ <b>Skipped!</b> Sagot: <b>{q.o[q.c]}</b><br /></>
              )}
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

      {/* Power-up flash */}
      {powerupFlash && (
        <div className="powerup-flash">{powerupFlash}</div>
      )}

      {scorePopups.map((p) => (
        <div key={p.id} className="score-popup" style={{ left: `${p.left}%`, top: "55%" }}>
          {p.text}
        </div>
      ))}
    </>
  );
}
