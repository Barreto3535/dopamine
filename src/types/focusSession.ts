export type FocusSessionStatus = "completed" | "cancelled" | "interrupted";

export type FocusSession = {
  id: string;
  user_id: string;
  task_id: string | null;
  duration_minutes: number;
  actual_duration_minutes: number | null;
  status: FocusSessionStatus;
  started_at: string;
  ended_at: string;
  xp_earned: number;
  created_at: string;
};

export type RegisterFocusSessionInput = {
  task_id?: string | null;
  duration_minutes: number;
  actual_duration_minutes?: number | null;
  status: FocusSessionStatus;
  started_at: string;
  ended_at: string;
  xp_earned?: number;
};