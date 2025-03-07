
import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/modules/auth";
import { useClothesCalendar } from "@/hooks/useClothesCalendar";

export const CalendarSection: React.FC = () => {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Implémentation simplifiée, à compléter avec les données réelles
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      // Ici, vous pourriez charger les vêtements portés à cette date
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Calendrier des Vêtements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-4 h-full">
            {date ? (
              <>
                <h3 className="font-medium mb-2">
                  {date.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                <div className="space-y-4">
                  <p className="text-gray-500 text-center py-8">
                    Aucun vêtement enregistré pour cette date.
                  </p>
                  
                  <div className="flex justify-center">
                    <button className="bg-primary text-white px-4 py-2 rounded-md">
                      Ajouter un vêtement porté
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Sélectionnez une date pour voir les vêtements portés.
              </p>
            )}
          </Card>
        </div>
      </div>
    </Card>
  );
};
