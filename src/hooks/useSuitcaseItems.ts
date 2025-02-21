
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SuitcaseItem } from "@/components/suitcases/utils/types";
import { useToast } from "./use-toast";

export const useSuitcaseItems = (suitcaseId: string) => {
  const { toast } = useToast();

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

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les articles de la valise",
        });
        throw error;
      }

      return data as SuitcaseItem[];
    },
    enabled: !!suitcaseId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
