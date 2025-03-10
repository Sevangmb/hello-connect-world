
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/modules/auth";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ClothesGrid } from "@/components/clothes/ClothesGrid";
import { useClothes } from "@/hooks/useClothes";

const Wardrobe: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { clothes, loading, error, filters, updateFilters } = useClothes({ showArchived: false });
  
  useEffect(() => {
    if (searchTerm) {
      updateFilters({ search: searchTerm });
    } else {
      updateFilters({ search: undefined });
    }
  }, [searchTerm, updateFilters]);
  
  const handleAddClothing = () => {
    navigate("/clothes/add");
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClothingSelect = (item: any) => {
    navigate(`/clothes/${item.id}`);
  };
  
  if (error) {
    toast.error("Erreur lors du chargement des vêtements", {
      description: "Veuillez rafraîchir la page ou réessayer plus tard.",
    });
  }
  
  return (
    <ModuleGuard moduleCode="clothes">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Ma Garde-robe</h1>
          <Button onClick={handleAddClothing} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un vêtement
          </Button>
        </div>
        
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un vêtement..."
                className="pl-9"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-muted-foreground">Chargement de vos vêtements...</p>
            </div>
          ) : clothes.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Vous n'avez pas encore de vêtements</h2>
              <p className="text-muted-foreground mb-6">
                Commencez à créer votre garde-robe virtuelle en ajoutant vos vêtements
              </p>
              <Button onClick={handleAddClothing}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter mon premier vêtement
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Tous vos vêtements ({clothes.length})</h2>
              <ClothesGrid 
                clothes={clothes} 
                loading={loading} 
                onSelectItem={handleClothingSelect}
              />
            </>
          )}
        </Card>
      </div>
    </ModuleGuard>
  );
};

export default Wardrobe;
