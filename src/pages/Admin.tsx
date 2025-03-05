
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Ajouter un console.log pour vérifier l'exécution de la redirection
    console.log("Admin page - Redirection en cours vers le dashboard admin");
    
    // Ajout d'un timeout pour laisser le temps au composant de se monter complètement
    const redirectTimer = setTimeout(() => {
      navigate("/admin/dashboard", { replace: true });
    }, 100);
    
    return () => clearTimeout(redirectTimer);
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
