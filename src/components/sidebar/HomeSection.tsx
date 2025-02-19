
import { Home, List, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function HomeSection() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Home className="mr-2 h-5 w-5" />
        Accueil
      </Button>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/feed")}
          >
            <List className="mr-2 h-4 w-4" />
            Fil d'actualité
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/favorites")}
          >
            <Heart className="mr-2 h-4 w-4" />
            Favoris
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate("/trending")}
          >
            <Star className="mr-2 h-4 w-4" />
            Tendances
          </Button>
        </div>
      )}
    </div>
  );
}
