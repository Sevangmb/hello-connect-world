import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminShops() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des boutiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interface de gestion des boutiques</p>
        </CardContent>
      </Card>
    </div>
  );
}