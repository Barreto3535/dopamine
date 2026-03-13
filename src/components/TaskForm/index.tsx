import { useState } from "react";
import type { TaskEnergyLevel } from "../../types/task";
import styles from "./styles.module.css";

interface TaskFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    energyLevel: TaskEnergyLevel;
    dueDate: string;
  }) => Promise<void>;
  submitting?: boolean;
}

export default function TaskForm({ onSubmit, submitting = false }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [energyLevel, setEnergyLevel] = useState<TaskEnergyLevel>("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      energyLevel,
      dueDate,
    });

    setTitle("");
    setDescription("");
    setEnergyLevel("medium");
    setDueDate("");
  };

  return (
    <section className={styles.formCard}>
      <div className={styles.cardHeader}>
        <h2>Nova tarefa</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            placeholder="Ex: Estudar React"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            onChange={(e) => setDescription(e.target.value)}
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
              onChange={(e) => setEnergyLevel(e.target.value as TaskEnergyLevel)}
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
              onChange={(e) => setDueDate(e.target.value)}
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
  );
}