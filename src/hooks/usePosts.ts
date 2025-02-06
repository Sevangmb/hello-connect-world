import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePosts = () => {
  return useQuery({
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
          .select("*", { count: "exact" })
          .eq("outfit_id", post.id);

        // Check if current user liked the post
        const { data: likedByUser } = await supabase
          .from("outfit_likes")
          .select("id")
          .eq("outfit_id", post.id)
          .eq("user_id", user.id)
          .maybeSingle();

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
};
