
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Camera, Clock, Cloud, Compass, Heart, MessageSquare, Plus, ShoppingBag, Sun, Umbrella, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Composant pour les posts/looks tendance
const TrendingCard = ({ imgSrc, username, likes, comments, category }: { 
  imgSrc: string; 
  username: string; 
  likes: number; 
  comments: number;
  category: string;
}) => (
  <Card className="overflow-hidden hover-lift card-shadow">
    <div className="relative aspect-square overflow-hidden bg-muted">
      <img 
        src={imgSrc || "/placeholder.svg"} 
        alt={`Look par ${username}`}
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-2 right-2">
        <div className="bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
          {category}
        </div>
      </div>
    </div>
    <CardContent className="p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">@{username}</div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <div className="flex items-center text-xs">
            <Heart className="h-3 w-3 mr-1" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant pour les actions rapides
const QuickAction = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <Button 
    variant="outline" 
    className="flex flex-col h-24 items-center justify-center py-3 hover-lift"
    onClick={onClick}
  >
    <div className="mb-2">{icon}</div>
    <span className="text-xs text-center">{label}</span>
  </Button>
);

// Composant pour la météo
const WeatherCard = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg flex items-center">
        <Sun className="h-5 w-5 mr-2 text-warning" />
        Météo aujourd'hui
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">22°C</div>
          <div className="text-sm text-muted-foreground">Ensoleillé</div>
          <div className="text-xs text-muted-foreground mt-1">Paris, France</div>
        </div>
        <div className="text-6xl text-warning">
          <Sun />
        </div>
      </div>
      <Separator className="my-3" />
      <div className="flex justify-between text-sm">
        <div className="text-center">
          <div className="text-muted-foreground mb-1">
            <Cloud className="h-4 w-4 mx-auto" />
          </div>
          <div className="font-medium">Matin</div>
          <div>18°C</div>
        </div>
        <div className="text-center">
          <div className="text-warning mb-1">
            <Sun className="h-4 w-4 mx-auto" />
          </div>
          <div className="font-medium">Midi</div>
          <div>22°C</div>
        </div>
        <div className="text-center">
          <div className="text-warning mb-1">
            <Sun className="h-4 w-4 mx-auto" />
          </div>
          <div className="font-medium">Soir</div>
          <div>20°C</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground mb-1">
            <Umbrella className="h-4 w-4 mx-auto" />
          </div>
          <div className="font-medium">Nuit</div>
          <div>15°C</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant pour les défis actifs
const ChallengeCard = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg">Défi de la semaine</CardTitle>
      <CardDescription>Mode Automne 2023</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-primary mr-2" />
          <span className="text-sm">128 participants</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-muted-foreground mr-1" />
          <span className="text-xs text-muted-foreground">3 jours restants</span>
        </div>
      </div>
      <div className="flex space-x-2 mb-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Camera className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-medium">Créez votre look automnal</div>
          <div className="text-xs text-muted-foreground">
            Utilisez des couleurs chaudes et des textures automnales.
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <Button variant="default" size="sm">
          Participer
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ModernHome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("for-you");
  
  // Simulation de données de looks tendance
  const trendingLooks = [
    { id: 1, imgSrc: "/placeholder.svg", username: "sophie_style", likes: 234, comments: 45, category: "Casual" },
    { id: 2, imgSrc: "/placeholder.svg", username: "marc_mode", likes: 189, comments: 32, category: "Business" },
    { id: 3, imgSrc: "/placeholder.svg", username: "julia_fashion", likes: 267, comments: 51, category: "Soirée" },
    { id: 4, imgSrc: "/placeholder.svg", username: "thomas_trend", likes: 142, comments: 28, category: "Sportif" },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Bonjour, Bienvenue sur FRING!</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Créer un nouveau look
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne gauche - Météo et défis */}
        <div className="space-y-6">
          <WeatherCard />
          <ChallengeCard />
        </div>
        
        {/* Colonne centrale et droite - Feed principal */}
        <div className="md:col-span-2 space-y-6">
          {/* Actions rapides */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <QuickAction 
                  icon={<Camera className="h-6 w-6" />} 
                  label="Ajouter un vêtement" 
                  onClick={() => navigate("/personal/wardrobe")} 
                />
                <QuickAction 
                  icon={<BookOpen className="h-6 w-6" />} 
                  label="Ma garde-robe" 
                  onClick={() => navigate("/personal/wardrobe")} 
                />
                <QuickAction 
                  icon={<Compass className="h-6 w-6" />} 
                  label="Explorer" 
                  onClick={() => navigate("/explore")} 
                />
                <QuickAction 
                  icon={<ShoppingBag className="h-6 w-6" />} 
                  label="Boutiques" 
                  onClick={() => navigate("/boutiques")} 
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Feed avec onglets */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="for-you">Pour vous</TabsTrigger>
                <TabsTrigger value="trending">Tendances</TabsTrigger>
                <TabsTrigger value="following">Suivis</TabsTrigger>
              </TabsList>
              
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </div>
            
            <TabsContent value="for-you" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {trendingLooks.map(look => (
                  <TrendingCard 
                    key={look.id}
                    imgSrc={look.imgSrc}
                    username={look.username}
                    likes={look.likes}
                    comments={look.comments}
                    category={look.category}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="trending" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {[...trendingLooks].reverse().map(look => (
                  <TrendingCard 
                    key={look.id}
                    imgSrc={look.imgSrc}
                    username={look.username}
                    likes={look.likes * 1.2}
                    comments={look.comments * 1.3}
                    category={look.category}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="following" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {trendingLooks.slice(1, 3).map(look => (
                  <TrendingCard 
                    key={look.id}
                    imgSrc={look.imgSrc}
                    username={look.username}
                    likes={look.likes}
                    comments={look.comments}
                    category={look.category}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ModernHome;
