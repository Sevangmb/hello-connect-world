
import { ClothesFilters } from "@/hooks/useClothes";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CATEGORIES = [
  "Hauts",
  "Bas",
  "Robes",
  "Manteaux",
  "Chaussures",
  "Accessoires",
];

const SUBCATEGORIES = {
  "Hauts": ["T-shirt", "Chemise", "Pull", "Sweat", "Top"],
  "Bas": ["Pantalon", "Jean", "Short", "Jupe"],
  "Robes": ["Robe courte", "Robe longue", "Robe de soirée"],
  "Manteaux": ["Manteau", "Veste", "Blazer", "Imperméable"],
  "Chaussures": ["Baskets", "Bottes", "Sandales", "Escarpins"],
  "Accessoires": ["Sac", "Bijoux", "Ceinture", "Écharpe"],
};

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
          value={filters.category || "all"}
          onValueChange={(value) => onFiltersChange({ 
            ...filters, 
            category: value === "all" ? undefined : value,
            subcategory: undefined // Reset subcategory when category changes
          })}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.category && SUBCATEGORIES[filters.category] && (
          <Select
            value={filters.subcategory || "all"}
            onValueChange={(value) => onFiltersChange({ 
              ...filters, 
              subcategory: value === "all" ? undefined : value 
            })}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Toutes les sous-catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sous-catégories</SelectItem>
              {SUBCATEGORIES[filters.category].map((subcategory) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={`${filters.sortBy || "created_at"}-${filters.sortOrder || "desc"}`}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split("-");
            onFiltersChange({ 
              ...filters, 
              sortBy: sortBy as "created_at" | "name" | "price" | "purchase_date",
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
            <SelectItem value="price-desc">Prix (décroissant)</SelectItem>
            <SelectItem value="price-asc">Prix (croissant)</SelectItem>
            <SelectItem value="purchase_date-desc">Date d'achat (récent)</SelectItem>
            <SelectItem value="purchase_date-asc">Date d'achat (ancien)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="show-archived"
            checked={filters.showArchived || false}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, showArchived: checked })
            }
          />
          <Label htmlFor="show-archived">Afficher les vêtements archivés</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="needs-alteration"
            checked={filters.needsAlteration || false}
            onCheckedChange={(checked) => 
              onFiltersChange({ ...filters, needsAlteration: checked })
            }
          />
          <Label htmlFor="needs-alteration">À retoucher</Label>
        </div>
      </div>
    </div>
  );
};

// Export explicitly
export { ClothesFiltersComponent as ClothesFilters };
