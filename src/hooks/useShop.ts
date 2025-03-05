
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getShopService } from "@/core/shop/infrastructure/ShopServiceProvider";
import { Shop, ShopItem, ShopStatus } from "@/core/shop/domain/types";
import { useToast } from "./use-toast";

/**
 * Hook pour la gestion des boutiques
 */
export const useShop = (shopId?: string, userId?: string | null) => {
  const shopService = getShopService();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Récupérer une boutique par son ID
  const { 
    data: shop,
    isLoading: isShopLoading,
    refetch: refetchShop
  } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => shopService.getShopById(shopId!),
    enabled: !!shopId,
  });
  
  // Récupérer la boutique de l'utilisateur connecté
  const { 
    data: userShop,
    isLoading: isUserShopLoading,
    refetch: refetchUserShop
  } = useQuery({
    queryKey: ['userShop', userId],
    queryFn: () => shopService.getUserShop(userId!),
    enabled: !!userId,
  });
  
  // Récupérer tous les articles d'une boutique
  const { 
    data: shopItems,
    isLoading: areShopItemsLoading,
    refetch: refetchShopItems
  } = useQuery({
    queryKey: ['shopItems', shopId],
    queryFn: () => shopService.getShopItems(shopId!),
    enabled: !!shopId,
  });
  
  // Créer une boutique
  const createShop = useMutation({
    mutationFn: (shopData: { user_id: string; name: string; description: string; image_url?: string }) => {
      return shopService.createShop({
        ...shopData,
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userShop'] });
      toast({
        title: "Boutique créée",
        description: "Votre boutique a été créée et est en attente d'approbation"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la boutique"
      });
      console.error("Erreur lors de la création de la boutique:", error);
    }
  });
  
  // Ajouter un article à la boutique
  const addShopItem = useMutation({
    mutationFn: (itemData: Omit<ShopItem, "id" | "created_at" | "updated_at">) => {
      return shopService.createShopItem(itemData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopItems'] });
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté à votre boutique"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'article"
      });
      console.error("Erreur lors de l'ajout de l'article:", error);
    }
  });
  
  // Mettre à jour le statut d'une boutique (admin)
  const updateShopStatus = useMutation({
    mutationFn: ({ shopId, status }: { shopId: string; status: ShopStatus }) => {
      return shopService.updateShopStatus(shopId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la boutique a été mis à jour"
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut"
      });
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  });
  
  return {
    shop,
    isShopLoading,
    refetchShop,
    userShop,
    isUserShopLoading,
    refetchUserShop,
    shopItems,
    areShopItemsLoading,
    refetchShopItems,
    createShop,
    addShopItem,
    updateShopStatus
  };
};
