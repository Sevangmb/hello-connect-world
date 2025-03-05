import React from 'react';

interface ShopOrdersListProps {
  shopId: string;
}

export const ShopOrdersList: React.FC<ShopOrdersListProps> = ({ shopId }) => {
  return (
    <div>
      <h2>Shop Orders for shop {shopId}</h2>
      {/* Orders list implementation */}
    </div>
  );
};
