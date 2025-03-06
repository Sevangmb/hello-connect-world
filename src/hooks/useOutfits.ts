
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitComment, OutfitItem, OutfitStatus, OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';
import { useAuth } from './useAuth';

export const useOutfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Fetch all outfits for the current user
  const fetchOutfits = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setOutfits(data as Outfit[]);
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load a specific outfit by ID
  const fetchOutfit = useCallback(async (outfitId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('id', outfitId)
        .single();
        
      if (error) throw error;
      
      setCurrentOutfit(data as Outfit);
      return data as Outfit;
    } catch (error) {
      console.error(`Error fetching outfit ${outfitId}:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get items for a specific outfit
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
      return data as OutfitItem[];
    } catch (error) {
      console.error(`Error fetching items for outfit ${outfitId}:`, error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new outfit
  const createOutfit = useCallback(async (outfit: Partial<Outfit>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Ensure required fields have values
      const outfitData: Partial<Outfit> = {
        user_id: user.id,
        name: outfit.name || 'New Outfit',
        description: outfit.description,
        status: outfit.status || 'draft' as OutfitStatus,
        category: outfit.category || 'casual' as OutfitCategory,
        season: outfit.season || 'all' as OutfitSeason,
        is_favorite: outfit.is_favorite || false,
        top_id: outfit.top_id,
        bottom_id: outfit.bottom_id,
        shoes_id: outfit.shoes_id,
        likes_count: 0,
        comments_count: 0,
        image_url: outfit.image_url
      };
      
      const { data, error } = await supabase
        .from('outfits')
        .insert(outfitData)
        .select()
        .single();
        
      if (error) throw error;
      
      await fetchOutfits(); // Refresh outfits list
      return data as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, fetchOutfits]);

  // Update an existing outfit
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
      
      setCurrentOutfit(prev => prev?.id === outfitId ? data as Outfit : prev);
      await fetchOutfits(); // Refresh outfits list
      return data as Outfit;
    } catch (error) {
      console.error(`Error updating outfit ${outfitId}:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchOutfits]);

  // Delete an outfit
  const deleteOutfit = useCallback(async (outfitId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', outfitId);
        
      if (error) throw error;
      
      await fetchOutfits(); // Refresh outfits list
      return true;
    } catch (error) {
      console.error(`Error deleting outfit ${outfitId}:`, error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchOutfits]);

  // Add an item to an outfit
  const addOutfitItem = useCallback(async (outfitId: string, clothesId: string, position: number = 0) => {
    setLoading(true);
    try {
      const item: OutfitItem = {
        outfit_id: outfitId,
        clothes_id: clothesId,
        position
      };
      
      const { data, error } = await supabase
        .from('outfit_items')
        .insert(item)
        .select()
        .single();
        
      if (error) throw error;
      
      await fetchOutfitItems(outfitId); // Refresh outfit items
      return data as OutfitItem;
    } catch (error) {
      console.error(`Error adding item to outfit ${outfitId}:`, error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchOutfitItems]);

  // Remove an item from an outfit
  const removeOutfitItem = useCallback(async (outfitId: string, clothesId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('outfit_items')
        .delete()
        .eq('outfit_id', outfitId)
        .eq('clothes_id', clothesId);
        
      if (error) throw error;
      
      await fetchOutfitItems(outfitId); // Refresh outfit items
      return true;
    } catch (error) {
      console.error(`Error removing item from outfit ${outfitId}:`, error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchOutfitItems]);

  // Load user's outfits
  const loadUserOutfits = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*, profiles(username, full_name, avatar_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setOutfits(data as Outfit[]);
      return data as Outfit[];
    } catch (error) {
      console.error(`Error fetching outfits for user ${userId}:`, error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
    removeOutfitItem,
    loadUserOutfits
  };
};
