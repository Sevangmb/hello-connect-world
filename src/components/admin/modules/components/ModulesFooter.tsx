
import React from "react";
import { SaveChangesButton } from "./SaveChangesButton";

interface ModulesFooterProps {
  moduleCount: number;
  hasPendingChanges: boolean;
  saving: boolean;
  onSave: () => void;
}

export const ModulesFooter: React.FC<ModulesFooterProps> = ({
  moduleCount,
  hasPendingChanges,
  saving,
  onSave
}) => {
  return (
    <div className="flex justify-between">
      <div className="text-sm text-muted-foreground">
        {moduleCount} modules disponibles
      </div>
      <SaveChangesButton
        hasPendingChanges={hasPendingChanges}
        saving={saving}
        onSave={onSave}
      />
    </div>
  );
};
