
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModuleDependency {
  dependency_name: string;
  dependency_code: string;
  is_required: boolean;
}

interface ModuleDependenciesProps {
  dependencies: ModuleDependency[];
  isModuleActive: (code: string) => boolean;
}

export const ModuleDependenciesList: React.FC<ModuleDependenciesProps> = ({ 
  dependencies, 
  isModuleActive 
}) => {
  if (dependencies.length === 0) {
    return <span className="text-gray-400 text-sm">Aucune</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {dependencies.map((dep, idx) => (
        <TooltipProvider key={idx}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={dep.is_required ? "default" : "outline"} className="cursor-help">
                {dep.dependency_name}
                {dep.is_required ? "*" : ""}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {dep.is_required
                  ? "Dépendance requise"
                  : "Dépendance optionnelle"}
              </p>
              <p>
                {isModuleActive(dep.dependency_code || "")
                  ? "✅ Dépendance active"
                  : "❌ Dépendance inactive"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
