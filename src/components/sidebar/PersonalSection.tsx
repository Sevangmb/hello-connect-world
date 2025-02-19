
import { User, ShoppingBag, Suitcase, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function PersonalSection() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <User className="mr-2 h-5 w-5" />
        Personnel
      </Button>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/clothes")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Mes vêtements
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/suitcases")}
          >
            <Suitcase className="mr-2 h-4 w-4" />
            Mes valises
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/likes")}
          >
            <Heart className="mr-2 h-4 w-4" />
            Mes likes
          </Button>
        </div>
      )}
    </div>
  );
}
