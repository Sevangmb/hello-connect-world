
import { Post } from "@/components/Post";
import { usePosts } from "@/hooks/usePosts";
import { CreatePost } from "@/components/CreatePost";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const PostsList = () => {
  const { data: posts, isLoading } = usePosts();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser(profile);
      }
    };
    getUser();
  }, []);

  return (
    <div className="space-y-8">
      <CreatePost />
      {isLoading ? (
        <p className="text-center text-muted-foreground">Chargement des publications...</p>
      ) : !posts?.length ? (
        <p className="text-center text-muted-foreground">Aucune publication pour le moment</p>
      ) : (
        posts.map((post) => (
          <Post 
            key={post.id} 
            {...post} 
            user={currentUser}
          />
        ))
      )}
    </div>
  );
};
