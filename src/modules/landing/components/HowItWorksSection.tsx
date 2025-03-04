
import React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comment ça fonctionne</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-xl">1</span>
          </div>
          <h3 className="font-semibold mb-2">Créez votre garde-robe</h3>
          <p className="text-gray-600">Prenez en photo ou importez vos vêtements pour constituer votre garde-robe virtuelle.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-xl">2</span>
          </div>
          <h3 className="font-semibold mb-2">Recevez des suggestions</h3>
          <p className="text-gray-600">Notre IA analyse votre style et la météo pour vous suggérer des tenues parfaites.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-xl">3</span>
          </div>
          <h3 className="font-semibold mb-2">Partagez votre style</h3>
          <p className="text-gray-600">Participez à la communauté en partageant vos tenues et en découvrant celles des autres.</p>
        </div>
      </div>
    </div>
  );
};
