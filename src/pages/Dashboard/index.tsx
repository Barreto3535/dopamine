import styles from "./styles.module.css";

export default function Dashboard() {
  return (
    <section className={styles.dashboard}>
      <div className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div>
            <p className={styles.greeting}>Bom dia 👋</p>
            <h1 className={styles.title}>Seu progresso começa com um passo</h1>
            <p className={styles.subtitle}>
              Hoje já é um ótimo dia para avançar um pouquinho.
            </p>
          </div>

          <div className={styles.heroBadges}>
            <span className={styles.levelBadge}>Nível 4</span>
            <span className={styles.streakBadge}>🔥 3 dias</span>
          </div>
        </div>

        <div className={styles.xpBlock}>
          <div className={styles.xpInfo}>
            <span>XP atual</span>
            <strong>120 / 200</strong>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
        </div>
      </div>

      <div className={styles.mainMission}>
        <div className={styles.missionHeader}>
          <span className={styles.sectionTag}>Missão principal</span>
          <span className={styles.missionSteps}>2 de 5 passos</span>
        </div>

        <h2 className={styles.missionTitle}>Estudar React</h2>

        <p className={styles.missionText}>
          Continue de onde parou e foque apenas no próximo passo.
        </p>

        <div className={styles.missionProgress}>
          <div className={styles.missionProgressBar}>
            <div className={styles.missionProgressFill} />
          </div>
        </div>

        <button className={styles.primaryButton}>Começar próximo passo</button>
      </div>

      <div className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statLabel}>XP hoje</span>
          <strong className={styles.statValue}>+20</strong>
          <p className={styles.statText}>Você já avançou hoje</p>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Foco</span>
          <strong className={styles.statValue}>2 sessões</strong>
          <p className={styles.statText}>Bom ritmo até aqui</p>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statLabel}>Tarefas abertas</span>
          <strong className={styles.statValue}>4</strong>
          <p className={styles.statText}>Sem exagero, só o essencial</p>
        </article>
      </div>

      <div className={styles.bottomGrid}>
        <article className={styles.listCard}>
          <div className={styles.cardHeader}>
            <h3>Próximos passos</h3>
            <span className={styles.cardHeaderTag}>Hoje</span>
          </div>

          <ul className={styles.taskList}>
            <li className={styles.taskItem}>
              <span className={styles.taskDot} />
              <span>Revisar componentes</span>
            </li>

            <li className={styles.taskItem}>
              <span className={styles.taskDot} />
              <span>Organizar rotina da manhã</span>
            </li>

            <li className={styles.taskItem}>
              <span className={styles.taskDot} />
              <span>Ler documentação</span>
            </li>
          </ul>
        </article>

        <article className={styles.focusCard}>
          <span className={styles.focusTag}>Sessão de foco</span>
          <h3 className={styles.focusTitle}>25 minutos para sair da inércia</h3>
          <p className={styles.focusText}>
            Escolha uma tarefa, respire e comece sem pressão.
          </p>

          <button className={styles.secondaryButton}>Iniciar foco</button>
        </article>
      </div>
    </section>
  );
}