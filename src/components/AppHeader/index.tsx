import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { listMyActiveEffects } from "../../services/shopService";
import { getMyCoins } from "../../services/progressService";

type Props = {
  onMenuClick: () => void;
};

export default function AppHeader({ onMenuClick }: Props) {
  const [coins, setCoins] = useState(0);
  const [hasFocusBoost, setHasFocusBoost] = useState(false);

  useEffect(() => {
    async function loadHeaderData() {
      try {
        const [effects, coinsValue] = await Promise.all([
          listMyActiveEffects(),
          getMyCoins(),
        ]);

        setCoins(coinsValue);
        setHasFocusBoost(
          effects.some((effect) => effect.effect_type === "focus_boost")
        );
      } catch (error) {
        console.error("Erro ao carregar dados do header:", error);
      }
    }

    loadHeaderData();
  }, []);

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      <div className={styles.brand}>
        <strong className={styles.brandTitle}>FocusQuest</strong>
      </div>

      <div className={styles.right}>
        {hasFocusBoost && <span className={styles.boostBadge}>⚡</span>}
        <span className={styles.coinsBadge}>💰 {coins}</span>
      </div>
    </header>
  );
}