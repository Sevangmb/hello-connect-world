
import React, { useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ModulesHeader } from "./components/ModulesHeader";
import { ModulesFooter } from "./components/ModulesFooter";
import { ModulesTable } from "./components/ModulesTable";
import { ModulesLoadingSkeleton } from "./components/ModulesLoadingSkeleton";
import { useModulesList } from "./hooks/useModulesList";
import { useModuleToggle } from "./hooks/useModuleToggle";
import { useModuleSave } from "./hooks/useModuleSave";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CircleCheck } from "lucide-react";

export const ModulesList: React.FC = () => {
  const {
    modules,
    isLoading,
    lastRefresh,
    isModuleActive,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules,
    canToggleModule,
    handleRefresh
  } = useModulesList();
  
  const {
    pendingChanges,
    handleToggleModule,
    getModuleStatus,
    hasPendingChanges,
    resetPendingChanges
  } = useModuleToggle();
  
  const { saving, saveChanges, error } = useModuleSave({
    modules,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules,
    pendingChanges,
    resetPendingChanges
  });

  const [showInfo, setShowInfo] = useState(false);

  if (isLoading) {
    return <ModulesLoadingSkeleton />;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl">Gestion des modules</CardTitle>
            <CardDescription>
              Activez ou désactivez les modules de l'application
            </CardDescription>
          </div>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <Info className="h-4 w-4 mr-1" />
            <span>{showInfo ? "Masquer" : "Afficher"} les informations</span>
          </button>
        </div>
      </CardHeader>
      
      {showInfo && (
        <div className="px-6 py-2">
          <Alert variant="default" className="bg-muted/50">
            <CircleCheck className="h-4 w-4" />
            <AlertTitle>Informations sur les modules</AlertTitle>
            <AlertDescription className="text-sm">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Les modules <strong>core</strong> sont essentiels et ne peuvent pas être désactivés</li>
                <li>La désactivation d'un module désactive aussi ses fonctionnalités</li>
                <li>Les modules ayant des dépendances requises ne peuvent pas être désactivés</li>
                <li>Les changements ne sont appliqués qu'après avoir cliqué sur "Enregistrer"</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <ModulesHeader 
        lastRefresh={lastRefresh} 
        onRefresh={handleRefresh}
      />
      
      <div className="px-6 pb-4">
        <ModulesTable
          modules={modules}
          pendingChanges={pendingChanges}
          isModuleActive={isModuleActive}
          canToggleModule={canToggleModule}
          handleToggleModule={handleToggleModule}
          getModuleStatus={getModuleStatus}
          isLoading={isLoading || saving}
        />
      </div>
      
      <CardFooter>
        <ModulesFooter
          moduleCount={modules.length}
          hasPendingChanges={hasPendingChanges}
          saving={saving}
          onSave={saveChanges}
          error={error}
        />
      </CardFooter>
    </Card>
  );
};
