import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.css";
import { listTasks } from "../../services/tasksService";
import { registerFocusSession } from "../../services/focusSessionsService";
import type { Task } from "../../types/task";
import type { ActiveFocusSession } from "../../types/activeFocusSession";
import {
  clearActiveFocusSession,
  createActiveFocusSession,
  getActiveFocusSession,
  getRemainingSeconds,
  pauseActiveFocusSession,
  resumeActiveFocusSession,
  saveActiveFocusSession,
} from "../../services/activeFocusSessionService";
import {
  listMyActiveEffects,
  type ActiveEffect,
} from "../../services/shopService";
import PageIntro from "../../components/PageIntro";
import ActiveEffectBanner from "../../components/ActiveEffectBanner";
import FocusTimerCard from "../../components/FocusTimerCard";

const DEFAULT_MINUTES = 25;
const DEFAULT_TITLE = "FocusQuest";

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
  const [sessionFinished, setSessionFinished] = useState(false);
  const [activeSession, setActiveSession] = useState<ActiveFocusSession | null>(
    null
  );
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadFocusPage() {
      try {
        setLoading(true);
        setError(null);

        const [tasksData, effectsData] = await Promise.all([
          listTasks(),
          listMyActiveEffects(),
        ]);

        const openTasks = tasksData.filter((task) => task.status !== "completed");

        setTasks(openTasks);
        setActiveEffects(effectsData);

        const storedSession = getActiveFocusSession();

        if (storedSession) {
          setActiveSession(storedSession);
          setSelectedTaskId(storedSession.taskId ?? "");
          setDurationMinutes(storedSession.durationMinutes);

          const remaining = getRemainingSeconds(storedSession);
          setRemainingSeconds(remaining);

          if (remaining <= 0 && !storedSession.isPaused) {
            setIsRunning(false);
            setIsPaused(false);
            setSessionFinished(true);
          } else {
            setIsRunning(!storedSession.isPaused);
            setIsPaused(storedSession.isPaused);
          }

          return;
        }

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

    loadFocusPage();

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeSession) {
      document.title = DEFAULT_TITLE;
      return;
    }

    if (sessionFinished) {
      document.title = `Concluído • ${DEFAULT_TITLE}`;
      return;
    }

    document.title = `${formatTime(remainingSeconds)} • ${DEFAULT_TITLE}`;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [activeSession, remainingSeconds, sessionFinished]);

  useEffect(() => {
    if (!activeSession || !isRunning || isPaused) return;

    intervalRef.current = window.setInterval(() => {
      const stored = getActiveFocusSession();

      if (!stored) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }

        setIsRunning(false);
        setIsPaused(false);
        setActiveSession(null);
        setRemainingSeconds(durationMinutes * 60);
        return;
      }

      const remaining = getRemainingSeconds(stored);

      if (remaining <= 0) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }

        setRemainingSeconds(0);
        setIsRunning(false);
        setIsPaused(false);
        setSessionFinished(true);
        return;
      }

      setRemainingSeconds(remaining);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [activeSession, isRunning, isPaused, durationMinutes]);

  const selectedTask = useMemo(() => {
    if (activeSession?.taskId) {
      return tasks.find((task) => task.id === activeSession.taskId) ?? null;
    }

    return tasks.find((task) => task.id === selectedTaskId) ?? null;
  }, [tasks, selectedTaskId, activeSession]);

  const activeFocusBoost = activeEffects.find(
    (effect) => effect.effect_type === "focus_boost"
  );

  async function reloadActiveEffects() {
    try {
      const effects = await listMyActiveEffects();
      setActiveEffects(effects);
    } catch (err) {
      console.error("Erro ao recarregar efeitos ativos:", err);
    }
  }

  function resetTimer(minutes = durationMinutes) {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    clearActiveFocusSession();
    setActiveSession(null);
    setIsRunning(false);
    setIsPaused(false);
    setSessionFinished(false);
    setRemainingSeconds(minutes * 60);
    document.title = DEFAULT_TITLE;
  }

  function handleDurationChange(minutes: number) {
    if (activeSession) return;

    setDurationMinutes(minutes);
    setRemainingSeconds(minutes * 60);
  }

  function handleStart() {
    setError(null);
    setSessionFinished(false);

    if (!selectedTaskId) {
      setError("Selecione uma tarefa antes de iniciar o foco.");
      return;
    }

    const session = createActiveFocusSession({
      taskId: selectedTaskId,
      taskTitle: selectedTask?.title ?? null,
      durationMinutes,
    });

    saveActiveFocusSession(session);
    setActiveSession(session);
    setRemainingSeconds(durationMinutes * 60);
    setIsRunning(true);
    setIsPaused(false);
  }

  function handlePause() {
    if (!activeSession) return;

    const updated = pauseActiveFocusSession(activeSession);

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    setActiveSession(updated);
    setRemainingSeconds(updated.remainingSecondsWhenPaused ?? remainingSeconds);
    setIsPaused(true);
    setIsRunning(false);
  }

  function handleResume() {
    if (!activeSession) return;

    const updated = resumeActiveFocusSession(activeSession);

    setActiveSession(updated);
    setRemainingSeconds(getRemainingSeconds(updated));
    setIsPaused(false);
    setIsRunning(true);
  }

  async function handleCancel() {
    if (!activeSession) {
      resetTimer();
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await registerFocusSession({
        task_id: activeSession.taskId,
        duration_minutes: activeSession.durationMinutes,
        actual_duration_minutes: Math.max(
          0,
          Math.round(
            (activeSession.durationMinutes * 60 - remainingSeconds) / 60
          )
        ),
        status: "cancelled",
        started_at: activeSession.startedAt,
        ended_at: new Date().toISOString(),
        xp_earned: 0,
      });

      resetTimer(activeSession.durationMinutes);
      await reloadActiveEffects();
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
    if (!activeSession) return;

    try {
      setSaving(true);
      setError(null);

      await registerFocusSession({
        task_id: activeSession.taskId,
        duration_minutes: activeSession.durationMinutes,
        actual_duration_minutes: activeSession.durationMinutes,
        status: "completed",
        started_at: activeSession.startedAt,
        ended_at: new Date().toISOString(),
        xp_earned: 5,
      });

      resetTimer(activeSession.durationMinutes);
      await reloadActiveEffects();
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
      <PageIntro
        eyebrow="Sessão guiada"
        title="Modo foco"
        subtitle="Escolha uma tarefa e avance um passo de cada vez."
      />

      {activeFocusBoost && (
        <ActiveEffectBanner
          title="Focus Boost ativo"
          description={`Sua próxima sessão concluída ganhará +${activeFocusBoost.effect_value}% XP.`}
        />
      )}

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
                  value={activeSession?.taskId ?? selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  disabled={isRunning || isPaused || saving || !!activeSession}
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
                      disabled={isRunning || isPaused || saving || !!activeSession}
                    >
                      {minutes} min
                    </button>
                  ))}
                </div>
              </div>

              {selectedTask && (
                <div className={styles.taskPreview}>
                  <span className={styles.previewTag}>Tarefa atual</span>
                  <strong>{selectedTask.title}</strong>
                  <p>
                    {selectedTask.description?.trim()
                      ? selectedTask.description
                      : "Sem descrição adicional."}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        <FocusTimerCard
          variant="full"
          statusLabel={activeSession ? "Foco em andamento" : "Foco ativo"}
          timeText={formatTime(remainingSeconds)}
          taskTitle={selectedTask ? selectedTask.title : "Escolha uma tarefa"}
          progressPercent={progressPercent}
          helperText="Ao concluir a sessão, ela será registrada no seu histórico e somará XP ao seu progresso."
          actions={
            <>
              {!isRunning && !isPaused && !sessionFinished && !activeSession && (
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
            </>
          }
        />
      </div>
    </section>
  );
}