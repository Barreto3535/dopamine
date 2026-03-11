export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high" | null;
export type TaskEnergyLevel = "low" | "medium" | "high";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  energy_level: TaskEnergyLevel;
  due_date: string | null;
  xp_reward: number;
  is_main_task: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskStep = {
  id: string;
  task_id: string;
  title: string;
  order_index: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  priority?: Exclude<TaskPriority, null>;
  energy_level?: TaskEnergyLevel;
  due_date?: string | null;
  xp_reward?: number;
  is_main_task?: boolean;
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  status?: TaskStatus;
  completed_at?: string | null;
};

export type CreateTaskStepInput = {
  task_id: string;
  title: string;
  order_index: number;
};

export type UpdateTaskStepInput = {
  title?: string;
  order_index?: number;
  is_completed?: boolean;
  completed_at?: string | null;
};