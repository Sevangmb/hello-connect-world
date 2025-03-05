
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ShoppingCart } from 'lucide-react';
import { useShop } from '@/hooks/useShop';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ShopItem } from '@/core/shop/domain/types';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ShopItemsListProps {
  shopId: string;
  isOwner: boolean;
}

export function ShopItemsList({ shopId, isOwner }: ShopItemsListProps) {
  const { getShopItems, updateShopItemStatus, removeShopItem } = useShop(shopId);
  const { toast } = useToast();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const items = await getShopItems(shopId);
        setItems(items);
      } catch (error) {
        console.error('Error loading shop items:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les articles. Veuillez réessayer.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [shopId, getShopItems, toast]);

  const handleStatusChange = async (itemId: string, status: ShopItem['status']) => {
    try {
      await updateShopItemStatus.mutateAsync({ itemId, status });
      
      // Update local state
      setItems(items.map(item => 
        item.id === itemId ? { ...item, status } : item
      ));
      
      toast({
        title: 'Statut mis à jour',
        description: `Le statut de l'article a été changé à ${status}`,
      });
    } catch (error) {
      console.error('Error updating item status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    try {
      await removeShopItem.mutateAsync(itemId);
      
      // Update local state
      setItems(items.filter(item => item.id !== itemId));
      
      toast({
        title: 'Article supprimé',
        description: 'L\'article a été supprimé avec succès',
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  const addToCart = (item: ShopItem) => {
    // Placeholder for cart functionality
    toast({
      title: 'Ajouté au panier',
      description: `${item.name} a été ajouté à votre panier`,
    });
  };

  const getStatusBadge = (status: ShopItem['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="default">Disponible</Badge>;
      case 'sold_out':
        return <Badge variant="secondary">Épuisé</Badge>;
      case 'archived':
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Aucun article</h3>
        <p className="text-muted-foreground">
          {isOwner 
            ? 'Votre boutique ne contient aucun article. Ajoutez des articles pour commencer à vendre.' 
            : 'Cette boutique ne contient aucun article pour le moment.'}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.price.toFixed(2)} €</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {isOwner ? (
                        <>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addToCart(item)}
                          disabled={item.status !== 'available' || item.stock <= 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Ajouter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
