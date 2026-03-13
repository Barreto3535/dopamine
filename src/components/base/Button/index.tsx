import { forwardRef } from "react";
import styles from "./styles.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "default" | "small";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  as?: React.ElementType;
  to?: string; // Para links (React Router)
  href?: string; // Para links HTML
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      loading = false,
      fullWidth = false,
      children,
      className = "",
      disabled,
      as: Component = "button",
      to,
      href,
      ...props
    },
    ref
  ) => {
    const buttonProps = {
      className: `
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ""}
        ${loading ? styles.loading : ""}
        ${className}
      `,
      disabled: disabled || loading,
      ref,
      ...props,
    };

    // Se for React Router Link (tem 'to')
    if (Component !== "button" && to) {
      return (
        <Component to={to} {...buttonProps}>
          {loading ? "Carregando..." : children}
        </Component>
      );
    }

    // Se for link HTML (tem 'href')
    if (href) {
      return (
        <a href={href} {...buttonProps}>
          {loading ? "Carregando..." : children}
        </a>
      );
    }

    // Botão normal
    return (
      <Component {...buttonProps}>
        {loading ? "Carregando..." : children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;