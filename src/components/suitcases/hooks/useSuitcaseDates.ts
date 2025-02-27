
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useSuitcaseDates = (suitcaseId: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateDates = async (startDate?: Date, endDate?: Date) => {
    if (!suitcaseId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "ID de valise manquant",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("suitcases")
        .update({
          start_date: startDate ? startDate.toISOString() : null,
          end_date: endDate ? endDate.toISOString() : null,
        })
        .eq("id", suitcaseId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["suitcases"] });
      
      toast({
        title: "Dates mises à jour",
        description: "Les dates de la valise ont été mises à jour",
      });
    } catch (error: any) {
      console.error("Error updating suitcase dates:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les dates",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateDates,
  };
};
