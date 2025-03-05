
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ShoppingBag, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { useShop } from '@/hooks/useShop';
import { useCart } from '@/hooks/cart';
import { useAuth } from '@/hooks/useAuth';
import { ShopItem } from '@/core/shop/domain/types';

export interface ShopItemsListProps {
  shopId: string;
  isOwner: boolean;
}

export function ShopItemsList({ shopId, isOwner }: ShopItemsListProps) {
  const { user } = useAuth();
  const { addToCart } = useCart(user?.id || null);
  const { getShopItems, updateShopItemStatus, removeShopItem } = useShop(null);
  const { toast } = useToast();
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  
  const { data: items, isLoading, error } = getShopItems(shopId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Erreur lors du chargement des articles: {error.message}
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {isOwner ? 
          'Vous n\'avez pas encore ajouté d\'articles à votre boutique.' : 
          'Cette boutique n\'a pas encore d\'articles.'}
      </div>
    );
  }
  
  const handleAddToCart = async (item: ShopItem) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous devez être connecté pour ajouter au panier',
      });
      return;
    }
    
    try {
      await addToCart.mutateAsync({
        user_id: user.id,
        item_id: item.id,
        quantity: 1
      });
      
      toast({
        title: 'Article ajouté',
        description: 'L\'article a été ajouté à votre panier',
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ajouter l\'article au panier',
      });
    }
  };
  
  const handleStatusChange = async (itemId: string, newStatus: 'available' | 'sold_out' | 'archived') => {
    try {
      await updateShopItemStatus.mutateAsync({ itemId, status: newStatus });
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de l\'article a été mis à jour avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut de l\'article.',
      });
    }
  };
  
  const handleDeleteConfirm = async (itemId: string) => {
    if (deleteItem !== itemId) {
      setDeleteItem(itemId);
      return;
    }
    
    try {
      await removeShopItem.mutateAsync(itemId);
      setDeleteItem(null);
      toast({
        title: 'Article supprimé',
        description: 'L\'article a été supprimé de votre boutique.',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article.',
      });
    }
  };
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-48 w-full object-cover"
            />
          )}
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium truncate">{item.name}</h3>
              <Badge variant={
                item.status === 'available' ? 'default' :
                item.status === 'sold_out' ? 'secondary' : 'outline'
              }>
                {item.status === 'available' ? 'Disponible' :
                 item.status === 'sold_out' ? 'Épuisé' : 'Archivé'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">{formatPrice(item.price)}</span>
              {item.original_price && (
                <span className="text-sm line-through text-muted-foreground">
                  {formatPrice(item.original_price)}
                </span>
              )}
            </div>
            
            {item.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {item.description}
              </p>
            )}
            
            <div className="mt-2 flex gap-2">
              {isOwner ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-1 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDeleteConfirm(item.id)}
                  >
                    <Trash className="mr-1 h-4 w-4" />
                    {deleteItem === item.id ? 'Confirmer' : 'Supprimer'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  disabled={item.status !== 'available' || addToCart.isPending}
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Ajouter au panier
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
