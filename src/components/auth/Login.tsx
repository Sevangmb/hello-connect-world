
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, { username, full_name: fullName });
        toast({
          title: "Compte créé avec succès",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
          duration: 5000,
        });
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      let errorMessage = "Une erreur est survenue";
      
      if (err.message === "Invalid login credentials") {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (err.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter";
      } else if (err.message.includes("already registered")) {
        errorMessage = "Cet email est déjà enregistré";
      } else if (err.message.includes("username already exists")) {
        errorMessage = "Ce nom d'utilisateur existe déjà";
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                required={isSignUp}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nom complet"
                required={isSignUp}
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Chargement..."
            : isSignUp
            ? "S'inscrire"
            : "Se connecter"}
        </Button>
        <p className="text-center text-sm text-gray-600">
          {isSignUp ? "Déjà inscrit ?" : "Pas encore de compte ?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline"
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
