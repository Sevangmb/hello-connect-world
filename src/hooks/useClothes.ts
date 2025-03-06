
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Update ClothesFilters interface to include all properties being used
export interface ClothesFilters {
  category?: string;
  subcategory?: string;
  search?: string;
  sortBy?: 'created_at' | 'name' | 'price' | 'purchase_date';
  sortOrder?: 'asc' | 'desc';
  showArchived?: boolean;
  needsAlteration?: boolean;
  isForSale?: boolean;
  source?: string;
  // Add any other properties used in filters
}

export const useClothes = (initialFilters: ClothesFilters = {}) => {
  const [clothes, setClothes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClothesFilters>(initialFilters);

  useEffect(() => {
    fetchClothes();
  }, [filters]);

  const fetchClothes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClothesData(filters);
      setClothes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clothes');
      setClothes([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: ClothesFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return { clothes, loading, error, filters, updateFilters };
};

// Update fetchClothes function to use proper query limiting and pagination
const fetchClothesData = async (filters: ClothesFilters = {}) => {
  try {
    let query = supabase
      .from('clothes')
      .select('*');

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.subcategory) {
      query = query.eq('subcategory', filters.subcategory);
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.isForSale !== undefined) {
      query = query.eq('is_for_sale', filters.isForSale);
    }

    if (!filters.showArchived) {
      query = query.eq('archived', false);
    }

    if (filters.needsAlteration) {
      query = query.eq('needs_alteration', true);
    }

    // Apply sorting
    if (filters.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Limit results for performance
    query = query.limit(100);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching clothes:', error);
    return [];
  }
};
