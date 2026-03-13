import { useState, useEffect } from "react";
import {
  createTask,
  deleteTask,
  listTasks,
  setMainTask,
} from "../services/tasksService";
import type { Task, TaskEnergyLevel } from "../types/task";
import { toastHelpers } from "../utils/toast";
import { useSoundEffects } from "./useSoundEffects";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { playSuccess, playError, playTaskComplete, playNotification } = useSoundEffects();

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listTasks();
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível carregar as tarefas.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    energyLevel: TaskEnergyLevel;
    dueDate: string | null;
  }) => {
    try {
      setSubmitting(true);
      setError(null);

      const toastId = toastHelpers.loading(`📝 Criando tarefa...`);

      const newTask = await createTask({
        title: taskData.title,
        description: taskData.description,
        energy_level: taskData.energyLevel,
        due_date: taskData.dueDate,
      });

      setTasks((prev) => [newTask, ...prev]);
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`✅ Tarefa criada com sucesso!`);
      playSuccess();
      
      return { success: true, task: newTask };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível criar a tarefa.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      return { success: false, message };
      
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetMainTask = async (taskId: string) => {
    try {
      setError(null);
      
      const confirmed = await toastHelpers.confirm(
        "Definir esta tarefa como missão principal?"
      );
      if (!confirmed) return { success: false };

      const toastId = toastHelpers.loading(`⭐ Definindo missão...`);

      await setMainTask(taskId);
      await loadTasks();
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`✨ Missão principal atualizada!`);
      playNotification();
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível definir a missão principal.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      return { success: false, message };
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setError(null);
      
      const confirmed = await toastHelpers.confirm(
        "Tem certeza que deseja excluir esta tarefa?"
      );
      if (!confirmed) return { success: false };

      const toastId = toastHelpers.loading(`🗑️ Excluindo tarefa...`);

      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`✅ Tarefa excluída!`);
      playSuccess();
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível excluir a tarefa.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      return { success: false, message };
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    submitting,
    error,
    setError,
    createTask: handleCreateTask,
    setMainTask: handleSetMainTask,
    deleteTask: handleDeleteTask,
    refresh: loadTasks,
  };
}