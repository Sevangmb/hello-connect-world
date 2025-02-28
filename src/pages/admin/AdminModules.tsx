
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModulesList } from "@/components/admin/modules/ModulesList";
import { ModuleDependencies } from "@/components/admin/modules/ModuleDependencies";
import { AdminRoute } from "@/components/auth/AdminRoute";

export default function AdminModules() {
  return (
    <AdminRoute>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Modules</CardTitle>
            <CardDescription>
              Activez ou désactivez les modules de l'application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="modules" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="dependencies">Dépendances</TabsTrigger>
              </TabsList>

              <TabsContent value="modules">
                <ModulesList />
              </TabsContent>

              <TabsContent value="dependencies">
                <ModuleDependencies />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  );
}
