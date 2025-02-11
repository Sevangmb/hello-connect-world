
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckoutButton } from "./CheckoutButton";

export function ShopItems({ shopId }: { shopId: string }) {
  const { data: items, isLoading } = useQuery({
    queryKey: ["shop-items", shopId],
    queryFn: async () => {
      // D'abord, vérifier les vêtements directement liés à la boutique
      const { data: shopItems, error: shopItemsError } = await supabase
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

      if (shopItemsError) throw shopItemsError;

      // Ensuite, vérifier les vêtements marqués à vendre qui ne sont pas encore dans la boutique
      const { data: availableClothes, error: clothesError } = await supabase
        .from('clothes')
        .select(`
          id,
          name,
          description,
          image_url,
          price,
          user_id
        `)
        .eq('is_for_sale', true)
        .eq('shop_id', shopId)
        .not('id', 'in', shopItems?.map(item => item.clothes_id) || []);

      if (clothesError) throw clothesError;

      // Pour les vêtements qui ne sont pas encore dans shop_items, les ajouter automatiquement
      if (availableClothes && availableClothes.length > 0) {
        const { error: insertError } = await supabase
          .from('shop_items')
          .insert(
            availableClothes.map(cloth => ({
              shop_id: shopId,
              clothes_id: cloth.id,
              price: cloth.price,
              status: 'available'
            }))
          );

        if (insertError) {
          console.error('Error adding clothes to shop:', insertError);
        }
      }

      // Refaire la requête pour avoir tous les articles à jour
      const { data: finalItems, error: finalError } = await supabase
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

      if (finalError) throw finalError;
      return finalItems;
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
