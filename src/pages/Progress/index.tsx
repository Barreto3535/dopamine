import styles from "./styles.module.css";
import { useProgress } from "../../hooks/useProgress";
import PageIntro from "../../components/PageIntro";
import Card from "../../components/Card";
import StateHandler from "../../components/StateHandler";
import StatCard from "../../components/StatCard";
import HighlightCard from "../../components/HighlightCard";
import SectionHeader from "../../components/SectionHeader";
import FocusChart from "../../components/FocusChart";
import XPChart from "../../components/XPChart";
import RecentSessions from "../../components/RecentSessions";

export default function Progress() {
  const { data, loading, error } = useProgress();

  if (loading) {
    return (
      <section className={styles.page}>
        <StateHandler loading={true} />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.page}>
        <StateHandler error={error ?? "Não foi possível carregar seu progresso."} />
      </section>
    );
  }

  const xp = data.progress?.xp ?? 0;
  const level = data.progress?.level ?? 1;
  const streak = data.progress?.streak ?? 0;
  const coins = data.progress?.coins ?? 0;

  return (
    <section className={styles.page}>
      <PageIntro
        eyebrow="Acompanhe sua evolução"
        title="Seu progresso"
        subtitle="Veja sua consistência, suas sessões de foco e o quanto você já avançou."
      />

      <section className={styles.heroGrid}>
        <HighlightCard
          label="XP total"
          value={xp}
          description="Seu progresso acumulado até agora."
        />
        <StatCard label="Nível" value={level} />
        <StatCard label="Streak" value={`🔥 ${streak}`} />
        <StatCard label="Moedas" value={coins} />
      </section>

      <section className={styles.section}>
        <SectionHeader title="Hoje" />
        <div className={styles.statsGrid}>
          <StatCard label="Sessões de foco" value={data.focusToday} />
          <StatCard label="Tarefas concluídas" value={data.tasksToday} />
          <StatCard label="XP ganho" value={data.xpToday} />
        </div>
      </section>

      <section className={styles.chartGrid}>
        <FocusChart data={data.weeklyChart} />
        <XPChart data={data.weeklyChart} />
      </section>

      <section className={styles.section}>
        <SectionHeader title="Resumo geral" />
        <div className={styles.statsGrid}>
          <StatCard label="Focos concluídos" value={data.totalFocusSessions} />
          <StatCard label="Tarefas concluídas" value={data.totalCompletedTasks} />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader title="Últimas sessões de foco" />
        <RecentSessions sessions={data.recentSessions} />
      </section>
    </section>
  );
}