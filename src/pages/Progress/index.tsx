import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  getFocusSessionsTodayCount,
  getMyProgress,
  getTasksCompletedTodayCount,
  getTotalCompletedFocusSessionsCount,
  getTotalCompletedTasksCount,
  getXpEarnedToday,
  listRecentFocusSessions,
} from "../../services/progressService";
import type { UserProgress } from "../../types/progress";
import type { FocusSession } from "../../types/focusSession";

type ProgressOverview = {
  progress: UserProgress | null;
  focusToday: number;
  tasksToday: number;
  xpToday: number;
  totalFocusSessions: number;
  totalCompletedTasks: number;
  recentSessions: FocusSession[];
};

export default function Progress() {
  const [data, setData] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        setError(null);

        const [
          progress,
          focusToday,
          tasksToday,
          xpToday,
          totalFocusSessions,
          totalCompletedTasks,
          recentSessions,
        ] = await Promise.all([
          getMyProgress(),
          getFocusSessionsTodayCount(),
          getTasksCompletedTodayCount(),
          getXpEarnedToday(),
          getTotalCompletedFocusSessionsCount(),
          getTotalCompletedTasksCount(),
          listRecentFocusSessions(),
        ]);

        setData({
          progress,
          focusToday,
          tasksToday,
          xpToday,
          totalFocusSessions,
          totalCompletedTasks,
          recentSessions,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar seu progresso."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.stateCard}>Carregando progresso...</div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.page}>
        <div className={styles.stateCard}>
          <p className={styles.errorText}>
            {error ?? "Não foi possível carregar seu progresso."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Acompanhe sua evolução</p>
        <h1 className={styles.title}>Seu progresso</h1>
        <p className={styles.subtitle}>
          Veja sua constância, suas sessões de foco e o quanto você já avançou.
        </p>
      </header>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>XP total</span>
          <strong className={styles.statValue}>{data.progress?.xp ?? 0}</strong>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Nível</span>
          <strong className={styles.statValue}>
            {data.progress?.level ?? 1}
          </strong>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Streak</span>
          <strong className={styles.statValue}>
            🔥 {data.progress?.streak ?? 0}
          </strong>
        </article>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Hoje</h2>
        </div>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Sessões de foco</span>
            <strong className={styles.statValue}>{data.focusToday}</strong>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statLabel}>Tarefas concluídas</span>
            <strong className={styles.statValue}>{data.tasksToday}</strong>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statLabel}>XP ganho</span>
            <strong className={styles.statValue}>{data.xpToday}</strong>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Resumo geral</h2>
        </div>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Focos concluídos</span>
            <strong className={styles.statValue}>
              {data.totalFocusSessions}
            </strong>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statLabel}>Tarefas concluídas</span>
            <strong className={styles.statValue}>
              {data.totalCompletedTasks}
            </strong>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Últimas sessões de foco</h2>
        </div>

        {data.recentSessions.length === 0 ? (
          <div className={styles.stateCard}>
            Você ainda não concluiu sessões de foco.
          </div>
        ) : (
          <ul className={styles.sessionList}>
            {data.recentSessions.map((session) => (
              <li key={session.id} className={styles.sessionItem}>
                <div>
                  <strong>{session.duration_minutes} min</strong>
                  <p className={styles.sessionText}>
                    {new Date(session.started_at).toLocaleString("pt-BR")}
                  </p>
                </div>

                <span className={styles.sessionXp}>+{session.xp_earned} XP</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}