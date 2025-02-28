
import React from "react";
import { CardTitle } from "@/components/ui/card";

interface ModulesHeaderProps {
  lastRefresh: Date;
  onRefresh: () => void;
}

export const ModulesHeader: React.FC<ModulesHeaderProps> = ({ 
  lastRefresh, 
  onRefresh 
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <CardTitle>Gestion des Modules</CardTitle>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dernière mise à jour: {lastRefresh.toLocaleTimeString()}</span>
        <button 
          onClick={onRefresh} 
          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
        >
          Actualiser
        </button>
      </div>
    </div>
  );
};
