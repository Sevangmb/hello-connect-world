
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  EmailField, 
  PasswordField, 
  LoginButton, 
  LoginFooter 
} from "./LoginForm";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Déterminer la destination de redirection après la connexion
  const from = location.state?.from?.pathname || "/";
  
  // Vérifier si l'URL de redirecttion est dans l'état de location
  useEffect(() => {
    if (location.state?.from) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour accéder à cette page",
      });
    }
  }, [location.state, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Données manquantes",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Connexion
      const result = await signIn(email, password);
      
      if (!result.error) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur FRING!",
        });
        navigate(from, { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Échec de connexion",
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailField 
              email={email}
              onChange={(e) => setEmail(e.target.value)}
              isSubmitting={isSubmitting}
            />
            
            <PasswordField 
              password={password}
              onChange={(e) => setPassword(e.target.value)}
              isSubmitting={isSubmitting}
            />
            
            <LoginButton isSubmitting={isSubmitting} />
            
            <LoginFooter />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
