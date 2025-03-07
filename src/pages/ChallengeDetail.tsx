
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ChallengeHeader } from '@/components/challenges/ChallengeHeader';
import { ChallengeMetadata } from '@/components/challenges/ChallengeMetadata';
import { ParticipantsList } from '@/components/challenges/ParticipantsList';
import { JoinChallengeDialog } from '@/components/challenges/JoinChallengeDialog';
import { VotingDialog } from '@/components/challenges/VotingDialog';
import { useChallengeActions } from '@/components/challenges/ChallengeActions';
import { ArrowLeft, Users, Vote } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showVotingDialog, setShowVotingDialog] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const { handleVote } = useChallengeActions();

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setChallenge(data);

        // Charger les participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('challenge_participants')
          .select(`
            id,
            user_id,
            outfit_id,
            comment,
            created_at,
            outfits (
              id,
              name,
              image_url
            ),
            profiles (
              id,
              username,
              avatar_url
            )
          `)
          .eq('challenge_id', id);

        if (participantsError) throw participantsError;
        setParticipants(participantsData || []);

        // Vérifier si l'utilisateur actuel participe
        if (user) {
          setIsParticipant(
            participantsData?.some(p => p.user_id === user.id) || false
          );
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id, user]);

  const handleVoteClick = (participantId: string) => {
    if (challenge?.id) {
      handleVote(participantId, challenge.id);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => navigate('/social/challenges')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux défis
      </Button>
      
      {challenge ? (
        <>
          <ChallengeHeader challenge={challenge} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-1">
              <ChallengeMetadata challenge={challenge} />
              
              <div className="mt-4 space-y-2">
                {!isParticipant && (
                  <Button 
                    className="w-full"
                    onClick={() => setShowJoinDialog(true)}
                  >
                    Participer à ce défi
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowVotingDialog(true)}
                >
                  <Vote className="h-4 w-4 mr-2" />
                  Voter pour un participant
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Participants</h2>
              <ParticipantsList participants={participants} />
            </div>
          </div>
          
          <JoinChallengeDialog 
            isOpen={showJoinDialog} 
            onClose={() => setShowJoinDialog(false)} 
            challengeId={challenge.id}
            onSuccess={() => {
              setShowJoinDialog(false);
              setIsParticipant(true);
            }}
          />
          
          <VotingDialog 
            isOpen={showVotingDialog} 
            onClose={() => setShowVotingDialog(false)} 
            participants={participants}
            onVote={handleVoteClick}
          />
        </>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Défi non trouvé</h2>
          <p className="mt-2 text-gray-500">Ce défi n'existe pas ou a été supprimé.</p>
          <Button 
            className="mt-4"
            onClick={() => navigate('/social/challenges')}
          >
            Voir tous les défis
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetail;
