import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  LabelList,
} from "recharts";
import styles from "./styles.module.css";
import {
  getFocusChartLast7Days,
  getFocusSessionsTodayCount,
  getMyProgress,
  getTasksCompletedTodayCount,
  getTotalCompletedFocusSessionsCount,
  getTotalCompletedTasksCount,
  getXpEarnedToday,
  listRecentFocusSessions,
  type DailyChartItem,
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
  weeklyChart: DailyChartItem[];
};

function formatSessionDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
          weeklyChart,
        ] = await Promise.all([
          getMyProgress(),
          getFocusSessionsTodayCount(),
          getTasksCompletedTodayCount(),
          getXpEarnedToday(),
          getTotalCompletedFocusSessionsCount(),
          getTotalCompletedTasksCount(),
          listRecentFocusSessions(),
          getFocusChartLast7Days(),
        ]);

        setData({
          progress,
          focusToday,
          tasksToday,
          xpToday,
          totalFocusSessions,
          totalCompletedTasks,
          recentSessions,
          weeklyChart,
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

  const xp = data.progress?.xp ?? 0;
  const level = data.progress?.level ?? 1;
  const streak = data.progress?.streak ?? 0;
  const coins = data.progress?.coins ?? 0;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Acompanhe sua evolução</p>
        <h1 className={styles.title}>Seu progresso</h1>
        <p className={styles.subtitle}>
          Veja sua consistência, suas sessões de foco e o quanto você já avançou.
        </p>
      </header>

      <section className={styles.heroGrid}>
        <article className={styles.highlightCard}>
          <span className={styles.highlightLabel}>XP total</span>
          <strong className={styles.highlightValue}>{xp}</strong>
          <p className={styles.highlightText}>
            Seu progresso acumulado até agora.
          </p>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Nível</span>
          <strong className={styles.statValue}>{level}</strong>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Streak</span>
          <strong className={styles.statValue}>🔥 {streak}</strong>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Moedas</span>
          <strong className={styles.statValue}>{coins}</strong>
        </article>
      </section>

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

      <section className={styles.chartGrid}>
        <article className={styles.chartCard}>
          <div className={styles.sectionHeader}>
            <h2>Foco nos últimos 7 dias</h2>
          </div>

          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.weeklyChart}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="focusCount" radius={[8, 8, 0, 0]}>
                  <LabelList
                    dataKey="focusCount"
                    position="top"
                    style={{
                      fontsize: 12,
                      fontWeight: 600
                    }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={styles.chartCard}>
          <div className={styles.sectionHeader}>
            <h2>XP nos últimos 7 dias</h2>
          </div>

          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.weeklyChart}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="xp"
                  strokeWidth={2}
                  fillOpacity={0.2}
                  dot={{ r: 1 }}
                  label={{ position: "top" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
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
                    {formatSessionDate(session.started_at)}
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