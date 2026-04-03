import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(duration, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const callbackRef = useRef(onTimeUp);

  callbackRef.current = onTimeUp;

  const start = useCallback(() => {
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

  const pct = (timeLeft / duration) * 100;
  const isWarning = timeLeft <= 4;

  return { timeLeft, pct, isWarning, start, stop, reset, running };
}
