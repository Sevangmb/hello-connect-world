import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitItem } from '@/core/outfits/domain/types';
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
      setOutfits(data as unknown as Outfit[]);
    } catch (error) {
      console.error('Error fetching outfits:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load outfits"
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
      setCurrentOutfit(data as unknown as Outfit);
    } catch (error) {
      console.error('Error fetching outfit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load outfit"
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
        title: "Error",
        description: "Failed to load outfit items"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createOutfit = useCallback(async (outfit: Partial<Outfit>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .insert({
          ...outfit,
          user_id: userId,
          status: outfit.status || 'draft',
          category: outfit.category || 'casual',
          season: outfit.season || 'all',
          is_favorite: outfit.is_favorite || false
        })
        .select()
        .single();

      if (error) throw error;
      setOutfits(prevOutfits => [...prevOutfits, data as unknown as Outfit]);
      toast({
        title: "Success",
        description: "Outfit created successfully"
      });
    } catch (error) {
      console.error('Error creating outfit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create outfit"
      });
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
      setOutfits(prevOutfits => {
        return prevOutfits.map(o => {
          if (o.id === outfitId) {
            return { ...o, ...updates };
          }
          return o;
        });
      });
      toast({
        title: "Success",
        description: "Outfit updated successfully"
      });
    } catch (error) {
      console.error('Error updating outfit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update outfit"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteOutfit = useCallback(async (outfitId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', outfitId);

      if (error) throw error;
      setOutfits(prevOutfits => prevOutfits.filter(o => o.id !== outfitId));
      toast({
        title: "Success",
        description: "Outfit deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting outfit:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete outfit"
      });
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
    deleteOutfit
  };
};
