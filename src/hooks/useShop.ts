
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopItem, ShopStatus, ShopItemStatus, ShopSettings } from '@/core/shop/domain/types';
import { useToast } from './use-toast';

// Création du hook useShop avec une conversion de type correcte
export const useShop = (userId: string | null) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchShopByUserId = useCallback(async () => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucune boutique trouvée
          return null;
        }
        throw error;
      }
      
      // Conversion explicite du statut
      const shopWithTypedStatus: Shop = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(shopWithTypedStatus);
      return shopWithTypedStatus;
    } catch (error) {
      console.error('Erreur lors du chargement de la boutique:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la boutique"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const fetchShopItems = useCallback(async (shopId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Conversion explicite du statut
      const itemsWithTypedStatus: ShopItem[] = data.map(item => ({
        ...item,
        status: item.status as ShopItemStatus
      }));
      
      setShopItems(itemsWithTypedStatus);
      return itemsWithTypedStatus;
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les articles"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createShop = useCallback(async (shopData: Partial<Shop>) => {
    if (!userId) throw new Error("Utilisateur non connecté");
    
    setLoading(true);
    try {
      // Ajouter les valeurs par défaut
      const newShop = {
        user_id: userId,
        name: shopData.name || "Ma boutique",
        description: shopData.description || "",
        status: shopData.status || 'pending' as ShopStatus,
        average_rating: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...shopData
      };

      // S'assurer que name est toujours défini
      if (!newShop.name) {
        newShop.name = "Ma boutique";
      }

      const { data, error } = await supabase
        .from('shops')
        .insert(newShop)
        .select()
        .single();

      if (error) throw error;
      
      // Conversion explicite du statut
      const createdShop: Shop = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(createdShop);
      
      toast({
        title: "Succès",
        description: "Boutique créée avec succès"
      });
      
      return createdShop;
    } catch (error) {
      console.error('Erreur lors de la création de la boutique:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la boutique"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const updateShop = useCallback(async (shopId: string, updates: Partial<Shop>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', shopId)
        .select()
        .single();

      if (error) throw error;
      
      // Conversion explicite du statut
      const updatedShop: Shop = {
        ...data,
        status: data.status as ShopStatus
      };
      
      setShop(updatedShop);
      
      toast({
        title: "Succès",
        description: "Boutique mise à jour avec succès"
      });
      
      return updatedShop;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la boutique:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la boutique"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createShopItem = useCallback(async (item: Partial<ShopItem>) => {
    if (!shop?.id) throw new Error("Aucune boutique sélectionnée");
    
    setLoading(true);
    try {
      // Ajouter les valeurs par défaut
      const newItem = {
        shop_id: shop.id,
        name: item.name || "Nouvel article",
        price: item.price || 0,
        stock: item.stock || 1,
        status: item.status || 'available' as ShopItemStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...item,
        // S'assurer que les champs requis sont présents
        clothes_id: item.clothes_id || ''
      };
      
      // S'assurer que price est toujours défini
      if (!newItem.price) {
        newItem.price = 0;
      }

      const { data, error } = await supabase
        .from('shop_items')
        .insert(newItem)
        .select()
        .single();

      if (error) throw error;
      
      // Conversion explicite du statut
      const createdItem: ShopItem = {
        ...data,
        status: data.status as ShopItemStatus
      };
      
      setShopItems(prev => [...prev, createdItem]);
      
      toast({
        title: "Succès",
        description: "Article ajouté avec succès"
      });
      
      return createdItem;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'article:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'article"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [shop, toast]);

  return {
    shop,
    shopItems,
    loading,
    fetchShopByUserId,
    fetchShopItems,
    createShop,
    updateShop,
    createShopItem
  };
};
