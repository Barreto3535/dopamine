import styles from "./styles.module.css";

export default function InventoryEmpty() {
  return (
    <div className={styles.emptyCard}>
      <h2>Nada por aqui ainda</h2>
      <p>
        Você ainda não possui itens no inventário. Compre algo na loja para
        começar a montar sua coleção.
      </p>
    </div>
  );
}