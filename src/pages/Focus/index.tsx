import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.css";
import { listTasks } from "../../services/tasksService";
import { registerFocusSession } from "../../services/focusSessionsService";
import type { Task } from "../../types/task";

const DEFAULT_MINUTES = 25;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export default function Focus() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_MINUTES);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [remainingSeconds, setRemainingSeconds] = useState(
    DEFAULT_MINUTES * 60
  );

  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [sessionFinished, setSessionFinished] = useState(false);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        setError(null);

        const data = await listTasks();

        const openTasks = data.filter((task) => task.status !== "completed");

        setTasks(openTasks);

        const mainTask = openTasks.find((task) => task.is_main_task);

        if (mainTask) {
          setSelectedTaskId(mainTask.id);
        } else if (openTasks.length > 0) {
          setSelectedTaskId(openTasks[0].id);
        }
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

    loadTasks();

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
          }

          setIsRunning(false);
          setIsPaused(false);
          setSessionFinished(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  function resetTimer(minutes = durationMinutes) {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    setIsRunning(false);
    setIsPaused(false);
    setStartedAt(null);
    setSessionFinished(false);

    setRemainingSeconds(minutes * 60);
  }

  function handleDurationChange(minutes: number) {
    setDurationMinutes(minutes);
    resetTimer(minutes);
  }

  function handleStart() {
    setError(null);
    setSessionFinished(false);

    if (!selectedTaskId) {
      setError("Selecione uma tarefa antes de iniciar o foco.");
      return;
    }

    if (!startedAt) {
      setStartedAt(new Date().toISOString());
    }

    setIsRunning(true);
    setIsPaused(false);
  }

  function handlePause() {
    setIsPaused(true);
    setIsRunning(false);

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
  }

  function handleResume() {
    setIsPaused(false);
    setIsRunning(true);
  }

  async function handleCancel() {
    if (!startedAt) {
      resetTimer();
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await registerFocusSession({
        task_id: selectedTaskId || null,
        duration_minutes: durationMinutes,
        actual_duration_minutes: Math.max(
          0,
          Math.round((durationMinutes * 60 - remainingSeconds) / 60)
        ),
        status: "cancelled",
        started_at: startedAt,
        ended_at: new Date().toISOString(),
        xp_earned: 0,
      });

      resetTimer();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível cancelar a sessão."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    try {
      setSaving(true);
      setError(null);

      const sessionStart = startedAt ?? new Date().toISOString();

      await registerFocusSession({
        task_id: selectedTaskId || null,
        duration_minutes: durationMinutes,
        actual_duration_minutes: durationMinutes,
        status: "completed",
        started_at: sessionStart,
        ended_at: new Date().toISOString(),
        xp_earned: 5,
      });

      resetTimer();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível registrar a sessão."
      );
    } finally {
      setSaving(false);
    }
  }

  const progressPercent =
    ((durationMinutes * 60 - remainingSeconds) / (durationMinutes * 60)) * 100;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Sessão guiada</p>
        <h1 className={styles.title}>Modo foco</h1>
        <p className={styles.subtitle}>
          Escolha uma tarefa e avance um passo de cada vez.
        </p>
      </header>

      {error && (
        <div className={styles.errorBox}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Configurar foco</h2>
          </div>

          {loading ? (
            <div className={styles.stateBox}>Carregando tarefas...</div>
          ) : tasks.length === 0 ? (
            <div className={styles.stateBox}>
              Nenhuma tarefa disponível para foco.
            </div>
          ) : (
            <div className={styles.formArea}>
              <div className={styles.field}>
                <label>Tarefa</label>

                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  disabled={isRunning || saving}
                >
                  <option value="">Selecione</option>

                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Duração</label>

                <div className={styles.durationButtons}>
                  {[15, 25, 35].map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      className={
                        durationMinutes === minutes
                          ? `${styles.durationButton} ${styles.durationButtonActive}`
                          : styles.durationButton
                      }
                      onClick={() => handleDurationChange(minutes)}
                      disabled={isRunning || saving}
                    >
                      {minutes} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className={`${styles.card} ${styles.timerCard}`}>
          <strong className={styles.timerText}>
            {formatTime(remainingSeconds)}
          </strong>

          <p className={styles.timerTask}>
            {selectedTask ? selectedTask.title : "Escolha uma tarefa"}
          </p>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.max(progressPercent, 0)}%` }}
            />
          </div>

          <div className={styles.actions}>
            {!isRunning && !isPaused && !sessionFinished && (
              <button
                className={styles.primaryButton}
                onClick={handleStart}
                disabled={loading || saving || tasks.length === 0}
              >
                Iniciar foco
              </button>
            )}

            {isRunning && (
              <>
                <button
                  className={styles.secondaryButton}
                  onClick={handlePause}
                  disabled={saving}
                >
                  Pausar
                </button>

                <button
                  className={styles.ghostButton}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancelar
                </button>
              </>
            )}

            {isPaused && (
              <>
                <button
                  className={styles.primaryButton}
                  onClick={handleResume}
                  disabled={saving}
                >
                  Retomar
                </button>

                <button
                  className={styles.ghostButton}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Encerrar
                </button>
              </>
            )}

            {sessionFinished && (
              <button
                className={styles.primaryButton}
                onClick={handleComplete}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Concluir sessão"}
              </button>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}