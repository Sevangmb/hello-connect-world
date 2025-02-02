import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminShops() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Fetching shops...");
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      console.log("Starting shops fetch");
      const { data: userData } = await supabase.auth.getUser();
      console.log("Current user:", userData);

      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          profiles:user_id (username),
          shop_items (
            id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching shops:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les boutiques",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetched shops:", data);
      setShops(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateShopStatus = async (shopId: string, status: 'approved' | 'rejected') => {
    try {
      console.log(`Updating shop ${shopId} status to ${status}`);
      const { error } = await supabase
        .from('shops')
        .update({ status })
        .eq('id', shopId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `La boutique a été ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
      });

      // Refresh shops list
      fetchShops();
    } catch (error) {
      console.error('Error updating shop status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la boutique",
        variant: "destructive",
      });
    }
  };

  const deleteShop = async (shopId: string) => {
    try {
      console.log(`Deleting shop ${shopId}`);
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', shopId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La boutique a été supprimée",
      });

      // Refresh shops list
      fetchShops();
    } catch (error) {
      console.error('Error deleting shop:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la boutique",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des boutiques</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="font-medium">{shop.name}</TableCell>
                  <TableCell>{shop.profiles?.username || 'Inconnu'}</TableCell>
                  <TableCell>{shop.shop_items?.length || 0}</TableCell>
                  <TableCell>{getStatusBadge(shop.status)}</TableCell>
                  <TableCell>
                    {format(new Date(shop.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {shop.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => updateShopStatus(shop.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => updateShopStatus(shop.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la boutique</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette boutique ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteShop(shop.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}