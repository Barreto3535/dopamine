import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useTaskDetails } from "../../hooks/useTaskDetails";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Badge from "../../components/Badge";
import ProgressBar from "../../components/ProgressBar";
import ErrorDisplay from "../../components/ErrorDisplay";
import StateHandler from "../../components/StateHandler";
import TaskCounter from "../../components/TaskCounter";

function getStatusLabel(status: string) {
  if (status === "completed") return "Concluída";
  if (status === "in_progress") return "Em andamento";
  return "Pendente";
}

function getEnergyLabel(value: string) {
  if (value === "low") return "Baixa energia";
  if (value === "high") return "Alta energia";
  return "Energia média";
}

export default function TaskDetails() {
  const {
    task,
    steps,
    loading,
    submittingStep,
    completingTask,
    error,
    progress,
    createStep,
    completeStep,
    deleteStep,
    completeCurrentTask,
  } = useTaskDetails();

  const handleCreateStep = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("stepTitle") as string;
    
    await createStep(title);
    event.currentTarget.reset();
  };

  if (loading) {
    return (
      <section className={styles.page}>
        <StateHandler loading={true} />
      </section>
    );
  }

  if (!task) {
    return (
      <section className={styles.page}>
        <Card className={styles.stateCard}>
          <p className={styles.errorText}>Tarefa não encontrada.</p>
          <Button variant="primary" as={Link} to="/tasks">
            Voltar para tarefas
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.topBar}>
        <Button variant="ghost" as={Link} to="/tasks">
          ← Voltar para tarefas
        </Button>
      </div>

      <Card className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div className={styles.heroMeta}>
            <Badge variant="muted">{getStatusLabel(task.status)}</Badge>
            {task.is_main_task && (
              <Badge variant="success">Missão principal</Badge>
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
          <Badge variant="muted">{getEnergyLabel(task.energy_level)}</Badge>
          <Badge variant="muted">
            {task.due_date
              ? `Prazo: ${new Date(task.due_date).toLocaleDateString("pt-BR")}`
              : "Sem prazo"}
          </Badge>
          <Badge variant="muted">{task.xp_reward} XP</Badge>
        </div>

        <div className={styles.progressBlock}>
          <div className={styles.progressInfo}>
            <span>Progresso</span>
            <strong>{progress}%</strong>
          </div>
          <ProgressBar progress={progress} />
        </div>

        {task.status !== "completed" && (
          <Button
            variant="primary"
            onClick={completeCurrentTask}
            loading={completingTask}
          >
            Concluir tarefa
          </Button>
        )}
      </Card>

      {error && <ErrorDisplay message={error} />}

      <div className={styles.grid}>
        <Card>
          <div className={styles.cardHeader}>
            <h2>Adicionar subtarefa</h2>
          </div>

          <form onSubmit={handleCreateStep} className={styles.form}>
            <Input
              name="stepTitle"
              label="Título da subtarefa"
              placeholder="Ex: Abrir material do curso"
              disabled={submittingStep}
              required
            />

            <Button type="submit" variant="secondary" loading={submittingStep}>
              Adicionar subtarefa
            </Button>
          </form>
        </Card>

        <Card>
          <div className={styles.cardHeader}>
            <h2>Subtarefas</h2>
            <TaskCounter count={steps.length} />
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
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => completeStep(step.id)}
                      >
                        Concluir
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => deleteStep(step.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}