
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useShop } from '@/hooks/useShop';
import { ShopItems } from '@/components/shop/ShopItems';

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const { useShopById } = useShop();
  const { data: shop, isLoading: isShopLoading, error } = useShopById(id);

  if (isShopLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500">Error loading shop</h2>
        <p className="text-gray-500">{error?.message || 'Shop not found'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{shop.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {shop.image_url && (
              <div className="md:w-1/3">
                <img 
                  src={shop.image_url} 
                  alt={shop.name} 
                  className="w-full h-auto rounded-lg object-cover" 
                />
              </div>
            )}
            <div className="md:w-2/3 space-y-4">
              <p className="text-lg">{shop.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {shop.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p>{shop.address}</p>
                  </div>
                )}
                
                {shop.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p>{shop.phone}</p>
                  </div>
                )}
                
                {shop.website && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Website</h3>
                    <a 
                      href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {shop.website}
                    </a>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                  <p>{shop.average_rating.toFixed(1)} / 5 ({shop.rating_count || 0} reviews)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ShopItems />
    </div>
  );
}
