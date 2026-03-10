import { Outlet } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import Container from "../../components/Container";
import styles from "./styles.module.css";

export default function AppLayout() {
  return (
    <div className={styles.layout}>
      <AppHeader />

      <main className={styles.main}>
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}