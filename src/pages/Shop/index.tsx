import styles from "./styles.module.css";
import { useShop } from "../../hooks/useShop";
import PageIntro from "../../components/base/PageIntro";
import Card from "../../components/base/Card";
import StateHandler from "../../components/base/StateHandler";
import ErrorDisplay from "../../components/base/ErrorDisplay";
import CoinsDisplay from "../../components/pattern/CoinsDisplay";
import ShopItemCard from "../../components/complex/ShopItemCard";

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