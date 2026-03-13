import { useState, useEffect, useMemo } from "react";
import {
  listMyItems,
  listMyActiveEffects,
  useFocusBoost,
  type UserItem,
  type ActiveEffect,
} from "../services/shopService";
import { equipTheme, getMySelectedThemeId } from "../services/themeService";

export function useInventory() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("default");
  const [loading, setLoading] = useState(true);
  const [usingItemId, setUsingItemId] = useState<string | null>(null);
  const [equippingThemeId, setEquippingThemeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeEffectTypes = useMemo(
    () => new Set(activeEffects.map((effect) => effect.effect_type)),
    [activeEffects]
  );

  async function loadInventory() {
    try {
      setLoading(true);
      setError(null);

      const [itemsData, effectsData, currentThemeId] = await Promise.all([
        listMyItems(),
        listMyActiveEffects(),
        getMySelectedThemeId(),
      ]);

      setItems(itemsData);
      setActiveEffects(effectsData);
      setSelectedThemeId(currentThemeId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar inventário."
      );
    } finally {
      setLoading(false);
    }
  }

  async function useItem(itemId: string) {
    try {
      setUsingItemId(itemId);
      setError(null);

      if (itemId === "focus_boost") {
        await useFocusBoost();
      }

      await loadInventory();
      return { success: true, message: "Item ativado com sucesso!" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao usar item.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setUsingItemId(null);
    }
  }

  async function equipThemeItem(themeId: string) {
    try {
      setEquippingThemeId(themeId);
      setError(null);

      await equipTheme(themeId);

      setSelectedThemeId(themeId);
      document.documentElement.setAttribute("data-theme", themeId);

      await loadInventory();
      return { success: true, message: "Tema equipado com sucesso!" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao equipar tema.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setEquippingThemeId(null);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  return {
    items,
    activeEffects,
    selectedThemeId,
    loading,
    usingItemId,
    equippingThemeId,
    error,
    activeEffectTypes,
    useItem,
    equipThemeItem,
    refreshInventory: loadInventory,
  };
}