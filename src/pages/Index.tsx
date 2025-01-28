import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AddClothesForm } from "@/components/clothes/AddClothesForm";
import { ClothesList } from "@/components/clothes/ClothesList";
import { FriendsList } from "@/components/friends/FriendsList";
import { AddFriend } from "@/components/friends/AddFriend";
import { GroupsList } from "@/components/groups/GroupsList";
import { MessagesList } from "@/components/messages/MessagesList";
import { CreateOutfit } from "@/components/outfits/CreateOutfit";
import { OutfitsList } from "@/components/outfits/OutfitsList";
import { CreateChallenge } from "@/components/challenges/CreateChallenge";
import { ChallengesList } from "@/components/challenges/ChallengesList";
import { PostsList } from "@/components/posts/PostsList";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState<
    "posts" | "friends" | "messages" | "clothes" | "outfits" | "challenges" | "profile"
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
              <TabsTrigger value="challenges" className="flex-1">
                Défis
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex-1">
                Profil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <PostsList />
            </TabsContent>

            <TabsContent value="friends">
              <div className="space-y-8">
                <AddFriend />
                <FriendsList />
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <MessagesList />
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
                <OutfitsList />
              </div>
            </TabsContent>

            <TabsContent value="challenges">
              <div className="space-y-8">
                <CreateChallenge />
                <ChallengesList />
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