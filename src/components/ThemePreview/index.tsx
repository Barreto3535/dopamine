import styles from "./styles.module.css";

interface ThemePreviewProps {
  themeId: string;
  title: string;
}

export default function ThemePreview({ themeId, title }: ThemePreviewProps) {
  return (
    <div
      className={styles.previewSwatch}
      title={`Preview do tema ${title}`}
      data-theme-preview={themeId} // Opcional: para estilizar diferentes temas
    />
  );
}