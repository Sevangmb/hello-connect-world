
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info, AlertCircle, Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModules, ModuleStatus } from "@/hooks/useModules";

export const ModulesList = () => {
  const { 
    modules, 
    dependencies, 
    loading, 
    isModuleActive, 
    updateModuleStatus 
  } = useModules();

  // Obtenir les dépendances pour un module spécifique
  const getModuleDependencies = (moduleId: string) => {
    return dependencies.filter(d => d.module_id === moduleId && d.dependency_id);
  };

  // Fonction pour afficher le badge de statut
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

  // Vérifier si on peut changer le statut d'un module
  const canToggleModule = (moduleId: string, isCore: boolean) => {
    if (isCore) return false; // Impossible de désactiver un module core
    
    // Vérifier les dépendances requises
    const requiredBy = dependencies.filter(d => 
      d.dependency_id === moduleId && 
      d.is_required && 
      d.module_status === 'active'
    );
    
    return requiredBy.length === 0;
  };

  // Gérer le changement de statut d'un module
  const handleToggleModule = (moduleId: string, currentStatus: ModuleStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateModuleStatus(moduleId, newStatus);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement des modules...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Modules</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dépendances</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.id}>
                <TableCell className="font-medium">
                  {module.name}
                  {module.is_core && (
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
                </TableCell>
                <TableCell>{module.description}</TableCell>
                <TableCell>{renderStatusBadge(module.status)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {getModuleDependencies(module.id).map((dep, idx) => (
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
                    {getModuleDependencies(module.id).length === 0 && (
                      <span className="text-gray-400 text-sm">Aucune</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={module.status === 'active'}
                      onCheckedChange={() => handleToggleModule(module.id, module.status)}
                      disabled={!canToggleModule(module.id, module.is_core)}
                    />
                    {!canToggleModule(module.id, module.is_core) && module.is_core && (
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
                    {!canToggleModule(module.id, module.is_core) && !module.is_core && (
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
