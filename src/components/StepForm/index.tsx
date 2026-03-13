import { useState } from "react";
import styles from "./styles.module.css";

interface StepFormProps {
  onSubmit: (title: string) => Promise<void>;
  submitting?: boolean;
}

export default function StepForm({ onSubmit, submitting = false }: StepFormProps) {
  const [stepTitle, setStepTitle] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stepTitle.trim()) return;

    await onSubmit(stepTitle.trim());
    setStepTitle("");
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Adicionar subtarefa</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="stepTitle">Título da subtarefa</label>
          <input
            id="stepTitle"
            type="text"
            placeholder="Ex: Abrir material do curso"
            value={stepTitle}
            onChange={(e) => setStepTitle(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.secondaryButton}
          disabled={submitting}
        >
          {submitting ? "Adicionando..." : "Adicionar subtarefa"}
        </button>
      </form>
    </section>
  );
}