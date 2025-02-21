
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSuitcaseCalendar } from "../hooks/useSuitcaseCalendar";

export const SuitcaseCalendar = () => {
  const { data: calendarItems, isLoading } = useSuitcaseCalendar();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Chargement du calendrier...
        </div>
      </Card>
    );
  }

  if (!calendarItems?.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Aucun article planifié dans vos valises
        </div>
      </Card>
    );
  }

  // Trier les articles par date de début
  const sortedItems = [...calendarItems].sort((a, b) => {
    const dateA = a.suitcase.start_date ? new Date(a.suitcase.start_date) : new Date(0);
    const dateB = b.suitcase.start_date ? new Date(b.suitcase.start_date) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Calendrier des articles</h2>
      <ScrollArea className="h-[600px]">
        <div className="space-y-6">
          {sortedItems.map((item) => (
            <div
              key={`${item.suitcase_id}-${item.clothes_id}`}
              className="flex items-start gap-4 p-4 rounded-lg border"
            >
              {item.clothes.image_url ? (
                <img
                  src={item.clothes.image_url}
                  alt={item.clothes.name}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center">
                  <CalendarIcon className="text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{item.clothes.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {item.clothes.category}
                </p>
                <div className="text-sm">
                  <span>Du </span>
                  {item.suitcase.start_date && (
                    <time>
                      {format(new Date(item.suitcase.start_date), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </time>
                  )}
                  <span> au </span>
                  {item.suitcase.end_date && (
                    <time>
                      {format(new Date(item.suitcase.end_date), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </time>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
