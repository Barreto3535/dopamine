import styles from "./styles.module.css";

interface FocusActionsProps {
  isRunning: boolean;
  isPaused: boolean;
  sessionFinished: boolean;
  hasActiveSession: boolean;
  saving: boolean;
  loading: boolean;
  tasksEmpty: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

export default function FocusActions({
  isRunning,
  isPaused,
  sessionFinished,
  hasActiveSession,
  saving,
  loading,
  tasksEmpty,
  onStart,
  onPause,
  onResume,
  onCancel,
  onComplete,
}: FocusActionsProps) {
  if (!isRunning && !isPaused && !sessionFinished && !hasActiveSession) {
    return (
      <button
        className={styles.primaryButton}
        onClick={onStart}
        disabled={loading || saving || tasksEmpty}
      >
        Iniciar foco
      </button>
    );
  }

  if (isRunning) {
    return (
      <>
        <button className={styles.secondaryButton} onClick={onPause} disabled={saving}>
          Pausar
        </button>
        <button className={styles.ghostButton} onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </>
    );
  }

  if (isPaused) {
    return (
      <>
        <button className={styles.primaryButton} onClick={onResume} disabled={saving}>
          Retomar
        </button>
        <button className={styles.ghostButton} onClick={onCancel} disabled={saving}>
          Encerrar
        </button>
      </>
    );
  }

  if (sessionFinished) {
    return (
      <button className={styles.primaryButton} onClick={onComplete} disabled={saving}>
        {saving ? "Salvando..." : "Concluir sessão"}
      </button>
    );
  }

  return null;
}