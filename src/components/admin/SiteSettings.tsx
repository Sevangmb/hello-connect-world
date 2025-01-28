import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SiteSettings() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du site</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interface de configuration du site</p>
        </CardContent>
      </Card>
    </div>
  );
}