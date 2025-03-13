
import React from 'react';
import ShopMap from '@/components/shop/ShopMap';
import { useNavigate } from 'react-router-dom';
import { Store } from '@/hooks/useStores';

interface StoreMapProps {
  stores?: Store[];
  isLoading?: boolean;
}

const StoreMap: React.FC<StoreMapProps> = ({ 
  stores = [], 
  isLoading = false 
}) => {
  const navigate = useNavigate();

  // Convert stores to the format expected by ShopMap
  const mapStores = stores.map(store => ({
    id: store.id,
    name: store.name,
    description: store.description || '',
    latitude: store.latitude || 0,
    longitude: store.longitude || 0,
    address: store.address || '',
  })).filter(store => store.latitude && store.longitude);

  // Handle shop selection
  const handleShopSelect = (shopId: string) => {
    navigate(`/shops/${shopId}`);
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
