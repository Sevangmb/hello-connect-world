import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface ClothesFilters {
  category?: string | string[];
  brand?: string;
  color?: string;
  season?: string;
  searchTerm?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  showArchived?: boolean;
  needsAlteration?: boolean;
  source?: string;
  subcategory?: string | string[];
  limit?: number;
  offset?: number;
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
        if (Array.isArray(filters.category)) {
          query = query.in('category', filters.category);
        } else {
          query = query.eq('category', filters.category);
        }
      }
      
      if (filters.subcategory) {
        if (Array.isArray(filters.subcategory)) {
          query = query.in('subcategory', filters.subcategory);
        } else {
          query = query.eq('subcategory', filters.subcategory);
        }
      }
      
      if (filters.brand) {
        query = query.eq('brand', filters.brand);
      }
      
      if (filters.color) {
        query = query.eq('color', filters.color);
      }
      
      if (filters.season) {
        query = query.eq('season', filters.season);
      }
      
      if (filters.searchTerm) {
        query = query.ilike('name', `%${filters.searchTerm}%`);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
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
      
      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
      } else {
        // Default sorting
        query = query.order('created_at', { ascending: false });
      }
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.offset(filters.offset);
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
