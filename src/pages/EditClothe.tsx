
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function EditClothe() {
  const { shopId, clotheId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Modifier le vêtement {clotheId}</h1>
        <p className="text-muted-foreground">
          De la boutique {shopId}
        </p>
      </Card>
    </div>
  );
}
