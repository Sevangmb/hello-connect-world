
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldOff } from "lucide-react";

/**
 * Composant pour activer/désactiver le bypass admin en mode développement
 * À utiliser uniquement pendant le développement
 */
export function AdminLoginBypass() {
  const [isAdminBypass, setIsAdminBypass] = useState(false);
  const { toast } = useToast();

  // Vérifier si le bypass est activé au chargement
  useEffect(() => {
    const bypassEnabled = localStorage.getItem('dev_admin_bypass') === 'true';
    setIsAdminBypass(bypassEnabled);
  }, []);

  // Fonction pour activer/désactiver le bypass
  const toggleAdminBypass = () => {
    const newStatus = !isAdminBypass;
    setIsAdminBypass(newStatus);
    
    if (newStatus) {
      localStorage.setItem('dev_admin_bypass', 'true');
      toast({
        title: "Mode admin activé",
        description: "Vous avez maintenant accès aux fonctionnalités d'administration",
      });
    } else {
      localStorage.removeItem('dev_admin_bypass');
      toast({
        title: "Mode admin désactivé",
        description: "Accès administrateur désactivé",
      });
    }
    
    // Recharger la page pour appliquer les changements
    window.location.reload();
  };

  // Ne rendre le composant qu'en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Button
      variant={isAdminBypass ? "destructive" : "outline"}
      size="sm"
      className="fixed bottom-4 right-4 z-50"
      onClick={toggleAdminBypass}
    >
      {isAdminBypass ? (
        <>
          <ShieldOff className="mr-2 h-4 w-4" />
          Désactiver Admin
        </>
      ) : (
        <>
          <Shield className="mr-2 h-4 w-4" />
          Activer Admin
        </>
      )}
    </Button>
  );
}
