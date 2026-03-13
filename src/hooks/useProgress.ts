import { useState, useEffect } from "react";
import {
  getFocusChartLast7Days,
  getFocusSessionsTodayCount,
  getMyProgress,
  getTasksCompletedTodayCount,
  getTotalCompletedFocusSessionsCount,
  getTotalCompletedTasksCount,
  getXpEarnedToday,
  listRecentFocusSessions,
  type DailyChartItem,
} from "../services/progressService";
import type { UserProgress } from "../types/progress";
import type { FocusSession } from "../types/focusSession";
import { toastHelpers } from "../utils/toast"; // 🔥 IMPORTAR

export type ProgressOverview = {
  progress: UserProgress | null;
  focusToday: number;
  tasksToday: number;
  xpToday: number;
  totalFocusSessions: number;
  totalCompletedTasks: number;
  recentSessions: FocusSession[];
  weeklyChart: DailyChartItem[];
};

export function useProgress() {
  const [data, setData] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        progress,
        focusToday,
        tasksToday,
        xpToday,
        totalFocusSessions,
        totalCompletedTasks,
        recentSessions,
        weeklyChart,
      ] = await Promise.all([
        getMyProgress(),
        getFocusSessionsTodayCount(),
        getTasksCompletedTodayCount(),
        getXpEarnedToday(),
        getTotalCompletedFocusSessionsCount(),
        getTotalCompletedTasksCount(),
        listRecentFocusSessions(),
        getFocusChartLast7Days(),
      ]);

      setData({
        progress,
        focusToday,
        tasksToday,
        xpToday,
        totalFocusSessions,
        totalCompletedTasks,
        recentSessions,
        weeklyChart,
      });
      
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível carregar seu progresso.";
      setError(message);
      
      // 🔥 Toast de erro (opcional - pode remover se preferir)
      toastHelpers.error(`❌ ${message}`);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: loadProgress,
  };
}