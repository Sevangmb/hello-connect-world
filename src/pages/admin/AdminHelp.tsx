import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminHelp() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Aide & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ce centre d'aide offre des FAQ, de la documentation détaillée et des informations pour contacter le support. Vous y trouverez des guides pour résoudre les problèmes courants et obtenir une assistance personnalisée.</p>
        </CardContent>
      </Card>
    </div>
  );
}