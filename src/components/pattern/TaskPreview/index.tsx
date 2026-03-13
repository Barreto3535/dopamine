import styles from "./styles.module.css";
import type { Task } from "../../../types/task";

interface TaskPreviewProps {
  task: Task | null;
}

export default function TaskPreview({ task }: TaskPreviewProps) {
  if (!task) return null;

  return (
    <div className={styles.taskPreview}>
      <span className={styles.previewTag}>Tarefa atual</span>
      <strong className={styles.taskTitle}>{task.title}</strong>
      <p className={styles.taskDescription}>
        {task.description?.trim()
          ? task.description
          : "Sem descrição adicional."}
      </p>
    </div>
  );
}