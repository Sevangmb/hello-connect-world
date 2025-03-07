
import React from "react";
import { AlertTriangle } from "lucide-react";

interface MenuErrorStateProps {
  message?: string;
}

export const MenuErrorState: React.FC<MenuErrorStateProps> = ({
  message = "Erreur de chargement du menu"
}) => {
  return (
    <div className="text-red-500 text-sm py-2 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};
