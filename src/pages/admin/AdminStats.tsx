import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminStats() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page fournit un aperçu des statistiques clés de l'administration, incluant des métriques utilisateurs, la performance des ventes et d'autres indicateurs essentiels.</p>
        </CardContent>
      </Card>
    </div>
  );
}