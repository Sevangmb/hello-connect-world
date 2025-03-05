
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger automatiquement vers le dashboard admin
    navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  // Afficher un écran de chargement pendant la redirection
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Redirection vers le panneau d'administration...</p>
      </div>
    </div>
  );
}
