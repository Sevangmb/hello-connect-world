
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FavoriteCard } from "./FavoriteCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/modules/auth";

// Interface pour les données brutes des tenues
interface OutfitData {
  id: string;
  name?: string;
  image_url?: string | null;
  created_at: string;
  is_favorite: boolean;
  user_id: string;
  // Autres propriétés possibles des tenues
}

// Interface pour les données brutes des vêtements
interface ClothesData {
  id: string;
  name: string;
  image_url?: string | null;
  brand?: string;
  category?: string;
  created_at: string;
  is_favorite: boolean;
  user_id: string;
  archived: boolean;
  // Autres propriétés possibles des vêtements
}

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
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Récupérer les tenues favorites
        const { data: outfitsData, error: outfitsError } = await supabase
          .from("outfits")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_favorite", true)
          .order("created_at", { ascending: false });
          
        if (outfitsError) throw outfitsError;
        
        // Récupérer les vêtements favoris
        const { data: clothesData, error: clothesError } = await supabase
          .from("clothes")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_favorite", true)
          .eq("archived", false)
          .order("created_at", { ascending: false });
          
        if (clothesError) throw clothesError;
        
        // Transformer les données de tenues
        const outfitItems: FavoriteItem[] = (outfitsData || []).map(item => ({
          id: item.id,
          name: item.name,
          type: 'outfit' as const,
          image_url: item.image_url,
          created_at: item.created_at,
          is_favorite: item.is_favorite,
          user_id: item.user_id
        }));
        
        // Transformer les données de vêtements
        const clothesItems: FavoriteItem[] = (clothesData || []).map(item => ({
          id: item.id,
          name: item.name,
          type: 'clothes' as const,
          image_url: item.image_url,
          created_at: item.created_at,
          brand: item.brand,
          category: item.category,
          is_favorite: item.is_favorite,
          user_id: item.user_id
        }));
        
        // Combiner et trier les données
        const combinedFavorites: FavoriteItem[] = [...outfitItems, ...clothesItems]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setFavorites(combinedFavorites);
      } catch (err: any) {
        console.error("Erreur lors du chargement des favoris:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user]);
  
  if (loading) {
    return (
      <Card className="p-6 flex justify-center items-center min-h-[200px]">
        <LoadingSpinner size="md" />
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Erreur</h2>
        <p className="text-gray-500 mb-4">{error}</p>
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
