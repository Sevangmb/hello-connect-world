
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Login } from "@/modules/auth/components/Login";
import { Card } from "@/components/ui/card";

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Si l'utilisateur est déjà connecté, le rediriger vers l'application
  React.useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Section de présentation */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Bienvenue sur FRING!
              </h1>
              <p className="text-xl text-gray-600">
                Découvrez une nouvelle façon de gérer votre garde-robe, de créer des tenues et de partager votre style.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Fonctionnalités principales</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold">✓</span>
                  </span>
                  <span>Organisez votre garde-robe virtuelle</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold">✓</span>
                  </span>
                  <span>Recevez des suggestions de tenues personnalisées</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold">✓</span>
                  </span>
                  <span>Participez à des défis de mode et récoltez des votes</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold">✓</span>
                  </span>
                  <span>Créez des valises intelligentes pour vos voyages</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Formulaire d'authentification */}
          <div className="w-full max-w-md mt-8 md:mt-0">
            <Card className="border shadow-lg">
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <img 
                    src="/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png" 
                    alt="FRING!" 
                    className="h-16 w-16 rounded-full"
                  />
                </div>
                <Login />
              </div>
            </Card>
          </div>
        </div>
        
        {/* Section supplémentaire de présentation */}
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
      </div>
    </div>
  );
};

export default Landing;
