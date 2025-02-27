
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SuitcaseSearchBarProps {
  search: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

export const SuitcaseSearchBar = ({
  search,
  onSearchChange,
  onClearSearch,
}: SuitcaseSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="pl-9 pr-9"
        placeholder="Rechercher une valise..."
        value={search || ""}
        onChange={onSearchChange}
      />
      {search && (
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          onClick={onClearSearch}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
