import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  createTask,
  deleteTask,
  listTasks,
  setMainTask,
} from "../../services/tasksService";
import type { Task, TaskEnergyLevel } from "../../types/task";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [energyLevel, setEnergyLevel] = useState<TaskEnergyLevel>("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);

      const data = await listTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as tarefas."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const newTask = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        energy_level: energyLevel,
        due_date: dueDate || null,
      });

      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
      setEnergyLevel("medium");
      setDueDate("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível criar a tarefa."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetMainTask(taskId: string) {
    try {
      setError(null);
      await setMainTask(taskId);
      await loadTasks();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível definir a missão principal."
      );
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      setError(null);
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível excluir a tarefa."
      );
    }
  }

  function getEnergyLabel(value: TaskEnergyLevel) {
    if (value === "low") return "Baixa energia";
    if (value === "high") return "Alta energia";
    return "Energia média";
  }

  function getStatusLabel(status: Task["status"]) {
    if (status === "completed") return "Concluída";
    if (status === "in_progress") return "Em andamento";
    return "Pendente";
  }

  return (
    <section className={styles.tasksPage}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Organização diária</p>
          <h1 className={styles.title}>Suas tarefas</h1>
          <p className={styles.subtitle}>
            Crie tarefas simples, escolha sua missão principal e avance um passo
            por vez.
          </p>
        </div>
      </header>

      <section className={styles.formCard}>
        <div className={styles.cardHeader}>
          <h2>Nova tarefa</h2>
        </div>

        <form onSubmit={handleCreateTask} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              placeholder="Ex: Estudar React"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              placeholder="Opcional"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={submitting}
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label htmlFor="energyLevel">Energia</label>
              <select
                id="energyLevel"
                value={energyLevel}
                onChange={(event) =>
                  setEnergyLevel(event.target.value as TaskEnergyLevel)
                }
                disabled={submitting}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate">Prazo</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={submitting}
          >
            {submitting ? "Criando..." : "Criar tarefa"}
          </button>
        </form>
      </section>

      {error && (
        <div className={styles.errorBox}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <section className={styles.listSection}>
        <div className={styles.cardHeader}>
          <h2>Lista de tarefas</h2>
          <span className={styles.counter}>{tasks.length}</span>
        </div>

        {loading ? (
          <div className={styles.stateCard}>Carregando tarefas...</div>
        ) : tasks.length === 0 ? (
          <div className={styles.emptyCard}>
            <h3>Nenhuma tarefa ainda</h3>
            <p>
              Crie sua primeira tarefa para começar a organizar seu dia com mais
              clareza.
            </p>
          </div>
        ) : (
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <article key={task.id} className={styles.taskCard}>
                <div className={styles.taskTop}>
                  <div className={styles.taskMeta}>
                    <span className={styles.statusBadge}>
                      {getStatusLabel(task.status)}
                    </span>

                    {task.is_main_task && (
                      <span className={styles.mainBadge}>Missão principal</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Excluir
                  </button>
                </div>

                <h3 className={styles.taskTitle}>{task.title}</h3>

                <p className={styles.taskDescription}>
                  {task.description?.trim()
                    ? task.description
                    : "Sem descrição adicional."}
                </p>

                <div className={styles.taskInfoRow}>
                  <span className={styles.infoPill}>
                    {getEnergyLabel(task.energy_level)}
                  </span>

                  <span className={styles.infoPill}>
                    {task.due_date
                      ? `Prazo: ${new Date(task.due_date).toLocaleDateString(
                        "pt-BR"
                      )}`
                      : "Sem prazo"}
                  </span>

                  <span className={styles.infoPill}>{task.xp_reward} XP</span>
                </div>

                {!task.is_main_task && (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => handleSetMainTask(task.id)}
                  >
                    Definir como missão principal
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}