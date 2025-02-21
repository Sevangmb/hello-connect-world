
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { HelpCircle, Loader2, Luggage, Package, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Suitcase } from "@/hooks/useSuitcases";
import { SuitcaseItems } from "./SuitcaseItems";

interface SuitcaseCardProps {
  suitcase: Suitcase;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const SuitcaseCard = ({ suitcase, onSelect, isSelected }: SuitcaseCardProps) => {
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
        .eq("id", suitcase.id);

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
    setIsGettingSuggestions(true);
    try {
      const { data: items } = await supabase
        .from("suitcase_items")
        .select(`
          *,
          clothes (
            id,
            name,
            category
          )
        `)
        .eq("suitcase_id", suitcase.id);

      const { data, error } = await supabase.functions.invoke("get-suitcase-suggestions", {
        body: {
          startDate: suitcase.start_date,
          endDate: suitcase.end_date,
          currentClothes: items?.map(item => item.clothes) || []
        },
      });

      if (error) throw error;

      toast({
        title: "Suggestions de l'IA",
        description: data.explanation,
      });
      
      // Optionnel : on pourrait automatiquement ajouter les vêtements suggérés à la valise
      // mais pour l'instant on affiche juste l'explication

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
    <Card className={`relative overflow-hidden ${isSelected ? "border-primary" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Luggage className="h-5 w-5" />
          {suitcase.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suitcase.description && (
          <p className="text-sm text-muted-foreground">{suitcase.description}</p>
        )}
        {(suitcase.start_date || suitcase.end_date) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {suitcase.start_date && format(new Date(suitcase.start_date), "PP", { locale: fr })}
              {suitcase.start_date && suitcase.end_date && " - "}
              {suitcase.end_date && format(new Date(suitcase.end_date), "PP", { locale: fr })}
            </span>
          </div>
        )}

        {isSelected && <SuitcaseItems suitcaseId={suitcase.id} />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant={isSelected ? "default" : "outline"} 
            onClick={() => onSelect(suitcase.id)}
          >
            <Package className="mr-2 h-4 w-4" />
            {isSelected ? "Masquer les vêtements" : "Voir les vêtements"}
          </Button>
          <Button
            variant="outline"
            onClick={handleGetSuggestions}
            disabled={isGettingSuggestions}
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
      </CardFooter>
    </Card>
  );
};
