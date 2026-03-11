import { supabase } from "../lib/supabaseClient";
import type { UserProgress } from "../types/progress";
import type { FocusSession } from "../types/focusSession";

export type DailyChartItem = {
  date: string;
  label: string;
  focusCount: number;
  xp: number;
};

export async function getMyProgress(): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function addUserXp(amount: number): Promise<void> {
  const { error } = await supabase.rpc("add_user_xp", {
    p_amount: amount,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getFocusSessionsTodayCount(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);

  const { count, error } = await supabase
    .from("focus_sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")
  .gte("started_at", `${today}T00:00:00`)
    .lte("started_at", `${today}T23:59:59`);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getTasksCompletedTodayCount(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);

  const { count, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")
    .gte("completed_at", `${today}T00:00:00`)
    .lte("completed_at", `${today}T23:59:59`);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getXpEarnedToday(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("focus_sessions")
    .select("xp_earned")
    .eq("status", "completed")
    .gte("started_at", `${today}T00:00:00`)
    .lte("started_at", `${today}T23:59:59`);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).reduce((acc, item) => acc + (item.xp_earned ?? 0), 0);
}

export async function listRecentFocusSessions(): Promise<FocusSession[]> {
  const { data, error } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("status", "completed")
    .order("started_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getTotalCompletedTasksCount(): Promise<number> {
  const { count, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getTotalCompletedFocusSessionsCount(): Promise<number> {
  const { count, error } = await supabase
    .from("focus_sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

function getLast7Days() {
  const formatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    const iso = date.toISOString().slice(0, 10);
    const label = formatter.format(date).replace(".", "");

    return {
      date: iso,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    };
  });
}

export async function getFocusChartLast7Days(): Promise<DailyChartItem[]> {
  const days = getLast7Days();
  const startDate = `${days[0].date}T00:00:00`;
  const endDate = `${days[days.length - 1].date}T23:59:59`;

  const { data, error } = await supabase
    .from("focus_sessions")
    .select("started_at, xp_earned")
    .eq("status", "completed")
    .gte("started_at", startDate)
    .lte("started_at", endDate);

  if (error) {
    throw new Error(error.message);
  }

  return days.map((day) => {
    const sessionsOfDay = (data ?? []).filter(
      (item) => item.started_at.slice(0, 10) === day.date
    );

    return {
      date: day.date,
      label: day.label,
      focusCount: sessionsOfDay.length,
      xp: sessionsOfDay.reduce((acc, item) => acc + (item.xp_earned ?? 0), 0),
    };
  });
}

export async function getMyCoins(): Promise<number>{
  const {data, error} = await supabase
    .from("user_progress")
    .select("coins")
    .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }
    
    return data?.coins??0;
}