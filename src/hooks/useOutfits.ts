
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitItem, OutfitStatus, OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';
import { useToast } from './use-toast';

export const useOutfits = (userId: string | null) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchOutfits = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Pour chaque tenue, nous récupérons le premier vêtement (si disponible) pour l'image d'aperçu
      const outfitsWithImages = await Promise.all(data.map(async (outfit) => {
        const { data: items } = await supabase
          .from('outfit_items')
          .select(`
            clothes_id
          `)
          .eq('outfit_id', outfit.id)
          .order('position')
          .limit(1);
          
        if (items && items.length > 0) {
          const { data: clothesData } = await supabase
            .from('clothes')
            .select('image_url')
            .eq('id', items[0].clothes_id)
            .single();
            
          return {
            ...outfit,
            image_url: clothesData?.image_url || undefined
          };
        }
        
        return outfit;
      }));
      
      setOutfits(outfitsWithImages as Outfit[]);
    } catch (error) {
      console.error('Error fetching outfits:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les tenues"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const fetchOutfit = useCallback(async (outfitId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('id', outfitId)
        .single();

      if (error) throw error;
      setCurrentOutfit(data as Outfit);
      
      // Récupérer l'image d'aperçu
      const { data: items } = await supabase
        .from('outfit_items')
        .select(`
          clothes_id
        `)
        .eq('outfit_id', outfitId)
        .order('position')
        .limit(1);
        
      if (items && items.length > 0) {
        const { data: clothesData } = await supabase
          .from('clothes')
          .select('image_url')
          .eq('id', items[0].clothes_id)
          .single();
          
        if (clothesData?.image_url) {
          setCurrentOutfit(prev => prev ? { ...prev, image_url: clothesData.image_url } : null);
        }
      }
    } catch (error) {
      console.error('Error fetching outfit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la tenue"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchOutfitItems = useCallback(async (outfitId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .select('*')
        .eq('outfit_id', outfitId)
        .order('position');

      if (error) throw error;
      setOutfitItems(data as OutfitItem[]);
    } catch (error) {
      console.error('Error fetching outfit items:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les éléments de la tenue"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createOutfit = useCallback(async (outfitData: Partial<Outfit>) => {
    if (!userId) throw new Error("Utilisateur non connecté");
    
    setLoading(true);
    try {
      const newOutfit = {
        user_id: userId,
        name: outfitData.name || "Nouvelle tenue",
        status: outfitData.status || 'draft' as OutfitStatus,
        category: outfitData.category || 'casual' as OutfitCategory,
        season: outfitData.season || 'all' as OutfitSeason,
        is_favorite: outfitData.is_favorite || false,
        likes_count: 0,
        comments_count: 0,
        ...outfitData
      };

      const { data, error } = await supabase
        .from('outfits')
        .insert(newOutfit)
        .select()
        .single();

      if (error) throw error;
      
      setOutfits(prev => [...prev, data as Outfit]);
      
      toast({
        title: "Succès",
        description: "Tenue créée avec succès"
      });
      
      return data as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la tenue"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const updateOutfit = useCallback(async (outfitId: string, updates: Partial<Outfit>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .update(updates)
        .eq('id', outfitId)
        .select()
        .single();

      if (error) throw error;
      
      setOutfits(prev => prev.map(o => o.id === outfitId ? {...o, ...updates} : o));
      
      if (currentOutfit?.id === outfitId) {
        setCurrentOutfit(prev => prev ? {...prev, ...updates} : null);
      }
      
      toast({
        title: "Succès",
        description: "Tenue mise à jour avec succès"
      });
      
      return data as Outfit;
    } catch (error) {
      console.error('Error updating outfit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la tenue"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentOutfit, toast]);

  const deleteOutfit = useCallback(async (outfitId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', outfitId);

      if (error) throw error;
      
      setOutfits(prev => prev.filter(o => o.id !== outfitId));
      
      if (currentOutfit?.id === outfitId) {
        setCurrentOutfit(null);
      }
      
      toast({
        title: "Succès",
        description: "Tenue supprimée avec succès"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting outfit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la tenue"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentOutfit, toast]);

  const addOutfitItem = useCallback(async (item: Omit<OutfitItem, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfit_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      
      setOutfitItems(prev => [...prev, data as OutfitItem]);
      
      toast({
        title: "Succès",
        description: "Élément ajouté à la tenue"
      });
      
      return data as OutfitItem;
    } catch (error) {
      console.error('Error adding outfit item:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter l'élément à la tenue"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const removeOutfitItem = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('outfit_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setOutfitItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Succès",
        description: "Élément supprimé de la tenue"
      });
      
      return true;
    } catch (error) {
      console.error('Error removing outfit item:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'élément de la tenue"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    outfits,
    currentOutfit,
    outfitItems,
    loading,
    fetchOutfits,
    fetchOutfit,
    fetchOutfitItems,
    createOutfit,
    updateOutfit,
    deleteOutfit,
    addOutfitItem,
    removeOutfitItem
  };
};
