
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Suitcase } from "@/components/suitcases/utils/types";
import { useToast } from "./use-toast";

export const useSuitcases = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["suitcases"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("suitcases")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos valises",
        });
        throw error;
      }

      return data as Suitcase[];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
