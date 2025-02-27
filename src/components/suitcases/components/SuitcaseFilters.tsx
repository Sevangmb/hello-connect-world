
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SuitcaseFilters as SuitcaseFiltersType } from "@/hooks/useSuitcases";

interface SuitcaseFiltersProps {
  filters: SuitcaseFiltersType;
  statusLabels: Record<string, { label: string; color: string }>;
  onStatusChange: (status: string) => void;
  onClearSearch: () => void;
}

export const SuitcaseFilters = ({
  filters,
  statusLabels,
  onStatusChange,
  onClearSearch,
}: SuitcaseFiltersProps) => {
  return (
    <>
      <Select
        value={filters.status || "active"}
        onValueChange={onStatusChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Actives</SelectItem>
          <SelectItem value="archived">Archivées</SelectItem>
          <SelectItem value="deleted">Supprimées</SelectItem>
          <SelectItem value="all">Toutes</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex gap-2 mt-2 flex-wrap">
        {filters.status && (
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 py-1"
          >
            Statut: {statusLabels[filters.status as keyof typeof statusLabels]?.label || filters.status}
            <button 
              onClick={() => onStatusChange("active")}
              className="ml-1 hover:bg-muted rounded-full"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {filters.search && (
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 py-1"
          >
            Recherche: {filters.search}
            <button 
              onClick={onClearSearch}
              className="ml-1 hover:bg-muted rounded-full"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </>
  );
};
