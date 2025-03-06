
import { useEffect, useState } from 'react';
import { Shop, ShopItem } from '@/core/shop/domain/types';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

export const useShop = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShopByUserId = async (): Promise<Shop> => {
    if (!user?.id) throw new Error('User not logged in');
    const shop = await shopService.getShopByUserId(user.id);
    return shop;
  };

  const fetchShopItems = async (shopId: string): Promise<ShopItem[]> => {
    const items = await shopService.getShopItems(shopId);
    return items;
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadShop = async () => {
      try {
        setLoading(true);
        const fetchedShop = await fetchShopByUserId();
        setShop(fetchedShop);

        if (fetchedShop) {
          const items = await fetchShopItems(fetchedShop.id);
          setShopItems(items);
        }
      } catch (error) {
        console.error('Error loading shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShop();
  }, [user?.id]);

  const useIsShopFavorited = (shopId: string) => {
    const { data: isFavorited, isLoading, refetch } = useQuery({
      queryKey: ['shop-favorite', shopId, user?.id],
      queryFn: () => shopService.isShopFavorited(shopId, user?.id || ''),
      enabled: !!shopId && !!user?.id
    });

    return { isFavorited, isLoading, refetch };
  };

  return {
    shop,
    shopItems,
    loading,
    fetchShopByUserId,
    fetchShopItems,
    shopService,
    useIsShopFavorited
  };
};
