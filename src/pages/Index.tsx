import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { WeatherSection } from "@/components/home/WeatherSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-6">
          <WeatherSection />
          {/* Other sections will be added here */}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
