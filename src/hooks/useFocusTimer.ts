import { useState, useEffect, useRef } from "react";
import {
  clearActiveFocusSession,
  createActiveFocusSession,
  getActiveFocusSession,
  getRemainingSeconds,
  pauseActiveFocusSession,
  resumeActiveFocusSession,
  saveActiveFocusSession,
} from "../services/activeFocusSessionService";
import type { ActiveFocusSession } from "../types/activeFocusSession";

const DEFAULT_MINUTES = 25;
const DEFAULT_TITLE = "FocusQuest";

export function useFocusTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_MINUTES * 60);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveFocusSession | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_MINUTES);
  
  const intervalRef = useRef<number | null>(null);

  // Funções auxiliares
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const clearIntervalIfExists = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Efeito para título da página
  useEffect(() => {
    if (!activeSession) {
      document.title = DEFAULT_TITLE;
      return;
    }

    if (sessionFinished) {
      document.title = `Concluído • ${DEFAULT_TITLE}`;
      return;
    }

    document.title = `${formatTime(remainingSeconds)} • ${DEFAULT_TITLE}`;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [activeSession, remainingSeconds, sessionFinished]);

  // Efeito do timer
  useEffect(() => {
    if (!activeSession || !isRunning || isPaused) return;

    intervalRef.current = window.setInterval(() => {
      const stored = getActiveFocusSession();

      if (!stored) {
        clearIntervalIfExists();
        setIsRunning(false);
        setIsPaused(false);
        setActiveSession(null);
        setRemainingSeconds(durationMinutes * 60);
        return;
      }

      const remaining = getRemainingSeconds(stored);

      if (remaining <= 0) {
        clearIntervalIfExists();
        setRemainingSeconds(0);
        setIsRunning(false);
        setIsPaused(false);
        setSessionFinished(true);
        return;
      }

      setRemainingSeconds(remaining);
    }, 1000);

    return clearIntervalIfExists;
  }, [activeSession, isRunning, isPaused, durationMinutes]);

  // Funções públicas
  const resetTimer = (minutes = durationMinutes) => {
    clearIntervalIfExists();
    clearActiveFocusSession();
    setActiveSession(null);
    setIsRunning(false);
    setIsPaused(false);
    setSessionFinished(false);
    setRemainingSeconds(minutes * 60);
    document.title = DEFAULT_TITLE;
  };

  const startSession = (taskId: string, taskTitle: string | null, minutes: number) => {
    const session = createActiveFocusSession({
      taskId,
      taskTitle,
      durationMinutes: minutes,
    });

    saveActiveFocusSession(session);
    setActiveSession(session);
    setRemainingSeconds(minutes * 60);
    setIsRunning(true);
    setIsPaused(false);
    setDurationMinutes(minutes);
  };

  const pauseSession = () => {
    if (!activeSession) return;

    const updated = pauseActiveFocusSession(activeSession);
    clearIntervalIfExists();
    setActiveSession(updated);
    setRemainingSeconds(updated.remainingSecondsWhenPaused ?? remainingSeconds);
    setIsPaused(true);
    setIsRunning(false);
  };

  const resumeSession = () => {
    if (!activeSession) return;

    const updated = resumeActiveFocusSession(activeSession);
    setActiveSession(updated);
    setRemainingSeconds(getRemainingSeconds(updated));
    setIsPaused(false);
    setIsRunning(true);
  };

  const updateDuration = (minutes: number) => {
    if (activeSession) return;
    setDurationMinutes(minutes);
    setRemainingSeconds(minutes * 60);
  };

  return {
    // Estados
    isRunning,
    isPaused,
    sessionFinished,
    activeSession,
    remainingSeconds,
    durationMinutes,
    
    // Funções
    startSession,
    pauseSession,
    resumeSession,
    resetTimer,
    updateDuration,
    formatTime,
    
    // Progresso
    progressPercent: ((durationMinutes * 60 - remainingSeconds) / (durationMinutes * 60)) * 100,
  };
}