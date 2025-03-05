
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Pencil, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useShop } from "@/hooks/useShop";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { ShopItem } from "@/core/shop/domain/types";

interface ShopItemsListProps {
  shopId: string;
  isOwner: boolean;
}

export function ShopItemsList({ shopId, isOwner }: ShopItemsListProps) {
  const { useShopItems } = useShop(null);
  const { data: items, isLoading } = useShopItems(shopId);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart(user?.id || null);
  const { toast } = useToast();

  const handleAddToCart = (itemId: string) => {
    if (!user) {
      toast({
        title: "Connectez-vous",
        description: "Vous devez être connecté pour ajouter des articles au panier.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart.mutate({
      user_id: user.id,
      item_id: itemId,
      quantity: 1
    });
  };

  const handleEdit = (item: ShopItem) => {
    setSelectedItem(item);
    setShowEditDialog(true);
  };

  const handleDelete = (item: ShopItem) => {
    setSelectedItem(item);
    setShowDeleteDialog(true);
  };

  if (isLoading) {
    return <div>Chargement des articles...</div>;
  }

  return (
    <div>
      {isOwner && (
        <div className="flex justify-end mb-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>
      )}

      {!items || items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  <Badge variant={
                    item.status === 'available' ? "default" :
                    item.status === 'sold_out' ? "secondary" : "destructive"
                  }>
                    {item.status === 'available' ? "Disponible" :
                     item.status === 'sold_out' ? "Épuisé" : "Archivé"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {!isOwner && item.status === 'available' && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {isOwner && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedItem?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive">
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog would go here */}
    </div>
  );
}
