export type UserProgress = {
  user_id: string;
  xp: number;
  level: number;
  streak: number;
  last_activity_date: string | null;
  coins: number;
  created_at: string;
  updated_at: string;
};
