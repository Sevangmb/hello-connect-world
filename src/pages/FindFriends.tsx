
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { UserSearch } from "@/components/users/UserSearch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, UserX, Users, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

const FindFriends = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discover");

  // Récupérer les utilisateurs suggérés
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggested-friends"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non authentifié");

        // Récupérer les profils publics qui ne sont pas déjà amis
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .neq('id', user.id)
          .eq('visibility', 'public')
          .limit(10);

        if (error) throw error;

        // Récupérer les amitiés existantes
        const { data: friendships } = await supabase
          .from('friendships')
          .select('friend_id, user_id')
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

        // Filtrer les profils qui ne sont pas déjà amis
        return profiles.filter(profile => 
          !friendships?.some(friendship => 
            friendship.user_id === profile.id || 
            friendship.friend_id === profile.id
          )
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des suggestions:", error);
        return [];
      }
    },
  });

  const handleSelectUser = async (user: { id: string; username: string }) => {
    console.log("Selected user:", user);
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Non authentifié");

      // Vérifier si une demande d'ami existe déjà
      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .single();

      if (existingFriendship) {
        toast.info("Vous êtes déjà amis ou une demande est en attente");
        return;
      }

      // Créer une nouvelle demande d'ami
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUser.id,
          friend_id: user.id,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success("Demande d'ami envoyée !", {
        description: `Vous avez envoyé une demande d'ami à ${user.username}`,
        icon: <UserPlus className="h-4 w-4 text-green-500" />
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-blue-900">Trouver des amis</h1>
            </div>
            <p className="text-blue-700">
              Connectez-vous avec d'autres passionnés de mode et élargissez votre réseau social !
            </p>
          </div>
          
          <Card className="p-6 shadow-md border-blue-100 bg-white rounded-xl">
            <Tabs defaultValue="discover" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="discover" className="data-[state=active]:bg-blue-100">
                  <Users className="mr-2 h-4 w-4" />
                  Découvrir
                </TabsTrigger>
                <TabsTrigger value="search" className="data-[state=active]:bg-blue-100">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="discover" className="space-y-4">
                <h2 className="text-lg font-medium text-blue-800">Suggestions d'amis</h2>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-4 animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </div>
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : suggestedUsers?.length === 0 ? (
                  <div className="text-center py-8">
                    <UserX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">Aucune suggestion pour le moment</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Utilisez la recherche pour trouver des amis
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {suggestedUsers?.map((user) => (
                        <Card key={user.id} className="p-4 hover:bg-blue-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-blue-100">
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {user.username?.[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-blue-900">{user.username}</span>
                            </div>
                            <Button 
                              size="sm"
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
                              onClick={() => handleSelectUser(user)}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Ajouter
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
              
              <TabsContent value="search">
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-blue-800">Rechercher un utilisateur</h2>
                  <p className="text-gray-600">
                    Vous cherchez quelqu'un en particulier ? Entrez son nom d'utilisateur ci-dessous.
                  </p>
                  <UserSearch 
                    onSelect={handleSelectUser}
                    placeholder="Rechercher par nom d'utilisateur..."
                    className="bg-blue-50 hover:bg-blue-100 focus:ring-blue-500 border-blue-100"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="text-center text-gray-500 text-sm p-4">
            <p>Vous pouvez également retrouver vos amis existants et gérer vos demandes d'amis dans la section 
              <Button 
                variant="link" 
                className="px-1 font-semibold text-blue-600"
                onClick={() => navigate("/friends")}
              >
                Amis
              </Button>
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default FindFriends;
