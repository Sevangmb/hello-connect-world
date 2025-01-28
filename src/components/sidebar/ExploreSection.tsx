import { Search, Heart, Star, Hash, MapPin, Filter, List } from "lucide-react";
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
              "bg-gray-100": location.pathname === "/trending/hashtags",
            })}
            onClick={() => navigate("/trending/hashtags")}
          >
            <Hash className="h-4 w-4" />
            Hashtags Populaires
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/stores/map",
            })}
            onClick={() => navigate("/stores/map")}
          >
            <MapPin className="h-4 w-4" />
            Carte des Boutiques
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/stores/search",
            })}
            onClick={() => navigate("/stores/search")}
          >
            <Filter className="h-4 w-4" />
            Filtrer les Boutiques
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-gray-100": location.pathname === "/stores/list",
            })}
            onClick={() => navigate("/stores/list")}
          >
            <List className="h-4 w-4" />
            Liste des Boutiques
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};