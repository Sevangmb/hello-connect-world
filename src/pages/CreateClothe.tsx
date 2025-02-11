
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function CreateClothe() {
  const { shopId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Ajouter un vêtement</h1>
        <p className="text-muted-foreground">
          Pour la boutique {shopId}
        </p>
      </Card>
    </div>
  );
}
