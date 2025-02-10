
import { Search, Heart, Star, Hash, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ExploreSection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AccordionItem value="explore" className="border-none">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Explorer
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-6">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/search",
            })}
            onClick={() => navigate("/search")}
          >
            <Search className="h-4 w-4" />
            Recherche
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/trending/outfits",
            })}
            onClick={() => navigate("/trending/outfits")}
          >
            <Heart className="h-4 w-4" />
            Tenues Populaires
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/trending/items",
            })}
            onClick={() => navigate("/trending/items")}
          >
            <Star className="h-4 w-4" />
            Articles Populaires
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/hashtags",
            })}
            onClick={() => navigate("/hashtags")}
          >
            <Hash className="h-4 w-4" />
            Hashtags
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/boutiques",
            })}
            onClick={() => navigate("/boutiques")}
          >
            <ShoppingBag className="h-4 w-4" />
            Boutiques
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
