
import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaveChangesButton } from "./SaveChangesButton";
import { useToast } from "@/hooks/use-toast";

interface ModulesFooterProps {
  moduleCount: number;
  hasPendingChanges: boolean;
  saving: boolean;
  onSave: () => void;
  error: string | null;
}

export const ModulesFooter: React.FC<ModulesFooterProps> = ({
  moduleCount,
  hasPendingChanges,
  saving,
  onSave,
  error,
}) => {
  const { toast } = useToast();
  
  // Fonction pour gérer le clic sur le bouton de sauvegarde
  const handleSave = () => {
    try {
      if (hasPendingChanges) {
        onSave();
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      toast({
        variant: "destructive",
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de l'enregistrement des modifications."
      });
    }
  };

  return (
    <CardFooter className="flex justify-between">
      <div className="flex items-center">
        <Badge variant="outline" className="mr-2">
          {moduleCount} module{moduleCount > 1 ? "s" : ""}
        </Badge>
        {hasPendingChanges && (
          <Badge variant="destructive">
            Modifications non enregistrées
          </Badge>
        )}
      </div>
      <SaveChangesButton
        hasPendingChanges={hasPendingChanges}
        saving={saving}
        onSave={handleSave}
        error={error}
      />
    </CardFooter>
  );
};
