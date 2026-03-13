import styles from "./styles.module.css";

export default function TaskEmptyState() {
  return (
    <div className={styles.emptyCard}>
      <h3>Nenhuma tarefa ainda</h3>
      <p>
        Crie sua primeira tarefa para começar a organizar seu dia com mais
        clareza.
      </p>
    </div>
  );
}