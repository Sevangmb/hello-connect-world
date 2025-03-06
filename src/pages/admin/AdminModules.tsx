
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModulesList } from "@/components/admin/modules/ModulesList";
import { ModuleFeatures } from "@/components/admin/modules/ModuleFeatures";
import { ModuleStatusAlert } from "@/components/admin/modules/components/ModuleStatusAlert";
import { ModuleStatusSummary } from "@/components/admin/modules/components/ModuleStatusSummary";
import { useModules } from "@/hooks/modules";
import { AlertTriangle, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function AdminModules() {
  const { modules } = useModules();

  // Calculer les statistiques des modules
  const activeModules = modules.filter(m => m.status === 'active').length;
  const inactiveModules = modules.filter(m => m.status === 'inactive').length;
  const degradedModules = modules.filter(m => m.status === 'degraded').length;
  const maintenanceModules = modules.filter(m => m.status === 'maintenance').length;

  return (
    <div className="w-full p-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Indicateurs de statut des modules */}
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Modules actifs</p>
                <h3 className="text-2xl font-bold text-green-700">{activeModules}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Modules inactifs</p>
                <h3 className="text-2xl font-bold text-red-700">{inactiveModules}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">En dégradation</p>
                <h3 className="text-2xl font-bold text-amber-700">{degradedModules}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">En maintenance</p>
                <h3 className="text-2xl font-bold text-blue-700">{maintenanceModules}</h3>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
        </div>

        {/* Tableau de bord des modules - colonne gauche */}
        <div className="lg:col-span-1 space-y-6">
          <ModuleStatusSummary modules={modules} />
        </div>

        {/* Contenu principal - colonne droite */}
        <div className="lg:col-span-3">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Gestion des Modules</CardTitle>
                  <CardDescription>
                    Activez ou désactivez les modules et fonctionnalités de l'application
                  </CardDescription>
                </div>
                <ModuleStatusSummary modules={modules} compact className="mt-2 sm:mt-0" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="modules" className="w-full">
                <TabsList className="mx-6 my-4">
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
                </TabsList>

                <TabsContent value="modules" className="mt-0">
                  <ModulesList />
                </TabsContent>

                <TabsContent value="features" className="mt-0">
                  <ModuleFeatures />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
