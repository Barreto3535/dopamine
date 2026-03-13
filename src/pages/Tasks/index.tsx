import { useTasks } from "../../hooks/useTasks";
import PageIntro from "../../components/base/PageIntro";
import Card from "../../components/base/Card";
import Button from "../../components/base/Button";
import Input from "../../components/base/Input";
import Textarea from "../../components/base/Textarea";
import Select from "../../components/base/Select";
import TaskCard from "../../components/complex/TaskCard";
import Badge from "../../components/base/Badge";
import StateHandler from "../../components/base/StateHandler";
import ErrorDisplay from "../../components/base/ErrorDisplay";
import styles from "./styles.module.css";

const ENERGY_OPTIONS = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

export default function Tasks() {
  const {
    tasks,
    loading,
    submitting,
    error,
    createTask,
    setMainTask,
    deleteTask,
    refresh,
  } = useTasks();

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const result = await createTask({
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      energyLevel: formData.get("energyLevel") as "low" | "medium" | "high",
      dueDate: formData.get("dueDate") as string || null,
    });

    if (result.success) {
      event.currentTarget.reset();
    }
  };

  const handleSetMainTask = async (taskId: string) => {
    await setMainTask(taskId);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  return (
    <section className={styles.tasksPage}>
      <PageIntro
        eyebrow="Organização diária"
        title="Suas tarefas"
        subtitle="Crie tarefas simples, escolha sua missão principal e avance um passo por vez."
      />

      <Card>
        <div className={styles.cardHeader}>
          <h2>Nova tarefa</h2>
        </div>

        <form onSubmit={handleCreateTask} className={styles.form}>
          <Input
            name="title"
            label="Título"
            placeholder="Ex: Estudar React"
            disabled={submitting}
            required
          />

          <Textarea
            name="description"
            label="Descrição"
            placeholder="Opcional"
            disabled={submitting}
            rows={3}
          />

          <div className={styles.formRow}>
            <Select
              name="energyLevel"
              label="Energia"
              options={ENERGY_OPTIONS}
              defaultValue="medium"
              disabled={submitting}
            />

            <Input
              name="dueDate"
              label="Prazo"
              type="date"
              disabled={submitting}
            />
          </div>

          <Button type="submit" variant="primary" loading={submitting}>
            Criar tarefa
          </Button>
        </form>
      </Card>

      {error && <ErrorDisplay message={error} />}

      <section className={styles.listSection}>
        <div className={styles.cardHeader}>
          <h2>Lista de tarefas</h2>
          <Badge variant="muted">{tasks.length}</Badge>
        </div>

        <StateHandler loading={loading} isEmpty={tasks.length === 0}>
          <div className={styles.taskList}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSetMainTask={handleSetMainTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </StateHandler>
      </section>
    </section>
  );
}