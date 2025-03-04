
import React from "react";
import { FeaturesSection } from "./FeaturesSection";

export const HeaderSection: React.FC = () => {
  return (
    <div className="flex-1 space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Bienvenue sur FRING!
        </h1>
        <p className="text-xl text-gray-600">
          Découvrez une nouvelle façon de gérer votre garde-robe, de créer des tenues et de partager votre style.
        </p>
      </div>
      
      <FeaturesSection />
    </div>
  );
};
