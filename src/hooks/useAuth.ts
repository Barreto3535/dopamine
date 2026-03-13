import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { toastHelpers } from "../utils/toast";
import { useSoundEffects } from "./useSoundEffects";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { playSuccess, playError, playNotification } = useSoundEffects();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await toastHelpers.promise(
        supabase.auth.signInWithPassword({ email, password }),
        {
          loading: "🔄 Entrando...",
          success: "✨ Bem-vindo de volta!",
          error: "❌ Erro ao fazer login",
        }
      );

      if (error) throw error;
      
      playSuccess();
      navigate("/dashboard", { replace: true });
      
    } catch (err) {
      playError();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setLoading(true);

      const { error } = await toastHelpers.promise(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName.trim(),
            },
          },
        }),
        {
          loading: "🔄 Criando conta...",
          success: "🎉 Conta criada com sucesso!",
          error: "❌ Erro ao criar conta",
        }
      );

      if (error) throw error;

      toastHelpers.info("📧 Verifique seu email para confirmar a conta");
      playNotification();
      navigate("/dashboard", { replace: true });
      
    } catch (err) {
      playError();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const confirmed = await toastHelpers.confirm("Deseja realmente sair?");
    if (!confirmed) return;

    try {
      await toastHelpers.promise(
        supabase.auth.signOut(),
        {
          loading: "🔄 Saindo...",
          success: "👋 Até logo!",
          error: "❌ Erro ao sair",
        }
      );

      playNotification();
      navigate("/", { replace: true });
      
    } catch (err) {
      playError();
    }
  };

  return {
    login,
    signup,
    logout,
    loading,
  };
}