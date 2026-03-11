import { supabase } from "../lib/supabaseClient";

export type ShopItem = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  price: number;
  effect_value: number | null;
  icon: string | null;
  is_consumable: boolean;
  is_active: boolean;
  created_at: string;
};

export type UserItem = {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  shop_items?: ShopItem;
};

export async function listShopItems(): Promise<ShopItem[]> {
  const { data, error } = await supabase
    .from("shop_items")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function purchaseItem(itemId: string): Promise<void> {
  const { error } = await supabase.rpc("purchase_item", {
    p_item_id: itemId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function listMyItems(): Promise<UserItem[]> {
  const { data, error } = await supabase
    .from("user_items")
    .select(`
      *,
      shop_items (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}