
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FavoriteCard } from "./FavoriteCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/modules/auth";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { subscribe } = useEvents();
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);
  
  // Optimisation: n'effectuer le fetch que toutes les 5 secondes max
  const throttledFetch = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchRef.current;
    
    // Si moins de 5 secondes se sont écoulées depuis le dernier fetch, on programme un nouveau fetch
    if (timeSinceLastFetch < 5000 && fetchTimeoutRef.current === null) {
      fetchTimeoutRef.current = setTimeout(() => {
        fetchTimeoutRef.current = null;
        fetchFavorites();
      }, 5000 - timeSinceLastFetch);
      return;
    }
    
    // Sinon, on fait le fetch immédiatement
    lastFetchRef.current = now;
    await fetchFavorites();
  }, []);
  
  // Nettoyer le timeout lorsque le composant est démonté
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // S'abonner aux mises à jour de favoris
    const unsubscribe = subscribe ? subscribe('FAVORITE_UPDATED', () => {
      console.log("FavoritesSection: Événement FAVORITE_UPDATED reçu, actualisation");
      throttledFetch();
    }) : () => {};
    
    return unsubscribe;
  }, [subscribe, throttledFetch]);

  // Optimisation: utiliser memo pour éviter les recalculs
  const getCachedFavorites = useCallback(() => {
    try {
      const cachedData = localStorage.getItem('user_favorites_cache');
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Vérifier si le cache est encore valide (moins de 2 minutes)
        if (Date.now() - timestamp < 120000) {
          console.log("FavoritesSection: Utilisation du cache pour favoris");
          return data;
        }
      }
      return null;
    } catch (e) {
      console.warn("Erreur lors de l'accès au cache des favoris:", e);
      return null;
    }
  }, []);
  
  const fetchFavorites = async () => {
    if (!user) {
      console.log("FavoritesSection: Pas d'utilisateur, arrêt du chargement");
      setLoading(false);
      return;
    }
    
    // Vérifier le cache d'abord
    const cachedFavorites = getCachedFavorites();
    if (cachedFavorites) {
      setFavorites(cachedFavorites);
      setLoading(false);
      setInitialized(true);
      return;
    }
    
    try {
      console.log('FavoritesSection: Chargement des favoris pour l\'utilisateur:', user.id);
      setLoading(true);
      
      // Utiliser Promise.all pour exécuter les requêtes en parallèle
      const [outfitsResponse, clothesResponse, favClothesResponse] = await Promise.all([
        // 1. Récupérer les tenues favorites
        supabase
          .from("outfits")
          .select("id, name, created_at, is_favorite, user_id, season, category")
          .eq("user_id", user.id)
          .eq("is_favorite", true)
          .order("created_at", { ascending: false }),
          
        // 2. Récupérer les vêtements
        supabase
          .from("clothes")
          .select("id, name, image_url, brand, category, created_at, user_id")
          .eq("user_id", user.id)
          .eq("archived", false)
          .order("created_at", { ascending: false }),
          
        // 3. Récupérer les vêtements favoris via la table d'association
        supabase
          .from("favorite_clothes")
          .select("clothes_id")
          .eq("user_id", user.id)
      ]);
      
      // Vérifier les erreurs des requêtes
      if (outfitsResponse.error) throw outfitsResponse.error;
      if (clothesResponse.error) throw clothesResponse.error;
      if (favClothesResponse.error) throw favClothesResponse.error;
      
      // Traiter les données
      const outfitsData = outfitsResponse.data || [];
      const clothesData = clothesResponse.data || [];
      const favClothes = favClothesResponse.data || [];
      
      console.log('FavoritesSection: Tenues favorites récupérées:', outfitsData.length);
      console.log('FavoritesSection: Vêtements récupérés:', clothesData.length);
      console.log('FavoritesSection: Vêtements favoris récupérés:', favClothes.length);
      
      // Créer un ensemble des IDs des vêtements favoris pour un filtrage efficace
      const favoriteClothesIds = new Set(
        favClothes.map(item => item.clothes_id) || []
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
      
      console.log('FavoritesSection: Nombre total de favoris:', combinedFavorites.length);
      
      // Mettre à jour le cache
      try {
        localStorage.setItem('user_favorites_cache', JSON.stringify({
          timestamp: Date.now(),
          data: combinedFavorites
        }));
      } catch (e) {
        console.warn("Erreur lors de la mise en cache des favoris:", e);
      }
      
      setFavorites(combinedFavorites);
      setInitialized(true);
      setError(null);
    } catch (err: any) {
      console.error("FavoritesSection: Erreur lors du chargement des favoris:", err);
      setError(err.message);
      toast.error("Impossible de charger vos favoris");
    } finally {
      setLoading(false);
    }
  };
  
  // Optimiser pour éviter les rendus inutiles avec useCallback
  const handleRetry = useCallback(() => {
    setError(null);
    fetchFavorites();
  }, []);
  
  useEffect(() => {
    // Éviter les appels multiples quand l'authentification change
    if (isAuthenticated && user && !initialized) {
      console.log("FavoritesSection: Chargement initial des favoris");
      fetchFavorites();
    } else if (!isAuthenticated) {
      // Réinitialiser l'état si l'utilisateur est déconnecté
      console.log("FavoritesSection: Utilisateur non authentifié, réinitialisation");
      setLoading(false);
      setFavorites([]);
      setInitialized(false);
    }
    
    // Force la fin du chargement après un délai maximum
    const timer = setTimeout(() => {
      if (loading) {
        console.log("FavoritesSection: Fin du chargement forcée après timeout");
        setLoading(false);
      }
    }, 3000); // Réduit pour une meilleure expérience utilisateur
    
    return () => {
      clearTimeout(timer);
    };
  }, [user, isAuthenticated, initialized]);
  
  // Optimisation: utiliser un skeleton plus compact pour l'état de chargement
  if (loading && !initialized) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          <span>Vos Favoris</span>
          <Skeleton className="w-24 h-6" />
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(2).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="w-full h-40" />
              <div className="p-3">
                <Skeleton className="w-3/4 h-5 mb-2" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </Card>
          ))}
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Erreur</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={handleRetry} 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Réessayer
        </button>
      </Card>
    );
  }
  
  if (!isAuthenticated || !user) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Vos Favoris</h2>
        <p className="text-gray-500 mb-4">Connectez-vous pour voir vos favoris.</p>
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
