import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de Bord</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aperçu des métriques clés : nombre d'utilisateurs, boutiques actives, données de ventes, etc.</p>
        </CardContent>
      </Card>
    </div>
  );
}