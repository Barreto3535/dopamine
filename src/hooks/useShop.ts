import { useState, useEffect } from "react";
import {
  listShopItems,
  purchaseItem,
  type ShopItem,
} from "../services/shopService";
import { getMyCoins } from "../services/progressService";
import { toastHelpers } from "../utils/toast";
import { useSoundEffects } from "./useSoundEffects";

export function useShop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { playPurchase, playError, playCoins } = useSoundEffects();

  const loadShop = async () => {
    try {
      setLoading(true);
      setError(null);
      const [itemsData, coinsData] = await Promise.all([
        listShopItems(),
        getMyCoins(),
      ]);
      setItems(itemsData);
      setCoins(coinsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar loja.";
      setError(message);
      toastHelpers.error(`❌ ${message}`);
      playError();
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    setBuyingId(item.id);
    setError(null);
    
    try {
      const toastId = toastHelpers.loading(`🛒 Comprando ${item.title}...`);
      
      await purchaseItem(item.id);
      setCoins((prev) => prev - item.price);
      
      toastHelpers.dismiss(toastId);
      toastHelpers.success(`🎉 ${item.title} adquirido!`);
      
      playPurchase();
      playCoins();
      
      return { success: true };
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro na compra";
      setError(message);
      
      if (message.includes("Permanent item already owned")) {
        toastHelpers.error(`❌ Você já possui ${item.title}`);
      } else {
        toastHelpers.error(message);
      }
      
      playError();
      
      return { success: false, message };
      
    } finally {
      setBuyingId(null);
    }
  };

  useEffect(() => {
    loadShop();
  }, []);

  return {
    items,
    coins,
    loading,
    buyingId,
    error,
    handlePurchase,
    refresh: loadShop,
  };
}