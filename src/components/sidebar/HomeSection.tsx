
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeSection() {
  return (
    <Button variant="ghost" className="w-full justify-start">
      <Home className="mr-2 h-5 w-5" />
      Accueil
    </Button>
  );
}
