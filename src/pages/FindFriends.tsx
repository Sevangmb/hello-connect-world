import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { UserSearch } from "@/components/users/UserSearch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const FindFriends = () => {
  const navigate = useNavigate();

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
      
      toast.success("Demande d'ami envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      toast.error("Erreur lors de l'envoi de la demande d'ami");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Trouver des amis</h1>
            <p className="text-gray-600">
              Recherchez des utilisateurs par leur nom d'utilisateur et envoyez-leur une demande d'ami.
            </p>
          </div>
          
          <UserSearch 
            onSelect={handleSelectUser}
            placeholder="Rechercher un utilisateur..."
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default FindFriends;
