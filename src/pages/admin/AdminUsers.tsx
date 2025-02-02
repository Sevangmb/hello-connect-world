import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsers() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page permet de gérer tous les utilisateurs du site, consulter les profils, modifier les rôles et contrôler l'accès.</p>
        </CardContent>
      </Card>
    </div>
  );
}