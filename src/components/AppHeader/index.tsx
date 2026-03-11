import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import styles from "./styles.module.css";

export default function AppHeader() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Link to="/dashboard" className={styles.logo}>
            FocusQuest
          </Link>
        </div>

        <div className={styles.right}>
          <Link to="/tasks" className={styles.navLink}>
            Tarefas
          </Link>
          <Link to="/focus" className={styles.navLink}>
            Foco
          </Link>
          <Link to="/progress" className={styles.navLink}>
            Progresso
          </Link>
          <Link to="/shop" className={styles.navLink}>
            Shop
          </Link>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}