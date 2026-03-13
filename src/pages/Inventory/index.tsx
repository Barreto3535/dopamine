import { useInventory } from "../../hooks/useInventory";
import PageIntro from "../../components/PageIntro";
import InventoryLoading from "../../components/InventoryLoading";
import InventoryEmpty from "../../components/InventoryEmpty";
import ActiveEffectsList from "../../components/ActiveEffectsList";
import ErrorDisplay from "../../components/ErrorDisplay";
import InventoryItemCard from "../../components/InventoryItemCard";
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

  if (loading) {
    return <InventoryLoading />;
  }

  const handleUseItem = async (itemId: string) => {
    const result = await useItem(itemId);
    if (result.success) {
      alert(result.message);
    }
  };

  const handleEquipTheme = async (themeId: string) => {
    const result = await equipThemeItem(themeId);
    if (result.success) {
      alert(result.message);
    }
  };

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
        <InventoryEmpty />
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