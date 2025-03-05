
import { useState, useEffect, useCallback } from 'react';
import { shopApiGateway } from '@/services/api-gateway/ShopApiGateway';
import { Shop, ShopItem, ShopSettings, Order, ShopReview } from '@/core/shop/domain/types';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useModules } from './modules';
import { SHOP_MODULE_CODE } from './modules/constants';

export const useShop = (userId?: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isModuleActive } = useModules();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<ShopReview[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShopOwner, setIsShopOwner] = useState(false);

  // Utiliser l'ID de l'utilisateur connecté si aucun utilisateur n'est spécifié
  const targetUserId = userId || user?.id || null;

  // Vérifier si le module boutique est actif
  const isShopModuleActive = useCallback(async () => {
    return isModuleActive(SHOP_MODULE_CODE);
  }, [isModuleActive]);

  // Charger la boutique de l'utilisateur
  const loadUserShop = useCallback(async () => {
    if (!targetUserId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier si le module est actif
      const moduleActive = await isShopModuleActive();
      if (!moduleActive) {
        setError('Le module boutique n\'est pas actif.');
        setLoading(false);
        return;
      }
      
      const shopData = await shopApiGateway.getUserShop(targetUserId);
      setShop(shopData);
      
      // Vérifier si l'utilisateur connecté est le propriétaire de la boutique
      setIsShopOwner(user?.id === targetUserId && shopData !== null);
      
      if (shopData) {
        // Charger les articles, commandes, avis et paramètres
        const [itemsData, ordersData, reviewsData, settingsData] = await Promise.all([
          shopApiGateway.getShopItems(shopData.id),
          user?.id === targetUserId ? shopApiGateway.getShopOrders(shopData.id) : Promise.resolve([]),
          shopApiGateway.getShopReviews(shopData.id),
          user?.id === targetUserId ? shopApiGateway.getShopSettings(shopData.id) : Promise.resolve(null)
        ]);
        
        setShopItems(itemsData);
        setOrders(ordersData);
        setReviews(reviewsData);
        setSettings(settingsData);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement de la boutique:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement de la boutique.');
      
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les données de la boutique.'
      });
    } finally {
      setLoading(false);
    }
  }, [targetUserId, user?.id, isShopModuleActive, toast]);

  // Créer une nouvelle boutique
  const createShop = useCallback(async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'average_rating' | 'status'>) => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous devez être connecté pour créer une boutique.'
      });
      return null;
    }
    
    try {
      const newShopData = {
        ...shopData,
        user_id: user.id,
      };
      
      const shop = await shopApiGateway.createShop(newShopData);
      
      if (shop) {
        toast({
          title: 'Boutique créée',
          description: 'Votre boutique a été créée avec succès et est en attente d\'approbation.'
        });
        
        await loadUserShop();
        return shop;
      }
      
      return null;
    } catch (err: any) {
      console.error('Erreur lors de la création de la boutique:', err);
      
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message || 'Une erreur est survenue lors de la création de la boutique.'
      });
      
      return null;
    }
  }, [user?.id, loadUserShop, toast]);

  // Ajouter un article à la boutique
  const addShopItem = useCallback(async (itemData: Omit<ShopItem, 'id' | 'created_at' | 'updated_at' | 'shop_id'>) => {
    if (!shop) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous n\'avez pas de boutique.'
      });
      return null;
    }
    
    try {
      const newItemData = {
        ...itemData,
        shop_id: shop.id,
        status: 'available' as const
      };
      
      const item = await shopApiGateway.createShopItem(newItemData);
      
      if (item) {
        toast({
          title: 'Article ajouté',
          description: 'L\'article a été ajouté à votre boutique avec succès.'
        });
        
        setShopItems(prev => [item, ...prev]);
        return item;
      }
      
      return null;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de l\'article:', err);
      
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message || 'Une erreur est survenue lors de l\'ajout de l\'article.'
      });
      
      return null;
    }
  }, [shop, toast]);

  // Mettre à jour la boutique
  const updateShopInfo = useCallback(async (shopData: Partial<Shop>) => {
    if (!shop) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous n\'avez pas de boutique.'
      });
      return false;
    }
    
    try {
      const success = await shopApiGateway.updateShop(shop.id, shopData);
      
      if (success) {
        toast({
          title: 'Boutique mise à jour',
          description: 'Les informations de votre boutique ont été mises à jour avec succès.'
        });
        
        setShop(prev => prev ? { ...prev, ...shopData } : null);
        return true;
      }
      
      return false;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la boutique:', err);
      
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message || 'Une erreur est survenue lors de la mise à jour de la boutique.'
      });
      
      return false;
    }
  }, [shop, toast]);

  // Charger les données au montage
  useEffect(() => {
    if (targetUserId) {
      loadUserShop();
    } else {
      setLoading(false);
    }
  }, [targetUserId, loadUserShop]);

  return {
    shop,
    shopItems,
    orders,
    reviews,
    settings,
    loading,
    error,
    isShopOwner,
    createShop,
    addShopItem,
    updateShopInfo,
    refreshShop: loadUserShop
  };
};
