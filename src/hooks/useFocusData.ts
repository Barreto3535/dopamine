import { useState, useEffect, useMemo } from "react"; // 🔥 Importar useMemo
import { listTasks } from "../services/tasksService";
import { registerFocusSession } from "../services/focusSessionsService";
import { listMyActiveEffects } from "../services/shopService";
import { getActiveFocusSession } from "../services/activeFocusSessionService";
import type { Task } from "../types/task";
import type { ActiveEffect } from "../services/shopService";

export function useFocusData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksData, effectsData] = await Promise.all([
        listTasks(),
        listMyActiveEffects(),
      ]);

      const openTasks = tasksData.filter((task) => task.status !== "completed");
      setTasks(openTasks);
      setActiveEffects(effectsData);

      // Restaurar sessão ou selecionar tarefa padrão
      const storedSession = getActiveFocusSession();
      
      if (storedSession) {
        setSelectedTaskId(storedSession.taskId ?? "");
        return;
      }

      const mainTask = openTasks.find((task) => task.is_main_task);
      if (mainTask) {
        setSelectedTaskId(mainTask.id);
      } else if (openTasks.length > 0) {
        setSelectedTaskId(openTasks[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as tarefas."
      );
    } finally {
      setLoading(false);
    }
  };

  const reloadActiveEffects = async () => {
    try {
      const effects = await listMyActiveEffects();
      setActiveEffects(effects);
    } catch (err) {
      console.error("Erro ao recarregar efeitos ativos:", err);
    }
  };

  const registerSession = async (params: {
    taskId: string;
    durationMinutes: number;
    actualMinutes: number;
    status: "completed" | "cancelled";
    startedAt: string;
    endedAt: string;
  }) => {
    try {
      setSaving(true);
      setError(null);

      await registerFocusSession({
        task_id: params.taskId,
        duration_minutes: params.durationMinutes,
        actual_duration_minutes: params.actualMinutes,
        status: params.status,
        started_at: params.startedAt,
        ended_at: new Date().toISOString(),
        xp_earned: params.status === "completed" ? 5 : 0,
      });

      await reloadActiveEffects();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔥 Agora useMemo está definido
  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const activeFocusBoost = activeEffects.find(
    (effect) => effect.effect_type === "focus_boost"
  );

  return {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    selectedTask,
    activeEffects,
    activeFocusBoost,
    loading,
    saving,
    error,
    setError,
    reloadActiveEffects,
    registerSession,
    refresh: loadData,
  };
}