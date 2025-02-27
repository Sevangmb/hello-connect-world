
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { ClothesItem } from "@/components/clothes/types";

interface SuggestedClothesItem {
  id: string;
  name: string;
  category: string;
}

export const useSuitcaseSuggestions = (suitcaseId: string) => {
  const [suggestedClothes, setSuggestedClothes] = useState<SuggestedClothesItem[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [isAddingSuggestions, setIsAddingSuggestions] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getSuggestions = async (startDate: Date, endDate: Date) => {
    if (!suitcaseId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de valise manquant",
      });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Dates de début et de fin manquantes",
      });
      return;
    }

    setIsGettingSuggestions(true);
    setSuggestedClothes([]);
    setAiExplanation("");
    setError(null);

    try {
      // Récupérer les vêtements déjà dans la valise
      const { data: existingItems, error: existingItemsError } = await supabase
        .from("suitcase_items")
        .select(`
          id, clothes_id,
          clothes ( id, name, category )
        `)
        .eq("suitcase_id", suitcaseId);
        
      if (existingItemsError) throw existingItemsError;

      // Récupérer tous les vêtements de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { data: userClothes, error: userClothesError } = await supabase
        .from("clothes")
        .select("id, name, category, weather_categories, color, style")
        .eq("user_id", user.id)
        .eq("archived", false);

      if (userClothesError) throw userClothesError;

      // Créer des suggestions basées sur les vêtements de l'utilisateur
      // Filtrer les vêtements déjà dans la valise
      const existingClothesIds = existingItems?.map(item => item.clothes_id) || [];
      const availableClothes = userClothes.filter(cloth => !existingClothesIds.includes(cloth.id));

      if (availableClothes.length === 0) {
        setAiExplanation("Vous avez déjà ajouté tous vos vêtements à cette valise.");
        setShowSuggestionsDialog(true);
        return;
      }

      try {
        // Essayer d'utiliser la fonction Edge
        const { data, error } = await supabase.functions.invoke("get-suitcase-suggestions", {
          body: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            currentClothes: existingItems?.map(item => ({
              id: item.clothes?.id,
              name: item.clothes?.name,
              category: item.clothes?.category
            })) || [],
            availableClothes: availableClothes
          }
        });

        if (error) throw error;

        if (data && data.suggestedClothes) {
          setSuggestedClothes(data.suggestedClothes);
          setAiExplanation(data.explanation || "Voici quelques suggestions basées sur votre collection.");
        } else {
          throw new Error("Format de réponse invalide");
        }
      } catch (edgeFunctionError) {
        console.error("Erreur avec la fonction Edge, utilisation de la méthode de secours:", edgeFunctionError);
        
        // Méthode de secours si la fonction Edge échoue
        // Suggestions basiques basées sur la saison et les catégories manquantes
        const categories = ["Hauts", "Bas", "Chaussures", "Accessoires"];
        const suggestedItems: SuggestedClothesItem[] = [];
        
        for (const category of categories) {
          // Vérifier si la catégorie est déjà présente dans la valise
          const hasCategoryInSuitcase = existingItems?.some(item => item.clothes?.category === category);
          
          if (!hasCategoryInSuitcase) {
            // Trouver un vêtement disponible dans cette catégorie
            const clothForCategory = availableClothes.find(cloth => cloth.category === category);
            if (clothForCategory) {
              suggestedItems.push({
                id: clothForCategory.id,
                name: clothForCategory.name,
                category: clothForCategory.category
              });
            }
          }
        }
        
        setSuggestedClothes(suggestedItems);
        setAiExplanation("Voici quelques suggestions basées sur les catégories manquantes dans votre valise.");
      }

      setShowSuggestionsDialog(true);
    } catch (e: any) {
      console.error("Erreur lors de la récupération des suggestions:", e);
      setError(e.message || "Impossible de récupérer les suggestions");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: e.message || "Impossible de récupérer les suggestions",
      });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  const addSuggestedClothes = async () => {
    if (!suitcaseId || suggestedClothes.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Aucun vêtement à ajouter",
      });
      return;
    }
    
    setIsAddingSuggestions(true);
    setError(null);

    try {
      // Préparer les données pour l'insertion
      const itemsToInsert = suggestedClothes.map(item => ({
        suitcase_id: suitcaseId,
        clothes_id: item.id,
        quantity: 1
      }));

      // Insérer les vêtements suggérés
      const { error: insertError } = await supabase
        .from("suitcase_items")
        .insert(itemsToInsert);

      if (insertError) throw insertError;

      toast({
        title: "Vêtements ajoutés",
        description: `${suggestedClothes.length} vêtements ont été ajoutés à la valise`,
      });

      // Fermer le dialogue et réinitialiser l'état
      setShowSuggestionsDialog(false);
      setSuggestedClothes([]);
      setAiExplanation("");

      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
    } catch (e: any) {
      console.error("Erreur lors de l'ajout des vêtements suggérés:", e);
      setError(e.message || "Impossible d'ajouter les vêtements suggérés");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: e.message || "Impossible d'ajouter les vêtements suggérés",
      });
    } finally {
      setIsAddingSuggestions(false);
    }
  };

  return {
    suggestedClothes,
    aiExplanation,
    isGettingSuggestions,
    isAddingSuggestions,
    showSuggestionsDialog,
    setShowSuggestionsDialog,
    error,
    getSuggestions,
    addSuggestedClothes,
  };
};
