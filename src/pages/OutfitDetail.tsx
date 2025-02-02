import React from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";

const OutfitDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold mb-4">
            Détail de la tenue {id ? `- ${id}` : ""}
          </h1>
          <div className="bg-white p-6 rounded shadow">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Tenue"
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-medium">Nom de la Tenue</h2>
            <p className="mt-2 text-gray-600">
              Ceci est une description détaillée de la tenue. Retrouvez ici toutes les informations essentielles concernant son style, sa composition, et les conseils d'entretien.
            </p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default OutfitDetail;
