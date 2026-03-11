import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { getDashboardSummary } from "../../services/dashboardService";
import type { DashboardSummary } from "../../types/dashboard";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getLevelProgress(xp: number) {
  const xpPerLevel = 100;
  const currentLevelXp = xp % xpPerLevel;
  return Math.min((currentLevelXp / xpPerLevel) * 100, 100);
}

function getTaskStatusLabel(status: DashboardSummary["main_task"] extends infer T
  ? T extends { status: infer S }
  ? S
  : never
  : never) {
  if (status === "completed") return "Concluída";
  if (status === "in_progress") return "Em andamento";
  return "Pendente";
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Não foi possível carregar o dashboard.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const greeting = useMemo(() => getGreeting(), []);
  const displayName = summary?.profile?.display_name ?? "usuário";
  const level = summary?.progress?.level ?? 1;
  const xp = summary?.progress?.xp ?? 0;
  const streak = summary?.progress?.streak ?? 0;
  const levelProgress = getLevelProgress(xp);

  const mainTask = summary?.main_task;
  const openTasksCount = summary?.open_tasks_count ?? 0;
  const focusSessionsToday = summary?.focus_sessions_today ?? 0;
  const tasksCompletedToday = summary?.tasks_completed_today ?? 0;

  if (loading) {
    return (
      <section className={styles.dashboard}>
        <div className={styles.stateCard}>
          <p className={styles.stateText}>Carregando seu dashboard...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.dashboard}>
        <div className={styles.stateCard}>
          <p className={styles.stateError}>
            Não foi possível carregar o dashboard.
          </p>
          <p className={styles.stateText}>{error}</p>

          <div className={styles.stateActions}>
            <Link to="/tasks" className={styles.secondaryLinkButton}>
              Ir para tarefas
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.dashboard}>
      <div className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div>
            <p className={styles.greeting}>
              {greeting}, {displayName} 👋
            </p>
            <h1 className={styles.title}>Seu progresso começa com um passo</h1>
            <p className={styles.subtitle}>
              Hoje já é um ótimo dia para avançar um pouquinho.
            </p>
          </div>

          <div className={styles.heroBadges}>
            <span className={styles.levelBadge}>Nível {level}</span>
            <span className={styles.streakBadge}>🔥 {streak} dias</span>
          </div>
        </div>

        <div className={styles.xpBlock}>
          <div className={styles.xpInfo}>
            <span>XP atual</span>
            <strong>{xp}</strong>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {mainTask ? (
        <div className={styles.mainMission}>
          <div className={styles.missionHeader}>
            <span className={styles.sectionTag}>Missão principal</span>
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

          <div className={styles.missionProgress}>
            <div className={styles.missionProgressBar}>
              <div
                className={styles.missionProgressFill}
                style={{
                  width:
                    mainTask.status === "completed"
                      ? "100%"
                      : mainTask.status === "in_progress"
                        ? "55%"
                        : "20%",
                }}
              />
            </div>
          </div>

          <div className={styles.missionActions}>
            <Link
              to={`/tasks/${mainTask.id}`}
              className={styles.primaryLinkButton}
            >
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
            <span className={styles.sectionTag}>Missão principal</span>
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
        <article className={styles.statCard}>
          <span className={styles.statLabel}>XP hoje</span>
          <strong className={styles.statValue}>{tasksCompletedToday * 10}</strong>
          <p className={styles.statText}>Baseado nas tarefas concluídas hoje</p>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Foco</span>
          <strong className={styles.statValue}>
            {focusSessionsToday} sessões
          </strong>
          <p className={styles.statText}>Sessões concluídas hoje</p>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Tarefas abertas</span>
          <strong className={styles.statValue}>{openTasksCount}</strong>
          <p className={styles.statText}>Sem exagero, só o essencial</p>
        </article>
      </div>

      <div className={styles.bottomGrid}>
        <article className={styles.listCard}>
          <div className={styles.cardHeader}>
            <h3>Resumo do dia</h3>
            <span className={styles.cardHeaderTag}>Hoje</span>
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

        <article className={styles.focusCard}>
          <span className={styles.focusTag}>Sessão de foco</span>
          <h3 className={styles.focusTitle}>25 minutos para sair da inércia</h3>
          <p className={styles.focusText}>
            Escolha uma tarefa, respire e comece sem pressão.
          </p>

          <Link to="/focus" className={styles.secondaryLinkButton}>
            Iniciar foco
          </Link>
        </article>
      </div>
    </section>
  );
}