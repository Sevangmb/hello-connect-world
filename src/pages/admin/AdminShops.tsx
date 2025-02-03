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
          profiles:user_id (
            username,
            full_name
          ),
          shop_items (
            id
          )
        `);

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
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
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

      fetchShops();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
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

      fetchShops();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la boutique",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Boutiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Cette page permet aux administrateurs de visualiser et gérer les boutiques, d&apos;approuver ou rejeter les demandes, et d&apos;inspecter les détails de chaque boutique.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créée le</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell>{shop.name}</TableCell>
                  <TableCell>{shop.profiles?.username || shop.profiles?.full_name || 'Inconnu'}</TableCell>
                  <TableCell>{shop.shop_items?.length || 0}</TableCell>
                  <TableCell>
                    <Badge variant={
                      shop.status === 'approved' ? 'success' :
                      shop.status === 'rejected' ? 'destructive' :
                      'default'
                    }>
                      {shop.status === 'approved' ? 'Approuvée' :
                       shop.status === 'rejected' ? 'Rejetée' :
                       'En attente'}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(shop.created_at), 'dd/MM/yyyy')}</TableCell>
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
                              className="bg-red-600"
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