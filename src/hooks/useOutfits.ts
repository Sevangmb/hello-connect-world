import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Outfit, OutfitStatus, OutfitCategory, OutfitSeason } from '@/core/outfits/domain/types';

interface UseOutfitsReturn {
  outfits: Outfit[];
  loading: boolean;
  error: Error | null;
  fetchUserOutfits: (userId: string) => Promise<Outfit[]>;
  fetchOutfitById: (id: string) => Promise<Outfit | null>;
  createOutfit: (outfitData: Partial<Outfit>) => Promise<Outfit | null>;
  updateOutfit: (id: string, updates: Partial<Outfit>) => Promise<Outfit | null>;
  deleteOutfit: (id: string) => Promise<boolean>;
  fetchOutfits: () => Promise<Outfit[]>;
}

export const useOutfits = (): UseOutfitsReturn => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserOutfits = async (userId: string): Promise<Outfit[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedOutfits = (data || []).map(mapDbOutfitToOutfit);
      setOutfits(mappedOutfits);
      return mappedOutfits;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchOutfits = async (): Promise<Outfit[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mappedOutfits = (data || []).map(mapDbOutfitToOutfit);
      setOutfits(mappedOutfits);
      return mappedOutfits;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchOutfitById = async (id: string): Promise<Outfit | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const mappedOutfit = mapDbOutfitToOutfit(data);
      return mappedOutfit;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOutfit = async (outfitData: Partial<Outfit>): Promise<Outfit | null> => {
    try {
      const outfit = {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name: outfitData.name || 'New Outfit',
        status: outfitData.status || 'published',
        category: outfitData.category || 'casual',
        season: outfitData.season || 'all',
        description: outfitData.description || '',
        top_id: outfitData.top_id,
        bottom_id: outfitData.bottom_id,
        shoes_id: outfitData.shoes_id,
        is_favorite: outfitData.is_favorite || false,
        likes_count: outfitData.likes_count || 0,
        comments_count: outfitData.comments_count || 0
      };

      if (!outfit.user_id) {
        throw new Error('User must be authenticated to create an outfit');
      }

      const { data, error } = await supabase
        .from('outfits')
        .insert(outfit)
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as Outfit;
    } catch (error) {
      console.error('Error creating outfit:', error);
      return null;
    }
  };

  const updateOutfit = async (id: string, updates: Partial<Outfit>): Promise<Outfit | null> => {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return data as unknown as Outfit;
    } catch (error) {
      console.error('Error updating outfit:', error);
      return null;
    }
  };

  const deleteOutfit = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.id !== id));
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    outfits,
    loading,
    error,
    fetchUserOutfits,
    fetchOutfitById,
    createOutfit,
    updateOutfit,
    deleteOutfit,
    fetchOutfits
  };
};

function mapDbOutfitToOutfit(data: any): Outfit {
  return {
    ...data,
    status: data.status as OutfitStatus,
    category: data.category as OutfitCategory,
    season: data.season as OutfitSeason
  };
}
