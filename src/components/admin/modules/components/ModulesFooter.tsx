
import React from "react";
import { SaveChangesButton } from "./SaveChangesButton";

interface ModulesFooterProps {
  moduleCount: number;
  hasPendingChanges: boolean;
  saving: boolean;
  onSave: () => void;
  error?: string | null;
}

export const ModulesFooter: React.FC<ModulesFooterProps> = ({
  moduleCount,
  hasPendingChanges,
  saving,
  onSave,
  error
}) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="text-sm text-muted-foreground">
        {moduleCount} module{moduleCount !== 1 ? 's' : ''} disponible{moduleCount !== 1 ? 's' : ''}
      </div>
      <SaveChangesButton 
        hasPendingChanges={hasPendingChanges} 
        saving={saving} 
        onSave={onSave}
        error={error}
      />
    </div>
  );
};
