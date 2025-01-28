import { ClothesFilters } from "@/hooks/useClothes";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
  "Hauts",
  "Bas",
  "Robes",
  "Manteaux",
  "Chaussures",
  "Accessoires",
];

type ClothesFiltersProps = {
  filters: ClothesFilters;
  onFiltersChange: (filters: ClothesFilters) => void;
};

export const ClothesFiltersComponent = ({ filters, onFiltersChange }: ClothesFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Rechercher..."
          value={filters.search || ""}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="flex-1"
        />
        <Select
          value={filters.category || ""}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value || undefined })}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toutes les catégories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={`${filters.sortBy || "created_at"}-${filters.sortOrder || "desc"}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split("-");
            onFiltersChange({ 
              ...filters, 
              sortBy: sortBy as "created_at" | "name",
              sortOrder: sortOrder as "asc" | "desc"
            });
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">Plus récents</SelectItem>
            <SelectItem value="created_at-asc">Plus anciens</SelectItem>
            <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};