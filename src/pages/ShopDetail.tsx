
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShopSettings, Shop } from '@/core/shop/domain/types';
import { ShopReviewsList } from '@/components/profile/shop/ShopReviewsList';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getShopById, getShopSettings } = useShop();
  const [shop, setShop] = useState<Shop | null>(null);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadShopData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const shopData = await getShopById(id);
          setShop(shopData);
          
          if (shopData) {
            const settingsData = await getShopSettings(shopData.id);
            setSettings(settingsData);
          }
        } catch (error) {
          console.error('Error loading shop:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadShopData();
  }, [id, getShopById, getShopSettings]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!shop) {
    return <div>Boutique non trouvée</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{shop.name}</h1>
        <Button>Contacter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{shop.description || "Aucune description disponible."}</p>
              
              {shop.address && (
                <div className="mt-4">
                  <h3 className="font-semibold">Adresse</h3>
                  <p>{shop.address}</p>
                </div>
              )}
              
              {settings && settings.payment_methods && settings.payment_methods.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Moyens de paiement acceptés</h3>
                  <ul className="list-disc list-inside">
                    {settings.payment_methods.map((method, index) => (
                      <li key={index}>{method}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {settings && settings.delivery_options && settings.delivery_options.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Options de livraison</h3>
                  <ul className="list-disc list-inside">
                    {settings.delivery_options.map((option, index) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            {shop.id && <ShopReviewsList shopId={shop.id} />}
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              {shop.phone && (
                <div className="mb-2">
                  <h3 className="font-semibold">Téléphone</h3>
                  <p>{shop.phone}</p>
                </div>
              )}
              
              {shop.website && (
                <div className="mb-2">
                  <h3 className="font-semibold">Site web</h3>
                  <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {shop.website}
                  </a>
                </div>
              )}
              
              {shop.profiles && shop.profiles.username && (
                <div className="mb-2">
                  <h3 className="font-semibold">Vendeur</h3>
                  <p>{shop.profiles.full_name || shop.profiles.username}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
