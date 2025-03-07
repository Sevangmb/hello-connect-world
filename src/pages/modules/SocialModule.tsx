
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Trophy, MessageSquare } from 'lucide-react';

const SocialModule = () => {
  const navigate = useNavigate();
  
  return (
    <ModuleGuard moduleCode="social">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Module Social</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Défis
              </CardTitle>
              <CardDescription>Participez à des défis communautaires</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Rejoignez des défis de style et partagez vos créations avec la communauté.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/social/challenges')}
              >
                Voir les défis
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Amis
              </CardTitle>
              <CardDescription>Connectez-vous avec d'autres membres</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Trouvez des amis, suivez leur activité et découvrez leurs styles.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/social/friends')}
              >
                Gérer mes amis
              </Button>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Messages
              </CardTitle>
              <CardDescription>Communiquez avec vos contacts</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">Échangez des messages privés avec vos amis et vos groupes.</p>
              <Button 
                className="w-full mt-auto" 
                onClick={() => navigate('/social/messages')}
              >
                Mes messages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleGuard>
  );
};

export default SocialModule;
