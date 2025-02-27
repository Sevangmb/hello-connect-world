
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Suitcase } from "@/components/suitcases/utils/types";
import { SuitcaseDates } from "./SuitcaseDates";
import { SuitcaseItems } from "@/components/suitcases/SuitcaseItems";
import { SuitcaseActions } from "./SuitcaseActions";

interface SuitcaseCardProps {
  suitcase: Suitcase;
  isSelected: boolean;
  onSelect: (id: string | undefined) => void;
}

export const SuitcaseCard = ({
  suitcase,
  isSelected,
  onSelect,
}: SuitcaseCardProps) => {
  const startDate = suitcase.start_date ? new Date(suitcase.start_date) : undefined;
  const endDate = suitcase.end_date ? new Date(suitcase.end_date) : undefined;

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return "Pas de dates";
    
    return `${format(new Date(startDate), "d MMM", { locale: fr })} - ${format(new Date(endDate), "d MMM yyyy", { locale: fr })}`;
  };

  return (
    <Card 
      className={`group transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">{suitcase.name}</CardTitle>
          <Badge variant={suitcase.status === "active" ? "default" : suitcase.status === "archived" ? "secondary" : "destructive"}>
            {suitcase.status === "active" ? "Active" : suitcase.status === "archived" ? "Archivée" : "Supprimée"}
          </Badge>
        </div>
        {suitcase.description && (
          <CardDescription className="line-clamp-2">
            {suitcase.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground mb-4">
          {startDate && endDate ? (
            <div className="flex gap-1 items-center">
              <Calendar className="w-4 h-4" />
              <span>{formatDateRange(suitcase.start_date, suitcase.end_date)}</span>
            </div>
          ) : (
            <div className="flex gap-1 items-center text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Pas de dates programmées</span>
            </div>
          )}
        </div>
        
        {isSelected && (
          <div className="pt-2 animate-fade-in">
            <SuitcaseDates
              suitcaseId={suitcase.id}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-col gap-2">
        <Button 
          variant={isSelected ? "default" : "outline"} 
          size="sm" 
          className="w-full"
          onClick={() => onSelect(isSelected ? undefined : suitcase.id)}
        >
          {isSelected ? "Masquer les détails" : "Afficher les détails"}
        </Button>
        
        {isSelected && (
          <div className="w-full space-y-4 pt-2 animate-fade-in">
            <SuitcaseItems suitcaseId={suitcase.id} />
            
            <SuitcaseActions 
              suitcaseId={suitcase.id}
              isSelected={isSelected}
              onSelect={onSelect}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
