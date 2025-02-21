
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserSearch } from "@/components/users/UserSearch";

export const ClothesCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClothes, setSelectedClothes] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleAddClothes = async () => {
    if (!selectedDate || !selectedClothes) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("clothes_wear_history")
        .insert({
          user_id: user.id,
          clothes_id: selectedClothes,
          worn_date: format(selectedDate, "yyyy-MM-dd"),
        });

      if (error) throw error;

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à l'historique avec succès.",
      });

      setSelectedClothes("");
      setIsDialogOpen(false);
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
        <div className="flex items-center justify-between">
          <CardTitle>
            {selectedFriend 
              ? `Calendrier de ${selectedFriend.username}`
              : "Mon calendrier de garde-robe"
            }
          </CardTitle>
          <div className="flex items-center gap-4">
            <UserSearch 
              placeholder="Rechercher un ami..."
              onSelect={(friend) => setSelectedFriend(friend)}
            />
            {selectedFriend && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedFriend(null)}
              >
                Revenir à mon calendrier
              </Button>
            )}
          </div>
        </div>
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
                  {!selectedFriend && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Ajouter un vêtement porté le {format(selectedDate, "d MMMM yyyy", { locale: fr })}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Select
                              value={selectedClothes}
                              onValueChange={setSelectedClothes}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un vêtement" />
                              </SelectTrigger>
                              <SelectContent>
                                {clothesList?.map((clothes) => (
                                  <SelectItem key={clothes.id} value={clothes.id}>
                                    {clothes.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            onClick={handleAddClothes}
                            disabled={!selectedClothes}
                            className="w-full"
                          >
                            Ajouter
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                {isHistoryLoading ? (
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
