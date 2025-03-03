
import React, { useMemo } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ModuleRow } from "./ModuleRow";
import { AppModule, ModuleDependency, ModuleStatus } from "@/hooks/modules/types";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface ModulesTableProps {
  modules: AppModule[];
  dependencies: ModuleDependency[];
  pendingChanges: Record<string, ModuleStatus>;
  isModuleActive: (code: string) => boolean;
  canToggleModule: (moduleId: string, isCore: boolean) => boolean;
  handleToggleModule: (moduleId: string, currentStatus: ModuleStatus) => void;
  getModuleStatus: (moduleId: string, currentStatus: ModuleStatus) => ModuleStatus;
  isLoading?: boolean;
}

export const ModulesTable: React.FC<ModulesTableProps> = ({
  modules,
  dependencies,
  pendingChanges,
  isModuleActive,
  canToggleModule,
  handleToggleModule,
  getModuleStatus,
  isLoading = false
}) => {
  const [filter, setFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);

  // Options de filtre pour le statut
  const statusOptions = [
    { value: "active", label: "Actif" },
    { value: "inactive", label: "Inactif" },
    { value: "degraded", label: "Dégradé" },
    { value: "pending", label: "Modifications en attente" }
  ];

  // Filtrer les modules selon les critères
  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      // Filtre de texte
      const textMatch = filter === "" || 
        module.name.toLowerCase().includes(filter.toLowerCase()) ||
        module.code.toLowerCase().includes(filter.toLowerCase()) ||
        (module.description && module.description.toLowerCase().includes(filter.toLowerCase()));
      
      // Filtre de statut
      let statusMatch = true;
      if (statusFilter.length > 0) {
        const currentStatus = getModuleStatus(module.id, module.status);
        const isPending = pendingChanges[module.id] !== undefined;
        
        statusMatch = statusFilter.includes(currentStatus) || 
          (isPending && statusFilter.includes("pending"));
      }
      
      return textMatch && statusMatch;
    });
  }, [modules, filter, statusFilter, getModuleStatus, pendingChanges]);

  // Récupérer les dépendances pour un module spécifique
  const getModuleDependencies = (moduleId: string) => {
    return dependencies.filter(d => d.module_id === moduleId && d.dependency_id);
  };

  // Gérer la sélection des filtres de statut
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(current => 
      current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };

  // Afficher le nombre total de modules et filtrés
  const moduleCountDisplay = () => {
    if (filteredModules.length === modules.length) {
      return `Total: ${modules.length} module(s)`;
    }
    return `${filteredModules.length} / ${modules.length} module(s)`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Chargement des modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtres et compteurs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pb-2">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Rechercher un module..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pr-10"
          />
          {filter && (
            <button 
              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={() => setFilter("")}
            >
              <span className="sr-only">Effacer</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-3 py-1 text-sm border rounded-md hover:bg-muted">
              <Filter className="h-4 w-4 mr-1" />
              Statut
              {statusFilter.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  {statusFilter.length}
                </Badge>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map(option => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={statusFilter.includes(option.value)}
                  onCheckedChange={() => handleStatusFilterChange(option.value)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <span className="text-sm text-muted-foreground">
            {moduleCountDisplay()}
          </span>
        </div>
      </div>

      {filteredModules.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead className="hidden sm:table-cell">Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Dépendances</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.map((module) => {
                const currentStatus = getModuleStatus(module.id, module.status);
                return (
                  <ModuleRow
                    key={module.id}
                    module={module}
                    dependencies={getModuleDependencies(module.id)}
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
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md bg-muted/50">
          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Aucun module ne correspond à vos critères de recherche</p>
          {(filter || statusFilter.length > 0) && (
            <button 
              onClick={() => {
                setFilter("");
                setStatusFilter([]);
              }}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
};
