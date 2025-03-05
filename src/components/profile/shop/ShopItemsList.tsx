import React from 'react';

interface ShopItemsListProps {
  shopId: string;
}

export const ShopItemsList: React.FC<ShopItemsListProps> = ({ shopId }) => {
  return (
    <div>
      <h2>Shop Items for shop {shopId}</h2>
      {/* Items list implementation */}
    </div>
  );
};
