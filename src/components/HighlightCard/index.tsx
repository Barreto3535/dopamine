import styles from "./styles.module.css";

interface HighlightCardProps {
  label: string;
  value: number | string;
  description: string;
}

export default function HighlightCard({ label, value, description }: HighlightCardProps) {
  return (
    <article className={styles.highlightCard}>
      <span className={styles.highlightLabel}>{label}</span>
      <strong className={styles.highlightValue}>{value}</strong>
      <p className={styles.highlightText}>{description}</p>
    </article>
  );
}