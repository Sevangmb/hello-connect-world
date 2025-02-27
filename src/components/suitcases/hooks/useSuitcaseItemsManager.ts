
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { ClothesItem } from "@/components/clothes/types";

export const useSuitcaseItemsManager = (suitcaseId: string) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addItem = async (clothesId: string) => {
    if (!suitcaseId || !clothesId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Identifiants de valise ou de vêtement manquants",
      });
      return;
    }
    
    setIsAdding(true);
    try {
      // Vérification préalable pour voir si l'article existe déjà
      const { data: existingItems, error: checkError } = await supabase
        .from("suitcase_items")
        .select("id")
        .eq("suitcase_id", suitcaseId)
        .eq("clothes_id", clothesId);
      
      if (checkError) throw checkError;
      
      // Si l'article existe déjà, on ne l'ajoute pas à nouveau
      if (existingItems && existingItems.length > 0) {
        toast({
          title: "Information",
          description: "Ce vêtement est déjà dans la valise",
        });
        return;
      }

      // Ajouter l'article
      const { error } = await supabase
        .from("suitcase_items")
        .insert({
          suitcase_id: suitcaseId,
          clothes_id: clothesId,
          quantity: 1
        });

      if (error) throw error;

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à la valise",
      });

      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
    } catch (error: any) {
      console.error("Erreur lors de l'ajout d'un article à la valise:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le vêtement à la valise",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!itemId || !suitcaseId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Identifiant d'élément manquant",
      });
      return;
    }
    
    setIsRemoving(true);
    try {
      const { error } = await supabase
        .from("suitcase_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Vêtement retiré",
        description: "Le vêtement a été retiré de la valise",
      });

      // Invalider les requêtes pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
    } catch (error: any) {
      console.error("Erreur lors de la suppression d'un article de la valise:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de retirer le vêtement de la valise",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    isAdding,
    isRemoving,
    addItem,
    removeItem,
  };
};
