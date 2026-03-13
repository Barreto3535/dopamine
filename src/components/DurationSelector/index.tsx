import styles from "./styles.module.css";

interface DurationSelectorProps {
  durationMinutes: number;
  onDurationChange: (minutes: number) => void;
  disabled?: boolean;
  options?: number[];
}

const DEFAULT_OPTIONS = [15, 25, 35];

export default function DurationSelector({
  durationMinutes,
  onDurationChange,
  disabled = false,
  options = DEFAULT_OPTIONS,
}: DurationSelectorProps) {
  return (
    <div className={styles.field}>
      <label>Duração</label>
      <div className={styles.durationButtons}>
        {options.map((minutes) => (
          <button
            key={minutes}
            type="button"
            className={
              durationMinutes === minutes
                ? `${styles.durationButton} ${styles.durationButtonActive}`
                : styles.durationButton
            }
            onClick={() => onDurationChange(minutes)}
            disabled={disabled}
          >
            {minutes} min
          </button>
        ))}
      </div>
    </div>
  );
}