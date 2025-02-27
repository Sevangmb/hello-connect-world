
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Delete associated suitcase items first
      const { error: itemsError } = await supabase
        .from("suitcase_items")
        .delete()
        .eq("suitcase_id", suitcaseId);

      if (itemsError) throw itemsError;

      // Then delete the suitcase
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

      queryClient.invalidateQueries({ queryKey: ["suitcases"] });
    } catch (e: any) {
      console.error("Error deleting suitcase:", e);
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
