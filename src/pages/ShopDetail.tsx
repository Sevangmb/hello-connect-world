// Fix for isLoading property and favorite shop mutations
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useShop } from '@/hooks/useShop';

const ShopDetail = () => {
  const { shopId } = useParams();
  
  const { useShopById, useFavoriteShop, useUnfavoriteShop } = useShop();
  const favoriteShopMutation = useFavoriteShop();
  const unfavoriteShopMutation = useUnfavoriteShop();
  
  const { data: shop, isLoading, error } = useShopById(shopId || '');
  const isAddingToFavorites = favoriteShopMutation.isPending;
  const isRemovingFromFavorites = unfavoriteShopMutation.isPending;
  
  const handleFavoriteShop = async () => {
    if (!shopId) return;
    await favoriteShopMutation.mutateAsync(shopId);
  };
  
  const handleUnfavoriteShop = async () => {
    if (!shopId) return;
    await unfavoriteShopMutation.mutateAsync(shopId);
  };
  
  if (isLoading) {
    return <div>Loading shop details...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  if (!shop) {
    return <div>Shop not found</div>;
  }
  
  return (
    <div>
      <h1>{shop.name}</h1>
      <p>{shop.description}</p>
      <button
        onClick={handleFavoriteShop}
        disabled={isAddingToFavorites}
      >
        {isAddingToFavorites ? 'Adding to favorites...' : 'Add to Favorites'}
      </button>
      <button
        onClick={handleUnfavoriteShop}
        disabled={isRemovingFromFavorites}
      >
        {isRemovingFromFavorites ? 'Removing from favorites...' : 'Remove from Favorites'}
      </button>
    </div>
  );
};

export default ShopDetail;
