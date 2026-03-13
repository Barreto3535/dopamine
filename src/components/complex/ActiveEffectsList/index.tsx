import ActiveEffectBanner from "../ActiveEffectBanner";
import type { ActiveEffect } from "../../../services/shopService";
import styles from "./styles.module.css";

interface ActiveEffectsListProps {
  effects: ActiveEffect[];
}

export default function ActiveEffectsList({ effects }: ActiveEffectsListProps) {
  if (effects.length === 0) return null;

  return (
    <div className={styles.activeEffectsSection}>
      {effects.map((effect) => (
        <ActiveEffectBanner
          key={effect.id}
          title={
            effect.effect_type === "focus_boost"
              ? "Focus Boost ativo"
              : effect.effect_type
          }
          description={
            effect.effect_type === "focus_boost"
              ? `Próxima sessão de foco com +${effect.effect_value}% XP`
              : `Efeito ativo: ${effect.effect_value}`
          }
        />
      ))}
    </div>
  );
}