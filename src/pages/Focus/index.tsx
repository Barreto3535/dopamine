import { useEffect } from "react";
import styles from "./styles.module.css";
import { useFocusData } from "../../hooks/useFocusData";
import { useFocusTimer } from "../../hooks/useFocusTimer";
import PageIntro from "../../components/PageIntro";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import ActiveEffectBanner from "../../components/ActiveEffectBanner";
import FocusTimerCard from "../../components/FocusTimerCard";
import TaskPreview from "../../components/TaskPreview";
import ErrorDisplay from "../../components/ErrorDisplay";

const DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "25", label: "25 min" },
  { value: "35", label: "35 min" },
];

export default function Focus() {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    selectedTask,
    activeFocusBoost,
    loading,
    saving,
    error,
    setError,
    registerSession,
  } = useFocusData();

  const {
    isRunning,
    isPaused,
    sessionFinished,
    activeSession,
    remainingSeconds,
    durationMinutes,
    startSession,
    pauseSession,
    resumeSession,
    resetTimer,
    updateDuration,
    formatTime,
    progressPercent,
  } = useFocusTimer();

  useEffect(() => {
    if (activeSession) {
      setSelectedTaskId(activeSession.taskId ?? "");
    }
  }, [activeSession, setSelectedTaskId]);

  const handleStart = () => {
    if (!selectedTaskId) {
      setError("Selecione uma tarefa antes de iniciar o foco.");
      return;
    }
    startSession(selectedTaskId, selectedTask?.title ?? null, durationMinutes);
  };

  const handleCancel = async () => {
    if (!activeSession) {
      resetTimer();
      return;
    }

    try {
      await registerSession({
        taskId: activeSession.taskId,
        durationMinutes: activeSession.durationMinutes,
        actualMinutes: Math.max(
          0,
          Math.round(
            (activeSession.durationMinutes * 60 - remainingSeconds) / 60
          )
        ),
        status: "cancelled",
        startedAt: activeSession.startedAt,
        endedAt: new Date().toISOString(),
      });

      resetTimer(activeSession.durationMinutes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível cancelar a sessão."
      );
    }
  };

  const handleComplete = async () => {
    if (!activeSession) return;

    try {
      await registerSession({
        taskId: activeSession.taskId,
        durationMinutes: activeSession.durationMinutes,
        actualMinutes: activeSession.durationMinutes,
        status: "completed",
        startedAt: activeSession.startedAt,
        endedAt: new Date().toISOString(),
      });

      resetTimer(activeSession.durationMinutes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível registrar a sessão."
      );
    }
  };

  const taskOptions = [
    { value: "", label: "Selecione" },
    ...tasks.map((task) => ({ value: task.id, label: task.title })),
  ];

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

      {error && <ErrorDisplay message={error} />}

      <div className={styles.grid}>
        <Card>
          <div className={styles.cardHeader}>
            <h2>Configurar foco</h2>
          </div>

          <div className={styles.formArea}>
            <Select
              label="Tarefa"
              options={taskOptions}
              value={activeSession?.taskId ?? selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              disabled={isRunning || isPaused || saving || !!activeSession}
            />

            <div className={styles.field}>
              <label>Duração</label>
              <div className={styles.durationButtons}>
                {DURATION_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={durationMinutes === parseInt(option.value) ? "secondary" : "ghost"}
                    onClick={() => updateDuration(parseInt(option.value))}
                    disabled={isRunning || isPaused || saving || !!activeSession}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <TaskPreview task={selectedTask} />
          </div>
        </Card>

        <FocusTimerCard
          variant="full"
          statusLabel={activeSession ? "Foco em andamento" : "Foco ativo"}
          timeText={formatTime(remainingSeconds)}
          taskTitle={selectedTask?.title ?? "Escolha uma tarefa"}
          progressPercent={progressPercent}
          helperText="Ao concluir a sessão, ela será registrada no seu histórico e somará XP ao seu progresso."
          actions={
            <>
              {!isRunning && !isPaused && !sessionFinished && !activeSession && (
                <Button
                  variant="primary"
                  onClick={handleStart}
                  disabled={loading || saving || tasks.length === 0}
                >
                  Iniciar foco
                </Button>
              )}

              {isRunning && (
                <>
                  <Button variant="secondary" onClick={pauseSession} disabled={saving}>
                    Pausar
                  </Button>
                  <Button variant="ghost" onClick={handleCancel} disabled={saving}>
                    Cancelar
                  </Button>
                </>
              )}

              {isPaused && (
                <>
                  <Button variant="primary" onClick={resumeSession} disabled={saving}>
                    Retomar
                  </Button>
                  <Button variant="ghost" onClick={handleCancel} disabled={saving}>
                    Encerrar
                  </Button>
                </>
              )}

              {sessionFinished && (
                <Button variant="primary" onClick={handleComplete} disabled={saving}>
                  {saving ? "Salvando..." : "Concluir sessão"}
                </Button>
              )}
            </>
          }
        />
      </div>
    </section>
  );
}