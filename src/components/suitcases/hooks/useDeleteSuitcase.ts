
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteSuitcase = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteSuitcase = async (suitcaseId: string) => {
    if (!suitcaseId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de valise manquant",
      });
      return;
    }
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette valise ?")) return;
    
    setIsDeleting(true);
    setError(null);

    try {
      // Récupérer l'utilisateur actuel pour confirmer l'autorisation
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      // Supprimer d'abord les éléments de la valise via la RPC (procédure stockée)
      const { error: itemsError } = await supabase.rpc('delete_suitcase_items', { suitcase_id_param: suitcaseId });
      
      if (itemsError) {
        console.error("Erreur lors de la suppression des éléments:", itemsError);
        
        // Fallback: méthode classique si la RPC échoue
        const { error: fallbackError } = await supabase
          .from("suitcase_items")
          .delete()
          .eq("suitcase_id", suitcaseId);
        
        if (fallbackError) throw fallbackError;
      }

      // Puis supprimer la valise elle-même
      const { error: deleteError } = await supabase
        .from("suitcases")
        .delete()
        .eq("id", suitcaseId)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      toast({
        title: "Valise supprimée",
        description: "La valise a été supprimée avec succès",
      });

      // Invalidez la requête pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ["suitcases"] });
    } catch (e: any) {
      console.error("Erreur lors de la suppression de la valise:", e);
      const errorMessage = e.message || "Impossible de supprimer la valise";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    error,
    deleteSuitcase,
  };
};
