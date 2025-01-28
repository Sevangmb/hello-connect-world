import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

type AuthMode = "login" | "signup" | "reset";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log("Current auth mode:", mode);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Attempting login with:", email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }

      console.log("Login successful:", data);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect"
          : error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Attempting signup with:", email, username, fullName);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error.message);
        throw error;
      }

      if (!data.user) {
        throw new Error("No user data returned");
      }

      console.log("Signup successful:", data);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès !",
      });
      
      setMode("login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Requesting password reset for:", email);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });

      if (error) throw error;

      console.log("Password reset email sent");
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
      });
      
      setMode("login");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {mode !== "login" && (
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setMode("login")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        )}

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === "login"
              ? "Connexion"
              : mode === "signup"
              ? "Inscription"
              : "Réinitialiser le mot de passe"}
          </h2>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={
            mode === "login"
              ? handleLogin
              : mode === "signup"
              ? handleSignup
              : handlePasswordReset
          }
        >
          <div className="rounded-md shadow-sm space-y-4">
            {mode === "signup" && (
              <>
                <div className="flex items-center space-x-2">
                  <User className="text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <User className="text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            <div className="flex items-center space-x-2">
              <Mail className="text-gray-400" />
              <Input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== "reset" && (
              <div className="flex items-center space-x-2">
                <Lock className="text-gray-400" />
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                "Chargement..."
              ) : mode === "login" ? (
                "Se connecter"
              ) : mode === "signup" ? (
                "S'inscrire"
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </Button>
          </div>

          {mode === "login" && (
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="link"
                onClick={() => setMode("signup")}
              >
                Créer un compte
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => setMode("reset")}
              >
                Mot de passe oublié ?
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
