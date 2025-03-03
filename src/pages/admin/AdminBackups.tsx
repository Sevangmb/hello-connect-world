
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBackups() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Sauvegardes</CardTitle>
          <CardDescription>Gérez les sauvegardes de données</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface de gestion des sauvegardes en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
