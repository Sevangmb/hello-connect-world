
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shop, ShopItem } from "@/core/shop/domain/types";
import { shopRepository } from "@/core/shop/infrastructure/ShopRepository";
import { useToast } from "./use-toast";

export const useShop = (userId: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Récupérer la boutique d'un utilisateur
  const {
    data: shop,
    isLoading: isShopLoading,
    refetch: refetchShop,
  } = useQuery({
    queryKey: ["shop", userId],
    queryFn: async () => {
      if (!userId) return null;
      return shopRepository.getShopByUserId(userId);
    },
    enabled: !!userId,
  });

  // Récupérer les produits d'une boutique
  const useShopItems = (shopId: string | undefined) => {
    return useQuery({
      queryKey: ["shopItems", shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopRepository.getShopItems(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Récupérer les commandes d'une boutique
  const useShopOrders = (shopId: string | undefined) => {
    return useQuery({
      queryKey: ["shopOrders", shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopRepository.getShopOrders(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Récupérer les avis d'une boutique
  const useShopReviews = (shopId: string | undefined) => {
    return useQuery({
      queryKey: ["shopReviews", shopId],
      queryFn: async () => {
        if (!shopId) return [];
        return shopRepository.getShopReviews(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Récupérer les paramètres d'une boutique
  const useShopSettings = (shopId: string | undefined) => {
    return useQuery({
      queryKey: ["shopSettings", shopId],
      queryFn: async () => {
        if (!shopId) return null;
        return shopRepository.getShopSettings(shopId);
      },
      enabled: !!shopId,
    });
  };

  // Créer une nouvelle boutique
  const createShop = useMutation({
    mutationFn: async (shopData: {
      user_id: string;
      name: string;
      description: string;
      image_url?: string;
    }) => {
      return shopRepository.createShop({
        ...shopData,
        status: 'pending' // Les nouvelles boutiques sont en attente d'approbation
      });
    },
    onSuccess: () => {
      toast({
        title: "Boutique créée",
        description: "Votre boutique a été créée et est en attente d'approbation.",
      });
      queryClient.invalidateQueries({ queryKey: ["shop", userId] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la boutique:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la boutique.",
      });
    },
  });

  // Ajouter un produit à la boutique
  const addShopItem = useMutation({
    mutationFn: async (item: Omit<ShopItem, "id" | "created_at" | "updated_at">) => {
      return shopRepository.createShopItem(item);
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre boutique.",
      });
      queryClient.invalidateQueries({ queryKey: ["shopItems", variables.shop_id] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du produit:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit.",
      });
    },
  });

  // Mettre à jour le statut d'une boutique (pour les admins)
  const updateShopStatus = useMutation({
    mutationFn: async ({ shopId, status }: { shopId: string; status: 'approved' | 'rejected' | 'suspended' | 'pending' }) => {
      return shopRepository.updateShopStatus(shopId, status);
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Statut mis à jour",
        description: `Le statut de la boutique a été mis à jour avec succès.`,
      });
      queryClient.invalidateQueries({ queryKey: ["shop", variables.shopId] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la boutique.",
      });
    },
  });

  return {
    shop,
    isShopLoading,
    refetchShop,
    useShopItems,
    useShopOrders,
    useShopReviews,
    useShopSettings,
    createShop,
    addShopItem,
    updateShopStatus,
  };
};
