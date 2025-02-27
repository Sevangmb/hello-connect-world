
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { SuitcaseCalendar } from "@/components/suitcases/components/SuitcaseCalendar";

const SuitcaseCalendarPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72 pb-10">
        <div className="max-w-7xl mx-auto">
          <SuitcaseCalendar />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default SuitcaseCalendarPage;
