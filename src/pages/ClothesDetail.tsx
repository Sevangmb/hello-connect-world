<code>
import React from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function ClothesDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold mb-4">
            Détail du vêtement {id ? `- ${id}` : ""}
          </h1>
          <div className="bg-white rounded-lg shadow p-6">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Vêtement"
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">Nom du Vêtement</h2>
            <p className="text-gray-700 mb-4">
              Ceci est une description détaillée du vêtement. Retrouvez ici toutes les informations essentielles concernant ce produit, telles que sa composition, ses instructions d'entretien, et bien plus encore.
            </p>
            <p className="text-lg font-medium">Prix: 49€</p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

</code>