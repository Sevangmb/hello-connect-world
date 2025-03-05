
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShopItemCard } from "./components/ShopItemCard";
import { ShopItemsFilter } from "./components/ShopItemsFilter";
import { useShop } from "@/hooks/useShop";
import { Loader2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

interface ShopItemsProps {
  shopId: string;
}

export function ShopItems({ shopId }: ShopItemsProps) {
  const { useShopItems } = useShop(null);
  const { data: shopItems, isLoading } = useShopItems(shopId);
  const [filter, setFilter] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart(user?.id || null);

  // Filtrer les articles
  const filteredItems = shopItems?.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

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
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ShopItemsFilter value={filter} onChange={setFilter} />

      {filteredItems && filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              action={
                <Button 
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() => handleAddToCart(item.id)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ajouter au panier
                </Button>
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Aucun article trouvé</h3>
          <p className="text-muted-foreground">
            Cette boutique n'a pas encore d'articles ou aucun article ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
}
