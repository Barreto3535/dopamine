import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../services/profileService";
import type { Profile } from "../types/profile";
import { toastHelpers } from "../utils/toast";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar perfil";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    input: Partial<Pick<Profile, "display_name" | "avatar_url">>
  ) => {
    try {
      setSaving(true);
      setError(null);

      const updated = await toastHelpers.promise(
        updateMyProfile(input),
        {
          loading: "💾 Salvando alterações...",
          success: "✨ Perfil atualizado!",
          error: "❌ Erro ao atualizar perfil",
        }
      );

      setProfile(updated);
      return { success: true, profile: updated };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar perfil";
      setError(message);
      return { success: false, message };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    loading,
    saving,
    error,
    loadProfile,
    updateProfile,
  };
}