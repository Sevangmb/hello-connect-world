import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MessagesList } from "@/components/messages/MessagesList";
import { FriendsList } from "@/components/friends/FriendsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare } from "lucide-react";

const Messages = () => {
  const [selectedFriend, setSelectedFriend] = useState<{ id: string; username: string } | null>(null);

  const handleChatSelect = (friend: { id: string; username: string }) => {
    setSelectedFriend(friend);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messagerie</h1>

          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Amis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              <MessagesList />
            </TabsContent>

            <TabsContent value="friends">
              <FriendsList onChatSelect={handleChatSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Messages;