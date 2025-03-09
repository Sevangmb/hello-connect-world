
import React, { useEffect } from 'react';
import { FavoritesSection } from '@/components/personal/FavoritesSection';
import { useAuth } from '@/modules/auth';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Favorites = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté après le chargement, rediriger vers la page d'authentification
    if (!loading && !user) {
      console.log('Redirection: utilisateur non connecté sur Favorites');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-muted-foreground">Chargement de vos favoris...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Ne rien afficher pendant la redirection
  }

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Favoris</h1>
      </div>
      
      <FavoritesSection />
    </div>
  );
};

export default Favorites;
