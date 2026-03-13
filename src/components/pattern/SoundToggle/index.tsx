import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function SoundToggle() {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('soundMuted') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('soundMuted', String(muted));
    // Disparar evento para os hooks saberem se está mudo
    window.dispatchEvent(new CustomEvent('soundToggle', { detail: { muted } }));
  }, [muted]);

  return (
    <button
      className={styles.soundToggle}
      onClick={() => setMuted(!muted)}
      aria-label={muted ? 'Ativar sons' : 'Desativar sons'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}