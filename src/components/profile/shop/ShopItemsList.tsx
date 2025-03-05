
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye, Pencil, AlertTriangle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useShop } from '@/hooks/useShop';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export function ShopItemsList() {
  const { shopItems, loading, isShopOwner, shop } = useShop();
  const { user } = useAuth();
  const { addToCart, isCartLoading } = useCart(user?.id || null);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="h-64 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!shopItems || shopItems.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-gray-50">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <ShoppingCart className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">Aucun article</h3>
        <p className="text-muted-foreground mt-1">
          {isShopOwner 
            ? "Vous n'avez pas encore ajouté d'articles à votre boutique."
            : "Cette boutique n'a pas encore d'articles."}
        </p>
        
        {isShopOwner && shop?.status === 'approved' && (
          <Button className="mt-4">
            Ajouter un article
          </Button>
        )}
      </div>
    );
  }
  
  const handleAddToCart = async (itemId: string) => {
    if (!user) return;
    
    await addToCart({
      user_id: user.id,
      item_id: itemId,
      quantity: 1
    });
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopItems.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col">
            {item.image_url ? (
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-gray-300" />
              </div>
            )}
            
            <CardContent className="p-4 flex-grow">
              <h3 className="font-medium truncate">{item.name}</h3>
              
              <div className="mt-1 flex justify-between items-center">
                <span className="font-bold">
                  {formatPrice(item.price)}
                </span>
                
                {item.original_price && item.original_price > item.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(item.original_price)}
                  </span>
                )}
                
                {item.status !== 'available' && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    {item.status === 'sold_out' ? 'Épuisé' : 'Archivé'}
                  </span>
                )}
              </div>
              
              {item.stock <= 5 && item.stock > 0 && item.status === 'available' && (
                <p className="text-xs text-amber-600 mt-1 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Plus que {item.stock} en stock
                </p>
              )}
            </CardContent>
            
            <CardFooter className="p-4 pt-0 flex gap-2">
              {isShopOwner ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1"
                    disabled={item.status !== 'available' || item.stock <= 0 || isCartLoading}
                    onClick={() => handleAddToCart(item.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Acheter
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
