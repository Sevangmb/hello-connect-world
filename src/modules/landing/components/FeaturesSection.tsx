
import React from "react";

export const FeaturesSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Fonctionnalités principales</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-primary font-semibold">✓</span>
          </span>
          <span className="dark:text-gray-200">Organisez votre garde-robe virtuelle</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-primary font-semibold">✓</span>
          </span>
          <span className="dark:text-gray-200">Recevez des suggestions de tenues personnalisées</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-primary font-semibold">✓</span>
          </span>
          <span className="dark:text-gray-200">Participez à des défis de mode et récoltez des votes</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <span className="text-primary font-semibold">✓</span>
          </span>
          <span className="dark:text-gray-200">Créez des valises intelligentes pour vos voyages</span>
        </li>
      </ul>
    </div>
  );
};
