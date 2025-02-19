
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function PersonalSection() {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() => navigate("/personal")}
    >
      <ShoppingBag className="mr-2 h-5 w-5" />
      Mon Univers
    </Button>
  );
}

