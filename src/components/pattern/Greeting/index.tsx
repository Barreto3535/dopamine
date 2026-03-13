import { useMemo } from "react";
import styles from "./styles.module.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

interface GreetingProps {
  displayName: string;
}

export default function Greeting({ displayName }: GreetingProps) {
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <p className={styles.greeting}>
      {greeting}, {displayName} 👋
    </p>
  );
}