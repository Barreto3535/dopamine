import { supabase } from "../lib/supabaseClient";
import type { DashboardSummary } from "../types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data, error } = await supabase.rpc("get_dashboard_summary");

  if (error) {
    throw new Error(error.message);
  }

  return data as DashboardSummary;
}