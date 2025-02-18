
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export function ShopItem() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('shop_items')
          .select(`
            *,
            clothes!shop_items_clothes_id_fkey (
              name,
              description,
              image_url
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        setItem(data);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (!user || !item) return;
    addToCart.mutate({
      shopItemId: item.id,
      quantity: 1
    });
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!item) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{item.clothes.name}</h1>
      <img
        src={item.clothes.image_url || "/placeholder.svg"}
        alt={item.clothes.name}
        className="w-full max-w-md rounded-lg mb-4"
      />
      <p className="text-gray-600 mb-4">{item.clothes.description}</p>
      <p className="text-xl font-semibold mb-4">{item.price}€</p>
      <Button 
        onClick={handleAddToCart}
        disabled={!user || addToCart.isPending}
        variant="default"
      >
        {addToCart.isPending ? "Ajout..." : "Ajouter au panier"}
      </Button>
    </div>
  );
}
