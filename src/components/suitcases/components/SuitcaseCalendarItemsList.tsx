
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { SuitcaseItem } from "@/components/suitcases/utils/types";
import type { Suitcase } from "@/components/suitcases/utils/types";
import { Shirt, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SuitcaseCalendarItemsListProps {
  items: SuitcaseItem[];
  suitcases: Suitcase[];
}

export const SuitcaseCalendarItemsList = ({ 
  items, 
  suitcases 
}: SuitcaseCalendarItemsListProps) => {
  // Grouper les éléments par valise
  const itemsBySuitcase: Record<string, SuitcaseItem[]> = {};
  
  items.forEach(item => {
    if (!itemsBySuitcase[item.suitcase_id]) {
      itemsBySuitcase[item.suitcase_id] = [];
    }
    itemsBySuitcase[item.suitcase_id].push(item);
  });

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {suitcases.map(suitcase => (
          <div key={suitcase.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h3 className="font-medium">{suitcase.name}</h3>
              <Badge variant={suitcase.status === "active" 
                ? "default" 
                : suitcase.status === "archived" 
                  ? "secondary" 
                  : "destructive"
              }>
                {suitcase.status === "active" 
                  ? "Active" 
                  : suitcase.status === "archived" 
                    ? "Archivée" 
                    : "Supprimée"
                }
              </Badge>
            </div>
            
            <div className="space-y-2">
              {itemsBySuitcase[suitcase.id]?.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3 py-2 px-3 rounded-md border"
                >
                  {item.clothes.image_url ? (
                    <img 
                      src={item.clothes.image_url} 
                      alt={item.clothes.name}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                      <Shirt className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="font-medium">{item.clothes.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{item.clothes.category}</span>
                      {item.clothes.brand && (
                        <>
                          <span>•</span>
                          <span>{item.clothes.brand}</span>
                        </>
                      )}
                      {item.clothes.color && (
                        <>
                          <span>•</span>
                          <span>{item.clothes.color}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {item.quantity > 1 && (
                    <Badge variant="outline">
                      x{item.quantity}
                    </Badge>
                  )}
                </div>
              ))}
              
              {!itemsBySuitcase[suitcase.id] || itemsBySuitcase[suitcase.id].length === 0 ? (
                <div className="text-center py-2 text-muted-foreground">
                  Aucun vêtement dans cette valise
                </div>
              ) : null}
            </div>
            
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
