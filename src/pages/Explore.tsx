
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { useModules } from "@/hooks/modules/useModules";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Import refactored components
import { PostsSection } from "@/components/explore/PostsSection";
import { NewsSection } from "@/components/explore/NewsSection";
import { HashtagsSection } from "@/components/explore/HashtagsSection";
import { FavoritesSection } from "@/components/explore/FavoritesSection";
import { TrendingSection } from "@/components/explore/TrendingSection";
import { ModuleUnavailable } from "@/components/explore/ModuleUnavailable";

const Explore: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { modules, isInitialized } = useModules();

  useEffect(() => {
    console.log("Explorer: Initialisation du chargement");
    
    // Marquer comme non chargé jusqu'à ce que les modules soient initialisés
    if (isInitialized) {
      console.log("Explorer: Modules initialisés, fin du chargement");
      setIsLoading(false);
    }
    
    // Définir un délai maximum pour le chargement
    const timer = setTimeout(() => {
      console.log("Explorer: Fin du chargement forcée après timeout");
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      console.log("Explorer: Nettoyage du timer");
    };
  }, [isInitialized]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">Chargement de l'explorateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Explorer</h1>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-4 w-full md:w-auto flex overflow-x-auto pb-1">
          <TabsTrigger value="posts">Publications</TabsTrigger>
          <TabsTrigger value="news">Actualités</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="trending">Tendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-4">
          <ModuleGuard moduleCode="posts" fallback={<ModuleUnavailable name="Publications" />}>
            <PostsSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="news" className="space-y-4">
          <ModuleGuard moduleCode="social" fallback={<ModuleUnavailable name="Actualités" />}>
            <NewsSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="hashtags" className="space-y-4">
          <ModuleGuard moduleCode="social" fallback={<ModuleUnavailable name="Hashtags" />}>
            <HashtagsSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <ModuleGuard moduleCode="social" fallback={<ModuleUnavailable name="Favoris" />}>
            <FavoritesSection />
          </ModuleGuard>
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-4">
          <ModuleGuard moduleCode="social" fallback={<ModuleUnavailable name="Tendances" />}>
            <TrendingSection />
          </ModuleGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
