import { useState, useEffect } from "react";
import {
  createTask,
  deleteTask,
  listTasks,
  setMainTask,
} from "../services/tasksService";
import type { Task, TaskEnergyLevel } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listTasks();
      setTasks(data);
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

  const handleCreateTask = async (taskData: {
    title: string;
    description?: string;
    energyLevel: TaskEnergyLevel;
    dueDate: string | null;
  }) => {
    try {
      setSubmitting(true);
      setError(null);

      const newTask = await createTask({
        title: taskData.title,
        description: taskData.description,
        energy_level: taskData.energyLevel,
        due_date: taskData.dueDate,
      });

      setTasks((prev) => [newTask, ...prev]);
      return { success: true, task: newTask };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível criar a tarefa.";
      setError(message);
      return { success: false, message };
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetMainTask = async (taskId: string) => {
    try {
      setError(null);
      await setMainTask(taskId);
      await loadTasks(); // Recarrega para atualizar qual é a principal
      return { success: true };
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível definir a missão principal.";
      setError(message);
      return { success: false, message };
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setError(null);
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível excluir a tarefa.";
      setError(message);
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