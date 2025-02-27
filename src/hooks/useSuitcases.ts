
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Suitcase, SuitcaseStatus } from "@/components/suitcases/utils/types";
import { useToast } from "./use-toast";

export type SuitcaseFilters = {
  status?: SuitcaseStatus | 'all';
  startDate?: Date;
  endDate?: Date;
  search?: string;
  forCalendar?: boolean; // Nouveau filtre pour récupérer les valises pour le calendrier
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
        // Utilisez le type correct pour le status
        query = query.eq("status", filters.status);
      } else {
        // Par défaut, montrer uniquement les valises actives
        query = query.eq("status", "active");
      }

      // Si le filtre forCalendar est activé, on récupère uniquement les valises avec des dates
      if (filters.forCalendar) {
        query = query.not("start_date", "is", null)
          .not("end_date", "is", null);
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
