
import { supabase } from "@/integrations/supabase/client";
import type { ClothingItem } from "../types/aiTypes";

export async function fetchUserClothes(userId: string): Promise<ClothingItem[]> {
  const { data, error } = await supabase
    .from("clothes")
    .select("id, name, image_url, category, brand")
    .eq("user_id", userId)
    .eq("archived", false);

  if (error) throw error;
  
  return data || [];
}
