
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
    // Utilisation de l'insertion simple plutôt que l'insertion sans where clause
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
    
    // Insérer chaque élément séparément pour éviter les erreurs de masse
    const results = [];
    
    for (const item of items) {
      try {
        const { data, error } = await supabase
          .from("suitcase_items")
          .insert(item)
          .select();
          
        if (error) {
          console.error(`Erreur lors de l'ajout de l'article ${item.clothes_id}:`, error);
        } else if (data) {
          results.push(data[0]);
        }
      } catch (err) {
        console.error(`Exception lors de l'ajout de l'article ${item.clothes_id}:`, err);
      }
    }
    
    return results;
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
