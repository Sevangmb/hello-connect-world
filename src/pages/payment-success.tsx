
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // You could use the session_id from URL params to fetch order details
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      console.log('Payment successful for session:', sessionId);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold">Paiement réussi !</h1>
        <p className="text-gray-600">
          Merci pour votre achat. Vous recevrez bientôt un email de confirmation.
        </p>
        <div className="pt-4">
          <Button onClick={() => navigate("/")}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
