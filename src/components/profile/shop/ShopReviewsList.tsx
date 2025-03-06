
import React from 'react';

interface ShopReviewsListProps {
  shopId: string;
}

const ShopReviewsList: React.FC<ShopReviewsListProps> = ({ shopId }) => {
  return (
    <div>
      <h2>Shop Reviews for shop {shopId}</h2>
      {/* Reviews list implementation */}
    </div>
  );
};

export default ShopReviewsList;
