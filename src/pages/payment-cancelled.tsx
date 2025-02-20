
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Paiement annulé</h1>
        <p className="text-gray-600">
          Votre paiement a été annulé. Aucun montant n'a été débité.
        </p>
        <div className="pt-4 space-y-2">
          <Button 
            onClick={() => navigate("/cart")}
            className="w-full"
          >
            Retour au panier
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
