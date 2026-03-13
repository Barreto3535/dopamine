import styles from "./styles.module.css";

interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
}

export default function StatCard({ label, value, description }: StatCardProps) {
  return (
    <article className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <strong className={styles.statValue}>{value}</strong>
      <p className={styles.statText}>{description}</p>
    </article>
  );
}