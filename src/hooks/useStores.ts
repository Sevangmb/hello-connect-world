
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface Store {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  phone: string | null;
  website: string | null;
  average_rating: number | null;
  created_at: string;
  updated_at: string;
  opening_hours: Json | null;
  categories: string[] | null;
  profiles: {
    username: string | null;
  } | null;
  shop_items: { id: string }[];
}

export interface FilterState {
  category: string;
  priceRange: string;
  style: string;
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: "all",
    style: "all",
  });

  const fetchStores = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('shops')
        .select(`
          *,
          profiles!user_id (username),
          shop_items!shop_id (
            id
          )
        `)
        .eq('status', 'approved');

      if (filters.category !== "all") {
        query = query.contains("categories", [filters.category]);
      }

      const { data, error } = await query;

      if (error) throw error;

      setStores(data as Store[] || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des boutiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [filters]);

  return {
    stores,
    loading,
    filters,
    setFilters,
    fetchStores
  };
}
