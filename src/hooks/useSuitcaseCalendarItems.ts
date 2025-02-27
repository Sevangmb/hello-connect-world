
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SuitcaseCalendarItem } from "@/components/suitcases/utils/types";
import { useToast } from "./use-toast";

export type SuitcaseCalendarFilters = {
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'archived' | 'all';
};

export const useSuitcaseCalendarItems = (filters: SuitcaseCalendarFilters = {}) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["suitcase-calendar-items", filters],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("suitcase_items")
        .select(`
          *,
          clothes (
            id,
            name,
            image_url,
            category
          ),
          suitcase:suitcases (
            start_date,
            end_date,
            name
          )
        `)
        .eq("suitcases.user_id", user.id);

      // Filtrer par statut de valise si spécifié
      if (filters.status && filters.status !== 'all') {
        query = query.eq("suitcases.status", filters.status);
      } else {
        // Par défaut, montrer uniquement les valises actives
        query = query.eq("suitcases.status", "active");
      }

      // Filtrer les valises par dates si spécifiées
      if (filters.startDate && filters.endDate) {
        // Récupérer les valises qui chevauchent la période spécifiée
        query = query.or(
          `and(suitcases.start_date.lte.${filters.endDate.toISOString()},suitcases.end_date.gte.${filters.startDate.toISOString()}),` +
          `and(suitcases.start_date.gte.${filters.startDate.toISOString()},suitcases.start_date.lte.${filters.endDate.toISOString()}),` +
          `and(suitcases.end_date.gte.${filters.startDate.toISOString()},suitcases.end_date.lte.${filters.endDate.toISOString()})`
        );
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données du calendrier de valises",
        });
        throw error;
      }

      // Filtrer les éléments sans dates de valise
      const validItems = data.filter(
        item => item.suitcase && (item.suitcase.start_date || item.suitcase.end_date)
      ) as SuitcaseCalendarItem[];

      return validItems;
    },
    enabled: !!filters,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
