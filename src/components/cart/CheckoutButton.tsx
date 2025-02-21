
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  return (
    <Button
      className="w-full"
      onClick={() => navigate("/checkout")}
      disabled={isLoading || !cartItems.length}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      Passer la commande
    </Button>
  );
}
