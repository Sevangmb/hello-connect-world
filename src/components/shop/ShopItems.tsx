
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckoutButton } from "./CheckoutButton";

export function ShopItems({ shopId }: { shopId: string }) {
  const { data: items, isLoading } = useQuery({
    queryKey: ["shop-items", shopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_items')
        .select(`
          *,
          clothes (
            name,
            description,
            image_url
          ),
          shop:shops (
            name,
            user_id
          )
        `)
        .eq('shop_id', shopId)
        .eq('status', 'available');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!items?.length) {
    return <div>Aucun article en vente dans cette boutique</div>;
  }

  const processedItems = items.map(item => ({
    id: item.id,
    name: item.clothes.name,
    description: item.clothes.description,
    price: item.price,
    image: item.clothes.image_url,
    shop_id: item.shop_id,
    seller_id: item.shop.user_id
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            {item.clothes.image_url && (
              <img
                src={item.clothes.image_url}
                alt={item.clothes.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h3 className="font-semibold text-lg">{item.clothes.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.clothes.description}</p>
            <div className="flex justify-between items-center">
              <Badge variant="secondary">{item.price}€</Badge>
            </div>
          </Card>
        ))}
      </div>
      
      {items.length > 0 && (
        <div className="mt-6">
          <CheckoutButton items={processedItems} />
        </div>
      )}
    </div>
  );
}
