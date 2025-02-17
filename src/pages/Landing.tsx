
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Bienvenue sur notre plateforme de mode
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez une nouvelle façon de gérer votre garde-robe, de créer des tenues et de partager votre style.
          </p>
          <div className="space-x-4">
            <Button 
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-facebook-primary hover:bg-facebook-secondary"
            >
              Commencer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
