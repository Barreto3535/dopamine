import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link to="/" className={styles.logo}>
          FocusQuest
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Início
          </Link>

          <Link to="/login" className={styles.link}>
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}