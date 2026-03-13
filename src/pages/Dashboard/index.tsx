import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { useDashboard } from "../../hooks/useDashboard";
import { 
  getLevelProgress, 
  getTaskStatusLabel, 
  formatTime,
  formatStreak,
  formatLevel
  // 🔥 Remove formatCurrentXP
} from "../../utils/formatters";
import StateHandler from "../../components/StateHandler";
import Greeting from "../../components/Greeting";
import Badge from "../../components/Badge";
import ProgressBar from "../../components/ProgressBar";
import StatCard from "../../components/StatCard";
import ActiveEffectBanner from "../../components/ActiveEffectBanner";
import FocusTimerCard from "../../components/FocusTimerCard";

export default function Dashboard() {
  const {
    summary,
    loading,
    error,
    activeFocusRemaining,
    activeEffects
  } = useDashboard();

  const displayName = summary?.profile?.display_name ?? "usuário";
  const level = summary?.progress?.level ?? 1;
  const xp = summary?.progress?.xp ?? 0;
  const streak = summary?.progress?.streak ?? 0;
  const levelProgress = getLevelProgress(xp);

  const mainTask = summary?.main_task;
  const openTasksCount = summary?.open_tasks_count ?? 0;
  const focusSessionsToday = summary?.focus_sessions_today ?? 0;
  const tasksCompletedToday = summary?.tasks_completed_today ?? 0;

  const activeFocusBoost = activeEffects.find(
    (effect) => effect.effect_type === "focus_boost"
  );

  return (
    <StateHandler loading={loading} error={error}>
      <section className={styles.dashboard}>
        {/* Hero Section */}
        <div className={styles.heroCard}>
          <div className={styles.heroTop}>
            <div>
              <Greeting displayName={displayName} />
              <h1 className={styles.title}>Seu progresso começa com um passo</h1>
              <p className={styles.subtitle}>
                Hoje já é um ótimo dia para avançar um pouquinho.
              </p>
            </div>

            <div className={styles.heroBadges}>
              <Badge variant="level">{formatLevel(level)}</Badge>
              <Badge variant="streak" icon="🔥">{formatStreak(streak)}</Badge>
            </div>
          </div>

          {/* 🔥 Agora mostra só o XP como número */}
          <ProgressBar
            progress={levelProgress}
            showXPInfo={true}
            xpLabel="XP atual"
            xpValue={xp}  // Passa o XP direto como número
          />
        </div>

        {/* Resto do componente igual... */}
        {activeFocusBoost && (
          <ActiveEffectBanner
            title="Focus Boost ativo"
            description={`Sua próxima sessão concluída ganhará +${activeFocusBoost.effect_value}% XP.`}
          />
        )}

        {mainTask ? (
          <div className={styles.mainMission}>
            <div className={styles.missionHeader}>
              <Badge variant="success">Missão principal</Badge>
              <span className={styles.missionSteps}>
                {getTaskStatusLabel(mainTask.status)}
              </span>
            </div>

            <h2 className={styles.missionTitle}>{mainTask.title}</h2>

            <p className={styles.missionText}>
              {mainTask.description?.trim()
                ? mainTask.description
                : "Continue de onde parou e foque apenas no próximo passo."}
            </p>

            <ProgressBar
              variant="mission"
              progress={
                mainTask.status === "completed" ? 100 :
                mainTask.status === "in_progress" ? 55 : 20
              }
            />

            <div className={styles.missionActions}>
              <Link to={`/tasks/${mainTask.id}`} className={styles.primaryLinkButton}>
                Ver tarefa
              </Link>

              {mainTask.status !== "completed" && (
                <Link to="/focus" className={styles.secondaryLinkButton}>
                  Iniciar foco
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.emptyMission}>
            <div className={styles.missionHeader}>
              <Badge variant="success">Missão principal</Badge>
            </div>

            <h2 className={styles.missionTitle}>Nenhuma missão definida ainda</h2>

            <p className={styles.missionText}>
              Crie uma tarefa e defina uma missão principal para começar seu dia
              com mais clareza.
            </p>

            <div className={styles.missionActions}>
              <Link to="/tasks" className={styles.primaryLinkButton}>
                Ir para tarefas
              </Link>
            </div>
          </div>
        )}

        <div className={styles.statsGrid}>
          <StatCard
            label="XP hoje"
            value={tasksCompletedToday * 10}
            description="Baseado nas tarefas concluídas hoje"
          />
          <StatCard
            label="Foco"
            value={`${focusSessionsToday} sessões`}
            description="Sessões concluídas hoje"
          />
          <StatCard
            label="Tarefas abertas"
            value={openTasksCount}
            description="Sem exagero, só o essencial"
          />
        </div>

        <div className={styles.bottomGrid}>
          <article className={styles.listCard}>
            <div className={styles.cardHeader}>
              <h3>Resumo do dia</h3>
              <Badge variant="muted">Hoje</Badge>
            </div>

            <ul className={styles.taskList}>
              <li className={styles.taskItem}>
                <span className={styles.taskDot} />
                <span>{tasksCompletedToday} tarefas concluídas</span>
              </li>
              <li className={styles.taskItem}>
                <span className={styles.taskDot} />
                <span>{focusSessionsToday} sessões de foco finalizadas</span>
              </li>
              <li className={styles.taskItem}>
                <span className={styles.taskDot} />
                <span>{openTasksCount} tarefas ainda abertas</span>
              </li>
            </ul>

            <div className={styles.cardActions}>
              <Link to="/tasks" className={styles.secondaryLinkButton}>
                Ver tarefas
              </Link>
            </div>
          </article>

          <FocusTimerCard
            variant="compact"
            statusLabel={activeFocusRemaining ? "Foco em andamento" : "Sessão de foco"}
            timeText={activeFocusRemaining ? formatTime(activeFocusRemaining) : "25:00"}
            taskTitle={
              activeFocusRemaining
                ? "Continue de onde parou"
                : "25 minutos para sair da inércia"
            }
            progressPercent={activeFocusRemaining ? 50 : 0}
            helperText={
              activeFocusRemaining
                ? "Você já tem uma sessão ativa. Volte e continue."
                : "Escolha uma tarefa, respire e comece sem pressão."
            }
            actions={
              <Link
                to="/focus"
                className={
                  activeFocusRemaining
                    ? styles.primaryLinkButton
                    : styles.secondaryLinkButton
                }
              >
                {activeFocusRemaining ? "Continuar foco" : "Iniciar foco"}
              </Link>
            }
          />
        </div>
      </section>
    </StateHandler>
  );
}