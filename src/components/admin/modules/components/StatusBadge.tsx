
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ModuleStatus } from "@/hooks/modules/types";

interface StatusBadgeProps {
  status: ModuleStatus;
  isPending?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isPending = false }) => {
  const renderStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactif</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500">Dégradé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <>
      {renderStatusBadge(status)}
      {isPending && (
        <span className="ml-2 text-yellow-500 text-xs">(en attente)</span>
      )}
    </>
  );
};
