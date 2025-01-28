import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminContent() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion du contenu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interface de gestion du contenu du site</p>
        </CardContent>
      </Card>
    </div>
  );
}