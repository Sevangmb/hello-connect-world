
import React from 'react';
import { useParams } from 'react-router-dom';
import { useShop } from '@/hooks/useShop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { useShopById } = useShop();
  const { data: shop, isLoading, error } = useShopById(shopId || '');
  const { toast } = useToast();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error || !shop) {
    return <div>Une erreur est survenue lors du chargement de la boutique.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{shop.name}</h1>
          <Button>Contacter le vendeur</Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img 
              src={shop.image_url || "/placeholder.svg"} 
              alt={shop.name}
              className="w-full h-64 object-cover rounded-lg" 
            />
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold">À propos de la boutique</h3>
              <p className="mt-2 text-gray-600">{shop.description || "Aucune description disponible."}</p>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Informations</h3>
              <div className="mt-2 space-y-2">
                {shop.address && (
                  <p className="text-sm">
                    <span className="font-medium">Adresse:</span> {shop.address}
                  </p>
                )}
                {shop.phone && (
                  <p className="text-sm">
                    <span className="font-medium">Téléphone:</span> {shop.phone}
                  </p>
                )}
                {shop.website && (
                  <p className="text-sm">
                    <span className="font-medium">Site web:</span> {shop.website}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Note moyenne:</span> {shop.average_rating?.toFixed(1) || "N/A"} / 5
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Articles</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* This would be populated with shop items fetched separately */}
              <Card className="p-4 flex flex-col">
                <div className="text-center">Aucun article disponible pour le moment.</div>
              </Card>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Avis ({shop.rating_count || 0})</h2>
              
              <div>
                {/* This would be populated with shop reviews fetched separately */}
                <div className="text-center py-8">
                  Aucun avis pour le moment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShopDetail;
