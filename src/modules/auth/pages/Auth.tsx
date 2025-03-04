
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Login } from '../components/Login';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png" 
            alt="FRING!" 
            className="h-24 w-24 rounded-full"
          />
        </div>
        
        <Card className="border shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
            <Login />
          </div>
        </Card>
        
        <div className="mt-4 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};
