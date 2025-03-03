
import React, { useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ModulesHeader } from "./components/ModulesHeader";
import { ModulesFooter } from "./components/ModulesFooter";
import { ModulesLoadingSkeleton } from "./components/ModulesLoadingSkeleton";
import { ModulesTable } from "./components/ModulesTable";
import { useModulesList } from "./hooks/useModulesList";
import { useModuleToggle } from "./hooks/useModuleToggle";
import { useModuleSave } from "./hooks/useModuleSave";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleFeatures } from "./ModuleFeatures";
import { Info, CircleInfo } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ModulesListProps {
  onStatusChange?: () => void;
}

export const ModulesList: React.FC<ModulesListProps> = ({ onStatusChange }) => {
  // Use our custom hooks to manage state and logic
  const {
    modules,
    dependencies,
    isLoading,
    lastRefresh,
    isModuleActive,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules,
    canToggleModule,
    handleRefresh
  } = useModulesList(onStatusChange);
  
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
    resetPendingChanges,
    onStatusChange
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
      
      {/* Information panel */}
      {showInfo && (
        <div className="px-6 py-2">
          <Alert variant="default" className="bg-muted/50">
            <CircleInfo className="h-4 w-4" />
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
      
      {/* Header with refresh button and last refresh time */}
      <ModulesHeader 
        lastRefresh={lastRefresh} 
        onRefresh={handleRefresh}
      />
      
      {/* Tabs for modules and features */}
      <div className="px-6 pb-4">
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules">
            <ModulesTable
              modules={modules}
              dependencies={dependencies}
              pendingChanges={pendingChanges}
              isModuleActive={isModuleActive}
              canToggleModule={canToggleModule}
              handleToggleModule={handleToggleModule}
              getModuleStatus={getModuleStatus}
              isLoading={isLoading || saving}
            />
          </TabsContent>
          
          <TabsContent value="features">
            <ModuleFeatures />
          </TabsContent>
        </Tabs>
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
