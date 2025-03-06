
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
        query = query.eq('status', filters.status);
      }
      
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setSuitcases(data || []);
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
      // Ensure the proper status type is used
      const suitcaseData = {
        ...data,
        user_id: user.id,
        status: data.status || 'active'
      };
      
      const { data: newSuitcase, error } = await supabase
        .from('suitcases')
        .insert([suitcaseData])
        .select()
        .single();
      
      if (error) throw error;
      
      setSuitcases(prev => [newSuitcase, ...prev]);
      
      toast({
        title: 'Valise créée',
        description: 'Votre nouvelle valise a été créée avec succès'
      });
      
      return newSuitcase;
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
      const { data: updatedSuitcase, error } = await supabase
        .from('suitcases')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setSuitcases(prev => 
        prev.map(suitcase => 
          suitcase.id === id ? updatedSuitcase : suitcase
        )
      );
      
      toast({
        title: 'Valise mise à jour',
        description: 'Les modifications ont été enregistrées'
      });
      
      return updatedSuitcase;
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
