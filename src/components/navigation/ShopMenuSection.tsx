
import React from "react";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModuleMenuEvents } from "./hooks/useModuleMenuEvents";

/**
 * Section de menu pour les boutiques
 */
export const ShopMenuSection: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { activeShop } = useModuleMenuEvents();

  if (!activeShop) return null;

  return (
    <div className="space-y-2">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between px-3">
          <h3 className="text-sm font-semibold text-gray-500">
            Ma Boutique
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <span className="sr-only">Toggle</span>
              {isOpen ? (
                <div className="h-4 w-4 rotate-90 transform">⌃</div>
              ) : (
                <div className="h-4 w-4">⌃</div>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-1 space-y-1">
          <div className="px-3 py-2 border-l-2 border-primary/20 ml-3 mt-1">
            <div className="flex items-center mb-2">
              <Store className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">{activeShop.name}</span>
            </div>
            <DynamicMenu 
              moduleCode="shop" 
              className="pl-6" 
              hierarchical={false}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
