
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SuitcaseCalendarItem } from "@/components/suitcases/utils/types";
import { useToast } from "./use-toast";
import { useSuitcases } from "./useSuitcases";

export const useSuitcaseCalendarItems = (startDate?: Date, endDate?: Date) => {
  const { toast } = useToast();
  
  // Récupérer les valises avec des dates définies
  const { data: suitcases, isLoading: isSuitcasesLoading } = useSuitcases({
    forCalendar: true,
    startDate,
    endDate
  });

  return useQuery({
    queryKey: ["suitcase-calendar-items", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!suitcases || suitcases.length === 0) {
        return [];
      }

      const suitcaseIds = suitcases.map(suitcase => suitcase.id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: items, error } = await supabase
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
        .in("suitcase_id", suitcaseIds);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les articles de vos valises pour le calendrier",
        });
        throw error;
      }

      return items as SuitcaseCalendarItem[];
    },
    enabled: !!suitcases && suitcases.length > 0,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
