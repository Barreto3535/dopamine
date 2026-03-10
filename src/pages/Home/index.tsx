import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Organização gamificada para TDAH</span>

          <h1 className={styles.title}>
            Organize sua rotina com mais foco, clareza e motivação
          </h1>

          <p className={styles.subtitle}>
            Transforme tarefas grandes em pequenos passos, use sessões de foco e
            acompanhe sua evolução com uma experiência leve e visual.
          </p>

          <div className={styles.actions}>
            <Link to="/login" className={styles.primaryButton}>
              Começar agora
            </Link>

            <Link to="/login" className={styles.secondaryButton}>
              Ver demonstração
            </Link>
          </div>
        </div>

        <div className={styles.heroMockup}>
          <div className={styles.mockupCard}>
            <div className={styles.mockupHeader}>
              <div>
                <p className={styles.mockupGreeting}>Bom dia 👋</p>
                <h3 className={styles.mockupName}>Sua missão de hoje</h3>
              </div>

              <div className={styles.levelBadge}>Nv. 4</div>
            </div>

            <div className={styles.mainTask}>
              <span className={styles.taskLabel}>Tarefa principal</span>
              <h4>Estudar React</h4>

              <div className={styles.progressInfo}>
                <span>Progresso</span>
                <span>2/5 passos</span>
              </div>

              <div className={styles.progressBar}>
                <div className={styles.progressFill} />
              </div>

              <button className={styles.mockupButton}>Começar próximo passo</button>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span>XP</span>
                <strong>120</strong>
              </div>

              <div className={styles.statCard}>
                <span>Sequência</span>
                <strong>3 dias</strong>
              </div>
            </div>

            <div className={styles.focusCard}>
              <span className={styles.focusLabel}>Sessão de foco</span>
              <strong>25:00</strong>
              <p>Pronto para começar?</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>Divida tarefas grandes</h3>
          <p>
            Transforme objetivos grandes em pequenos passos mais fáceis de
            iniciar.
          </p>
        </div>

        <div className={styles.feature}>
          <h3>Foque com sessões curtas</h3>
          <p>
            Use temporizadores para entrar em ação sem sobrecarga e sem pressão
            excessiva.
          </p>
        </div>

        <div className={styles.feature}>
          <h3>Acompanhe seu progresso</h3>
          <p>
            Ganhe XP, mantenha consistência e veja sua evolução de forma clara.
          </p>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Seu progresso não precisa ser perfeito.</h2>
        <p>Só precisa começar.</p>

        <Link to="/login" className={styles.primaryButton}>
          Criar conta grátis
        </Link>
      </section>
    </div>
  );
}