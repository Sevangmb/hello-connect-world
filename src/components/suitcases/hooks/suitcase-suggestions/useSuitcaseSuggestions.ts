
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClothes } from '@/hooks/useClothes';
import { useToast } from '@/hooks/use-toast';

export const useSuitcaseSuggestions = (suitcaseId: string) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingSuggestions, setIsAddingSuggestions] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const { toast } = useToast();
  const { clothes } = useClothes();

  const getSuggestions = async () => {
    try {
      setLoading(true);
      
      // Fetch the suitcase details first
      const { data: suitcase, error: suitcaseError } = await supabase
        .from('suitcases')
        .select('*')
        .eq('id', suitcaseId)
        .single();
      
      if (suitcaseError) throw suitcaseError;
      
      // Get suggestions from Supabase Edge Function (or similar)
      const { data, error } = await supabase.functions.invoke('get-suitcase-suggestions', {
        body: {
          suitcaseId,
          startDate: suitcase.start_date,
          endDate: suitcase.end_date,
          // Only pass these if they exist
          ...(suitcase.destination && { destination: suitcase.destination }),
          ...(suitcase.purpose && { purpose: suitcase.purpose })
        }
      });
      
      if (error) throw error;
      
      if (data?.suggestions && Array.isArray(data.suggestions)) {
        // Match the suggestions with actual clothes items
        const matchedItems = data.suggestions.map((suggestion: any) => {
          // Find the closest match from user's clothes
          const match = clothes.find(cloth => 
            cloth.category === suggestion.category && 
            (!suggestion.color || cloth.color === suggestion.color)
          );
          
          return match || null;
        }).filter(Boolean);
        
        setSuggestions(matchedItems);
        setAiExplanation(data.explanation || '');
      }
    } catch (error) {
      console.error('Error getting suitcase suggestions:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'obtenir des suggestions pour cette valise."
      });
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const addSuggestedItems = async () => {
    if (suggestions.length === 0) return;
    
    try {
      setIsAddingSuggestions(true);
      
      // Format the items for insertion
      const itemsToAdd = suggestions.map(item => ({
        suitcase_id: suitcaseId,
        clothes_id: item.id,
        created_at: new Date().toISOString()
      }));
      
      // Insert the items into the suitcase_items table
      const { error } = await supabase
        .from('suitcase_items')
        .insert(itemsToAdd);
      
      if (error) throw error;
      
      toast({
        title: "Vêtements ajoutés",
        description: `${suggestions.length} vêtements ont été ajoutés à votre valise.`
      });
      
      // Clear suggestions after adding
      setSuggestions([]);
    } catch (error) {
      console.error('Error adding suggested items:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter les vêtements suggérés à la valise."
      });
    } finally {
      setIsAddingSuggestions(false);
    }
  };

  return {
    suggestions,
    loading,
    isAddingSuggestions,
    aiExplanation,
    getSuggestions,
    addSuggestedItems
  };
};
