
import { useState, useEffect } from "react";
import { format, addDays, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Briefcase, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSuitcaseCalendar, useSuitcaseCalendarItemsForDate } from "@/hooks/useSuitcaseCalendarItems";
import { SuitcaseCalendarItemsList } from "./SuitcaseCalendarItemsList";

export const SuitcaseCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  
  const { calendarEvents, isLoading } = useSuitcaseCalendar();
  const { 
    suitcases: suitcasesForDate,
    items, 
    isLoading: itemsLoading,
    hasItems,
    hasSuitcases
  } = useSuitcaseCalendarItemsForDate(selectedDate);

  // Fonction pour déterminer les jours avec des valises
  const isDayWithSuitcase = (day: Date): boolean => {
    return calendarEvents.some(event => {
      const eventStart = event.start;
      const eventEnd = event.end;
      return day >= eventStart && day < eventEnd;
    });
  };
  
  // Fonction pour trouver les valises pour un jour spécifique
  const getSuitcasesForDay = (day: Date) => {
    return calendarEvents.filter(event => {
      const eventStart = event.start;
      const eventEnd = event.end;
      return day >= eventStart && day < eventEnd;
    });
  };

  // Style personnalisé pour les jours avec des valises
  const getDayStyle = (day: Date): React.CSSProperties => {
    const suitcases = getSuitcasesForDay(day);
    if (suitcases.length === 0) return {};
    
    // Utiliser la couleur de la première valise si une seule, sinon utiliser une couleur spéciale multiple
    const color = suitcases.length === 1 
      ? suitcases[0].color 
      : "#6366f1"; // Indigo pour multiple valises
    
    return {
      backgroundColor: color,
      color: "#ffffff",
      borderRadius: "100%"
    };
  };

  // Fonction pour personnaliser l'apparence des jours dans le calendrier
  const renderDay = (day: Date, selectedDay: Date, dayProps: any) => {
    const hasSuitcase = isDayWithSuitcase(day);
    const style = getDayStyle(day);
    
    return <div className="w-full h-full" style={style}>{day.getDate()}</div>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              Calendrier des valises
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(month, 'MMMM yyyy', { locale: fr })}</span>
            </Badge>
          </div>
          <CardDescription>
            Visualisez vos valises planifiées et leur contenu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={setSelectedDate}
              month={month}
              onMonthChange={setMonth}
              locale={fr}
              className="rounded-md border"
              modifiers={{
                suitcase: (date) => isDayWithSuitcase(date),
              }}
              modifiersStyles={{
                suitcase: { fontWeight: "bold" }
              }}
            />
          )}
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
            </CardTitle>
            <CardDescription>
              {hasSuitcases 
                ? `${suitcasesForDate.length} valise(s) pour cette journée` 
                : "Aucune valise prévue pour cette journée"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itemsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !hasSuitcases ? (
              <div className="py-6 text-center text-muted-foreground">
                Pas de valise prévue ce jour-là
              </div>
            ) : !hasItems ? (
              <div className="py-6 text-center text-muted-foreground">
                Aucun vêtement dans cette valise
              </div>
            ) : (
              <SuitcaseCalendarItemsList 
                items={items} 
                suitcases={suitcasesForDate}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
