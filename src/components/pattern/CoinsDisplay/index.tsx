import styles from "./styles.module.css";

interface CoinsDisplayProps {
  amount: number;
}

export default function CoinsDisplay({ amount }: CoinsDisplayProps) {
  return (
    <div className={styles.coinsBox}>
      💰 {amount} coins
    </div>
  );
}