import styles from "./styles.module.css";

type BadgeVariant = "level" | "streak" | "success" | "active" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  icon?: string;
}

export default function Badge({ children, variant = "muted", icon }: BadgeProps) {
  const variantClass = {
    level: styles.levelBadge,
    streak: styles.streakBadge,
    success: styles.successBadge,
    active: styles.activeBadge,
    muted: styles.mutedBadge
  }[variant];

  return (
    <span className={`${styles.badge} ${variantClass}`}>
      {icon && <span className={styles.badgeIcon}>{icon}</span>}
      {children}
    </span>
  );
}