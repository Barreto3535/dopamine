import styles from "./styles.module.css";
import type { Task } from "../../types/task";

interface TaskSelectorProps {
  tasks: Task[];
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function TaskSelector({
  tasks,
  selectedTaskId,
  onSelectTask,
  disabled = false,
  loading = false,
}: TaskSelectorProps) {
  if (loading) {
    return <div className={styles.stateBox}>Carregando tarefas...</div>;
  }

  if (tasks.length === 0) {
    return <div className={styles.stateBox}>Nenhuma tarefa disponível para foco.</div>;
  }

  return (
    <div className={styles.field}>
      <label>Tarefa</label>
      <select
        value={selectedTaskId}
        onChange={(e) => onSelectTask(e.target.value)}
        disabled={disabled}
      >
        <option value="">Selecione</option>
        {tasks.map((task) => (
          <option key={task.id} value={task.id}>
            {task.title}
          </option>
        ))}
      </select>
    </div>
  );
}