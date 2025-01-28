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
import { MessagesList } from "@/components/messages/MessagesList";
import { CreateOutfit } from "@/components/outfits/CreateOutfit";
import { OutfitsList } from "@/components/outfits/OutfitsList";
import { CreateChallenge } from "@/components/challenges/CreateChallenge";
import { ChallengesList } from "@/components/challenges/ChallengesList";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [activeTab, setActiveTab] = useState<
    "posts" | "friends" | "messages" | "clothes" | "outfits" | "challenges" | "profile"
  >("posts");

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("Fetching posts...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Fetch posts with author information
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // For each post, fetch likes count, liked status, and comments
      const enrichedPosts = await Promise.all(posts.map(async (post) => {
        // Get likes count
        const { count: likesCount } = await supabase
          .from("outfit_likes")
          .select("*", { count: true })
          .eq("outfit_id", post.id);

        // Check if current user liked the post
        const { data: likedByUser } = await supabase
          .from("outfit_likes")
          .select("id")
          .eq("outfit_id", post.id)
          .eq("user_id", user.id)
          .single();

        // Get comments
        const { data: comments } = await supabase
          .from("outfit_comments")
          .select(`
            id,
            content,
            created_at,
            profiles:user_id (
              username,
              avatar_url
            )
          `)
          .eq("outfit_id", post.id)
          .order("created_at", { ascending: true });

        return {
          id: post.id,
          author: {
            id: post.profiles.id,
            username: post.profiles.username,
            avatar_url: post.profiles.avatar_url,
          },
          content: post.content,
          created_at: post.created_at,
          likes: likesCount || 0,
          liked: !!likedByUser,
          comments: comments?.map(comment => ({
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            author: {
              username: comment.profiles.username,
              avatar_url: comment.profiles.avatar_url,
            }
          })) || [],
        };
      }));

      return enrichedPosts;
    },
  });

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
              <div className="space-y-8">
                <CreatePost />
                {postsLoading ? (
                  <p className="text-center text-muted-foreground">Chargement des publications...</p>
                ) : !posts?.length ? (
                  <p className="text-center text-muted-foreground">Aucune publication pour le moment</p>
                ) : (
                  posts.map((post) => (
                    <Post key={post.id} {...post} />
                  ))
                )}
              </div>
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