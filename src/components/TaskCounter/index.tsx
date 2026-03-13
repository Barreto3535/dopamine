import styles from "./styles.module.css";

interface TaskCounterProps {
  count: number;
}

export default function TaskCounter({ count }: TaskCounterProps) {
  return <span className={styles.counter}>{count}</span>;
}