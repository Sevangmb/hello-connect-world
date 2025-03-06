
import React from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { useShopById } = useShop();
  const { data: shop, isLoading, isError } = useShopById(id);

  if (isLoading) {
    return <div>Loading shop details...</div>;
  }

  if (isError || !shop) {
    return <div>Error loading shop or shop not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
      <p className="text-gray-600 mb-6">{shop.description}</p>
      
      {/* Shop details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Informations</h2>
          <div className="bg-gray-50 p-4 rounded-md">
            {shop.address && (
              <p className="mb-2">
                <span className="font-medium">Adresse:</span> {shop.address}
              </p>
            )}
            {shop.phone && (
              <p className="mb-2">
                <span className="font-medium">Téléphone:</span> {shop.phone}
              </p>
            )}
            {shop.website && (
              <p className="mb-2">
                <span className="font-medium">Site web:</span>{' '}
                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {shop.website}
                </a>
              </p>
            )}
            <p className="mb-2">
              <span className="font-medium">Note moyenne:</span> {shop.average_rating || 'Aucune note'}
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Catégories</h2>
          <div className="flex flex-wrap gap-2">
            {shop.categories && shop.categories.length > 0 ? (
              shop.categories.map((category, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {category}
                </span>
              ))
            ) : (
              <p>Aucune catégorie</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Shop items will be added here */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Shop items */}
          <p>Liste des articles à venir</p>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
