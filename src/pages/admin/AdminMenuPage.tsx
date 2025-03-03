
import React from "react";
import { AdminCheck } from "@/components/admin/settings/AdminCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminMenu } from "@/components/admin/AdminMenu";

export default function AdminMenuPage() {
  return (
    <AdminCheck>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des menus</h2>
        <p className="text-muted-foreground">
          Configurez les menus de l'application et leur visibilité.
        </p>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu principal</CardTitle>
              <CardDescription>Éléments du menu principal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <AdminMenu />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Menu utilisateur</CardTitle>
              <CardDescription>Éléments du menu pour les utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground pb-4">
                Personnalisez les options disponibles pour les utilisateurs réguliers.
              </p>
              <div className="flex justify-center items-center h-60 rounded-md border bg-muted/40">
                <p className="text-muted-foreground text-sm">
                  Éditeur de menu à venir
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Menu boutique</CardTitle>
              <CardDescription>Éléments du menu pour les boutiques</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground pb-4">
                Personnalisez les options disponibles pour les propriétaires de boutiques.
              </p>
              <div className="flex justify-center items-center h-60 rounded-md border bg-muted/40">
                <p className="text-muted-foreground text-sm">
                  Éditeur de menu à venir
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminCheck>
  );
}
