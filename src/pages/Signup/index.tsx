import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./styles.module.css";

export default function Signup() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toastHelpers.error("As senhas não coincidem");
      return;
    }
    await signup(email, password, displayName);
  };

  return (
    <section className={styles.signup}>
      {/* ... JSX igual, mas sem lógica de auth */}
    </section>
  );
}