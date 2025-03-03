
import React, { useMemo } from "react";
import { CardContent } from "@/components/ui/card";
import { ModulesTable } from "./ModulesTable";
import { AppModule, ModuleDependency, ModuleStatus } from "@/hooks/modules/types";

interface ModulesContentProps {
  modules: AppModule[];
  dependencies: ModuleDependency[];
  pendingChanges: Record<string, ModuleStatus>;
  isModuleActive: (code: string) => boolean;
  canToggleModule: (moduleId: string, isCore: boolean) => boolean;
  handleToggleModule: (moduleId: string, currentStatus: ModuleStatus) => void;
  getModuleStatus: (moduleId: string, currentStatus: ModuleStatus) => ModuleStatus;
  onRefresh: () => void;
}

export const ModulesContent: React.FC<ModulesContentProps> = ({
  modules,
  dependencies,
  pendingChanges,
  isModuleActive,
  canToggleModule,
  handleToggleModule,
  getModuleStatus,
  onRefresh
}) => {
  // Memoize le contenu de la table pour éviter les re-render inutiles
  const tableContent = useMemo(() => (
    <ModulesTable
      modules={modules}
      dependencies={dependencies}
      pendingChanges={pendingChanges}
      isModuleActive={isModuleActive}
      canToggleModule={canToggleModule}
      handleToggleModule={handleToggleModule}
      getModuleStatus={getModuleStatus}
    />
  ), [modules, dependencies, pendingChanges, isModuleActive, canToggleModule, handleToggleModule, getModuleStatus]);

  if (modules.length === 0) {
    return (
      <CardContent>
        <div className="text-center py-8">
          <p className="mb-4">Aucun module trouvé. Veuillez rafraîchir la page ou vérifier la connexion à la base de données.</p>
          <button 
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Rafraîchir maintenant
          </button>
        </div>
      </CardContent>
    );
  }

  return <CardContent>{tableContent}</CardContent>;
};
