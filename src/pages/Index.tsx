import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CreatePost } from "@/components/CreatePost";
import { Post } from "@/components/Post";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AddClothesForm } from "@/components/clothes/AddClothesForm";
import { ClothesList } from "@/components/clothes/ClothesList";
import { FriendsList } from "@/components/friends/FriendsList";
import { AddFriend } from "@/components/friends/AddFriend";
import { GroupsList } from "@/components/groups/GroupsList";
import { PrivateChat } from "@/components/messages/PrivateChat";
import { GroupChat } from "@/components/messages/GroupChat";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SAMPLE_POSTS = [
  {
    id: 1,
    author: "Marie Dupont",
    content: "Quelle belle journée pour coder ! 💻✨",
    likes: 12,
  },
  {
    id: 2,
    author: "Jean Martin",
    content: "Je viens de terminer mon nouveau projet !",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    likes: 24,
  },
];

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<{
    type: "private" | "group";
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />

      <main className="pt-20 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileForm />
          <AddClothesForm />
          <ClothesList />

          <Tabs defaultValue="friends" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="friends" className="flex-1">
                Amis
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex-1">
                Messages
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">
                Groupes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends">
              <div className="space-y-8">
                <AddFriend />
                <FriendsList onChatSelect={(friend) => 
                  setSelectedChat({
                    type: "private",
                    id: friend.id,
                    name: friend.username || "Utilisateur",
                  })
                } />
              </div>
            </TabsContent>

            <TabsContent value="messages">
              {selectedChat && (
                selectedChat.type === "private" ? (
                  <PrivateChat
                    recipientId={selectedChat.id}
                    recipientName={selectedChat.name}
                  />
                ) : (
                  <GroupChat
                    groupId={selectedChat.id}
                    groupName={selectedChat.name}
                  />
                )
              )}
            </TabsContent>

            <TabsContent value="groups">
              <GroupsList onChatSelect={(group) =>
                setSelectedChat({
                  type: "group",
                  id: group.id,
                  name: group.name,
                })
              } />
            </TabsContent>
          </Tabs>

          <CreatePost />

          {SAMPLE_POSTS.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;