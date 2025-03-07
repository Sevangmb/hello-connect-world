
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const PostsSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log("PostsSection: Initialisation du chargement");
    
    // Utiliser une référence pour suivre si le composant est monté
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        // Simuler un chargement de données
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (isMounted) {
          setIsLoading(false);
          console.log("PostsSection: Chargement terminé avec succès");
        }
      } catch (error) {
        console.error("PostsSection: Erreur lors du chargement", error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Force le chargement à se terminer après un délai maximum
    const timer = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log("PostsSection: Fin du chargement forcée après timeout");
        setIsLoading(false);
      }
    }, 3000);
    
    // Nettoyage lors du démontage du composant
    return () => {
      isMounted = false;
      clearTimeout(timer);
      console.log("PostsSection: Nettoyage du timer et des abonnements");
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Publications récentes</h2>
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Publications récentes</h2>
        <div className="text-center py-10 text-gray-500">
          Impossible de charger les publications. Veuillez réessayer plus tard.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Publications récentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <PostCard key={i} />
        ))}
      </div>
    </Card>
  );
};

const PostCard = () => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div>
        <div className="font-medium">Utilisateur</div>
        <div className="text-xs text-gray-500">Il y a 2h</div>
      </div>
    </div>
    <div className="aspect-video bg-gray-100 rounded mb-3"></div>
    <p className="text-sm text-gray-800">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. #mode #style
    </p>
  </div>
);
