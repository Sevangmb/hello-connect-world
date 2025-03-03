
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SaveChangesButtonProps {
  hasPendingChanges: boolean;
  saving: boolean;
  onSave: () => void;
  error?: string | null;
}

export const SaveChangesButton: React.FC<SaveChangesButtonProps> = ({
  hasPendingChanges,
  saving,
  onSave,
  error
}) => {
  const [savingTimeout, setSavingTimeout] = React.useState<boolean>(false);
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Gérer le cas où saving reste bloqué trop longtemps
  React.useEffect(() => {
    if (saving && !savingTimeout) {
      // Si saving est toujours actif après 10 secondes, montrer un bouton pour réessayer
      saveTimeoutRef.current = setTimeout(() => {
        setSavingTimeout(true);
      }, 10000);
    } else if (!saving) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      setSavingTimeout(false);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saving, savingTimeout]);

  return (
    <div className="flex items-center gap-2">
      {savingTimeout && (
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            window.location.reload();
          }}
          variant="outline"
          className="flex items-center gap-2 text-orange-500 border-orange-500 hover:bg-orange-50"
        >
          <RefreshCw className="h-4 w-4" />
          Rafraîchir
        </Button>
      )}
      
      <Button 
        onClick={onSave} 
        disabled={!hasPendingChanges || saving}
        className="flex items-center gap-2"
        variant={saving ? "outline" : "default"}
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </>
        )}
      </Button>
      
      {error && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-red-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
