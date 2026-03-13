import { useState, useEffect } from "react";
import { listThemes, getMySelectedThemeId, equipTheme, type Theme } from "../services/themeService";
import { toastHelpers } from "../utils/toast";

export function useTheme() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [loading, setLoading] = useState(true);
  const [equipping, setEquipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadThemes = async () => {
    try {
      setLoading(true);
      setError(null);

      const [themesData, selectedThemeId] = await Promise.all([
        listThemes(),
        getMySelectedThemeId(),
      ]);

      setThemes(themesData);
      setCurrentTheme(selectedThemeId);
      document.documentElement.setAttribute("data-theme", selectedThemeId);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar temas";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const changeTheme = async (themeId: string) => {
    try {
      setEquipping(true);
      setError(null);

      await toastHelpers.promise(
        equipTheme(themeId),
        {
          loading: "🎨 Aplicando tema...",
          success: "✨ Tema alterado com sucesso!",
          error: "❌ Erro ao aplicar tema",
        }
      );

      setCurrentTheme(themeId);
      document.documentElement.setAttribute("data-theme", themeId);
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao aplicar tema";
      setError(message);
      return { success: false, message };
    } finally {
      setEquipping(false);
    }
  };

  useEffect(() => {
    loadThemes();
  }, []);

  return {
    themes,
    currentTheme,
    loading,
    equipping,
    error,
    changeTheme,
    refresh: loadThemes,
  };
}