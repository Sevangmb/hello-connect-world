
import React from "react";
import { BadgeCheck, ShieldAlert } from "lucide-react";

interface ModuleNameProps {
  name: string;
  isCore: boolean;
  isAdmin?: boolean;
}

export const ModuleName: React.FC<ModuleNameProps> = ({ name, isCore, isAdmin }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{name}</span>
      {isCore && (
        <BadgeCheck className="h-4 w-4 text-blue-500" />
      )}
      {isAdmin && (
        <ShieldAlert className="h-4 w-4 text-red-500" />
      )}
      {isCore && (
        <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
          Core
        </span>
      )}
      {isAdmin && (
        <span className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-0.5">
          Admin
        </span>
      )}
    </div>
  );
};
