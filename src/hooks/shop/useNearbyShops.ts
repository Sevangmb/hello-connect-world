
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ShopStatus } from '@/types/messages';

// Interface NearbyShop locale, compatible avec celle de messages.ts
export interface NearbyShop {
  id: string;
  name: string;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  logo_url?: string | null;
  banner_url?: string | null;
  status: ShopStatus;
  categories?: string[];
  opening_hours?: any;
  average_rating?: number;
  profiles?: { username: string | null };
  shop_items: { id: string }[];
  phone?: string;
  website?: string;
  distance?: number;
}

interface UseNearbyShopsOptions {
  radius?: number; // en km
  enabled?: boolean;
}

export function useNearbyShops(options: UseNearbyShopsOptions = {}) {
  const { radius = 10, enabled = true } = options;
  const [shops, setShops] = useState<NearbyShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Obtenir la position de l'utilisateur
  useEffect(() => {
    if (!enabled) return;
    
    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error('Erreur de géolocalisation:', err);
        setError('Impossible d\'obtenir votre position. Les boutiques ne peuvent pas être triées par proximité.');
        setLoading(false);
        
        // Charger les boutiques sans filtre de proximité
        fetchAllShops();
      }
    );
  }, [enabled]);

  // Fonction pour récupérer toutes les boutiques sans filtre de proximité
  const fetchAllShops = async () => {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username, full_name),
          shop_items (id)
        `)
        .eq('status', 'approved');

      if (error) throw error;
      
      if (data) {
        const typedShops: NearbyShop[] = data.map(shop => ({
          ...shop,
          status: shop.status as ShopStatus,
          shop_items: shop.shop_items || []
        }));
        setShops(typedShops);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des boutiques:', err);
      setError('Impossible de charger les boutiques.');
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la récupération des boutiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les boutiques à proximité lorsque la position de l'utilisateur est disponible
  useEffect(() => {
    if (!enabled || !userLocation) return;

    const fetchNearbyShops = async () => {
      try {
        setLoading(true);
        
        // Utiliser la fonction Postgres personnalisée pour trouver les boutiques à proximité
        const { data, error } = await supabase.rpc('get_nearby_shops', {
          user_lat: userLocation.lat,
          user_lng: userLocation.lng,
          radius_km: radius
        });

        if (error) throw error;

        if (data) {
          // Pour chaque boutique à proximité, obtenir les détails complets
          const shopIds = data.map(shop => shop.id);
          
          const { data: shopsData, error: shopsError } = await supabase
            .from('shops')
            .select(`
              *,
              profiles:user_id (username, full_name),
              shop_items (id)
            `)
            .in('id', shopIds);

          if (shopsError) throw shopsError;

          // Ajouter la distance aux données des boutiques
          if (shopsData) {
            const shopsWithDistance = shopsData.map(shop => {
              const nearbyData = data.find(item => item.id === shop.id);
              return { 
                ...shop,
                status: shop.status as ShopStatus,
                distance: nearbyData?.distance,
                shop_items: shop.shop_items || []
              } as NearbyShop;
            });
            
            // Trier par distance
            shopsWithDistance.sort((a, b) => {
              return (a.distance || Infinity) - (b.distance || Infinity);
            });
            
            setShops(shopsWithDistance);
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des boutiques à proximité:', err);
        setError('Impossible de charger les boutiques à proximité.');
        
        // Essayer de charger toutes les boutiques en cas d'échec
        fetchAllShops();
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyShops();
  }, [userLocation, radius, enabled]);

  return {
    shops,
    loading,
    error,
    userLocation,
    refetch: userLocation ? 
      () => setUserLocation({ ...userLocation }) : // Déclencher un rechargement
      fetchAllShops
  };
}
