import { useState } from "react";
import { useClothes, ClothesFilters } from "@/hooks/useClothes";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ClothesFiltersComponent } from "./ClothesFilters";
import { ClothesCard } from "./ClothesCard";

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
      <ClothesFiltersComponent filters={filters} onFiltersChange={setFilters} />

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
            <ClothesCard
              key={cloth.id}
              cloth={cloth}
              onDelete={handleDelete}
              isDeleting={deletingId === cloth.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};