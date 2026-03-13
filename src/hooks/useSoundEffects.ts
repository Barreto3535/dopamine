import { useCallback, useEffect, useState } from 'react';
import useSound from 'use-sound';

const SOUNDS = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  levelUp: '/sounds/level-up.mp3',
  purchase: '/sounds/purchase.mp3',
  focusStart: '/sounds/focus-start.mp3',
  focusComplete: '/sounds/focus-complete.mp3',
  notification: '/sounds/notification.mp3',
  taskComplete: '/sounds/task-complete.mp3',
  stepComplete: '/sounds/step-complete.mp3',
  error: '/sounds/error.mp3',
  coins: '/sounds/coins.mp3',
  boost: '/sounds/boost.mp3',
};

export function useSoundEffects() {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('soundMuted') === 'true';
  });

  useEffect(() => {
    const handleSoundToggle = (event: CustomEvent) => {
      setMuted(event.detail.muted);
    };

    window.addEventListener('soundToggle', handleSoundToggle as EventListener);
    return () => window.removeEventListener('soundToggle', handleSoundToggle as EventListener);
  }, []);

  const [playClick] = useSound(SOUNDS.click, { volume: 0.2, soundEnabled: !muted });
  const [playSuccess] = useSound(SOUNDS.success, { volume: 0.3, soundEnabled: !muted });
  const [playLevelUp] = useSound(SOUNDS.levelUp, { volume: 0.4, soundEnabled: !muted });
  const [playPurchase] = useSound(SOUNDS.purchase, { volume: 0.3, soundEnabled: !muted });
  const [playFocusStart] = useSound(SOUNDS.focusStart, { volume: 0.3, soundEnabled: !muted });
  const [playFocusComplete] = useSound(SOUNDS.focusComplete, { volume: 0.4, soundEnabled: !muted });
  const [playNotification] = useSound(SOUNDS.notification, { volume: 0.2, soundEnabled: !muted });
  const [playTaskComplete] = useSound(SOUNDS.taskComplete, { volume: 0.4, soundEnabled: !muted });
  const [playStepComplete] = useSound(SOUNDS.stepComplete, { volume: 0.3, soundEnabled: !muted });
  const [playError] = useSound(SOUNDS.error, { volume: 0.3, soundEnabled: !muted });
  const [playCoins] = useSound(SOUNDS.coins, { volume: 0.3, soundEnabled: !muted });
  const [playBoost] = useSound(SOUNDS.boost, { volume: 0.3, soundEnabled: !muted });

  return {
    playClick: useCallback(() => playClick(), [playClick]),
    playSuccess: useCallback(() => playSuccess(), [playSuccess]),
    playLevelUp: useCallback(() => playLevelUp(), [playLevelUp]),
    playPurchase: useCallback(() => playPurchase(), [playPurchase]),
    playFocusStart: useCallback(() => playFocusStart(), [playFocusStart]),
    playFocusComplete: useCallback(() => playFocusComplete(), [playFocusComplete]),
    playNotification: useCallback(() => playNotification(), [playNotification]),
    playTaskComplete: useCallback(() => playTaskComplete(), [playTaskComplete]),
    playStepComplete: useCallback(() => playStepComplete(), [playStepComplete]),
    playError: useCallback(() => playError(), [playError]),
    playCoins: useCallback(() => playCoins(), [playCoins]),
    playBoost: useCallback(() => playBoost(), [playBoost]),
    muted,
  };
}