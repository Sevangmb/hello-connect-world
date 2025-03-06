
import { useEffect, useState } from 'react';
import { Shop, ShopItem } from '@/core/shop/domain/types';
import { shopService } from '@/core/shop/infrastructure/ShopServiceProvider';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

export const useShop = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  // Add useShopById hook for ShopDetail page
  const useShopById = (shopId: string) => {
    return useQuery({
      queryKey: ['shop', shopId],
      queryFn: () => shopService.getShopById(shopId),
      enabled: !!shopId
    });
  };

  // Add useCreateShop hook for CreateShopForm component
  const useCreateShop = () => {    
    const mutation = useMutation({
      mutationFn: (shopData: Partial<Shop>) => shopService.createShop(shopData),
      onSuccess: () => {
        toast({
          title: "Boutique créée",
          description: "Votre boutique a été créée avec succès.",
        });
        queryClient.invalidateQueries({ queryKey: ['user-shop'] });
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: `Une erreur est survenue lors de la création de votre boutique: ${error}`,
          variant: "destructive",
        });
      },
    });
    
    return {
      execute: mutation.mutateAsync,
      creating: mutation.isPending
    };
  };

  // Add useCreateShopItem hook for AddItemForm component
  const useCreateShopItem = () => {    
    const mutation = useMutation({
      mutationFn: (itemData: Partial<ShopItem>) => shopService.createShopItem(itemData),
      onSuccess: () => {
        toast({
          title: "Article ajouté",
          description: "L'article a été ajouté à votre boutique avec succès.",
        });
        if (shop) {
          queryClient.invalidateQueries({ queryKey: ['shop-items', shop.id] });
        }
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: `Une erreur est survenue lors de l'ajout de l'article: ${error}`,
          variant: "destructive",
        });
      },
    });
    
    return {
      execute: mutation.mutateAsync,
      creating: mutation.isPending
    };
  };

  return {
    shop,
    shopItems,
    loading,
    fetchShopByUserId,
    fetchShopItems,
    shopService,
    useIsShopFavorited,
    useShopById,
    useCreateShop,
    useCreateShopItem
  };
};
