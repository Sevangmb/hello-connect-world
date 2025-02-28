
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Calendar,
  Suitcase,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModules } from "@/hooks/useModules";

export const PersonalSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive } = useModules();

  return (
    <AccordionItem value="personal" className="border-none">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          Personnel
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-6">
          {isModuleActive('wardrobe') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/clothes",
              })}
              onClick={() => navigate("/clothes")}
            >
              <ShoppingBag className="h-4 w-4" />
              Garde-robe
            </Button>
          )}
          {isModuleActive('outfits') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/outfits",
              })}
              onClick={() => navigate("/outfits")}
            >
              <ShoppingBag className="h-4 w-4" />
              Tenues
            </Button>
          )}
          {isModuleActive('suitcases') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/suitcases",
              })}
              onClick={() => navigate("/suitcases")}
            >
              <Suitcase className="h-4 w-4" />
              Valises
            </Button>
          )}
          {isModuleActive('shopping') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/cart",
              })}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-4 w-4" />
              Panier
            </Button>
          )}
          {isModuleActive('favorites') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/favorites",
              })}
              onClick={() => navigate("/favorites")}
            >
              <Heart className="h-4 w-4" />
              Favoris
            </Button>
          )}
          {isModuleActive('calendar') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/calendar",
              })}
              onClick={() => navigate("/calendar")}
            >
              <Calendar className="h-4 w-4" />
              Calendrier
            </Button>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
