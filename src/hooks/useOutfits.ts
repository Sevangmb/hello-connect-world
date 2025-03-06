
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
  updateOutfit: (id: string, outfitData: Partial<Outfit>) => Promise<Outfit | null>;
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
    setLoading(true);
    setError(null);
    try {
      const newOutfit = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: outfitData.name || 'New Outfit',
        status: outfitData.status || 'draft',
        category: outfitData.category || 'casual',
        season: outfitData.season || 'all',
        is_favorite: outfitData.is_favorite || false,
        likes_count: outfitData.likes_count || 0,
        comments_count: outfitData.comments_count || 0,
        ...outfitData
      };

      const { data, error } = await supabase
        .from('outfits')
        .insert([newOutfit])
        .select()
        .single();

      if (error) throw error;
      
      const mappedOutfit = mapDbOutfitToOutfit(data);
      setOutfits(prevOutfits => [mappedOutfit, ...prevOutfits]);
      return mappedOutfit;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOutfit = async (id: string, outfitData: Partial<Outfit>): Promise<Outfit | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('outfits')
        .update({
          ...outfitData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const mappedOutfit = mapDbOutfitToOutfit(data);
      
      setOutfits(prevOutfits => 
        prevOutfits.map(outfit => 
          outfit.id === id ? mappedOutfit : outfit
        )
      );
      
      return mappedOutfit;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return null;
    } finally {
      setLoading(false);
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

// Helper function to map database outfit to domain outfit
function mapDbOutfitToOutfit(data: any): Outfit {
  return {
    ...data,
    status: data.status as OutfitStatus,
    category: data.category as OutfitCategory,
    season: data.season as OutfitSeason
  };
}
