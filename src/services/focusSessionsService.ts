import { supabase } from "../lib/supabaseClient";
import type {
  FocusSession,
  RegisterFocusSessionInput,
} from "../types/focusSession";

export async function listMyFocusSessions(): Promise<FocusSession[]> {
  const { data, error } = await supabase
    .from("focus_sessions")
    .select("*")
    .order("started_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function registerFocusSession(
  input: RegisterFocusSessionInput
): Promise<string> {
  if (input.status ==="completed"){
    await addUserCoins(3);
  }
  const { data, error } = await supabase.rpc("register_focus_session", {
    p_task_id: input.task_id ?? null,
    p_duration_minutes: input.duration_minutes,
    p_actual_duration_minutes: input.actual_duration_minutes ?? null,
    p_status: input.status,
    p_started_at: input.started_at,
    p_ended_at: input.ended_at,
    p_xp_earned: input.xp_earned ?? 5,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}