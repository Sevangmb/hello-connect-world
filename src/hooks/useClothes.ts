import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ClothesFilters = {
  category?: string;
  search?: string;
  sortBy?: "created_at" | "name";
  sortOrder?: "asc" | "desc";
};

export const useClothes = (filters: ClothesFilters = {}) => {
  return useQuery({
    queryKey: ["clothes", filters],
    queryFn: async () => {
      console.log("Fetching clothes with filters:", filters);
      
      let query = supabase
        .from("clothes")
        .select("*");

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.sortBy) {
        query = query.order(filters.sortBy, { 
          ascending: filters.sortOrder === "asc" 
        });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching clothes:", error);
        throw error;
      }

      console.log("Fetched clothes:", data);
      return data;
    },
  });
};