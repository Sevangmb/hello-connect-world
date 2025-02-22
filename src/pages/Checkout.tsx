
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, shippingDetails } = location.state || {};

  const createCheckoutSession = useMutation({
    mutationFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: {
            cartItems: validCartItems,
            shippingDetails
          }
        });

        if (error) throw error;
        
        if (data?.url) {
          try {
            window.location.href = data.url;
          } catch (err: any) {
            // Handle browser extension interference
            if (err.message?.includes('rejected') || err.message?.includes('chrome-extension')) {
              toast({
                title: "Erreur de redirection",
                description: "Une extension de navigateur bloque le paiement. Essayez de désactiver vos extensions ou d'utiliser une fenêtre de navigation privée.",
                variant: "destructive",
              });
              throw new Error('Le paiement a été bloqué par une extension de navigateur.');
            }
            throw err;
          }
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (error: any) {
        if (error.message?.includes('extension')) {
          // Déjà géré par le toast ci-dessus
          throw error;
        }
        throw new Error(error.message || "Erreur lors de la création de la session de paiement");
      }
    },
    onError: (error: Error) => {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Erreur lors du paiement",
        description: error.message || "Impossible de procéder au paiement",
        variant: "destructive",
      });
    }
  });

  if (!cartItems || !shippingDetails) {
    toast({
      title: "Erreur",
      description: "Informations de commande manquantes",
      variant: "destructive",
    });
    return window.location.href = "/cart";
  }

  // Validate cart items with safe type checking
  const validCartItems = cartItems.filter(item => 
    item && 
    item.shop_items && 
    typeof item.shop_items.price === 'number' && 
    typeof item.quantity === 'number'
  );

  // If no valid items, return to cart
  if (validCartItems.length === 0) {
    toast({
      title: "Erreur",
      description: "Aucun article valide dans votre panier",
      variant: "destructive",
    });
    return window.location.href = "/cart";
  }

  // Calculate totals with safe access and type checking
  const subtotal = validCartItems.reduce((sum, item) => {
    const price = item.shop_items?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const total = subtotal + (shippingDetails.basePrice || 0);

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="container mx-auto">
          <h1 className="text-2xl font-semibold mb-8">Finaliser la commande</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Résumé de la commande */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">Détails de la livraison</h2>
                <div className="space-y-2">
                  <p>Transporteur: {shippingDetails.carrierName}</p>
                  <p>Prix de base: {shippingDetails.basePrice}€</p>
                  <p>Délai estimé: {shippingDetails.estimatedDays.min}-{shippingDetails.estimatedDays.max} jours</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">Articles</h2>
                <div className="space-y-4">
                  {validCartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <p className="font-medium">{item.shop_items.clothes.name}</p>
                          <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">{item.shop_items.price * item.quantity}€</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Résumé des coûts */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-lg shadow sticky top-24 space-y-6">
                <h2 className="text-lg font-medium mb-4">Résumé</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{subtotal}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>{shippingDetails.basePrice}€</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{total}€</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  size="lg"
                  onClick={() => createCheckoutSession.mutate()}
                  disabled={createCheckoutSession.isPending}
                >
                  {createCheckoutSession.isPending ? 
                    "Redirection vers le paiement..." : 
                    "Procéder au paiement"
                  }
                </Button>
                
                <div className="text-sm text-muted-foreground space-y-2 mt-4">
                  <p className="text-center">
                    Si vous rencontrez des problèmes lors du paiement :
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Désactivez temporairement vos extensions de navigateur</li>
                    <li>Utilisez une fenêtre de navigation privée</li>
                    <li>Essayez un autre navigateur web</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
