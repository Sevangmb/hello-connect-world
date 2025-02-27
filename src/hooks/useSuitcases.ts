
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Suitcase, SuitcaseStatus } from "@/components/suitcases/utils/types";
import { useToast } from "./use-toast";

export type SuitcaseFilters = {
  status?: SuitcaseStatus | 'all';
  startDate?: Date;
  endDate?: Date;
  search?: string;
  forCalendar?: boolean; // Filtre pour récupérer les valises pour le calendrier
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
        if (filters.status === 'deleted') {
          // Pour le statut 'deleted', qui n'existe pas dans la base de données,
          // nous allons utiliser une condition personnalisée
          query = query.eq("status", "archived")
                       .eq("description", "DELETED"); // Utilisation de .eq() au lieu de .is()
        } else {
          // Pour les autres statuts (active, archived), utiliser directement
          query = query.eq("status", filters.status);
        }
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

      // Si le statut est 'deleted', nous devons post-traiter les résultats
      // pour simuler le statut 'deleted' en modifiant le status directement dans les données
      const processedData = data.map(item => {
        if (filters.status === 'deleted' && item.description === "DELETED") {
          return {
            ...item,
            status: 'deleted' as SuitcaseStatus
          };
        }
        return item;
      });

      return processedData as Suitcase[];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
