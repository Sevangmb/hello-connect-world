import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("L'adresse email n'est pas valide");
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      throw new Error("Le mot de passe doit contenir au moins 6 caractères");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      validateEmail(email);
      validatePassword(password);

      if (isSignUp) {
        if (!username.trim()) {
          throw new Error("Le nom d'utilisateur est requis");
        }
        if (!fullName.trim()) {
          throw new Error("Le nom complet est requis");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Compte créé avec succès",
          description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception et vos spams.",
        });
        
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error("Erreur d'authentification:", error);
          
          if (error.message === "Email not confirmed") {
            toast({
              variant: "destructive",
              title: "Email non confirmé",
              description: "Veuillez vérifier votre boîte mail et confirmer votre email avant de vous connecter. Si vous ne trouvez pas l'email, vérifiez vos spams ou réessayez de vous inscrire.",
            });
            return;
          }
          
          if (error.message.includes("Invalid login credentials")) {
            toast({
              variant: "destructive",
              title: "Erreur de connexion",
              description: "Email ou mot de passe incorrect",
            });
            return;
          }
          
          throw error;
        }
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Créer un compte" : "Se connecter"}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Chargement..." : isSignUp ? "S'inscrire" : "Se connecter"}
          </Button>
        </form>
        
        <p className="text-center mt-4 text-sm text-gray-600">
          {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? "Se connecter" : "S'inscrire"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;