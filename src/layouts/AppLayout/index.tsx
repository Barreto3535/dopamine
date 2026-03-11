import { Outlet } from "react-router-dom";
import { useState } from "react";
import AppHeader from "../../components/AppHeader";
import AppSidebar from "../../components/AppSidebar";
import MobileDrawer from "../../components/MobileDrawer";
import styles from "./styles.module.css";

export default function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <AppSidebar />

      <div className={styles.contentArea}>
        <AppHeader onMenuClick={() => setIsDrawerOpen(true)} />
        <MobileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}