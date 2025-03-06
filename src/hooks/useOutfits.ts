
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Outfit } from '@/core/outfits/domain/types';
import { useToast } from '@/hooks/use-toast';

export const useOutfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchUserOutfits = async (userId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOutfits(data || []);
      return data || [];
    } catch (err: any) {
      console.error('Error fetching outfits:', err);
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to fetch outfits',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchOutfitById = async (id: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      console.error(`Error fetching outfit ${id}:`, err);
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to fetch outfit details',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createOutfit = async (outfitData: Partial<Outfit>) => {
    try {
      setLoading(true);
      
      // Ensure required fields
      if (!outfitData.user_id) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        outfitData.user_id = user.id;
      }
      
      if (!outfitData.name) {
        outfitData.name = 'New Outfit';
      }
      
      const newOutfit = {
        ...outfitData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('outfits')
        .insert([newOutfit])
        .select()
        .single();
      
      if (error) throw error;
      
      setOutfits([data, ...outfits]);
      toast({
        title: 'Success',
        description: 'Outfit created successfully',
      });
      
      return data;
    } catch (err: any) {
      console.error('Error creating outfit:', err);
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to create outfit',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOutfit = async (id: string, outfitData: Partial<Outfit>) => {
    try {
      setLoading(true);
      
      // Make sure name is provided if it's being updated
      if (outfitData.name === '') {
        outfitData.name = 'Unnamed Outfit';
      }
      
      const updates = {
        ...outfitData,
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('outfits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setOutfits(outfits.map(outfit => outfit.id === id ? data : outfit));
      toast({
        title: 'Success',
        description: 'Outfit updated successfully',
      });
      
      return data;
    } catch (err: any) {
      console.error(`Error updating outfit ${id}:`, err);
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to update outfit',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOutfit = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('outfits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setOutfits(outfits.filter(outfit => outfit.id !== id));
      toast({
        title: 'Success',
        description: 'Outfit deleted successfully',
      });
      
      return true;
    } catch (err: any) {
      console.error(`Error deleting outfit ${id}:`, err);
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to delete outfit',
        variant: 'destructive',
      });
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
  };
};
