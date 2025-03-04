
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthCard } from "@/modules/landing/components/AuthCard";
import { HeaderSection } from "@/modules/landing/components/HeaderSection";
import { HowItWorksSection } from "@/modules/landing/components/HowItWorksSection";
import { useRegistrationStatus } from "@/modules/landing/hooks/useRegistrationStatus";
import { DarkModeToggle } from "@/modules/landing/components/DarkModeToggle";

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { waitlistOpen, isLoading } = useRegistrationStatus();

  // Si l'utilisateur est déjà connecté, le rediriger vers l'application
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
      <DarkModeToggle />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Section de présentation */}
          <HeaderSection />
          
          {/* Formulaire d'authentification ou préinscription */}
          <div className="w-full max-w-md mt-8 md:mt-0">
            {!isLoading && (
              <AuthCard waitlistOpen={waitlistOpen} />
            )}
          </div>
        </div>
        
        {/* Section supplémentaire de présentation */}
        <HowItWorksSection />
      </div>
    </div>
  );
};

export default Landing;
