import styles from "./styles.module.css";

export default function InventoryLoading() {
  return (
    <section className={styles.container}>
      <p className={styles.stateText}>Carregando inventário...</p>
    </section>
  );
}