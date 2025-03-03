
import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaveChangesButton } from "./SaveChangesButton";

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
        onSave={onSave}
        error={error}
      />
    </CardFooter>
  );
};
