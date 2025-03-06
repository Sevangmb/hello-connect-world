
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the ClothesFilters type if not already defined elsewhere
export interface ClothesFilters {
  category?: string | string[];
  season?: string | string[];
  color?: string | string[];
  search?: string;
  // Add other filter properties as needed
}

export const useClothes = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClothes = useCallback(async (filters?: ClothesFilters) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('clothes').select('*');

      // Apply filters
      if (filters) {
        if (filters.category) {
          if (Array.isArray(filters.category)) {
            query = query.in('category', filters.category);
          } else {
            query = query.eq('category', filters.category);
          }
        }
        
        if (filters.season) {
          if (Array.isArray(filters.season)) {
            query = query.in('season', filters.season);
          } else {
            query = query.eq('season', filters.season);
          }
        }
        
        if (filters.color) {
          if (Array.isArray(filters.color)) {
            query = query.in('color', filters.color);
          } else {
            query = query.eq('color', filters.color);
          }
        }
        
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setClothes(data || []);
      return data || [];
    } catch (err) {
      setError(err);
      console.error('Error fetching clothes:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clothes,
    loading,
    error,
    fetchClothes
  };
};
