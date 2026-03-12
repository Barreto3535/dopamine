import styles from "./styles.module.css";

type Props = {
  icon?: string;
  title: string;
  description: string;
};

export default function ActiveEffectBanner({
  icon = "⚡",
  title,
  description,
}: Props) {
  return (
    <div className={styles.banner}>
      <div className={styles.icon}>{icon}</div>

      <div>
        <strong className={styles.title}>{title}</strong>
        <p className={styles.text}>{description}</p>
      </div>
    </div>
  );
}