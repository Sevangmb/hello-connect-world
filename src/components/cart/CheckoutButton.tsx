
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutItem {
  id: string;
  quantity: number;
}

interface CheckoutButtonProps {
  cartItems: CheckoutItem[];
  isLoading?: boolean;
}

export function CheckoutButton({ cartItems, isLoading: externalLoading }: CheckoutButtonProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");

  const showProcessingToast = (message: string) => {
    toast({
      title: "Traitement en cours",
      description: message,
    });
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setProcessingStep("Initialisation du processus de paiement...");
      showProcessingToast("Initialisation du processus de paiement...");
      
      // Vérification de l'authentification
      setProcessingStep("Vérification de l'authentification...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour effectuer un achat",
          variant: "destructive",
        });
        return;
      }

      // Vérification du panier
      if (!cartItems.length) {
        toast({
          title: "Panier vide",
          description: "Votre panier est vide",
          variant: "destructive",
        });
        return;
      }

      // Préparation des données pour Stripe
      setProcessingStep("Préparation des données pour le paiement...");
      showProcessingToast("Préparation des données pour le paiement...");
      console.log("Données du panier à envoyer:", { cartItems, userId: user.id });

      // Appel à la fonction de création de session Stripe
      setProcessingStep("Création de la session de paiement...");
      showProcessingToast("Création de la session de paiement...");
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { cartItems, userId: user.id }
      });

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        // Vérification des erreurs liées aux extensions
        if (error.message?.includes('chrome-extension') || error.message?.includes('rejected')) {
          toast({
            title: "Extension de navigateur détectée",
            description: "Une extension de votre navigateur semble bloquer le paiement. Essayez de désactiver vos extensions ou d'utiliser une fenêtre de navigation privée.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (!data?.url) {
        throw new Error('Aucune URL de paiement reçue du serveur');
      }

      // Redirection vers Stripe
      setProcessingStep("Redirection vers la page de paiement...");
      showProcessingToast("Redirection vers la page de paiement sécurisée...");
      console.log("URL de redirection:", data.url);
      
      const redirectToCheckout = () => {
        try {
          window.location.assign(data.url);
        } catch (redirectError) {
          console.error('Échec de la redirection, tentative avec fallback...', redirectError);
          window.open(data.url, '_self');
        }
      };

      redirectToCheckout();
      
    } catch (error) {
      console.error('Erreur dans le processus de paiement:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du processus de paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  return (
    <div>
      <Button
        className="w-full"
        onClick={handleCheckout}
        disabled={externalLoading || isProcessing || !cartItems.length}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        {isProcessing ? processingStep : "Passer la commande"}
      </Button>
      {isProcessing && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          {processingStep}
        </p>
      )}
    </div>
  );
}
