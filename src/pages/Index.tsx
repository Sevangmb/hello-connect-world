import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { WeatherSection } from "@/components/home/WeatherSection";
import { AIRecommendations } from "@/components/home/AIRecommendations";
import { PostsList } from "@/components/posts/PostsList";
import { ActiveChallenge } from "@/components/home/ActiveChallenge";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <Sidebar />
      
      <main className="pt-20 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <WeatherSection />
          <AIRecommendations />
          <ActiveChallenge />
          <PostsList />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;