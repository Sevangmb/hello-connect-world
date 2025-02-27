
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSuitcaseItemsApi } from "./api";
import type { SuitcaseItemsManagerHookReturn } from "./types";

export const useSuitcaseItemsManager = (suitcaseId: string): SuitcaseItemsManagerHookReturn => {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const queryClient = useQueryClient();
  const { checkExistingItem, addSuitcaseItem, removeSuitcaseItem, toast } = useSuitcaseItemsApi();

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
      const existingItems = await checkExistingItem(suitcaseId, clothesId);
      
      if (existingItems && existingItems.length > 0) {
        toast({
          title: "Information",
          description: "Ce vêtement est déjà dans la valise",
        });
        return;
      }

      await addSuitcaseItem(suitcaseId, clothesId);

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à la valise",
      });

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
      await removeSuitcaseItem(itemId);

      toast({
        title: "Vêtement retiré",
        description: "Le vêtement a été retiré de la valise",
      });

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
