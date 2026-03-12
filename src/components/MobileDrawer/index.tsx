import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./styles.module.css";
import { listMyActiveEffects } from "../../services/shopService";
import { getMyCoins } from "../../services/progressService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileDrawer({ isOpen, onClose }: Props) {
  const [coins, setCoins] = useState(0);
  const [hasFocusBoost, setHasFocusBoost] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadDrawerData() {
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
        console.error("Erro ao carregar drawer:", error);
      }
    }

    loadDrawerData();
  }, [isOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />

      <aside className={styles.drawer}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <div className={styles.brandRow}>
              <span className={styles.brandMark}>FQ</span>
              <strong className={styles.brandTitle}>FocusQuest</strong>
            </div>
            <p className={styles.brandSubtitle}>Seu progresso diário</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <div className={styles.statusRow}>
          <span className={styles.coinsBadge}>💰 {coins} coins</span>
          {hasFocusBoost && <span className={styles.boostBadge}>⚡ Boost ativo</span>}
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Tarefas
          </NavLink>

          <NavLink
            to="/focus"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Foco
          </NavLink>

          <NavLink
            to="/progress"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Progresso
          </NavLink>

          <NavLink
            to="/shop"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/inventory"
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Inventário
          </NavLink>
        </nav>

        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </aside>
    </>
  );
}