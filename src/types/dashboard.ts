import type { Profile } from "./profile";
import type { UserProgress } from "./progress";
import type { Task } from "./task";

export type DashboardSummary = {
  profile: Profile | null;
  progress: UserProgress | null;
  main_task: Task | null;
  open_tasks_count: number;
  focus_sessions_today: number;
  tasks_completed_today: number;
};