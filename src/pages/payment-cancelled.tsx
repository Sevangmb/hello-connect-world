
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function PaymentCancelled() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!orderId) {
      toast({
        title: "Erreur",
        description: "Identifiant de commande manquant",
        variant: "destructive",
      });
    }
  }, [orderId, toast]);

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-8">
      <div className="text-center mb-6">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Paiement annulé</h1>
        <p className="text-muted-foreground mb-6">
          Votre paiement a été annulé. Aucun montant n'a été débité.
        </p>
        <Button onClick={() => navigate(-1)}>
          Retourner au panier
        </Button>
      </div>
    </Card>
  );
}
