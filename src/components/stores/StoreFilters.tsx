
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterState } from "@/hooks/useStores";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";

interface StoreFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function StoreFilters({ filters, onFiltersChange }: StoreFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState([0, 100]);
  
  // Fetch shop categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const { data, error } = await supabase
          .from('site_categories')
          .select('name')
          .eq('type', 'shop_category')
          .eq('is_active', true)
          .order('order_index');
          
        if (error) throw error;
        
        setCategories(data.map(cat => cat.name));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleResetFilters = () => {
    onFiltersChange({
      category: "all",
      priceRange: "all",
      style: "all",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Select 
            value={filters.category} 
            onValueChange={(value) => onFiltersChange({...filters, category: value})}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {loadingCategories ? (
                <SelectItem value="loading" disabled>Chargement...</SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.priceRange} 
            onValueChange={(value) => onFiltersChange({...filters, priceRange: value})}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tous les prix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les prix</SelectItem>
              <SelectItem value="budget">Budget (€)</SelectItem>
              <SelectItem value="mid">Milieu de gamme (€€)</SelectItem>
              <SelectItem value="premium">Premium (€€€)</SelectItem>
              <SelectItem value="luxury">Luxe (€€€€)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.style} 
            onValueChange={(value) => onFiltersChange({...filters, style: value})}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tous les styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les styles</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="chic">Chic</SelectItem>
              <SelectItem value="streetwear">Streetwear</SelectItem>
              <SelectItem value="vintage">Vintage</SelectItem>
              <SelectItem value="boheme">Bohème</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetFilters}
            className={`${
              filters.category === "all" && 
              filters.priceRange === "all" && 
              filters.style === "all" 
                ? "opacity-50" 
                : ""
            }`}
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            {showAdvancedFilters ? "Masquer" : "Plus de filtres"}
          </Button>
        </div>
      </div>
      
      {/* Active filters */}
      <div className="flex flex-wrap gap-2">
        {filters.category !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Catégorie: {filters.category}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onFiltersChange({...filters, category: "all"})}
            />
          </Badge>
        )}
        {filters.priceRange !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Prix: {filters.priceRange}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onFiltersChange({...filters, priceRange: "all"})}
            />
          </Badge>
        )}
        {filters.style !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Style: {filters.style}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onFiltersChange({...filters, style: "all"})}
            />
          </Badge>
        )}
      </div>
      
      {/* Advanced filters (hidden by default) */}
      {showAdvancedFilters && (
        <div className="p-4 border rounded-lg space-y-4 mt-4">
          <h3 className="font-medium">Filtres avancés</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Gamme de prix</span>
              <span className="text-sm font-medium">
                {localPriceRange[0]}€ - {localPriceRange[1] === 100 ? "1000€+" : `${localPriceRange[1] * 10}€`}
              </span>
            </div>
            <Slider
              defaultValue={localPriceRange}
              max={100}
              step={1}
              onValueChange={(value) => setLocalPriceRange(value as number[])}
              className="my-6"
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  priceRange: `custom:${localPriceRange[0]}-${localPriceRange[1]}`
                });
                setShowAdvancedFilters(false);
              }}
            >
              Appliquer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
