
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Suitcase = {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export const useSuitcases = () => {
  return useQuery({
    queryKey: ["suitcases"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("suitcases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Suitcase[];
    },
  });
};

