import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./styles.module.css";

export default function AppSidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logoMark}>FQ</div>
        <div>
          <strong className={styles.brandTitle}>FocusQuest</strong>
          <span className={styles.brandText}>Seu progresso diário</span>
        </div>
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
      </nav>

      <button className={styles.logoutButton} onClick={handleLogout}>
        Sair
      </button>
    </aside>
  );
}