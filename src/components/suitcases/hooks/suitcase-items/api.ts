
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSuitcaseItemsApi = () => {
  const { toast } = useToast();

  const checkExistingItem = async (suitcaseId: string, clothesId: string) => {
    const { data, error } = await supabase
      .from("suitcase_items")
      .select("id")
      .eq("suitcase_id", suitcaseId)
      .eq("clothes_id", clothesId);
    
    if (error) throw error;
    return data;
  };

  const addSuitcaseItem = async (suitcaseId: string, clothesId: string, quantity: number = 1) => {
    const { data, error } = await supabase
      .from("suitcase_items")
      .insert({
        suitcase_id: suitcaseId,
        clothes_id: clothesId,
        quantity: quantity
      })
      .select();

    if (error) {
      console.error("Erreur lors de l'ajout d'un article à la valise:", error);
      throw error;
    }
    
    return data;
  };

  const addMultipleSuitcaseItems = async (items: {suitcase_id: string; clothes_id: string; quantity: number}[]) => {
    if (!items.length) return [];
    
    // Utiliser l'API Supabase pour insérer plusieurs articles en une seule opération
    const { data, error } = await supabase
      .from("suitcase_items")
      .upsert(items, { onConflict: 'suitcase_id,clothes_id' })
      .select();
      
    if (error) {
      console.error("Erreur lors de l'ajout en masse:", error);
      throw error;
    }
    
    return data || [];
  };

  const removeSuitcaseItem = async (itemId: string) => {
    const { error } = await supabase
      .from("suitcase_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;
  };

  return {
    checkExistingItem,
    addSuitcaseItem,
    addMultipleSuitcaseItems,
    removeSuitcaseItem,
    toast
  };
};
