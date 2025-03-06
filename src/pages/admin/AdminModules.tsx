
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModulesList } from "@/components/admin/modules/ModulesList";
import { ModuleFeatures } from "@/components/admin/modules/ModuleFeatures";
import { ModuleStatusAlert } from "@/components/admin/modules/components/ModuleStatusAlert";
import { ModuleStatusSummary } from "@/components/admin/modules/components/ModuleStatusSummary";
import { useModules } from "@/hooks/modules";

export default function AdminModules() {
  const { modules } = useModules();

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tableau de bord des modules - colonne gauche */}
        <div className="lg:col-span-1 space-y-6">
          <ModuleStatusSummary modules={modules} />
        </div>

        {/* Contenu principal - colonne droite */}
        <div className="lg:col-span-3">
          <Card>
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
            <CardContent>
              <Tabs defaultValue="modules" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
                </TabsList>

                <TabsContent value="modules">
                  <ModulesList />
                </TabsContent>

                <TabsContent value="features">
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
