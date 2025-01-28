import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsers() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interface de gestion des utilisateurs</p>
        </CardContent>
      </Card>
    </div>
  );
}