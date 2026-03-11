import { supabase } from "../lib/supabaseClient";
import type { Profile } from "../types/profile";

export async function getMyProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateMyProfile(
  input: Partial<Pick<Profile, "display_name" | "avatar_url">>
): Promise<Profile> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}