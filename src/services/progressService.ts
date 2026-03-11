import { supabase } from "../lib/supabaseClient";
import type { UserProgress } from "../types/progress";

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