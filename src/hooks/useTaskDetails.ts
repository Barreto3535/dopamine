import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  completeTask,
  completeTaskStep,
  createTaskStep,
  deleteTaskStep,
  getTaskById,
  listTaskSteps,
} from "../services/tasksService";
import type { Task, TaskStep } from "../types/task";
import { toastHelpers } from "../utils/toast";
import { useSoundEffects } from "./useSoundEffects";

export function useTaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();
  
  const [task, setTask] = useState<Task | null>(null);
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingStep, setSubmittingStep] = useState(false);
  const [completingTask, setCompletingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { playSuccess, playError, playStepComplete, playTaskComplete, playNotification } = useSoundEffects();

  const loadData = async () => {
    if (!taskId) {
      setError("Tarefa não encontrada.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [taskData, stepsData] = await Promise.all([
        getTaskById(taskId),
        listTaskSteps(taskId),
      ]);

      if (!taskData) {
        setError("Tarefa não encontrada.");
        return;
      }

      setTask(taskData);
      setSteps(stepsData);
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível carregar a tarefa.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
    } finally {
      setLoading(false);
    }
  };

  const reloadTaskData = async () => {
    if (!taskId) return;
    
    const [taskData, stepsData] = await Promise.all([
      getTaskById(taskId),
      listTaskSteps(taskId),
    ]);

    setTask(taskData);
    setSteps(stepsData);
  };

  const createStep = async (title: string) => {
    if (!taskId || !title.trim()) return;

    try {
      setSubmittingStep(true);
      setError(null);

      const toastId = toastHelpers.loading(`📌 Adicionando subtarefa...`);

      const newStep = await createTaskStep({
        task_id: taskId,
        title: title.trim(),
        order_index: steps.length,
      });

      setSteps((prev) => [...prev, newStep]);
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`✅ Subtarefa adicionada!`);
      playNotification();
      
      return { success: true, step: newStep };
      
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível criar a subtarefa.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      return { success: false, message };
      
    } finally {
      setSubmittingStep(false);
    }
  };

  const completeStep = async (stepId: string) => {
    try {
      setError(null);

      const toastId = toastHelpers.loading(`✓ Concluindo subtarefa...`);

      await completeTaskStep(stepId);
      await reloadTaskData();
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`✨ Subtarefa concluída!`);
      playStepComplete();
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível concluir a subtarefa.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      return { success: false, message };
    }
  };

  const deleteStep = async (stepId: string) => {
    try {
      setError(null);
      
      const confirmed = await toastHelpers.confirm(
        "Excluir esta subtarefa?"
      );
      if (!confirmed) return { success: false };

      const toastId = toastHelpers.loading(`🗑️ Excluindo subtarefa...`);

      await deleteTaskStep(stepId);
      setSteps((prev) => prev.filter((step) => step.id !== stepId));
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`✅ Subtarefa excluída!`);
      playSuccess();
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível excluir a subtarefa.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      return { success: false, message };
    }
  };

  const completeCurrentTask = async () => {
    if (!taskId) return;

    try {
      setCompletingTask(true);
      setError(null);

      const toastId = toastHelpers.loading(`🎯 Concluindo tarefa...`);

      await completeTask(taskId);
      await reloadTaskData();
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`🎉 Tarefa concluída! +10 XP`);
      playTaskComplete();
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Não foi possível concluir a tarefa.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      return { success: false, message };
      
    } finally {
      setCompletingTask(false);
    }
  };

  const progress = steps.length === 0
    ? task?.status === "completed" ? 100 : 0
    : Math.round((steps.filter((s) => s.is_completed).length / steps.length) * 100);

  useEffect(() => {
    loadData();
  }, [taskId]);

  return {
    taskId,
    task,
    steps,
    loading,
    submittingStep,
    completingTask,
    error,
    progress,
    createStep,
    completeStep,
    deleteStep,
    completeCurrentTask,
    refresh: loadData,
  };
}