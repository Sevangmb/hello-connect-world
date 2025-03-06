
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export type SuitcaseStatus = 'active' | 'archived' | 'completed';

export interface Suitcase {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  user_id: string;
  status: SuitcaseStatus;
  created_at: string;
  updated_at: string;
  parent_id?: string;
}

export interface SuitcaseFilter {
  status?: SuitcaseStatus;
  search?: string;
}

// Map database types to our application types
const mapStatus = (status: string): SuitcaseStatus => {
  if (status === 'active' || status === 'archived' || status === 'completed') {
    return status;
  }
  return 'active'; // Default value
};

const mapSuitcase = (data: any): Suitcase => ({
  id: data.id,
  name: data.name || '',
  description: data.description,
  start_date: data.start_date,
  end_date: data.end_date,
  user_id: data.user_id,
  status: mapStatus(data.status),
  created_at: data.created_at,
  updated_at: data.updated_at,
  parent_id: data.parent_id
});

export const useSuitcases = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suitcases, setSuitcases] = useState<Suitcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<SuitcaseFilter>({
    status: 'active'
  });

  const fetchSuitcases = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('suitcases')
        .select('*')
        .eq('user_id', user.id);
      
      if (filters.status) {
        // Convert our app status to DB status
        const dbStatus = filters.status === 'completed' ? 'active' : filters.status;
        query = query.eq('status', dbStatus);
      }
      
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map DB data to our app types
      const mappedSuitcases = (data || []).map(mapSuitcase);
      setSuitcases(mappedSuitcases);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos valises',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createSuitcase = async (data: Partial<Suitcase>) => {
    if (!user) return null;
    
    try {
      // Ensure we have required fields and convert to DB schema
      const suitcaseData = {
        name: data.name || 'Nouvelle valise',
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        user_id: user.id,
        // Convert our app status to DB status if needed
        status: data.status === 'completed' ? 'active' : (data.status || 'active')
      };
      
      const { data: newSuitcase, error } = await supabase
        .from('suitcases')
        .insert([suitcaseData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Map to our app type
      const mappedSuitcase = mapSuitcase(newSuitcase);
      setSuitcases(prev => [mappedSuitcase, ...prev]);
      
      toast({
        title: 'Valise créée',
        description: 'Votre nouvelle valise a été créée avec succès'
      });
      
      return mappedSuitcase;
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la valise',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateSuitcase = async (id: string, data: Partial<Suitcase>) => {
    try {
      // Convert our app status to DB status if needed
      const updateData = {
        ...data,
        status: data.status === 'completed' ? 'active' : data.status
      };
      
      const { data: updatedSuitcase, error } = await supabase
        .from('suitcases')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Map to our app type
      const mappedSuitcase = mapSuitcase(updatedSuitcase);
      setSuitcases(prev => 
        prev.map(suitcase => 
          suitcase.id === id ? mappedSuitcase : suitcase
        )
      );
      
      toast({
        title: 'Valise mise à jour',
        description: 'Les modifications ont été enregistrées'
      });
      
      return mappedSuitcase;
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la valise',
        variant: 'destructive'
      });
      return null;
    }
  };

  const deleteSuitcase = async (id: string) => {
    try {
      // Mark as archived instead of deleting
      const { error } = await supabase
        .from('suitcases')
        .update({ status: 'archived' })
        .eq('id', id);
      
      if (error) throw error;
      
      setSuitcases(prev => prev.filter(suitcase => suitcase.id !== id));
      
      toast({
        title: 'Valise supprimée',
        description: 'La valise a été archivée avec succès'
      });
      
      return true;
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la valise',
        variant: 'destructive'
      });
      return false;
    }
  };

  const applyFilters = (newFilters: SuitcaseFilter) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    if (user) {
      fetchSuitcases();
    }
  }, [user, filters]);

  return {
    suitcases,
    loading,
    error,
    filters,
    applyFilters,
    fetchSuitcases,
    createSuitcase,
    updateSuitcase,
    deleteSuitcase
  };
};

// Add a single suitcase getter for convenience
export const useSuitcase = (id: string) => {
  const { suitcases, loading, error } = useSuitcases();
  const [suitcase, setSuitcase] = useState<Suitcase | null>(null);
  
  useEffect(() => {
    if (suitcases.length > 0) {
      const found = suitcases.find(s => s.id === id) || null;
      setSuitcase(found);
    }
  }, [suitcases, id]);
  
  return {
    suitcase,
    loading,
    error
  };
};
