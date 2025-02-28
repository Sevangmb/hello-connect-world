
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info, AlertCircle, Check, X, Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModules, ModuleStatus } from "@/hooks/useModules";
import { useToast } from "@/hooks/use-toast";

export const ModulesList = () => {
  const { 
    modules, 
    dependencies, 
    loading, 
    isModuleActive, 
    updateModuleStatus,
    updateFeatureStatus
  } = useModules();
  
  const { toast } = useToast();
  const [pendingChanges, setPendingChanges] = useState<Record<string, ModuleStatus>>({});
  const [saving, setSaving] = useState(false);

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

  // Gérer le changement de statut d'un module (temporaire jusqu'à la sauvegarde)
  const handleToggleModule = (moduleId: string, currentStatus: ModuleStatus) => {
    setPendingChanges(prev => {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      return { ...prev, [moduleId]: newStatus };
    });
  };

  // Vérifier si un module a des changements en attente
  const getModuleStatus = (moduleId: string, currentStatus: ModuleStatus) => {
    return pendingChanges[moduleId] !== undefined ? pendingChanges[moduleId] : currentStatus;
  };

  // Enregistrer tous les changements
  const saveChanges = async () => {
    try {
      setSaving(true);
      
      // Appliquer tous les changements de modules
      const updatePromises = Object.entries(pendingChanges).map(async ([moduleId, newStatus]) => {
        // Trouver le module
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;
        
        // Mettre à jour le statut du module
        await updateModuleStatus(moduleId, newStatus);
        
        // Si le module est désactivé, désactiver également toutes ses fonctionnalités
        if (newStatus === 'inactive' && module.features) {
          const featurePromises = Object.keys(module.features).map(featureCode => 
            updateFeatureStatus(module.code, featureCode, false)
          );
          await Promise.all(featurePromises);
        }
      });
      
      await Promise.all(updatePromises);
      
      // Réinitialiser les changements en attente
      setPendingChanges({});
      
      toast({
        title: "Modifications enregistrées",
        description: "Les modules et leurs fonctionnalités ont été mis à jour",
      });
      
      // Déclencher un événement personnalisé pour informer que les modules ont été mis à jour
      window.dispatchEvent(new CustomEvent('module_status_changed'));
      
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde des modifications:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer les modifications",
      });
    } finally {
      setSaving(false);
    }
  };

  // Vérifier s'il y a des changements en attente
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

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
            {modules.map((module) => {
              const currentStatus = getModuleStatus(module.id, module.status);
              return (
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
                  <TableCell>
                    {renderStatusBadge(currentStatus)}
                    {pendingChanges[module.id] !== undefined && (
                      <span className="ml-2 text-yellow-500 text-xs">(en attente)</span>
                    )}
                  </TableCell>
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
                        checked={currentStatus === 'active'}
                        onCheckedChange={() => handleToggleModule(module.id, currentStatus)}
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
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={saveChanges} 
          disabled={!hasPendingChanges || saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </CardFooter>
    </Card>
  );
};
