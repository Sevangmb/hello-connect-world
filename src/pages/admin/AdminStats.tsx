import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminStats() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Statistiques et analyses</p>
        </CardContent>
      </Card>
    </div>
  );
}