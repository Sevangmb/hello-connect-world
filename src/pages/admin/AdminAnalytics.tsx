
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAnalytics() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Analytiques</CardTitle>
          <CardDescription>Consultez les statistiques et analyses de la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface d'analytiques en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
