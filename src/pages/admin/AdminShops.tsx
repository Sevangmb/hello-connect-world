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
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      console.log("Fetching shops...");
      const { data, error } = await supabase
        .from("shops")
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching shops:", error);
        throw error;
      }

      console.log("Shops fetched:", data);
      setShops(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les boutiques",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (shopId, newStatus) => {
    try {
      const { error } = await supabase
        .from("shops")
        .update({ status: newStatus })
        .eq("id", shopId);

      if (error) throw error;

      setShops(shops.map(shop => 
        shop.id === shopId ? { ...shop, status: newStatus } : shop
      ));

      toast({
        title: "Statut mis à jour",
        description: `La boutique a été ${newStatus === "approved" ? "approuvée" : "rejetée"}`,
        variant: newStatus === "approved" ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating shop status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const handleDeleteShop = async (shopId) => {
    try {
      const { error } = await supabase
        .from("shops")
        .delete()
        .eq("id", shopId);

      if (error) throw error;

      setShops(shops.filter(shop => shop.id !== shopId));
      toast({
        title: "Boutique supprimée",
        description: "La boutique a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la boutique",
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
          <p className="mb-4">Cette page permet aux administrateurs de visualiser et gérer les boutiques, d'approuver ou rejeter les demandes, et d'inspecter les détails de chaque boutique.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell>{shop.name}</TableCell>
                  <TableCell>
                    {shop.profiles?.username || shop.profiles?.full_name || "Utilisateur inconnu"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        shop.status === "approved"
                          ? "default"
                          : shop.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {shop.status === "approved"
                        ? "Approuvée"
                        : shop.status === "rejected"
                        ? "Rejetée"
                        : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(shop.created_at), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="space-x-2">
                    {shop.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(shop.id, "approved")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(shop.id, "rejected")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette boutique ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteShop(shop.id)}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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