
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { ModuleName } from "./ModuleName";
import { StatusBadge } from "./StatusBadge";
import { ModuleDependenciesList } from "./ModuleDependencies";
import { ModuleToggle } from "./ModuleToggle";
import { AppModule, ModuleDependency, ModuleStatus } from "@/hooks/modules/types";

interface ModuleRowProps {
  module: AppModule;
  dependencies: ModuleDependency[];
  currentStatus: ModuleStatus;
  isModuleActive: (code: string) => boolean;
  canToggleModule: (moduleId: string, isCore: boolean) => boolean;
  pendingChanges: Record<string, ModuleStatus>;
  handleToggleModule: (moduleId: string, currentStatus: ModuleStatus) => void;
}

export const ModuleRow: React.FC<ModuleRowProps> = ({
  module,
  dependencies,
  currentStatus,
  isModuleActive,
  canToggleModule,
  pendingChanges,
  handleToggleModule,
}) => {
  // Obtenir les dépendances pour un module spécifique
  const getModuleDependencies = (moduleId: string) => {
    return dependencies.filter(d => d.module_id === moduleId && d.dependency_id);
  };

  return (
    <TableRow key={module.id}>
      <TableCell>
        <ModuleName name={module.name} isCore={module.is_core} />
      </TableCell>
      <TableCell>{module.description}</TableCell>
      <TableCell>
        <StatusBadge
          status={currentStatus}
          isPending={pendingChanges[module.id] !== undefined}
        />
      </TableCell>
      <TableCell>
        <ModuleDependenciesList
          dependencies={getModuleDependencies(module.id)}
          isModuleActive={isModuleActive}
        />
      </TableCell>
      <TableCell>
        <ModuleToggle
          moduleId={module.id}
          currentStatus={currentStatus}
          isCore={module.is_core}
          canToggle={canToggleModule(module.id, module.is_core)}
          onToggle={handleToggleModule}
        />
      </TableCell>
    </TableRow>
  );
};
