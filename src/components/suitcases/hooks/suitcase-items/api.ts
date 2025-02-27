
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

  const addSuitcaseItem = async (suitcaseId: string, clothesId: string) => {
    const { error } = await supabase
      .from("suitcase_items")
      .insert({
        suitcase_id: suitcaseId,
        clothes_id: clothesId,
        quantity: 1
      });

    if (error) throw error;
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
    removeSuitcaseItem,
    toast
  };
};
