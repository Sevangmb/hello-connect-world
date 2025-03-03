
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppModule } from "@/hooks/modules/types";
import { Layers, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModuleStatusSummaryProps {
  modules: AppModule[];
  className?: string;
  compact?: boolean;
}

export const ModuleStatusSummary: React.FC<ModuleStatusSummaryProps> = ({ 
  modules, 
  className,
  compact = false
}) => {
  const stats = useMemo(() => {
    const total = modules.length;
    const active = modules.filter(m => m.status === 'active').length;
    const degraded = modules.filter(m => m.status === 'degraded').length;
    const inactive = modules.filter(m => m.status === 'inactive').length;
    const core = modules.filter(m => m.is_core).length;
    
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
    const degradedPercent = total > 0 ? Math.round((degraded / total) * 100) : 0;
    const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;
    
    return {
      total,
      active,
      degraded,
      inactive,
      core,
      activePercent,
      degradedPercent,
      inactivePercent
    };
  }, [modules]);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                <span className="text-sm font-medium">{stats.active}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Modules actifs: {stats.active}</p>
            </TooltipContent>
          </Tooltip>
          
          {stats.degraded > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm font-medium">{stats.degraded}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modules dégradés: {stats.degraded}</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {stats.inactive > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center bg-gray-50 text-gray-700 px-2 py-1 rounded">
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  <span className="text-sm font-medium">{stats.inactive}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modules inactifs: {stats.inactive}</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded">
                <Layers className="h-3.5 w-3.5 mr-1" />
                <span className="text-sm font-medium">{stats.total}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total des modules: {stats.total}</p>
              <p>Modules core: {stats.core}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Layers className="h-5 w-5 mr-2 text-muted-foreground" />
          Statut des modules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Actifs</span>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1.5" />
              <span className="text-2xl font-semibold">{stats.active}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Dégradés</span>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-1.5" />
              <span className="text-2xl font-semibold">{stats.degraded}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Inactifs</span>
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-gray-500 mr-1.5" />
              <span className="text-2xl font-semibold">{stats.inactive}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                Actifs
              </span>
              <span className="text-sm font-medium">{stats.activePercent}%</span>
            </div>
            <Progress value={stats.activePercent} className="h-2 bg-gray-100">
              <div className="bg-green-500 h-full rounded" style={{ width: `${stats.activePercent}%` }} />
            </Progress>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm flex items-center">
                <AlertCircle className="h-3 w-3 text-amber-500 mr-1" />
                Dégradés
              </span>
              <span className="text-sm font-medium">{stats.degradedPercent}%</span>
            </div>
            <Progress value={stats.degradedPercent} className="h-2 bg-gray-100">
              <div className="bg-amber-500 h-full rounded" style={{ width: `${stats.degradedPercent}%` }} />
            </Progress>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm flex items-center">
                <XCircle className="h-3 w-3 text-gray-500 mr-1" />
                Inactifs
              </span>
              <span className="text-sm font-medium">{stats.inactivePercent}%</span>
            </div>
            <Progress value={stats.inactivePercent} className="h-2 bg-gray-100">
              <div className="bg-gray-500 h-full rounded" style={{ width: `${stats.inactivePercent}%` }} />
            </Progress>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Modules core</span>
            <span className="text-sm font-medium">
              {stats.core} / {stats.total}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
