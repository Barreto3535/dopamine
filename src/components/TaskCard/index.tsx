import { Link } from "react-router-dom";
import Badge from "../Badge";
import type { Task } from "../../types/task";
import styles from "./styles.module.css";

interface TaskCardProps {
  task: Task;
  onSetMainTask: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

function getEnergyLabel(value: Task["energy_level"]) {
  if (value === "low") return "Baixa energia";
  if (value === "high") return "Alta energia";
  return "Energia média";
}

function getStatusLabel(status: Task["status"]) {
  if (status === "completed") return "Concluída";
  if (status === "in_progress") return "Em andamento";
  return "Pendente";
}

export default function TaskCard({ task, onSetMainTask, onDelete }: TaskCardProps) {
  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      onDelete(task.id);
    }
  };

  const handleSetMain = () => {
    onSetMainTask(task.id);
  };

  return (
    <article className={styles.taskCard}>
      <div className={styles.taskTop}>
        <div className={styles.taskMeta}>
          <Badge variant="muted">{getStatusLabel(task.status)}</Badge>

          {task.is_main_task && (
            <Badge variant="success">Missão principal</Badge>
          )}
        </div>

        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          Excluir
        </button>
      </div>

      <Link to={`/tasks/${task.id}`} className={styles.taskTitleLink}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
      </Link>

      <p className={styles.taskDescription}>
        {task.description?.trim()
          ? task.description
          : "Sem descrição adicional."}
      </p>

      <div className={styles.taskInfoRow}>
        <Badge variant="muted">{getEnergyLabel(task.energy_level)}</Badge>

        <Badge variant="muted">
          {task.due_date
            ? `Prazo: ${new Date(task.due_date).toLocaleDateString("pt-BR")}`
            : "Sem prazo"}
        </Badge>

        <Badge variant="muted">{task.xp_reward} XP</Badge>
      </div>

      {!task.is_main_task && (
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleSetMain}
        >
          Definir como missão principal
        </button>
      )}
    </article>
  );
}