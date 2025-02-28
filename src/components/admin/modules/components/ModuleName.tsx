
import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModuleNameProps {
  name: string;
  isCore: boolean;
}

export const ModuleName: React.FC<ModuleNameProps> = ({ name, isCore }) => {
  return (
    <div className="font-medium">
      {name}
      {isCore && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-2">
                <Info className="h-4 w-4 inline text-blue-500" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Module core (toujours actif)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
