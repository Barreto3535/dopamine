import { type ShopItem } from "../../../services/shopService";
import styles from "./styles.module.css";

interface ShopItemCardProps {
  item: ShopItem;
  coins: number;
  isBuying: boolean;
  onPurchase: (item: ShopItem) => void;
}

export default function ShopItemCard({
  item,
  coins,
  isBuying,
  onPurchase,
}: ShopItemCardProps) {
  const cannotAfford = coins < item.price;

  const handleClick = () => {
    onPurchase(item);
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

      

      <div className={styles.price}>{item.price} coins</div>

      <button
        className={styles.buyButton}
        onClick={handleClick}
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
}