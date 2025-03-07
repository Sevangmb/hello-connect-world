
import React from "react";
import { AlertTriangle } from "lucide-react";

interface MenuErrorStateProps {
  message?: string;
}

export const MenuErrorState: React.FC<MenuErrorStateProps> = ({ message }) => {
  return (
    <div className="p-2 text-sm text-red-500 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4" />
      <span>{message || "Erreur de chargement du menu"}</span>
    </div>
  );
};
