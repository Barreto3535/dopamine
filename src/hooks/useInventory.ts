import { useState, useEffect, useMemo } from "react";
import {
  listMyItems,
  listMyActiveEffects,
  useFocusBoost,
  type UserItem,
  type ActiveEffect,
} from "../services/shopService";
import { equipTheme, getMySelectedThemeId } from "../services/themeService";
import { toastHelpers } from "../utils/toast";
import { useSoundEffects } from "./useSoundEffects";

export function useInventory() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("default");
  const [loading, setLoading] = useState(true);
  const [usingItemId, setUsingItemId] = useState<string | null>(null);
  const [equippingThemeId, setEquippingThemeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { playSuccess, playError, playBoost } = useSoundEffects();

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
      const message = err instanceof Error ? err.message : "Erro ao carregar inventário.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
    } finally {
      setLoading(false);
    }
  }

  async function useItem(itemId: string) {
    setUsingItemId(itemId);
    setError(null);
    
    try {
      const toastId = toastHelpers.loading(`⚡ Ativando item...`);
      
      if (itemId === "focus_boost") {
        await useFocusBoost();
        playBoost();
      }

      await loadInventory();
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`✨ Item ativado com sucesso!`);
      playSuccess();
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao usar item.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      
      return { success: false, message };
      
    } finally {
      setUsingItemId(null);
    }
  }

  async function equipThemeItem(themeId: string) {
    setEquippingThemeId(themeId);
    setError(null);
    
    try {
      const toastId = toastHelpers.loading(`🎨 Equipando tema...`);
      
      await equipTheme(themeId);
      setSelectedThemeId(themeId);
      document.documentElement.setAttribute("data-theme", themeId);
      await loadInventory();
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`✨ Tema equipado com sucesso!`);
      playSuccess();
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao equipar tema.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
      
      return { success: false, message };
      
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