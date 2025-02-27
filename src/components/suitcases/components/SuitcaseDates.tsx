
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useSuitcaseDates } from "../hooks/useSuitcaseDates";

interface SuitcaseDatesProps {
  suitcaseId: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const SuitcaseDates = ({
  suitcaseId,
  startDate,
  endDate,
}: SuitcaseDatesProps) => {
  const { isUpdating, updateDates } = useSuitcaseDates(suitcaseId);

  const handleStartDateChange = (date: Date | undefined) => {
    updateDates(date, endDate);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    updateDates(startDate, date);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-[240px] justify-start text-left font-normal"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}
            {startDate ? format(startDate, "PP", { locale: fr }) : "Date de début"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleStartDateChange}
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-[240px] justify-start text-left font-normal"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}
            {endDate ? format(endDate, "PP", { locale: fr }) : "Date de fin"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndDateChange}
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
