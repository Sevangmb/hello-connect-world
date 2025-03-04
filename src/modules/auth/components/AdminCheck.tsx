
/**
 * Composant pour vérifier les privilèges d'administration
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAuthService } from "../services/authDependencyProvider";
import { getUserService } from "../services/userDependencyProvider";

interface AdminCheckProps {
  children: React.ReactNode;
}

export function AdminCheck({ children }: AdminCheckProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const authService = getAuthService();
  const userService = getUserService();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) throw new Error("No session");

        const isAdmin = await userService.isUserAdmin(user.id);
        
        if (!isAdmin) {
          throw new Error("Not an admin");
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          variant: "destructive",
          title: "Accès non autorisé",
          description: "Veuillez vous connecter avec un compte administrateur.",
        });
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  return <>{children}</>;
}
