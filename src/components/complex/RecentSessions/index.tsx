import type { FocusSession } from "../../types/focusSession";
import styles from "./styles.module.css";

interface RecentSessionsProps {
  sessions: FocusSession[];
}

function formatSessionDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className={styles.stateCard}>
        Você ainda não concluiu sessões de foco.
      </div>
    );
  }

  return (
    <ul className={styles.sessionList}>
      {sessions.map((session) => (
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
  );
}