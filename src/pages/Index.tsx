import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { WeatherSection } from "@/components/home/WeatherSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <MainSidebar />
        <main className="flex-1 pt-16 px-4 md:pl-64">
          <div className="max-w-4xl mx-auto space-y-6 py-8">
            <WeatherSection />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;