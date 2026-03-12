import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./styles.module.css";
import { listMyActiveEffects } from "../../services/shopService";
import { getMyCoins } from "../../services/progressService";

export default function AppSidebar() {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [hasFocusBoost, setHasFocusBoost] = useState(false);

  useEffect(() => {
    async function loadSidebarData() {
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
        console.error("Erro ao carregar dados da sidebar:", error);
      }
    }

    loadSidebarData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>FQ</div>
          <div>
            <strong className={styles.brandTitle}>FocusQuest</strong>
            <span className={styles.brandText}>Seu progresso diário</span>
          </div>
        </div>

        <div className={styles.statusBox}>
          <span className={styles.coinsBadge}>💰 {coins} coins</span>
          {hasFocusBoost && <span className={styles.boostBadge}>⚡ Boost ativo</span>}
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Tarefas
          </NavLink>

          <NavLink
            to="/focus"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Foco
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Progresso
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Inventário
          </NavLink>
        </nav>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Sair
      </button>
    </aside>
  );
}