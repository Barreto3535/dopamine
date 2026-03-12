import styles from "./styles.module.css";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
};

export default function PageIntro({
  eyebrow,
  title,
  subtitle,
  rightSlot,
}: Props) {
  return (
    <header className={styles.header}>
      <div>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
    </header>
  );
}