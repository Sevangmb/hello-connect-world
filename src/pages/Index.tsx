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
import { CreateOutfit } from "@/components/outfits/CreateOutfit";
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

  const [activeTab, setActiveTab] = useState<
    "posts" | "friends" | "messages" | "clothes" | "outfits" | "profile"
  >("posts");

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />

      <main className="pt-20 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
            <TabsList className="w-full">
              <TabsTrigger value="posts" className="flex-1">
                Publications
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex-1">
                Amis
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex-1">
                Messages
              </TabsTrigger>
              <TabsTrigger value="clothes" className="flex-1">
                Vêtements
              </TabsTrigger>
              <TabsTrigger value="outfits" className="flex-1">
                Tenues
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex-1">
                Profil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="space-y-8">
                <CreatePost />
                {SAMPLE_POSTS.map((post) => (
                  <Post key={post.id} {...post} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="friends">
              <div className="space-y-8">
                <AddFriend />
                <FriendsList onChatSelect={(friend) => {
                  setSelectedChat({
                    type: "private",
                    id: friend.id,
                    name: friend.username || "Utilisateur",
                  });
                  setActiveTab("messages");
                }} />
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="space-y-8">
                {selectedChat ? (
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
                ) : (
                  <GroupsList onChatSelect={(group) => {
                    setSelectedChat({
                      type: "group",
                      id: group.id,
                      name: group.name,
                    });
                  }} />
                )}
              </div>
            </TabsContent>

            <TabsContent value="clothes">
              <div className="space-y-8">
                <AddClothesForm />
                <ClothesList />
              </div>
            </TabsContent>

            <TabsContent value="outfits">
              <div className="space-y-8">
                <CreateOutfit />
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;