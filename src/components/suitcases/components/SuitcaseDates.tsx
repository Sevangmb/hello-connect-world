
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SuitcaseDatesProps {
  suitcaseId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export const SuitcaseDates = ({
  suitcaseId,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: SuitcaseDatesProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDateChange = async (type: 'start' | 'end', date: Date | undefined) => {
    if (!date) return;

    try {
      const { error } = await supabase
        .from("suitcases")
        .update({
          [type === 'start' ? 'start_date' : 'end_date']: date.toISOString(),
        })
        .eq("id", suitcaseId);

      if (error) throw error;

      if (type === 'start') {
        onStartDateChange(date);
      } else {
        onEndDateChange(date);
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

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PP", { locale: fr }) : "Date de début"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => handleDateChange('start', date)}
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PP", { locale: fr }) : "Date de fin"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => handleDateChange('end', date)}
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
