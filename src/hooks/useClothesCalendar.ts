
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { ClothesWearHistory, ClothesItem, UseClothesCalendarReturn } from "@/components/clothes/types";

export const useClothesCalendar = (
  selectedFriend: { id: string; username: string } | null
): UseClothesCalendarReturn => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      return data as ClothesWearHistory[];
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
      return data as ClothesItem[];
    },
  });

  const addClothesToHistory = async (clothesId: string, date: Date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("clothes_wear_history")
        .insert({
          user_id: user.id,
          clothes_id: clothesId,
          worn_date: format(date, "yyyy-MM-dd"),
        });

      if (error) throw error;

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à l'historique avec succès.",
      });

      await refetchHistory();
    } catch (error) {
      console.error("Error adding clothes to history:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le vêtement à l'historique.",
      });
    }
  };

  return {
    wearHistory,
    clothesList,
    isHistoryLoading,
    isClothesLoading,
    addClothesToHistory,
    refetchHistory,
  };
};
