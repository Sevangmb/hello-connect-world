
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { useShopItems } from "./hooks/useShopItems";
import { ShopItemsFilter } from "./components/ShopItemsFilter";
import { ShopItemCard } from "./components/ShopItemCard";
import { RawShopItem, ShopItem } from "./types/shop-items";

export function ShopItems({ shopId }: { shopId: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: items, isLoading } = useShopItems({
    shopId,
    sortBy,
    searchQuery,
  });

  const handleAddToCart = async (item: ShopItem) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des articles au panier",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    addToCart.mutate({
      shopItemId: item.id,
      quantity: 1
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Chargement des articles...
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="text-center py-8 text-gray-600">
        Aucun article en vente dans cette boutique
      </div>
    );
  }

  const processedItems: ShopItem[] = items.map((item: RawShopItem) => ({
    id: item.id,
    name: item.clothes.name,
    description: item.clothes.description,
    price: item.price,
    image: item.clothes.image_url,
    shop_id: item.shop.id,
    seller_id: item.shop.user_id,
    category: item.clothes.category || undefined,
    size: item.clothes.size || undefined,
    brand: item.clothes.brand || undefined,
    original_price: item.original_price || item.clothes.original_price || undefined,
    status: item.status
  }));

  return (
    <div className="space-y-6">
      <ShopItemsFilter
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {processedItems.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            onAddToCart={handleAddToCart}
            isAddingToCart={addToCart.isPending}
          />
        ))}
      </div>
    </div>
  );
}
