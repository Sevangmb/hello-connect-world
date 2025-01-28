import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UsersManagement() {
  return (
    <div className="space-y-4">
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