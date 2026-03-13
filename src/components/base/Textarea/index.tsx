import styles from "./styles.module.css";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = "", id, ...props }: TextareaProps) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.field}>
      {label && <label htmlFor={textareaId}>{label}</label>}
      <textarea
        id={textareaId}
        className={`${styles.textarea} ${error ? styles.error : ""} ${className}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}