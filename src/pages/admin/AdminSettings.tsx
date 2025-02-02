import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page permet la configuration des paramètres du site, en ajustant les options et adaptant la plateforme selon les besoins.</p>
        </CardContent>
      </Card>
    </div>
  );
}