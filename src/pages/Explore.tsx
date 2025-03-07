
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ModuleGuard } from "@/components/modules/ModuleGuard";

const Explore = () => {
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
          <ModuleGuard moduleCode="hashtags" fallback={<ModuleUnavailable name="Hashtags" />}>
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

// Section components with placeholder content
const PostsSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Publications récentes</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <PostCard key={i} />
      ))}
    </div>
  </Card>
);

const NewsSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Dernières actualités</h2>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <NewsCard key={i} />
      ))}
    </div>
  </Card>
);

const HashtagsSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Hashtags populaires</h2>
    <div className="flex flex-wrap gap-2">
      {["#mode", "#style", "#tendance", "#outfit", "#streetwear", "#vintage", "#minimaliste", "#casual", "#elegance", "#denim"].map((tag) => (
        <HashtagButton key={tag} tag={tag} />
      ))}
    </div>
  </Card>
);

const FavoritesSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Vos favoris</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <FavoriteCard key={i} />
      ))}
    </div>
  </Card>
);

const TrendingSection = () => (
  <Card className="p-6">
    <h2 className="text-xl font-semibold mb-4">Tendances du moment</h2>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <TrendingCard key={i} />
      ))}
    </div>
  </Card>
);

// Component for displaying unavailable modules
const ModuleUnavailable = ({ name }: { name: string }) => (
  <Card className="p-6 bg-amber-50 border-amber-200">
    <h2 className="text-amber-800 font-semibold mb-2">Module {name} indisponible</h2>
    <p className="text-amber-700">
      Ce module est actuellement désactivé ou en cours de maintenance.
    </p>
  </Card>
);

// UI Components for the different content types
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

const HashtagButton = ({ tag }: { tag: string }) => (
  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition">
    {tag}
  </button>
);

const FavoriteCard = () => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
    <div className="aspect-square bg-gray-100 rounded mb-3"></div>
    <h3 className="font-medium">Titre du favori</h3>
    <p className="text-sm text-gray-600">Description courte</p>
  </div>
);

const TrendingCard = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-200">
    <div className="text-xl font-bold text-gray-400">#1</div>
    <div>
      <h3 className="font-medium">Tendance populaire</h3>
      <p className="text-sm text-gray-600">
        Voir pourquoi c'est tendance
      </p>
    </div>
  </div>
);

export default Explore;
