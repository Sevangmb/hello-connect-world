
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FavoriteCard } from "./FavoriteCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/modules/auth";
import { useEvents } from "@/hooks/useEvents";

// Interface unifiée pour les éléments favoris
interface FavoriteItem {
  id: string;
  name?: string;
  type: 'outfit' | 'clothes';
  image_url?: string | null;
  created_at: string;
  brand?: string;
  category?: string;
  is_favorite: boolean;
  user_id: string;
}

export const FavoritesSection: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { subscribe } = useEvents();
  
  useEffect(() => {
    // S'abonner aux mises à jour de favoris
    const unsubscribe = subscribe ? subscribe('FAVORITE_UPDATED', () => {
      fetchFavorites();
    }) : () => {};
    
    return unsubscribe;
  }, [subscribe]);
  
  const fetchFavorites = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Chargement des favoris pour l\'utilisateur:', user.id);
      setLoading(true);
      
      // 1. Récupérer les tenues favorites
      const { data: outfitsData, error: outfitsError } = await supabase
        .from("outfits")
        .select("id, name, created_at, is_favorite, user_id, season, category")
        .eq("user_id", user.id)
        .eq("is_favorite", true)
        .order("created_at", { ascending: false });
        
      if (outfitsError) throw outfitsError;
      
      console.log('Tenues favorites récupérées:', outfitsData?.length || 0);
      
      // 2. Récupérer les vêtements
      const { data: clothesData, error: clothesError } = await supabase
        .from("clothes")
        .select("id, name, image_url, brand, category, created_at, user_id")
        .eq("user_id", user.id)
        .eq("archived", false)
        .order("created_at", { ascending: false });
        
      if (clothesError) throw clothesError;
      
      console.log('Vêtements récupérés:', clothesData?.length || 0);
      
      // 3. Récupérer les vêtements favoris via la table d'association
      const { data: favClothes, error: favClothesError } = await supabase
        .from("favorite_clothes")
        .select("clothes_id")
        .eq("user_id", user.id);
        
      if (favClothesError) throw favClothesError;
      
      console.log('Vêtements favoris récupérés:', favClothes?.length || 0);
      
      // Créer un ensemble des IDs des vêtements favoris pour un filtrage efficace
      const favoriteClothesIds = new Set(
        favClothes?.map(item => item.clothes_id) || []
      );
      
      // Transformer les données de tenues en objets FavoriteItem
      const outfitItems: FavoriteItem[] = outfitsData ? outfitsData.map((item) => ({
        id: item.id,
        name: item.name,
        type: 'outfit' as const,
        image_url: null, // Les tenues n'ont pas d'image directe
        created_at: item.created_at,
        is_favorite: item.is_favorite,
        category: `${item.category} - ${item.season}`,
        user_id: item.user_id
      })) : [];
      
      // Transformer les données de vêtements en objets FavoriteItem, en filtrant seulement les favoris
      const clothesItems: FavoriteItem[] = clothesData 
        ? clothesData
            .filter(item => favoriteClothesIds.has(item.id))
            .map((item) => ({
              id: item.id,
              name: item.name,
              type: 'clothes' as const,
              image_url: item.image_url,
              created_at: item.created_at,
              brand: item.brand,
              category: item.category,
              is_favorite: true, // Explicitement défini car filtré par les favoris
              user_id: item.user_id
            }))
        : [];
      
      // Combiner et trier les données par date de création
      const combinedFavorites: FavoriteItem[] = [...outfitItems, ...clothesItems]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      console.log('Nombre total de favoris:', combinedFavorites.length);
      setFavorites(combinedFavorites);
      setInitialized(true);
    } catch (err: any) {
      console.error("Erreur lors du chargement des favoris:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && !initialized) {
      fetchFavorites();
    } else if (!user) {
      // Réinitialiser l'état si l'utilisateur est déconnecté
      setLoading(false);
      setFavorites([]);
    }
  }, [user, initialized]);
  
  if (loading && !initialized) {
    return (
      <Card className="p-6 flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size="md" />
        <span className="ml-3">Chargement de vos favoris...</span>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Erreur</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => fetchFavorites()} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Réessayer
        </button>
      </Card>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Vos Favoris</h2>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore d'éléments favoris.</p>
        <p className="text-sm text-gray-400">
          Ajoutez des vêtements ou des tenues à vos favoris pour les retrouver ici.
        </p>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
        <span>Vos Favoris</span>
        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-md">
          {favorites.length} éléments
        </span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((item) => (
          <FavoriteCard key={`${item.type}-${item.id}`} item={item} />
        ))}
      </div>
    </Card>
  );
};
