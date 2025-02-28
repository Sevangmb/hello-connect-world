
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModuleStatus } from "@/hooks/modules/types";
import { useToast } from "@/hooks/use-toast";

interface ModuleToggleProps {
  moduleId: string;
  currentStatus: ModuleStatus;
  isCore: boolean;
  canToggle: boolean;
  onToggle: (moduleId: string, currentStatus: ModuleStatus) => void;
}

export const ModuleToggle: React.FC<ModuleToggleProps> = ({
  moduleId,
  currentStatus,
  isCore,
  canToggle,
  onToggle,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      
      // Appeler uniquement la fonction de toggle fournie par le parent
      // qui utilisera ensuite updateModuleStatus du hook useModules
      // pour assurer la cohérence entre l'UI et la base de données
      onToggle(moduleId, currentStatus);
    } catch (err) {
      console.error("Erreur lors du toggle du module:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "La mise à jour du module a échoué. Veuillez réessayer.",
      });
    } finally {
      // On laisse le composant parent gérer l'état de chargement pour une meilleure UX
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  // Déterminer si le module est actif en fonction du statut courant
  const isActive = currentStatus === 'active';

  return (
    <div className="flex items-center gap-2">
      {isUpdating ? (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
          <span className="text-xs">Mise à jour...</span>
        </div>
      ) : (
        <Switch
          checked={isActive}
          onCheckedChange={handleToggle}
          disabled={!canToggle || isUpdating}
          className={isActive ? "bg-green-500" : ""}
        />
      )}
      
      {!canToggle && isCore && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Module core, ne peut pas être désactivé</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {!canToggle && !isCore && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Ce module est requis par d'autres modules actifs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {isActive && (
        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
          Actif
        </span>
      )}
      
      {!isActive && (
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
          Inactif
        </span>
      )}
    </div>
  );
};
