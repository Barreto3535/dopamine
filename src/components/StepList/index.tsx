import type { TaskStep } from "../../types/task";
import TaskCounter from "../TaskCounter";
import styles from "./styles.module.css";

interface StepListProps {
  steps: TaskStep[];
  onCompleteStep: (stepId: string) => void;
  onDeleteStep: (stepId: string) => void;
}

export default function StepList({ steps, onCompleteStep, onDeleteStep }: StepListProps) {
  return (
    <section className={styles.card}>
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
                  <button
                    type="button"
                    className={styles.stepActionButton}
                    onClick={() => onCompleteStep(step.id)}
                  >
                    Concluir
                  </button>
                )}

                <button
                  type="button"
                  className={styles.stepDeleteButton}
                  onClick={() => onDeleteStep(step.id)}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}