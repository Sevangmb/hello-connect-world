<code>
import { supabase } from "@/integrations/supabase/client";

export async function fetchShops(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("shops")
      .select(`*, profiles:user_id (username), shop_items (id)`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    throw error;
  }
}

export async function updateShopStatus(
  shopId: string,
  status: "approved" | "rejected"
): Promise<void> {
  try {
    const { error } = await supabase
      .from("shops")
      .update({ status })
      .eq("id", shopId);
    if (error) throw error;
    return;
  } catch (error) {
    throw error;
  }
}

export async function deleteShop(shopId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("shops")
      .delete()
      .eq("id", shopId);
    if (error) throw error;
    return;
  } catch (error) {
    throw error;
  }
}

export async function getShopDetails(shopId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("shops")
      .select(`*, profiles:user_id (username), shop_items (id)`)
      .eq("id", shopId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}
</code>
