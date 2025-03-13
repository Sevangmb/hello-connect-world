
import { NearbyShop, ShopStatus } from './messages';

// Type Store pour rétrocompatibilité
export interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  logo_url?: string | null;
  banner_url?: string | null;
  status: ShopStatus;
  categories: string[];
  opening_hours: any;
  average_rating: number;
  phone: string;  // Requis dans Store
  website: string; // Requis dans Store
  profiles: { username: string | null }; // Making profiles required
  shop_items?: { id: string }[];
  distance?: number;
}

// Fonction utilitaire pour convertir NearbyShop en Store
export const convertToStore = (shop: NearbyShop): Store => {
  return {
    ...shop,
    address: shop.address || '',
    latitude: shop.latitude || 0,
    longitude: shop.longitude || 0,
    categories: shop.categories || [],
    average_rating: shop.average_rating || 0,
    phone: shop.phone || '',
    website: shop.website || '',
    opening_hours: shop.opening_hours || {},
    profiles: shop.profiles || { username: null }
  };
};

// Fonction utilitaire pour convertir Store en NearbyShop
export const convertToNearbyShop = (store: Store): NearbyShop => {
  return {
    ...store,
    status: store.status as ShopStatus,
  };
};
