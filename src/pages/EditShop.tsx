
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function EditShop() {
  const { shopId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Modifier la boutique {shopId}</h1>
        <p className="text-muted-foreground">
          Formulaire de modification à venir
        </p>
      </Card>
    </div>
  );
}
