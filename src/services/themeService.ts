import { supabase } from "../lib/supabaseClient";

export type Theme = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  preview_color: string | null;
  is_active: boolean;
  created_at: string;
};

export async function listThemes(): Promise<Theme[]> {
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getMySelectedThemeId(): Promise<string> {
  const { data, error } = await supabase
    .from("profiles")
    .select("selected_theme_id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.selected_theme_id ?? "default";
}

export async function equipTheme(themeId: string): Promise<void> {
  const { error } = await supabase.rpc("equip_theme", {
    p_theme_id: themeId,
  });

  if (error) {
    throw new Error(error.message);
  }
}