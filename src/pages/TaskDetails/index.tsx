import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./styles.module.css";
import {
  completeTask,
  completeTaskStep,
  createTaskStep,
  deleteTaskStep,
  getTaskById,
  listTaskSteps,
} from "../../services/tasksService";
import type { Task, TaskStep } from "../../types/task";

export default function TaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingStep, setSubmittingStep] = useState(false);
  const [completingTask, setCompletingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stepTitle, setStepTitle] = useState("");

  useEffect(() => {
    async function loadPage() {
      if (!taskId) {
        setError("Tarefa não encontrada.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [taskData, stepsData] = await Promise.all([
          getTaskById(taskId),
          listTaskSteps(taskId),
        ]);

        if (!taskData) {
          setError("Tarefa não encontrada.");
          setLoading(false);
          return;
        }

        setTask(taskData);
        setSteps(stepsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar a tarefa."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [taskId]);

  const progress = useMemo(() => {
    if (steps.length === 0) {
      return task?.status === "completed" ? 100 : 0;
    }

    const completed = steps.filter((step) => step.is_completed).length;
    return Math.round((completed / steps.length) * 100);
  }, [steps, task?.status]);

  async function reloadTaskData() {
    if (!taskId) return;

    const [taskData, stepsData] = await Promise.all([
      getTaskById(taskId),
      listTaskSteps(taskId),
    ]);

    setTask(taskData);
    setSteps(stepsData);
  }

  async function handleCreateStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!taskId || !stepTitle.trim()) return;

    try {
      setSubmittingStep(true);
      setError(null);

      const newStep = await createTaskStep({
        task_id: taskId,
        title: stepTitle.trim(),
        order_index: steps.length,
      });

      setSteps((prev) => [...prev, newStep]);
      setStepTitle("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar a subtarefa."
      );
    } finally {
      setSubmittingStep(false);
    }
  }

  async function handleCompleteStep(stepId: string) {
    try {
      setError(null);
      await completeTaskStep(stepId);
      await reloadTaskData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível concluir a subtarefa."
      );
    }
  }

  async function handleDeleteStep(stepId: string) {
    try {
      setError(null);
      await deleteTaskStep(stepId);
      setSteps((prev) => prev.filter((step) => step.id !== stepId));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir a subtarefa."
      );
    }
  }

  async function handleCompleteTask() {
    if (!taskId) return;

    try {
      setCompletingTask(true);
      setError(null);

      await completeTask(taskId);
      await reloadTaskData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível concluir a tarefa."
      );
    } finally {
      setCompletingTask(false);
    }
  }

  function getStatusLabel(status: Task["status"]) {
    if (status === "completed") return "Concluída";
    if (status === "in_progress") return "Em andamento";
    return "Pendente";
  }

  function getEnergyLabel(value: Task["energy_level"]) {
    if (value === "low") return "Baixa energia";
    if (value === "high") return "Alta energia";
    return "Energia média";
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.stateCard}>Carregando tarefa...</div>
      </section>
    );
  }

  if (error && !task) {
    return (
      <section className={styles.page}>
        <div className={styles.stateCard}>
          <p className={styles.errorText}>{error}</p>
          <Link to="/tasks" className={styles.backLink}>
            Voltar para tarefas
          </Link>
        </div>
      </section>
    );
  }

  if (!task) {
    return (
      <section className={styles.page}>
        <div className={styles.stateCard}>
          <p className={styles.errorText}>Tarefa não encontrada.</p>
          <Link to="/tasks" className={styles.backLink}>
            Voltar para tarefas
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/tasks" className={styles.backLink}>
          ← Voltar para tarefas
        </Link>
      </div>

      <div className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div className={styles.heroMeta}>
            <span className={styles.statusBadge}>{getStatusLabel(task.status)}</span>
            {task.is_main_task && (
              <span className={styles.mainBadge}>Missão principal</span>
            )}
          </div>
        </div>

        <h1 className={styles.title}>{task.title}</h1>

        <p className={styles.description}>
          {task.description?.trim()
            ? task.description
            : "Sem descrição adicional para essa tarefa."}
        </p>

        <div className={styles.infoRow}>
          <span className={styles.infoPill}>{getEnergyLabel(task.energy_level)}</span>
          <span className={styles.infoPill}>
            {task.due_date
              ? `Prazo: ${new Date(task.due_date).toLocaleDateString("pt-BR")}`
              : "Sem prazo"}
          </span>
          <span className={styles.infoPill}>{task.xp_reward} XP</span>
        </div>

        <div className={styles.progressBlock}>
          <div className={styles.progressInfo}>
            <span>Progresso</span>
            <strong>{progress}%</strong>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {task.status !== "completed" && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleCompleteTask}
            disabled={completingTask}
          >
            {completingTask ? "Concluindo..." : "Concluir tarefa"}
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorBox}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Adicionar subtarefa</h2>
          </div>

          <form onSubmit={handleCreateStep} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="stepTitle">Título da subtarefa</label>
              <input
                id="stepTitle"
                type="text"
                placeholder="Ex: Abrir material do curso"
                value={stepTitle}
                onChange={(event) => setStepTitle(event.target.value)}
                disabled={submittingStep}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.secondaryButton}
              disabled={submittingStep}
            >
              {submittingStep ? "Adicionando..." : "Adicionar subtarefa"}
            </button>
          </form>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Subtarefas</h2>
            <span className={styles.counter}>{steps.length}</span>
          </div>

          {steps.length === 0 ? (
            <div className={styles.emptyBox}>
              Ainda não há subtarefas. Quebre essa tarefa em passos menores para
              facilitar o começo.
            </div>
          ) : (
            <ul className={styles.stepsList}>
              {steps.map((step) => (
                <li key={step.id} className={styles.stepItem}>
                  <div className={styles.stepContent}>
                    <div
                      className={`${styles.stepIndicator} ${step.is_completed ? styles.stepDone : ""
                        }`}
                    />
                    <div>
                      <strong className={styles.stepTitle}>{step.title}</strong>
                      <p className={styles.stepStatus}>
                        {step.is_completed ? "Concluída" : "Pendente"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.stepActions}>
                    {!step.is_completed && (
                      <button
                        type="button"
                        className={styles.stepActionButton}
                        onClick={() => handleCompleteStep(step.id)}
                      >
                        Concluir
                      </button>
                    )}

                    <button
                      type="button"
                      className={styles.stepDeleteButton}
                      onClick={() => handleDeleteStep(step.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}