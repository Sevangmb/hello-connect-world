
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Luggage } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Suitcase } from "./utils/types";
import { SuitcaseItems } from "./SuitcaseItems";
import { SuitcaseDates } from "./components/SuitcaseDates";
import { SuitcaseActions } from "./components/SuitcaseActions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface SuitcaseCardProps {
  suitcase: Suitcase;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export const SuitcaseCard = ({ suitcase, onSelect, isSelected }: SuitcaseCardProps) => {
  const startDate = suitcase.start_date ? new Date(suitcase.start_date) : undefined;
  const endDate = suitcase.end_date ? new Date(suitcase.end_date) : undefined;

  const formatDateRange = () => {
    if (!startDate || !endDate) return null;
    
    return `${format(startDate, "d MMM", { locale: fr })} - ${format(endDate, "d MMM yyyy", { locale: fr })}`;
  };

  const statusVariant = 
    suitcase.status === "active" 
      ? "default" 
      : suitcase.status === "archived" 
        ? "secondary" 
        : "destructive";

  return (
    <Card 
      className={`group transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <Luggage className="h-5 w-5 text-primary" />
            <span className="truncate">{suitcase.name}</span>
          </CardTitle>
          <Badge variant={statusVariant}>
            {suitcase.status === "active" ? "Active" : suitcase.status === "archived" ? "Archivée" : "Supprimée"}
          </Badge>
        </div>
        
        {suitcase.description && (
          <CardDescription className="line-clamp-2 mt-1">
            {suitcase.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground mb-4">
          {startDate && endDate ? (
            <div className="flex gap-1 items-center">
              <Calendar className="w-4 h-4" />
              <span>{formatDateRange()}</span>
            </div>
          ) : (
            <div className="flex gap-1 items-center text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Pas de dates programmées</span>
            </div>
          )}
        </div>
        
        {isSelected && (
          <div className="pt-2 animate-fade-in">
            <SuitcaseDates
              suitcaseId={suitcase.id}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-col gap-2">
        <Button 
          variant={isSelected ? "default" : "outline"} 
          size="sm" 
          className="w-full"
          onClick={() => onSelect(isSelected ? "" : suitcase.id)}
        >
          {isSelected ? "Masquer les détails" : "Afficher les détails"}
        </Button>
        
        {isSelected && (
          <div className="w-full space-y-4 pt-2 animate-fade-in">
            <SuitcaseItems suitcaseId={suitcase.id} />
            
            <SuitcaseActions 
              suitcaseId={suitcase.id}
              isSelected={isSelected}
              onSelect={onSelect}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
