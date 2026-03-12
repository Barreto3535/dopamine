import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import {
  listMyItems,
  listMyActiveEffects,
  useFocusBoost,
  type UserItem,
  type ActiveEffect,
} from "../../services/shopService";
import { equipTheme, getMySelectedThemeId } from "../../services/themeService";
import PageIntro from "../../components/PageIntro";
import ActiveEffectBanner from "../../components/ActiveEffectBanner";

export default function Inventory() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("default");
  const [loading, setLoading] = useState(true);
  const [usingItemId, setUsingItemId] = useState<string | null>(null);
  const [equippingThemeId, setEquippingThemeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function handleEquipTheme(themeId: string) {
    try {
      setEquippingThemeId(themeId);
      setError(null);

      await equipTheme(themeId);

      setSelectedThemeId(themeId);
      document.documentElement.setAttribute("data-theme", themeId);

      await loadInventory();
      alert("Tema equipado com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao equipar tema.");
    } finally {
      setEquippingThemeId(null);
    }
  }

  if (loading) {
    return (
      <section className={styles.container}>
        <p className={styles.stateText}>Carregando inventário...</p>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <PageIntro
        eyebrow="Seus itens"
        title="Inventário"
        subtitle="Veja os itens que você comprou, use boosts e equipe seus temas."
      />

      {activeEffects.length > 0 && (
        <div className={styles.activeEffectsSection}>
          {activeEffects.map((effect) => (
            <ActiveEffectBanner
              key={effect.id}
              title={
                effect.effect_type === "focus_boost"
                  ? "Focus Boost ativo"
                  : effect.effect_type
              }
              description={
                effect.effect_type === "focus_boost"
                  ? `Próxima sessão de foco com +${effect.effect_value}% XP`
                  : `Efeito ativo: ${effect.effect_value}`
              }
            />
          ))}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

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

            const isThemeItem = item.type === "unlock_theme" && !!item.theme_id;
            const isEquippedTheme = item.theme_id === selectedThemeId;
            const isEquipping = equippingThemeId === item.theme_id;

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

                  {isThemeItem && isEquippedTheme && (
                    <span className={styles.equippedBadge}>Equipado</span>
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

                {isThemeItem && item.theme_id && (
                  <button
                    className={styles.equipButton}
                    onClick={() => handleEquipTheme(item.theme_id!)}
                    disabled={isEquipping || isEquippedTheme}
                  >
                    {isEquipping
                      ? "Equipando..."
                      : isEquippedTheme
                        ? "Equipado"
                        : "Equipar"}
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