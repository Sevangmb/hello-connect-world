
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SuitcaseStatus } from '@/components/suitcases/types';

export interface Suitcase {
  id: string;
  user_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: SuitcaseStatus;
  created_at: string;
  updated_at: string;
  parent_id?: string;
}

export const useSuitcases = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Cette fonction ajoute des logs de débogage pour suivre le processus de chargement
  const fetchSuitcases = async (): Promise<Suitcase[]> => {
    console.log('Début de récupération des valises...');
    
    if (!user) {
      console.log('Aucun utilisateur connecté, retour liste vide');
      return [];
    }
    
    try {
      console.log('Requête Supabase en cours...');
      const { data, error } = await supabase
        .from('suitcases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Erreur Supabase lors de la récupération:', error);
        throw new Error(error.message);
      }
      
      console.log(`Récupération terminée: ${data ? data.length : 0} valises trouvées`);
      return data || [];
    } catch (error: any) {
      console.error('Exception lors de la récupération des valises:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des valises');
    }
  };
  
  // Utiliser React Query pour gérer le chargement et la mise en cache
  const { data: suitcases = [], isLoading, error } = useQuery({
    queryKey: ['suitcases', user?.id],
    queryFn: fetchSuitcases,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes de fraîcheur
    refetchOnWindowFocus: false,
  });
  
  // Créer une nouvelle valise
  const createSuitcase = useMutation({
    mutationFn: async (newSuitcase: { 
      name: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      status?: SuitcaseStatus;
    }) => {
      if (!user) throw new Error('Vous devez être connecté pour créer une valise');
      
      const suitcaseData = {
        user_id: user.id,
        name: newSuitcase.name,
        description: newSuitcase.description || '',
        start_date: newSuitcase.start_date || null,
        end_date: newSuitcase.end_date || null,
        status: (newSuitcase.status || 'active') as 'active' | 'archived',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Création de valise en cours:', suitcaseData);
      
      const { data, error } = await supabase
        .from('suitcases')
        .insert([suitcaseData])
        .select()
        .single();
        
      if (error) {
        console.error('Erreur lors de la création de la valise:', error);
        throw new Error(error.message);
      }
      
      console.log('Valise créée avec succès:', data);
      return data as Suitcase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcases', user?.id] });
    }
  });
  
  // Mettre à jour une valise existante
  const updateSuitcase = useMutation({
    mutationFn: async (updatedSuitcase: {
      id: string;
      name?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      status?: SuitcaseStatus;
    }) => {
      if (!user) throw new Error('Vous devez être connecté pour modifier une valise');
      
      const { id, ...updateData } = updatedSuitcase;
      updateData.updated_at = new Date().toISOString();
      
      if (updateData.status) {
        updateData.status = updateData.status as 'active' | 'archived';
      }
      
      console.log('Mise à jour de valise en cours:', { id, ...updateData });
      
      const { data, error } = await supabase
        .from('suitcases')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Erreur lors de la mise à jour de la valise:', error);
        throw new Error(error.message);
      }
      
      console.log('Valise mise à jour avec succès:', data);
      return data as Suitcase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcases', user?.id] });
    }
  });
  
  // Supprimer une valise
  const deleteSuitcase = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Vous devez être connecté pour supprimer une valise');
      
      console.log('Suppression de valise en cours:', id);
      
      const { error } = await supabase
        .from('suitcases')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Erreur lors de la suppression de la valise:', error);
        throw new Error(error.message);
      }
      
      console.log('Valise supprimée avec succès');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suitcases', user?.id] });
    }
  });
  
  return {
    suitcases,
    isLoading,
    error: error as Error,
    createSuitcase,
    updateSuitcase,
    deleteSuitcase
  };
};
