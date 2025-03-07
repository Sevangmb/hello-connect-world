
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const NewsSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log("NewsSection: Initialisation du chargement");
    
    // Utiliser une référence pour suivre si le composant est monté
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        // Simuler un chargement de données
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (isMounted) {
          setIsLoading(false);
          console.log("NewsSection: Chargement terminé avec succès");
        }
      } catch (error) {
        console.error("NewsSection: Erreur lors du chargement", error);
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
        console.log("NewsSection: Fin du chargement forcée après timeout");
        setIsLoading(false);
      }
    }, 3000);
    
    // Nettoyage lors du démontage du composant
    return () => {
      isMounted = false;
      clearTimeout(timer);
      console.log("NewsSection: Nettoyage du timer et des abonnements");
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dernières actualités</h2>
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dernières actualités</h2>
        <div className="text-center py-10 text-gray-500">
          Impossible de charger les actualités. Veuillez réessayer plus tard.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Dernières actualités</h2>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <NewsCard key={i} />
        ))}
      </div>
    </Card>
  );
};

const NewsCard = () => (
  <div className="flex gap-4 p-4 border-b border-gray-200">
    <div className="h-20 w-20 bg-gray-100 rounded flex-shrink-0"></div>
    <div>
      <h3 className="font-medium mb-1">Actualité mode</h3>
      <p className="text-sm text-gray-600 mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
      <div className="text-xs text-gray-500">Il y a 3h</div>
    </div>
  </div>
);
