
import {
  Search,
  TrendingUp,
  Hash,
  Compass,
  Store,
  LocateFixed,
  List,
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

export const ExploreSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive } = useModules();

  return (
    <AccordionItem value="explore" className="border-none">
      <AccordionTrigger className="py-2">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4" />
          Explore
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-1 pl-6">
          {isModuleActive('search') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/search",
              })}
              onClick={() => navigate("/search")}
            >
              <Search className="h-4 w-4" />
              Recherche
            </Button>
          )}
          {isModuleActive('trending') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/trending/outfits",
              })}
              onClick={() => navigate("/trending/outfits")}
            >
              <TrendingUp className="h-4 w-4" />
              Tendances
            </Button>
          )}
          {isModuleActive('hashtags') && (
            <Button
              variant="ghost"
              className={cn("w-full justify-start gap-2", {
                "bg-custom-blue text-white": location.pathname === "/hashtags",
              })}
              onClick={() => navigate("/hashtags")}
            >
              <Hash className="h-4 w-4" />
              Hashtags
            </Button>
          )}
          {isModuleActive('marketplace') && (
            <>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", {
                  "bg-custom-blue text-white": location.pathname === "/marketplace",
                })}
                onClick={() => navigate("/marketplace")}
              >
                <Store className="h-4 w-4" />
                Marketplace
              </Button>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2", {
                  "bg-custom-blue text-white": location.pathname === "/boutiques",
                })}
                onClick={() => navigate("/boutiques")}
              >
                <Store className="h-4 w-4" />
                Boutiques
              </Button>
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
