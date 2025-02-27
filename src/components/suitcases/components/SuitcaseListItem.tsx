
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GripVertical, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Suitcase } from "@/components/suitcases/utils/types";
import { SuitcaseDates } from "./SuitcaseDates";
import { SuitcaseItems } from "@/components/suitcases/SuitcaseItems";
import { SuitcaseActions } from "./SuitcaseActions";

interface SuitcaseListItemProps {
  suitcase: Suitcase;
  isSelected: boolean;
  onSelect: (id: string | undefined) => void;
}

export const SuitcaseListItem = ({
  suitcase,
  isSelected,
  onSelect,
}: SuitcaseListItemProps) => {
  const startDate = suitcase.start_date ? new Date(suitcase.start_date) : undefined;
  const endDate = suitcase.end_date ? new Date(suitcase.end_date) : undefined;

  const formatDateRange = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return "Pas de dates";
    
    return `${format(new Date(startDate), "d MMM", { locale: fr })} - ${format(new Date(endDate), "d MMM yyyy", { locale: fr })}`;
  };

  return (
    <div 
      className={`border rounded-md mb-3 overflow-hidden transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => onSelect(isSelected ? undefined : suitcase.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GripVertical className="text-muted-foreground h-5 w-5" />
            <div>
              <h3 className="font-medium">{suitcase.name}</h3>
              <p className="text-sm text-muted-foreground">
                {startDate && endDate
                  ? formatDateRange(suitcase.start_date, suitcase.end_date)
                  : "Pas de dates programmées"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={suitcase.status === "active" ? "default" : suitcase.status === "archived" ? "secondary" : "destructive"}>
              {suitcase.status === "active" ? "Active" : suitcase.status === "archived" ? "Archivée" : "Supprimée"}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(isSelected ? undefined : suitcase.id);
              }}
            >
              {isSelected ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="px-4 pb-4 pt-2 border-t animate-fade-in">
          <div className="space-y-4">
            {suitcase.description && (
              <p className="text-sm">{suitcase.description}</p>
            )}
            
            <SuitcaseDates
              suitcaseId={suitcase.id}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={() => {}}
              onEndDateChange={() => {}}
            />
            
            <SuitcaseItems suitcaseId={suitcase.id} />
            
            <SuitcaseActions 
              suitcaseId={suitcase.id}
              isSelected={isSelected}
              onSelect={onSelect}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};
