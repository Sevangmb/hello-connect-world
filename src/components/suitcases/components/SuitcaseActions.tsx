
import { useState } from "react";
import { HelpCircle, Loader2, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface SuitcaseActionsProps {
  suitcaseId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  startDate?: Date;
  endDate?: Date;
}

export const SuitcaseActions = ({
  suitcaseId,
  isSelected,
  onSelect,
  startDate,
  endDate,
}: SuitcaseActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette valise ?")) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("suitcases")
        .delete()
        .eq("id", suitcaseId);

      if (error) throw error;

      toast({
        title: "Valise supprimée",
        description: "La valise a été supprimée avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["suitcases"] });
    } catch (error) {
      console.error("Error deleting suitcase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la valise",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les dates de début et de fin sont requises pour obtenir des suggestions",
      });
      return;
    }

    setIsGettingSuggestions(true);
    try {
      // Récupérer les vêtements déjà dans la valise
      const { data: existingItems, error: existingItemsError } = await supabase
        .from("suitcase_items")
        .select(`
          *,
          clothes (
            id,
            name,
            category
          )
        `)
        .eq("suitcase_id", suitcaseId);

      if (existingItemsError) throw existingItemsError;

      // Récupérer tous les vêtements disponibles de l'utilisateur
      const { data: userClothes, error: userClothesError } = await supabase
        .from("clothes")
        .select("*")
        .eq("archived", false);

      if (userClothesError) throw userClothesError;

      console.log("Calling get-suitcase-suggestions with:", {
        startDate,
        endDate,
        currentClothes: existingItems?.map(item => item.clothes),
        availableClothes: userClothes
      });

      const { data, error } = await supabase.functions.invoke("get-suitcase-suggestions", {
        body: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          currentClothes: existingItems?.map(item => item.clothes) || [],
          availableClothes: userClothes || []
        },
      });

      console.log("Response from get-suitcase-suggestions:", data);

      if (error) throw error;

      if (!data?.explanation) {
        throw new Error("La réponse ne contient pas d'explications");
      }

      // Ajouter les vêtements suggérés à la valise
      if (data.suggestedClothes && Array.isArray(data.suggestedClothes)) {
        const clothesToAdd = data.suggestedClothes
          .filter(clothId => !existingItems?.some(item => item.clothes_id === clothId));

        if (clothesToAdd.length > 0) {
          const { error: insertError } = await supabase
            .from("suitcase_items")
            .insert(
              clothesToAdd.map(clothId => ({
                suitcase_id: suitcaseId,
                clothes_id: clothId
              }))
            );

          if (insertError) throw insertError;

          await queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
        }
      }

      toast({
        title: "Suggestions de l'IA",
        description: data.explanation,
      });
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'obtenir les suggestions",
      });
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button
          variant={isSelected ? "default" : "outline"}
          onClick={() => onSelect(suitcaseId)}
        >
          <Package className="mr-2 h-4 w-4" />
          {isSelected ? "Masquer les vêtements" : "Voir les vêtements"}
        </Button>
        <Button
          variant="outline"
          onClick={handleGetSuggestions}
          disabled={isGettingSuggestions || !startDate || !endDate}
        >
          {isGettingSuggestions ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <HelpCircle className="mr-2 h-4 w-4" />
          )}
          Demander à l'IA
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
