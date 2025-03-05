
// Mettre à jour l'interface des props
export interface ShopItemsFilterProps {
  filters: {
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  };
  onFilterChange: (filters: {
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  }) => void;
}
