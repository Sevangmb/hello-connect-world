
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SuitcaseItem = {
  id: string;
  suitcase_id: string;
  clothes_id: string;
  created_at: string;
  clothes: {
    id: string;
    name: string;
    image_url: string | null;
    category: string;
  };
};

export const useSuitcaseItems = (suitcaseId: string) => {
  return useQuery({
    queryKey: ["suitcase-items", suitcaseId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("suitcase_items")
        .select(`
          *,
          clothes (
            id,
            name,
            image_url,
            category
          )
        `)
        .eq("suitcase_id", suitcaseId);

      if (error) throw error;
      return data as SuitcaseItem[];
    },
    enabled: !!suitcaseId,
  });
};

