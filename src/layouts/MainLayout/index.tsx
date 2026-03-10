import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Container from "../../components/Container";
import styles from "./styles.module.css";

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
}