
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SuitcaseCalendarItem {
  clothes_id: string;
  clothes: {
    id: string;
    name: string;
    image_url: string | null;
    category: string;
  };
  suitcase_id: string;
  suitcase: {
    start_date: string | null;
    end_date: string | null;
  };
}

export const useSuitcaseCalendar = () => {
  return useQuery({
    queryKey: ["suitcase-calendar-items"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("suitcase_items")
        .select(`
          clothes_id,
          clothes (
            id,
            name,
            image_url,
            category
          ),
          suitcase_id,
          suitcases!suitcase_items_suitcase_id_fkey (
            start_date,
            end_date
          )
        `)
        .eq("suitcases.user_id", user.id)
        .eq("suitcases.status", "active")
        .not("suitcases.start_date", "is", null)
        .not("suitcases.end_date", "is", null);

      if (error) throw error;

      // Transform the data to match the expected type
      const calendarItems: SuitcaseCalendarItem[] = data.map(item => ({
        ...item,
        suitcase: item.suitcases
      }));

      return calendarItems;
    },
  });
};
