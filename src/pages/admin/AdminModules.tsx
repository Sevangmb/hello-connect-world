
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModulesList } from "@/components/admin/modules/ModulesList";
import { ModuleDependencies } from "@/components/admin/modules/ModuleDependencies";
import { ModuleDependencyGraph } from "@/components/admin/modules/ModuleDependencyGraph";
import { ModuleFeatures } from "@/components/admin/modules/ModuleFeatures";
import { ModuleStatusAlert } from "@/components/admin/modules/components/ModuleStatusAlert";
import { supabase } from "@/integrations/supabase/client";

export default function AdminModules() {
  const [showAlert, setShowAlert] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(true);
  const [connectionChecked, setConnectionChecked] = useState(false);

  // Vérifier la connexion à Supabase au chargement
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Faire une simple requête pour vérifier la connexion
        const { count, error } = await supabase
          .from('app_modules')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error("Erreur de connexion à Supabase:", error);
          setDatabaseConnected(false);
        } else {
          console.log("Connexion à Supabase établie avec succès");
          setDatabaseConnected(true);
        }
      } catch (err) {
        console.error("Exception lors de la vérification de la connexion:", err);
        setDatabaseConnected(false);
      } finally {
        setConnectionChecked(true);
      }
    };

    checkConnection();
  }, []);

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
          {!databaseConnected && connectionChecked && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Erreur de connexion à la base de données</p>
              <p>Impossible de se connecter à Supabase. Veuillez vérifier votre connexion internet et les clés d'API.</p>
            </div>
          )}
          
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
