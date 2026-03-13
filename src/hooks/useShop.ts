import { useState, useEffect } from "react";
import {
  listShopItems,
  purchaseItem,
  type ShopItem,
} from "../services/shopService";
import { getMyCoins } from "../services/progressService";

export function useShop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof Error ? err.message : "Erro ao carregar loja.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    try {
      setBuyingId(item.id);
      setError(null);

      await purchaseItem(item.id);

      setCoins((prev) => prev - item.price);
      return { success: true, message: `Você comprou: ${item.title}` };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao comprar item.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
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