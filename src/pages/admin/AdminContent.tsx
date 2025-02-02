import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminContent() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Contenu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page permet aux administrateurs d'ajouter, modifier ou supprimer le contenu textuel affiché sur le site.</p>
        </CardContent>
      </Card>
    </div>
  );
}