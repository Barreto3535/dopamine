import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { listMyItems, type UserItem } from "../../services/shopService";

export default function Inventory() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadInventory() {
    try {
      setLoading(true);
      setError(null);

      const data = await listMyItems();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar inventário."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  if (loading) {
    return (
      <section className={styles.container}>
        <p className={styles.stateText}>Carregando inventário...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.container}>
        <div className={styles.error}>{error}</div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Seus itens</p>
          <h1 className={styles.title}>Inventário</h1>
          <p className={styles.subtitle}>
            Veja os itens que você já desbloqueou ou comprou na loja.
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className={styles.emptyCard}>
          <h2>Nada por aqui ainda</h2>
          <p>
            Você ainda não possui itens no inventário. Compre algo na loja para
            começar a montar sua coleção.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((entry) => {
            const item = entry.shop_items;

            if (!item) return null;

            return (
              <article key={entry.id} className={styles.card}>
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

                <div className={styles.infoRow}>
                  <span className={styles.quantity}>
                    Quantidade: {entry.quantity}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}