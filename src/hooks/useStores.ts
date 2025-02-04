import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Store {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  status: string;
  phone: string | null;
  website: string | null;
  average_rating: number | null;
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: "all",
    style: "all",
  });

  useEffect(() => {
    fetchUserAndData();
  }, []);

  const fetchUserAndData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found");
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour voir la liste des boutiques",
          variant: "destructive",
        });
        return;
      }

      setUserId(user.id);
      await Promise.all([fetchStores(), fetchFavorites()]);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const fetchStores = async () => {
    try {
      console.log("Fetching stores list...");
      let query = supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username),
          shop_items (
            id
          )
        `)
        .eq('status', 'approved');

      if (filters.category !== "all") {
        query = query.contains("categories", [filters.category]);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log("Stores fetched:", data);
      setStores(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_shops')
        .select('shop_id');

      if (error) throw error;

      setFavorites(data.map(fav => fav.shop_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (shopId: string) => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter des favoris",
        variant: "destructive",
      });
      return;
    }

    try {
      if (favorites.includes(shopId)) {
        const { error } = await supabase
          .from('favorite_shops')
          .delete()
          .eq('shop_id', shopId)
          .eq('user_id', userId);

        if (error) throw error;

        setFavorites(favorites.filter(id => id !== shopId));
        toast({
          title: "Boutique retirée des favoris",
          description: "La boutique a été retirée de vos favoris",
        });
      } else {
        const { error } = await supabase
          .from('favorite_shops')
          .insert({ 
            shop_id: shopId,
            user_id: userId
          });

        if (error) throw error;

        setFavorites([...favorites, shopId]);
        toast({
          title: "Boutique ajoutée aux favoris",
          description: "La boutique a été ajoutée à vos favoris",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les favoris",
        variant: "destructive",
      });
    }
  };

  return {
    stores,
    favorites,
    loading,
    filters,
    setFilters,
    toggleFavorite,
    fetchStores
  };
}