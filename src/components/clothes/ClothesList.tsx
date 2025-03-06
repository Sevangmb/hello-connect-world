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
  
  const { clothes, loading } = useClothes(filters);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleArchive = async (id: string, archived: boolean) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from("clothes")
        .update({ 
          archived,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: archived ? "Vêtement archivé" : "Vêtement désarchivé",
        description: `Le vêtement a été ${archived ? "archivé" : "désarchivé"} avec succès`,
      });

      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    } catch (error: any) {
      console.error("Error updating clothes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de ${archived ? "archiver" : "désarchiver"} le vêtement`,
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAlterationToggle = async (id: string, needsAlteration: boolean) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from("clothes")
        .update({ 
          needs_alteration: needsAlteration,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: needsAlteration ? "Vêtement à retoucher" : "Vêtement retouché",
        description: needsAlteration 
          ? "Le vêtement a été marqué comme à retoucher"
          : "Le vêtement a été marqué comme retouché",
      });

      queryClient.invalidateQueries({ queryKey: ["clothes"] });
    } catch (error: any) {
      console.error("Error updating clothes:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de retouche",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <ClothesFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {loading ? (
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
              onArchive={handleArchive}
              onAlterationToggle={handleAlterationToggle}
              isDeleting={deletingId === cloth.id}
              isUpdating={updatingId === cloth.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
