
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { useModules } from "@/hooks/modules";
import { useToast } from "@/hooks/use-toast";
import { ModuleStatus } from "@/hooks/modules/types";
import { ModuleRow } from "./components/ModuleRow";
import { SaveChangesButton } from "./components/SaveChangesButton";

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
                <ModuleRow
                  key={module.id}
                  module={module}
                  dependencies={dependencies}
                  currentStatus={currentStatus}
                  isModuleActive={isModuleActive}
                  canToggleModule={canToggleModule}
                  pendingChanges={pendingChanges}
                  handleToggleModule={handleToggleModule}
                />
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <SaveChangesButton
          hasPendingChanges={hasPendingChanges}
          saving={saving}
          onSave={saveChanges}
        />
      </CardFooter>
    </Card>
  );
};
