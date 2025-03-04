
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/components/auth/Login";
import { Card } from "@/components/ui/card";

const Auth = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("Auth page - Utilisateur déjà connecté, redirection");
      // Rediriger vers la page d'origine ou la page d'accueil
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/9a2d6f53-d074-4690-bd16-a9c6c1e5f3c5.png" 
            alt="FRING!" 
            className="h-16 w-16 rounded-full"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Bienvenue sur FRING!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connectez-vous ou créez un compte pour accéder à l'application
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Login />
        </Card>
      </div>
    </div>
  );
};

export default Auth;
