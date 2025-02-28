
import React from "react";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModuleStatus } from "@/hooks/modules/types";

interface ModuleToggleProps {
  moduleId: string;
  currentStatus: ModuleStatus;
  isCore: boolean;
  canToggle: boolean;
  onToggle: (moduleId: string, currentStatus: ModuleStatus) => void;
}

export const ModuleToggle: React.FC<ModuleToggleProps> = ({
  moduleId,
  currentStatus,
  isCore,
  canToggle,
  onToggle,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={currentStatus === 'active'}
        onCheckedChange={() => onToggle(moduleId, currentStatus)}
        disabled={!canToggle}
      />
      {!canToggle && isCore && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Module core, ne peut pas être désactivé</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!canToggle && !isCore && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Ce module est requis par d'autres modules actifs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
