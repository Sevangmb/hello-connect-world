
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, AlertCircle } from "lucide-react";
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
  return (
    <div className="flex items-center gap-2">
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
