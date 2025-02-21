
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const location = useLocation();
  const { toast } = useToast();
  const { cartItems, shippingDetails } = location.state || {};

  if (!cartItems || !shippingDetails) {
    toast({
      title: "Erreur",
      description: "Informations de commande manquantes",
      variant: "destructive",
    });
    return window.location.href = "/cart";
  }

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
                  {cartItems.map((item: any) => (
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
              <div className="bg-white p-6 rounded-lg shadow sticky top-24">
                <h2 className="text-lg font-medium mb-4">Résumé</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{cartItems.reduce((acc: number, item: any) => 
                      acc + (item.shop_items.price * item.quantity), 0)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>{shippingDetails.basePrice}€</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{cartItems.reduce((acc: number, item: any) => 
                        acc + (item.shop_items.price * item.quantity), 0) + shippingDetails.basePrice}€</span>
                    </div>
                  </div>
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
