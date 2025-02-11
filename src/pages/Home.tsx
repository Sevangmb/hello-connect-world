
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Bienvenue sur notre boutique en ligne</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection de vêtements et accessoires.
        </p>
      </Card>
    </div>
  );
}
