import { useInventory } from "../../hooks/useInventory";
import PageIntro from "../../components/base/PageIntro";
import Card from "../../components/base/Card";
import Button from "../../components/base/Button";
import InventoryItemCard from "../../components/complex/InventoryItemCard";
import ActiveEffectsList from "../../components/complex/ActiveEffectsList";
import StateHandler from "../../components/base/StateHandler";
import ErrorDisplay from "../../components/base/ErrorDisplay";
import styles from "./styles.module.css";

export default function Inventory() {
  const {
    items,
    activeEffects,
    selectedThemeId,
    loading,
    usingItemId,
    equippingThemeId,
    error,
    activeEffectTypes,
    useItem,
    equipThemeItem,
  } = useInventory();

  const handleUseItem = async (itemId: string) => {
    const result = await useItem(itemId);
    // ✅ Toast já foi mostrado no hook
  };

  const handleEquipTheme = async (themeId: string) => {
    const result = await equipThemeItem(themeId);
    // ✅ Toast já foi mostrado no hook
  };

  if (loading) {
    return (
      <section className={styles.container}>
        <StateHandler loading={true} />
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <PageIntro
        eyebrow="Seus itens"
        title="Inventário"
        subtitle="Veja os itens que você comprou, use boosts e equipe seus temas."
      />

      <ActiveEffectsList effects={activeEffects} />

      {error && <ErrorDisplay message={error} />}

      {items.length === 0 ? (
        <Card className={styles.emptyCard}>
          <h2>Nada por aqui ainda</h2>
          <p>
            Você ainda não possui itens no inventário. Compre algo na loja para
            começar a montar sua coleção.
          </p>
          <Button variant="primary" onClick={() => window.location.href = "/shop"}>
            Ir para loja
          </Button>
        </Card>
      ) : (
        <div className={styles.grid}>
          {items.map((entry) => (
            <InventoryItemCard
              key={entry.id}
              entry={entry}
              selectedThemeId={selectedThemeId}
              activeEffectTypes={activeEffectTypes}
              isUsing={usingItemId === entry.shop_items?.id}
              isEquipping={equippingThemeId === entry.shop_items?.theme_id}
              onUseItem={handleUseItem}
              onEquipTheme={handleEquipTheme}
            />
          ))}
        </div>
      )}
    </section>
  );
}