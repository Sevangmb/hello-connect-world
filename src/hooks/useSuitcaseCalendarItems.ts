
import { useQuery } from "@tanstack/react-query";
import { useSuitcases } from "./useSuitcases";
import { useSuitcaseItems } from "./useSuitcaseItems";
import { addDays, format, isAfter, isBefore, isEqual, parseISO } from "date-fns";
import { SuitcaseCalendarItem } from "@/components/suitcases/utils/types";

export interface SuitcaseCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  suitcaseId: string;
  items: SuitcaseCalendarItem[];
  color?: string;
}

export const useSuitcaseCalendar = () => {
  // Récupérer toutes les valises avec des dates définies
  const { data: suitcases, isLoading: suitcasesLoading } = useSuitcases({ 
    forCalendar: true,
    status: 'all' 
  });

  // Préparer les données pour le calendrier
  const calendarEvents: SuitcaseCalendarEvent[] = [];
  
  if (suitcases && suitcases.length > 0) {
    suitcases.forEach(suitcase => {
      if (suitcase.start_date && suitcase.end_date) {
        const startDate = parseISO(suitcase.start_date);
        const endDate = parseISO(suitcase.end_date);
        
        // Couleur en fonction du statut
        let color = "#22c55e"; // Vert pour active
        if (suitcase.status === "archived") color = "#f59e0b"; // Ambre pour archived
        if (suitcase.status === "deleted") color = "#ef4444"; // Rouge pour deleted

        calendarEvents.push({
          id: suitcase.id,
          title: suitcase.name,
          start: startDate,
          end: addDays(endDate, 1), // Ajouter un jour pour l'affichage inclusif
          suitcaseId: suitcase.id,
          items: [],
          color
        });
      }
    });
  }

  return {
    calendarEvents,
    isLoading: suitcasesLoading,
  };
};

// Hook pour récupérer les vêtements d'une valise pour une date spécifique
export const useSuitcaseCalendarItemsForDate = (date: Date | null) => {
  // Récupérer toutes les valises avec des dates définies
  const { data: suitcases, isLoading: suitcasesLoading } = useSuitcases({ 
    forCalendar: true,
    status: 'all' 
  });

  // Stocker les IDs des valises qui se chevauchent avec la date sélectionnée
  const matchingSuitcaseIds: string[] = [];
  
  if (date && suitcases) {
    suitcases.forEach(suitcase => {
      if (suitcase.start_date && suitcase.end_date) {
        const startDate = parseISO(suitcase.start_date);
        const endDate = parseISO(suitcase.end_date);
        
        // Vérifier si la date est dans la plage de la valise
        if ((isAfter(date, startDate) || isEqual(date, startDate)) && 
            (isBefore(date, endDate) || isEqual(date, endDate))) {
          matchingSuitcaseIds.push(suitcase.id);
        }
      }
    });
  }

  // Récupérer les éléments pour chaque valise correspondante
  const { 
    data: suitcaseItems, 
    isLoading: itemsLoading 
  } = useSuitcaseItems(matchingSuitcaseIds.length ? matchingSuitcaseIds[0] : "");

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "Aucune date sélectionnée";

  return {
    date: formattedDate,
    suitcases: suitcases?.filter(s => matchingSuitcaseIds.includes(s.id)) || [],
    items: suitcaseItems || [],
    isLoading: suitcasesLoading || (matchingSuitcaseIds.length > 0 && itemsLoading),
    hasItems: suitcaseItems && suitcaseItems.length > 0,
    hasSuitcases: matchingSuitcaseIds.length > 0
  };
};
