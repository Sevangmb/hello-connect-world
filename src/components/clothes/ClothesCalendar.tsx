
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const ClothesCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: wearHistory, isLoading } = useQuery({
    queryKey: ["clothes-wear-history"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("clothes_wear_history")
        .select(`
          *,
          clothes:clothes_id (
            name,
            image_url
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const clothesForSelectedDate = selectedDate 
    ? wearHistory?.filter(
        (history) => format(new Date(history.worn_date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier de ma garde-robe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            locale={fr}
          />

          <div className="flex-1">
            {selectedDate && (
              <div>
                <h3 className="font-medium mb-4">
                  Vêtements portés le {format(selectedDate, "d MMMM yyyy", { locale: fr })}
                </h3>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : clothesForSelectedDate && clothesForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {clothesForSelectedDate.map((history) => (
                      <div key={history.id} className="flex items-center gap-4">
                        {history.clothes?.image_url && (
                          <img 
                            src={history.clothes.image_url} 
                            alt={history.clothes.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span>{history.clothes?.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Aucun vêtement porté ce jour-là
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
