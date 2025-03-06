
import { Link } from "react-router-dom";

export const LoginFooter = () => {
  return (
    <div className="text-center mt-6">
      <p className="text-sm text-muted-foreground">
        Pas encore de compte?{" "}
        <Link to="/auth/register" className="text-primary hover:underline">
          Créer un compte
        </Link>
      </p>
      <p className="text-xs text-muted-foreground mt-4">
        En vous connectant, vous acceptez nos{" "}
        <a href="/terms" className="hover:underline">
          Conditions d'utilisation
        </a>{" "}
        et notre{" "}
        <a href="/privacy" className="hover:underline">
          Politique de confidentialité
        </a>
      </p>
    </div>
  );
};
