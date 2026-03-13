import styles from "./styles.module.css";
import { useShop } from "../../hooks/useShop";
import PageIntro from "../../components/PageIntro";
import Card from "../../components/Card";
import StateHandler from "../../components/StateHandler";
import ErrorDisplay from "../../components/ErrorDisplay";
import CoinsDisplay from "../../components/CoinsDisplay";
import ShopItemCard from "../../components/ShopItemCard";

export default function Shop() {
  const {
    items,
    coins,
    loading,
    buyingId,
    error,
    handlePurchase,
  } = useShop();

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
        eyebrow="Economia do app"
        title="Loja"
        subtitle="Compre itens úteis e cosméticos para personalizar sua jornada."
        rightSlot={<CoinsDisplay amount={coins} />}
      />

      {error && <ErrorDisplay message={error} />}

      <div className={styles.grid}>
        {items.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            coins={coins}
            isBuying={buyingId === item.id}
            onPurchase={async (item) => {
              const result = await handlePurchase(item);
              if (result.success) {
                alert(result.message);
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}