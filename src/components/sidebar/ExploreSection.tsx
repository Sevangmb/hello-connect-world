
import {
  Search,
  TrendingUp,
  Hash,
  Compass,
  Store,
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
import { useEffect, useState } from "react";

export const ExploreSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isModuleActive, refreshModules } = useModules();
  const [moduleStates, setModuleStates] = useState({
    search: false,
    trending: false,
    hashtags: false,
    marketplace: false
  });

  // Forcer un rechargement des données des modules au montage
  useEffect(() => {
    const loadModules = async () => {
      console.log("ExploreSection: Chargement des modules");
      await refreshModules();
      
      // Vérifier explicitement chaque module
      const searchActive = isModuleActive('search');
      const trendingActive = isModuleActive('trending');
      const hashtagsActive = isModuleActive('hashtags');
      const marketplaceActive = isModuleActive('marketplace');
      
      console.log(`ExploreSection: États des modules - search: ${searchActive}, trending: ${trendingActive}, hashtags: ${hashtagsActive}, marketplace: ${marketplaceActive}`);
      
      setModuleStates({
        search: searchActive,
        trending: trendingActive,
        hashtags: hashtagsActive,
        marketplace: marketplaceActive
      });
    };
    
    loadModules();
  }, [refreshModules, isModuleActive]);

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
          {moduleStates.search && (
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
          {moduleStates.trending && (
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
          {moduleStates.hashtags && (
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
          {moduleStates.marketplace && (
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
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
