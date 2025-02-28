
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModulesList } from "@/components/admin/modules/ModulesList";
import { ModuleDependencies } from "@/components/admin/modules/ModuleDependencies";
import { ModuleDependencyGraph } from "@/components/admin/modules/ModuleDependencyGraph";
import { ModuleFeatures } from "@/components/admin/modules/ModuleFeatures";
import { ModuleStatusAlert } from "@/components/admin/modules/components/ModuleStatusAlert";

export default function AdminModules() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Modules</CardTitle>
          <CardDescription>
            Activez ou désactivez les modules et fonctionnalités de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showAlert && <ModuleStatusAlert onDismiss={() => setShowAlert(false)} />}
          
          <Tabs defaultValue="modules" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="dependencies">Dépendances</TabsTrigger>
              <TabsTrigger value="graph">Graphe</TabsTrigger>
            </TabsList>

            <TabsContent value="modules">
              <ModulesList onStatusChange={() => setShowAlert(true)} />
            </TabsContent>

            <TabsContent value="features">
              <ModuleFeatures />
            </TabsContent>

            <TabsContent value="dependencies">
              <ModuleDependencies />
            </TabsContent>
            
            <TabsContent value="graph">
              <ModuleDependencyGraph />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
