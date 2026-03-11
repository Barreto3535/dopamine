export type ActiveFocusSession = {
    taskId: string | null;
    taskTitle: string | null;
    startedAt: string;
    durationMinutes: number;
    expectedEndAt: string;
    isPaused: boolean;
    pausedAt: string | null;
    remainingSecondsWhenPaused: number | null;
};