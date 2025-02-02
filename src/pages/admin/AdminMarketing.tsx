import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMarketing() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Marketing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page est dédiée à la gestion des campagnes marketing : lancement de campagnes et suivi des performances publicitaires.</p>
        </CardContent>
      </Card>
    </div>
  );
}