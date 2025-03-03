
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReports() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Rapports</CardTitle>
          <CardDescription>Gérez les rapports du système</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface de gestion des rapports en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
