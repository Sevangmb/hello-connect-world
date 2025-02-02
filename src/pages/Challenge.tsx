import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
 

export default function Challenge() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 pb-8 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <section className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-semibold">Challenge #{id}</h2>
            <p className="mt-2">Détails du challenge</p>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}