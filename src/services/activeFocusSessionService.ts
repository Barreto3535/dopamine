import type { ActiveFocusSession } from "../types/activeFocusSession";

const STORAGE_KEY = "active_focus_session";

export function getActiveFocusSession(): ActiveFocusSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as ActiveFocusSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveActiveFocusSession(session: ActiveFocusSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearActiveFocusSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getRemainingSeconds(session: ActiveFocusSession): number {
  if (session.isPaused && session.remainingSecondsWhenPaused !== null) {
    return Math.max(0, session.remainingSecondsWhenPaused);
  }

  const expectedEnd = new Date(session.expectedEndAt).getTime();
  const now = Date.now();

  return Math.max(0, Math.floor((expectedEnd - now) / 1000));
}

export function createActiveFocusSession(params: {
  taskId: string | null;
  taskTitle: string | null;
  durationMinutes: number;
}): ActiveFocusSession {
  const startedAt = new Date().toISOString();
  const expectedEndAt = new Date(
    Date.now() + params.durationMinutes * 60 * 1000
  ).toISOString();

  return {
    taskId: params.taskId,
    taskTitle: params.taskTitle,
    startedAt,
    durationMinutes: params.durationMinutes,
    expectedEndAt,
    isPaused: false,
    pausedAt: null,
    remainingSecondsWhenPaused: null,
  };
}

export function pauseActiveFocusSession(session: ActiveFocusSession) {
  const remainingSeconds = getRemainingSeconds(session);

  const updated: ActiveFocusSession = {
    ...session,
    isPaused: true,
    pausedAt: new Date().toISOString(),
    remainingSecondsWhenPaused: remainingSeconds,
  };

  saveActiveFocusSession(updated);
  return updated;
}

export function resumeActiveFocusSession(session: ActiveFocusSession) {
  const remainingSeconds =
    session.remainingSecondsWhenPaused ?? session.durationMinutes * 60;

  const expectedEndAt = new Date(
    Date.now() + remainingSeconds * 1000
  ).toISOString();

  const updated: ActiveFocusSession = {
    ...session,
    isPaused: false,
    pausedAt: null,
    remainingSecondsWhenPaused: null,
    expectedEndAt,
  };

  saveActiveFocusSession(updated);
  return updated;
}