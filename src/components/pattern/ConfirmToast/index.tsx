import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './styles.module.css';

export default function ConfirmToast() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleShowConfirm = (event: any) => {
      setMessage(event.detail.message);
      setIsOpen(true);

      toast.custom((t) => (
        <div className={styles.confirmToast}>
          <p className={styles.message}>{event.detail.message}</p>
          <div className={styles.actions}>
            <button
              className={styles.confirmButton}
              onClick={() => {
                window.__toastConfirmCallback?.(true);
                toast.dismiss(t.id);
                setIsOpen(false);
              }}
            >
              Sim
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                window.__toastConfirmCallback?.(false);
                toast.dismiss(t.id);
                setIsOpen(false);
              }}
            >
              Não
            </button>
          </div>
        </div>
      ), {
        duration: 8000,
        position: 'top-center',
      });
    };

    window.addEventListener('showConfirmToast', handleShowConfirm);
    return () => window.removeEventListener('showConfirmToast', handleShowConfirm);
  }, []);

  return null; // Componente só escuta eventos, não renderiza nada
}