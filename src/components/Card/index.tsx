import styles from "./styles.module.css";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "hero" | "highlight";
  className?: string;
}

export default function Card({ children, variant = "default", className = "" }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}