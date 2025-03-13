
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/modules/auth';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClothesFilters>(initialFilters);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    fetchClothes();
  }, [filters, user]);

  const fetchClothes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching clothes with filters:', filters);
      console.log('User ID:', user?.id);
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const data = await fetchClothesData(filters, user.id);
      console.log('Fetched clothes data:', data);
      setClothes(data);
    } catch (err: any) {
      console.error('Error fetching clothes:', err);
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
const fetchClothesData = async (filters: ClothesFilters = {}, userId: string) => {
  try {
    if (!userId) {
      console.error('No user ID provided when fetching clothes');
      return [];
    }
    
    let query = supabase
      .from('clothes')
      .select('*')
      .eq('user_id', userId);

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

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Fetched clothes count:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching clothes:', error);
    return [];
  }
};
