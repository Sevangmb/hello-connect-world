
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ClothesWornList } from "./ClothesWornList";
import { AddClothesDialog } from "./AddClothesDialog";
import { ClothesCalendarHeader } from "./ClothesCalendarHeader";
import { useClothesCalendar } from "@/hooks/useClothesCalendar";
import type { ClothesCalendarState } from "./types";

export const ClothesCalendar = () => {
  const [state, setState] = useState<ClothesCalendarState>({
    selectedDate: new Date(),
    selectedFriend: null,
  });

  const {
    wearHistory,
    clothesList,
    isHistoryLoading,
    isClothesLoading,
    addClothesToHistory,
  } = useClothesCalendar(state.selectedFriend);

  const clothesForSelectedDate = state.selectedDate && wearHistory
    ? wearHistory.filter(
        (history) => format(new Date(history.worn_date), "yyyy-MM-dd") === format(state.selectedDate!, "yyyy-MM-dd")
      )
    : [];

  return (
    <Card>
      <CardHeader>
        <ClothesCalendarHeader 
          selectedFriend={state.selectedFriend}
          onSelectFriend={(friend) => setState(prev => ({ ...prev, selectedFriend: friend }))}
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <Calendar
            mode="single"
            selected={state.selectedDate}
            onSelect={(date) => setState(prev => ({ ...prev, selectedDate: date }))}
            className="rounded-md border"
            locale={fr}
          />

          <div className="flex-1">
            {state.selectedDate && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">
                    Vêtements portés le {format(state.selectedDate, "d MMMM yyyy", { locale: fr })}
                  </h3>
                  {!state.selectedFriend && !isClothesLoading && clothesList && (
                    <AddClothesDialog
                      selectedDate={state.selectedDate}
                      clothesList={clothesList}
                      onAddClothes={(clothesId) => addClothesToHistory(clothesId, state.selectedDate!)}
                    />
                  )}
                </div>
                <ClothesWornList
                  isLoading={isHistoryLoading}
                  clothesForSelectedDate={clothesForSelectedDate}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
