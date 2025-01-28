import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const ActiveChallenge = () => {
  const { data: challenge, isLoading } = useQuery({
    queryKey: ["active-challenge"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("status", "active")
        .gte("end_date", new Date().toISOString())
        .order("end_date", { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !challenge) return null;

  return (
    <Card className="p-6 bg-gradient-to-r from-facebook-primary to-facebook-secondary text-white">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-8 w-8" />
        <div>
          <h2 className="text-xl font-bold">{challenge.title}</h2>
          <p className="text-sm opacity-90">
            Se termine dans {formatDistanceToNow(new Date(challenge.end_date), { addSuffix: true, locale: fr })}
          </p>
        </div>
      </div>
      
      {challenge.description && (
        <p className="mb-4 opacity-90">{challenge.description}</p>
      )}

      <Button variant="secondary" className="w-full sm:w-auto">
        Participer au défi
      </Button>
    </Card>
  );
};