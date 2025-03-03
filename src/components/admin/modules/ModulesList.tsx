
import React from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { ModulesHeader } from "./components/ModulesHeader";
import { ModulesFooter } from "./components/ModulesFooter";
import { ModulesLoadingSkeleton } from "./components/ModulesLoadingSkeleton";
import { ModulesContent } from "./components/ModulesContent";
import { useModulesList } from "./hooks/useModulesList";
import { useModuleToggle } from "./hooks/useModuleToggle";
import { useModuleSave } from "./hooks/useModuleSave";

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
  
  const { saving, saveChanges } = useModuleSave({
    modules,
    updateModuleStatus,
    updateFeatureStatus,
    refreshModules,
    pendingChanges,
    resetPendingChanges,
    onStatusChange
  });

  if (isLoading) {
    return <ModulesLoadingSkeleton />;
  }

  return (
    <Card>
      <ModulesHeader 
        lastRefresh={lastRefresh} 
        onRefresh={handleRefresh} 
      />
      <ModulesContent
        modules={modules}
        dependencies={dependencies}
        pendingChanges={pendingChanges}
        isModuleActive={isModuleActive}
        canToggleModule={canToggleModule}
        handleToggleModule={handleToggleModule}
        getModuleStatus={getModuleStatus}
        onRefresh={handleRefresh}
      />
      <CardFooter>
        <ModulesFooter
          moduleCount={modules.length}
          hasPendingChanges={hasPendingChanges}
          saving={saving}
          onSave={saveChanges}
        />
      </CardFooter>
    </Card>
  );
};
