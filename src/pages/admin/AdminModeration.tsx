
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminModeration() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Modération</CardTitle>
          <CardDescription>Gérez la modération du contenu</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Interface de modération en cours de développement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
