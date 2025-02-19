
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function HomeSection() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => navigate("/")}
      >
        <Home className="mr-2 h-5 w-5" />
        Accueil
      </Button>
    </div>
  );
}
