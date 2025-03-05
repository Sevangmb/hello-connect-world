
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useShop } from '@/hooks/useShop';
import { ShopItem } from '@/core/shop/domain/types';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ShopItemsListProps {
  shopId: string;
  isOwner: boolean;
}

export function ShopItemsList({ shopId, isOwner }: ShopItemsListProps) {
  const { getShopItems, updateShopItemStatus, removeShopItem } = useShop();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const shopItems = await getShopItems(shopId);
        setItems(shopItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchItems();
    }
  }, [shopId, getShopItems]);

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;

    try {
      await removeShopItem.mutateAsync(deleteItemId);
      // Remove the item from the local state
      setItems(items.filter(item => item.id !== deleteItemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeleteItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Aucun article dans cette boutique</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Statut</TableHead>
            {isOwner && <TableHead className="w-24">Actions</TableHead>}
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
                    className="h-12 w-12 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.price.toFixed(2)} €</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'available' ? 'bg-green-100 text-green-800' :
                  item.status === 'sold_out' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </TableCell>
              {isOwner && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {/* Handle edit */}}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeleteItemId(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cet article sera définitivement supprimé de votre boutique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteItem}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
