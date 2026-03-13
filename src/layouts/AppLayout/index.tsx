import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AppHeader from "../../components/navigation/AppHeader";
import AppSidebar from "../../components/navigation/AppSidebar";
import MobileDrawer from "../../components/navigation/MobileDrawer";
import ConfirmToast from "../../components/pattern/ConfirmToast"; // 🔥 IMPORTAR
import styles from "./styles.module.css";
import { getMySelectedThemeId } from "../../services/themeService";

export default function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    async function applyTheme() {
      try {
        const selectedThemeId = await getMySelectedThemeId();
        document.documentElement.setAttribute("data-theme", selectedThemeId);
      } catch (error) {
        console.error("Erro ao aplicar tema:", error);
        document.documentElement.setAttribute("data-theme", "default");
      }
    }

    applyTheme();
  }, []);

  return (
    <div className={styles.layout}>
      <AppSidebar />
      
      <div className={styles.contentArea}>
        <AppHeader onMenuClick={() => setIsDrawerOpen(true)} />
        
        <MobileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
        
        <ConfirmToast />
        
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}