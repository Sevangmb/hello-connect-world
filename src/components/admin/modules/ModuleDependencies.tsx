
import React, { useState } from "react";
import { useModules } from "@/hooks/useModules";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Boxes, ArrowRightCircle, AlertCircle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ModuleDependencies = () => {
  const { dependencies, loading, error } = useModules();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Grouper les dépendances par module
  const groupedDependencies = dependencies.reduce((acc, dep) => {
    if (!acc[dep.module_code]) {
      acc[dep.module_code] = {
        id: dep.module_id,
        code: dep.module_code,
        name: dep.module_name,
        status: dep.module_status,
        dependencies: []
      };
    }
    
    if (dep.dependency_id) {
      acc[dep.module_code].dependencies.push({
        id: dep.dependency_id,
        code: dep.dependency_code,
        name: dep.dependency_name,
        status: dep.dependency_status,
        isRequired: dep.is_required
      });
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Convertir en tableau pour l'affichage
  const modules = Object.values(groupedDependencies);

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      case 'degraded':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="h-5 w-5" />
            Graphe de Dépendances
          </CardTitle>
          <CardDescription>Chargement des dépendances...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            Erreur
          </CardTitle>
          <CardDescription>
            Impossible de charger les dépendances des modules: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Boxes className="h-5 w-5" />
          Graphe de Dépendances
        </CardTitle>
        <CardDescription>
          Visualisez les dépendances entre les différents modules de l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dépendances</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow 
                  key={module.id}
                  className={selectedModule === module.code ? 'bg-blue-50' : ''}
                  onClick={() => setSelectedModule(selectedModule === module.code ? null : module.code)}
                >
                  <TableCell className="font-medium">{module.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {module.dependencies.length > 0 ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        {module.dependencies.map((dep: any) => (
                          <div key={dep.id} className="flex items-center gap-1">
                            <ArrowRightCircle className="h-4 w-4 text-gray-400" />
                            <span>{dep.name}</span>
                            <Badge className={getStatusColor(dep.status)}>
                              {dep.status}
                            </Badge>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{dep.isRequired ? 'Dépendance obligatoire' : 'Dépendance optionnelle'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">Aucune dépendance</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
