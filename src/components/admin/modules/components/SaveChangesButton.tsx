
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveChangesButtonProps {
  hasPendingChanges: boolean;
  saving: boolean;
  onSave: () => void;
}

export const SaveChangesButton: React.FC<SaveChangesButtonProps> = ({
  hasPendingChanges,
  saving,
  onSave,
}) => {
  return (
    <Button 
      onClick={onSave} 
      disabled={!hasPendingChanges || saving}
      className="flex items-center gap-2"
    >
      <Save className="h-4 w-4" />
      {saving ? "Enregistrement..." : "Enregistrer les modifications"}
    </Button>
  );
};
