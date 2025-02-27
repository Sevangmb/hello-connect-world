
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("suitcase_items")
        .insert({
          suitcase_id: suitcaseId,
          clothes_id: clothesId,
        });

      if (error) throw error;

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à la valise",
      });

      queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
    } catch (error: any) {
      console.error("Error adding item to suitcase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le vêtement à la valise",
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("suitcase_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Vêtement retiré",
        description: "Le vêtement a été retiré de la valise",
      });

      queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
    } catch (error: any) {
      console.error("Error removing item from suitcase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le vêtement de la valise",
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
