import styles from "./styles.module.css";

interface StateHandlerProps {
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  children: React.ReactNode;
}

export default function StateHandler({
  loading,
  error,
  isEmpty,
  emptyMessage,
  emptyAction,
  children
}: StateHandlerProps) {
  if (loading) {
    return (
      <div className={styles.stateCard}>
        <p className={styles.stateText}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateCard}>
        <p className={styles.stateError}>Ops! Algo deu errado.</p>
        <p className={styles.stateText}>{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={styles.stateCard}>
        <p className={styles.stateText}>{emptyMessage || "Nenhum item encontrado."}</p>
        {emptyAction && <div className={styles.stateActions}>{emptyAction}</div>}
      </div>
    );
  }

  return <>{children}</>;
}