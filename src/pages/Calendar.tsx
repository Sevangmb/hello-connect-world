
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ClothesCalendar } from "@/components/clothes/ClothesCalendar";

const Calendar = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <ClothesCalendar />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Calendar;
