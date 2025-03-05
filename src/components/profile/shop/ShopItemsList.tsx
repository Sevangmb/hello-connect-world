
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShopItem, ShopItemStatus } from '@/core/shop/domain/types';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Updated interface to include limit
export interface ShopItemsListProps {
  shopId: string;
  isOwner?: boolean;
  limit?: number;
}

const ShopItemsList: React.FC<ShopItemsListProps> = ({ 
  shopId, 
  isOwner = false,
  limit 
}) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState<string | null>(null);

  // Load shop items
  const loadItems = async () => {
    try {
      setLoading(true);
      
      // Get shop items (this would be implemented in a real hook)
      // const data = await getShopItems(shopId);
      const data: ShopItem[] = []; // Placeholder for real data
      
      // Apply limit if provided
      if (limit && data.length > limit) {
        setItems(data.slice(0, limit));
      } else {
        setItems(data);
      }
    } catch (error) {
      console.error('Error loading shop items:', error);
      toast({
        variant: "destructive",
        title: "Error loading shop items",
        description: "There was a problem loading the shop items."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [shopId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle status change
  const handleStatusChange = async (itemId: string, status: ShopItemStatus) => {
    setIsChangingStatus(itemId);
    try {
      // This would be implemented in a real hook
      // await updateShopItemStatus(itemId, status);
      
      // Update local state
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, status } : item
        )
      );
      
      toast({
        title: "Status updated",
        description: `Item status has been updated to ${status}.`
      });
    } catch (error) {
      console.error('Error updating item status:', error);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: "There was a problem updating the item status."
      });
    } finally {
      setIsChangingStatus(null);
    }
  };

  // Handle item deletion
  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    setIsDeleting(itemId);
    try {
      // This would be implemented in a real hook
      // await removeShopItem(itemId);
      
      // Update local state
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      toast({
        title: "Item deleted",
        description: "The item has been deleted from your shop."
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        variant: "destructive",
        title: "Error deleting item",
        description: "There was a problem deleting the item."
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="h-10 w-10 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No items found</h3>
            <p className="text-sm text-gray-500 mt-1">
              This shop doesn't have any items yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items {limit && items.length >= limit && '(Limited View)'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              {isOwner && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={
                    item.status === 'available' ? 'success' : 
                    item.status === 'sold_out' ? 'destructive' : 
                    'secondary'
                  }>
                    {item.status}
                  </Badge>
                </TableCell>
                {isOwner && (
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {/* Edit functionality */}}
                      disabled={isChangingStatus === item.id || isDeleting === item.id}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      disabled={isChangingStatus === item.id || isDeleting === item.id}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {limit && items.length >= limit && isOwner && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => {/* View all items */}}>
              View All Items
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopItemsList;
