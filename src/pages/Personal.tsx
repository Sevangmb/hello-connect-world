
import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/modules/auth";
import { supabase } from "@/integrations/supabase/client";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

// Import refactored components
import { ModuleUnavailable } from "@/components/personal/ModuleUnavailable";
import { ClothingSection } from "@/components/personal/ClothingSection";
import { OutfitsSection } from "@/components/personal/OutfitsSection";
import { FavoritesSection } from "@/components/personal/FavoritesSection";
import { CalendarSection } from "@/components/personal/CalendarSection";

const Personal: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [clothingItems, setClothingItems] = useState<any[]>([]);
  const [outfits, setOutfits] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraire l'onglet actif des paramètres d'URL ou de l'état de location
  const getInitialTab = () => {
    // Vérifier si tab est passé via location state
    if (location.state && location.state.tab) {
      return location.state.tab;
    }
    
    // Fallback à l'onglet par défaut
    return "clothes";
  };
  
  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  
  // Mise en cache des données pour éviter des rechargements inutiles
  const cachedData = useMemo(() => ({
    clothes: clothingItems,
    outfits: outfits
  }), [clothingItems, outfits]);
  
  useEffect(() => {
    console.log("Personal: Initialisation du chargement, utilisateur authentifié:", isAuthenticated);
    
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page d'authentification
    if (!isAuthenticated && !isLoading) {
      console.log("Personal: Utilisateur non authentifié, redirection vers /auth");
      navigate("/auth");
      return;
    }
    
    // Référence pour savoir si le composant est toujours monté
    let isMounted = true;
    
    const fetchData = async () => {
      if (!user) {
        console.log("Personal: Utilisateur non connecté, arrêt du chargement");
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      
      // Ajout d'une logique de debounce pour éviter plusieurs requêtes rapprochées
      const debounceId = setTimeout(async () => {
        try {
          console.log("Personal: Début du chargement des données pour l'utilisateur", user.id);
          
          // Utiliser un tableau de promesses pour les exécuter en parallèle
          const [clothesResponse, outfitsResponse] = await Promise.all([
            // Récupérer les vêtements
            supabase
              .from("clothes")
              .select("*")
              .eq("user_id", user.id)
              .eq("archived", false)
              .order("created_at", { ascending: false }),
            
            // Récupérer les tenues
            supabase
              .from("outfits")
              .select("*, top_id(*), bottom_id(*), shoes_id(*)")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(6)
          ]);
          
          // Vérifier les erreurs des deux requêtes
          if (clothesResponse.error) throw clothesResponse.error;
          if (outfitsResponse.error) throw outfitsResponse.error;
          
          // Mettre à jour l'état si le composant est toujours monté
          if (isMounted) {
            setClothingItems(clothesResponse.data || []);
            setOutfits(outfitsResponse.data || []);
            console.log("Personal: Données chargées avec succès");
            
            // Activer la mise en cache dans localStorage pour des chargements plus rapides
            try {
              localStorage.setItem('user_clothes_cache', JSON.stringify({
                timestamp: Date.now(),
                data: clothesResponse.data
              }));
              
              localStorage.setItem('user_outfits_cache', JSON.stringify({
                timestamp: Date.now(),
                data: outfitsResponse.data
              }));
            } catch (e) {
              // Ignorer les erreurs de localStorage (ex: mode privé)
              console.warn("Impossible de mettre en cache les données:", e);
            }
            
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Personal: Erreur lors du chargement des données:", error);
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
            
            // Notification d'erreur plus spécifique avec possibilité de réessayer
            toast.error("Impossible de charger vos données", {
              description: "Veuillez réessayer ou vérifier votre connexion",
              action: {
                label: "Réessayer",
                onClick: () => fetchData()
              }
            });
          }
        }
      }, 100); // Légère latence pour éviter les requêtes en rafale
      
      return () => clearTimeout(debounceId);
    };
    
    // Essayer d'abord de charger à partir du cache
    const loadFromCache = () => {
      try {
        const clothesCache = localStorage.getItem('user_clothes_cache');
        const outfitsCache = localStorage.getItem('user_outfits_cache');
        
        if (clothesCache && outfitsCache) {
          const parsedClothes = JSON.parse(clothesCache);
          const parsedOutfits = JSON.parse(outfitsCache);
          
          // Vérifier la fraîcheur du cache (moins de 5 minutes)
          const now = Date.now();
          const clothesFresh = now - parsedClothes.timestamp < 300000;
          const outfitsFresh = now - parsedOutfits.timestamp < 300000;
          
          if (clothesFresh && outfitsFresh) {
            console.log("Personal: Chargement depuis le cache");
            setClothingItems(parsedClothes.data || []);
            setOutfits(parsedOutfits.data || []);
            setIsLoading(false);
            return true;
          }
        }
        return false;
      } catch (e) {
        console.warn("Erreur lors de la lecture du cache:", e);
        return false;
      }
    };
    
    if (isAuthenticated && user) {
      // Si le cache est indisponible ou périmé, charger depuis l'API
      if (!loadFromCache()) {
        fetchData();
      }
    } else {
      setIsLoading(false);
    }
    
    // Force le chargement à se terminer après un délai maximum
    const timer = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log("Personal: Fin du chargement forcée après timeout");
        setIsLoading(false);
        if (hasError) {
          toast.error("Le chargement a pris trop de temps. Veuillez rafraîchir la page.");
        }
      }
    }, 3000); // Réduit à 3 secondes pour une meilleure expérience utilisateur
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      console.log("Personal: Nettoyage du composant");
    };
  }, [user, isAuthenticated, navigate, hasError, isLoading]);

  // Mise à jour de l'onglet actif avec mémorisation de l'état
  const handleTabChange = (value: string) => {
    console.log("Personal: Changement d'onglet vers", value);
    setActiveTab(value);
    
    // Mettre à jour l'état de l'historique sans rechargement
    window.history.replaceState(
      { ...window.history.state, tab: value },
      '',
      window.location.pathname
    );
  };

  // Optimisation: Affichage d'un squelette de chargement plus léger
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <LoadingSpinner size="md" className="mx-auto mb-4" />
          <p className="text-gray-500">Chargement de votre univers...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <h2 className="text-red-800 font-semibold mb-2">Erreur de chargement</h2>
          <p className="text-red-700 mb-4">
            Une erreur est survenue lors du chargement de vos données.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="destructive"
          >
            Rafraîchir la page
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-center">
          <h2 className="text-amber-800 font-semibold mb-2">Connexion requise</h2>
          <p className="text-amber-700 mb-4">
            Vous devez être connecté pour accéder à votre univers personnel.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            variant="default"
          >
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Mon Univers</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-4 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <TabsTrigger value="clothes" className="px-4 py-2">Mes Vêtements</TabsTrigger>
          <TabsTrigger value="outfits" className="px-4 py-2">Mes Tenues</TabsTrigger>
          <TabsTrigger value="suitcases" className="px-4 py-2">Mes Valises</TabsTrigger>
          <TabsTrigger value="favorites" className="px-4 py-2">Mes Favoris</TabsTrigger>
          <TabsTrigger value="calendar" className="px-4 py-2">Calendrier</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clothes" className="mt-2">
          <ModuleGuard moduleCode="clothes" fallback={<ModuleUnavailable name="Vêtements" />}>
            <ClothingSection items={cachedData.clothes} />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="outfits" className="mt-2">
          <ModuleGuard moduleCode="outfits" fallback={<ModuleUnavailable name="Tenues" />}>
            <OutfitsSection outfits={cachedData.outfits} />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-2">
          <ModuleGuard moduleCode="outfits" fallback={<ModuleUnavailable name="Favoris" />}>
            <FavoritesSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-2">
          <ModuleGuard moduleCode="clothes" fallback={<ModuleUnavailable name="Calendrier" />}>
            <CalendarSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="suitcases" className="mt-2">
          <ModuleGuard moduleCode="wardrobe" fallback={<ModuleUnavailable name="Valises" />}>
            <div className="bg-white rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold mb-2">Mes Valises</h2>
              <p className="text-gray-600 mb-4">
                Préparez vos voyages en créant des valises virtuelles avec vos vêtements.
              </p>
              <Button 
                onClick={() => navigate('/valises')}
                className="w-full sm:w-auto"
              >
                Gérer mes valises
              </Button>
            </div>
          </ModuleGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Personal;
