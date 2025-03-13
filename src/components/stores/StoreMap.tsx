
import React from 'react';
import ShopMap from '@/components/shop/ShopMap';
import { useNavigate } from 'react-router-dom';

// Interface pour les boutiques à afficher sur la carte
interface ShopLocation {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface StoreMapProps {
  stores?: ShopLocation[];
  shops?: ShopLocation[]; // Pour la compatibilité avec l'ancien format
  isLoading?: boolean;
  onShopSelect?: (shopId: string) => void;
}

const StoreMap: React.FC<StoreMapProps> = ({ 
  stores = [], 
  shops = [],
  isLoading = false,
  onShopSelect
}) => {
  const navigate = useNavigate();
  
  // Utiliser soit stores, soit shops (pour la compatibilité)
  const mapStores = stores.length > 0 ? stores : shops;

  // Gérer la sélection de boutique
  const handleShopSelect = (shopId: string) => {
    if (onShopSelect) {
      onShopSelect(shopId);
    } else {
      navigate(`/shops/${shopId}`);
    }
  };

  return (
    <ShopMap 
      shops={mapStores}
      isLoading={isLoading}
      onShopSelect={handleShopSelect}
    />
  );
};

export default StoreMap;
