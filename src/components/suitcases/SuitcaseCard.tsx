
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { HelpCircle, Loader2, Luggage, Package, Trash2, Calendar } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
  const [startDate, setStartDate] = useState<Date | undefined>(
    suitcase.start_date ? new Date(suitcase.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    suitcase.end_date ? new Date(suitcase.end_date) : undefined
  );
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

  const handleDateChange = async (type: 'start' | 'end', date: Date | undefined) => {
    if (!date) return;

    try {
      const { error } = await supabase
        .from("suitcases")
        .update({
          [type === 'start' ? 'start_date' : 'end_date']: date.toISOString(),
        })
        .eq("id", suitcase.id);

      if (error) throw error;

      if (type === 'start') {
        setStartDate(date);
      } else {
        setEndDate(date);
      }

      queryClient.invalidateQueries({ queryKey: ["suitcases"] });
    } catch (error) {
      console.error(`Error updating ${type} date:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de mettre à jour la date de ${type === 'start' ? 'début' : 'fin'}`,
      });
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
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          currentClothes: items?.map(item => item.clothes) || []
        },
      });

      if (error) throw error;

      if (!data?.explanation) {
        throw new Error("La réponse ne contient pas d'explications");
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
        <div className="flex flex-col sm:flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PP", { locale: fr }) : "Date de début"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateChange('start', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PP", { locale: fr }) : "Date de fin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateChange('end', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

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
      </CardFooter>
    </Card>
  );
};
