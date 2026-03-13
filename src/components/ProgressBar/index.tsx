import styles from "./styles.module.css";

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: "default" | "mission";
  showXPInfo?: boolean;
  xpLabel?: string;
  xpValue?: number; // 🔥 Volta a ser número
}

export default function ProgressBar({
  progress,
  variant = "default",
  showXPInfo = false,
  xpLabel,
  xpValue
}: ProgressBarProps) {
  return (
    <div className={styles.progressContainer}>
      {showXPInfo && (
        <div className={styles.xpInfo}>
          <span>{xpLabel}</span>
          <strong>{xpValue}</strong> {/* 🔥 Mostra só o número */}
        </div>
      )}
      <div className={variant === "mission" ? styles.missionProgressBar : styles.progressBar}>
        <div
          className={variant === "mission" ? styles.missionProgressFill : styles.progressFill}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}