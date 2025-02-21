
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutItem {
  id: string;
  quantity: number;
}

interface CheckoutButtonProps {
  cartItems: CheckoutItem[];
  isLoading?: boolean;
}

export function CheckoutButton({ cartItems, isLoading }: CheckoutButtonProps) {
  const navigate = useNavigate();
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [isShippingSheetOpen, setIsShippingSheetOpen] = useState(false);

  const { data: carriers, isLoading: isLoadingCarriers } = useQuery({
    queryKey: ["shipping-carriers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_carriers")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data;
    }
  });

  const handleProceedToCheckout = () => {
    if (selectedCarrier) {
      navigate("/checkout", {
        state: { 
          cartItems,
          shippingCarrierId: selectedCarrier 
        }
      });
    }
  };

  if (!cartItems.length) {
    return (
      <Button className="w-full" disabled>
        <ShoppingBag className="mr-2 h-4 w-4" />
        Panier vide
      </Button>
    );
  }

  return (
    <Sheet open={isShippingSheetOpen} onOpenChange={setIsShippingSheetOpen}>
      <SheetTrigger asChild>
        <Button className="w-full" disabled={isLoading}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Passer la commande
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Choix du transporteur</SheetTitle>
          <SheetDescription>
            Sélectionnez votre mode de livraison préféré
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <Truck className="h-5 w-5" />
            <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un transporteur" />
              </SelectTrigger>
              <SelectContent>
                {carriers?.map((carrier) => (
                  <SelectItem key={carrier.id} value={carrier.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{carrier.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {carrier.base_price ? `${carrier.base_price}€` : "Prix variable"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCarrier && carriers?.find(c => c.id === selectedCarrier)?.description && (
            <p className="text-sm text-muted-foreground">
              {carriers.find(c => c.id === selectedCarrier)?.description}
            </p>
          )}
        </div>

        <SheetFooter className="mt-6">
          <Button
            onClick={handleProceedToCheckout}
            disabled={!selectedCarrier || isLoading}
            className="w-full"
          >
            Continuer vers le paiement
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
