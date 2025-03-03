
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: Date | number | string;
  onChange?: (value?: Date) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function TimePicker({
  value,
  onChange,
  disabled,
  className,
  id,
}: TimePickerProps) {
  const [hours, setHours] = useState<string>("12");
  const [minutes, setMinutes] = useState<string>("00");
  const [isPM, setIsPM] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Convertir la valeur en Date
  const valueAsDate = value
    ? typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : value
    : undefined;

  // Initialiser les heures et minutes à partir de la valeur
  useEffect(() => {
    if (valueAsDate) {
      let hoursValue = valueAsDate.getHours();
      setIsPM(hoursValue >= 12);
      
      // Convertir en format 12h
      if (hoursValue > 12) {
        hoursValue -= 12;
      } else if (hoursValue === 0) {
        hoursValue = 12;
      }
      
      setHours(hoursValue.toString().padStart(2, "0"));
      setMinutes(valueAsDate.getMinutes().toString().padStart(2, "0"));
    }
  }, [valueAsDate]);

  // Gérer le changement d'heure
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHours = e.target.value.replace(/\D/g, "");
    
    // Limiter à 2 chiffres
    if (newHours.length > 2) {
      newHours = newHours.slice(0, 2);
    }
    
    // Limiter les valeurs entre 1 et 12
    const numericValue = parseInt(newHours, 10);
    if (!isNaN(numericValue)) {
      if (numericValue < 1) newHours = "1";
      if (numericValue > 12) newHours = "12";
    }
    
    setHours(newHours);
    updateTime(newHours, minutes);
  };

  // Gérer le changement de minutes
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinutes = e.target.value.replace(/\D/g, "");
    
    // Limiter à 2 chiffres
    if (newMinutes.length > 2) {
      newMinutes = newMinutes.slice(0, 2);
    }
    
    // Limiter les valeurs entre 0 et 59
    const numericValue = parseInt(newMinutes, 10);
    if (!isNaN(numericValue) && numericValue > 59) {
      newMinutes = "59";
    }
    
    setMinutes(newMinutes.padStart(2, "0"));
    updateTime(hours, newMinutes);
  };

  // Mettre à jour la valeur du temps
  const updateTime = (h: string, m: string) => {
    if (!onChange) return;
    
    const numericHours = parseInt(h, 10);
    const numericMinutes = parseInt(m, 10);
    
    if (isNaN(numericHours) || isNaN(numericMinutes)) return;
    
    const now = new Date();
    let updatedHours = numericHours;
    
    // Convertir en format 24h
    if (isPM && updatedHours < 12) {
      updatedHours += 12;
    } else if (!isPM && updatedHours === 12) {
      updatedHours = 0;
    }
    
    now.setHours(updatedHours);
    now.setMinutes(numericMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    
    onChange(now);
  };

  // Formater l'affichage de l'heure
  const formatDisplayTime = () => {
    const h = hours.padStart(2, "0");
    const m = minutes.padStart(2, "0");
    const period = isPM ? "PM" : "AM";
    return `${h}:${m} ${period}`;
  };

  // Basculer entre AM et PM
  const togglePeriod = () => {
    setIsPM(!isPM);
    updateTime(hours, minutes);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? formatDisplayTime() : "Sélectionner l'heure"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center space-x-2">
          <div className="grid gap-1">
            <div className="flex items-center space-x-2">
              <Input
                className="w-14 text-center"
                value={hours}
                onChange={handleHoursChange}
                maxLength={2}
              />
              <span className="text-lg">:</span>
              <Input
                className="w-14 text-center"
                value={minutes}
                onChange={handleMinutesChange}
                maxLength={2}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-14"
                onClick={togglePeriod}
              >
                {isPM ? "PM" : "AM"}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
