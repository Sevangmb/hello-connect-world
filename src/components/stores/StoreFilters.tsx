import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterState } from "@/hooks/useStores";

interface StoreFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function StoreFilters({ filters, onFiltersChange }: StoreFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Select
        value={filters.category}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, category: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les catégories</SelectItem>
          <SelectItem value="homme">Homme</SelectItem>
          <SelectItem value="femme">Femme</SelectItem>
          <SelectItem value="enfant">Enfant</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priceRange}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, priceRange: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Gamme de prix" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les prix</SelectItem>
          <SelectItem value="low">€ Économique</SelectItem>
          <SelectItem value="medium">€€ Moyen</SelectItem>
          <SelectItem value="high">€€€ Premium</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.style}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, style: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les styles</SelectItem>
          <SelectItem value="casual">Casual</SelectItem>
          <SelectItem value="chic">Chic</SelectItem>
          <SelectItem value="sport">Sport</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
