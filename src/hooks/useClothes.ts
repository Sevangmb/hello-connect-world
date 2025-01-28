import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ClothesFilters = {
  category?: string;
  search?: string;
  sortBy?: "created_at" | "name";
  sortOrder?: "asc" | "desc";
  source?: "mine" | "friends";
};

export const useClothes = (filters: ClothesFilters = {}) => {
  return useQuery({
    queryKey: ["clothes", filters],
    queryFn: async () => {
      console.log("Fetching clothes with filters:", filters);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("clothes")
        .select("*");

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.source === "mine") {
        query = query.eq("user_id", user.id);
      } else if (filters.source === "friends") {
        // Get friends' clothes
        const { data: friendships } = await supabase
          .from("friendships")
          .select("friend_id, user_id")
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
          .eq("status", "accepted");

        if (friendships) {
          const friendIds = friendships.map(f => 
            f.user_id === user.id ? f.friend_id : f.user_id
          );
          query = query.in("user_id", friendIds);
        }
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