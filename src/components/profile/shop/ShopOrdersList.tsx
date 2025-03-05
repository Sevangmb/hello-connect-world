import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/core/shop/domain/types';
import { getShopServiceInstance } from '@/core/shop/infrastructure/ShopServiceProvider';

// Get ShopService instance
const shopService = getShopServiceInstance();

export default function ShopOrdersList() {
  const { shopId } = useParams<{ shopId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use mutation for updating order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      if (!shopId) throw new Error("Shop ID is required");
      return shopService.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour avec succès.",
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["shopOrders", shopId] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande.",
      });
      console.error("Error updating order status:", error);
    }
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (!shopId) return;
      
      try {
        setLoading(true);
        const shopOrders = await shopService.getShopOrders(shopId);
        setOrders(shopOrders || []);
      } catch (error) {
        console.error("Error fetching shop orders:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les commandes.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [shopId, toast]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Commandes de la boutique</h2>
      {loading ? (
        <p>Chargement des commandes...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>{order.total_amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select onValueChange={(value) => handleStatusChange(order.id, value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={order.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="shipped">Expédiée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                        <SelectItem value="returned">Retournée</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
