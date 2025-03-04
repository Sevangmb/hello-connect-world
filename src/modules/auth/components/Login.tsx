
/**
 * Composant de formulaire de connexion
 */
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  EmailField, 
  PasswordField, 
  LoginButton, 
  LoginFooter 
} from "./LoginForm";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Déterminer la destination de redirection après la connexion
  const from = location.state?.from?.pathname || "/";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Connexion
      if (!email || !password) {
        setIsSubmitting(false);
        return;
      }

      const result = await signIn(email, password);
      if (!result.error) {
        navigate(from, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};
