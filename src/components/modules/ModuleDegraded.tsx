
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ModuleDegradedProps {
  moduleCode: string;
}

export function ModuleDegraded({ moduleCode }: ModuleDegradedProps) {
  return (
    <div className="mb-4">
      <Alert variant="default" className="bg-amber-50 text-amber-700 border-amber-300">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Fonctionnement dégradé</AlertTitle>
        <AlertDescription>
          Le module <strong>{moduleCode}</strong> fonctionne actuellement en mode dégradé.
        </AlertDescription>
      </Alert>
    </div>
  );
}
