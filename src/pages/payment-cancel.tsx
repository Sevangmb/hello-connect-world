
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <X className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <h1 className="text-xl font-semibold mb-2">Paiement annulé</h1>
        <p className="text-muted-foreground mb-6">
          Votre paiement a été annulé. Aucun montant n'a été débité.
        </p>
        <Button onClick={() => navigate("/cart")}>
          Retourner au panier
        </Button>
      </Card>
    </div>
  );
}
