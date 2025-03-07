
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Page non trouvée</h1>
        <p className="text-gray-600 mb-6">
          La page <span className="font-semibold">{location.pathname}</span> n'existe pas ou a été déplacée.
        </p>
        <div className="space-y-2">
          <Button asChild className="w-full bg-primary">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/explore">Explorer</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
