export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = (seconds % 60).toString().padStart(2, "0");

  return `${minutes}:${secs}`;
}

export function getLevelProgress(xp: number): number {
  const xpPerLevel = 100;
  const currentLevelXp = xp % xpPerLevel;
  return Math.min((currentLevelXp / xpPerLevel) * 100, 100);
}

export function getTaskStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    completed: "Concluída",
    in_progress: "Em andamento",
    pending: "Pendente"
  };
  return statusMap[status] || status;
}

export function formatStreak(days: number): string {
  return `${days} ${days === 1 ? 'dia' : 'dias'}`;
}

export function formatLevel(level: number): string {
  return `Nível ${level}`;
}