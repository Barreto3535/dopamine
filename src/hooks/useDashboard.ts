import { useState, useEffect } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import { getActiveFocusSession, getRemainingSeconds } from "../services/activeFocusSessionService";
import { listMyActiveEffects } from "../services/shopService";
import type { DashboardSummary } from "../types/dashboard";
import type { ActiveEffect } from "../services/shopService";

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFocusRemaining, setActiveFocusRemaining] = useState<number | null>(null);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);

  // 🔥 Primeiro declaramos a função
  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);

      const [dashboardData, effectsData] = await Promise.all([
        getDashboardSummary(),
        listMyActiveEffects(),
      ]);

      setSummary(dashboardData);
      setActiveEffects(effectsData);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível carregar o dashboard.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // 🔥 Depois usamos no useEffect
  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const update = () => {
      const session = getActiveFocusSession();

      if (!session) {
        setActiveFocusRemaining(null);
        return;
      }

      const remaining = getRemainingSeconds(session);

      if (remaining <= 0) {
        setActiveFocusRemaining(null);
        return;
      }

      setActiveFocusRemaining(remaining);
    };

    update();

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Agora podemos retornar a função
  return {
    summary,
    loading,
    error,
    activeFocusRemaining,
    activeEffects,
    refresh: loadDashboard // ✅ Agora está definida!
  };
}