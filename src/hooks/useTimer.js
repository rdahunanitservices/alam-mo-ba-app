import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(duration, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const callbackRef = useRef(onTimeUp);
  const maxTimeRef = useRef(duration);

  callbackRef.current = onTimeUp;

  const start = useCallback(() => {
    maxTimeRef.current = duration;
    setTimeLeft(duration);
    setRunning(true);
  }, [duration]);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setTimeLeft(duration);
  }, [duration, stop]);

  // Add extra seconds (for power-up)
  const addTime = useCallback((seconds) => {
    setTimeLeft((prev) => {
      const newTime = prev + seconds;
      maxTimeRef.current = Math.max(maxTimeRef.current, newTime);
      return newTime;
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 0.1;
        if (next <= 0) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setTimeout(() => callbackRef.current?.(), 0);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const pct = (timeLeft / maxTimeRef.current) * 100;
  const isWarning = timeLeft <= 4;

  return { timeLeft, pct, isWarning, start, stop, reset, addTime, running };
}
