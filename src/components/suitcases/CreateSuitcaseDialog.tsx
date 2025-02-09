
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CreateSuitcaseDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("suitcases")
        .insert({
          name,
          description,
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Valise créée",
        description: "Votre valise a été créée avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["suitcases"] });
      setOpen(false);
      setName("");
      setDescription("");
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      console.error("Error creating suitcase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la valise",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Créer une valise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle valise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la valise</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vacances d'été..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de votre valise..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PP", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setStartCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PP", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setEndCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer la valise"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

