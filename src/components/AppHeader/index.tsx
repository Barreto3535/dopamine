import { useNavigate } from "react-router-dom";
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
          <span className={styles.logo}>FocusQuest</span>
        </div>

        <div className={styles.right}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}