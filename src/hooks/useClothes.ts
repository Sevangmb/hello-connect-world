
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface ClothesFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  color?: string;
  size?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  isForSale?: boolean;
  showArchived?: boolean;
  needsAlteration?: boolean;
  source?: 'mine' | 'friends' | 'all';
}

export const useClothes = (initialFilters: ClothesFilters = {}) => {
  const [clothes, setClothes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const fetchClothes = async (filters: ClothesFilters = {}) => {
    try {
      setLoading(true);
      let query = supabase.from('clothes').select('*');
      
      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.subcategory) {
        query = query.eq('subcategory', filters.subcategory);
      }
      
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }
      
      if (filters.color) {
        query = query.eq('color', filters.color);
      }
      
      if (filters.size) {
        query = query.eq('size', filters.size);
      }
      
      if (filters.isForSale !== undefined) {
        query = query.eq('is_for_sale', filters.isForSale);
      }
      
      if (filters.showArchived !== undefined) {
        query = query.eq('archived', filters.showArchived);
      } else {
        // By default, don't show archived clothes
        query = query.eq('archived', false);
      }
      
      if (filters.needsAlteration !== undefined) {
        query = query.eq('needs_alteration', filters.needsAlteration);
      }
      
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      // Apply sorting
      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
      } else {
        // Default sorting
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error: apiError } = await query;
      
      if (apiError) throw apiError;
      
      setClothes(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching clothes:', err);
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to fetch clothes',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Add compatibility with react-query style hooks
  const data = clothes;
  const isLoading = loading;
  
  return {
    clothes,
    data,
    loading,
    isLoading,
    error,
    fetchClothes,
  };
};
