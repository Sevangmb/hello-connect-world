
import React from 'react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Challenge } from '@/components/challenges/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ChallengesSection = () => {
  const navigate = useNavigate();
  const now = new Date().toISOString();
  
  const { data: challenges, isLoading } = useQuery({
    queryKey: ['explore-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          id, 
          title, 
          description,
          start_date, 
          end_date,
          profiles(username),
          participants:challenge_participants(count)
        `)
        .eq('status', 'active')
        .lte('start_date', now)
        .gt('end_date', now)
        .order('end_date', { ascending: true })
        .limit(3);

      if (error) throw error;
      return data as Challenge[];
    }
  });

  const handleViewAll = () => {
    navigate('/social/challenges');
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Chargement des défis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Défis en cours</h3>
        <Button variant="ghost" size="sm" onClick={handleViewAll} className="flex items-center gap-1">
          Voir tout
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {!challenges?.length ? (
        <p className="text-center text-muted-foreground py-4">
          Aucun défi en cours pour le moment
        </p>
      ) : (
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Créé par {challenge.profiles.username || 'Anonyme'} • 
                      {challenge.participants && challenge.participants.length > 0 
                        ? ` ${challenge.participants.length} participants`
                        : ' 0 participant'}
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/social/challenges/${challenge.id}`)}
                    className="text-xs"
                  >
                    Participer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {challenge.description && (
                  <p className="text-sm line-clamp-2 mb-2">{challenge.description}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  Se termine le {format(new Date(challenge.end_date), 'dd MMMM yyyy', { locale: fr })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
