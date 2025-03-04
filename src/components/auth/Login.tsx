
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Déterminer la destination de redirection après la connexion
  const from = location.state?.from?.pathname || "/";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        // Inscription
        if (!email || !password || !username) {
          setIsSubmitting(false);
          return;
        }

        const result = await signUp(email, password, { 
          username, 
          full_name: fullName 
        });
        
        if (!result.error) {
          // Basculer vers le formulaire de connexion
          setIsSignUp(false);
        }
      } else {
        // Connexion
        if (!email || !password) {
          setIsSubmitting(false);
          return;
        }

        const result = await signIn(email, password);
        if (!result.error) {
          navigate(from, { replace: true });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {isSignUp ? "Créer un compte" : "Se connecter"}
          </h2>
        </div>
        
        {isSignUp && (
          <>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Nom d'utilisateur</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                required={isSignUp}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">Nom complet</label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nom complet"
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="pr-10"
              disabled={isSubmitting}
            />
            <button
              type="button" 
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {!isSignUp && (
            <div className="text-right">
              <a href="#" className="text-xs text-primary hover:underline">
                Mot de passe oublié?
              </a>
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignUp ? "Création du compte..." : "Connexion..."}
            </>
          ) : (
            isSignUp ? "S'inscrire" : "Se connecter"
          )}
        </Button>
        
        <p className="text-center text-sm text-gray-600">
          {isSignUp ? "Déjà inscrit ?" : "Pas encore de compte ?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
            disabled={isSubmitting}
          >
            {isSignUp ? "Se connecter" : "S'inscrire"}
          </button>
        </p>
      </form>
    </Card>
  );
};

export default function Login() {
  return (
    <div className="max-w-md w-full mx-auto">
      <AuthForm />
    </div>
  );
}
