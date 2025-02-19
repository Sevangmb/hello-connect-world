
import { PageLayout } from "@/components/layouts/PageLayout";
import { PostsList } from "@/components/posts/PostsList";

const Feed = () => {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Fil d'Actualité</h1>
      <PostsList />
    </PageLayout>
  );
};

export default Feed;
