
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, shippingDetails } = location.state || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('stripe');

  // Fetch available payment methods
  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createCheckoutSession = useMutation({
    mutationFn: async () => {
      try {
        // Get seller ID from the first item (assuming all items are from the same seller)
        const { data: shopItem, error: shopError } = await supabase
          .from('shop_items')
          .select('shop:shop_id(user_id)')
          .eq('id', validCartItems[0].shop_item_id)
          .single();

        if (shopError) throw shopError;
        if (!shopItem?.shop?.user_id) throw new Error("Seller information not found");

        const seller_id = shopItem.shop.user_id;

        // For Stripe payments, use Stripe Checkout
        if (selectedPaymentMethod === 'stripe') {
          const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: {
              cartItems: validCartItems,
              shippingDetails,
              paymentMethod: selectedPaymentMethod
            }
          });

          if (error) throw error;
          
          if (data?.url) {
            try {
              window.location.href = data.url;
            } catch (err: any) {
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
        } else {
          // For other payment methods, create order directly
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              buyer_id: (await supabase.auth.getUser()).data.user?.id,
              seller_id,
              total_amount: total,
              payment_method: selectedPaymentMethod,
              payment_status: selectedPaymentMethod === 'cash' ? 'pending' : 'processing',
              shipping_address: shippingDetails,
              shipping_cost: shippingDetails.basePrice,
              shipping_method: shippingDetails.carrierName,
              payment_type: 'online',
              transaction_type: 'p2p',
              status: 'pending'
            })
            .select()
            .single();

          if (orderError) throw orderError;

          // Create order items
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(
              validCartItems.map(item => ({
                order_id: order.id,
                shop_item_id: item.id,
                quantity: item.quantity,
                price_at_time: item.shop_items.price
              }))
            );

          if (itemsError) throw itemsError;

          // Clear cart after successful order creation
          const { error: cartError } = await supabase
            .from('cart_items')
            .delete()
            .in('id', validCartItems.map(item => item.id));

          if (cartError) throw cartError;

          // Redirect to success page
          navigate('/payment-success', { 
            state: { 
              orderId: order.id,
              paymentMethod: selectedPaymentMethod 
            }
          });
        }
      } catch (error: any) {
        if (error.message?.includes('extension')) {
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

  // Calculate totals with safe access
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
                <h2 className="text-lg font-medium mb-4">Moyen de paiement</h2>
                {paymentMethods && (
                  <RadioGroup 
                    value={selectedPaymentMethod} 
                    onValueChange={setSelectedPaymentMethod}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={method.code} id={method.code} />
                        <Label htmlFor={method.code} className="font-medium">
                          {method.name}
                          {method.description && (
                            <span className="block text-sm text-muted-foreground">
                              {method.description}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
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
                    "Traitement en cours..." : 
                    selectedPaymentMethod === 'cash' ?
                      "Confirmer la commande" :
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
