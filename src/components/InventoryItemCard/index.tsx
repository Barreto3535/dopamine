import styles from "./styles.module.css";
import type { UserItem } from "../../services/shopService";

interface InventoryItemCardProps {
  entry: UserItem;
  selectedThemeId: string;
  activeEffectTypes: Set<string>;
  isUsing: boolean;
  isEquipping: boolean;
  onUseItem: (itemId: string) => void;
  onEquipTheme: (themeId: string) => void;
}

export default function InventoryItemCard({
  entry,
  selectedThemeId,
  activeEffectTypes,
  isUsing,
  isEquipping,
  onUseItem,
  onEquipTheme,
}: InventoryItemCardProps) {
  const item = entry.shop_items;

  if (!item) return null;

  const isFocusBoostActive = activeEffectTypes.has("focus_boost");
  const canUseFocusBoost =
    item.id === "focus_boost" && entry.quantity > 0 && !isFocusBoostActive;

  const isThemeItem = item.type === "unlock_theme" && !!item.theme_id;
  const isEquippedTheme = item.theme_id === selectedThemeId;

  const handleUseClick = () => {
    if (item.id) {
      onUseItem(item.id);
    }
  };

  const handleEquipClick = () => {
    if (item.theme_id) {
      onEquipTheme(item.theme_id);
    }
  };

  return (
    <article className={styles.card}>
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
        <span className={styles.quantity}>Quantidade: {entry.quantity}</span>

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
          onClick={handleUseClick}
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
          onClick={handleEquipClick}
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
}