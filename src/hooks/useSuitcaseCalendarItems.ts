
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SuitcaseCalendarItem } from '@/components/suitcases/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useSuitcaseCalendarItems(suitcaseId: string, date?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['suitcase-calendar-items', suitcaseId, date];

  // Fonction pour récupérer les éléments de calendrier
  const fetchCalendarItems = useCallback(async () => {
    if (!suitcaseId) return [];
    
    let query = supabase
      .from('suitcase_calendar_items')
      .select('*, items:suitcase_calendar_item_clothes(id, clothes_id, clothes(name, image_url))')
      .eq('suitcase_id', suitcaseId);
    
    if (date) {
      query = query.eq('date', date);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transformer les données pour correspondre à la structure attendue
    return (data || []).map(item => ({
      id: item.id,
      suitcase_id: item.suitcase_id,
      date: item.date,
      items: (item.items || []).map((clotheItem: any) => ({
        id: clotheItem.id,
        clothes_id: clotheItem.clothes_id,
        clothes_name: clotheItem.clothes?.name,
        clothes_image: clotheItem.clothes?.image_url
      }))
    })) as SuitcaseCalendarItem[];
  }, [suitcaseId, date]);

  // Utiliser React Query pour gérer le cache et les états de chargement
  const { data = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: fetchCalendarItems,
    staleTime: 10000,
    enabled: !!suitcaseId
  });

  // Mutation pour ajouter un élément au calendrier
  const addCalendarItem = useMutation({
    mutationFn: async (newItem: Omit<SuitcaseCalendarItem, 'id'>) => {
      const { data, error } = await supabase
        .from('suitcase_calendar_items')
        .insert({
          suitcase_id: newItem.suitcase_id,
          date: newItem.date
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Ajouter les vêtements associés
      for (const clotheItem of newItem.items) {
        await supabase
          .from('suitcase_calendar_item_clothes')
          .insert({
            suitcase_calendar_item_id: data.id,
            clothes_id: clotheItem.clothes_id
          });
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Mutation pour mettre à jour un élément du calendrier
  const updateCalendarItem = useMutation({
    mutationFn: async (updatedItem: SuitcaseCalendarItem) => {
      // Mettre à jour l'élément principal
      const { error } = await supabase
        .from('suitcase_calendar_items')
        .update({ date: updatedItem.date })
        .eq('id', updatedItem.id);
        
      if (error) throw error;
      
      // Supprimer tous les vêtements associés existants
      await supabase
        .from('suitcase_calendar_item_clothes')
        .delete()
        .eq('suitcase_calendar_item_id', updatedItem.id);
      
      // Ajouter les nouveaux vêtements
      for (const clotheItem of updatedItem.items) {
        await supabase
          .from('suitcase_calendar_item_clothes')
          .insert({
            suitcase_calendar_item_id: updatedItem.id,
            clothes_id: clotheItem.clothes_id
          });
      }
      
      return updatedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Mutation pour supprimer un élément du calendrier
  const removeCalendarItem = useMutation({
    mutationFn: async (id: string) => {
      // Les relations seront supprimées automatiquement si la contrainte de clé étrangère a ON DELETE CASCADE
      const { error } = await supabase
        .from('suitcase_calendar_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  return {
    calendarItems: data,
    isLoading,
    error,
    addCalendarItem,
    updateCalendarItem,
    removeCalendarItem
  };
}
