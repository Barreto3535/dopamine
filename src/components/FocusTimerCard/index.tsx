import styles from "./styles.module.css";

type Props = {
  variant?: "full" | "compact";
  statusLabel: string;
  timeText: string;
  taskTitle?: string;
  progressPercent: number;
  actions?: React.ReactNode;
  helperText?: string;
};

export default function FocusTimerCard({
  variant = "full",
  statusLabel,
  timeText,
  taskTitle,
  progressPercent,
  actions,
  helperText,
}: Props) {
  const isCompact = variant === "compact";

  return (
    <section
      className={
        isCompact ? `${styles.card} ${styles.compact}` : `${styles.card} ${styles.full}`
      }
    >
      <div className={styles.header}>
        <span className={styles.tag}>{statusLabel}</span>
      </div>

      {isCompact ? (
        <div className={styles.compactBody}>
          <strong className={styles.compactTime}>{timeText}</strong>
          <p className={styles.compactTask}>
            {taskTitle ?? "Escolha uma tarefa"}
          </p>
        </div>
      ) : (
        <div className={styles.timerCircle}>
          <div className={styles.timerInner}>
            <strong className={styles.timerText}>{timeText}</strong>
            <span className={styles.timerSubtext}>
              {taskTitle ?? "Escolha uma tarefa"}
            </span>
          </div>
        </div>
      )}

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.max(progressPercent, 0)}%` }}
        />
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </section>
  );
}