
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { Shop } from '@/core/shop/domain/types';

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useShopById, useIsShopFavorited } = useShop();
  const { shop, loading, error, fetchShop } = useShopById(id || '');
  const { isFavorited, toggleFavorite, checkFavorite } = useIsShopFavorited(id || '');
  
  useEffect(() => {
    if (id) {
      fetchShop();
      checkFavorite();
    }
  }, [id]);

  if (loading) return <div>Loading shop...</div>;
  if (error) return <div>Error loading shop: {error.message}</div>;
  if (!shop) return <div>Shop not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{shop.name}</h1>
          <button 
            onClick={() => toggleFavorite()}
            className={`px-4 py-2 rounded ${isFavorited ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            {isFavorited ? 'Unfavorite' : 'Favorite'}
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700">{shop.description}</p>
        </div>
        
        {shop.address && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <p className="text-gray-700">{shop.address}</p>
          </div>
        )}
        
        {shop.phone && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Contact</h2>
            <p className="text-gray-700">Phone: {shop.phone}</p>
            {shop.website && <p className="text-gray-700">Website: <a href={shop.website} className="text-blue-500">{shop.website}</a></p>}
          </div>
        )}
        
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Rating</h2>
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">{shop.average_rating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  className={`w-5 h-5 ${star <= shop.average_rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
