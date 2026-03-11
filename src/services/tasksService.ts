import { supabase } from "../lib/supabaseClient";
import type {
  CreateTaskInput,
  CreateTaskStepInput,
  Task,
  TaskStep,
  UpdateTaskInput,
  UpdateTaskStepInput,
} from "../types/task";

export async function listTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const payload = {
    user_id: user.id,
    title: input.title,
    description: input.description ?? null,
    priority: input.priority ?? null,
    energy_level: input.energy_level ?? "medium",
    due_date: input.due_date ?? null,
    xp_reward: input.xp_reward ?? 10,
    is_main_task: input.is_main_task ?? false,
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateTask(
  taskId: string,
  input: UpdateTaskInput
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(input)
    .eq("id", taskId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function setMainTask(taskId: string): Promise<void> {
  const { error } = await supabase.rpc("set_main_task", {
    p_task_id: taskId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function completeTask(taskId: string): Promise<void> {
  const { error } = await supabase.rpc("complete_task", {
    p_task_id: taskId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function listTaskSteps(taskId: string): Promise<TaskStep[]> {
  const { data, error } = await supabase
    .from("task_steps")
    .select("*")
    .eq("task_id", taskId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createTaskStep(
  input: CreateTaskStepInput
): Promise<TaskStep> {
  const { data, error } = await supabase
    .from("task_steps")
    .insert({
      task_id: input.task_id,
      title: input.title,
      order_index: input.order_index,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateTaskStep(
  stepId: string,
  input: UpdateTaskStepInput
): Promise<TaskStep> {
  const { data, error } = await supabase
    .from("task_steps")
    .update(input)
    .eq("id", stepId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteTaskStep(stepId: string): Promise<void> {
  const { error } = await supabase.from("task_steps").delete().eq("id", stepId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function completeTaskStep(stepId: string): Promise<void> {
  const { error } = await supabase.rpc("complete_task_step", {
    p_step_id: stepId,
  });

  if (error) {
    throw new Error(error.message);
  }
}