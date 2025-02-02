import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Panneau de bord</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bienvenue dans l'interface d'administration</p>
        </CardContent>
      </Card>
    </div>
  );
}
