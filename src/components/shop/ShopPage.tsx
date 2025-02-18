
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ShopItem } from "./ShopItem";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export function ShopPage() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { cartItems } = useCart();

  useEffect(() => {
    const fetchShopAndItems = async () => {
      try {
        if (!id) return;

        // Récupérer les informations de la boutique
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (shopError) throw shopError;
        setShop(shopData);

        // Récupérer les articles de la boutique
        const { data: itemsData, error: itemsError } = await supabase
          .from('shop_items')
          .select(`
            *,
            clothes!shop_items_clothes_id_fkey (
              name,
              description,
              image_url
            )
          `)
          .eq('shop_id', id);

        if (itemsError) throw itemsError;
        setItems(itemsData);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndItems();
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!shop) {
    return <div>Boutique non trouvée</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{shop.name}</h1>
        <p className="text-gray-600">{shop.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ShopItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
