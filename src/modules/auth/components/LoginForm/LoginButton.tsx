
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoginButtonProps {
  isSubmitting: boolean;
}

export const LoginButton = ({ isSubmitting }: LoginButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connexion en cours...
        </>
      ) : (
        "Se connecter"
      )}
    </Button>
  );
};
