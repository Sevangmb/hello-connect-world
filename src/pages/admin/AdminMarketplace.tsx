import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMarketplace() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion du Vide-Dressing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interface de gestion du vide-dressing</p>
        </CardContent>
      </Card>
    </div>
  );
}
