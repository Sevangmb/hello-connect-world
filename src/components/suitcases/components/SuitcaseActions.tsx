
import { useState } from "react";
import { HelpCircle, Loader2, Package, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SuitcaseActionsProps {
  suitcaseId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  startDate?: Date;
  endDate?: Date;
}

type SuggestedClothing = {
  id: string;
  name: string;
  category: string;
};

export const SuitcaseActions = ({
  suitcaseId,
  isSelected,
  onSelect,
  startDate,
  endDate,
}: SuitcaseActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [suggestedClothes, setSuggestedClothes] = useState<SuggestedClothing[]>([]);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
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
          clothes ( id, name, category )
        `)
        .eq("suitcase_id", suitcaseId);
      if (existingItemsError) throw existingItemsError;

      // Appel de la fonction d'IA
      const { data, error } = await supabase.functions.invoke("get-suitcase-suggestions", {
        body: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          currentClothes: existingItems?.map(item => item.clothes),
        },
      });

      if (error) throw error;

      if (!data?.explanation || !data?.suggestedClothes) {
        throw new Error("La réponse ne contient pas les informations nécessaires");
      }

      // Récupérer les détails des vêtements suggérés
      const { data: clothesDetails, error: clothesError } = await supabase
        .from("clothes")
        .select("id, name, category")
        .in("id", data.suggestedClothes);

      if (clothesError) throw clothesError;

      // Filtrer les vêtements déjà présents dans la valise
      const existingIds = new Set(existingItems?.map(item => item.clothes_id));
      const newSuggestions = clothesDetails?.filter(cloth => !existingIds.has(cloth.id)) || [];

      setSuggestedClothes(newSuggestions);
      setAiExplanation(data.explanation);
      setShowSuggestionsDialog(true);
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

  const handleAddSuggestedClothes = async () => {
    try {
      const { error } = await supabase
        .from("suitcase_items")
        .insert(
          suggestedClothes.map(cloth => ({
            suitcase_id: suitcaseId,
            clothes_id: cloth.id,
          }))
        );

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["suitcase-items", suitcaseId] });
      toast({
        title: "Suggestions ajoutées",
        description: `${suggestedClothes.length} vêtements ont été ajoutés à votre valise.`,
      });
      setShowSuggestionsDialog(false);
      setSuggestedClothes([]);
    } catch (error) {
      console.error("Error adding suggested clothes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter les vêtements suggérés",
      });
    }
  };

  return (
    <>
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

      <Dialog open={showSuggestionsDialog} onOpenChange={setShowSuggestionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggestions de l'IA</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {aiExplanation}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {suggestedClothes.length > 0 ? (
              <>
                <div className="grid gap-2">
                  {suggestedClothes.map((cloth) => (
                    <div key={cloth.id} className="flex items-center gap-2 p-2 border rounded">
                      <span className="font-medium">{cloth.name}</span>
                      <span className="text-sm text-muted-foreground">({cloth.category})</span>
                    </div>
                  ))}
                </div>
                <Button onClick={handleAddSuggestedClothes} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter les suggestions à la valise
                </Button>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Aucun nouveau vêtement à suggérer pour cette valise
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
