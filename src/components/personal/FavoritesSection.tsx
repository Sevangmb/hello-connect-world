
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FavoriteCard } from "./FavoriteCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/modules/auth";

export const FavoritesSection: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
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
        
        // Combiner et transformer les données
        const combinedFavorites = [
          ...(outfitsData || []).map(item => ({ ...item, type: 'outfit' })),
          ...(clothesData || []).map(item => ({ ...item, type: 'clothes' }))
        ].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
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
