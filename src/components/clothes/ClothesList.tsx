import { useState } from "react";
import { useClothes, ClothesFilters } from "@/hooks/useClothes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { EditClothesDialog } from "./EditClothesDialog";

const CATEGORIES = [
  "Hauts",
  "Bas",
  "Robes",
  "Manteaux",
  "Chaussures",
  "Accessoires",
];

export const ClothesList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ClothesFilters>({});
  const { data: clothes, isLoading } = useClothes(filters);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from("clothes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Vêtement supprimé",
        description: "Le vêtement a été supprimé avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    } catch (error: any) {
      console.error("Error deleting clothes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le vêtement",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Rechercher..."
            value={filters.search || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="flex-1"
          />
          <Select
            value={filters.category || ""}
            onValueChange={(value) => setFilters(prev => ({ ...prev, category: value || undefined }))}
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
              setFilters(prev => ({ 
                ...prev, 
                sortBy: sortBy as "created_at" | "name",
                sortOrder: sortOrder as "asc" | "desc"
              }));
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

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : !clothes?.length ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucun vêtement trouvé
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clothes.map((cloth) => (
            <Card key={cloth.id}>
              {cloth.image_url && (
                <img
                  src={cloth.image_url}
                  alt={cloth.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{cloth.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {cloth.category}
                  </span>
                </CardTitle>
              </CardHeader>
              {cloth.description && (
                <CardContent>
                  <p className="text-muted-foreground">{cloth.description}</p>
                </CardContent>
              )}
              <CardFooter className="flex justify-end gap-2">
                <EditClothesDialog 
                  clothes={cloth}
                  trigger={
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleDelete(cloth.id)}
                  disabled={deletingId === cloth.id}
                >
                  {deletingId === cloth.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};