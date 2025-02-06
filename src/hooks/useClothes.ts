import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ClothesFilters = {
  category?: string;
  subcategory?: string;
  search?: string;
  sortBy?: "created_at" | "name" | "price" | "purchase_date";
  sortOrder?: "asc" | "desc";
  source?: "mine" | "friends";
  showArchived?: boolean;
  needsAlteration?: boolean;
  isForSale?: boolean;
  shopId?: string;
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
        const formattedCategory = filters.category.charAt(0).toUpperCase() + filters.category.slice(1).toLowerCase();
        query = query.eq("category", formattedCategory);
      }

      if (filters.subcategory) {
        query = query.eq("subcategory", filters.subcategory);
      }

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.source === "mine") {
        query = query.eq("user_id", user.id);
      } else if (filters.source === "friends") {
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

      if (filters.showArchived !== undefined) {
        query = query.eq("archived", filters.showArchived);
      } else {
        // Par défaut, on ne montre pas les vêtements archivés
        query = query.eq("archived", false);
      }

      if (filters.needsAlteration !== undefined) {
        query = query.eq("needs_alteration", filters.needsAlteration);
      }

      if (filters.isForSale !== undefined) {
        query = query.eq("is_for_sale", filters.isForSale);
      }

      if (filters.shopId) {
        query = query.eq("shop_id", filters.shopId);
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
