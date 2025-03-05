
// Correction du type trop profond et de la propriété shop manquante
interface ShopItemsQueryParams {
  shopId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  userId?: string;
}

// Définir une interface intermédiaire pour éviter la récursion de type
interface RawShopItemWithShop extends RawShopItem {
  shop?: {
    name: string;
  };
}

// Dans la fonction fetch, mapper correctement les données
const transformItems = (rawItems: RawShopItemWithShop[]): ShopItem[] => {
  return rawItems.map(item => ({
    id: item.id,
    shop_id: item.shop_id,
    name: item.name || '',
    description: item.description || '',
    price: item.price,
    original_price: item.original_price,
    stock: item.stock,
    image_url: item.image_url,
    status: item.status as ShopItemStatus,
    created_at: item.created_at,
    updated_at: item.updated_at,
    clothes_id: item.clothes_id,
    shop: {
      name: item.shop?.name || ''
    }
  }));
};
