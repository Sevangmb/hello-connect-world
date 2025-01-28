import { useState } from "react";
import { Header } from "@/components/Header";
import { MainSidebar } from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MessagesList } from "@/components/messages/MessagesList";
import { GroupsList } from "@/components/groups/GroupsList";
import { FriendsList } from "@/components/friends/FriendsList";
import { AddFriend } from "@/components/friends/AddFriend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Bell, UserPlus } from "lucide-react";

const Community = () => {
  const [activeTab, setActiveTab] = useState("messages");

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Communauté</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-4">
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Groupes</span>
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Amis</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              <MessagesList />
            </TabsContent>

            <TabsContent value="groups">
              <GroupsList />
            </TabsContent>

            <TabsContent value="friends" className="space-y-8">
              <AddFriend />
              <FriendsList />
            </TabsContent>

            <TabsContent value="notifications">
              <div className="text-center text-muted-foreground py-8">
                Les notifications seront bientôt disponibles
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Community;
