import styles from "./styles.module.css";

interface ErrorDisplayProps {
  message: string;
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  return <div className={styles.error}>{message}</div>;
}