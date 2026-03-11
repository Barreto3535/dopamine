import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import {
  listMyItems,
  listMyActiveEffects,
  useFocusBoost,
  type UserItem,
  type ActiveEffect,
} from "../../services/shopService";

export default function Inventory() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingItemId, setUsingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadInventory() {
    try {
      setLoading(true);
      setError(null);

      const [itemsData, effectsData] = await Promise.all([
        listMyItems(),
        listMyActiveEffects(),
      ]);

      setItems(itemsData);
      setActiveEffects(effectsData);
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

  const activeEffectTypes = useMemo(
    () => new Set(activeEffects.map((effect) => effect.effect_type)),
    [activeEffects]
  );

  async function handleUseItem(itemId: string) {
    try {
      setUsingItemId(itemId);
      setError(null);

      if (itemId === "focus_boost") {
        await useFocusBoost();
      }

      await loadInventory();
      alert("Item ativado com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao usar item.");
    } finally {
      setUsingItemId(null);
    }
  }

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
            Veja os itens que você comprou e use seus boosts quando quiser.
          </p>
        </div>
      </header>

      {activeEffects.length > 0 && (
        <section className={styles.activeEffectsSection}>
          <div className={styles.sectionHeader}>
            <h2>Efeitos ativos</h2>
          </div>

          <div className={styles.effectsList}>
            {activeEffects.map((effect) => (
              <div key={effect.id} className={styles.activeEffectCard}>
                <span className={styles.activeEffectIcon}>⚡</span>
                <div>
                  <strong className={styles.activeEffectTitle}>
                    {effect.effect_type === "focus_boost"
                      ? "Focus Boost ativo"
                      : effect.effect_type}
                  </strong>
                  <p className={styles.activeEffectText}>
                    {effect.effect_type === "focus_boost"
                    ? `Próxima sessão de foco com +${effect.effect_value}% XP`
                      : `Efeito ativo: ${effect.effect_value}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

            const isUsing = usingItemId === item.id;
            const isFocusBoostActive = activeEffectTypes.has("focus_boost");

            const canUseFocusBoost =
              item.id === "focus_boost" &&
              entry.quantity > 0 &&
              !isFocusBoostActive;

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

                  {item.id === "focus_boost" && isFocusBoostActive && (
                    <span className={styles.activeBadge}>Ativo</span>
                  )}
                </div>

                {item.id === "focus_boost" && (
                  <button
                    className={styles.useButton}
                    onClick={() => handleUseItem(item.id)}
                    disabled={isUsing || !canUseFocusBoost}
                  >
                    {isUsing
                      ? "Usando..."
                      : isFocusBoostActive
                        ? "Boost já ativo"
                        : "Usar"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}