import { Post } from "@/components/Post";
import { usePosts } from "@/hooks/usePosts";
import { CreatePost } from "@/components/CreatePost";

export const PostsList = () => {
  const { data: posts, isLoading } = usePosts();

  return (
    <div className="space-y-8">
      <CreatePost />
      {isLoading ? (
        <p className="text-center text-muted-foreground">Chargement des publications...</p>
      ) : !posts?.length ? (
        <p className="text-center text-muted-foreground">Aucune publication pour le moment</p>
      ) : (
        posts.map((post) => (
          <Post key={post.id} {...post} />
        ))
      )}
    </div>
  );
};