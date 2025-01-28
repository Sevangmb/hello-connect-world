import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CreatePost } from "@/components/CreatePost";
import { Post } from "@/components/Post";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AddClothesForm } from "@/components/clothes/AddClothesForm";
import { ClothesList } from "@/components/clothes/ClothesList";

const SAMPLE_POSTS = [
  {
    id: 1,
    author: "Marie Dupont",
    content: "Quelle belle journée pour coder ! 💻✨",
    likes: 12
  },
  {
    id: 2,
    author: "Jean Martin",
    content: "Je viens de terminer mon nouveau projet !",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    likes: 24
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Sidebar />
      
      <main className="pt-20 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileForm />
          <AddClothesForm />
          <ClothesList />
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