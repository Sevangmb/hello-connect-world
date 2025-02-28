
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { ModuleRow } from "./ModuleRow";
import { AppModule, ModuleDependency, ModuleStatus } from "@/hooks/modules/types";

interface ModulesTableProps {
  modules: AppModule[];
  dependencies: ModuleDependency[];
  pendingChanges: Record<string, ModuleStatus>;
  isModuleActive: (code: string) => boolean;
  canToggleModule: (moduleId: string, isCore: boolean) => boolean;
  handleToggleModule: (moduleId: string, currentStatus: ModuleStatus) => void;
  getModuleStatus: (moduleId: string, currentStatus: ModuleStatus) => ModuleStatus;
}

export const ModulesTable: React.FC<ModulesTableProps> = ({
  modules,
  dependencies,
  pendingChanges,
  isModuleActive,
  canToggleModule,
  handleToggleModule,
  getModuleStatus
}) => {
  return (
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
  );
};
