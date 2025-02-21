
import { useState } from "react";
import { Luggage } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Suitcase } from "@/hooks/useSuitcases";
import { SuitcaseItems } from "./SuitcaseItems";
import { SuitcaseDates } from "./components/SuitcaseDates";
import { SuitcaseActions } from "./components/SuitcaseActions";

interface SuitcaseCardProps {
  suitcase: Suitcase;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const SuitcaseCard = ({ suitcase, onSelect, isSelected }: SuitcaseCardProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    suitcase.start_date ? new Date(suitcase.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    suitcase.end_date ? new Date(suitcase.end_date) : undefined
  );

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
        
        <SuitcaseDates
          suitcaseId={suitcase.id}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {isSelected && <SuitcaseItems suitcaseId={suitcase.id} />}
      </CardContent>
      <CardFooter>
        <SuitcaseActions
          suitcaseId={suitcase.id}
          isSelected={isSelected}
          onSelect={onSelect}
          startDate={startDate}
          endDate={endDate}
        />
      </CardFooter>
    </Card>
  );
};
