
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ClothesWornList } from "./ClothesWornList";
import { AddClothesDialog } from "./AddClothesDialog";
import { ClothesCalendarHeader } from "./ClothesCalendarHeader";

export const ClothesCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedFriend, setSelectedFriend] = useState<{ id: string; username: string } | null>(null);
  const { toast } = useToast();

  const { data: wearHistory, isLoading: isHistoryLoading, refetch: refetchHistory } = useQuery({
    queryKey: ["clothes-wear-history", selectedFriend?.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const userId = selectedFriend?.id || user.id;

      const { data, error } = await supabase
        .from("clothes_wear_history")
        .select(`
          *,
          clothes:clothes_id (
            name,
            image_url
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    },
  });

  const { data: clothesList, isLoading: isClothesLoading } = useQuery({
    queryKey: ["clothes"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("clothes")
        .select("id, name")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const handleAddClothes = async (clothesId: string) => {
    if (!selectedDate) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("clothes_wear_history")
        .insert({
          user_id: user.id,
          clothes_id: clothesId,
          worn_date: format(selectedDate, "yyyy-MM-dd"),
        });

      if (error) throw error;

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à l'historique avec succès.",
      });

      refetchHistory();
    } catch (error) {
      console.error("Error adding clothes to history:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le vêtement à l'historique.",
      });
    }
  };

  const clothesForSelectedDate = selectedDate 
    ? wearHistory?.filter(
        (history) => format(new Date(history.worn_date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  return (
    <Card>
      <CardHeader>
        <ClothesCalendarHeader 
          selectedFriend={selectedFriend}
          onSelectFriend={setSelectedFriend}
        />
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">
                    Vêtements portés le {format(selectedDate, "d MMMM yyyy", { locale: fr })}
                  </h3>
                  {!selectedFriend && !isClothesLoading && clothesList && (
                    <AddClothesDialog
                      selectedDate={selectedDate}
                      clothesList={clothesList}
                      onAddClothes={handleAddClothes}
                    />
                  )}
                </div>
                <ClothesWornList
                  isLoading={isHistoryLoading}
                  clothesForSelectedDate={clothesForSelectedDate || []}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
