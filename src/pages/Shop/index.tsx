import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  listShopItems,
  purchaseItem,
  type ShopItem,
} from "../../services/shopService";
import { getMyCoins } from "../../services/progressService";

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadShop() {
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
  }

  useEffect(() => {
    loadShop();
  }, []);

  async function handlePurchase(item: ShopItem) {
    try {
      setBuyingId(item.id);
      setError(null);

      await purchaseItem(item.id);

      setCoins((prev) => prev - item.price);
      alert(`Você comprou: ${item.title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao comprar item.");
    } finally {
      setBuyingId(null);
    }
  }

  if (loading) {
    return (
      <section className={styles.container}>
        <p className={styles.stateText}>Carregando loja...</p>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Economia do app</p>
          <h1 className={styles.title}>Loja</h1>
          <p className={styles.subtitle}>
            Compre itens úteis e cosméticos para personalizar sua jornada.
          </p>
        </div>

        <div className={styles.coinsBox}>💰 {coins} coins</div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {items.map((item) => {
          const isBuying = buyingId === item.id;
          const cannotAfford = coins < item.price;

          return (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.icon}>{item.icon ?? "🎁"}</div>

                <div className={styles.meta}>
                  <span className={styles.typeBadge}>
                    {item.is_consumable ? "Consumível" : "Permanente"}
                  </span>
                </div>
              </div>

              <h3 className={styles.cardTitle}>{item.title}</h3>

              {item.description && (
                <p className={styles.description}>{item.description}</p>
              )}

              <div className={styles.price}>{item.price} coins</div>

              <button
                className={styles.buyButton}
                onClick={() => handlePurchase(item)}
                disabled={isBuying || cannotAfford}
              >
                {isBuying
                  ? "Comprando..."
                  : cannotAfford
                    ? "Coins insuficientes"
                    : "Comprar"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}