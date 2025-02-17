import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function Shop() {
  const { shopId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Boutique {shopId}</h1>
        <p className="text-muted-foreground">
          Détails de la boutique à venir
        </p>
      </Card>
    </div>
  );
}
