import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { AIRecommendations } from "@/components/home/AIRecommendations";

const Suggestions = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <Sidebar />
      
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <AIRecommendations />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Suggestions;