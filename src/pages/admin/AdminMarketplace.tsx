import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMarketplace() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Vide-Dressing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page est dédiée à la gestion du vide-dressing : modération des articles, supervision des transactions, et gestion des offres.</p>
        </CardContent>
      </Card>
    </div>
  );
}
