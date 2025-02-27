
import { useState } from 'react';
import { useSuitcaseItemsApi } from './api';
import type { SuitcaseItemsManagerHookReturn } from './types';
import { useQueryClient } from '@tanstack/react-query';

export const useSuitcaseItemsManager = (suitcaseId: string): SuitcaseItemsManagerHookReturn => {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingBulk, setIsAddingBulk] = useState(false);
  const queryClient = useQueryClient();
  const { checkExistingItem, addSuitcaseItem, addMultipleSuitcaseItems, removeSuitcaseItem, toast } = useSuitcaseItemsApi();

  const addItem = async (clothesId: string) => {
    setIsAdding(true);
    try {
      console.log("Tentative d'ajout de l'article:", clothesId, "à la valise:", suitcaseId);
      
      // Vérifier si l'article existe déjà dans la valise
      const existingItems = await checkExistingItem(suitcaseId, clothesId);
      
      if (existingItems.length > 0) {
        console.log("Article déjà dans la valise:", existingItems);
        toast({
          title: "Déjà ajouté",
          description: "Cet article est déjà dans votre valise",
        });
        return;
      }

      // Ajouter l'article à la valise
      const result = await addSuitcaseItem(suitcaseId, clothesId);
      console.log("Article ajouté avec succès:", result);
      
      // Invalider la requête pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['suitcase-items', suitcaseId] });
      
      toast({
        title: "Ajouté",
        description: "L'article a été ajouté à votre valise",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'ajout d'un article:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'article à la valise",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsRemoving(true);
    try {
      console.log("Tentative de suppression de l'article:", itemId);
      await removeSuitcaseItem(itemId);
      console.log("Article supprimé avec succès");
      
      // Invalider la requête pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['suitcase-items', suitcaseId] });
      
      toast({
        title: "Supprimé",
        description: "L'article a été retiré de votre valise",
      });
    } catch (error: any) {
      console.error("Erreur lors de la suppression d'un article:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de retirer l'article de la valise",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const addMultipleItems = async (clothesIds: string[]) => {
    if (!clothesIds.length) return;
    
    setIsAddingBulk(true);
    try {
      console.log("Tentative d'ajout multiple:", clothesIds);
      
      // Créer un tableau d'objets pour l'insertion en masse
      const itemsToAdd = clothesIds.map(id => ({
        suitcase_id: suitcaseId,
        clothes_id: id,
        quantity: 1
      }));
      
      // Ajouter les articles en masse
      const result = await addMultipleSuitcaseItems(itemsToAdd);
      console.log("Articles ajoutés avec succès:", result);
      
      // Invalider la requête pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['suitcase-items', suitcaseId] });
      
      toast({
        title: "Ajoutés",
        description: `${clothesIds.length} articles ont été ajoutés à votre valise`,
      });
    } catch (error: any) {
      console.error("Erreur lors de l'ajout en masse:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'ajouter les articles à la valise",
      });
    } finally {
      setIsAddingBulk(false);
    }
  };
  
  const addSuggestedClothes = async (clothesIds: string[]) => {
    await addMultipleItems(clothesIds);
  };

  return {
    isAdding,
    isRemoving,
    isAddingBulk,
    addItem,
    removeItem,
    addSuggestedClothes,
    addMultipleItems
  };
};
