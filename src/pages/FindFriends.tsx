
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FindFriendsTabs } from "@/components/friends/FindFriendsTabs";
import { useSuggestedFriends } from "@/hooks/useSuggestedFriends";

const FindFriends = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discover");
  const { suggestedUsers, isLoading, sendFriendRequest } = useSuggestedFriends();

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
            <FindFriendsTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              suggestedUsers={suggestedUsers}
              isLoading={isLoading}
              onSelectUser={sendFriendRequest}
            />
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
