import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>FQ</span>
          <span className={styles.logoText}>FocusQuest</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Início
          </Link>

          <Link to="/login" className={styles.link}>
            Entrar
          </Link>

          <Link to="/login" className={styles.cta}>
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}