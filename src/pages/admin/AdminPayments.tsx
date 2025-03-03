
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPayments() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Paiements</CardTitle>
          <CardDescription>Gérez les paiements de la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface de gestion des paiements en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
