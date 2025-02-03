import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Mail, BellRing } from "lucide-react";

export default function AdminMarketing() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Campagne Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Objet de l'email" />
          <Textarea placeholder="Contenu de l'email" className="min-h-[200px]" />
          <Button>Envoyer la campagne</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Notifications Push
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Titre de la notification" />
          <Textarea placeholder="Message de la notification" />
          <Button>Envoyer la notification</Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Annonces Globales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Titre de l'annonce" />
          <Textarea placeholder="Contenu de l'annonce" className="min-h-[200px]" />
          <div className="flex justify-end gap-4">
            <Button variant="outline">Prévisualiser</Button>
            <Button>Publier l'annonce</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}