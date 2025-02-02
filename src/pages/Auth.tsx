import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Tentative de connexion avec:", email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erreur de connexion détaillée:", error);
        let errorMessage = "Email ou mot de passe incorrect";
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        }
        
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage,
        });
        throw error;
      }

      console.log("Connexion réussie:", data);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Erreur complète:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Tentative d'inscription avec:", { email, username, fullName });

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
        console.error("Erreur d'inscription détaillée:", error);
        throw error;
      }

      console.log("Inscription réussie:", data);
      toast({
        title: "Inscription réussie",
        description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte mail.",
      });
      
      setMode("login");
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-custom-cream p-4">
      <Card className="w-full max-w-md border-custom-teal">
        <CardHeader>
          {mode !== "login" && (
            <Button
              variant="ghost"
              className="mb-4 w-fit text-custom-blue hover:text-custom-teal"
              onClick={() => setMode("login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          )}
          <CardTitle className="text-custom-blue">
            {mode === "login"
              ? "Connexion"
              : mode === "signup"
              ? "Inscription"
              : "Réinitialiser le mot de passe"}
          </CardTitle>
          <CardDescription className="text-custom-teal">
            {mode === "login"
              ? "Connectez-vous à votre compte"
              : mode === "signup"
              ? "Créez votre compte"
              : "Entrez votre email pour réinitialiser votre mot de passe"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={
              mode === "login"
                ? handleLogin
                : mode === "signup"
                ? handleSignup
                : handlePasswordReset
            }
          >
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="text-custom-blue" />
                    <Input
                      type="text"
                      placeholder="Nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="border-custom-teal focus:ring-custom-blue"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="text-custom-blue" />
                    <Input
                      type="text"
                      placeholder="Nom complet"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="border-custom-teal focus:ring-custom-blue"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="text-custom-blue" />
                <Input
                  type="email"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-custom-teal focus:ring-custom-blue"
                />
              </div>
            </div>

            {mode !== "reset" && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="text-custom-blue" />
                  <Input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-custom-teal focus:ring-custom-blue"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-custom-blue hover:bg-custom-teal text-white"
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

            {mode === "login" && (
              <div className="flex flex-col space-y-2 text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("signup")}
                  className="text-custom-blue hover:text-custom-teal"
                >
                  Pas encore de compte ? S'inscrire
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("reset")}
                  className="text-custom-blue hover:text-custom-teal"
                >
                  Mot de passe oublié ?
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
