
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PersonalSection() {
  return (
    <Button variant="ghost" className="w-full justify-start">
      <ShoppingBag className="mr-2 h-5 w-5" />
      Mon Univers
    </Button>
  );
}
