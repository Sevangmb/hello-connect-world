
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Suitcase } from "@/components/suitcases/utils/types";
import { useToast } from "./use-toast";

export type SuitcaseFilters = {
  status?: 'active' | 'archived' | 'deleted' | 'all';
  startDate?: Date;
  endDate?: Date;
  search?: string;
};

export const useSuitcases = (filters: SuitcaseFilters = {}) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["suitcases", filters],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("suitcases")
        .select("*")
        .eq("user_id", user.id);

      // Filtrer par statut si spécifié
      if (filters.status && filters.status !== 'all') {
        query = query.eq("status", filters.status);
      } else {
        // Par défaut, montrer uniquement les valises actives
        query = query.eq("status", "active");
      }

      // Filtrer par dates si spécifiées
      if (filters.startDate && filters.endDate) {
        // Récupérer les valises qui chevauchent la période spécifiée
        query = query.or(
          `and(start_date.lte.${filters.endDate.toISOString()},end_date.gte.${filters.startDate.toISOString()}),` +
          `and(start_date.gte.${filters.startDate.toISOString()},start_date.lte.${filters.endDate.toISOString()}),` +
          `and(end_date.gte.${filters.startDate.toISOString()},end_date.lte.${filters.endDate.toISOString()})`
        );
      }

      // Filtrer par recherche si spécifié
      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      // Trier par date de création (décroissant)
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

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
