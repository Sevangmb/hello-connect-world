
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { Card } from '@/components/ui/card';
import { ShopSettings, Shop, mapSettings } from '@/core/shop/domain/types';
import { Button } from '@/components/ui/button';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getShopById, getShopSettings } = useShop();
  const { data: shop, isLoading: loadingShop } = getShopById(id);
  const { data: settingsData, isLoading: loadingSettings } = getShopSettings(id);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  
  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData]);
  
  if (loadingShop || loadingSettings) {
    return <div className="p-8 text-center">Chargement...</div>;
  }
  
  if (!shop) {
    return <div className="p-8 text-center">Boutique non trouvée</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {shop.image_url ? (
            <img 
              src={shop.image_url}
              alt={shop.name}
              className="w-full md:w-64 h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full md:w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Aucune image</span>
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{shop.name}</h1>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="mr-2">⭐ {shop.average_rating.toFixed(1)}</span>
              <span>({shop.rating_count || 0} avis)</span>
            </div>
            
            <p className="text-gray-700 mb-4">{shop.description}</p>
            
            {shop.categories && shop.categories.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Catégories</h3>
                <div className="flex flex-wrap gap-2">
                  {shop.categories.map(category => (
                    <span 
                      key={category}
                      className="px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {shop.address && (
              <div className="mb-2">
                <h3 className="text-sm font-medium mb-1">Adresse</h3>
                <p className="text-gray-700">{shop.address}</p>
              </div>
            )}
            
            {shop.phone && (
              <div className="mb-2">
                <h3 className="text-sm font-medium mb-1">Téléphone</h3>
                <p className="text-gray-700">{shop.phone}</p>
              </div>
            )}
            
            {shop.website && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Site web</h3>
                <a 
                  href={shop.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {shop.website}
                </a>
              </div>
            )}
            
            <div className="flex gap-2 mt-6">
              <Button>Voir les produits</Button>
              <Button variant="outline">Contacter</Button>
            </div>
          </div>
        </div>
      </Card>
      
      {settings && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Informations pratiques</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Options de livraison</h3>
              <ul className="list-disc list-inside text-gray-700">
                {settings.delivery_options.map(option => (
                  <li key={option}>
                    {option === 'pickup' && 'Retrait en boutique'}
                    {option === 'delivery' && 'Livraison à domicile'}
                    {option === 'both' && 'Retrait et livraison disponibles'}
                  </li>
                ))}
                {settings.delivery_options.length === 0 && (
                  <li>Aucune option de livraison spécifiée</li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Moyens de paiement</h3>
              <ul className="list-disc list-inside text-gray-700">
                {settings.payment_methods.map(method => (
                  <li key={method}>
                    {method === 'card' && 'Carte bancaire'}
                    {method === 'paypal' && 'PayPal'}
                    {method === 'bank_transfer' && 'Virement bancaire'}
                    {method === 'cash' && 'Espèces (en personne)'}
                  </li>
                ))}
                {settings.payment_methods.length === 0 && (
                  <li>Aucun moyen de paiement spécifié</li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      )}
      
      {/* Add shop items section here */}
    </div>
  );
};

export default ShopDetail;
